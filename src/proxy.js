import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ["/login"];

export async function proxy(request) {
  let response = NextResponse.next({ request });

  // Se crea un cliente nuevo en cada petición para evitar compartir estado entre usuarios
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANTE: No colocar código pesado entre createServerClient y auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  // Si no hay sesión y la ruta es protegida → redirigir a /login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si ya hay sesión y entra a /login → redirigir al inicio
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // IMPORTANTE: Retornar siempre response para mantener las cookies sincronizadas
  return response;
}

export const config = {
  matcher: [
    // Excluye _next/static, _next/image, favicon.ico, imágenes públicas y sw.js
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|sw\\.js).*)",
  ],
};

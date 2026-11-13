import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// Rutas públicas que no requieren autenticación
const PUBLIC_PATHS = ['/login']

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request })

  // Se crea un cliente nuevo en cada petición para evitar compartir estado entre usuarios
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          supabaseResponse = NextResponse.next({ request })

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: No colocar código pesado entre createServerClient y auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Protección de rutas: redirige a /login si no hay sesión activa
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si ya tiene sesión y va a /login, redirigir a inicio
  if (user && pathname === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // IMPORTANTE: Retornar siempre supabaseResponse para mantener las cookies sincronizadas
  return supabaseResponse
}

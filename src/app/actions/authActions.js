"use server";

import { redirect } from "next/navigation";
import { createClient } from "../lib/supServer";

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Error en login de Supabase:", error.message);
    return { error: error.message || "Correo o contraseña incorrectos" };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

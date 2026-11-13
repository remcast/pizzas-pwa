"use server";

import { createClient } from "../lib/supServer";
import { revalidatePath } from "next/cache";

export async function getProductos() {
  const supabase = await createClient();

  const { data: productos, error } = await supabase
    .from("productos")
    .select("id, nombre, descripcion, precio, imagen");

  if (error) {
    console.error("Error al obtener los productos:", error.message);
    return [];
  }

  return productos;
}

export async function eliminarProducto(id) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: error.message };
  }

  if (!data || data.length === 0) {
    return { error: "No se eliminó nada. Revisa la política DELETE en Supabase." };
  }

  revalidatePath("/producto");
  return { error: null };
}
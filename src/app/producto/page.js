import TarjetaProducto from "../componentes/tarjetaProducto";
import { getProductos } from "../actions/productosActions";

export default async function ProductoPage() {
  const productos = await getProductos();

  return (
    <section className="w-full md:max-w-6xl mx-auto">
      <h1 className="p-6 pt-10  text-3xl uppercase font-bold text-center">PIZZAS DISPONIBLES...</h1>
      <div className="grid grid-cols-1 md:grid-cols-3  gap-4 p-4">
        {productos.map((pr, index) => (
          <TarjetaProducto
            key={pr.id}
            producto={pr}
            loading={index < 3 ? "eager" : "lazy"}
          />
        ))}
      </div>
    </section>
  );
}
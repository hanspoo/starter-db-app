import { IProducto } from '@flash-ws/api-interfaces';

export function Producto3d({ p }: { p: IProducto }) {
  let volumen = 1;
  const { largo, ancho, alto } = p.box;

  if (p) volumen = (largo * ancho * alto) / 1000;

  return (
    <div
      title={`${volumen} cm3`}
      className="caja"
      style={{
        backgroundColor: volumen === 1 ? 'red' : `rgb(0,${p.peso / 50},0)`,
        width: volumen,
        height: volumen,
      }}
    ></div>
  );
}

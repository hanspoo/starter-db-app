import {
  BodyCambioEstadoProdConsolidada,
  EstadoLinea,
} from '@flash-ws/api-interfaces';
import { IProducto } from '@flash-ws/api-interfaces';
import { Button, Spin } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { estados, colores } from '../front-utils';
import { useHttpClient } from '../useHttpClient';
import { IILineaDetalle, ILineaConsolidada } from './datos';

type PropsEstadoIProducto = {
  actual: EstadoLinea;
  estado: EstadoLinea;
  producto: IProducto;
  ordenID: string;
  editar: boolean;
  linea: ILineaConsolidada;
  actualizar: (lineas: any) => void;
};
export function EstadoProducto({
  editar = true,
  estado,
  producto,
  actualizar,
  ordenID,
  actual,
  linea,
}: PropsEstadoIProducto) {
  const httpClient = useHttpClient()
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState('');

  const onCambiarEstado = () => {
    console.log('onCambiarEstado EstadoProducto');
    setActualizando(true);
    const postBody: BodyCambioEstadoProdConsolidada = {
      productos: [producto.id],
      estado: estado,
    };
    httpClient
      .post<Array<ILineaConsolidada>>(
        `${process.env['NX_SERVER_URL']}/api/ordenes/cambiar-estado-consolidada/${ordenID}`,
        postBody
      )
      .then((response) => {
        setActualizando(false);
        actualizar(response.data);
      })
      .catch((error) => {
        console.log(error);
        setActualizando(false);
      });
  };

  if (actualizando) return <Spin />;
  if (error) return <p>{error}</p>;

  if (!editar) {
    let color = colores[estado];
    if (estado === EstadoLinea.Multiple && !todasFinales(linea.lineas))
      color = 'red';
    return React.createElement(estados[estado], {
      style: { color },
    });
  }

  return (
    <Button
      shape="default"
      title={estado}
      type={estado === actual ? 'primary' : 'default'}
      onClick={() =>
        estado === EstadoLinea.Multiple
          ? console.log('no se puede clickear')
          : onCambiarEstado()
      }
      style={{ marginRight: '0.5em' }}
      icon={React.createElement(estados[estado])}
    />
  );
}
function todasFinales(lineas: IILineaDetalle[]): boolean {
  return (
    lineas.filter(
      (linea) =>
        linea.estado === EstadoLinea.Aprobada ||
        linea.estado === EstadoLinea.Rechazada
    ).length === lineas.length
  );
}

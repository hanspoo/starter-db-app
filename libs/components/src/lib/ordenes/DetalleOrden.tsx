import { IOrdenCompra, ISuperOrden } from '@flash-ws/api-interfaces';
import { actualizarOrden } from '@flash-ws/reductor';
import { capitalize } from '@flash-ws/shared';
import { Descriptions, Menu, Spin, Typography } from 'antd';

import { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GraficoAvance from '../grafico-avance/grafico-avance';
import { SuperConsolidada } from '../new-consolidada/SuperConsolidada';
import PalletsGenerator from '../pallets-generator/pallets-generator';
import { useHttpClient } from '../useHttpClient';
import { OrdenContext } from './OrdenContext';

import TablaLineas from './TablaLineas';

const { Title } = Typography;
type PropsDetalleOrden = {
  id: string;
};

enum Vista {
  CONSOLIDADA = 'CONSOLIDADA',
  NORMAL = 'NORMAL',
  PALLETS = 'PALLETS',
}

export function DetalleOrden({ id }: PropsDetalleOrden) {
  const httpClient = useHttpClient();
  const dispatch = useDispatch();
  const orden: any = useSelector((state: any) =>
    state.counter.ordenes.find((o: any) => o.id === id)
  );
  const [vista, setVista] = useState<Vista>(Vista.CONSOLIDADA);
  // const [orden, setOrden] = useState<IOrdenCompra>();
  const [loading, setLoading] = useState(false);
  const [recargar, setRecargar] = useState<boolean>();
  const [error, setError] = useState('');

  // const [search, setSearch] = useState<RegExp>();
  // const [selected, setSelected] = useState<Array<number>>();
  // const [data, setData] = useState<Array<IOrdenCompra>>();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    httpClient
      .get<IOrdenCompra>(`${process.env['NX_SERVER_URL']}/api/ordenes/${id}`)
      .then((response) => {
        dispatch(actualizarOrden(response.data));
        // Agrega delay para esperar a que se refresque redux
        setTimeout(() => setLoading(false), 2000);
      })
      .catch((error) => {
        setError(`Error: ${JSON.stringify(error)}`);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Spin />;
  if (error) return <p>Error: {error}</p>;

  if (!orden) return <Spin />;
  console.log('orden', orden);

  return (
    <OrdenContext.Provider value={orden}>
      <Title level={4}>Detalle de Orden</Title>
      <Descriptions
        bordered
        column={2}
        style={{ marginBottom: '1em' }}
        labelStyle={{ width: '1em' }}
      >
        <Descriptions.Item label="Id">{orden.id}</Descriptions.Item>
        <Descriptions.Item label="Número">{orden.numero}</Descriptions.Item>
        <Descriptions.Item label="Emision">{orden.emision}</Descriptions.Item>
        <Descriptions.Item label="Entrega">{orden.entrega}</Descriptions.Item>
        <Descriptions.Item label="Unidad">
          {orden.unidad?.nombre}
        </Descriptions.Item>
        <Descriptions.Item label="IPedido">
          {orden.pedido?.id}
        </Descriptions.Item>
      </Descriptions>

      <Menu
        style={{ marginBottom: '1em' }}
        mode="horizontal"
        onSelect={(s: any) => {
          setVista(s.key);
        }}
        items={Object.keys(Vista).map((x) => {
          const v = x as unknown as Vista;
          return { label: capitalize(v), key: v };
        })}
      />
      {recargar && <p>Espere...</p>}

      {!recargar && vista === Vista.NORMAL && (
        <TablaLineas
          // lineas={orden.lineas}
          orden={orden}
          recargar={(o) => {
            dispatch(actualizarOrden(o));

            // setOrden(orden);
            // setRecargar(true);
            // setTimeout(() => setRecargar(false), 2000);
          }}
        />
      )}
      {!recargar && vista === Vista.CONSOLIDADA && (
        <span>
          <GraficoAvance orden={orden as ISuperOrden} />
          <SuperConsolidada orden={orden as ISuperOrden} />
        </span>
      )}
      {!recargar && vista === Vista.PALLETS && (
        <span>
          <PalletsGenerator orden={orden} />
        </span>
      )}
    </OrdenContext.Provider>
  );
}

function cap(s: string) {
  return s.substring(0, 1) + s.substring(1).toLocaleLowerCase();
}

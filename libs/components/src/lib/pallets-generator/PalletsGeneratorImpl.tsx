import {
  BodyGenPallets,
  EstadoLinea,
  ILineaDetalle,
  ILocal,
  IPalletConsolidado,
} from '@flash-ws/api-interfaces';
import { Button, Spin, Table } from 'antd';
import { useState } from 'react';
import { GenPalletsOptions } from '../gen-pallets-options/gen-pallets-options';
import styles from './pallets-generator.module.css';
import { useLocal } from './useLocal';
import {
  PalletsGeneratorImplProps,
  PorLocal,
  LocalEntry,
  OpcionesGenPallets,
} from './pallets-generator';
import Title from 'antd/lib/typography/Title';
import { useHttpClient } from '../useHttpClient';
import { OrdenContext } from '../ordenes/OrdenContext';

enum StateMachine {
  NO_EJECUTADA,
  EJECUTANDO,
  EJECUTADA,
}
export function PalletsGeneratorImpl({
  orden,
  setPallets,
}: PalletsGeneratorImplProps) {
  const httpClient = useHttpClient()
  const [generacion, setGeneracion] = useState<StateMachine>(
    StateMachine.NO_EJECUTADA
  );
  const [errorGenerando, setErrorGenerando] = useState('');
  const [localPallets, setLocalPallets] = useState<IPalletConsolidado[]>([]);
  const aprobadas = orden.lineas.filter(
    (linea) => linea.estado === EstadoLinea.Aprobada
  );
  const [loading, lineas] = useLocal(aprobadas);
  if (loading) return <p>Cargando...</p>;
  if (!lineas) return <p>Error..</p>;

  const INIT: PorLocal = [];
  const porLocal: PorLocal = lineas.reduce((acc, iter) => {
    const ele = acc.find((rec) => rec.local.id === iter.localId);
    if (ele) {
      ele.lineas.push(iter);
    } else {
      acc.push({ local: iter.local, lineas: [iter] });
    }
    return acc;
  }, INIT);
  const ordenadas = porLocal.sort((a, b) =>
    a.local.nombre.toLowerCase().localeCompare(b.local.nombre.toLowerCase())
  );

  const columns = [
    {
      title: 'Local',
      dataIndex: 'local',
      key: 'nombre',

      render: (local: ILocal) => local.nombre,
      sorter: (a: LocalEntry, b: LocalEntry) => {
        return a.local.nombre
          .toLocaleLowerCase()
          .localeCompare(b.local.nombre.toLocaleLowerCase());
      },
    },
    {
      title: 'Productos',
      dataIndex: 'lineas',
      align: 'right' as any,
      width: '5em',
      render: (lineas: Array<ILineaDetalle>) => lineas.length,
      sorter: (a: LocalEntry, b: LocalEntry) => {
        return a.lineas.length - b.lineas.length;
      },
    },
  ];

  function genPallets({ distribuir, nextHU, ordenar, protoID }: OpcionesGenPallets) {
    if (!protoID)
      throw Error("Falta el palletID")

    setGeneracion(StateMachine.EJECUTANDO);
    const args: BodyGenPallets = {
      protoID,
      nextHU,
      ordenar,
      distribuir,
    };
    httpClient
      .post<IPalletConsolidado[]>(
        `${process.env['NX_SERVER_URL']}/api/ordenes/${orden.id}/gen-pallets`,
        args
      )
      .then((response: any) => {
        setLocalPallets(response.data);
        setGeneracion(StateMachine.EJECUTADA);
      })
      .catch((error: any) => {
        setErrorGenerando(error.message);
        setGeneracion(StateMachine.EJECUTADA);
      });
  }

  if (errorGenerando) return <p>{errorGenerando}</p>;
  if (generacion === StateMachine.EJECUTADA) {
    return (
      <>
        <p>
          La generación ha finalizado exitosamente. Se han creado{' '}
          {localPallets.length} pallets.
        </p>
        <Button type="primary" onClick={() => setPallets(localPallets)}>
          Continuar
        </Button>
      </>
    );
  }

  const numProductos = aprobadas.reduce((acc, iter) => {
    return acc + iter.cantidad;
  }, 0);
  return (
    <div className={styles['container']}>
      <Title style={{ marginTop: '1.5em' }} level={5}>
        Generar Pallets
      </Title>
      <p>
        Se generará la distribución en pallets por local para todos los
        productos aprobados en <b>{ordenadas.length}</b> locales,{' '}
        <b>{numProductos}</b> cajas.
      </p>
      {generacion === StateMachine.EJECUTANDO && <Spin />}

      {generacion === StateMachine.NO_EJECUTADA && (
        <div>
          <p>
            <b>Importante</b>: Se borrarán los pallets existentes
          </p>

          <OrdenContext.Consumer>{orden => <GenPalletsOptions orden={orden!} genPallets={genPallets} />}</OrdenContext.Consumer>

          <Title style={{ marginTop: '1.5em' }} level={4}>
            Productos aprobados por local
          </Title>
          <Table
            dataSource={ordenadas}
            columns={columns}
            pagination={{ pageSize: 10000 }}
          />
        </div>
      )}
    </div>
  );
}

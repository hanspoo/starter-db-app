import { IOrdenConsolidada, IProducto } from '@flash-ws/api-interfaces';
import { RootState } from '@flash-ws/reductor';
import { Button, Spin, Table, Input } from 'antd';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { formatNumber } from '../front-utils';

import { useHttpClient } from '../useHttpClient';

import styles from './ordenes-consolidadas.module.css';

/* eslint-disable-next-line */
export interface OrdenesConsolidadasProps {
  vistaDetalle: (id: string) => void;
  recargar: () => void;
}

const { Search } = Input;

export function OrdenesConsolidadas(props: OrdenesConsolidadasProps) {

  const productos = useSelector((state: RootState) => state.productos.productos)


  const httpClient = useHttpClient()
  const [error, setError] = useState('');
  const [borradas, setBorradas] = useState(false);
  const [selected, setSelected] = useState<Array<string>>();
  const [search, setSearch] = useState<RegExp>();
  const [loading, setLoading] = useState(true);
  const [ordenes, setOrdenes] = useState<Array<IOrdenConsolidada>>();

  useEffect(() => {
    httpClient
      .get(`${process.env['NX_SERVER_URL']}/api/ordenes/consolidadas`)
      .then((res) => {
        setOrdenes(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });

  }, []);


  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) => {
        return a.id.localeCompare(b.id);
      },
      render: (id: string) => {
        return (
          <Button onClick={() => props.vistaDetalle(id)} type="link">
            {id}
          </Button>
        );
      },
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) =>
        a.cliente.localeCompare(b.cliente),
    },
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) =>
        a.unidad.localeCompare(b.unidad),
    },
    {
      title: 'Número',
      dataIndex: 'numero',
      align: 'right' as const,
      render: (numero: number) => {
        return formatNumber(numero);
      },

      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) =>
        a.numero.localeCompare(b.numero),
    },
    {
      title: 'Emisión',
      dataIndex: 'emision',
      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) =>
        a.emision.localeCompare(b.emision),
    },
    {
      title: 'Entrega',
      dataIndex: 'entrega',
      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) =>
        a.entrega.localeCompare(b.entrega),
    },
    {
      title: '#Productos',
      dataIndex: 'cajas',
      align: 'right' as const,
      render: (cajas: number) => {
        return formatNumber(cajas);
      },

      sorter: (a: IOrdenConsolidada, b: IOrdenConsolidada) => a.cajas - b.cajas,
    },
  ];

  function onSearch(e: any) {
    const regex = new RegExp(e.target.value, 'i');
    setSearch(regex);
  }

  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: IOrdenConsolidada[]) => {
      setSelected(selectedRowKeys);
    },
  };
  async function borrarSeleccionadas() {
    if (!selected) return;
    // setBorrando(true);
    const promesas = selected.map((id) =>
      httpClient.delete(`${process.env['NX_SERVER_URL']}/api/ordenes/${id}`)
    );
    await Promise.all(promesas);

    // selected?.forEach((id) => {
    //   axios
    //     .delete(`${process.env['NX_SERVER_URL']}/api/ordenes/${id}`)
    //     .then((response) => console.log(`Orden ${id} eliminada`))
    //     .catch((error) => console.log(error));
    // });
    // setOrdenes(ordenes?.filter((o) => selected?.find((id) => id !== o.id)));
    props.recargar();
    // setTimeout(() => setBorradas(false), 5000);
  }

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;
  if (!ordenes) return <p>Error grave</p>;
  if (!productos || productos.length === 0)
    return <p>Para comenzar cargue su base de datos de productos.</p>

  return (
    <div className={styles['container']}>
      <p>
        {ordenes.length === 1 ? 'hay 1 orden' : `hay ${ordenes.length} ordenes`}
      </p>
      <Search
        style={{ marginBottom: '0.5em' }}
        placeholder="buscar..."
        onKeyUp={onSearch}
        enterButton
      />

      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        rowKey={(record: IOrdenConsolidada) => record.id}
        dataSource={ordenes}
        columns={columns}
        pagination={{ defaultPageSize: 1000 }}
      />
      <Button onClick={borrarSeleccionadas} disabled={selected?.length === 0}>
        Borrar seleccionadas
      </Button>
    </div>
  );
}

export default OrdenesConsolidadas;

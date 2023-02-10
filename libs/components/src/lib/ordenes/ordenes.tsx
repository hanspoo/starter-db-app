import { Button, Input, Typography } from 'antd';

import {
  IOrdenCompra,
  IProducto,
  IUnidadNegocio,
} from '@flash-ws/api-interfaces';
import { useSelector } from 'react-redux';
import { Spin, Table } from 'antd';

import styles from './ordenes.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { UploadOrden } from '../upload-orden/upload-orden';
import { DetalleOrden } from './DetalleOrden';
import { formatNumber } from '../front-utils';
import OrdenesConsolidadas from '../ordenes-consolidadas/ordenes-consolidadas';

const { Title } = Typography;

/* eslint-disable-next-line */
export interface OrdenesProps { }

enum Vista {
  Listado,
  Subir,
  Detalle,
}

export function Ordenes(props: OrdenesProps) {
  const [search, setSearch] = useState<RegExp>();
  const [data, setData] = useState<Array<IProducto>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;

  if (!data) return <p>Internal error</p>;
  if (data.length === 0) return <p>Debe cargar los productos primero</p>;

  return <OrdenesImpl />;
}
export function OrdenesImpl(props: OrdenesProps) {
  const [vista, setVista] = useState(Vista.Listado);
  const [orden, setOrden] = useState<string>();

  function vistaDetalle(id: string) {
    setOrden(id);
    setVista(Vista.Detalle);
  }

  return (
    <div className={styles['container']}>
      <Title level={2}>Ordenes</Title>
      <div style={{ float: 'right', position: 'relative', top: '-24px' }}>
        <Button onClick={() => setVista(Vista.Subir)}>Subir planilla</Button>
        <Button onClick={() => setVista(Vista.Listado)}>Listado</Button>
      </div>
      {vista === Vista.Listado && (
        <OrdenesConsolidadas
          vistaDetalle={vistaDetalle}
          recargar={() => console.log('clicked')}
        />
      )}
      {vista === Vista.Subir && <UploadOrden />}
      {vista === Vista.Detalle && orden && <DetalleOrden id={orden} />}
    </div>
  );
}

type ListadoProps = {
  vistaDetalle: (id: string) => void;
};

function ListadoOrdenes(props: ListadoProps) {
  const ordenes: Array<IOrdenCompra> = useSelector(
    (state: any) => state.counter.ordenes as Array<IOrdenCompra>
  );
  const [search, setSearch] = useState<RegExp>();
  const [selected, setSelected] = useState<Array<number>>();
  // const [data, setData] = useState<Array<IOrdenCompra>>();
  const [loading, setLoading] = useState(false);

  if (loading) return <Spin />;

  if (!ordenes) return <p>Error, no se han cargado las ordenes en el cache</p>;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: IOrdenCompra, b: IOrdenCompra) => {
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
      title: 'Numero',
      dataIndex: 'numero',
      sorter: (a: IOrdenCompra, b: IOrdenCompra) => {
        return a.numero.localeCompare(b.numero);
      },
      render: (numero: number, orden: IOrdenCompra) => {
        return (
          <Button onClick={() => props.vistaDetalle(orden.id)} type="link">
            {numero}
          </Button>
        );
      },
    },
    {
      title: 'Emision',
      dataIndex: 'emision',
      sorter: (a: IOrdenCompra, b: IOrdenCompra) => {
        return a.emision.localeCompare(b.emision);
      },
    },
    {
      title: 'Entrega',
      dataIndex: 'entrega',
      sorter: (a: IOrdenCompra, b: IOrdenCompra) => {
        return a.entrega.localeCompare(b.entrega);
      },
    },
    {
      title: 'Unidad',
      dataIndex: 'unidad',
      render: (unidad: IUnidadNegocio) => unidad.nombre,
    },
    {
      title: '#Productos',
      dataIndex: 'unidad',
      align: 'right' as const,
      render: (unidad: IUnidadNegocio, orden: IOrdenCompra) => {
        return formatNumber(orden.lineas.length);
      },
    }
  ];
  function onSearch(e: any) {
    const regex = new RegExp(e.target.value, 'i');
    setSearch(regex);
  }

  const filtradas = search
    ? ordenes.filter((prod) => search.test(prod.unidad.nombre))
    : ordenes;
  const rowSelection = {
    onChange: (selectedRowKeys: any, selectedRows: IOrdenCompra[]) => {
      setSelected(selectedRowKeys);
    },
  };

  function borrarSeleccionadas() {
    selected?.forEach((id) => {
      axios
        .delete(`${process.env['NX_SERVER_URL']}/api/ordenes/${id}`)
        .then((response) => console.log(`Orden ${id} eliminada`))
        .catch((error) => console.log(error));
    });
  }

  return (
    <div className={styles['container']}>
      <p>
        {filtradas.length === 1
          ? 'hay 1 orden'
          : `hay ${filtradas.length} ordenes`}
      </p>
      <Input.Search
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
        rowKey={(record: IOrdenCompra) => record.id}
        dataSource={filtradas}
        columns={columns}
        pagination={{ defaultPageSize: 1000 }}
      />
      <Button onClick={borrarSeleccionadas} disabled={selected?.length === 0}>
        Borrar Seleccionadas
      </Button>
    </div>
  );
}

export default Ordenes;

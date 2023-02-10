import { Typography } from 'antd';

import { Table } from 'antd';

import { useState } from 'react';
import Search from 'antd/lib/input/Search';
import { LineaParaReact } from './LineaParaReact';

const { Title } = Typography;

const columns = [
  {
    title: 'Cantidad',
    dataIndex: 'cantidad',
    key: 'id',
    sorter: (a: LineaParaReact, b: LineaParaReact) => {
      return a.cantidad - b.cantidad;
    },
  },
];

/* eslint-disable-next-line */
export interface LineasDetalleProps {
  lineas: Array<LineaParaReact>;
}

export function LineasDetalle({ lineas }: LineasDetalleProps) {
  const [search, setSearch] = useState<RegExp>();
  if (!lineas) return <p>Error, no hay líneas de detalle</p>;

  function onSearch(e: any) {
    const regex = new RegExp(e.target.value, 'i');
    setSearch(regex);
  }

  return (
    <div>
      <Title level={2}>Lineas de detalle</Title>
      <p>Hay {lineas.length} lineas</p>
      <Search
        style={{ marginBottom: '0.5em' }}
        placeholder="buscar..."
        onKeyUp={onSearch}
        enterButton
      />
      <Table
        dataSource={lineas}
        columns={columns}
        pagination={{ defaultPageSize: 1000 }}
      />
      ;
    </div>
  );
}

export default LineasDetalle;

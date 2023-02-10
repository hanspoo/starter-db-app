import { ICajaConsolidada } from '@flash-ws/api-interfaces';
import { Table } from 'antd';
import styles from './lista-cajas-pallet.module.css';

/* eslint-disable-next-line */
export interface ListaCajasPalletProps {
  cajas: Array<ICajaConsolidada>;
}

export function ListaCajasPallet({ cajas }: ListaCajasPalletProps) {
  const columns = [
    {
      title: 'Vol',
      dataIndex: 'alto',
      width: '4em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) => {
        const v1 = (a.largo * a.ancho * a.alto) / 2000;
        const v2 = (b.largo * b.ancho * b.alto) / 2000;
        return v1 - v2;
      },
      render: (alto: number, a: ICajaConsolidada) => {
        const opacity = a.peso / 10000;
        const backgroundColor = `rgba(9,56,100,${opacity})`;
        const v = (a.largo * a.ancho * a.alto) / 2000;
        return (
          <div
            style={{
              width: `${v}px`,
              height: `${v}px`,
              backgroundColor,
            }}
          ></div>
        );
      },
    },
    {
      title: 'producto',
      dataIndex: 'producto',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) =>
        a.producto.localeCompare(b.producto),
    },
    {
      title: 'codigo',
      dataIndex: 'codigo',
      width: '8em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) =>
        a.codigo.localeCompare(b.codigo),
    },
    {
      title: 'codcenco',
      dataIndex: 'codcenco',
      width: '8em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) =>
        a.codcenco.localeCompare(b.codcenco),
    },

    {
      title: 'largo',
      dataIndex: 'largo',
      width: '4em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) => a.largo - b.largo,
    },
    {
      title: 'ancho',
      dataIndex: 'ancho',
      width: '4em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) => a.ancho - b.ancho,
    },
    {
      title: 'alto',
      dataIndex: 'alto',
      width: '4em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) => a.alto - b.alto,
    },
    {
      title: 'peso',
      dataIndex: 'peso',
      width: '4em',
      sorter: (a: ICajaConsolidada, b: ICajaConsolidada) => a.peso - b.peso,
      render: (peso: number) => `${(peso / 1000).toFixed(1)} kg`,
    },
  ];

  return (
    <div className={styles['container']}>
      <Table
        bordered
        size="small"
        dataSource={cajas}
        columns={columns}
        pagination={{ defaultPageSize: 1000 }}
      />
    </div>
  );
}

export default ListaCajasPallet;

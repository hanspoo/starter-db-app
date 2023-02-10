import { EstadoLinea, ISuperOrden } from '@flash-ws/api-interfaces';
import {
  ILineaDetalle,
  ILocal,
  IOrdenCompra,
  IProducto,
} from '@flash-ws/api-interfaces';
import { actualizarOrden, RootState } from '@flash-ws/reductor';
import { Checkbox, Col, Input, Modal, Row, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber } from '../front-utils';

import { EstadoUnitario } from './EstadoUnitario';

const { Title } = Typography;

export type ModalLineaConsolidadaProps = {
  productoID: number;
  orden: IOrdenCompra;
  cerrar: () => void;
  actualizarConsolidada: () => void;
  editar: boolean;
};
export function ModalLineaConsolidada({
  productoID,
  orden,
  cerrar,
  actualizarConsolidada,
}: ModalLineaConsolidadaProps) {
  const dispatch = useDispatch();
  const [producto, setIProducto] = useState<IProducto>();
  const [data, setData] = useState<Array<ILineaDetalle>>();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>('');
  const [editar, setEditar] = useState(false);
  const productos = useSelector((state: RootState) => state.productos.productos)
  const locales = useSelector((state: RootState) => state.localesSlice.locales)

  function findProd(id: number): IProducto | undefined {
    return productos!.find((p: IProducto) => p.id === id);
  }

  function findLocal(id: number): ILocal | undefined {
    return locales!.find((p: ILocal) => p.id === id);
  }

  useEffect(() => {

    const hidratadas = orden?.lineas
      .filter((linea) => linea.productoId === productoID)
      .map((linea) => {
        const producto = linea.productoId
          ? findProd(linea.productoId)
          : undefined;
        const local = linea.localId ? findLocal(linea.localId) : undefined;
        if (!(producto && local)) throw Error(`producto: ${linea.productoId} o local: ${linea.localId} no encontrado`);
        return {
          ...linea,
          producto,
          local,
        };
      });

    setData(
      hidratadas.sort((a, b) => a.local.nombre.localeCompare(b.local.nombre))
    );
    setLoading(false);
    setIProducto(findProd(productoID));
  }, [orden?.lineas, productoID]);

  if (loading) return <p>Cargando...</p>;

  function actualizarLineas(orden: ISuperOrden) {
    dispatch(actualizarOrden(orden));
    // actualizarConsolidada();
  }

  const columns = [
    {
      title: 'ILocal',
      dataIndex: 'local',
      filteredValue: [search],
      onFilter: (value: string, record: ILineaDetalle) => {
        if (!value) return true;

        const regex = new RegExp(value, 'i');
        return regex.test(record.local?.nombre);
      },
      sorter: (a: ILineaDetalle, b: ILineaDetalle) => {
        return a.local.nombre.localeCompare(b.local.nombre);
      },

      render: (p: ILocal) => {
        return p ? p.nombre : 'No encontrado';
      },
    },

    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      width: '10em',
      sorter: (a: ILineaDetalle, b: ILineaDetalle) => {
        return a.cantidad - b.cantidad;
      },
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: `${editar ? 18 : 4}em`,
      render: (estado: string, linea: ILineaDetalle) => {
        if (!editar)
          return (
            <EstadoUnitario
              editar={false}
              actual={estado as EstadoLinea}
              actualizar={actualizarLineas}
              estado={estado as EstadoLinea}
              lineaID={linea.id}
              ordenID={orden.id}
            />
          );
        return (
          <>
            {Object.keys(EstadoLinea).map((est) => (
              <EstadoUnitario
                editar={true}
                actual={estado as EstadoLinea}
                actualizar={actualizarLineas}
                estado={est as EstadoLinea}
                lineaID={linea.id}
                ordenID={orden.id}
              />
            ))}
          </>
        );
      },
      sorter: (a: ILineaDetalle, b: ILineaDetalle) => {
        return a.estado.localeCompare(b.estado);
      },
    },
  ];

  return (
    <Modal
      title={<Title level={3}>{producto?.nombre}</Title>}
      open={true}
      onCancel={cerrar}
      onOk={cerrar}
      width="75%"
    >
      <>
        <Row style={{ marginBottom: '0.5em' }}>
          <Col
            span={8}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            hay {formatNumber(data?.length)} items
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Checkbox onChange={() => setEditar(!editar)}>Editar</Checkbox>
          </Col>
        </Row>
        <Input
          style={{ width: '100%', marginBottom: '1.25em' }}
          placeholder="buscar..."
          allowClear
          onChange={(e: any) => {
            console.log(typeof e.target.value, e.target.value);

            setSearch(e.target.value);
          }}
        />

        <Table
          id="lineas"
          rowKey={(linea: ILineaDetalle) => linea.id}
          className="lineas"
          dataSource={data}
          columns={columns as any}
          pagination={{ defaultPageSize: 100 }}
        />
      </>
    </Modal>
  );
}

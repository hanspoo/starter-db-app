import { EstadoLinea, ISuperOrden } from '@flash-ws/api-interfaces';
import { Totales } from '@flash-ws/shared';
import { Col, Row, Typography } from 'antd';
import { coloresFondo } from '../front-utils';

export interface AvanceEstadoConsolidadaProps {
  orden: ISuperOrden;
  onChange: (s: EstadoLinea | undefined) => void;
  estado?: EstadoLinea;
}

export function AvanceEstadoConsolidada({
  estado,
  orden,
  onChange,
}: AvanceEstadoConsolidadaProps) {
  const totales = new Totales(orden);
  totales.calcular();
  const mapa = totales.porEstadoConsolidada;
  const data = Object.keys(mapa).map((k) => {
    const key = k as EstadoLinea;
    return { estado: k, valor: mapa[key], color: 'orange' };
  });

  return (
    <Row style={{ marginBottom: '1em', justifyContent: 'center' }}>
      <Col
        span={1}
        onClick={() => onChange(undefined)}
        style={{
          cursor: 'pointer',
          padding: '1em',
          backgroundColor: '#ccc',
          textAlign: 'center',
        }}
      >All</Col>
      {data.map((iter) => {
        const e = iter.estado as EstadoLinea;
        return (
          <Col
            key={e}
            span={4}
            onClick={() => onChange(e)}
            style={{
              border: e === estado ? 'solid 4px gray' : '',
              cursor: 'pointer',
              padding: '1em',
              backgroundColor: coloresFondo[iter.estado],
              textAlign: 'center',
            }}
          >
            <Typography.Title level={5}>{iter.estado}</Typography.Title>
            <div style={{ padding: '1em' }}>{iter.valor}</div>
          </Col>
        );
      })}
    </Row>
  );
}

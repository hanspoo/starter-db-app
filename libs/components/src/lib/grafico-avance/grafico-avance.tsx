import { EstadoLinea, ISuperOrden } from '@flash-ws/api-interfaces';
import { Totales } from '@flash-ws/shared';
import { colores } from '../front-utils';
import styles from './grafico-avance.module.css';
import ProgressBar from './ProgressBar';

/* eslint-disable-next-line */
export interface GraficoAvanceProps {
  orden: ISuperOrden;
}

export function GraficoAvance({ orden }: GraficoAvanceProps) {
  const totales = new Totales(orden);
  totales.calcular();

  return (
    <div style={{ marginBottom: '1em' }}>
      <ProgressBar
        bgcolor="#1890ff"
        progress={parseInt(totales.avance + '')}
        height={'30'}
      />
    </div>
  );
}

export default GraficoAvance;

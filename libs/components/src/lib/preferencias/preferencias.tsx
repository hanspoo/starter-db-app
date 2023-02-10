
import { Typography } from 'antd';
import CamposMapper from '../campos-mapper/campos-mapper';
import ProtoPallets from '../proto-pallets/proto-pallets';
import styles from './preferencias.module.css';

const { Title } = Typography

/* eslint-disable-next-line */
export interface PreferenciasProps { }

export function Preferencias(props: PreferenciasProps) {
  return (
    <div className={styles['container']}>
      <Title level={2}>Preferencias</Title>
      <div style={{ marginBottom: '1em' }}>
        <ProtoPallets />
      </div>

      <CamposMapper />
    </div>
  );
}

export default Preferencias;

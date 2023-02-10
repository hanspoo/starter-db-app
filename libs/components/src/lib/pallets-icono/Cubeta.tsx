import { IPalletConsolidado } from '@flash-ws/api-interfaces';
import styles from './pallets-icono.module.css';
export type CubetaProps = {
  pallet: IPalletConsolidado;
};

export function Cubeta({ pallet: { peso, porcUso, numcajas } }: CubetaProps) {
  const opacity = peso / 50000;
  const backgroundColor = `rgba(9,56,100,${opacity})`;

  return (
    <div
      className={styles['pallet-box']}
      title={`${(peso / 1000).toFixed(2)} kgs / ${porcUso.toFixed(
        2
      )} vol / ${numcajas} cajas`}
    >
      <div
        style={{
          height: `${porcUso.toFixed(0)}px`,
          backgroundColor,
        }}
      ></div>
    </div>
  );
}

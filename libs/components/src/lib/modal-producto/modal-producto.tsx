import styles from './modal-producto.module.css';

/* eslint-disable-next-line */
export interface ModalIProductoProps {}

export function ModalIProducto(props: ModalIProductoProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ModalIProducto!</h1>
    </div>
  );
}

export default ModalIProducto;

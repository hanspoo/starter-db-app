import styles from './pallet-barcode.module.css';

/* eslint-disable-next-line */
export interface PalletBarcodeProps {}

export function PalletBarcode(props: PalletBarcodeProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to PalletBarcode!</h1>
    </div>
  );
}

export default PalletBarcode;

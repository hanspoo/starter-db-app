import { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { ICajaConsolidada, IPalletConsolidado } from '@flash-ws/api-interfaces';
import axios from 'axios';
import ListaCajasPallet from './lista-cajas-pallet';

type ContainerCajasPalletsProps = {
  pallet: IPalletConsolidado;
};
export function ContainerCajasPallets({ pallet }: ContainerCajasPalletsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<ICajaConsolidada[]>();

  useEffect(() => {
    const url = `${process.env['NX_SERVER_URL']}/api/pallets/${pallet.palletid}`;
    axios
      .get<ICajaConsolidada[]>(url)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [pallet]);

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;

  if (!data) return <p>Error interno al recuperar los datos</p>;

  return <ListaCajasPallet cajas={data} />;
}

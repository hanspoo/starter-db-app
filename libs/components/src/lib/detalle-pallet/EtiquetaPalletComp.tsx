import {
  EtiquetaPallet,
  IOrdenCompra,
  IPallet,
  IPalletConsolidado,
} from '@flash-ws/api-interfaces';
import { numericPart } from '@flash-ws/shared';
import { Spin, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Barcode from 'react-barcode';
import { useHttpClient } from '../useHttpClient';
const { Title } = Typography;

export function EtiquetaPalletComp({
  pallet,
  oc,
}: {
  pallet: IPalletConsolidado;
  oc: IOrdenCompra;
}) {
  const httpClient = useHttpClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ep, setEp] = useState<EtiquetaPallet>();
  useEffect(() => {
    httpClient
      .get(
        `${process.env['NX_SERVER_URL']}/api/ordenes/${oc.id}/pallets/${pallet.palletid}/epallet`
      )
      .then((response) => {
        setEp(response.data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [oc, pallet]);

  if (loading) return <Spin size="small" />;
  if (error) return <p>{error}</p>;
  if (!ep) return <p>Error al recuperar datos</p>;

  const value = numericPart(ep.identLegal) + ep.hu.toString().padStart(8, '0');
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Barcode format="CODE128" value={value} height={64} />
      <Title level={4} style={{ marginBottom: '0.25em' }}>
        {ep.vendedor}
      </Title>

      <div style={{ fontWeight: 'bold', fontSize: '1.2em', margin: 0 }}>
        {ep.local}
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em', margin: 0 }}>
        {ep.codLocal}
      </div>
    </div>
  );
}

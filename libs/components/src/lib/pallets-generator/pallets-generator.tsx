import { PrinterFilled } from '@ant-design/icons';
import {
  Distribuir,
  ILineaDetalle,
  ILocal,
  IOrdenCompra,
  IPalletConsolidado,
  Ordenar,
  TipoHU,
} from '@flash-ws/api-interfaces';
import { capitalize } from '@flash-ws/shared';

import { Button, Radio, Spin } from 'antd';
import { useEffect, useState } from 'react';
import PalletsIcono from '../pallets-icono/pallets-icono';
import Pallets from '../pallets/pallets';
import { useHttpClient } from '../useHttpClient';
import { PalletsGeneratorImpl } from './PalletsGeneratorImpl';

/* eslint-disable-next-line */
export interface PalletsGeneratorProps {
  orden: IOrdenCompra;
}

export interface OpcionesGenPallets {
  distribuir: Distribuir;
  ordenar: Ordenar;
  tipoHU: TipoHU;
  nextHU: number;
  protoID: number;
}
export type LocalEntry = {
  local: ILocal;
  lineas: ILineaDetalle[];
};

export type PorLocal = Array<LocalEntry>;
enum VistaPallets {
  ICONO = 'ICONO',
  TABLA = 'TABLA',
  // ARBOL = 'ARBOL',
}
export function PalletsGenerator({ orden }: PalletsGeneratorProps) {
  const [urlEtiquetas, setUrlEtiquetas] = useState<string>();
  const httpClient = useHttpClient();
  const [vistaPallets, setVistaPallets] = useState<VistaPallets>(
    VistaPallets.ICONO
  );
  const [loading, setLoading] = useState(true);
  const [mostrarGenerador, setMostrarGenerador] = useState(false);
  const [error, setError] = useState('');
  const [pallets, setPallets] = useState<IPalletConsolidado[]>();

  useEffect(() => {
    setLoading(true);
    const url = `${process.env['NX_SERVER_URL']}/api/ordenes/${orden.id}/pallets-cons`;
    httpClient
      .get<IPalletConsolidado[]>(url)
      .then((response) => {
        setPallets(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setLoading(false);
      });
  }, [orden]);

  if (loading) return <Spin />;
  if (error) return <p>{error}</p>;
  if (!pallets) return <p>Error interno al recuperar los pallets</p>;

  if (pallets.length === 0 || mostrarGenerador) {
    return (
      <PalletsGeneratorImpl
        orden={orden}
        setPallets={(pallets) => {
          setPallets(pallets || []);
          setMostrarGenerador(false);
        }}
      />
    );
  }

  function generarEtiquetas() {
    httpClient
      .get(`${process.env['NX_SERVER_URL']}/api/ordenes/${orden.id}/etiquetas`)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setUrlEtiquetas(url);
      })
      .catch((error) => console.log(error));
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5em', marginTop: '1.5em' }}>
        <SelectorVistaPallets vista={vistaPallets} setVista={setVistaPallets} />

        {/* {urlEtiquetas ? (
          <Button target="_blank" href={urlEtiquetas}>
            Descargar
          </Button>
        ) : (
          <Button onClick={generarEtiquetas}>Generar etiquetas</Button>
        )} */}
        <div style={{ float: 'right' }}>
          <Button
            target="_blank"
            icon={<PrinterFilled />}
            href={`${process.env['NX_SERVER_URL']}/api/files/${orden.id}/etiquetas`}
          >
            Etiquetas
          </Button>

          <Button onClick={() => setMostrarGenerador(true)}>
            Generar de nuevo
          </Button>
        </div>
      </div>

      {vistaPallets === VistaPallets.TABLA && <Pallets pallets={pallets} />}
      {vistaPallets === VistaPallets.ICONO && (
        <PalletsIcono pallets={pallets} oc={orden} />
      )}
    </div>
  );
}

export type PalletsGeneratorImplProps = {
  orden: IOrdenCompra;
  setPallets: (pallets: IPalletConsolidado[]) => void;
};
export default PalletsGenerator;

type SelectorVistaPalletsProps = {
  vista: VistaPallets;
  setVista: (vista: VistaPallets) => void;
};
function SelectorVistaPallets({ vista, setVista }: SelectorVistaPalletsProps) {
  return (
    <Radio.Group value={vista} onChange={(e) => setVista(e.target.value)}>
      {Object.keys(VistaPallets).map((v) => (
        <Radio.Button value={v}>{capitalize(v)}</Radio.Button>
      ))}
    </Radio.Group>
  );
}

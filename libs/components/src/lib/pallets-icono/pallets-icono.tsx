import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { IOrdenCompra, IPalletConsolidado } from '@flash-ws/api-interfaces';
import { capitalize } from '@flash-ws/shared';
import Barcode from 'react-barcode';

import { Row, Col, Radio, Modal } from 'antd';
import { useState } from 'react';
import { DetallePallet } from '../detalle-pallet/detalle-pallet';
import { Cubeta } from './Cubeta';

export interface PalletsIconoProps {
  pallets: IPalletConsolidado[];
  oc: IOrdenCompra;
}

enum CriteriosOrden {
  PESO = 'PESO',
  VOLUMEN = 'VOLUMEN',
  NUM_CAJAS = 'NUM_CAJAS',
}
enum Orden {
  ASC,
  DESC,
}

export function PalletsIcono({ pallets, oc }: PalletsIconoProps) {
  const [pallet, setPallet] = useState<IPalletConsolidado>();
  const [ordenarPor, setOrdenarPor] = useState<CriteriosOrden>();
  const [orden, setOrden] = useState<Orden>(Orden.ASC);

  const handleChange = (value: string) => {
    setOrdenarPor(value as CriteriosOrden);
  };
  const mostrarPallet = (pallet: IPalletConsolidado) => {
    setPallet(pallet);
  };

  const palletsOrdenados = ordenarPor
    ? ordenarPallets(pallets, ordenarPor, orden)
    : pallets;
  return (
    <div>
      {pallet && (
        <Modal
          title={`Pallet id ${pallet.palletid}`}
          open={!!pallet}
          width={1000}
          onOk={() => setPallet(undefined)}
          onCancel={() => setPallet(undefined)}
        >
          <DetallePallet pallet={pallet} oc={oc} />
        </Modal>
      )}

      <Row
        gutter={[16, 16]}
        style={{ marginBottom: '2em', backgroundColor: '#eee', padding: '4px' }}
      >
        <Col span="12">
          <span style={{ position: 'absolute', bottom: '5px' }}>
            Hay {pallets.length === 1 ? 'pallet' : 'pallets'}
          </span>
        </Col>
        <Col span="12" style={{ textAlign: 'right' }}>
          <label>Ordenar por </label>
          <Radio.Group
            value={ordenarPor}
            onChange={(e) => handleChange(e.target.value)}
          >
            {Object.keys(CriteriosOrden).map((v) => (
              <Radio.Button value={v} key={v}>
                {capitalize(v.replace('_', ' '))}
              </Radio.Button>
            ))}
          </Radio.Group>
          <Radio.Button onClick={() => setOrden(Orden.ASC)}>
            <ArrowUpOutlined />
          </Radio.Button>
          <Radio.Button onClick={() => setOrden(Orden.DESC)}>
            <ArrowDownOutlined />
          </Radio.Button>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        {palletsOrdenados.map((p) => (
          <Col
            key={p.palletid}
            onClick={() => mostrarPallet(p)}
            span="3"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '40px',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              {p.porcUso.toFixed(1)}%
            </div>
            <Cubeta pallet={p} key={p.palletid} />
            <div style={{ textAlign: 'center' }}>{p.nombrelocal}</div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default PalletsIcono;

function ordenarPallets(
  pallets: IPalletConsolidado[],
  ordenar: CriteriosOrden,
  orden: Orden
): IPalletConsolidado[] {
  if (ordenar === CriteriosOrden.PESO)
    return pallets.sort((a, b) =>
      orden === Orden.ASC ? a.peso - b.peso : b.peso - a.peso
    );
  if (ordenar === CriteriosOrden.VOLUMEN)
    return pallets.sort((a, b) =>
      orden === Orden.ASC ? a.vol - b.vol : b.vol - a.vol
    );
  if (ordenar === CriteriosOrden.NUM_CAJAS)
    return pallets.sort((a, b) =>
      orden === Orden.ASC ? a.numcajas - b.numcajas : b.numcajas - a.numcajas
    );

  return pallets;
}

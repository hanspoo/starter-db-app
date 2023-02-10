import { EditOutlined, FormOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { IProtoPallet } from '@flash-ws/api-interfaces';
import { Col, Row, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { AsyncStatus, AsyncState } from '../async-help';
import { useHttpClient } from '../useHttpClient';
import styles from './proto-pallets.module.css';

/* eslint-disable-next-line */
export interface ProtoPalletsProps {
  protos?: IProtoPallet[]
}

export function ProtoPallets({ protos }: ProtoPalletsProps) {
  const httpClient = useHttpClient()
  const [protoStatus, setProtoStatus] = useState<AsyncStatus<IProtoPallet[]>>({ state: AsyncState.RUNNING });

  useEffect(() => {
    if (protos)
      setProtoStatus({ state: AsyncState.OK, data: protos });
    else
      httpClient
        .get<IProtoPallet[]>(`${process.env['NX_SERVER_URL']}/api/proto-pallets`)
        .then((response) => {
          setProtoStatus({ state: AsyncState.OK, data: response.data });
        })
        .catch((error) => {
          setProtoStatus({ state: AsyncState.ERROR, msg: JSON.stringify(error) });
        });
  }, []);


  if (protoStatus.state === AsyncState.RUNNING) return <Spin />;
  if (protoStatus.state === AsyncState.ERROR) return <p>Error: {protoStatus?.msg}</p>;
  if (!protoStatus.data) return <p>Estado inválido no hay protoPallets</p>;


  return (
    <div className={styles['container']}>

      <div style={{ marginBottom: '0.5em', display: "flex", alignItems: "center" }}><b style={{ fontSize: '1.4em', marginRight: '0.5em' }}>Modelos de Pallets</b><PlusSquareOutlined /></div>


      {protoStatus.data.map(({ id, nombre, box: { largo, ancho, alto } }, i) => (
        <div key={id}>{i + 1}. {nombre} ({largo}x{ancho}x{alto}) <FormOutlined /></div>
      ))}

    </div>
  );
}


export default ProtoPallets;
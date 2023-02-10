import { useEffect, useState } from 'react';
import { Form, Input, Button, Radio, Spin, Select } from 'antd';
import styles from './gen-pallets-options.module.css';

import { OpcionesGenPallets } from '../pallets-generator/pallets-generator';
import {
  TipoHU,
  Distribuir,
  Ordenar,
  IProtoPallet,
  IOrdenCompra,
} from '@flash-ws/api-interfaces';
import { capitalize } from '@flash-ws/shared';
import { useHttpClient } from '../useHttpClient';
import { AsyncStatus, AsyncState } from '../async-help';
import axios from 'axios';
const { Option } = Select;

const GenPalletsOptions = ({
  orden,
  genPallets,
}: {
  orden: IOrdenCompra;
  genPallets: (options: OpcionesGenPallets) => void;
}) => {
  const httpClient = useHttpClient();
  const [protoStatus, setProtoStatus] = useState<AsyncStatus<IProtoPallet[]>>({
    state: AsyncState.RUNNING,
  });
  const [nextHURequest, setNextHURequest] = useState<AsyncStatus<number>>({
    state: AsyncState.RUNNING,
  });
  const [usarHUManual, setHUManual] = useState(false);

  console.log('GenPalletsOptions', orden);

  useEffect(() => {
    httpClient
      .get<{ hu: number }>(
        `${process.env['NX_SERVER_URL']}/api/ordenes/${orden.id}/ultima-hu`
      )
      .then((response) => {
        setNextHURequest({ state: AsyncState.OK, data: response.data.hu + 1 });
      })
      .catch((error) => {
        setNextHURequest({ state: AsyncState.ERROR, msg: error.message });
      });
    httpClient
      .get<IProtoPallet[]>(`${process.env['NX_SERVER_URL']}/api/proto-pallets`)
      .then((response) => {
        setProtoStatus({ state: AsyncState.OK, data: response.data });
      })
      .catch((ex) => {
        const error = axios.isCancel(ex)
          ? 'Request Cancelled'
          : ex.code === 'ECONNABORTED'
          ? 'A timeout has occurred'
          : ex.response.status === 404
          ? 'Resource Not Found'
          : 'An unexpected error has occurred';

        setProtoStatus({ state: AsyncState.ERROR, msg: error });
      });
  }, []);

  const onValuesChange = ({ tipoHU }: { tipoHU: TipoHU }) => {
    if (tipoHU) setHUManual(tipoHU === TipoHU.MANUAL);
  };

  const onFinish = (values: OpcionesGenPallets) => {
    genPallets(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  if (nextHURequest.state === AsyncState.RUNNING) return <Spin />;
  if (nextHURequest.state === AsyncState.ERROR)
    return <p>Error: {nextHURequest?.msg}</p>;
  if (!nextHURequest.data) return <p>Estado inválido no hay HU</p>;

  if (protoStatus.state === AsyncState.RUNNING) return <Spin />;
  if (protoStatus.state === AsyncState.ERROR)
    return <p>Error: {protoStatus?.msg}</p>;
  if (!protoStatus.data) return <p>Estado inválido no hay protoPallets</p>;

  return (
    <div className={styles['container']}>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        initialValues={{
          nextHU: nextHURequest.data,
          distribuir: Distribuir.HORIZONTAL,
          ordenar: Ordenar.PESO,
          tipoHU: TipoHU.AUTOMATICA,
        }}
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="Distribuir"
          name="distribuir"
          style={{ marginBottom: 0 }}
        >
          <Radio.Group>
            {Object.keys(Distribuir).map((s) => (
              <Radio value={s} key={s}>
                {capitalize(s)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <div style={{ marginBottom: '1em' }}>
          <div style={{ marginBottom: '0.25em' }}>
            Luego de ordenar las cajas por el criterio seleccionado:
          </div>
          <div>
            <b>Horizontal</b>: Crea todos los pallets y va asignando una caja a
            cada pallet hasta que las distribuye todas.
          </div>
          <div>
            <b>Vertical</b>: Completa un pallet, luego el siguiente hasta que
            distribuye todas las cajas.
          </div>
        </div>
        <Form.Item label="Ordenar" name="ordenar">
          <Radio.Group>
            {Object.keys(Ordenar).map((s) => (
              <Radio value={s} key={s}>
                {capitalize(s)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Tipo HU"
          name="tipoHU"
          style={{ marginBottom: '0.5em' }}
        >
          <Radio.Group>
            {Object.keys(TipoHU).map((s) => (
              <Radio value={s} key={s}>
                {capitalize(s)}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="HU Comenzar"
          name="nextHU"
          rules={[
            {
              required: usarHUManual,
              message: 'Por favor ingrese la próxima HU',
            },
          ]}
        >
          <Input disabled={!usarHUManual} />
        </Form.Item>
        <Form.Item
          label="Tipo de pallet"
          name="protoID"
          rules={[
            {
              required: true,
              message: 'Seleccion tipo de pallet',
            },
          ]}
        >
          <Select
            style={{ width: 320 }}
            placeholder="Seleccione el tipo de pallet"
          >
            {protoStatus.data.map(
              ({ id, nombre, box: { largo, ancho, alto } }) => (
                <Option value={id} key={id}>
                  {nombre} ({largo}x{ancho}x{alto})
                </Option>
              )
            )}
          </Select>
        </Form.Item>
        <div style={{ marginBottom: '1em' }}>
          <div>
            <b>Automática</b>: El sistema comenzará a partir de la última HU
            asignada.
          </div>
          <div>
            <b>Manual</b>: Ingrese manualmente la HU a utilizar.
          </div>
        </div>
        <Button htmlType="submit" type="primary" style={{ marginTop: '1.5em' }}>
          Enviar
        </Button>
      </Form>
    </div>
  );
};

export { GenPalletsOptions };

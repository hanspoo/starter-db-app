import React, { useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import {
  IFieldsMapper,
  IProtoPallet,
} from '@flash-ws/api-interfaces';

import { UploadOrdenReally } from './UploadOrdenReally';
import { useHttpClient } from '../useHttpClient';
import { AsyncStatus, AsyncState } from '../async-help';



const UploadOrden = () => {


  const httpClient = useHttpClient();
  // const [protoPallets, setprotoPallets] = React.useState<IProtoPallet[]>();
  // const [error, setError] = React.useState('');
  // const [loading, setLoading] = React.useState(true);
  const [protoStatus, setProtoStatus] = useState<AsyncStatus<IProtoPallet[]>>({ state: AsyncState.RUNNING });
  const [fmStatus, setFMStatus] = useState<AsyncStatus<IFieldsMapper[]>>({ state: AsyncState.RUNNING });

  React.useEffect(() => {
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
    httpClient
      .get<IFieldsMapper[]>(`${process.env['NX_SERVER_URL']}/api/fields-mappers`)
      .then((response) => {
        setFMStatus({ state: AsyncState.OK, data: response.data });
      })
      .catch((ex) => {
        const error = axios.isCancel(ex)
          ? 'Request Cancelled'
          : ex.code === 'ECONNABORTED'
            ? 'A timeout has occurred'
            : ex.response.status === 404
              ? 'Resource Not Found'
              : 'An unexpected error has occurred';

        setFMStatus({ state: AsyncState.ERROR, msg: error });
      });

  }, []);

  if (protoStatus.state === AsyncState.RUNNING) return <Spin />;
  if (protoStatus.state === AsyncState.ERROR) return <p>Error: {protoStatus?.msg}</p>;
  if (!protoStatus.data) return <p>Estado inválido no hay protoPallets</p>;

  if (fmStatus.state === AsyncState.RUNNING) return <Spin />;
  if (fmStatus.state === AsyncState.ERROR) return <p>Error: {protoStatus?.msg}</p>;
  if (!fmStatus.data) return <p>Estado inválido no hay mapeadores de campos</p>;

  return <UploadOrdenReally fieldsMapper={fmStatus.data} />;
};


export { UploadOrden };

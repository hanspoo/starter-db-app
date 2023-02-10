import { FormOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { IFieldMap, IFieldsMapper } from '@flash-ws/api-interfaces';
import { Spin } from 'antd';
import { useState, useEffect } from 'react';
import { AsyncStatus, AsyncState } from '../async-help';
import { useHttpClient } from '../useHttpClient';
import styles from './campos-mapper.module.css';

/* eslint-disable-next-line */
export interface CamposMapperProps {
  mappers?: IFieldsMapper[]
}

export function CamposMapper({ mappers }: CamposMapperProps) {
  const httpClient = useHttpClient()
  const [mappersStatus, setMappersStatus] = useState<AsyncStatus<IFieldsMapper[]>>({ state: AsyncState.RUNNING });

  useEffect(() => {
    if (mappers)
      setMappersStatus({ state: AsyncState.OK, data: mappers });
    else
      httpClient
        .get<IFieldsMapper[]>(`${process.env['NX_SERVER_URL']}/api/fields-mappers`)
        .then((response) => {
          setMappersStatus({ state: AsyncState.OK, data: response.data });
        })
        .catch((error) => {
          setMappersStatus({ state: AsyncState.ERROR, msg: JSON.stringify(error) });
        });
  }, []);


  if (mappersStatus.state === AsyncState.RUNNING) return <Spin />;
  if (mappersStatus.state === AsyncState.ERROR) return <p>Error: {mappersStatus?.msg}</p>;
  if (!mappersStatus.data) return <p>Estado inválido no hay mapeadores de campos</p>;


  return (
    <div className={styles['container']}>
      <div style={{ marginBottom: '0.5em', display: "flex", alignItems: "center" }}><b style={{ fontSize: '1.4em', marginRight: '0.5em' }}>Mapeadores</b><PlusSquareOutlined /></div>
      {mappersStatus.data.map(({ id, nombre, campos }, i) => (
        <div key={id}><h4>{i + 1}. {nombre} <FormOutlined /></h4>
          <Campos key={id} campos={campos} />
        </div>
      ))}

    </div>
  );
}


export default CamposMapper;

function Campos({ campos }: { campos: Array<IFieldMap> }) {
  return <div style={{ marginLeft: '1em' }}>
    <em>Campo: Columna</em>
    <div >{campos.map(c => <div key={c.id}>{c.campo.toLocaleLowerCase()}: {c.columna}</div>)}</div>
  </div>

}
import { Button, message, Upload } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import { actualizarProductos, RootState } from '@flash-ws/reductor';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpClient } from '../useHttpClient';

const SubirProductos = () => {
  const dispatch = useDispatch();
  const httpClient = useHttpClient();
  const token = useSelector((state: RootState) => state.counter.token);
  const props = {
    name: 'file',
    headers: { authorization: `Bearer ${token}` },
    action: `${process.env['NX_SERVER_URL']}/api/productos/masivo`,

    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        console.log("info.file.status !== 'uploading'");
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        dispatch(actualizarProductos(httpClient))
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Actualizar desde excel</Button>
    </Upload>
  );
};

export { SubirProductos };

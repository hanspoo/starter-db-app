import { Button, message, Select, Upload } from 'antd';

import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;
const SubirOrdenes = () => {
  const [unidad, setUnidad] = useState<string>('Jumbo');
  const props = {
    name: 'file',
    action: `${process.env['NX_SERVER_URL']}/api/ordenes/masivo`,

    onChange(info: any) {
      // eslint-disable-next-line no-empty
      if (info.file.status !== 'uploading') {
      }

      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  function handleChange(value: string) {
    setUnidad(value);
  }

  return (
    <form method="post">
      <Select
        value={unidad}
        defaultValue="Jumbo"
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value="Jumbo">Jumbo</Option>
        <Option value="Sisa">Sisa</Option>
      </Select>

      <Upload {...props} headers={{ 'x-unidad': unidad }}>
        <input type="hidden" name="unidad" value={unidad} />
        <Button icon={<UploadOutlined />}>Seleccionar planilla</Button>
      </Upload>
    </form>
  );
};

export { SubirOrdenes };

// import styles from './ant-uploader.module.css';

/* eslint-disable-next-line */
// export interface AntUploaderProps {}

// export function AntUploader(props: AntUploaderProps) {
//   return (
//     <div className={styles['container']}>
//       <h1>Welcome to AntUploader!</h1>
//     </div>
//   );
// }

// export default AntUploader;

import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { IArchivo } from '@flash-ws/api-interfaces';
import { ArchivoComponent } from '../archivo-component/archivo-component';

const action = `${process.env['NX_SERVER_URL']}/api/archivos`;

const AntUploader: React.FC<{
  onFileSelected: (archivo: IArchivo) => void;
}> = ({ onFileSelected }) => {
  const [archivo, setArchivo] = useState<IArchivo>();
  const props: UploadProps = {
    name: 'file',
    action,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        // console.log('info', info);

        // message.success(`${info.file.name} se ha subido correctamente`);
        setArchivo(info.file.response);
        onFileSelected(info.file.response);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  if (archivo) return <ArchivoComponent archivo={archivo} />;

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />}>Seleccione el archivo</Button>
    </Upload>
  );
};

export { AntUploader };

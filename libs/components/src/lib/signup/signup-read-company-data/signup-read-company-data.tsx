import { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Select, Spin } from 'antd';
import { CompanyData } from '../CompanyData';

type RecoverComponentsArgs = {
  cancel: () => void;
  next: (companyData: CompanyData) => void;
}
type Pais = {
  sigla: string;
  nombre: string;
}

const paises: Array<Pais> = [
  { nombre: "Chile", sigla: "cl" },
  { nombre: "Perú", sigla: "pe" },
  { nombre: "Colombia", sigla: "co" },
  { nombre: "Brasil", sigla: "br" },
  { nombre: "Argentina", sigla: "ar" },
]
export function SignupReadCompanyData({ cancel, next }: RecoverComponentsArgs) {

  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {

    setLoading(true);
    setTimeout(() => {
      next(values);
      setLoading(false);
    }, 2000)
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      layout="vertical"
      className={styles["ant-form"]}
      name="company-data"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >


      <p>Complete los datos de su empresa.</p>

      <Form.Item
        label="Nombre empresa"
        name="empresa"
        rules={[{ required: true, message: 'Requerido', min: 1 }]}
      >
        <Input autoFocus placeholder="" />
      </Form.Item>

      <Form.Item
        label="RUT o identificador legal"
        name="identLegal"
        rules={[{ required: true, message: 'Requerido', min: 6 }]}
      >
        <Input placeholder="" />
      </Form.Item>
      <Form.Item name="pais" label="País" rules={[{ required: true }]}>
        <Select >

          {paises.map(({ sigla, nombre }) => <Select.Option value={sigla}>{nombre}</Select.Option>)}
        </Select>
      </Form.Item>


      <div style={{ textAlign: "center" }}>
        <Form.Item>
          <Button block type="primary" htmlType="submit" style={{ marginRight: '0.1em' }}>
            {loading ? <Spin /> : "Enviar"}
          </Button>
        </Form.Item>

      </div>

    </Form>

  );
}

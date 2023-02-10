import { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin } from 'antd';
import { UserData } from '../UserData';

type RecoverComponentsArgs = {
  cancel: () => void;
  next: (userDate: UserData) => void;
}

export function SignupReadUserData({ cancel, next }: RecoverComponentsArgs) {

  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => { next(values as UserData); setLoading(false) }, 2000)

  }
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (

    <Form
      layout="vertical"
      className={styles["ant-form"]}
      name="user-data"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >


      <p>Complete sus datos personales.</p>

      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[{ required: true, message: 'Requerido', min: 1 }]}
      >
        <Input placeholder="Juan Pérez" autoFocus />
      </Form.Item>

      <Form.Item
        label="Celular"
        name="celular"
        rules={[{ required: true, message: 'Requerido', min: 6 }]}
      >
        <Input placeholder="+56993209306" />
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

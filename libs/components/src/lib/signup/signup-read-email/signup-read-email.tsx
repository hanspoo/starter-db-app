import React, { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin } from 'antd';


import { RegistrationRequest } from '@flash-ws/api-interfaces';
import customAxios from '../../customAxios';


type RecoverComponentsArgs = {
  cancel: () => void;
  next: (email: string) => void;
}


export function SignupReadEmail({ cancel, next }: RecoverComponentsArgs) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = (values: any) => {

    const { email } = values;

    setLoading(true);
    const data: RegistrationRequest = { email };

    customAxios.post(`/api/registration/validate-email`, data

    ).then(() => {
      next(email);
      // setError(response.statusText); setLoading(false);
    }).catch(error => {
      // next();
      console.log(error);
      setError(error.response.statusText || error.message); setLoading(false);
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };




  return (


    <div>


      <Form
        layout="vertical"
        className={styles["ant-form"]}
        name="read-email"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >

        {error ? <p>{error}</p> :
          <>
            <p><em>Bienvenido,</em></p> <p>Por seguridad, lo primero que haremos será verificar que
              eres dueño de tu correo electrónico, desde ya te pedimos disculpas por
              tener que hacer este paso adicional.</p>
            <p>Ingresa tu correo electrónico y te enviaremos instrucciones
              para continuar.</p>

            <Form.Item
              label="Email"
              name="email"
              rules={[{ type: "email", required: true }]}
            >
              <Input autoFocus />
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              <Form.Item>
                <Button block type="primary" htmlType="submit" style={{ marginRight: '0.1em' }}>
                  {loading ? <Spin size='small' /> : "Enviar"}
                </Button>
              </Form.Item>

            </div>

          </>}

      </Form>
    </div>

  );
}

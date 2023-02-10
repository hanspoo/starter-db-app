import React, { useMemo, useState } from 'react';
import styles from '../../auth-form.module.css';
import {
  Button,
  Form,
  Input,
  notification,
  Spin,
  Typography,
} from 'antd';
import { SignupRequest } from '@flash-ws/api-interfaces';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const { Title } = Typography;

enum View {
  FORM,
  LANDING,
}

export const SignupForm: React.FC<{ cancel: () => void, goActivation: (email: string) => void }> = ({ goActivation, cancel }) => {
  const [view, setView] = useState(View.FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const contextValue = useMemo(() => ({ name: 'Ant Design' }), []);

  const dispatch = useDispatch();

  if (view === View.LANDING) return <LandingRegistration />;

  const onFinish = (values: any) => {
    const { empresa, nombre, email, password, repassword, identLegal } = values;

    if (repassword !== password) {
      console.log("Contraseñas y repetir deben ser iguales");
      return;
    }
    setLoading(true);
    const data: SignupRequest = {
      empresa,
      nombre,
      token: "",
      email,
      password,
      identLegal,
    };
    axios
      .post(`${process.env['NX_SERVER_URL']}/api/auth/signup`, data)
      .then((response) => {
        console.log(response.data);
        goActivation(email)
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (error) return <p>{error}</p>;

  const Context = React.createContext({ name: 'Default' });
  return (
    <Context.Provider value={contextValue}>
      <div className={styles['login-form']}>
        {contextHolder}
        <Form
          layout="vertical"
          className={styles['ant-form']}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Title level={3}>
            Registrar
          </Title>

          <Title style={{ marginBottom: '1em' }} level={5}>Datos de la empresa</Title>


          <Form.Item
            name="identLegal"
            rules={[{ required: true, message: 'Requerido' }]}
          >
            <Input placeholder='RUT' />
          </Form.Item>
          <Form.Item
            name="empresa"
            rules={[{ required: true, message: 'Requerido' }]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>

          <Title style={{ marginBottom: '1em' }} level={5}>Datos del usuario</Title>

          <Form.Item

            name="nombre"
            rules={[{ required: true, message: 'Requerido' }]}
          >
            <Input placeholder="Nombre Completo" />
          </Form.Item>
          <Form.Item

            name="email"
            rules={[{ type: "email", required: true }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item

            name="password"
            rules={[{ required: true, message: 'Requerido', min: 6 }]}
          >
            <Input.Password placeholder="Contraseña" />
          </Form.Item>


          <Form.Item
            name="repassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                min: 6,
                message: 'Por favor confirme la contraseña!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Repetir Contraseña" />
          </Form.Item>

          <em style={{ color: "#666" }} >Largo mínimo de contraseña 6 caracteres</em>

          <div style={{ textAlign: 'center', marginTop: '3em' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {loading ? <Spin /> : 'Enviar'}
              </Button>
            </Form.Item>
          </div>
          <Button block type="link" onClick={cancel}>
            Volver al inicio
          </Button>
        </Form>
      </div>
    </Context.Provider>
  );
};

function LandingRegistration() {
  return (
    <div>
      <Title level={3}>Estamos casi listos</Title>
      <p>
        Hola, te hemos enviado un correo electrónico con un link para completar
        el registro.{' '}
      </p>
    </div>
  );
}

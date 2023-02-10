import { useState } from 'react';
import styles from '../../auth-form.module.css';
import {
  Button,
  Form,
  Input,
  Spin,
} from 'antd';
import { SignupRequest } from '@flash-ws/api-interfaces';
import { UserData } from '../UserData';
import { CompanyData } from '../CompanyData';
import customAxios from '../../customAxios';

type SignupReadPasswordProps = {
  userData: UserData;
  companyData: CompanyData;
  email: string;
  token: string;
  next(): void,
  cancel(): void
}
export function SignupReadPassword({ next, cancel, userData, companyData, email, token }: SignupReadPasswordProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = (values: any) => {
    const { password, repassword } = values;

    if (repassword !== password) {
      console.log("Contraseñas y repetir deben ser iguales");
      return;
    }
    setLoading(true);

    const data: SignupRequest = {
      empresa: companyData.empresa,
      nombre: userData.nombre,
      email,
      token,
      password,
      identLegal: companyData.identLegal,
    };

    customAxios
      .post(`/api/registration/create-company`, data)
      .then((response) => {
        console.log(response.data);
        next()
      })
      .catch((error) => {
        setError(JSON.stringify(error));
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (!companyData.empresa) {
    return <p>Error interno: No hay datos de empresa</p>
  }
  return (
    <Form
      layout="vertical"
      className={styles['ant-form']}
      name="read-pass"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      {error && <p>{error}</p>}

      <p>Ingrese su contraseña, nunca utilice la misma clave que en el banco. Piense
        en una combinación dificil de adivinar.</p>
      <Form.Item

        name="password"
        rules={[{ required: true, message: 'Requerido', min: 6 }]}
      >
        <Input.Password autoFocus placeholder="Contraseña" />
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
    </Form>
  );
};


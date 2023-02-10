import { ActivationRequest, ActivationResponse } from '@flash-ws/api-interfaces';
import { Typography, Form, Input, Button, Spin } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import styles from '../../auth-form.module.css';


const { Title } = Typography

export interface ActivationFormProps {
  bingo: () => void,
  cancel: () => void,
  email: string
}

export function ActivationForm({ bingo, cancel, email }: ActivationFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")

  const onFinish = ({ cseg }: { cseg: number }) => {
    if (!cseg)
      throw Error("No viene el código de activación")
    if (!email)
      throw Error("No está definido el email")

    setLoading(true)

    const body: ActivationRequest = { cseg, email }

    const url = `${process.env["NX_SERVER_URL"]}/api/auth/activate`
    axios.post<ActivationResponse>(url, body).then(response => {
      setLoading(false)
      if (response.data.success)
        bingo()
      else {
        setError(response.data.msg)
      }
    }).catch(error => {
      setLoading(false)
      setError(error.message)

    })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  if (loading)
    return <Spin />


  return (
    <div className={styles['login-form']}>

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
          Activar la cuenta
        </Title>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Ya casi estamos, ingresa el código de activación que hemos enviado a tu correo.</p>

        <p>Validando email: <b>{email}</b></p>

        <Form.Item
          name="cseg"
          rules={[{ required: true, message: 'Requerido' }]}
        >
          <Input placeholder='Código de Activación' />
        </Form.Item>


        <div style={{ textAlign: 'center' }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {loading ? <Spin /> : 'Enviar'}
            </Button>
          </Form.Item>
        </div>

        <div style={{ display: 'flex', justifyContent: "center" }}>

          <Button style={{ display: "inline" }} type="link" onClick={cancel}>
            Volver al inicio
          </Button>
          <Button style={{ display: "inline" }} type="link">
            Reenviar código
          </Button>
        </div>

      </Form>
    </div>
  );
}

export default ActivationForm;

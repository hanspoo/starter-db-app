
import { Typography, Form, Button } from 'antd';

import styles from '../../auth-form.module.css';


const { Title } = Typography

export interface ActivationFormProps {
  goLogin: () => void,
}

export function ActivationComplete({ goLogin }: ActivationFormProps) {

  return (
    <div className={styles['login-form']}>

      <Form
        layout="vertical"
        className={styles['ant-form']}
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Title level={3}>
          Activar la cuenta
        </Title>

        <p>Felicitaciones, has completado tu proceso de registro !!</p>

        <Button block type="primary" onClick={goLogin}>
          Ir a la pagina de login
        </Button>


      </Form>
    </div>
  );
}

export default ActivationComplete;

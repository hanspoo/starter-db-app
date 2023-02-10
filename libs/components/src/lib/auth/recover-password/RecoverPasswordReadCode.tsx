import { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin, Typography } from 'antd';
import { RequestValidaCodSeguridad } from '@flash-ws/api-interfaces';
import axios from 'axios';


const { Title } = Typography;

type RecoverPasswordReadCodeArgs = {
    cancel: () => void;
    next: (token: string) => void;
    email: string;
}

export function RecoverPasswordReadCode({ email, cancel, next }: RecoverPasswordReadCodeArgs) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = (values: any) => {

        const { cseg } = values;

        setLoading(true);
        const data: RequestValidaCodSeguridad = { email, cseg };

        axios.post(`${process.env['NX_SERVER_URL']}/api/auth/valida-cod-seguridad`, data

        ).then((response) => {
            const { token } = response.data;
            if (!token) {
                setError("Error grave, no llegó el token en respuesta")
                return;
            }
            next(token);
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


    return <div className={styles["login-form"]}>


        <Form
            layout="vertical"
            className={styles["ant-form"]}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >

            <Title level={3} style={{ marginBottom: '1em' }}>Recuperar contraseña</Title>
            {error ? <p>{error}</p> :
                <>
                    <p>Ingrese el código de seguridad que hemos enviado al correo {email}:</p>

                    <Form.Item
                        label="Código de seguridad"
                        name="cseg"
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

            <div style={{ textAlign: "center" }}>
                <Button style={{ marginTop: '1em' }} type="link" onClick={cancel}>Volver al inicio</Button>
            </div>
        </Form>
    </div>;
}

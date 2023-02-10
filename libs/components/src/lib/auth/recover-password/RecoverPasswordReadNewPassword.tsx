import { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin, Typography } from 'antd';
import { ExecuteChangePassRequest } from '@flash-ws/api-interfaces';
import axios from 'axios';

const { Title } = Typography;

type RecoverComponentsArgs = {
    cancel: () => void;
    next: () => void;
    token: string,
    email: string;
}


export function RecoverPasswordReadNewPassword({ email, token, cancel, next }: RecoverComponentsArgs) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = (values: any) => {

        const { password } = values;

        setLoading(true);
        const data: ExecuteChangePassRequest = { email, token, password };

        axios.post(`${process.env['NX_SERVER_URL']}/api/auth/change-pass`, data

        ).then(() => {
            next();
            // setError(response.statusText); setLoading(false);
        }).catch(error => {
            console.log(error);
            setError(error.response.statusText || error.message); setLoading(false);
        });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };




    return (


        <div className={styles["login-form"]}>


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
                        <p>Ingrese su nueva contraseña de largo mínimo 6 caracteres.</p>

                        <Form.Item
                            label="Contraseña"
                            name="password"
                            rules={[{ required: true, message: 'Requerido', min: 6 }]}
                        >
                            <Input.Password placeholder="Contraseña" />
                        </Form.Item>


                        <Form.Item
                            label="Repetir contraseña"
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
                        <div style={{ textAlign: "center" }}>
                            <Form.Item>
                                <Button block type="primary" htmlType="submit" style={{ marginRight: '0.1em' }}>
                                    {loading ? <Spin /> : "Enviar"}
                                </Button>
                            </Form.Item>

                        </div>

                    </>}

                <div style={{ textAlign: "center" }}>
                    <Button style={{ marginTop: '1em' }} type="link" onClick={cancel}>Volver al inicio</Button>
                </div>
            </Form>
        </div>

    );
}

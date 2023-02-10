import React, { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin, Typography } from 'antd';

import axios from 'axios';
import { RecoverPasswordRequest } from '@flash-ws/api-interfaces';

const { Title } = Typography;

type RecoverComponentsArgs = {
    cancel: () => void;
    next: (email: string) => void;
}


export function RecoverPasswordReadMail({ cancel, next }: RecoverComponentsArgs) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = (values: any) => {

        const { email } = values;

        setLoading(true);
        const data: RecoverPasswordRequest = { email };

        axios.post(`${process.env['NX_SERVER_URL']}/api/auth/recover-pass`, data

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
                        <p>Ingrese su correo electrónico y le enviaremos instrucciones para establecer una nueva contraseña</p>

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

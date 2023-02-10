import React, { useState } from 'react';
import styles from "../../auth-form.module.css";
import { Button, Form, Input, Spin, Typography } from 'antd';


import { RegistrationRequest } from '@flash-ws/api-interfaces';
import customAxios from '../../customAxios';


type RecoverComponentsArgs = {
    cancel: () => void;
    next: (email: string) => void;
}


export function RegistrationReadMail({ cancel, next }: RecoverComponentsArgs) {

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
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >


                {error ? <p>{error}</p> :
                    <>
                        <p><em>Bienvenido,</em></p> <p>Lo primero que haremos será verificar que
                            eres dueño de tu correo electrónico, desde ya te pedimos disculpas por
                            tener que hacer este paso adicional.</p>
                        <p>Ingrese su correo electrónico y le enviaremos instrucciones
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

                <div style={{ textAlign: "center" }}>
                    <Button style={{ marginTop: '1em' }} type="link" onClick={cancel}>Volver al inicio</Button>
                </div>
            </Form>
        </div>

    );
}

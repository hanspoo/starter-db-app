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


export function RegistrationReadDatosEmpresa({ email, token, cancel, next }: RecoverComponentsArgs) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const onFinish = (values: any) => {

        const { password } = values;

        setLoading(true);
        const data: ExecuteChangePassRequest = { email, token, password };

        axios.post(`${process.env['NX_SERVER_URL']}/api/registration/company-data`, data

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
                    <p>Complete los datos de su empresa.</p>

                    <Form.Item
                        label="Nombre empresa"
                        name="nombreEmpresa"
                        rules={[{ required: true, message: 'Requerido', min: 1 }]}
                    >
                        <Input placeholder="" />
                    </Form.Item>

                    <Form.Item
                        label="RUT o identificador legal"
                        name="rutEmpresa"
                        rules={[{ required: true, message: 'Requerido', min: 6 }]}
                    >
                        <Input placeholder="" />
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

    );
}

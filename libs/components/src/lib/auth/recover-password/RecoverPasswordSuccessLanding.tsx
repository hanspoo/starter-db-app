import styles from "../../auth-form.module.css";
import { Button, Form, Typography } from 'antd';

const { Title } = Typography;

type RecoverComponentsArgs = {
    cancel: () => void;
    next: () => void;
}


export function RecoverPasswordSuccessLanding({ cancel, next }: RecoverComponentsArgs) {


    return (


        <div className={styles["login-form"]}>


            <Form
                layout="vertical"
                className={styles["ant-form"]}
                name="basic"
                initialValues={{ remember: true }}
                autoComplete="off"
            >

                <Title level={3} style={{ marginBottom: '1em' }}>Recuperar contraseña</Title>


                <>
                    <p>Su contraseña ha sido cambiada, haga click para ir a la página de login</p>

                    <div style={{ textAlign: "center" }}>
                        <Form.Item>
                            <Button onClick={next} block type="primary" htmlType="submit" style={{ marginRight: '0.1em' }}>
                                Ir a login
                            </Button>
                        </Form.Item>

                    </div>

                </>

                <div style={{ textAlign: "center" }}>
                    <Button style={{ marginTop: '1em' }} type="link" onClick={cancel}>Volver al inicio</Button>
                </div>
            </Form>
        </div>

    );
}

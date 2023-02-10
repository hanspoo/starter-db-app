import { FileTextFilled, FileTextOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';
import { Content, Footer, Header } from 'antd/lib/layout/layout';
import { useState } from 'react';
import styles from "../auth-form.module.css"
import ActivationComplete from '../auth/activation-complete/activation-complete';
import ActivationForm from '../auth/activation-form/activation-form';
import { LoginForm } from '../auth/login-form/login-form';
import { RecoverPassword } from '../auth/recover-password/recover-password';
import { SignupCoordinator } from '../signup/signup-coordinator/signup-coordinator';

/* eslint-disable-next-line */
export interface LoginSectionProps { }

const { Title } = Typography
enum View {
  LOGIN,
  SIGNUP,
  ACTIVATION,
  ACTIVATION_COMPLETE,
  RECOVER_PASSWORD,
}
export function LoginSection(props: LoginSectionProps) {

  return <Layout className={styles["layout"]}>
    <Header className={styles["header"]}>
      <Typography.Title level={2} className={styles["title"]}><FileTextOutlined /> myapp</Typography.Title></Header>
    <Content>
      <div className={styles["container"]}>
        <DoLoginSection {...props} />
      </div>
    </Content>
    <Footer>myapp, desarrollado por MyCompany</Footer>
  </Layout>
}
export function DoLoginSection(props: LoginSectionProps) {
  const [email, setEmail] = useState("")
  const [vista, setView] = useState(View.LOGIN)

  if (vista === View.SIGNUP)
    return <SignupCoordinator cancel={() => setView(View.LOGIN)} />

  if (vista === View.RECOVER_PASSWORD)
    return <RecoverPassword cancel={() => setView(View.LOGIN)} />

  if (vista === View.ACTIVATION)
    return <ActivationForm email={email} cancel={() => setView(View.LOGIN)} bingo={() => setView(View.ACTIVATION_COMPLETE)} />

  if (vista === View.ACTIVATION_COMPLETE)
    return <ActivationComplete goLogin={() => setView(View.LOGIN)} />

  return <LoginForm goSignup={() => setView(View.SIGNUP)} recoverPassword={() => setView(View.RECOVER_PASSWORD)} />

}

export default LoginSection;

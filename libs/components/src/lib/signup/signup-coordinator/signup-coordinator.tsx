import React, { useState } from 'react';
import { Button, Typography } from 'antd';
import styles from "../../auth-form.module.css"

import { SignupReadEmail } from '../signup-read-email/signup-read-email';
import { SignupReadSecCode } from '../signup-read-sec-code/signup-read-sec-code';
import { SignupReadCompanyData } from '../signup-read-company-data/signup-read-company-data';
import { CompanyData } from '../CompanyData';
import { SignupReadUserData } from '../signup-read-user-data/signup-read-user-data';
import { UserData } from '../UserData';
import { SignupReadPassword } from '../signup-read-password/signup-read-password';

const { Title } = Typography

enum View {
  EMAIL,
  READ_SECURITY_CODE,
  EMPRESA,
  USUARIO,
  PASSWORD,
  SUCCESS

}
export const SignupCoordinator: React.FC<{ cancel: () => void }> = ({ cancel }) => {
  const [view, setView] = useState(View.EMAIL)

  const pedazo = 100 / (Object.keys(View).length / 2);
  const avance = pedazo * (view + 1)
  return <div className={styles["container"]}>

    <div className={styles["login-form"]}>

      <Title level={3} >Registrar Empresa</Title>
      <div style={{ marginBottom: '1em', width: '100%', height: '2px' }}>
        <div style={{ height: '2px', width: `${avance}%`, backgroundColor: '#1890ff' }}>

        </div>
      </div>
      <DoRegistration cancel={cancel} view={view} setView={setView} />
      <div style={{ textAlign: "center" }}>
        <Button style={{ marginTop: '1em' }} type="link" onClick={cancel}>Volver al inicio</Button>
      </div>
    </div></div>

}

type DoRegProps = {
  cancel(): void;
  setView(view: View): void;
  view: View;

}
function DoRegistration({ cancel, view, setView }: DoRegProps) {

  const [email, setEmail] = useState<string>()
  const [token, setToken] = useState<string>()
  const [companyData, setCompanyData] = useState<CompanyData>();
  const [userData, setUserData] = useState<UserData>();

  if (view === View.READ_SECURITY_CODE) {
    if (!email) return <p>Error interno, no está definido el email</p>
    return <SignupReadSecCode email={email} cancel={cancel} next={(token) => {
      setToken(token);
      setView(View.EMPRESA)
    }} />
  }
  if (view === View.EMPRESA) {
    if (!token) return <p>Error interno, no está definido el token</p>
    return <SignupReadCompanyData cancel={cancel} next={(companyData) => {
      setCompanyData(companyData)
      setView(View.USUARIO)
    }} />
  }

  if (view === View.USUARIO) {
    if (!companyData) return <p>Error interno, no está definida la empresa</p>
    return <SignupReadUserData cancel={cancel} next={(data) => {
      setUserData(data)
      setView(View.PASSWORD)
    }} />
  }

  if (view === View.PASSWORD) {
    if (!token) return <p>Error interno, no está definido el token</p>
    if (!email) return <p>Error interno, no está definido el email</p>
    if (!userData) return <p>Error interno, no están definidos los datos del usuario</p>
    if (!companyData) return <p>Error interno, no está definida la empresa</p>

    return <SignupReadPassword userData={userData}
      companyData={companyData}
      token={token}
      email={email} cancel={cancel} next={() => {
        setView(View.SUCCESS)
      }} />
  }


  if (view === View.SUCCESS) {
    return <><p>Felicitaciones {userData?.nombre}, has completado el proceso de registro:</p>
      <Button block type="primary" onClick={cancel}>Ir a la página de login</Button></>
  }
  return <SignupReadEmail cancel={cancel} next={(mail: string) => { setEmail(mail); setView(View.READ_SECURITY_CODE) }} />

}







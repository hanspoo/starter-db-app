import React, { useState } from 'react';
import { RecoverPasswordReadMail } from './RecoverPasswordReadMail';
import { RecoverPasswordReadCode } from './RecoverPasswordReadCode';
import { RecoverPasswordReadNewPassword } from './RecoverPasswordReadNewPassword';
import { RecoverPasswordSuccessLanding } from './RecoverPasswordSuccessLanding';

enum View {
  READ_EMAIL,
  READ_SECURITY_CODE,
  READ_NEW_PASSWORD,
  LANDING_RECOVER_PASS
}

export const RecoverPassword: React.FC<{ cancel: () => void }> = ({ cancel }) => {
  const [view, setView] = useState(View.READ_EMAIL)
  const [email, setEmail] = useState<string>()
  const [token, setToken] = useState<string>()

  if (view === View.READ_NEW_PASSWORD) {
    if (!email) return <p>Error interno, no está definido el email (2)</p>
    if (!token) return <p>Error interno, no está definido el token (2)</p>

    return <RecoverPasswordReadNewPassword token={token} email={email} cancel={cancel} next={() => setView(View.LANDING_RECOVER_PASS)} />
  }

  if (view === View.LANDING_RECOVER_PASS)
    return <RecoverPasswordSuccessLanding cancel={cancel} next={cancel} />

  if (view === View.READ_SECURITY_CODE) {
    if (!email) return <p>Error interno, no está definido el email</p>
    return <RecoverPasswordReadCode email={email} cancel={cancel} next={(token) => {
      setToken(token);
      setView(View.READ_NEW_PASSWORD)
    }} />
  }

  return <RecoverPasswordReadMail cancel={cancel} next={(mail: string) => { setEmail(mail); setView(View.READ_SECURITY_CODE) }} />

}





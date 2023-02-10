import { RootState } from '@flash-ws/reductor';
import { Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@flash-ws/reductor';
import styles from './login-state.module.css';
import { useEffect, useState } from 'react';
import { useHttpClient } from '../../useHttpClient';
import { Me } from '@flash-ws/api-interfaces';
import axios from 'axios';


/* eslint-disable-next-line */
export interface LoginStateProps { }

export function LoginState(props: LoginStateProps) {

  const httpClient = useHttpClient();
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [me, setMe] = useState<Me>()


  const token = useSelector((state: RootState) => state.counter.token)
  const dispatch = useDispatch();

  useEffect(() => {

    httpClient.get(`${process.env["NX_SERVER_URL"]}/api/me`).then(response => {
      setMe(response.data)
      setLoading(false)
    }).catch(error => {

      if (axios.isAxiosError(error)) {
        setError(error.message)
      } else {
        setError(JSON.stringify(error))
      }

      setLoading(false)
    });
  }, [])

  const loggedIn = useSelector((state: RootState) => state.counter.loggedIn)
  if (!loggedIn)
    return <p>Desconectado</p>

  const onLogout = () => {
    dispatch(logout())
  }

  if (loading)
    return <Spin size="small" />


  return (
    <div className={styles['container']}>
      {error ? <span>{error}</span> : <span>
        {me?.nombre} en {me?.empresa}
        <br />
        <Button style={{ padding: 0 }} size='small' type="link" onClick={onLogout}><small>Cerrar sesión</small></Button>
      </span>}
    </div>
  );
}

export default LoginState;

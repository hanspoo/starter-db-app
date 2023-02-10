/**
 * Hace más breve el manenjo de estado de peticiones asincrónicas
 */
export enum AsyncState {
  NADA,
  RUNNING,
  ERROR,
  OK,
}

export interface AsyncStatus<T> {
  state: AsyncState;
  msg?: string;
  data?: T;
}

/**
 * Ejemplo de uso 
 * 
 * const UploadOrden = () => {


  const httpClient = useHttpClient();
  // const [protoPallets, setprotoPallets] = React.useState<IProtoPallet[]>();
  // const [error, setError] = React.useState('');
  // const [loading, setLoading] = React.useState(true);
  const [protoStatus, setProtoStatus] = useState<AsyncStatus<IProtoPallet[]>>({ state: AsyncState.RUNNING });

  React.useEffect(() => {
    httpClient
      .get<IProtoPallet[]>(`${process.env['NX_SERVER_URL']}/api/proto-pallets`)
      .then((response) => {
        setProtoStatus({ state: AsyncState.OK, data: response.data });
      })
      .catch((ex) => {
        const error = axios.isCancel(ex)
          ? 'Request Cancelled'
          : ex.code === 'ECONNABORTED'
            ? 'A timeout has occurred'
            : ex.response.status === 404
              ? 'Resource Not Found'
              : 'An unexpected error has occurred';

        setProtoStatus({ state: AsyncState.ERROR });
      });
  }, []);

  if (protoStatus.state === AsyncState.RUNNING) return <Spin />;
  if (protoStatus.state === AsyncState.ERROR) return <p>Error: {protoStatus?.msg}</p>;
  if (!protoStatus.data) return <p>Estado inválido no hay protoPallets</p>;

  return <UploadOrdenReally protoPallets={protoStatus.data} />;
};
 */

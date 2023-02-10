import { IProducto } from '@flash-ws/api-interfaces';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHttpClient } from '../useHttpClient';


export function useProductos(): [boolean, string, IProducto[] | undefined] {

    const httpClient = useHttpClient();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState<IProducto[]>();

    useEffect(() => {
        httpClient
            .get(`${process.env['NX_SERVER_URL']}/api/productos`)
            .then((response) => { setData(response.data); setLoading(false); })
            .catch(error => { setError(error.message); setLoading(false); })

    }, [])

    return [loading, error, data]

}

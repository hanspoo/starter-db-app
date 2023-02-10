import { RootState } from '@flash-ws/reductor';
import axios from 'axios';
import { useSelector } from 'react-redux';

export function useHttpClient() {
  const token = useSelector((state: RootState) => state.counter.token);

  if (!token) {
    console.log('No está el access token');
  }

  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

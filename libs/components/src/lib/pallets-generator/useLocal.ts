import { ILineaDetalle, ILocal } from '@flash-ws/api-interfaces';
import { RootState } from '@flash-ws/reductor';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

type UseLocalReturn = [boolean, ILineaDetalle[] | undefined];

export function useLocal(lineas: ILineaDetalle[]): UseLocalReturn {
  const [data, setData] = useState<ILineaDetalle[]>();
  const [loading, setLoading] = useState(true);

  const locales = useSelector((state: RootState) => state.localesSlice.locales);

  function findLocal(id: number): ILocal | undefined {
    return locales!.find((p: ILocal) => p.id === id);
  }

  useEffect(() => {
    const hidratadas = lineas.map((linea) => {
      const local = linea.localId ? findLocal(linea.localId) : undefined;
      if (!local) throw Error(`local no encontrado`);
      return {
        ...linea,
        local,
      };
    });

    setData(
      hidratadas.sort((a, b) => a.local.nombre.localeCompare(b.local.nombre))
    );
    setLoading(false);
  }, [lineas]);

  if (loading) return [true, undefined];

  return [false, data];
}

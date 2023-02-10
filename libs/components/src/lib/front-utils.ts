import {
  QuestionOutlined,
  CheckOutlined,
  CloseOutlined,
  PauseOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { IBox, IProducto } from '@flash-ws/api-interfaces';

export function formatNumber(x: any) {
  if (typeof x === 'undefined') return '-1';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatKb(x: any) {
  const kb = x / 1024;
  const s = formatNumber(kb);
  return `${s}kb`;
}

export function comparaVigencia(a: IProducto, b: IProducto) {
  const x = a.vigente ? 1 : 0;
  const y = b.vigente ? 1 : 0;

  return x - y;
}

export function fmtMedida(n: number) {
  return n;
}

export function volumen(box: IBox) {
  const { largo, ancho, alto } = box;
  return (largo * ancho * alto) / 1000;
}

export const estados: Record<string, any> = {
  Nada: QuestionOutlined,
  Aprobada: CheckOutlined,
  Rechazada: CloseOutlined,
  Pendiente: PauseOutlined,
  Multiple: WarningOutlined,
};

export const colores: Record<string, string> = {
  Nada: 'yellow',
  Aprobada: 'green',
  Rechazada: 'red',
  Pendiente: 'cyan',
  Multiple: 'gray',
};

export const coloresFondo: Record<string, string> = {
  Nada: `#ffee65`,
  Aprobada: `#b2e061`,
  Rechazada: `#fd7f6f`,
  Pendiente: '#7eb0d5',
  Multiple: '#ffb55a',
};

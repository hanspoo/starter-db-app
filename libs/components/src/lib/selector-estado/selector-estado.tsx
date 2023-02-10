import { EstadoLinea } from '@flash-ws/api-interfaces';
import { Select } from 'antd';
import { useState } from 'react';

/* eslint-disable-next-line */
export interface SelectorEstadoProps {
  onChange: (estado: EstadoLinea) => void;
  estado?: EstadoLinea;
}

const estados = Object.keys(EstadoLinea);
export function SelectorEstado({ estado, onChange }: SelectorEstadoProps) {
  return (
    <Select
      allowClear={true}
      defaultValue={estado}
      onChange={onChange}
      style={{ width: '9em' }}
    >
      {estados.map((e) => (
        <Select.Option value={e}>{e}</Select.Option>
      ))}
    </Select>
  );
}

export default SelectorEstado;

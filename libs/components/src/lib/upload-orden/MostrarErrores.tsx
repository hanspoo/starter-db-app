import React from 'react';

type MostrarErroresProps = {
  list: string[];
  title: string;
};
export function MostrarErrores({ title, list }: MostrarErroresProps) {
  if (list.length === 0) return null;
  return (
    <>
      <h3>{title}</h3>
      <ol>
        {list.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </>
  );
}

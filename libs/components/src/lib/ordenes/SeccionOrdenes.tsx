import { Typography, Button, Spin } from 'antd';
import { useState } from 'react';
import OrdenesConsolidadas from '../ordenes-consolidadas/ordenes-consolidadas';
import { UploadOrden } from '../upload-orden/upload-orden';
import { DetalleOrden } from './DetalleOrden';

const { Title } = Typography;

enum Vista {
  Listado,
  Subir,
  Detalle,
}

export function SeccionOrdenes() {
  const [vista, setVista] = useState(Vista.Listado);
  const [orden, setOrden] = useState<string>();

  function vistaDetalle(id: string) {
    setOrden(id);
    setVista(Vista.Detalle);
  }

  return (
    <>
      <Title level={2}>Ordenes</Title>
      <div style={{ float: 'right', position: 'relative', top: '-24px' }}>
        <Button onClick={() => setVista(Vista.Subir)}>Subir planilla</Button>
        <Button onClick={() => setVista(Vista.Listado)}>Listado</Button>
      </div>
      {vista === Vista.Listado && <ConRecarga vistaDetalle={vistaDetalle} />}
      {vista === Vista.Subir && <UploadOrden />}
      {vista === Vista.Detalle && orden && <DetalleOrden id={orden} />}
    </>
  );
}

function ConRecarga({ vistaDetalle }: { vistaDetalle: (id: string) => void }) {
  const [recargando, setRecargando] = useState(false);
  if (recargando) return <Spin />;
  return (
    <OrdenesConsolidadas
      vistaDetalle={vistaDetalle}
      recargar={() => {
        setRecargando(true);
        setTimeout(() => setRecargando(false), 2000);
      }}
    />
  );
}

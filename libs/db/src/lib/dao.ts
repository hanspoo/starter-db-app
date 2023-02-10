import { dataSource } from './data-source';
import { ConsolidadoCajas } from './ConsolidadoCajas';

export function dao(): string {
  return 'dao';
}

export async function palletsCajas(id: string): Promise<ConsolidadoCajas[]> {
  const sql = `
    SELECT
    box."largo" AS largo,
    box."ancho" AS ancho,
    box."alto" AS alto,
    caja."id" AS cajaId,
    linea_detalle."estado" AS estado,
    pallet."id" AS palletId,
    linea_detalle."productoId" AS productoId,
    linea_detalle."localId" AS localId,
    producto."nombre" AS nombreProducto,
    local."nombre" AS nombreLocal,
    producto."peso" AS peso,
    producto."codigo" AS codigoProducto,
    producto."codCenco" AS codCenco
FROM
    "linea_detalle" linea_detalle INNER JOIN "caja" caja ON linea_detalle."id" = caja."lineaId"
    INNER JOIN "pallet" pallet ON caja."palletId" = pallet."id"
    INNER JOIN "local" local ON pallet."localId" = local."id"
    INNER JOIN "producto" producto ON linea_detalle."productoId" = producto."id"
    INNER JOIN "box" box ON producto."boxId" = box."id"
WHERE
    pallet."ordenCompraId" = '${id} '   
    `;
  const queryRunner = await dataSource.createQueryRunner();
  const filas = await queryRunner.manager.query(sql);
  queryRunner.release();
  return filas;
}

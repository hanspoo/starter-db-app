import { ICajaConsolidada } from '@flash-ws/api-interfaces';

import { CajaPura } from './CajaPura';
import { dataSource } from './data-source';

function mapear(rows: Array<CajaPura>): Array<ICajaConsolidada> {
  const array: Array<ICajaConsolidada> = rows.map(
    ({
      id,
      lineaid,
      peso,
      largo,
      ancho,
      alto,
      producto,
      codigo,
      codcenco,
      localId,
    }) => ({
      id,
      largo: parseFloat(largo),
      ancho: parseFloat(ancho),
      alto: parseFloat(alto),
      peso: parseFloat(peso),
      producto,
      lineaid,
      codigo,
      codcenco,
      localId,
    })
  );
  return array;
}

export class ServicioCajas {
  static async cajasPallet(palletId: number): Promise<ICajaConsolidada[]> {
    const sql = `
        SELECT
        caja.id as id,
           box."largo" AS largo,
           box."ancho" AS ancho,
           box."alto" AS alto,
           producto."peso" AS peso,
           producto."nombre" AS producto,
           producto."codigo" AS codigo,
           producto."codCenco" AS codCenco,
           linea_detalle.id as lineaid
      FROM
           pallet INNER JOIN caja ON pallet."id" = caja."palletId"
           INNER JOIN linea_detalle ON caja."lineaId" = linea_detalle."id"
           INNER JOIN producto ON linea_detalle."productoId" = producto."id"
           INNER JOIN box ON producto."boxId" = box."id"
      WHERE
           pallet.id = ${palletId} order by producto."nombre"
        `;

    const queryRunner = dataSource.createQueryRunner();
    const rows: Array<CajaPura> = await queryRunner.manager.query(sql);
    queryRunner.release();

    return mapear(rows);
  }

  static async cajasOrden(id: string): Promise<ICajaConsolidada[]> {
    const sql = `
  SELECT
  caja.id as id,
     box."largo" AS largo,
     box."ancho" AS ancho,
     box."alto" AS alto,
     producto."peso" AS peso,
     producto."nombre" AS producto,
     producto."codigo" AS codigo,
     producto."codCenco" AS codCenco,
     linea_detalle.id as lineaid,
     linea_detalle."localId"
FROM
     "linea_detalle" linea_detalle INNER JOIN "caja" caja ON linea_detalle."id" = caja."lineaId"
     INNER JOIN "producto" producto ON linea_detalle."productoId" = producto."id"
     INNER JOIN "box" box ON producto."boxId" = box."id"
WHERE linea_detalle."ordenCompraId"  = '${id}';     
  `;

    const queryRunner = dataSource.createQueryRunner();
    const rows: Array<CajaPura> = await queryRunner.manager.query(sql);
    queryRunner.release();

    return mapear(rows);
  }
}

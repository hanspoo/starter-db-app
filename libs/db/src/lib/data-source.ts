import * as crypto from "node:crypto";
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { Local } from "./entity/local.entity";
import { Cliente } from "./entity/cliente.entity";
import { UnidadNegocio } from "./entity/unidad-negocio.entity";
import { OrdenCompra } from "./entity/orden-compra.entity";
import { LineaDetalle } from "./entity/linea-detalle.entity";
import { Producto } from "./entity/producto.entity";
import { Pedido } from "./entity/pedido.entity";
import { Box } from "./entity/box.entity";
import { Pallet } from "./entity/pallet.entity";
import { ProtoPallet } from "./entity/proto-pallet.entity";
import { Caja } from "./entity/caja.entity";
import { Archivo } from "./entity/archivo.entity";
import { Empresa } from "./entity/auth/empresa.entity";
import { Token } from "./entity/auth/token.entity";
import { Usuario } from "./entity/auth/usuario.entity";

import { FieldsMapper } from "./entity/campos/FieldsMapper";
import { FieldMap } from "./entity/campos/FieldMap";
import { SolicitudRegistro } from "./entity/auth/solicitud-registro.entity";
import { SolicitudAutenticarEmail } from "./entity/auth/solicitud-autenticar-email.entity";
import { PermisoUsarEmail } from "./entity/auth/permiso-usar-email.entity";
const LOGGING = !!process.env["DEBUG_DB"] || false;
const testEnv = "test";

const dbArgs: any = {
  type: process.env["NODE_ENV"] === testEnv ? "sqlite" : "postgres",
  host: process.env["DB_HOST"] || "localhost",
  username: process.env["DB_USER"] || "flash",
  password: process.env["DB_PASS"] || "flash",

  database:
    process.env["NODE_ENV"] === testEnv
      ? "/tmp/db/" + crypto.randomBytes(12).toString("hex")
      : "flash",
};
console.log("dbArgs", dbArgs);

const dataSource = new DataSource({
  ...dbArgs,
  entities: [
    Archivo,
    User,
    Local,
    Cliente,
    UnidadNegocio,
    OrdenCompra,
    Pallet,
    LineaDetalle,
    Producto,
    Pedido,
    Box,
    Caja,
    ProtoPallet,
    Empresa,
    Usuario,
    Token,
    FieldsMapper,
    FieldMap,
    SolicitudRegistro,
    SolicitudAutenticarEmail,
    PermisoUsarEmail,
  ],
  logging: LOGGING,
  synchronize: true,

  extra: { max: 10, connectionTimeoutMillis: 3000 },
});

export { dataSource };

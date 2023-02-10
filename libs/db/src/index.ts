import { LineaConsolidada } from "./lib/consolidado/LineaConsolidada";
import { OrdenCompra } from "./lib/entity/orden-compra.entity";

export * from "./lib/dao";
export * from "./lib/data-source";
export * from "./lib/inicializarSistema";

export * from "./lib/entity/campos/FieldsMapper";
export * from "./lib/entity/campos/FieldMap";

export * from "./lib/entity/auth/solicitud-registro.entity";

export * from "./lib/entity/auth/solicitud-autenticar-email.entity";
export * from "./lib/entity/auth/token.entity";
export * from "./lib/entity/auth/empresa.entity";
export * from "./lib/entity/auth/usuario.entity";
export * from "./lib/entity/auth/permiso-usar-email.entity";

export * from "./lib/entity/local.entity";
export * from "./lib/entity/linea-detalle.entity";
export * from "./lib/entity/unidad-negocio.entity";
export * from "./lib/entity/cliente.entity";
export * from "./lib/entity/user.entity";
export * from "./lib/entity/orden-compra.entity";
export * from "./lib/entity/pedido.entity";
export * from "./lib/entity/caja.entity";
export * from "./lib/entity/pallet.entity";
export * from "./lib/entity/proto-pallet.entity";
export * from "./lib/entity/archivo.entity";
export * from "./lib/CajaPura";

export * from "./lib/entity/producto.entity";
export * from "./lib/entity/box.entity";
export * from "./lib/inicializarCencosud";
export * from "./lib/ServicioPallets";
export * from "./lib/ServicioCajas";
export * from "./lib/ServicioOrdenes";
export * from "./lib/auth/CredentialsService";
export * from "./lib/auth/LoginService";
export * from "./lib/auth/TokenService";
export * from "./lib/auth/FinderSolicitudesRegistro";

export * from "./lib/auth/SignupService";
export * from "./lib/ProductosService";
export * from "./lib/utils/crearOrdenHelper";
export * from "./lib/utils/clonar-utils";
export * from "./lib/parser-2.0/OrdenCreator";
export * from "./lib/parser-2.0/ProcesadorPlanilla";
export * from "./lib/parser-2.0/config-campos-cenco";

export * from "./lib/auth/CrearUsuarioService";
export * from "./lib/auth/ActivationServiceResponse";
export * from "./lib/auth/RecoverPasswordService";
export * from "./lib/auth/ValidarSolicitudAutenticarEmail";
export * from "./lib/auth/ExecuteChangePassService";

// Genera imports
// find ./lib/entity/ -type f |perl -ane 'print qq#export * from "$F[0]"\n#' |sed s/\.ts//

export type SuperOrden = OrdenCompra & {
  lineasConsolidadas: Array<LineaConsolidada>;
};

export * from "./lib/registration/RegistrationServiceEmailStage";

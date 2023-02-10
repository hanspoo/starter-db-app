import { Campo } from '@flash-ws/api-interfaces';
import { FieldsMapper } from '../entity/campos/FieldsMapper';

const configCenco = new FieldsMapper();
configCenco.nombre = 'Gargola S.A.';
configCenco.campos = [];

configCenco.addCampo(Campo.IDENT_LEGAL, 3);
configCenco.addCampo(Campo.NOMBRE_CLIENTE, 4);
configCenco.addCampo(Campo.UNIDAD_NEGOCIO, 37);

configCenco.addCampo(Campo.COD_LOCAL, 13);
configCenco.addCampo(Campo.NOMBRE_LOCAL, 14);

configCenco.addCampo(Campo.COD_CENCOSUD, 16);
configCenco.addCampo(Campo.COD_PRODUCTO, 17);
configCenco.addCampo(Campo.CANTIDAD, 23);

configCenco.addCampo(Campo.NUM_ORDEN, 1);
configCenco.addCampo(Campo.FEC_EMISION, 7);
configCenco.addCampo(Campo.FEC_ENTREGA, 8);

export { configCenco };

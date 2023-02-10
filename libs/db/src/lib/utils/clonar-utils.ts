import { FieldsMapper, ProtoPallet } from '../..';

export function clonarProtos(
  muestra: Array<Partial<ProtoPallet>>
): Array<Partial<ProtoPallet>> {
  return muestra.map((pallet) => limpiarPallet(pallet));
}
function limpiarPallet(pallet: Partial<ProtoPallet>): any {
  pallet.id = undefined;
  const { box } = pallet;
  if (box) box.id = undefined;
  return pallet;
}
export function clonarMappers(
  fieldsMapper: Array<Partial<FieldsMapper>>
): Array<Partial<FieldsMapper>> {
  return fieldsMapper.map((fm) => limpiarMapper(fm));
}
function limpiarMapper(fm: Partial<FieldsMapper>): Partial<FieldsMapper> {
  fm.id = undefined;
  fm.campos = fm.campos?.map((fieldMap) => ({ ...fieldMap, id: undefined }));

  return fm;
}

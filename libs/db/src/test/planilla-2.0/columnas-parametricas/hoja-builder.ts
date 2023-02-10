type HojaCenco = {
  name: string;
  data: unknown[][];
};
export const hojaCenco: HojaCenco = {
  name: "Sheet1",
  data: [
    [
      "Número de Orden",
      "Estado de Orden",
      "RUT Comprador",
      "RS Comprador",
      "RUT Vendedor",
      "RS Vendedor",
      "Fecha Emisión",
      "Fecha Entrega",
      "Tipo Orden",
      "Cód. Local Entrega",
      "Nombre Local Entrega",
      "Dirección Local Entrega",
      "Cód. Local Destino",
      "Local Destino",
      "Dirección Local Destino",
      "Cód. Cencosud",
      "Cód. Proveedor",
      "EAN13",
      "Cód. Empaque",
      "Descripción",
      "Tipo Empaque",
      "Unidades por Empaque",
      "Empaques Pedidos",
      "Precio Lista Empaque",
      "Desc. Base1",
      "Desc. Base2",
      "Desc. Base3",
      "Desc. Base4",
      "Desc. Promo",
      "Desc. Apertura",
      "Cargo1",
      "Cargo2",
      "Cargo3",
      "Precio Costo Empaque",
      "Términos de Pago",
      "Responsable",
      "Unidad de Negocio",
    ],
    [
      5575426472,
      "Liberada",
      "C001",
      "CENCOSUD RETAIL S.A.",
      "96785290",
      "CHILEAN TRADING COMPANY S.A.",
      "15-09-2022",
      "22-09-2022",
      "OC Predistribuida",
      "N641",
      "CD LO AGUIRRE",
      "Lo Aguirre N°1.200, Parcela 2",
      "N524",
      "185 -SISA-LINARES-JANUARIO-ESP",
      null,
      "1647753",
      "DRBIO-00634",
      "17896380105332",
      "17896380105332",
      "BOLSA MONDADIENTES 100UN",
      "CS",
      50,
      1,
      13500,
      0,
      0,
      0,
      0,
      0,
      0,
      -4050,
      -945,
      0,
      8505,
      "90 dias",
      "CVALENCC",
      "Sisa",
    ],
  ],
};

export class SheetBuilder {
  identLegal: string;
  withIdentLegal(identLegal: string) {
    this.identLegal = identLegal;
    return this;
  }
  lines: Array<any> = [];

  addLines(...lines: unknown[]) {
    this.lines = this.lines.concat(lines);
    return this;
  }

  addLine(line: unknown[]) {
    this.lines.push(line);
    return this;
  }

  build() {
    const hoja: HojaCenco = {
      name: "",
      data: [],
    };

    hoja.data = [hojaCenco.data[0], ...this.lines];

    if (this.identLegal) hoja.data[1][2] = this.identLegal;

    return hoja;
  }
}

export class LineBuilder {
  identLegal: string;
  nombre: string;
  unidad: string;
  codLocal: string;
  nombreLocal: string;
  numOrden: string;

  withNombre(nombre: string) {
    this.nombre = nombre;
    return this;
  }
  withUnidad(unidad: string) {
    this.unidad = unidad;
    return this;
  }
  withLocal(local: string) {
    [this.codLocal, this.nombreLocal] = local.split(",");
    return this;
  }
  withIdentLegal(identLegal: string) {
    this.identLegal = identLegal;
    return this;
  }

  // Van desfasado en 1 con respecto a la config

  build() {
    const hoja = [...hojaCenco.data[1]];
    if (this.identLegal) hoja[2] = this.identLegal;
    if (this.nombre) hoja[3] = this.nombre;
    if (this.unidad) hoja[36] = this.unidad;
    if (this.codLocal) hoja[12] = this.codLocal;
    if (this.nombreLocal) hoja[13] = this.nombreLocal;
    if (this.numOrden) hoja[1] = this.numOrden;
    return hoja;
  }
}

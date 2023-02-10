import * as xlsx from 'xlsx';
import * as fs from 'fs';
import { StatusCode } from './StatusCode';
import { dataSource } from './data-source';
import { Empresa } from './entity/auth/empresa.entity';
import { Box } from './entity/box.entity';
import { LineaDetalle } from './entity/linea-detalle.entity';
import { Local } from './entity/local.entity';
import { OrdenCompra } from './entity/orden-compra.entity';
import { Producto } from './entity/producto.entity';

type EntityStatus = {
  codigo: StatusCode;
  descripcion: string;
};

const repo = dataSource.getRepository(Producto);

export class ProductoService {
  findAll(): Promise<Array<Producto>> {
    return repo.find({
      where: { empresa: { id: this.empresa.id } },
      relations: { box: true },
    });
  }
  statusLines: Array<EntityStatus> = [];
  locales: Array<Local>;
  constructor(public empresa: Empresa) {
    if (!empresa) throw Error('La empresa es nula, debe entregar la empresa');
  }

  async cargarPlanilla(path: string): Promise<Array<EntityStatus>> {
    if (!fs.existsSync(path)) {
      throw Error('Archivo no existe');
    }
    const stat = fs.statSync(path);

    if (stat.size === 0) {
      throw Error('Archivo vacio');
    }

    const json = firstSheetAsJSON(path);
    this.statusLines = await Promise.all(
      json.map((linea) => this.crearActualizarProducto(linea))
    );

    return this.statusLines;
  }

  async crearActualizarProducto(linea: any) {
    const codCenco = linea['CENCO'];
    const alto = linea['ALTO (CM)'];
    const ancho = linea['ANCHO (CM)'];
    const largo = linea['LARGO (CM)'];
    const peso = linea['PESO (GR)'];
    const nombre = linea['TIPO PRODUCTOS '].trim();
    const codigo = linea['CODIGO SISTEMA '];

    let esValido = true;

    if (!codCenco) esValido = false;
    if (!nombre) esValido = false;
    if (!codigo) esValido = false;

    if (!peso) esValido = false;

    if (!largo) esValido = false;
    if (!ancho) esValido = false;
    if (!alto) esValido = false;

    const cod = esValido ? StatusCode.OK : StatusCode.ERROR;

    if (esValido) {
      let p = await this.findByCodCenco(codCenco);
      if (!p) {
        p = new Producto();
        p.vigente = true;
        p.empresa = this.empresa;
      }

      p.nombre = nombre;
      p.codCenco = codCenco;
      p.codigo = codigo;
      p.peso = peso;

      const box = new Box();

      box.largo = largo;
      box.ancho = ancho;
      box.alto = alto;

      p.box = box;

      await repo.save(p);
    } else {
      const e = `Producto inválido: ${codCenco}`;

      const status: EntityStatus = {
        codigo: codCenco,
        descripcion: e,
      };
      this.statusLines.push(status);
    }

    const status: EntityStatus = {
      codigo: cod,
      descripcion: '',
    };

    return status;
  }

  async ordenFromJSON(json: any[]): Promise<OrdenCompra> {
    const oc = new OrdenCompra();
    oc.lineas = await Promise.all(json.map((row) => this.rowToLinea(row)));

    return oc;
  }
  async rowToLinea(row: any): Promise<LineaDetalle> {
    const l = new LineaDetalle();

    return l;
  }
  async findByCodCenco(codCenco: string): Promise<Producto | null> {
    return dataSource.getRepository(Producto).findOne({
      where: { codCenco, empresa: { id: this.empresa.id } },
      relations: { box: true },
    });
  }
  async findById(id: number): Promise<Producto | null> {
    return dataSource.getRepository(Producto).findOne({
      where: { id, empresa: { id: this.empresa.id } },
      relations: { box: true },
    });
  }
  async findByCodigo(codigo: string): Promise<Producto | null> {
    return dataSource.getRepository(Producto).findOne({
      where: { codigo, empresa: { id: this.empresa.id } },
      relations: { box: true },
    });
  }
}

export function firstSheetAsJSON(path: string): Array<any> {
  let workbook;
  try {
    workbook = xlsx.readFile(path);
  } catch (error) {
    throw Error('Archivo no es excel');
  }
  const sheet_name_list = workbook.SheetNames;
  const hoja = workbook.Sheets[sheet_name_list[0]];

  const json = xlsx.utils.sheet_to_json(hoja);
  if (!Array.isArray(json)) throw Error('Planilla inválida');
  if (json.length === 0) throw Error('Planilla inválida');

  const row = json[0];

  return json;
}

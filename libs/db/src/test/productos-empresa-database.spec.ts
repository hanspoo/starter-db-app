import { Repository } from "typeorm";
import { dataSource } from "../lib/data-source";
import { Producto } from "../lib/entity/producto.entity";
import { Empresa } from "../lib/entity/auth/empresa.entity";
import { CODIGO_PROD, inicializarCencosud } from "../lib/inicializarCencosud";

let p1: Producto, p2: Producto, p3: Producto, e1: Empresa, e2: Empresa;
let repoProd: Repository<Producto>, repoEmpresa: Repository<Empresa>;

beforeAll(async () => {
  await inicializarCencosud();
  repoProd = dataSource.getRepository(Producto);
  repoEmpresa = dataSource.getRepository(Empresa);
});
beforeEach(async () => {
  // await repoProd.manager.query('delete from empresa');
  //   repoEmpresa.clear();
  const templateProd = (await repoProd.findOne({
    where: { codigo: CODIGO_PROD },
  })) as Partial<Producto>;
  if (templateProd && templateProd.id) delete templateProd.id;
  p1 = repoProd.create({
    ...templateProd,
    nombre: "Velas 1",
    codCenco: "x",
    codigo: "y",
  });
  p2 = repoProd.create({
    ...templateProd,
    nombre: "Velas 1",
    codCenco: "c",
    codigo: "d",
  });
  p3 = repoProd.create({
    ...templateProd,
    nombre: "Globos 2",
    codCenco: "e",
    codigo: "f",
  });

  e1 = repoEmpresa.create({
    nombre: "Jupiter",
    identLegal: "1-9",
    productos: [],
  });
  e2 = repoEmpresa.create({
    nombre: "Saturno",
    identLegal: "3-5",
    productos: [],
  });
});

describe("cada empresa tiene sus propios productos", () => {
  it("debe lanzar excepción con dos productos del mismo nombre al salvar", async () => {
    const f = async () => {
      e1.productos.push(p1);
      e1.productos.push(p2);
      await repoEmpresa.save(e1);
    };

    expect(f()).rejects.toThrow();
  });
});

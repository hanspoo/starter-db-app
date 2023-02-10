import { Repository } from "typeorm";
import { dataSource } from "../lib/data-source";
import { Producto } from "../lib/entity/producto.entity";
import { Empresa } from "../lib/entity/auth/empresa.entity";
import { inicializarCencosud } from "../lib/inicializarCencosud";

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
    where: { codigo: "1234567" },
  })) as Partial<Producto>;
  if (templateProd) delete templateProd.id;
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
  it("dos empresas diferentes pueden tener productos con el mismo nombre", () => {
    e1.agregarProducto(p1);
    e2.agregarProducto(p2);
  });
  describe("la misma empresa", () => {
    it("debe lanzar excepción con dos productos del mismo nombre", () => {
      const f = () => {
        e1.agregarProducto(p1);
        e1.agregarProducto(p2);
      };

      expect(f).toThrow();
    });
    it("debe lanzar excepción con dos productos del mismo código cenco", () => {
      const f = () => {
        e1.agregarProducto(
          repoProd.create({ nombre: "Velas 1", codCenco: "abc" })
        );
        e1.agregarProducto(
          repoProd.create({ nombre: "Velas 2", codCenco: "abc" })
        );
      };

      expect(f).toThrow();
    });

    it("debe pasar bien con dos productos distinto nombre", () => {
      //   const e2 = await repoEmpresa.save(repoEmpresa.create({ nombre: 'Orion' }));

      e1.agregarProducto(p1);
      e1.agregarProducto(p3);
    });
  });
});
// ('el mismo rut y nombre de producto puede estar en varias empresas');
// ('el mismo rut y nombre deben ser únicos en la misma empresa');

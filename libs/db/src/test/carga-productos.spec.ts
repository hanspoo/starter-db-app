import { randomBytes } from "crypto";
import { dataSource, Empresa, inicializarCencosud, ProductoService } from "..";
import { StatusCode } from "../lib/StatusCode";

jest.setTimeout(20000);
const repo = dataSource.getRepository(Empresa);

let e1: Empresa, e2: Empresa;

beforeAll(async () => {
  await inicializarCencosud();
  e1 = await crearEmpresaRandom();
  e2 = await crearEmpresaRandom();
});
beforeEach(async () => {
  await dataSource.query("delete from producto");
});

/*
Hay que alim
*/

describe("carga productos", () => {
  it("hay un producto, retorna una línea de status", async () => {
    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    expect(result.length).toBe(1);
  });
  it("cada e1 tiene su propia base de datos de productos", async () => {
    await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    await new ProductoService(e2).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    expect(e2).not.toEqual(e1);

    expect((await new ProductoService(e1).findAll()).length).toBe(1);
    expect((await new ProductoService(e2).findAll()).length).toBe(1);
  });
  it("hay un producto valido, retorna una línea de status valido", async () => {
    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    expect(result[0].codigo).toBe(StatusCode.OK);
  });
  it("hay un producto línea inválida sin código cenco, error", async () => {
    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/prod-sin-codigo.xlsx"
    );

    expect(result[0].codigo).toBe(StatusCode.ERROR);
  });
  it("producto sin alto en cm", async () => {
    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753-malo-sin-alto.xlsx"
    );

    expect(result[0].codigo).toBe(StatusCode.ERROR);
  });
  it("hay dos productos, retorna dos línea de status", async () => {
    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/dos-productos.xlsx"
    );

    expect(result.length).toBe(2);
  });
  it("crea un producto cuando es valido", async () => {
    let productos = await new ProductoService(e1).findAll();
    expect(productos.length).toBe(0);

    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    expect(result[0].codigo).toBe(StatusCode.OK);
    productos = await new ProductoService(e1).findAll();
    expect(productos.length).toBe(1);
  });
  it("valida todos los campos del producto", async () => {
    let productos = await new ProductoService(e1).findAll();
    expect(productos.length).toBe(0);

    const result = await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );

    productos = await new ProductoService(e1).findAll();
    const p = productos[0];

    expect(p.codigo).toBe("ELY-KP-MONDA*50");
    expect(p.codCenco).toBe("1647753");
    expect(p.nombre).toBe("MONDADIENTES");
    expect(p.peso).toBe(900);
    expect(p.box.largo).toBe(20);
    expect(p.box.ancho).toBe(20);
    expect(p.box.alto).toBe(9);
  });
  it("si se procesa de nuevo, se actualiza no crea dos", async () => {
    await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );
    await new ProductoService(e1).cargarPlanilla(
      "fixtures/producto-1647753.xlsx"
    );
    const productos = await new ProductoService(e1).findAll();

    expect(productos.length).toBe(1);
  });
  it("carga los 136 productos", async () => {
    await new ProductoService(e1).cargarPlanilla("fixtures/productos.xlsx");
    const productos = await new ProductoService(e1).findAll();

    // hay dos sin código
    expect(productos.length).toBe(134);
  });
});

async function crearEmpresaRandom(): Promise<Empresa> {
  const nombre = randomBytes(6).toString("hex");
  return repo.save(
    repo.create({
      nombre,
    })
  );
}

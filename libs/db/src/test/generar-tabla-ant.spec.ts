import { capitalize } from 'lodash';
import { dataSource } from '../lib/data-source';
import { OrdenCompra } from '../lib/entity/orden-compra.entity';

beforeAll(async () => {
  await dataSource.initialize();
});
it('generar tabla ant', () => {
  const o: OrdenCompra = new OrdenCompra();
  const meta = dataSource.getMetadata(OrdenCompra);
  // console.log(meta.columns);
  const cols = meta.columns.map((c) =>
    col({
      entity: 'OrdenCompra',
      name: c.propertyName,
      type: c.type.toString(),
    })
  );

  console.log('[' + cols.join(',') + ']');
});

it('generar vista detalle ant', () => {
  const o: OrdenCompra = new OrdenCompra();
  const meta = dataSource.getMetadata(OrdenCompra);
  // console.log(meta.columns);
  const cols = meta.columns.map((c) =>
    detail({
      entity: 'OrdenCompra',
      name: c.propertyName,
      type: c.type.toString(),
    })
  );

  console.log(
    `  <Descriptions title="OrdenCompra" bordered>${cols.join(
      ''
    )}</Descriptions>`
  );
});

type Col = {
  entity: string;
  name: string;
  type: string;
};
function col(s: Col) {
  const title = capitalize(s.name);
  // console.log(s.type);

  const comparador =
    s.type.indexOf('Number') !== -1
      ? `a.${s.name} - b.${s.name}`
      : `a.${s.name}.localeCompare(b.${s.name})`;

  return `{ title: "${title}",  dataIndex: "${s.name}", sorter: (a: OrdenCompra, b: OrdenCompra) => {   return ${comparador}  } }`;
}
function detail(s: Col) {
  const title = capitalize(s.name);
  // console.log(s.type);

  return `<Descriptions.Item label="${title}">{o.${s.name}}</Descriptions.Item>`;
}

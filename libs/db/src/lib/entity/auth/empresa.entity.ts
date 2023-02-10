import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from "typeorm";
import { FieldsMapper } from "../campos/FieldsMapper";

import { Cliente } from "../cliente.entity";
import { Producto } from "../producto.entity";
import { ProtoPallet } from "../proto-pallet.entity";
import { Usuario } from "./usuario.entity";

@Entity()
export class Empresa {
  @OneToMany(() => FieldsMapper, (prod) => prod.empresa, {
    cascade: true,
    onDelete: "CASCADE",
  })
  fieldMappers: FieldsMapper[];
  agregarCliente(cliente: Cliente) {
    // El salvado en cascade de la empresa le agrega el id al cliente
    if (
      this.clientes.find(
        (c) =>
          c.nombre === cliente.nombre || c.identLegal === cliente.identLegal
      )
    )
      throw Error(
        `Empresa ${this.nombre} no puede tener dos clientes mismo nombre o ident legal`
      );
    this.clientes.push(cliente);
  }

  agregarProducto(producto: Producto) {
    // El salvado en cascade de la empresa le agrega el id al producto
    if (
      this.productos.find(
        (c) =>
          c.nombre === producto.nombre ||
          c.codCenco === producto.codCenco ||
          c.codigo === producto.codigo
      )
    )
      throw Error(
        `Empresa ${this.nombre} no puede tener dos productos mismo nombre o código cenco o código interno`
      );
    this.productos.push(producto);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  identLegal?: string;

  // @OneToOne(() => Box, { cascade: ['insert'], onDelete: 'CASCADE' })

  @OneToMany(() => Cliente, (cliente) => cliente.empresa, {
    cascade: true,
  })
  clientes: Cliente[];

  @OneToMany(() => Producto, (prod) => prod.empresa, {
    cascade: true,
    onDelete: "CASCADE",
  })
  productos: Producto[];

  @OneToMany(() => Usuario, (u) => u.empresa, { cascade: true })
  usuarios: Usuario[];

  @OneToMany(() => ProtoPallet, (u) => u.empresa, { cascade: true })
  protoPallets: ProtoPallet[];

  // @OneToMany(() => OrdenCompra, (orden) => orden.comprador)
  // ordenesEnviadas: OrdenCompra[];

  // @OneToMany(() => OrdenCompra, (orden) => orden.vendedor)
  // ordenesRecibidas: OrdenCompra[];
}

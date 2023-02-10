import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { LineaDetalle } from './linea-detalle.entity';
import { Pallet } from './pallet.entity';
import { UnidadNegocio } from './unidad-negocio.entity';
import { Pedido } from './pedido.entity';
import { Caja } from './caja.entity';
import { Cliente } from './cliente.entity';

@Entity()
@Unique('numero-orden-unico', ['cliente.id', 'numero']) //
export class OrdenCompra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: string;

  @Column()
  emision: string;

  @Column()
  entrega: string;

  @ManyToOne(() => UnidadNegocio, (unidad) => unidad.ordenes, {
    nullable: false,
  })
  unidad: UnidadNegocio;

  @OneToMany(() => LineaDetalle, (linea) => linea.ordenCompra, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  lineas: LineaDetalle[];

  @ManyToOne(() => Cliente, (cli) => cli.ordenes, { nullable: false })
  cliente: Cliente;

  @OneToMany(() => Pallet, (pallet) => pallet.ordenCompra, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pallets: Pallet[];

  @ManyToOne(() => Pedido, (pedido) => pedido.ordenes, { nullable: true })
  pedido?: Pedido;

  static expandirCajas(orden: OrdenCompra) {
    orden.lineas.forEach((linea) => {
      if (!linea.cajas) linea.cajas = [];
      if (linea.cajas.length === linea.cantidad) return;
      for (let index = 0; index < linea.cantidad; index++) {
        const caja = new Caja();
        caja.linea = linea;
        linea.cajas.push(caja);
      }
    });
  }
}

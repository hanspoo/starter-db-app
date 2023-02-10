import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { Local } from './local.entity';
import { Producto } from './producto.entity';
import { EstadoLinea } from '@flash-ws/api-interfaces';
import { Caja } from './caja.entity';

@Entity()
export class LineaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cantidad: number;

  @ManyToOne(() => OrdenCompra, (orden) => orden.lineas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  ordenCompra: OrdenCompra;

  @ManyToOne(() => Producto, (prod) => prod.lineas, {
    nullable: false,
  })
  producto: Producto;

  @Column()
  productoId?: number;

  @Column()
  ordenCompraId?: string;

  @ManyToOne(() => Local, (local) => local.lineas, { nullable: false })
  local: Local;

  @Column()
  localId?: number;

  @Column('varchar')
  estado: EstadoLinea = EstadoLinea.Nada;

  @OneToMany(() => Caja, (caja) => caja.linea, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cajas: Caja[];
}

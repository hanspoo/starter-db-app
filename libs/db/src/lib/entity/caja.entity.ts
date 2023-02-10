import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LineaDetalle } from './linea-detalle.entity';
import { Pallet } from './pallet.entity';

@Entity()
export class Caja {
  volumen() {
    const linea = this.linea;
    if (!linea) throw Error(`La caja ${this.id} no tiene línea de detalle`);
    const producto = linea.producto;
    if (!producto) throw Error(`La línea ${linea.id} no tiene producto`);
    const box = producto.box;
    if (!box) throw Error(`El producto ${producto.nombre} no tiene box`);
    return box.volumen;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LineaDetalle, (linea) => linea.cajas, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  linea: LineaDetalle;

  @ManyToOne(() => Pallet, (pallet) => pallet.cajas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  pallet: Pallet;
}

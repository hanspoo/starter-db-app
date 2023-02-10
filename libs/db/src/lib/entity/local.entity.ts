import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { UnidadNegocio } from './unidad-negocio.entity';
import { LineaDetalle } from './linea-detalle.entity';
import { Pallet } from './pallet.entity';

@Entity()
@Unique('cod_local_unidad', ['nombre', 'unidad'])
@Unique('nombre_local_unidad', ['codigo', 'unidad'])
export class Local {
  static from(id: number, nombre: string): Local {
    const local = new Local();
    local.id = id;
    local.nombre = nombre;
    return local;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  codigo: string;

  @Column()
  nombre: string;

  @ManyToOne(() => UnidadNegocio, (unidad) => unidad.locales)
  unidad: UnidadNegocio;

  @OneToMany(() => LineaDetalle, (linea) => linea.local)
  lineas: LineaDetalle[];

  @OneToMany(() => Pallet, (pallet) => pallet.local, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  pallets: Pallet[];
}

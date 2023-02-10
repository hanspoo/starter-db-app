import { Campo, TipoPlanilla } from '@flash-ws/api-interfaces';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Empresa } from '../auth/empresa.entity';

import { FieldMap } from './FieldMap';

@Entity()
@Unique('nombre-config-planilla-empresa', ['nombre', 'empresa.id']) //
export class FieldsMapper {
  static from(nombre: string): FieldsMapper {
    const cp = new FieldsMapper();
    cp.nombre = nombre;
    cp.campos = [];
    return cp;
  }
  addCampo(campo: Campo, columna: number) {
    const cc = FieldMap.from(campo, columna);
    // cc.fieldsMapper = this;
    this.campos.push(cc);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column('text', { nullable: false })
  tipo: TipoPlanilla;

  @OneToMany(() => FieldMap, (c) => c.fieldsMapper, { cascade: true })
  campos: Array<FieldMap>;

  @ManyToOne(() => Empresa, (empresa) => empresa.fieldMappers, {
    nullable: false,
  })
  empresa: Empresa;
}

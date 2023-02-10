import { Campo } from '@flash-ws/api-interfaces';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';

import { FieldsMapper } from './FieldsMapper';

@Entity()
export class FieldMap {
  @ManyToOne(() => FieldsMapper, { nullable: false })
  fieldsMapper: FieldsMapper;

  static from(campo: Campo, columna: number): FieldMap {
    const cc = new FieldMap();
    cc.campo = campo;
    cc.columna = columna;
    return cc;
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('text')
  campo: Campo;

  @Column()
  columna: number;
}

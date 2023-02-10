import { timeStamp } from 'console';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity()
export class Box {
  constructor(params?: { largo: number; ancho: number; alto: number }) {
    if (params) {
      this.largo = params.largo;
      this.ancho = params.ancho;
      this.alto = params.alto;
    }
  }
  static clone(box: Box): Box {
    if (!box) throw Error(`No viene box para clonar`);
    const b = new Box();

    b.largo = box.largo;
    b.ancho = box.ancho;
    b.alto = box.alto;

    return b;
  }
  static from({
    largo,
    ancho,
    alto,
  }: {
    largo: number;
    ancho: number;
    alto: number;
  }): Box {
    const b = new Box();

    b.largo = largo;
    b.ancho = ancho;
    b.alto = alto;

    return b;
  }
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('decimal', { precision: 5, scale: 2 })
  largo: number;

  @Column('decimal', { precision: 5, scale: 2 })
  ancho: number;

  @Column('decimal', { precision: 5, scale: 2 })
  alto: number;

  @BeforeInsert()
  @BeforeUpdate()
  validate() {
    if (this.largo > 200 || this.ancho > 200 || this.alto > 200)
      throw Error(
        `medidas inválidas:${this.largo}x${this.ancho}x${this.alto}, recuerde que las medidas son en centímetros`
      );
  }

  get volumen(): number {
    return (this.largo * this.ancho * this.alto) / 1000;
  }
}

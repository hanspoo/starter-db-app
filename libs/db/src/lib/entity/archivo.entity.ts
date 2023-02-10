import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Archivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  destination: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  size: number;
}

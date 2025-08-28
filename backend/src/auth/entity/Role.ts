import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Role extends Model {
  @Column
  name: string;
}

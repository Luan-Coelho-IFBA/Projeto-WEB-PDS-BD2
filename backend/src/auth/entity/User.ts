import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column
  email: string;

  @Column
  hashedPassword: string;

  @Column({
    defaultValue: false,
  })
  isVerified: boolean;
}

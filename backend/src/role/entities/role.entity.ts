import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from 'src/auth/entities/user.entity';

@Table
export class Role extends Model {
  @Column
  name: string;

  @HasMany(() => User)
  users: User[];
}

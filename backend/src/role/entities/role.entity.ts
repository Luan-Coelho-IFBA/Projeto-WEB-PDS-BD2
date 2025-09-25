import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { User } from '../../auth/entities/user.entity';

@Table
export class Role extends Model {
  @Column({ unique: true })
  name: string;

  @HasMany(() => User)
  users: User[];
}

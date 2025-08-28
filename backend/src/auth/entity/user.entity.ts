import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from 'src/roles/entity/role.entity';

@Table
export class User extends Model {
  @Column
  name: string;

  @Column({ unique: true })
  email: string;

  @Column
  hashedPassword: string;

  @Column({
    defaultValue: false,
  })
  isVerified: boolean;

  @ForeignKey(() => Role)
  @Column
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;
}

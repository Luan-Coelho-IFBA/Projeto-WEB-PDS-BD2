import { Controller, Param, Patch } from '@nestjs/common';
import { ADMIN } from 'consts';
import { Authenticate } from 'src/auth/autenticate.decorator';
import { RoleService } from './role.service';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Patch('jornalista/:userId')
  @Authenticate(ADMIN)
  async changeToJornalista(@Param('userId') userId: number) {
    return await this.roleService.changeToJornalista(userId);
  }

  @Patch('leitor/:userId')
  @Authenticate(ADMIN)
  async changeToLeitor(@Param('userId') userId: number) {
    return await this.roleService.changeToLeitor(userId);
  }
}

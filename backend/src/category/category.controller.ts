import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Authenticate } from 'src/auth/autenticate.decorator';
import { ADMIN } from 'consts';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Authenticate(ADMIN)
  async create(@Body() createCategoryDto: CategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @Authenticate(ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Authenticate(ADMIN)
  async remove(@Param('id') id: string) {
    return await this.categoryService.remove(+id);
  }
}

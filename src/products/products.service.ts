import { Injectable, OnModuleInit, Logger, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from "../common";

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(ProductsService.name);

  create(createProductDto: CreateProductDto) {
    return this.product.create(
      {
        data: createProductDto
      }
    )
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count();
    const lastPage = Math.ceil( totalPages/limit )

    return {
      data: await this.product.findMany({
        skip: ( page - 1 ) * limit,
        take: limit,
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      }
    }
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id: id.toString() },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID #${id} no encontrado`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    return this.product.update({
      where: { id: id.toString() },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.delete({
      where: { id: id.toString() },
    });
  }

  onModuleInit(): any {
    this.$connect();
    this.logger.log('Base de datos conectada');
  }
}

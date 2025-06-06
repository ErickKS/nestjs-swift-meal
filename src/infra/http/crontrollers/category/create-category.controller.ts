import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createCategoryBodySchema = z.object({
  name: z.string().min(1),
})
type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/categories')
@ApiTags('Categories')
export class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createCategoryBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create new category',
    description: 'This endpoint allows you to create an category.',
  })
  async handle(@Body() body: CreateCategoryBodySchema) {
    try {
      await this.createCategory.execute({ name: body.name })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

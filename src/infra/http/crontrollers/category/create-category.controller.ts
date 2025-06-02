import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const exampleBodySchema = z.object({
  name: z.string().min(1),
})
type ExampleBodySchema = z.infer<typeof exampleBodySchema>

@Controller('/category')
@ApiTags('Category')
export class CreateCategoryController {
  constructor(private readonly createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(exampleBodySchema))
  @ApiBody({ schema: zodToOpenAPI(exampleBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create new category',
    description: 'This endpoint allows you to create an category.',
  })
  async handle(@Body() body: ExampleBodySchema) {
    try {
      await this.createCategory.execute({ name: body.name })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

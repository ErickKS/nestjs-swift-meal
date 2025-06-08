import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { Body, Controller, HttpCode, Patch, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const updateCategoryBodySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
})
type UpdateCategoryBodySchema = z.infer<typeof updateCategoryBodySchema>

@Controller('/categories')
@ApiTags('Categories')
export class UpdateCategoryController {
  constructor(private readonly updateCategory: UpdateCategoryUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(updateCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(updateCategoryBodySchema) })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Update category',
    description: 'This endpoint allows you to update an category.',
  })
  async handle(@Body() body: UpdateCategoryBodySchema) {
    const { categoryId, name } = body
    try {
      await this.updateCategory.execute({ categoryId, name })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

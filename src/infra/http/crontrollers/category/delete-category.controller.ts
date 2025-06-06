import { DeleteCategoryUseCase } from '@/application/category/use-cases/delete-category'
import { Body, Controller, Delete, HttpCode, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const deleteCategoryBodySchema = z.object({
  categoryId: z.string().uuid(),
})
type DeleteCategoryBodySchema = z.infer<typeof deleteCategoryBodySchema>

@Controller('/categories')
@ApiTags('Categories')
export class DeleteCategoryController {
  constructor(private readonly deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(deleteCategoryBodySchema))
  @ApiBody({ schema: zodToOpenAPI(deleteCategoryBodySchema) })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Delete category',
    description: 'This endpoint allows you to delete an category.',
  })
  async handle(@Body() body: DeleteCategoryBodySchema) {
    const { categoryId } = body
    try {
      await this.deleteCategory.execute({ categoryId })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

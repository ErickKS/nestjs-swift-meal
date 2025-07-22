import { DeleteCategoryUseCase } from '@/application/category/use-cases/delete-category'
import { Controller, Delete, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const deleteCategoryParamSchema = z.object({
  categoryId: z.string().uuid(),
})
type DeleteCategoryParamSchema = z.infer<typeof deleteCategoryParamSchema>

@Controller('/categories/:categoryId')
@ApiTags('Categories')
export class DeleteCategoryController {
  constructor(private readonly deleteCategory: DeleteCategoryUseCase) {}

  @Delete()
  @HttpCode(204)
  @DeleteCategoryController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ param: deleteCategoryParamSchema }))
  async handle(@Param() params: DeleteCategoryParamSchema) {
    const { categoryId } = params
    try {
      await this.deleteCategory.execute({ categoryId })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Delete category',
        description: 'This endpoint allows you to delete an category.',
      }),
      ApiParamFromZod(deleteCategoryParamSchema),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

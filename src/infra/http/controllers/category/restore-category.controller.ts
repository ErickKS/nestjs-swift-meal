import { RestoreCategoryUseCase } from '@/application/category/use-cases/restore-category'
import { Controller, HttpCode, Param, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const restoreCategoryParamsSchema = z.object({
  categoryId: z.string().uuid(),
})
type RestoreCategoryParamsSchema = z.infer<typeof restoreCategoryParamsSchema>

@Controller('/categories/:categoryId/restore')
@ApiTags('Categories')
export class RestoreCategoryController {
  constructor(private readonly restoreCategory: RestoreCategoryUseCase) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(restoreCategoryParamsSchema))
  @ApiParamFromZod(restoreCategoryParamsSchema)
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Restore a deleted category',
    description: 'This endpoint allows you to restore a category by ID.',
  })
  async handle(@Param() params: RestoreCategoryParamsSchema) {
    const { categoryId } = params
    try {
      await this.restoreCategory.execute({ categoryId })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

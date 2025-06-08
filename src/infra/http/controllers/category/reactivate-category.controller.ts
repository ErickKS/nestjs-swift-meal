import { ReactivateCategoryUseCase } from '@/application/category/use-cases/reactivate-category'
import { Controller, HttpCode, Param, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const reactivateCategoryParamsSchema = z.object({
  categoryId: z.string().uuid(),
})
type ReactivateCategoryParamsSchema = z.infer<typeof reactivateCategoryParamsSchema>

@Controller('/categories/:categoryId/reactivate')
@ApiTags('Categories')
export class ReactivateCategoryController {
  constructor(private readonly reactivateCategory: ReactivateCategoryUseCase) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(reactivateCategoryParamsSchema))
  @ApiParamFromZod(reactivateCategoryParamsSchema)
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Reactivate a deleted category',
    description: 'This endpoint allows you to reactivate a category by ID.',
  })
  async handle(@Param() params: ReactivateCategoryParamsSchema) {
    const { categoryId } = params
    try {
      await this.reactivateCategory.execute({ categoryId })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

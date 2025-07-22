import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { Body, Controller, HttpCode, Param, Patch, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const updateCategoryParamsSchema = z.object({
  categoryId: z.string().uuid(),
})
type UpdateCategoryParamsSchema = z.infer<typeof updateCategoryParamsSchema>

const updateCategoryBodySchema = z.object({
  name: z.string().min(1),
})
type UpdateCategoryBodySchema = z.infer<typeof updateCategoryBodySchema>

@Controller('/categories/:categoryId')
@ApiTags('Categories')
export class UpdateCategoryController {
  constructor(private readonly updateCategory: UpdateCategoryUseCase) {}

  @Patch()
  @HttpCode(204)
  @UpdateCategoryController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      body: updateCategoryBodySchema,
      param: updateCategoryParamsSchema,
    })
  )
  async handle(@Param() param: UpdateCategoryParamsSchema, @Body() body: UpdateCategoryBodySchema) {
    try {
      await this.updateCategory.execute({ categoryId: param.categoryId, ...body })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Update category',
        description: 'This endpoint allows you to update an category.',
      }),
      ApiParamFromZod(updateCategoryParamsSchema),
      ApiBody({ schema: zodToOpenAPI(updateCategoryBodySchema) }),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

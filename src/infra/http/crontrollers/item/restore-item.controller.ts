import { RestoreItemUseCase } from '@/application/item/use-cases/restore-item'
import { Controller, HttpCode, Param, Post, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const restoreItemParamsSchema = z.object({
  itemId: z.string().uuid(),
})
type RestoreItemParamsSchema = z.infer<typeof restoreItemParamsSchema>

@Controller('/items/:itemId/restore')
@ApiTags('Items')
export class RestoreItemController {
  constructor(private readonly restoreItem: RestoreItemUseCase) {}

  @Post()
  @HttpCode(204)
  @RestoreItemController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: restoreItemParamsSchema,
    })
  )
  async handle(@Param() param: RestoreItemParamsSchema) {
    try {
      await this.restoreItem.execute(param)
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Restore item',
        description: 'This endpoint allows you to restore an item.',
      }),
      ApiParamFromZod(restoreItemParamsSchema),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

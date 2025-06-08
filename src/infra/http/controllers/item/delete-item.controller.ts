import { DeleteItemUseCase } from '@/application/item/use-cases/delete-item'
import { Controller, Delete, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const deleteItemParamsSchema = z.object({
  itemId: z.string().uuid(),
})
type DeleteItemParamsSchema = z.infer<typeof deleteItemParamsSchema>

@Controller('/items/:itemId')
@ApiTags('Items')
export class DeleteItemController {
  constructor(private readonly deleteItem: DeleteItemUseCase) {}

  @Delete()
  @HttpCode(204)
  @DeleteItemController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: deleteItemParamsSchema,
    })
  )
  async handle(@Param() param: DeleteItemParamsSchema) {
    try {
      await this.deleteItem.execute(param)
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Delete item',
        description: 'This endpoint allows you to delete an item.',
      }),
      ApiParamFromZod(deleteItemParamsSchema),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

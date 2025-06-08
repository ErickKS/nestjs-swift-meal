import { UpdateItemUseCase } from '@/application/item/use-cases/update-item'
import { Body, Controller, HttpCode, Param, Patch, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request--validation-pipe'

const updateItemParamsSchema = z.object({
  itemId: z.string().uuid(),
})
type UpdateItemParamsSchema = z.infer<typeof updateItemParamsSchema>

const updateItemBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  active: z.boolean().optional(),
})
type UpdateItemBodySchema = z.infer<typeof updateItemBodySchema>

@Controller('/items/:itemId')
@ApiTags('Items')
export class UpdateItemController {
  constructor(private readonly updateItem: UpdateItemUseCase) {}

  @Patch()
  @HttpCode(204)
  @UsePipes(
    new ZodRequestValidationPipe({
      body: updateItemBodySchema,
      param: updateItemParamsSchema,
    })
  )
  @ApiParamFromZod(updateItemParamsSchema)
  @ApiBody({ schema: zodToOpenAPI(updateItemBodySchema) })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Update item',
    description: 'This endpoint allows you to update an item.',
  })
  async handle(@Param() param: UpdateItemParamsSchema, @Body() body: UpdateItemBodySchema) {
    try {
      await this.updateItem.execute({ itemId: param.itemId, ...body })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

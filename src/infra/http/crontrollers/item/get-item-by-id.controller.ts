import { GetItemByIdUseCase } from '@/application/item/use-cases/get-item-by-id'
import { Controller, Get, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { ItemPresenter } from '../../presenters/item-presenter'

const getItemByIdParamsSchema = z.object({
  itemId: z.string().uuid(),
})
type GetItemByIdParamsSchema = z.infer<typeof getItemByIdParamsSchema>

const getItemByIdResponseSchema = z.object({
  item: z.object({
    id: z.string().uuid(),
    code: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    categoryId: z.string(),
    active: z.boolean(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    deletedAt: z.string().datetime().nullable(),
  }),
})

@Controller('/items/:itemId')
@ApiTags('Items')
export class GetItemByIdController {
  constructor(private readonly getItemById: GetItemByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @GetItemByIdController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: getItemByIdParamsSchema,
    })
  )
  async handle(@Param() param: GetItemByIdParamsSchema) {
    try {
      const result = await this.getItemById.execute(param)
      return {
        item: ItemPresenter.toHTTP(result.item),
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get item by id',
        description: 'This endpoint allows you get item details by id.',
      }),
      ApiParamFromZod(getItemByIdParamsSchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getItemByIdResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

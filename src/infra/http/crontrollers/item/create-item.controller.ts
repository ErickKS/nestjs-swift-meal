import { CreateItemUseCase } from '@/application/item/use-cases/create-item'
import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const createItemBodySchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
})
type CreateItemBodySchema = z.infer<typeof createItemBodySchema>

@Controller('/items')
@ApiTags('Items')
export class CreateItemController {
  constructor(private readonly createItem: CreateItemUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodRequestValidationPipe({ body: createItemBodySchema }))
  @ApiBody({ schema: zodToOpenAPI(createItemBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create new item',
    description: 'This endpoint allows you to create an item.',
  })
  async handle(@Body() body: CreateItemBodySchema) {
    try {
      await this.createItem.execute(body)
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

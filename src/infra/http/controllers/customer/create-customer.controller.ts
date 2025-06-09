import { CreateCustomerUseCase } from '@/application/customer/use-cases/create-customer'
import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const createCustomerBodySchema = z.object({
  name: z.string().min(1),
  document: z.string().min(11).max(14),
  email: z.string().email(),
})
type CreateCustomerBodySchema = z.infer<typeof createCustomerBodySchema>

@Controller('/customers')
@ApiTags('Customers')
export class CreateCustomerController {
  constructor(private readonly createCustomer: CreateCustomerUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createCustomerBodySchema))
  @ApiBody({ schema: zodToOpenAPI(createCustomerBodySchema) })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Unprocessable Entity' })
  @ApiOperation({
    summary: 'Create new customer',
    description: 'This endpoint allows you to create a customer.',
  })
  async handle(@Body() body: CreateCustomerBodySchema) {
    try {
      await this.createCustomer.execute(body)
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }
}

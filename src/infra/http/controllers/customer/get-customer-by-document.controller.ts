import { GetCustomerByDocumentUseCase } from '@/application/customer/use-cases/get-customer-by-document'
import { Controller, Get, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { CustomerPresenter } from '../../presenters/customer-presenter'

const getCustomerByDocumentParamsSchema = z.object({
  document: z.string().min(11).max(11),
})
type GetCustomerByDocumentParamsSchema = z.infer<typeof getCustomerByDocumentParamsSchema>

const getCustomerByDocumentResponseSchema = z.object({
  customer: z.object({
    id: z.string().uuid(),
    name: z.string(),
    document: z.string(),
    email: z.string(),
    createdAt: z.string().datetime(),
  }),
})

@Controller('/customers/:document')
@ApiTags('Customers')
export class GetCustomerByDocumentController {
  constructor(private readonly getCustomerByDocument: GetCustomerByDocumentUseCase) {}

  @Get()
  @HttpCode(200)
  @GetCustomerByDocumentController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: getCustomerByDocumentParamsSchema,
    })
  )
  async handle(@Param() param: GetCustomerByDocumentParamsSchema) {
    try {
      const result = await this.getCustomerByDocument.execute(param)
      return {
        customer: CustomerPresenter.toHTTP(result.customer),
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get customer by document',
        description: 'This endpoint allows you get customer details by document.',
      }),
      ApiParamFromZod(getCustomerByDocumentParamsSchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getCustomerByDocumentResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}

import { randomUUID } from 'node:crypto'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const exampleBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
})
type ExampleBodySchema = z.infer<typeof exampleBodySchema>

const exampleResponseSchema = z.object({
  userId: z.string().uuid(),
})

@Controller('/example')
@ApiTags('Auth')
export class ExampleController {
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(exampleBodySchema))
  @ApiBody({ schema: zodToOpenAPI(exampleBodySchema) })
  @ApiResponse({ status: 201, description: 'Created', schema: zodToOpenAPI(exampleResponseSchema) })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiOperation({
    summary: 'Example',
    description: 'This endpoint allows you to see an example.',
  })
  async handle(@Body() body: ExampleBodySchema) {
    return {
      userId: randomUUID(),
    }
  }
}

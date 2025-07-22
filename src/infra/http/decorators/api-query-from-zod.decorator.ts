import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { ZodObject, ZodTypeAny } from 'zod'

export function ApiQueryFromZod(zodSchema: ZodObject<Record<string, ZodTypeAny>>) {
  const shape = zodSchema.shape
  const decorators = Object.entries(shape).map(([key, zodType]) => {
    return ApiQuery({
      name: key,
      required: !zodType.isOptional(),
      schema: zodToOpenAPI(zodType as ZodTypeAny),
    })
  })
  return applyDecorators(...decorators)
}

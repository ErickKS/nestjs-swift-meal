import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { ZodObject, ZodTypeAny } from 'zod'

export function ApiParamFromZod(zodSchema: ZodObject<Record<string, ZodTypeAny>>) {
  const shape = zodSchema.shape
  const decorators = Object.entries(shape).map(([key, zodType]) => {
    return ApiParam({
      name: key,
      required: !zodType.isOptional(),
      schema: zodToOpenAPI(zodType as ZodTypeAny),
    })
  })
  return applyDecorators(...decorators)
}

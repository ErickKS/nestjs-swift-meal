import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

interface MultiZodSchema {
  body?: ZodSchema
  param?: ZodSchema
  query?: ZodSchema
}

@Injectable()
export class ZodRequestValidationPipe implements PipeTransform {
  constructor(private schemas: MultiZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = this.schemas[metadata.type as keyof MultiZodSchema]
    if (!schema) return value
    try {
      return schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException({
        message: 'Validation failed',
        statusCode: 400,
      })
    }
  }
}

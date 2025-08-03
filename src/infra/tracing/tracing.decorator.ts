import { SpanStatusCode, trace } from '@opentelemetry/api'

export function Traced() {
  const tracer = trace.getTracer('domain-layer')

  return (target: unknown, propertyKey: string | symbol, d: PropertyDescriptor) => {
    const original = d.value
    const className = (target as any)?.constructor?.name ?? 'anonymous'
    const spanName = `${className}.${String(propertyKey)}`
    d.value = async function (...args: unknown[]) {
      return tracer.startActiveSpan(spanName, async span => {
        try {
          span.setAttribute('layer', 'usecase')
          return await original.apply(this, args)
        } catch (err) {
          span.recordException(err as Error)
          span.setStatus({ code: SpanStatusCode.ERROR })
          throw err
        } finally {
          span.end()
        }
      })
    }
  }
}

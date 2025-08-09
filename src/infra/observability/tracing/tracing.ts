import { envSchema } from '@/infra/env/env'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { B3Propagator } from '@opentelemetry/propagator-b3'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'

const env = envSchema.parse(process.env)
const SERVICE_NAME = env.TRACE_SERVICE_NAME
const traceExporter = new OTLPTraceExporter({ url: env.TRACE_EXPORTER_URL })

const tracingService = new NodeSDK({
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pino': {
        logHook: (_span, logRecord) => {
          logRecord[ATTR_SERVICE_NAME] = SERVICE_NAME
        },
      },
    }),
    new PrismaInstrumentation(),
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
  }),
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator(), new B3Propagator()],
  }),
})

export default tracingService

process.on('SIGTERM', async () => {
  try {
    await tracingService.shutdown()
    console.log('Tracing shut down successfully')
  } catch (err) {
    console.error('Error shutting down tracing', err)
  } finally {
    process.exit(0)
  }
})

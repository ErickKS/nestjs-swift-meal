import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { B3Propagator } from '@opentelemetry/propagator-b3'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'

const SERVICE_NAME = 'swift-meal'

const metricReader = new PrometheusExporter({
  port: 8081,
})

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
})

const tracingService = new NodeSDK({
  metricReader,
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

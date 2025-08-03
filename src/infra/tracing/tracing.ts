import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { CompositePropagator, W3CBaggagePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { B3Propagator } from '@opentelemetry/propagator-b3'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'

const metricReader = new PrometheusExporter({
  port: 8081,
})

const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
})

const spanProcessor = new BatchSpanProcessor(traceExporter)

const tracingService = new NodeSDK({
  metricReader,
  spanProcessor: spanProcessor,
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-pino': {
        logHook: (_span, logRecord) => {
          logRecord[ATTR_SERVICE_NAME] = 'swift-meal'
        },
      },
    }),
    new PrismaInstrumentation(),
  ],
  textMapPropagator: new CompositePropagator({
    propagators: [new W3CTraceContextPropagator(), new W3CBaggagePropagator(), new B3Propagator()],
  }),
})

console.log('teste')
export default tracingService

process.on('SIGTERM', () => {
  tracingService
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      err => console.log('Error shutting down SDK', err)
    )
    .finally(() => process.exit(0))
})

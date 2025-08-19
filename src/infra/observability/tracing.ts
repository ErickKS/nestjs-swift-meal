import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions'
import { PrismaInstrumentation } from '@prisma/instrumentation'

if (!process.env.OTEL_SERVICE_NAME) process.env.OTEL_SERVICE_NAME = 'swift-meal'
if (!process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT = 'http://localhost:4318/v1/traces'

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME
const traceExporter = new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT })

const tracingService = new NodeSDK({
  spanProcessor: new BatchSpanProcessor(traceExporter),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingRequestHook: req => {
          const url = req?.url ?? ''
          return url.startsWith('/health') || url.startsWith('/metrics') || url.startsWith('/docs') || url.startsWith('/favicon.ico')
        },
      },
      '@opentelemetry/instrumentation-pino': {
        logHook: (_span, logRecord) => {
          logRecord[ATTR_SERVICE_NAME] = SERVICE_NAME
        },
      },
    }),
    new PrismaInstrumentation()
  ],
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: SERVICE_NAME,
  }),
})

export default tracingService

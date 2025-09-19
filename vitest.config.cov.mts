import swc from 'unplugin-swc'
import { configDefaults, defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

const commonPlugins = [
  tsConfigPaths(),
  swc.vite({
    module: { type: 'es6' },
  }),
]

const coverageCommon = {
  exclude: [
    ...configDefaults.exclude,
    'test/**/*',
    '**/main.ts',
    '**/*.module.ts',
    '**/types/**',
    ''
  ]
}

export default defineConfig({
  test: {
    coverage: {
      ...coverageCommon,
    },
    projects: [
      {
        plugins: commonPlugins,
        test: {
          name: 'unit',
          include: ['**/*.spec.ts'],
          exclude: ['**/*.e2e-spec.ts', ...configDefaults.exclude],
          globals: true,
          root: './'
        }
      },
      {
        plugins: commonPlugins,
        test: {
          name: 'e2e',
          include: ['**/*.e2e-spec.ts'],
          globals: true,
          root: './',
          setupFiles: ['./test/setup-e2e.ts'],
          hookTimeout: 60_000,
          testTimeout: 60_000,
        }
      }
    ]
  }
})
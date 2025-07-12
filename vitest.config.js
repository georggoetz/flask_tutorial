import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: [
      'node_modules',
      '**/node_modules/**',
      '.venv',
      '**/.venv/**',
      'site-packages',
      '**/site-packages/**',
      'dist',
      '**/dist/**'
    ]
  }
})
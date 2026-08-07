import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

// https://eslint.vuejs.org/user-guide/#configuration
export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    // Vite loads vite.config.ts before the `@/` alias exists, so every module the
    // config reaches - directly or transitively - must avoid alias VALUE imports.
    // Type imports are erased before the loader sees them and stay on the alias.
    //
    // Getting this wrong kills the whole build at config-load time with
    // "Cannot find package '@/lib'", an error that names neither the file nor the
    // cause. This rule turns that into a lint error at the point of edit.
    //
    // The file list is maintained by hand and can go stale; the authoritative gate
    // is src/__tests__/build-time-imports.spec.ts, which walks the real import
    // graph. Deliberately absent here: lac-hong.ts and ha-noi-open-1.ts, which
    // import their banner through the alias and are the layer kept OUT of the
    // config's reach precisely so they can.
    name: 'app/no-alias-value-imports-in-build-time-modules',
    files: [
      'src/lib/{contentMarkdown,llmsTxt,sitemap}.ts',
      'src/data/{site,faq}.ts',
      'src/data/{guides,news}/**/*.ts',
      'src/data/tournaments/{types,data}.ts',
      'src/data/tournaments/*.data.ts',
    ],
    ignores: ['**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/**'],
              allowTypeImports: true,
              message:
                'vite.config.ts loads this module before the @/ alias exists, so an alias value import breaks the build. Use a relative import for values; type imports may keep the alias.',
            },
          ],
        },
      ],
    },
  },

  skipFormatting,
)

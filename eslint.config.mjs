import globals from 'globals';
import jsdoc from 'eslint-plugin-jsdoc';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**/*', 'dist/**/*', 'build/**/*', '.venv/**/*', 'htmlcov/**/*', 'flaskr/static/dist/**/*'],
    plugins: {
      jsdoc: jsdoc
    },
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      globals:
        globals.browser
    },
    rules: {
      /* === Best Practices === */
      'no-unused-vars': 'warn',          // Warn about variables that are declared but not used
      'eqeqeq': ['error', 'always'],     // Enforce the use of '===' and '!==' over '==' and '!='
      'curly': 'error',                  // Require curly braces for all control statements

      /* === ES6 Rules === */
      'prefer-const': 'error',           // Prefer 'const' when variables are not reassigned
      'arrow-spacing': ['error', {       // Enforce spaces before and after arrow functions
        'before': true,
        'after': true
      }],
      'no-var': 'error',                 // Disallow the use of 'var'; prefer 'let' or 'const'
      'prefer-arrow-callback': 'error',  // Prefer arrow functions for callbacks where possible
      'no-duplicate-imports': 'error',   // Disallow duplicate imports

      /* === Style Guidelines === */
      'semi': ['error', 'never'],        // No semicolons at the end of statements
      'quotes': ['error', 'single'],     // Enforce the use of single quotes
      'indent': ['error', 2],            // Enforce 2-space indentation
      'space-before-function-paren': ['error', 'never'],  // No pace before function parentheses
      'comma-dangle': ['error', 'never'], // Disallow trailing commas

      /* === JSDoc Rules === */
      'jsdoc/require-description': 'warn',      // Require descriptions in JSDoc comments
      'jsdoc/require-param-description': 'warn', // Require parameter descriptions
      'jsdoc/require-returns-description': 'warn', // Require return descriptions
      'jsdoc/check-param-names': 'error',       // Check parameter names match function signature
      'jsdoc/check-types': 'warn',              // Validate JSDoc types

      /* === Strict Mode === */
      'strict': ['error', 'global']      // Enforce 'use strict' at the global level
    }
  },
];

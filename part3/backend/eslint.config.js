import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import stylisticJs from '@stylistic/eslint-plugin-js';

export default defineConfig([
    {
        languageOptions: {
            globals: {
                ...globals.node,
            }
        },
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            js,
            '@stylistic/js': stylisticJs,
        },
        rules: {
            '@stylistic/js/indent': ['error', 4],
            '@stylistic/js/linebreak-style': ['error', 'unix'],
            '@stylistic/js/quotes': ['error', 'single'],
            '@stylistic/js/semi': ['error', 'always'],
            eqeqeq: 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            'arrow-spacing': ['error', { before: true, after: true }],
            'no-console': 'off',
        },
        extends: ['js/recommended']
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.browser },
    },
    {
        ignores: ['dist/**'],
    },
]);

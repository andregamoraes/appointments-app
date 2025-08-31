import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname
});

/** @type {import('eslint').Linter.FlatConfig[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
    ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
    {
        ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'dist/**', 'coverage/**', 'next-env.d.ts'],
        rules: {
            'prettier/prettier': 'off'
        }
    }
];

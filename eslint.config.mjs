import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
	baseDirectory: process.cwd(),
	recommendedConfig: {
		extends: ['eslint:recommended'],
	},
})

export default [
	...compat.config({
		env: {
			node: true,
			es2023: true,
		},
		extends: ['plugin:prettier/recommended'],
		parserOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'prettier/prettier': 'error',
			'no-unused-vars': 'warn',
			'no-console': 'off',
			indent: ['error', 'tab'], // Enforce tabs for indentation
			'no-mixed-spaces-and-tabs': 'error', // Disallow mixing tabs and spaces
		},
	}),

	...compat.config({
		plugins: ['unicorn'],
		extends: ['plugin:unicorn/recommended'],
		rules: {
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'warn',
			'unicorn/filename-case': [
				'error',
				{
					case: 'camelCase',
				},
			],
		},
	}),

	// Override for specific files (e.g., check-coverage.mjs)
	{
		files: ['.husky/checkCoverage.mjs'],
		rules: {
			'unicorn/no-process-exit': 'off',
		},
	},
]

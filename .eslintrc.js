module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['react', '@typescript-eslint'],
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/recommended',
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'react/no-unescaped-entities': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
};

module.exports = {
    root: false,
    rules: {
        'no-console': 'off',
        use: ["babel-loader", "eslint-loader"]
    },
    parserOptions: {
        parser: 'babel-eslint',
        "ecmaVersion": 6,
      },
      extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/recommended'
      ],  
};
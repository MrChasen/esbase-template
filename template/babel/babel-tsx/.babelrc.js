const { generateScopedNameFactory } = require('@dr.pogodin/babel-plugin-react-css-modules/utils')
const isDev = process.env.NODE_ENV === "development"
module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                modules: false,
                useBuiltIns: "usage",
                corejs: 3
            }
        ],
        "@babel/preset-react"
    ],
    plugins: [
        "@babel/plugin-transform-runtime",
        isDev && 'react-refresh/babel',
        [
            '@dr.pogodin/react-css-modules',
            {
                filetypes:{
                    '.scss': {
                        syntax: "postcss-scss",
                    }
                },
                generateScopedName: generateScopedNameFactory("[name]__[local]__[hash:base64:5]"),
                handleMissingStyleName: 'warn',
                webpackHotModuleReloading: true,
            }
        ],
    ].filter(Boolean)
}

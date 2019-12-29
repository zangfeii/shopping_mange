const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
    //产品处于发布阶段 不显示console.log
    prodPlugins.push("transform-remove-console")
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        "transform-remove-console"
    ],
    //发布产品阶段
    ...prodPlugins
}
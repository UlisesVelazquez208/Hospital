let mix = require('laravel-mix')
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
let webpack = require('webpack');

const path = require('path')
//====set alias for isotope

let plugins = [];

plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));

if(!mix.inProduction()){
    // plugins.push(new BundleAnalyzerPlugin());
}

mix.webpackConfig({
    plugins: plugins,
    resolve: {
        alias: {
            'masonry': 'masonry-layout',
            'isotope': 'isotope-layout',
            'src': path.resolve(__dirname, 'src/'),
            'assets': path.resolve(__dirname, 'src/assets/'),
            'components': path.resolve(__dirname, 'src/components/'),
            'pages': path.resolve(__dirname, 'src/components/pages/'),
            'img': path.resolve(__dirname, 'src/assets/img/'),
        }
    }, output: {chunkFilename: mix.inProduction() ? 'js/[name].[chunkhash].js' : 'js/[name].js'}
});
// Setup Autoprefixer
mix.options({
    postCss: [require('autoprefixer')(),]
})
// ===public path
mix.setPublicPath('./')
mix.js('src/main.js', 'dist/')//.extract(['vue', 'bootstrap-vue', 'animejs', 'axios', 'vue-echarts-v3/src/full.js','vue2-dropzone'])
// set path for production link
// mix.setResourceRoot('/')

// mix.webpackConfig({
//         plugins: [
//             new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
//             new BundleAnalyzerPlugin()
//         ]
// });

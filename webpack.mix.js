const mix = require("laravel-mix");

mix.ts("resources/js/app.tsx", "public/js")
    .react()
    .postCss("resources/css/app.css", "public/css")
    .setPublicPath("public")
    .webpackConfig({
        watchOptions: {
            ignored: [
                "node_modules/**",
                "public/js/**",
                "public/css/**",
                "public/mix-manifest.json",
            ],
            poll: false,
        },
    });

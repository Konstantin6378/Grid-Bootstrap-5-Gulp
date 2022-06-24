import svgSprite from "gulp-svg-sprite";
import svgmin from "gulp-svgmin";
import cheerio from "gulp-cheerio";
import replace from "gulp-replace";

export const svgSprive = () => {
    return app.gulp.src(app.path.src.svgicons, {})
    .pipe(app.plugins.plumber(
        app.plugins.notify.onError({
            title: "SVG",
            message: "Error: <%= error.message %>"
        }))
    )
    // minify svg
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    // remove all fill, style and stroke declarations in out shapes
    // .pipe(cheerio({
    //     run: function ($) {
    //         $('[fill]').removeAttr('fill');
    //         $('[stroke]').removeAttr('stroke');
    //         $('[style]').removeAttr('style');
    //     },
    //     parserOptions: {xmlMode: true}
    // }))
    // cheerio plugin create unnecessary string '&gt;', so replace it.
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        mode: {
            symbol: {
                stack: "../icons/icons.svg",
                example: true.valueOf,
                render: {
                    css: {
                        dest:'../../css/_sprite.css',
                        template: app.path.src + "../../src/scss/_sprite_template.scss"
                    }
                }
            }
        }
        // mode: {
        //     stack: {
        //         sprite: "../icons/icons.svg",
        //         // Создавать страницу с перечнем иконок
        //         example: true
        //     }
        // },
    }
    ))
    .pipe(app.gulp.dest(app.path.build.images));
}
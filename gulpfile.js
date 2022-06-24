/* В файле package.json если к плагинам в место версий вписать "latest" автоматически будет установлена последняя версия плагина (плагин "webp-converter: 2.2.3" сохранить данную версию для корректной работы сборщика)*/

// Основной модуль
import gulp from "gulp";
// Импорт путей
import { path } from "./gulp/config/path.js";
//Импорт общих плагинов 
import { plugins } from "./gulp/config/plugin.js";

// Передаем значения в глобальную переменную
global.app = {
    isBuild: process.argv.includes('--build'),
    isDev: !process.argv.includes('--build'),
    path: path,
    gulp: gulp,
    plugins: plugins,
}

// Импорт задач

import { copy } from "./gulp/tasks/copy.js";
import { reset } from "./gulp/tasks/reset.js";
import { html } from "./gulp/tasks/html.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, ttfToWoff, fontsStyle, } from "./gulp/tasks/fonts.js";
import { svgSprive } from "./gulp/tasks/svgSprive.js";
import { zip } from "./gulp/tasks/zip.js";

// Наблюдатель за изменениями в файлах

function watcher() {
    gulp.watch(path.watch.files, copy);
    gulp.watch(path.watch.html, html); //  gulp.watch(path.watch.html, gulp.series(html, ftp)); * заменить если требуеться сразу обновлять данные на удаленном сервере при изменении build разработки (применить для каждого события)
    gulp.watch(path.watch.scss, scss);
    gulp.watch(path.watch.js, js);
    gulp.watch(path.watch.images, images);

}


// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle,);

// Основные задачи
const mainTasks = gulp.series(fonts, gulp.parallel(copy, html, scss, js, images));

// Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const deployZIP = gulp.series(reset, mainTasks, zip);
// const deployFTP = gulp.series(reset, mainTasks, ftp); раскоментировать если потребуеться отправлять сборку на сервер

// Экспорт сценариев
export { dev }
export { build }
export { deployZIP }
export { svgSprive } 
// export { deployFTP } раскоментировать если потребуеться отправлять сборку на сервер

// Задача по умолчанию
gulp.task('default', dev);
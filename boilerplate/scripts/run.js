const gulp = require('gulp');
const gutil = require('gulp-util');
const shell = require('shelljs');

function runStdPlatform(callback) {
  const suffix = global.settings.platform === 'macos' ? '-macos' : '';
  if (!shell.which(`react-native${suffix}`)) {
    shell.exec(shell.which('yarn')
      ? `yarn add -g react-native${suffix}-cli`
      : `npm i -g react-native${suffix}-cli`);
  }
  shell.exec(`react-native${suffix} run-${global.settings.platform}`);
  callback();
}

function runWebPlatform(callback) {
  shell.exec('npm run start:packager:web');
  callback();
}

/**
 * Run the project
 */
gulp.task('run', ['switch'], (callback) => {
  switch (global.settings.platform) {
    case 'web':
      runWebPlatform(callback);
      break;
    case 'server':
      gutil.log(gutil.colors.yellow('Not yet implemented'));
      break;
    default:
      runStdPlatform(callback);
  }
});
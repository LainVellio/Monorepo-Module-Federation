import webpack from "webpack";
import { buidDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildOptions } from "./types/types";

type BuildWebpack = (options: BuildOptions) => webpack.Configuration;

export const buildWebpack: BuildWebpack = (options) => {
  const { mode, paths } = options;
  const isDev = mode === "development";

  return {
    mode, // выбор мода сборки, лучше передавать из переменных окружения или через скрипт запуска сборки
    entry: paths.entry, // точка входа для первого файла запуска приложения, их может быть несколько
    output: {
      // куда происходит сборка
      path: paths.output, // путь
      filename: "[name].[contenthash].js", // название файла, хэш будет меняться если программа изменилась
      clean: true, // происходит очищение папки после каждой сборки
    },
    plugins: buildPlugins(options),

    module: {
      rules: buildLoaders(options),
    },

    resolve: buildResolvers(options),
    // для отслеживания мест где произошла ошибка
    devtool: isDev ? "inline-source-map" : "source-map",
    devServer: isDev ? buidDevServer(options) : undefined,
  };
};

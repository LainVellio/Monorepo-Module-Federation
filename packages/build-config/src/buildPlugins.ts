import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
// import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack, { Configuration, DefinePlugin } from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { BuildOptions } from "./types/types";
import CopyPlugin from "copy-webpack-plugin";
import path from "path";

export const buildPlugins = ({
  mode,
  paths,
  analyzer,
  platform,
}: BuildOptions): Configuration["plugins"] => {
  const plugins: Configuration["plugins"] = [
    // плагин для того, чтобы при сборке входной html страницы подключались скрипты
    new HtmlWebpackPlugin({
      template: paths.html,
      favicon: path.resolve(paths.public, "favicon.ico"),
      publicPath: "/",
    }),
    // для вызова в проекте переменных окружения
    new DefinePlugin({
      __PLATFORM__: JSON.stringify(platform),
    }),
  ];

  if (analyzer) {
    // инструмент который позволяет следить за различными параметрами работы с чанками
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (mode === "development") {
    // показывает процент прогресса сборки проекта, в проде лучше не использовать
    plugins.push(new webpack.ProgressPlugin());
    // выносит проверку типов в отдельный процесс
    //  plugins.push(new ForkTsCheckerWebpackPlugin());
    // HMR
    plugins.push(new ReactRefreshPlugin());
  }

  if (mode === "production") {
    // плагин для размещения css отдельно от js в определенной папке, нужно для прода
    plugins.push(
      new MiniCssExtractPlugin({
        // сохраняет файлы css в определенную папку и файл
        filename: "css/[name].[contenthash:8].css",
        // тоже касается чанок
        chunkFilename: "css/[name].[contenthash:8].css",
      })
    );
    // плагин для добавления дополнительных файлов в сборку
    plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(paths.public, "locales"),
            to: path.resolve(paths.output, "locales"),
          },
        ],
      })
    );
  }

  return plugins;
};

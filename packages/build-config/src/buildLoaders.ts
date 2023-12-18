import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { ModuleOptions } from "webpack";
import { buidBabelLoader } from "./babel/buildBabelLoader";
import { BuildOptions } from "./types/types";

export const buildLoaders = (options: BuildOptions): ModuleOptions["rules"] => {
  const isDev = options.mode === "development";

  const svgrLoader = {
    test: /\.svg$/,
    issuer: /\.[jt]sx?$/,
    use: [
      {
        loader: "@svgr/webpack",
        // для того чтобы работать с svg как с иконкой и например задавать нужный размер
        options: {
          icon: true,
          svgoCongig: {
            plugins: [
              { name: "convertColors", params: { currentColor: true } },
            ],
          },
        },
      },
    ],
  };

  const assetLoader = {
    test: /\.(png|jpg|jpeg|gif)$/i,
    type: "asset/resource",
  };

  const cssLoaderWithModules = {
    loader: "css-loader",
    options: {
      modules: {
        localIdentName: isDev ? "[path][name]__[local]" : "[hash:base64:8]",
      },
    },
  };

  const scssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? "style-loader" : MiniCssExtractPlugin.loader,
      cssLoaderWithModules,
      "sass-loader",
    ],
  };

  // ts-loader умеет работать с jsx
  const tsLoader = {
    test: /\.tsx?$/,

    use: [
      {
        loader: "ts-loader",
        // флаг который отключает проверку типов при сборке проекта
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
          }),
        },
      },
    ],
    // исключения
    exclude: /node_modules/,
  };

  const babelLoader = buidBabelLoader(options);

  // указываются все лоадеры для которых важен порядок
  return [
    assetLoader,
    scssLoader,
    tsLoader,
    // babelLoader,
    svgrLoader,
  ];
};

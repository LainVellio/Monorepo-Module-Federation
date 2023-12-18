import path from "path";
import webpack from "webpack";
import {
  buildWebpack,
  BuildMode,
  BuildPaths,
  Platform,
} from "@packages/build-config";
import packageJson from "./package.json";

export interface EnvVariables {
  mode?: BuildMode;
  port?: number;
  analyzer?: boolean;
  platform?: Platform;
  SHOP_REMOTE_URL?: string;
  ADMIN_REMOTE_URL?: string;
}

export default (env: EnvVariables) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, "src", "index.tsx"),
    output: path.resolve(__dirname, "build"),
    html: path.resolve(__dirname, "public", "index.html"),
    public: path.resolve(__dirname, "public"),
    src: path.resolve(__dirname, "src"),
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer ?? false,
    platform: env.platform ?? "desktop",
  });

  const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? "http://localhost:3001";
  const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? "http://localhost:3002";

  config.plugins.push(
    new webpack.container.ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",

      // указываем путь до наружних фалйлов заданных в exposes самих сервисов
      remotes: {
        shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
        admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
      },

      shared: {
        ...packageJson.dependencies,
        react: {
          // флаг сообщает о том что эту библиотеку необходимо подгрузить сразу
          eager: true,
          requiredVersion: packageJson.dependencies["react"],
        },

        "react-router-dom": {
          eager: true,
          requiredVersion: packageJson.dependencies["react-router-dom"],
        },
        "react-dom": {
          eager: true,
          requiredVersion: packageJson.dependencies["react-dom"],
        },
      },
    })
  );

  return config;
};

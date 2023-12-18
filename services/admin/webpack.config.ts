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
    port: env.port ?? 3002,
    mode: env.mode ?? "development",
    paths,
    analyzer: env.analyzer ?? false,
    platform: env.platform ?? "desktop",
  });

  config.plugins.push(
    new webpack.container.ModuleFederationPlugin({
      name: "admin",
      filename: "remoteEntry.js",
      // тут указывается что мы предоставляем наружу
      exposes: { "./router": "./src/router/router.tsx" },
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

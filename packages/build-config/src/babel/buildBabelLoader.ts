import { BuildOptions } from "../types/types";
import { removeDataTestIdBabelPlugin } from "./removeDataTestIdBabelPlugin";

export const buidBabelLoader = ({ mode }: BuildOptions) => {
  const isDev = mode === "development";
  const isProd = mode === "production";

  const plugins = [];
  if (isProd) {
    plugins.push([removeDataTestIdBabelPlugin, { props: ["data-testid"] }]);
  }

  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          [
            "@babel/preset-react",
            {
              runtime: isDev ? "automatic" : "classic",
            },
          ],
        ],
        plugins: plugins.length !== 0 ? plugins : undefined,
      },
    },
  };
};

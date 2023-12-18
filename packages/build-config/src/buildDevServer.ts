import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { BuildOptions } from "./types/types";

export const buidDevServer = ({
  port,
}: BuildOptions): DevServerConfiguration => {
  return {
    port,
    open: true,
    // если раздавать статику через nginx то надо делать проксирование на Index.html
    historyApiFallback: true,
    // HMR
    hot: true,
  };
};

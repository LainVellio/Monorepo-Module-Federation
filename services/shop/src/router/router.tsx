import { App } from "@/components/App";
import { LazyShop } from "@/pages/shop/Shop.lazy";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const routers = [
  {
    path: "/shop",
    element: <App />,
    children: [
      {
        path: "/shop/main",
        element: (
          <Suspense fallback={"Loading..."}>
            <LazyShop />
          </Suspense>
        ),
      },
      {
        path: "/shop/second",
        element: (
          <Suspense fallback={"Loading..."}>
            <div>Second</div>
          </Suspense>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routers);

export default routers;

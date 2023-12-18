import { Link } from "react-router-dom";
import { shopRoutes } from "@packages/shared/src/routes/shop";

const Shop = () => {
  return (
    <h1>
      Shop
      <div>
        <Link to={shopRoutes.second}>Go to second page</Link>
      </div>
    </h1>
  );
};

export default Shop;

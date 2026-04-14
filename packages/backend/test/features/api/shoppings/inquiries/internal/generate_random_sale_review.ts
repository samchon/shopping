import ShoppingApi from "@samchon/shopping-api";
import {
  IShoppingOrderGood,
  IShoppingSale,
  IShoppingSaleReview,
} from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../../common/internal/prepare_random_bbs_article";

export const generate_random_sale_review = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  good: IShoppingOrderGood,
  input?: Partial<Omit<IShoppingSaleReview.ICreate, "good_id">>,
): Promise<IShoppingSaleReview> => {
  const review: IShoppingSaleReview =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.create(
      pool.customer,
      sale.id,
      {
        ...prepare_random_bbs_article(input),
        good_id: good.id,
        score: Math.floor(Math.random() * 100),
      },
    );
  return review;
};

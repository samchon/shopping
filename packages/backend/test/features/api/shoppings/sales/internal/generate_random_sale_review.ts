import { randint } from "tstl";

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
  input?: Partial<IShoppingSaleReview.ICreate>,
): Promise<IShoppingSaleReview> => {
  const review: IShoppingSaleReview =
    await ShoppingApi.functional.shoppings.customers.sales.reviews.create(
      pool.customer,
      sale.id,
      {
        ...prepare_random_bbs_article(),
        score: randint(0, 10) * 10,
        good_id: good.id,
        ...input,
      },
    );
  return review;
};

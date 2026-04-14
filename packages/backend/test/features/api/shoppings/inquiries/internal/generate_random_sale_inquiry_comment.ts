import ShoppingApi from "@samchon/shopping-api";
import {
  IShoppingActorEntity,
  IShoppingSale,
  IShoppingSaleInquiry,
  IShoppingSaleInquiryComment,
} from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article_comment } from "../../../common/internal/prepare_random_bbs_article_comment";

export const generate_random_sale_inquiry_comment =
  (asset: {
    pool: ConnectionPool;
    sale: IShoppingSale;
    inquiry: IShoppingSaleInquiry<"question" | "review", any>;
  }) =>
  async (
    actor: IShoppingActorEntity,
    input?: Partial<IShoppingSaleInquiryComment.ICreate>,
  ): Promise<IShoppingSaleInquiryComment> => {
    const actorType =
      actor.type === "customer"
        ? "customer"
        : actor.type === "seller"
          ? "seller"
          : "admin";
    const comment: IShoppingSaleInquiryComment =
      await ShoppingApi.functional.shoppings[`${actorType}s`].sales[
        `${asset.inquiry.type}s`
      ].comments.create(
        asset.pool[actorType],
        asset.sale.id,
        asset.inquiry.id,
        prepare_random_bbs_article_comment(input),
      );
    return comment;
  };

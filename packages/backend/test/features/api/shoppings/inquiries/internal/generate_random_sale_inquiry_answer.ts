import ShoppingApi from "@samchon/shopping-api";
import {
  IShoppingSale,
  IShoppingSaleInquiry,
  IShoppingSaleInquiryAnswer,
} from "@samchon/shopping-api";

import { ConnectionPool } from "../../../../../ConnectionPool";
import { prepare_random_bbs_article } from "../../../common/internal/prepare_random_bbs_article";

export const generate_random_sale_inquiry_answer = async (
  pool: ConnectionPool,
  sale: IShoppingSale,
  question: IShoppingSaleInquiry<any, any>,
  input?: Partial<IShoppingSaleInquiryAnswer.ICreate>,
): Promise<IShoppingSaleInquiryAnswer> => {
  const answer: IShoppingSaleInquiryAnswer =
    await ShoppingApi.functional.shoppings.sellers.sales.questions.answer.create(
      pool.seller,
      sale.id,
      question.id,
      prepare_random_bbs_article(input),
    );
  return answer;
};

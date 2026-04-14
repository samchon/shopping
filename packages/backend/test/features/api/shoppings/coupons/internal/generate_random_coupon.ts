import {
  IShoppingCoupon,
  IShoppingCouponCriteria,
  IShoppingCustomer,
  IShoppingSale,
} from "@samchon/shopping-api";

import { prepare_random_coupon_criteria } from "./prepare_random_coupon_criteria";

export const generate_random_coupon = async (
  props: generate_random_coupon.IProps,
): Promise<IShoppingCoupon> => {
  const criterias: IShoppingCouponCriteria.ICreate[] = props.types.map((type) =>
    prepare_random_coupon_criteria({
      ...props,
      type,
    }),
  );
  return props.create(props.prepare(criterias));
};
export namespace generate_random_coupon {
  export interface IProps {
    types: IShoppingCouponCriteria.Type[];
    direction: "include" | "exclude";
    customer: IShoppingCustomer | null;
    sale: IShoppingSale;
    create: (input: IShoppingCoupon.ICreate) => Promise<IShoppingCoupon>;
    prepare: (
      criterias: IShoppingCouponCriteria.ICreate[],
    ) => IShoppingCoupon.ICreate;
  }
}

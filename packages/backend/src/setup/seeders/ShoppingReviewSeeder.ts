import {
  IPage,
  IShoppingCustomer,
  IShoppingOrder,
  IShoppingSaleReview,
} from "@samchon/shopping-api";

import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingMemberProvider } from "../../providers/shoppings/actors/ShoppingMemberProvider";
import { ShoppingOrderProvider } from "../../providers/shoppings/orders/ShoppingOrderProvider";
import { ShoppingSaleReviewProvider } from "../../providers/shoppings/sales/inquiries/ShoppingSaleSnapshotReviewProvider";
import { ShoppingCustomerSeeder } from "./ShoppingCustomerSeeder";

export namespace ShoppingReviewSeeder {
  export const seed = async (): Promise<void> => {
    for (const [index, fixture] of ShoppingCustomerSeeder.FIXTURES.entries()) {
      const customer: IShoppingCustomer = await loginSeedCustomer(fixture);
      const orders: IPage<IShoppingOrder> = await ShoppingOrderProvider.index({
        actor: customer,
        input: {
          limit: 0,
          search: {
            paid: true,
          },
        },
      });
      const order: undefined | IShoppingOrder = orders.data[0];
      const good = order?.goods[0];
      if (order === undefined || good === undefined) continue;

      await ShoppingSaleReviewProvider.create({
        customer,
        sale: {
          id: good.commodity.sale.id,
        },
        input: createReviewInput(index, good.id),
      });
    }
  };

  async function loginSeedCustomer(
    fixture: ShoppingCustomerSeeder.IFixture,
  ): Promise<IShoppingCustomer> {
    const customer: IShoppingCustomer = await ShoppingCustomerProvider.create({
      request: { ip: fixture.ip },
      input: {
        href: fixture.href,
        referrer: fixture.referrer,
        channel_code: "samchon",
        external_user: null,
      },
    });
    return ShoppingMemberProvider.login({
      customer,
      input: {
        email: fixture.email,
        password: fixture.password,
      },
    });
  }

  function createReviewInput(
    index: number,
    goodId: string,
  ): IShoppingSaleReview.ICreate {
    return {
      good_id: goodId,
      format: "txt",
      title: REVIEW_TITLES[index % REVIEW_TITLES.length]!,
      body: REVIEW_BODIES[index % REVIEW_BODIES.length]!,
      files: [],
      score: REVIEW_SCORES[index % REVIEW_SCORES.length]!,
    };
  }
}

const REVIEW_TITLES: string[] = [
  "Fast delivery and clean packaging",
  "Good price for the option selected",
  "Order flow was easy to follow",
  "Seller updates were helpful",
  "Product matched the description",
  "Would buy again from this store",
  "Discount applied as expected",
  "Satisfied with the purchase",
];

const REVIEW_BODIES: string[] = [
  "Delivery progress was visible and the item arrived without packaging issues.",
  "The selected stock option matched the order detail and the paid amount looked right.",
  "Checkout, payment, and order history all felt straightforward during the purchase.",
  "Seller-side shipping updates showed up quickly after payment was completed.",
  "The final product condition matched what was shown on the sale page.",
  "Using the service felt smooth from ordering to receiving the shipment.",
  "Deposit and other discounts were reflected correctly before final payment.",
  "Overall experience was stable enough that I would purchase again.",
];

const REVIEW_SCORES: number[] = [95, 92, 89, 87, 91, 93, 88, 90];

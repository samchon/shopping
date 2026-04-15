import { IShoppingCustomer, IShoppingSeller } from "@samchon/shopping-api";

import { ShoppingGlobal } from "../../ShoppingGlobal";
import { ShoppingAdministratorProvider } from "../../providers/shoppings/actors/ShoppingAdministratorProvider";
import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingSellerProvider } from "../../providers/shoppings/actors/ShoppingSellerProvider";
import { ShoppingCouponProvider } from "../../providers/shoppings/coupons/ShoppingCouponProvider";

export namespace ShoppingCouponSeeder {
  export const seed = async (): Promise<void> => {
    const customer: IShoppingCustomer = await createAutomationCustomer();
    const seller: IShoppingSeller.IInvert = await loginRobotSeller(customer);
    const admin: ReturnType<
      typeof ShoppingAdministratorProvider.invert.transform
    > = await loginRobotAdministrator(customer);
    const surfaceSale: { id: string } =
      await ShoppingGlobal.prisma.shopping_sales.findFirstOrThrow({
        where: {
          mv_last: {
            snapshot: {
              content: {
                title: {
                  contains: "Surface",
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });

    await ShoppingCouponProvider.create({
      actor: seller,
      input: {
        name: "Seller 5,000 Won Coupon",
        opened_at: new Date().toISOString(),
        closed_at: null,
        criterias: [
          {
            type: "seller",
            direction: "include",
            seller_ids: [seller.id],
          },
        ],
        disposable_codes: [],
        discount: {
          unit: "amount",
          value: 5000,
          threshold: null,
          limit: null,
          multiplicative: false,
        },
        restriction: {
          access: "public",
          exclusive: false,
          volume: 300,
          volume_per_citizen: null,
          expired_in: 30,
          expired_at: null,
        },
      },
    });
    await ShoppingCouponProvider.create({
      actor: admin,
      input: {
        name: "General Section 5% Coupon",
        opened_at: new Date().toISOString(),
        closed_at: null,
        criterias: [
          {
            type: "section",
            direction: "include",
            section_codes: ["general"],
          },
        ],
        disposable_codes: [],
        discount: {
          unit: "percent",
          value: 5,
          threshold: null,
          limit: null,
        },
        restriction: {
          access: "public",
          exclusive: true,
          volume: 300,
          volume_per_citizen: 1,
          expired_in: 30,
          expired_at: null,
        },
      },
    });
    await ShoppingCouponProvider.create({
      actor: seller,
      input: {
        name: "Surface 50,000 Won Coupon",
        opened_at: new Date().toISOString(),
        closed_at: null,
        criterias: [
          {
            type: "sale",
            direction: "include",
            sale_ids: [surfaceSale.id],
          },
        ],
        disposable_codes: [],
        discount: {
          unit: "amount",
          value: 50000,
          threshold: null,
          limit: null,
          multiplicative: false,
        },
        restriction: {
          access: "public",
          exclusive: false,
          volume: 100,
          volume_per_citizen: 1,
          expired_in: 21,
          expired_at: null,
        },
      },
    });
  };

  async function createAutomationCustomer(): Promise<IShoppingCustomer> {
    return ShoppingCustomerProvider.create({
      request: { ip: "127.0.0.1" },
      input: {
        href: "http://127.0.0.1/TestAutomation",
        referrer: "http://127.0.0.1/NodeJS",
        channel_code: "samchon",
        external_user: null,
      },
    });
  }

  async function loginRobotSeller(
    customer: IShoppingCustomer,
  ): Promise<IShoppingSeller.IInvert> {
    return ShoppingSellerProvider.login({
      customer,
      input: {
        email: "robot@nestia.io",
        password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
      },
    });
  }

  async function loginRobotAdministrator(
    customer: IShoppingCustomer,
  ): Promise<
    ReturnType<typeof ShoppingAdministratorProvider.invert.transform>
  > {
    return ShoppingAdministratorProvider.login({
      customer,
      input: {
        email: "robot@nestia.io",
        password: ShoppingGlobal.env.SHOPPING_SYSTEM_PASSWORD,
      },
    });
  }
}

import { v4 } from "uuid";

import {
  IPage,
  IShoppingAddress,
  IShoppingCustomer,
  IShoppingDepositCharge,
  IShoppingOrder,
  IShoppingSale,
} from "@samchon/shopping-api";

import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingMemberProvider } from "../../providers/shoppings/actors/ShoppingMemberProvider";
import { ShoppingDepositChargeProvider } from "../../providers/shoppings/deposits/ShoppingDepositChargeProvider";
import { ShoppingDepositChargePublishProvider } from "../../providers/shoppings/deposits/ShoppingDepositChargePublishProvider";
import { ShoppingDepositHistoryProvider } from "../../providers/shoppings/deposits/ShoppingDepositHistoryProvider";
import { ShoppingOrderPriceProvider } from "../../providers/shoppings/orders/ShoppingOrderPriceProvider";
import { ShoppingOrderProvider } from "../../providers/shoppings/orders/ShoppingOrderProvider";
import { ShoppingOrderPublishProvider } from "../../providers/shoppings/orders/ShoppingOrderPublishProvider";
import { ShoppingSaleProvider } from "../../providers/shoppings/sales/ShoppingSaleProvider";
import { ShoppingCustomerSeeder } from "./ShoppingCustomerSeeder";

export namespace ShoppingOrderSeeder {
  interface IRandomStockChoice {
    unit_id: string;
    stock_id: string;
    choices: [];
    quantity: 1;
  }

  export const seed = async (): Promise<void> => {
    const saleIds: string[] = await takeSaleIds();
    for (const [index, fixture] of ShoppingCustomerSeeder.FIXTURES.entries()) {
      const customer: IShoppingCustomer = await loginSeedCustomer(fixture);
      const random: () => number = createRandom(index + 1);
      if (index % 2 === 0)
        await chargeDeposit(customer, 300000 + index * 50000);
      const saleId: string = pickOne(saleIds, random);
      const sale: IShoppingSale = await takeSale({
        customer,
        saleId,
      });
      await createPaidOrder({
        customer,
        sale,
        random,
        useDeposit: index % 2 === 0,
      });
    }
  };

  async function takeSaleIds(): Promise<string[]> {
    const customer: IShoppingCustomer = await loginSeedCustomer(
      ShoppingCustomerSeeder.FIXTURES[0]!,
    );
    const page: IPage<IShoppingSale.ISummary> =
      await ShoppingSaleProvider.index({
        actor: customer,
        input: {
          limit: 0,
        },
      });
    return page.data.map((sale: IShoppingSale.ISummary): string => sale.id);
  }

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

  async function takeSale(props: {
    customer: IShoppingCustomer;
    saleId: string;
  }): Promise<IShoppingSale> {
    return ShoppingSaleProvider.at({
      actor: props.customer,
      id: props.saleId,
      strict: true,
    });
  }

  function createRandom(seed: number): () => number {
    let state: number = seed * 48271;
    return (): number => {
      state = (state * 48271) % 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  function pickOne<T>(items: T[], random: () => number): T {
    return items[Math.floor(random() * items.length)]!;
  }

  function collectRandomStocks(
    sale: IShoppingSale,
    random: () => number,
  ): IRandomStockChoice[] {
    return sale.units
      .filter(
        (unit: IShoppingSale["units"][number]): boolean =>
          unit.required === true || random() >= 0.5,
      )
      .map(
        (unit: IShoppingSale["units"][number]): IRandomStockChoice => ({
          unit_id: unit.id,
          stock_id: pickOne(unit.stocks, random).id,
          choices: [],
          quantity: 1 as const,
        }),
      );
  }

  function createAddress(
    customer: IShoppingCustomer,
  ): IShoppingAddress.ICreate {
    return {
      name:
        customer.citizen?.name ?? customer.member?.nickname ?? "Seed Customer",
      mobile: customer.citizen?.mobile ?? "01000000000",
      country: "Korea",
      province: "Seoul",
      city: "Seoul",
      department: "Mapo-gu",
      possession: "World Cup-ro 1",
      zip_code: "04147",
      special_note: null,
    };
  }

  async function createPaidOrder(props: {
    customer: IShoppingCustomer;
    sale: IShoppingSale;
    random: () => number;
    volume?: number;
    useDeposit: boolean;
  }): Promise<void> {
    const order: IShoppingOrder = await ShoppingOrderProvider.direct({
      customer: props.customer,
      input: {
        sale_id: props.sale.id,
        volume: props.volume ?? 1,
        stocks: collectRandomStocks(props.sale, props.random),
      },
    });
    if (props.useDeposit === true)
      await applyDeposit(customerOrThrow(props.customer), order);
    await ShoppingOrderPublishProvider.create({
      customer: props.customer,
      order,
      input: {
        vendor: {
          code: "seed-pay",
          uid: `card::${v4()}`,
        },
        address: createAddress(props.customer),
      },
    });
  }

  async function chargeDeposit(
    customer: IShoppingCustomer,
    value: number,
  ): Promise<void> {
    const charge: IShoppingDepositCharge =
      await ShoppingDepositChargeProvider.create({
        customer,
        input: {
          value,
        },
      });
    await ShoppingDepositChargePublishProvider.create({
      customer,
      charge,
      input: {
        vendor: "seed-pay",
        uid: `deposit::${v4()}`,
      },
    });
  }

  async function applyDeposit(
    customer: IShoppingCustomer,
    order: IShoppingOrder,
  ): Promise<void> {
    const balance: number = await ShoppingDepositHistoryProvider.getBalance(
      customerOrThrow(customer).citizen,
    );
    const deposit: number = Math.min(
      balance,
      Math.floor(order.price.real * 0.4),
    );
    if (deposit <= 0) return;
    await ShoppingOrderPriceProvider.discount({
      customer,
      order,
      input: {
        coupon_ids: [],
        deposit,
        mileage: 0,
      },
    });
  }

  function customerOrThrow(customer: IShoppingCustomer): IShoppingCustomer & {
    citizen: NonNullable<IShoppingCustomer["citizen"]>;
  } {
    if (customer.citizen === null)
      throw new Error("Customer must be a citizen.");
    return customer as IShoppingCustomer & {
      citizen: NonNullable<IShoppingCustomer["citizen"]>;
    };
  }
}

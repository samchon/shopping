import {
  IShoppingCustomer,
  IShoppingDelivery,
  IShoppingDeliveryJourney,
  IShoppingDeliveryPiece,
  IShoppingSeller,
} from "@samchon/shopping-api";

import { ShoppingGlobal } from "../../ShoppingGlobal";
import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingSellerProvider } from "../../providers/shoppings/actors/ShoppingSellerProvider";
import { ShoppingDeliveryPieceProvider } from "../../providers/shoppings/deliveries/ShoppingDeliveryPieceProvider";
import { ShoppingDeliveryProvider } from "../../providers/shoppings/deliveries/ShoppingDeliveryProvider";
import { ShoppingDeliveryShipperProvider } from "../../providers/shoppings/deliveries/ShoppingDeliveryShipperProvider";

export namespace ShoppingDeliverySeeder {
  export const seed = async (): Promise<void> => {
    const customer: IShoppingCustomer = await createAutomationCustomer();
    const seller: IShoppingSeller.IInvert = await loginRobotSeller(customer);
    const publishIds: string[] = await takePaidPublishIds(seller);

    for (const [index, publishId] of publishIds.entries()) {
      const incompletes: IShoppingDeliveryPiece.ICreate[] =
        await ShoppingDeliveryPieceProvider.incompletes({
          seller,
          input: {
            publish_ids: [publishId],
          },
        });
      if (incompletes.length === 0) continue;

      const delivery: IShoppingDelivery = await ShoppingDeliveryProvider.create(
        {
          seller,
          input: {
            pieces: incompletes,
            journeys: createJourneys(index),
            shippers: [],
          },
        },
      );
      await ShoppingDeliveryShipperProvider.create({
        seller,
        delivery,
        input: createShipper(index),
      });
    }
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

  async function takePaidPublishIds(
    seller: IShoppingSeller.IInvert,
  ): Promise<string[]> {
    const records: Array<{ id: string }> =
      await ShoppingGlobal.prisma.shopping_order_publishes.findMany({
        where: {
          paid_at: {
            not: null,
          },
          cancelled_at: null,
          order: {
            goods: {
              some: {
                shopping_seller_id: seller.id,
              },
            },
          },
        },
        orderBy: {
          created_at: "asc",
        },
        select: {
          id: true,
        },
      });
    return records.map((record: { id: string }): string => record.id);
  }

  function createJourneys(index: number): IShoppingDeliveryJourney.ICreate[] {
    const startedAt: string = new Date().toISOString();
    const completedAt: string = new Date(
      Date.now() + 30 * 60 * 1000,
    ).toISOString();
    return index % 2 === 0
      ? [
          createJourney("preparing", startedAt, completedAt),
          createJourney("manufacturing", startedAt, completedAt),
          createJourney("shipping", startedAt, completedAt),
          createJourney("delivering", startedAt, completedAt),
        ]
      : [
          createJourney("preparing", startedAt, completedAt),
          createJourney("manufacturing", startedAt, completedAt),
          createJourney("shipping", startedAt, null),
        ];
  }

  function createJourney(
    type: IShoppingDeliveryJourney.Type,
    startedAt: string,
    completedAt: null | string,
  ): IShoppingDeliveryJourney.ICreate {
    return {
      type,
      title: null,
      description: null,
      started_at: startedAt,
      completed_at: completedAt,
    };
  }

  function createShipper(index: number): {
    company: null | string;
    name: string;
    mobile: string;
  } {
    return index % 2 === 0
      ? {
          company: "CJ Logistics",
          name: "Lee Driver",
          mobile: "01088887777",
        }
      : {
          company: "Korea Post",
          name: "Park Driver",
          mobile: "01077776666",
        };
  }
}

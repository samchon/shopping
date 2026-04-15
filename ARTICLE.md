# [Nestia] Well-Designed Backend Fully Automates Frontend Development

## Preface

Well-designed backend + Nestia-generated SDK = AI fully automates frontend development.

This project proves the point: with a Nestia-generated SDK and a single frontend prompt ([`CLAUDE.md`](packages/frontend/CLAUDE.md)), a well-designed backend was enough to produce an enterprise-scale shopping mall frontend in one shot.

That is why a good SDK is no longer just a developer convenience. Generated from a backend that has been designed and documented carefully, it becomes one of the highest-quality forms of context engineering you can hand to AI.

- [Demonstration Repository](https://github.com/samchon/shopping)
- SDK means: collection of DTO types, typed fetch functions, and a mockup simulator
  - [Nestia](https://github.com/samchon/nestia): SDK generator for NestJS
  - [Nestia Editor](https://nestia.io/editor): SDK generation from Swagger/OpenAPI

## Demonstration

You can run the project directly from the repository:

```bash
git clone https://github.com/samchon/shopping
cd shopping
docker compose up --build
```

Once the containers are up:

- Frontend: http://127.0.0.1:3000
- Backend: http://127.0.0.1:37001

The whole frontend was produced in one shot from a very small prompt.

Some of the visual choices may still feel like AI work, and parts of the layout may not match everyone's taste.

That is not the important part.

The important part is that the customer, seller, and administrator flows were all built and working.

![Home](images/home.png)
![Product Detail](images/detail.png)
![Orders](images/orders.png)
![Wallet](images/wallet.png)
![Seller Console](images/seller.png)
![Seller Studio](images/seller-studio.png)
![Admin Console](images/admin.png)
![Admin Policies](images/admin-policies.png)

## The Prompt

The prompt was short enough to fit in a single file.

It did not try to micromanage every screen. It mostly set a few hard constraints: read the SDK broadly, treat code and comments as the source of truth, keep SDK-specific code behind an adapter layer, and finish the main product flows first.

It also told AI how to verify its own work. The frontend was reviewed through Playwright browser automation, so AI could inspect rendered screens and revise them instead of stopping at code generation.

For testing, it did not have to depend on a live backend every time. Nestia SDK already supports `simulate: true`, so the SDK can validate inputs and return mock responses instead of calling the real server. That let AI keep iterating on frontend-focused tests without waiting on the backend.

- [`packages/frontend/CLAUDE.md`](https://github.com/samchon/shopping/blob/master/packages/frontend/CLAUDE.md)

## The Backend

I am not claiming this shopping mall backend is some perfect masterpiece.

I built it years ago, long before the current AI coding wave. What I can say is simpler: I kept refactoring the APIs, and I spent a lot of time making the documentation and types more explicit. That work turned out to matter much more than I expected.

This is the kind of backend surface AI was reading.

### DTO Example

```ts
/**
 * Order application information.
 *
 * `IShoppingOrder` is an entity that embodies customer's order application
 * information. However, please note that at this time, you are still at the
 * "order application" stage and not the "order confirmation" stage.
 *
 * And as soon as a customer applies for an order, all commodities in the
 * target shopping cart are promoted to goods, and those good records are
 * created under this `IShoppingOrder`.
 */
export interface IShoppingOrder {
  /**
   * Primary Key.
   */
  id: string & tags.Format<"uuid">;

  /** Representative name of the order. */
  name: string;

  /** Customer who've applied for the order. */
  customer: IShoppingCustomer;

  /**
   * List of goods in the order.
   */
  goods: IShoppingOrderGood[];

  /**
   * Price information including discounts.
   *
   * For reference, this price value has multiplied by the volume value.
   */
  price: IShoppingOrderPrice;

  /**
   * Order completion and payment information.
   */
  publish: null | IShoppingOrderPublish;

  /**
   * Creation time of the record.
   */
  created_at: string & tags.Format<"date-time">;
}
```

- [IShoppingOrder.ts](https://github.com/samchon/shopping/blob/master/packages/api/src/structures/shoppings/orders/IShoppingOrder.ts)

### Controller Example

```ts
@Controller("shoppings/customers/orders")
export class ShoppingCustomerOrderController {
  /**
   * Create a new order application.
   *
   * Create a new `order application` from a shopping cart that has been
   * composed by the customer.
   *
   * By the way, this function does not mean completion the order, but means
   * just customer is applying the order. The order be completed only when
   * customer pays the order.
   */
  @TypedRoute.Post()
  public create(
    @ShoppingCustomerAuth() customer: IShoppingCustomer,
    @TypedBody() input: IShoppingOrder.ICreate,
  ): Promise<IShoppingOrder> {
    return ShoppingOrderProvider.create({
      customer,
      input,
    });
  }
}
```

- [ShoppingCustomerOrderController.ts](https://github.com/samchon/shopping/blob/master/packages/backend/src/controllers/shoppings/customers/orders/ShoppingCustomerOrderController.ts)

## Software Development Kit

![](https://user-images.githubusercontent.com/13158709/215004990-368c589d-7101-404e-b81b-fbc936382f05.gif)

> Left is the NestJS backend, and right is frontend code using the generated SDK.

An SDK (Software Development Kit) is a collection of DTO types and typed fetch functions generated from the backend.

Its Mockup Simulator is built around [`typia.assert<IShoppingOrder.ICreate>(input)`](https://typia.io/docs/validators/assert) for input validation and [`typia.random<IShoppingOrder>()`](https://typia.io/docs/random) for mock response data.

That gave AI a much stronger harness than loose API prose. The SDK exposed exact types, safe call shapes, and a simulator where AI could keep experimenting and testing without waiting on the real server.

```ts
/**
 * Create a new order application.
 *
 * Create a new {@link IShoppingOrder order application} from a
 * {@link IShoppingCartCommodity shopping cart} that has been composed by the
 * {@link IShoppingCustomer}. Of course, do not need to put every commodities
 * to the order, but possible to select some of them by the customer.
 *
 * By the way, this function does not mean completion the order, but means
 * just customer is applying the order. The order be completed only when customer
 * {@link IShoppingOrderPublish.paid_at pays} the order.
 *
 * @param input Creation info of the order
 * @returns Newly created order
 * @tag Order
 * @author Samchon
 *
 * @controller ShoppingCustomerOrderController.create
 * @path POST /shoppings/customers/orders
 * @accessor api.functional.shoppings.customers.orders.create
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  input: create.Body,
): Promise<create.Output> {
  return true === connection.simulate
    ? create.simulate(connection, input)
    : PlainFetcher.fetch(
        {
          ...connection,
          headers: {
            ...connection.headers,
            "Content-Type": "application/json",
          },
        },
        {
          ...create.METADATA,
          template: create.METADATA.path,
          path: create.path(),
        },
        input,
      );
}
export namespace create {
  export type Body = IShoppingOrder.ICreate;
  export type Output = IShoppingOrder;

  export const METADATA = {
    method: "POST",
    path: "/shoppings/customers/orders",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 201,
  } as const;

  export const path = () => "/shoppings/customers/orders";
  export const random = (): IShoppingOrder => typia.random<IShoppingOrder>();
  export const simulate = (connection: IConnection, input: Body): Output => {
    const assert = NestiaSimulator.assert({
      method: METADATA.method,
      host: connection.host,
      path: path(),
      contentType: "application/json",
    });
    assert.body(() => typia.assert<IShoppingOrder.ICreate>(input));
    return random();
  };
}
```

- This one is called as `api.functional.shoppings.customers.orders.create(connection, input)`.
- [packages/api/src/functional/shoppings/customers/orders/index.ts](https://github.com/samchon/shopping/blob/master/packages/api/src/functional/shoppings/customers/orders/index.ts)

## Try Nestia, Automate Frontend

If you already use NestJS, the path is simple. Install [Nestia](https://github.com/samchon/nestia) and generate the SDK directly from your backend.

If you do not use NestJS, or if your backend is written in another language entirely, [Nestia Editor](https://nestia.io/editor) can generate the SDK from your `swagger.json` instead.

It also comes with Mockup Simulator support, so the generated SDK can validate inputs and return mock responses without depending on a live server every time.

That matters because frontend automation does not begin with pretty UI code. It begins with whether AI can read the backend clearly, call it safely, and test against it repeatedly. A generated SDK with simulation closes that loop.

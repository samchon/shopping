# [Nestia] Well-Designed Backend Fully Automated Frontend Development

## 1. Preface

Well-designed backend + Nestia-generated SDK = AI fully automates frontend development.

This project proves the point: with a Nestia-generated SDK and a single frontend prompt ([`CLAUDE.md`](packages/frontend/CLAUDE.md)), a well-designed backend was enough to produce an enterprise-scale shopping mall frontend in one shot.

That is why a good SDK is no longer just a developer convenience. When it is generated from a backend with careful design and documentation, it becomes high-quality context engineering for AI.

- Demonstration Repository: https://github.com/samchon/shopping
- **SDK**: collection of DTO types, typed fetch functions, and a mockup simulator
  - [Nestia](https://github.com/samchon/nestia): SDK generator for NestJS
  - [Nestia Editor](https://nestia.io/docs/swagger/editor): SDK generation from Swagger/OpenAPI

## 2. Demonstration

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

Some visual choices may still feel like AI work, but that is not the point.

The point is that the customer, seller, and administrator flows were all built and working.

![Home](images/home.png)
![Product Detail](images/detail.png)
![Orders](images/orders.png)
![Wallet](images/wallet.png)
![Seller Console](images/seller.png)
![Seller Studio](images/seller-studio.png)
![Admin Console](images/admin.png)
![Admin Policies](images/admin-policies.png)

## 3. The Backend

I am not claiming this shopping mall backend is some perfect masterpiece.

I built it years ago, long before the current AI coding wave. What I can say is simpler: I kept refactoring the APIs and tried to make the documentation and types more explicit. That effort turned out to matter much more than I expected.

This is the kind of backend surface AI was reading. Notice how every field carries a JSDoc comment that explains its business meaning, and how the types are precise enough that AI does not need external documentation.

The code is the documentation.

### 3.1. DTO Example

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

### 3.2. Controller Example

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

## 4. Software Development Kit

![](https://user-images.githubusercontent.com/13158709/215004990-368c589d-7101-404e-b81b-fbc936382f05.gif)

> Left is the NestJS backend, and right is frontend code using the generated SDK.

An SDK (Software Development Kit) is a collection of DTO types and typed fetch functions generated from the backend.

Nestia turned that backend surface into executable client code.

Its Mockup Simulator is built around [`typia.assert<IShoppingOrder.ICreate>(input)`](https://typia.io/docs/validators/assert) for input validation and [`typia.random<IShoppingOrder>()`](https://typia.io/docs/random) for mock response data.

That gave AI a much stronger harness than loose API prose. The SDK serves three roles at once:

**Context.** Every DTO type and JSDoc comment from the backend is carried into the SDK as-is. AI reads the SDK and gets the full backend surface — endpoints, fields, constraints, business rules — without needing separate documentation.

**Constraint.** The TypeScript type system acts as a guardrail. If AI generates code that passes the wrong field or misreads a response shape, the compiler catches it immediately. Types replace the need for prose instructions like "do not forget this field."

**Verification.** The Mockup Simulator lets AI test its own code without a running server. `typia.assert()` validates that the input matches the expected type; `typia.random()` returns a structurally correct mock response. AI can iterate fast without waiting on the backend.

These three close a feedback loop: **read the SDK → write frontend code → verify with the simulator → repeat.** Playwright browser automation added visual verification on top — AI could inspect rendered screens and revise, not just stop at code generation. In the generated function below, all three roles are visible.

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

- It is used as `api.functional.shoppings.customers.orders.create(connection, input)`.
- [packages/api/src/functional/shoppings/customers/orders/index.ts](https://github.com/samchon/shopping/blob/master/packages/api/src/functional/shoppings/customers/orders/index.ts)

## 5. Try Nestia, Automate Frontend

[![Nestia Editor](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5faukr6jkjp9q2125h8o.png)](https://nestia.io/docs/swagger/editor)

If you already use NestJS, the path is simple. Install [Nestia](https://github.com/samchon/nestia) and generate the SDK directly from your backend.

If you do not use NestJS, or if your backend is written in another language entirely, [Nestia Editor](https://nestia.io/docs/swagger/editor) can generate the SDK from your `swagger.json` instead.

It also comes with Mockup Simulator support, so the generated SDK can validate inputs and return mock responses without depending on a live server every time.

That matters because frontend automation does not begin with pretty UI code. It begins with whether AI can read the backend clearly, call it safely, and test it repeatedly. A generated SDK with simulation closes that loop.

## 6. Conclusion

AI did not suddenly become magical.

What happened is simpler: a well-designed backend — explicit types, documented contracts, precise constraints — was turned into a generated SDK that AI could read as context, rely on as constraint, and test against as a simulator. Backend quality compounded into frontend automation.

That is why this shopping mall frontend could be built in one shot.

A good SDK is no longer just a developer convenience. When it is generated from a backend with careful design, it becomes context engineering for AI. That is also why backend work matters even more in the age of AI coding.

> ## AutoBe
>
> ![AutoBe Replay](https://autobe.dev/images/demonstrate/replay-qwen-qwen3.5-35b-a3b.png)
>
> Even small models like `qwen3.5-35b-a3b` can hit 100%.
>
> AutoBe is an open-source project that generates complete backends from natural-language requirements.
>
> It produces robust API design and documentation. If you want to automate the backend as well, this is the best next step.
>
> - [AutoBe Repository](https://github.com/wrtnlabs/autobe)

import { Prisma } from "@prisma/sdk";

import { IShoppingMemberEmail } from "@samchon/shopping-api";

export namespace ShoppingMemberEmailProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_member_emailsGetPayload<ReturnType<typeof select>>,
    ): IShoppingMemberEmail => ({
      id: input.id,
      value: input.value,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_member_emailsFindManyArgs;
  }
}

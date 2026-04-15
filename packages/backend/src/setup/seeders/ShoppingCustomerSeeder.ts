import { IShoppingCustomer } from "@samchon/shopping-api";

import { ShoppingCustomerProvider } from "../../providers/shoppings/actors/ShoppingCustomerProvider";
import { ShoppingMemberProvider } from "../../providers/shoppings/actors/ShoppingMemberProvider";

export namespace ShoppingCustomerSeeder {
  export interface IFixture {
    email: string;
    password: string;
    nickname: string;
    ip: string;
    href: string;
    referrer: string;
    citizen: {
      name: string;
      mobile: string;
    };
  }

  export const FIXTURES: IFixture[] = [
    createFixture(1, "Mina", "Kim Mina", "01011112222"),
    createFixture(2, "Jihoon", "Lee Jihoon", "01011113333"),
    createFixture(3, "Soyeon", "Park Soyeon", "01011114444"),
    createFixture(4, "Hyunwoo", "Choi Hyunwoo", "01011115555"),
    createFixture(5, "Yuna", "Han Yuna", "01011116666"),
    createFixture(6, "Doyoung", "Jung Doyoung", "01011117777"),
    createFixture(7, "Eunji", "Seo Eunji", "01011118888"),
    createFixture(8, "Taemin", "Moon Taemin", "01011119999"),
  ];

  export const seed = async (): Promise<IShoppingCustomer[]> => {
    const output: IShoppingCustomer[] = [];
    for (const fixture of FIXTURES) {
      const customer = await ShoppingCustomerProvider.create({
        request: { ip: fixture.ip },
        input: {
          href: fixture.href,
          referrer: fixture.referrer,
          channel_code: "samchon",
          external_user: null,
        },
      });
      output.push(
        await ShoppingMemberProvider.join({
          customer,
          input: {
            email: fixture.email,
            password: fixture.password,
            nickname: fixture.nickname,
            citizen: fixture.citizen,
          },
        }),
      );
    }
    return output;
  };

  function createFixture(
    index: number,
    nickname: string,
    name: string,
    mobile: string,
  ): IFixture {
    return {
      email: `customer${index}@nestia.io`,
      password: "seed1234",
      nickname,
      ip: `10.0.0.1${index}`,
      href: `https://seed.local/customer${index}`,
      referrer: "https://seed.local/home",
      citizen: {
        name,
        mobile,
      },
    };
  }
}

import { IShoppingActorEntity } from "../../../structures/shoppings/actors/IShoppingActorEntity";

export namespace ShoppingCustomerDiagnoser {
  export const invert = (actor: IShoppingActorEntity) =>
    actor.type === "customer" ? actor : actor.customer;
}

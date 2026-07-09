import type { IShoppingSaleUnitStockChoice } from "@samchon/shopping-api";
import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";
import { ErrorProvider } from "../../../utils/ErrorProvider";
import { ShoppingSaleSnapshotUnitOptionProvider } from "./ShoppingSaleSnapshotUnitOptionProvider";

export namespace ShoppingSaleSnapshotUnitStockChoiceProvider {
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sale_snapshot_unit_stock_choicesGetPayload<
        ReturnType<typeof select>
      >,
    ): IShoppingSaleUnitStockChoice => ({
      id: input.id,
      option_id: input.shopping_sale_snapshot_unit_option_id,
      candidate_id: input.shopping_sale_snapshot_unit_option_candidate_id,
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sale_snapshot_unit_stock_choicesFindManyArgs;
  }

  export const collect = (props: {
    options: ReturnType<
      typeof ShoppingSaleSnapshotUnitOptionProvider.collect
    >[];
    input: IShoppingSaleUnitStockChoice.ICreate;
    sequence: number;
  }) => {
    const option = props.options[props.input.option_index];
    if (option === undefined)
      throw ErrorProvider.internal("No sale stock choice option found.");
    const candidate = option.candidates.create[props.input.candidate_index];
    if (candidate === undefined)
      throw ErrorProvider.internal("No sale stock choice candidate found.");
    return {
      id: v4(),
      option: { connect: { id: option.id } },
      candidate: { connect: { id: candidate.id } },
      sequence: props.sequence,
    } satisfies Prisma.shopping_sale_snapshot_unit_stock_choicesCreateWithoutStockInput;
  };
}

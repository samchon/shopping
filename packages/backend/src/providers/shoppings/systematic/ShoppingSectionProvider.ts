import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IPage, IRecordMerge, IShoppingSection } from "@samchon/shopping-api";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { EntityMergeProvider } from "../../common/EntityMergeProvider";

export namespace ShoppingSectionProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_sectionsGetPayload<ReturnType<typeof select>>,
    ): IShoppingSection => ({
      id: input.id,
      code: input.code,
      name: input.name,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_sectionsFindManyArgs;
  }

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (
    input: IShoppingSection.IRequest,
  ): Promise<IPage<IShoppingSection>> =>
    paginate({
      where: {
        AND: search(input.search),
      },
      sort: input.sort?.length ? input.sort : ["+section.created_at"],
    })(input);

  export const search = (
    input: IShoppingSection.IRequest.ISearch | null | undefined,
  ) =>
    [
      ...(input?.code?.length ? [{ code: { contains: input.code } }] : []),
      ...(input?.name?.length
        ? [
            {
              name: {
                contains: input.name,
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_sectionsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingSection.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "section.code"
      ? { code: value }
      : key === "section.name"
        ? { name: value }
        : {
            created_at: value,
          }) satisfies Prisma.shopping_sectionsOrderByWithRelationInput;

  export const at = async (id: string): Promise<IShoppingSection> => {
    const record =
      await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
        where: { id },
      });
    return json.transform(record);
  };

  export const get = async (code: string): Promise<IShoppingSection> => {
    const record =
      await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
        where: { code },
      });
    return json.transform(record);
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (
    input: IShoppingSection.ICreate,
  ): Promise<IShoppingSection> => {
    const record = await ShoppingGlobal.prisma.shopping_sections.create({
      data: collect(input),
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update = async (props: {
    id: string;
    input: IShoppingSection.IUpdate;
  }) => {
    const record =
      await ShoppingGlobal.prisma.shopping_sections.findFirstOrThrow({
        where: { id: props.id },
      });
    await ShoppingGlobal.prisma.shopping_sections.update({
      where: { id: record.id },
      data: {
        name: props.input.name,
      },
    });
  };

  export const merge = (input: IRecordMerge) =>
    EntityMergeProvider.merge(
      ShoppingGlobal.prisma.shopping_sections.fields.id.modelName,
    )(input);

  const collect = (input: IShoppingSection.ICreate) =>
    ({
      id: v4(),
      code: input.code,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }) satisfies Prisma.shopping_sectionsCreateInput;

  const paginate =
    (props: {
      where: Prisma.shopping_sectionsWhereInput;
      sort: IPage.Sort<IShoppingSection.IRequest.SortableColumns>;
    }) =>
    async (input: IPage.IRequest): Promise<IPage<IShoppingSection>> => {
      input.limit ??= 100;

      const records = await ShoppingGlobal.prisma.shopping_sections.findMany({
        ...json.select(),
        where: props.where,
      });
      const data = records.map(json.transform).sort(comparator(props.sort));

      const pages =
        input.limit !== 0 ? Math.ceil(data.length / input.limit) || 1 : 1;
      input.page = input.page ? Math.max(1, Math.min(input.page, pages)) : 1;

      const start: number = (input.page - 1) * input.limit;
      const sliced =
        input.limit !== 0 ? data.slice(start, start + input.limit) : data;
      return {
        data: sliced,
        pagination: {
          records: data.length,
          pages,
          current: input.page,
          limit: input.limit,
        },
      };
    };

  const comparator =
    (sort: IPage.Sort<IShoppingSection.IRequest.SortableColumns>) =>
    (x: IShoppingSection, y: IShoppingSection): number => {
      for (const token of sort) {
        const sign: number = token[0] === "+" ? 1 : -1;
        const key = token.substring(1) as IShoppingSection.IRequest.SortableColumns;
        const value: number =
          key === "section.code"
            ? compareStrings(x.code, y.code)
            : key === "section.name"
              ? compareStrings(x.name, y.name)
              : compareStrings(x.created_at, y.created_at);
        if (value !== 0) return value * sign;
      }
      return compareStrings(x.id, y.id);
    };

  const compareStrings = (x: string, y: string): number =>
    x.localeCompare(y, undefined, {
      sensitivity: "base",
    });
}

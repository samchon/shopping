import { ArrayUtil } from "@nestia/e2e";
import { Prisma } from "@prisma/sdk";
import { v4 } from "uuid";

import { IPage, IRecordMerge, IShoppingChannel } from "@samchon/shopping-api";

import { ShoppingGlobal } from "../../../ShoppingGlobal";
import { EntityMergeProvider } from "../../common/EntityMergeProvider";
import { ShoppingChannelCategoryProvider } from "./ShoppingChannelCategoryProvider";

export namespace ShoppingChannelProvider {
  /* -----------------------------------------------------------
    TRANSFORMERS
  ----------------------------------------------------------- */
  export namespace json {
    export const transform = (
      input: Prisma.shopping_channelsGetPayload<ReturnType<typeof select>>,
    ): IShoppingChannel => ({
      id: input.id,
      code: input.code,
      name: input.name,
      created_at: input.created_at.toISOString(),
    });
    export const select = () =>
      ({}) satisfies Prisma.shopping_channelsFindManyArgs;
  }

  export const hierarchical = async (
    input: IShoppingChannel.IRequest,
  ): Promise<IPage<IShoppingChannel.IHierarchical>> => {
    const page = await index(input);
    return {
      ...page,
      data: await ArrayUtil.asyncMap(page.data, async (channel) => ({
        ...channel,
        categories:
          await ShoppingChannelCategoryProvider.hierarchical.entire(channel),
      })),
    };
  };

  /* -----------------------------------------------------------
    READERS
  ----------------------------------------------------------- */
  export const index = (
    input: IShoppingChannel.IRequest,
  ): Promise<IPage<IShoppingChannel>> =>
    paginate({
      where: {
        AND: search(input.search),
      },
      sort: input.sort?.length ? input.sort : ["+channel.created_at"],
    })(input);

  export const search = (
    input: IShoppingChannel.IRequest.ISearch | null | undefined,
  ) =>
    [
      ...(input?.code?.length
        ? [
            {
              code: {
                contains: input.code,
              },
            },
          ]
        : []),
      ...(input?.name?.length
        ? [
            {
              name: {
                contains: input.name,
              },
            },
          ]
        : []),
    ] satisfies Prisma.shopping_channelsWhereInput["AND"];

  export const orderBy = (
    key: IShoppingChannel.IRequest.SortableColumns,
    value: "asc" | "desc",
  ) =>
    (key === "channel.code"
      ? { code: value }
      : key === "channel.name"
        ? { name: value }
        : {
            created_at: value,
          }) satisfies Prisma.shopping_channelsOrderByWithRelationInput;

  export const at = async (
    id: string,
  ): Promise<IShoppingChannel.IHierarchical> => {
    const record =
      await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
        where: { id },
      });
    return {
      ...json.transform(record),
      categories:
        await ShoppingChannelCategoryProvider.hierarchical.entire(record),
    };
  };

  export const get = async (
    code: string,
  ): Promise<IShoppingChannel.IHierarchical> => {
    const record =
      await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
        where: { code },
      });
    return {
      ...json.transform(record),
      categories:
        await ShoppingChannelCategoryProvider.hierarchical.entire(record),
    };
  };

  /* -----------------------------------------------------------
    WRITERS
  ----------------------------------------------------------- */
  export const create = async (
    input: IShoppingChannel.ICreate,
  ): Promise<IShoppingChannel> => {
    const record = await ShoppingGlobal.prisma.shopping_channels.create({
      data: collect(input),
      ...json.select(),
    });
    return json.transform(record);
  };

  export const update = async (props: {
    id: string;
    input: IShoppingChannel.IUpdate;
  }): Promise<void> => {
    const record =
      await ShoppingGlobal.prisma.shopping_channels.findFirstOrThrow({
        where: { id: props.id },
      });
    await ShoppingGlobal.prisma.shopping_channels.update({
      where: { id: record.id },
      data: {
        name: props.input.name ?? record.name,
      },
    });
  };

  export const merge = (input: IRecordMerge) =>
    EntityMergeProvider.merge(
      ShoppingGlobal.prisma.shopping_channels.fields.id.modelName,
    )(input);

  const collect = (input: IShoppingChannel.ICreate) =>
    ({
      id: v4(),
      code: input.code,
      name: input.name,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    }) satisfies Prisma.shopping_channelsCreateInput;

  export const destroy = async (id: string): Promise<void> => {
    await ShoppingGlobal.prisma.shopping_channels.delete({
      where: { id },
    });
  };

  const paginate =
    (props: {
      where: Prisma.shopping_channelsWhereInput;
      sort: IPage.Sort<IShoppingChannel.IRequest.SortableColumns>;
    }) =>
    async (input: IPage.IRequest): Promise<IPage<IShoppingChannel>> => {
      input.limit ??= 100;

      const records = await ShoppingGlobal.prisma.shopping_channels.findMany({
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
    (sort: IPage.Sort<IShoppingChannel.IRequest.SortableColumns>) =>
    (x: IShoppingChannel, y: IShoppingChannel): number => {
      for (const token of sort) {
        const sign: number = token[0] === "+" ? 1 : -1;
        const key = token.substring(1) as IShoppingChannel.IRequest.SortableColumns;
        const value: number =
          key === "channel.code"
            ? compareStrings(x.code, y.code)
            : key === "channel.name"
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

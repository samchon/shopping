import { v4 } from "uuid";

import type {
  IAttachmentFile,
  IDiagnosis,
  IEntity,
  IShoppingActorEntity,
  IShoppingAdministrator,
  IShoppingCartCommodity,
  IShoppingCartCommodityStock,
  IShoppingCartCommodityStockChoice,
  IShoppingCartDiscountable,
  IShoppingCoupon,
  IShoppingCouponCriteria,
  IShoppingCouponTicket,
  IShoppingCustomer,
  IShoppingMember,
  IShoppingOrder,
  IShoppingOrderDiscountable,
  IShoppingOrderGood,
  IShoppingSale,
  IShoppingSaleContent,
  IShoppingSaleSnapshot,
  IShoppingSaleUnit,
  IShoppingSaleUnitOption,
  IShoppingSaleUnitSelectableOption,
  IShoppingSaleUnitStock,
  IShoppingSaleUnitStockChoice,
  IShoppingSeller,
} from "@samchon/shopping-api";

export namespace ShoppingCustomerDiagnoser {
  export const invert = (
    actor: IShoppingActorEntity,
  ): IShoppingCustomer.IInvert =>
    actor.type === "customer" ? actor : actor.customer;
}

export namespace ShoppingAdministratorDiagnoser {
  export const invert = (
    customer: IShoppingCustomer,
  ): IShoppingAdministrator.IInvert | null => {
    const citizen = customer.citizen;
    const member = customer.member;
    const administrator = member?.administrator;
    if (!citizen || !member || !administrator) return null;
    return {
      id: administrator.id,
      type: "administrator",
      citizen,
      customer: customerInvert(customer),
      member: memberInvert(member),
      created_at: administrator.created_at,
    };
  };
}

export namespace ShoppingSellerDiagnoser {
  export const invert = (
    customer: IShoppingCustomer,
  ): IShoppingSeller.IInvert | null => {
    const citizen = customer.citizen;
    const member = customer.member;
    const seller = member?.seller;
    if (!citizen || !member || !seller) return null;
    return {
      id: seller.id,
      type: "seller",
      citizen,
      customer: customerInvert(customer),
      member: memberInvert(member),
      created_at: seller.created_at,
    };
  };
}

export namespace ShoppingSaleDiagnoser {
  export const replica = (sale: IShoppingSale): IShoppingSale.ICreate => ({
    ...ShoppingSaleSnapshotDiagnoser.replica(sale),
    section_code: sale.section.code,
    opened_at: sale.opened_at,
    closed_at: sale.closed_at,
  });

  export const readable = (props: {
    sale: IShoppingSale.ITimestamps;
    accessor: string;
    checkPause: boolean;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    if (props.sale.opened_at === null)
      output.push({
        accessor: props.accessor,
        message: "The sale has not been opened.",
      });
    else if (new Date(props.sale.opened_at).getTime() > Date.now())
      output.push({
        accessor: props.accessor,
        message: "The sale has not been opened yet.",
      });

    const timestamp = (status: string, time: string | null) => {
      if (time !== null && Date.now() >= new Date(time).getTime())
        output.push({
          accessor: props.accessor,
          message: `The sale has been ${status}.`,
        });
    };
    timestamp("closed", props.sale.closed_at);
    if (props.checkPause) timestamp("paused", props.sale.paused_at);
    timestamp("suspended", props.sale.suspended_at);
    return output;
  };
}

export namespace ShoppingCartCommodityDiagnoser {
  export const validate = (props: {
    sale: IShoppingSale;
    input: IShoppingCartCommodity.ICreate;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
      accessor: "$input.sale_id",
      checkPause: true,
      sale: props.sale,
    });
    props.input.stocks.forEach((stock, i) => {
      const unit: IShoppingSaleUnit | undefined = props.sale.units.find(
        (u) => u.id === stock.unit_id,
      );
      if (unit === undefined)
        output.push({
          accessor: `$input.stocks[${i}].unit_id`,
          message: "Unable to find the matched unit.",
        });
      else
        output.push(
          ...ShoppingCartCommodityStockDiagnoser.validate({
            unit,
            commodity: props.input,
            input: stock,
            index: i,
          }),
        );
    });
    return output;
  };

  export const replica = (
    commodity: IShoppingCartCommodity,
  ): IShoppingCartCommodity.ICreate => ({
    sale_id: commodity.sale.id,
    stocks: commodity.sale.units
      .map((unit) =>
        unit.stocks.map((stock) =>
          ShoppingCartCommodityStockDiagnoser.replica({ unit, stock }),
        ),
      )
      .flat(),
    volume: commodity.volume,
  });

  export const preview = (props: {
    sale: IShoppingSale;
    input: IShoppingCartCommodity.ICreate;
  }): IShoppingCartCommodity => {
    const entries: [
      IShoppingSaleUnit.IInvert,
      IShoppingSaleUnitStock.IInvert,
    ][] = props.input.stocks.map((stockInput) => {
      const unit: IShoppingSaleUnit | undefined = props.sale.units.find(
        (u) => u.id === stockInput.unit_id,
      );
      if (unit === undefined)
        throw new Error(
          `Error on ShoppingCartItemDiagnoser.preview(): unable to find the matched unit by its id "${stockInput.unit_id}".`,
        );
      return [
        {
          id: unit.id,
          name: unit.name,
          primary: unit.primary,
          required: unit.required,
          stocks: [],
        },
        ShoppingCartCommodityStockDiagnoser.preview({
          unit,
          input: stockInput,
        }),
      ] as const;
    });
    const unitDict = new Map<string, IShoppingSaleUnit.IInvert>();
    for (const [unit, stock] of entries)
      take(unitDict, unit.id, () => unit).stocks.push(stock);

    return {
      id: v4(),
      sale: {
        ...props.sale,
        content: {
          id: v4(),
          title: props.sale.content.title,
          thumbnails: props.sale.content.thumbnails,
        },
        units: [...unitDict.values()],
      },
      pseudo: true,
      volume: props.input.volume,
      price: {
        nominal: entries
          .map(([, stock]) => stock.price.nominal)
          .reduce((a, b) => a + b),
        real: entries
          .map(([, stock]) => stock.price.real)
          .reduce((a, b) => a + b),
      },
      created_at: new Date().toISOString(),
      orderable: true,
    };
  };
}

export namespace ShoppingCartDiscountableDiagnoser {
  export const combine = (props: {
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    commodities: IShoppingCartCommodity[];
  }): IShoppingCartDiscountable.ICombination[] =>
    ShoppingDiscountableDiagnoser.combine({
      className: "ShoppingCartDiscountableDiagnoser",
      accessor: cartAccessor,
      customer: props.customer,
      coupons: props.coupons,
      tickets: props.tickets,
      data: props.commodities,
    }).map((comb) => ({
      ...comb,
      entries: comb.entries.map((entry) => ({
        coupon_id: entry.coupon_id,
        commodity_id: entry.item_id,
        amount: entry.amount,
        pseudo: !!props.commodities.find((c) => c.id === entry.item_id)?.pseudo,
      })),
    }));
}

export namespace ShoppingOrderDiscountableDiagnoser {
  export const checkCoupon = (props: {
    customer: IShoppingCustomer;
    goods: IShoppingOrderGood[];
    coupon: IShoppingCoupon;
  }): boolean =>
    ShoppingDiscountableDiagnoser.checkCoupon({
      accessor: orderAccessor,
      customer: props.customer,
      coupon: props.coupon,
      data: props.goods,
    });

  export const combine = (props: {
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    goods: IShoppingOrderGood[];
  }): IShoppingOrderDiscountable.ICombination[] =>
    ShoppingDiscountableDiagnoser.combine({
      className: "ShoppingOrderDiscountableDiagnoser",
      accessor: orderAccessor,
      customer: props.customer,
      coupons: props.coupons,
      tickets: props.tickets,
      data: props.goods,
    }).map((comb) => ({
      ...comb,
      entries: comb.entries.map((entry) => ({
        coupon_id: entry.coupon_id,
        good_id: entry.item_id,
        amount: entry.amount,
      })),
    }));
}

export namespace ShoppingCouponTicketDiagnoser {
  export const unique = (
    tickets: IShoppingCouponTicket[],
  ): IShoppingCouponTicket[] => [
    ...new Map(tickets.map((t) => [t.coupon.id, t])).values(),
  ];
}

export namespace ShoppingOrderDiagnoser {
  export const validate = (props: {
    commodities: IShoppingCartCommodity[];
    input: IShoppingOrder.ICreate;
  }): IDiagnosis[] =>
    props.input.goods
      .map((good, i) => {
        const commodity: IShoppingCartCommodity | undefined =
          props.commodities.find((c) => c.id === good.commodity_id);
        if (commodity === undefined)
          return {
            accessor: `input.goods[${i}].commodity_id`,
            message: `Commodity#${good.commodity_id} is not found.`,
          };
        return ShoppingOrderGoodDiagnoser.validate({
          commodity,
          input: good,
          index: i,
        });
      })
      .flat();
}

namespace ShoppingOrderGoodDiagnoser {
  export const validate = (props: {
    commodity: IShoppingCartCommodity;
    input: IShoppingOrderGood.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = ShoppingSaleDiagnoser.readable({
      accessor: `input.goods.${props.index}.commodity.sale`,
      checkPause: true,
      sale: props.commodity.sale,
    });
    for (const unit of props.commodity.sale.units)
      for (const stock of unit.stocks)
        if (
          stock.quantity * props.input.volume >
          stock.inventory.income - stock.inventory.outcome
        )
          output.push({
            accessor: `input.goods.${props.index}.volume`,
            message: `Not enough inventory on nested stock#${stock.id}.`,
          });
    return output;
  };
}

namespace ShoppingCartCommodityStockDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit;
    commodity: IShoppingCartCommodity.ICreate;
    input: IShoppingCartCommodityStock.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    props.input.choices.forEach((choice, i) => {
      output.push(
        ...ShoppingCartCommodityStockChoiceDiagnoser.validate({
          unit: props.unit,
          stockIndex: props.index,
          input: choice,
          index: i,
        }),
      );
    });
    const stock: IShoppingSaleUnitStock | undefined = props.unit.stocks.find(
      (stock) => stock.id === props.input.stock_id,
    );
    if (stock === undefined)
      output.push({
        accessor: `$input.stocks[${props.index}].stock_id`,
        message: "Unable to find the matched stock.",
      });
    else if (
      stock.inventory.income - stock.inventory.outcome <
      props.input.quantity * props.commodity.volume
    )
      output.push({
        accessor: `$input.stocks[${props.index}].quantity`,
        message: "Insufficient inventory.",
      });
    return output;
  };

  export const replica = (props: {
    unit: IShoppingSaleUnit.IInvert;
    stock: IShoppingSaleUnitStock.IInvert;
  }): IShoppingCartCommodityStock.ICreate => ({
    unit_id: props.unit.id,
    stock_id: props.stock.id,
    choices: props.stock.choices
      .map(ShoppingCartCommodityStockChoiceDiagnoser.replica)
      .filter((c) => c !== null),
    quantity: props.stock.quantity,
  });

  export const preview = (props: {
    unit: IShoppingSaleUnit;
    input: IShoppingCartCommodityStock.ICreate;
  }): IShoppingSaleUnitStock.IInvert => {
    const stock: IShoppingSaleUnitStock | undefined = props.unit.stocks.find(
      (stock) => stock.id === props.input.stock_id,
    );
    if (stock === undefined) throw new Error("Unable to find the matched stock.");
    return {
      id: stock.id,
      name: stock.name,
      price: stock.price,
      inventory: stock.inventory,
      quantity: props.input.quantity,
      choices: [
        ...stock.choices.map((choice) => {
          const option = props.unit.options.find(
            (o) => o.id === choice.option_id,
          )!;
          const candidate = (
            option as IShoppingSaleUnitSelectableOption
          ).candidates.find((c) => c.id === choice.candidate_id)!;
          return {
            id: choice.id,
            option,
            candidate,
            value: null,
          } satisfies IShoppingSaleUnitStockChoice.IInvert;
        }),
        ...props.input.choices.map((choice) => {
          const option = props.unit.options.find(
            (o) => o.id === choice.option_id,
          )!;
          return {
            id: v4(),
            option,
            candidate: null,
            value: choice.value,
          } satisfies IShoppingSaleUnitStockChoice.IInvert;
        }),
      ],
    };
  };
}

namespace ShoppingCartCommodityStockChoiceDiagnoser {
  export const validate = (props: {
    unit: IShoppingSaleUnit;
    stockIndex: number;
    input: IShoppingCartCommodityStockChoice.ICreate;
    index: number;
  }): IDiagnosis[] => {
    const output: IDiagnosis[] = [];
    const option: IShoppingSaleUnitOption | undefined = props.unit.options.find(
      (o) => o.id === props.input.option_id,
    );
    if (option === undefined)
      output.push({
        accessor: `items[${props.stockIndex}].choices[${props.index}].option_id`,
        message: "Unable to find the matched option.",
      });
    else if (option.type === "select")
      output.push({
        accessor: `items[${props.stockIndex}].choices[${props.index}]`,
        message: "The select option does not require the choice composition.",
      });
    else if (props.input.value !== null) {
      if (option.type === "boolean" && typeof props.input.value !== "boolean")
        output.push({
          accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
          message: "The value must be boolean type.",
        });
      else if (option.type === "number" && typeof props.input.value !== "number")
        output.push({
          accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
          message: "The value must be number type.",
        });
      else if (option.type === "string" && typeof props.input.value !== "string")
        output.push({
          accessor: `items[${props.stockIndex}].choices[${props.index}].value`,
          message: "The value must be string type.",
        });
    }
    return output;
  };

  export const replica = (
    choice: IShoppingSaleUnitStockChoice.IInvert,
  ): IShoppingCartCommodityStockChoice.ICreate | null =>
    choice.option.type === "select"
      ? null
      : {
          option_id: choice.option.id,
          value: choice.value,
        };
}

namespace ShoppingSaleSnapshotDiagnoser {
  export const replica = (
    snapshot: IShoppingSaleSnapshot,
  ): IShoppingSaleSnapshot.ICreate => ({
    category_codes: snapshot.categories.map((c) => c.code),
    content: ShoppingSaleContentDiagnoser.replica(snapshot.content),
    units: snapshot.units.map(ShoppingSaleUnitDiagnoser.replica),
    tags: snapshot.tags.slice(),
  });
}

namespace ShoppingSaleContentDiagnoser {
  export const replica = (
    input: IShoppingSaleContent,
  ): IShoppingSaleContent.ICreate => ({
    title: input.title,
    body: input.body,
    format: input.format,
    thumbnails: input.thumbnails.map(AttachmentFileDiagnoser.replica),
    files: input.files.map(AttachmentFileDiagnoser.replica),
  });
}

namespace AttachmentFileDiagnoser {
  export const replica = (input: IAttachmentFile): IAttachmentFile.ICreate => ({
    name: input.name,
    extension: input.extension,
    url: input.url,
  });
}

namespace ShoppingSaleUnitDiagnoser {
  export const replica = (
    unit: IShoppingSaleUnit,
  ): IShoppingSaleUnit.ICreate => ({
    name: unit.name,
    primary: unit.primary,
    required: unit.required,
    options: unit.options.map(ShoppingSaleUnitOptionDiagnoser.replica),
    stocks: unit.stocks.map((stock) =>
      ShoppingSaleUnitStockDiagnoser.replica({
        options: unit.options,
        stock,
      }),
    ),
  });
}

namespace ShoppingSaleUnitOptionDiagnoser {
  export const replica = (
    input: IShoppingSaleUnitOption,
  ): IShoppingSaleUnitOption.ICreate =>
    input.type === "select"
      ? {
          type: input.type,
          name: input.name,
          variable: input.variable,
          candidates: input.candidates.map((c) => ({
            name: c.name,
          })),
        }
      : {
          type: input.type,
          name: input.name,
        };
}

namespace ShoppingSaleUnitStockDiagnoser {
  export const replica = (props: {
    options: IShoppingSaleUnitOption[];
    stock: IShoppingSaleUnitStock;
  }): IShoppingSaleUnitStock.ICreate => ({
    name: props.stock.name,
    choices: props.stock.choices.map((choice) =>
      ShoppingSaleUnitStockChoiceDiagnoser.replica({
        options: props.options,
        choice,
      }),
    ),
    quantity: Math.max(
      0,
      props.stock.inventory.income - props.stock.inventory.outcome,
    ),
    price: {
      nominal: props.stock.price.nominal,
      real: props.stock.price.real,
    },
  });
}

namespace ShoppingSaleUnitStockChoiceDiagnoser {
  export const replica = (props: {
    options: IShoppingSaleUnitOption[];
    choice: IShoppingSaleUnitStockChoice;
  }): IShoppingSaleUnitStockChoice.ICreate => {
    const optionIndex: number = props.options.findIndex(
      (o) => o.id === props.choice.option_id,
    );
    if (optionIndex === -1)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched option.",
      );
    const option: IShoppingSaleUnitOption = props.options[optionIndex];
    if (option.type !== "select")
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option type must be 'select'.",
      );
    else if (option.variable === false)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): option must be variable.",
      );
    const candidateIndex: number = option.candidates.findIndex(
      (c) => c.id === props.choice.candidate_id,
    );
    if (candidateIndex === -1)
      throw new Error(
        "Error on ShoppingSaleUnitStockChoiceDiagnoser.replica(): unable to find the matched candidate.",
      );
    return {
      option_index: optionIndex,
      candidate_index: candidateIndex,
    };
  };
}

namespace ShoppingDiscountableDiagnoser {
  export interface IAccessor<T> {
    item: (value: T) => IShoppingCartCommodity;
    volume: (value: T) => number;
  }

  export interface ICombination {
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    entries: IEntry[];
    amount: number;
  }

  export interface IEntry {
    coupon_id: string;
    item_id: string;
    amount: number;
  }

  interface IDiscount {
    amount: number;
    coupon_to_elem_dict: Map<string, Map<string, number>>;
  }

  export const checkCoupon = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    data: T[];
  }): boolean => filterItems(props).length !== 0;

  const filterItems = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupon: IShoppingCoupon;
    data: T[];
  }): T[] =>
    filterThreshold({
      accessor: props.accessor,
      coupon: props.coupon,
      data: props.data.filter((elem) =>
        ShoppingCouponDiagnoser.adjustable({
          customer: props.customer,
          sale: props.accessor.item(elem).sale,
          coupon: props.coupon,
        }),
      ),
    });

  const filterThreshold = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    coupon: IShoppingCoupon;
    data: T[];
  }): T[] => {
    if (props.coupon.discount.threshold === null)
      return props.coupon.discount.unit === "amount" &&
        props.coupon.discount.multiplicative === true
        ? props.data.filter(
            (elem) =>
              props.accessor.item(elem).price.real >=
              props.coupon.discount.value,
          )
        : props.data;
    else if (
      props.coupon.discount.unit === "amount" &&
      props.coupon.discount.multiplicative === true
    )
      return props.data.filter(
        (elem) =>
          props.accessor.item(elem).price.real >=
            props.coupon.discount.threshold! &&
          props.accessor.item(elem).price.real >= props.coupon.discount.value,
      );
    const sum: number = props.data
      .map((elem) => getPrice(props.accessor)(elem))
      .reduce((x, y) => x + y, 0);
    return sum >= props.coupon.discount.threshold ? props.data : [];
  };

  const getPrice =
    <T extends IEntity>(accessor: IAccessor<T>) =>
    (elem: T): number =>
      accessor.item(elem).price.real * accessor.volume(elem);

  const discount = <T extends IEntity>(props: {
    className: string;
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    data: T[];
  }): IDiscount => {
    ShoppingCouponDiagnoser.sort(props.coupons);
    if (false === ShoppingCouponDiagnoser.coexistable(props.coupons))
      throw new Error(
        `Error on ${props.className}.discount(): target coupons are not coexistable.`,
      );

    const output: IDiscount = {
      amount: 0,
      coupon_to_elem_dict: new Map(),
    };
    for (const coupon of props.coupons) {
      const filtered: T[] = filterItems({
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupon,
      });
      if (filtered.length !== 0)
        determine({
          accessor: props.accessor,
          coupon,
          data: props.data,
          output,
        });
    }
    return output;
  };

  const determine = <T extends IEntity>(props: {
    accessor: IAccessor<T>;
    coupon: IShoppingCoupon;
    data: T[];
    output: IDiscount;
  }) => {
    const adjust = (elem: T, value: number) => {
      take(
        props.output.coupon_to_elem_dict,
        props.coupon.id,
        () => new Map<string, number>(),
      ).set(elem.id, value);
    };
    if (props.coupon.discount.unit === "percent")
      for (const elem of props.data) {
        const value: number =
          (props.coupon.discount.value / 100) * getPrice(props.accessor)(elem);
        props.output.amount += value;
        adjust(elem, value);
      }
    else if (props.coupon.discount.multiplicative === true)
      for (const elem of props.data) {
        const value: number =
          props.coupon.discount.value * props.accessor.volume(elem);
        adjust(elem, value);
        props.output.amount += value;
      }
    else {
      const denominator: number = props.data
        .map((elem) => getPrice(props.accessor)(elem))
        .reduce((x, y) => x + y, 0);
      for (const elem of props.data) {
        const value: number =
          ((props.coupon.discount.value / 100) *
            getPrice(props.accessor)(elem)) /
          denominator;
        adjust(elem, value);
      }
      props.output.amount += props.coupon.discount.value;
    }
  };

  export const combine = <T extends IEntity>(props: {
    className: string;
    accessor: IAccessor<T>;
    customer: IShoppingCustomer;
    coupons: IShoppingCoupon[];
    tickets: IShoppingCouponTicket[];
    data: T[];
  }): ICombination[] => {
    const ticketMap: Map<string, IShoppingCouponTicket> = new Map(
      props.tickets.map((t) => [t.coupon.id, t]),
    );
    const coupons = props.coupons.filter(
      (c) =>
        false === ticketMap.has(c.id) &&
        checkCoupon({
          accessor: props.accessor,
          customer: props.customer,
          data: props.data,
          coupon: c,
        }),
    );
    const tickets = [...ticketMap.values()].filter((elem) =>
      checkCoupon({
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupon: elem.coupon,
      }),
    );

    const entire: IShoppingCoupon[] = [
      ...coupons,
      ...tickets.map((t) => t.coupon),
    ];
    const matrix: IShoppingCoupon[][] = [
      entire.filter((c) => c.restriction.exclusive === false),
      ...entire.filter((c) => c.restriction.exclusive === true).map((c) => [c]),
    ].filter((row) => row.length !== 0);
    const combinations: IDiscount[] = matrix.map((coupons) =>
      discount({
        className: props.className,
        accessor: props.accessor,
        customer: props.customer,
        data: props.data,
        coupons,
      }),
    );
    return combinations.map((comb, i) => ({
      coupons: matrix[i].filter((x) => coupons.some((y) => x.id === y.id)),
      tickets: tickets.filter((t) =>
        matrix[i].some((c) => c.id === t.coupon.id),
      ),
      entries: [...comb.coupon_to_elem_dict.entries()]
        .map(([coupon_id, elements]) =>
          [...elements.entries()].map(([item_id, amount]) => ({
            coupon_id,
            item_id,
            amount,
          })),
        )
        .flat(),
      amount: comb.amount,
    }));
  };
}

namespace ShoppingCouponDiagnoser {
  export const adjustable = (props: {
    customer: IShoppingCustomer;
    sale: IShoppingSaleSnapshot.IInvert;
    coupon: IShoppingCoupon;
  }): boolean =>
    props.coupon.criterias.every((criteria) =>
      ShoppingCouponCriteriaDiagnoser.adjustable({
        customer: props.customer,
        sale: props.sale,
        criteria,
      }),
    );

  export const coexistable = (coupons: IShoppingCoupon[]): boolean =>
    coupons.length <= 1 ||
    coupons.every((c) => c.restriction.exclusive === false);

  export const sort = <T extends IShoppingCoupon>(coupons: T[]): T[] =>
    coupons.sort(compare);

  function compare(x: IShoppingCoupon, y: IShoppingCoupon): number {
    if (x.discount.unit !== y.discount.unit)
      return x.discount.unit === "percent" ? -1 : 1;
    else if (x.discount.unit === "amount" && y.discount.unit === "amount")
      return Number(x.discount.value) - Number(y.discount.value);
    else return y.discount.value - x.discount.value;
  }
}

namespace ShoppingCouponCriteriaDiagnoser {
  export const adjustable = (props: {
    customer: IShoppingCustomer;
    sale: IShoppingSaleSnapshot.IInvert;
    criteria: IShoppingCouponCriteria;
  }) => {
    const result: boolean = include(props);
    return props.criteria.direction === "include" ? result : !result;
  };

  const include = (props: {
    customer: IShoppingCustomer;
    sale: IShoppingSaleSnapshot.IInvert;
    criteria: IShoppingCouponCriteria;
  }): boolean => {
    if (props.criteria.type === "section")
      return props.criteria.sections.some(
        (section) => section.id === props.sale.section.id,
      );
    else if (props.criteria.type === "seller")
      return props.criteria.sellers.some(
        (seller) => seller.id === props.sale.seller.id,
      );
    else if (props.criteria.type === "sale")
      return props.criteria.sales.some((sale) => sale.id === props.sale.id);
    else if (props.criteria.type === "funnel")
      return props.criteria.funnels.some((funnel) => {
        if (funnel.kind === "url")
          return props.customer.href.startsWith(funnel.value);
        else if (funnel.kind === "referrer")
          return (
            props.customer.referrer !== null &&
            props.customer.referrer.startsWith(funnel.value)
          );
        else if (funnel.kind === "variable") {
          const question: number = props.customer.href.lastIndexOf("?");
          if (question === -1) return false;
          const params: URLSearchParams = new URLSearchParams(
            props.customer.href.substring(question + 1),
          );
          return params.get(funnel.key) === funnel.value;
        }
        return false;
      });
    return false;
  };
}

const cartAccessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingCartCommodity> =
  {
    item: (commodity) => commodity,
    volume: (commodity) => commodity.volume,
  };

const orderAccessor: ShoppingDiscountableDiagnoser.IAccessor<IShoppingOrderGood> =
  {
    item: (good) => good.commodity,
    volume: (good) => good.volume,
  };

const customerInvert = (
  customer: IShoppingCustomer,
): IShoppingCustomer.IInvert => ({
  id: customer.id,
  channel: customer.channel,
  external_user: customer.external_user,
  href: customer.href,
  referrer: customer.referrer,
  ip: customer.ip,
  created_at: customer.created_at,
});

const memberInvert = (member: IShoppingMember): IShoppingMember.IInvert => ({
  id: member.id,
  nickname: member.nickname,
  emails: member.emails,
  created_at: member.created_at,
});

const take = <Key, T>(map: Map<Key, T>, key: Key, factory: () => T): T => {
  let value = map.get(key);
  if (value === undefined) {
    value = factory();
    map.set(key, value);
  }
  return value;
};

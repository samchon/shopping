export const shoppingConfig = {
  get apiHost() {
    return (
      process.env.VITE_SHOPPING_API_HOST?.trim() || "http://127.0.0.1:37001"
    );
  },
  get channelCode() {
    return process.env.VITE_SHOPPING_CHANNEL_CODE?.trim() || "samchon";
  },
  get simulate() {
    return (
      process.env.VITE_SHOPPING_API_SIMULATE?.trim() === "true" ||
      process.env.SHOPPING_API_SIMULATE?.trim() === "true"
    );
  },
};

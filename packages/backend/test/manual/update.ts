import ShoppingApi from "@samchon/shopping-api";
import { ArrayUtil } from "@nestia/e2e";
import { sleep_for } from "tstl";
import { ShoppingConfiguration } from "../../src/ShoppingConfiguration";
import { Terminal } from "../../src/utils/Terminal";

async function main(): Promise<void> {
  //----
  // PREPARATIONS
  //----
  // START UPDATOR SERVER
  await Terminal.execute("pnpm run start:updator:master");
  await sleep_for(1000);

  // START BACKEND SERVER
  await Terminal.execute("pnpm run start local xxxx yyyy zzzz");
  await sleep_for(4000);

  // API LIBRARY
  const connection: ShoppingApi.IConnection = {
    host: `http://127.0.0.1:${ShoppingConfiguration.API_PORT()}`,
  };

  sleep_for(1000)
    .then(async () => {
      console.log("Start updating");
      await Terminal.execute("pnpm run update");
      console.log("The update has been completed");
    })
    .catch(() => {});

  await Promise.all(
    ArrayUtil.repeat(600, async (i) => {
      await sleep_for(i * 10);
      await ShoppingApi.functional.monitors.system.get(connection);
    }),
  );
  await Terminal.execute("pnpm run stop");
  await Terminal.execute("pnpm run stop:updator:master");
}
main().catch((exp: unknown) => {
  console.log(exp);
  process.exit(-1);
});

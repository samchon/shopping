import { ShoppingBackend } from "../src/ShoppingBackend";
import { ShoppingGlobal } from "../src/ShoppingGlobal";
import { TestAutomation } from "./TestAutomation";

ShoppingGlobal.testing = true;
TestAutomation.execute({
  open: async () => {
    const backend: ShoppingBackend = new ShoppingBackend();
    await backend.open();
    return backend;
  },
  close: async (backend) => {
    await backend.close();
  },
}).catch((exp: unknown) => {
  console.log(exp);
  process.exit(-1);
});

import cp from "child_process";
import net from "net";

const waitForPostgres = () =>
  new Promise<void>((resolve) => {
    const check = () => {
      const socket = net.connect(5432, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        setTimeout(check, 1000);
      });
    };
    check();
  });

async function main(): Promise<void> {
  const start = (directory: string) =>
    new Promise<number | null>((resolve, reject) => {
      const child = cp.spawn("pnpm start", {
        cwd: `${process.cwd()}/packages/${directory}`,
        shell: true,
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", resolve);
    });

  console.log("[fullstack] waiting for PostgreSQL");
  await waitForPostgres();

  console.log("[fullstack] creating schema and seeding demo data");
  cp.execSync("pnpm schema", {
    cwd: `${process.cwd()}/packages/backend`,
    stdio: "inherit",
  });

  console.log("[fullstack] starting backend");
  const backend = start("backend");

  console.log("[fullstack] starting frontend");
  const frontend = start("frontend");

  const code = await Promise.race([backend, frontend]);
  process.exit(code ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

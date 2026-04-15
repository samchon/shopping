import cp, { type ChildProcess } from "child_process";
import net from "net";

async function wait(port: number): Promise<void> {
  await new Promise<void>((resolve: () => void) => {
    const timer: NodeJS.Timeout = setInterval((): void => {
      const socket: net.Socket = net.connect(port, "127.0.0.1");
      socket.once("connect", (): void => {
        clearInterval(timer);
        socket.destroy();
        resolve();
      });
      socket.once("error", (): void => {
        socket.destroy();
      });
    }, 500);
  });
}

async function main(): Promise<void> {
  const start = (directory: string, script: string): Promise<number | null> =>
    new Promise(
      (
        resolve: (value: number | null) => void,
        reject: (reason?: unknown) => void,
      ) => {
        const child: ChildProcess = cp.spawn(`pnpm ${script}`, {
          cwd: `${__dirname}/../packages/${directory}`,
          shell: true,
          stdio: "inherit",
        });
        child.once("error", reject);
        child.once("exit", resolve);
      },
    );

  console.log("------------------------------------------------");
  console.log("[fullstack] starting backend");
  console.log("------------------------------------------------");
  const backend: Promise<number | null> = start("backend", "start");
  await wait(37001);

  console.log("------------------------------------------------");
  console.log("[fullstack] starting frontend (dev)");
  console.log("------------------------------------------------");
  const frontend: Promise<number | null> = start("frontend", "dev");

  const code: number | null = await Promise.race([backend, frontend]);
  process.exit(code ?? 1);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

import cp from "child_process";

async function main(): Promise<void> {
  const start = (directory: string, script: string) =>
    new Promise<number | null>((resolve, reject) => {
      const child = cp.spawn(`pnpm ${script}`, {
        cwd: `${process.cwd()}/packages/${directory}`,
        shell: true,
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", resolve);
    });

  console.log("[fullstack] starting backend");
  const backend = start("backend", "start");

  console.log("[fullstack] starting frontend (dev)");
  const frontend = start("frontend", "dev");

  const code = await Promise.race([backend, frontend]);
  process.exit(code ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

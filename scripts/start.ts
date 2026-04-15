import cp from "child_process";

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

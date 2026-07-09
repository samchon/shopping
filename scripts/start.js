const cp = require("node:child_process");
const net = require("node:net");
const path = require("node:path");

async function wait(port) {
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("connect", () => {
        clearInterval(timer);
        socket.destroy();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
      });
    }, 500);
  });
}

async function main() {
  const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  const start = (directory, script) =>
    new Promise((resolve, reject) => {
      const child = cp.spawn(command, [script], {
        cwd: path.join(__dirname, "..", "packages", directory),
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", resolve);
    });

  console.log("------------------------------------------------");
  console.log("[fullstack] starting backend");
  console.log("------------------------------------------------");
  const backend = start("backend", "start");
  await wait(37001);

  console.log("------------------------------------------------");
  console.log("[fullstack] starting frontend (dev)");
  console.log("------------------------------------------------");
  const frontend = start("frontend", "dev");

  const code = await Promise.race([backend, frontend]);
  process.exit(code ?? 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

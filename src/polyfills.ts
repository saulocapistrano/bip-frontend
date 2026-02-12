(globalThis as any).global = globalThis;

if (!(globalThis as any).process) {
  (globalThis as any).process = { env: {} };
} else if (!(globalThis as any).process.env) {
  (globalThis as any).process.env = {};
}

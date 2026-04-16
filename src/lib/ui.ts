const esc = (code: string) => (s: string) => `\x1b[${code}m${s}\x1b[0m`;

export const bold = esc("1");
export const dim = esc("2");
export const green = esc("32");
export const red = esc("31");
export const yellow = esc("33");
export const cyan = esc("36");

export function error(msg: string): never {
  console.error(`${red("error:")} ${msg}`);
  process.exit(1);
}

export function info(msg: string) {
  console.log(`${cyan(">")} ${msg}`);
}

export function success(msg: string) {
  console.log(`${green(">")} ${msg}`);
}

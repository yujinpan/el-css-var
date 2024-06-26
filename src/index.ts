export function helloWorld(options: { msg: string }) {
  // eslint-disable-next-line no-console
  console.log(options.msg);
  return options.msg;
}

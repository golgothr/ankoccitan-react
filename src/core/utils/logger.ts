export const logger = {
  log: (...args: any[]) => import.meta.env.DEV && console.log(...args),
  error: (...args: any[]) => import.meta.env.DEV && console.error(...args),
  warn: (...args: any[]) => import.meta.env.DEV && console.warn(...args)
};

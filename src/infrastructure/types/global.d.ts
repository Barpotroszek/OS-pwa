declare global {
  interface Window { homepage: string; registration: ServiceWorkerRegistration }
}

declare module "*.css";
export type callbackWithNumber<T> = (value: number) => T;
export type callbackWithBoolean = (value: boolean) => void;
export type callbackWithoutArgument = () => void
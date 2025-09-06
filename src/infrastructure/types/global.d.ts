declare global {
  interface Window { homepage: string; registration: ServiceWorkerRegistration }
}
export type callbackWithNumber = (value: number) => void;
export type callbackWithBoolean = (value: boolean) => void;
export type callbackWithoutArgument = () => void
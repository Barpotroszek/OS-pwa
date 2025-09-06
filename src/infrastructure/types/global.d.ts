declare global {
  interface Window { homepage: string; registration: ServiceWorkerRegistration }
}
type callbackWithNumber = (value: number) => void;
type callbackWithoutArgument = () => void

export { callbackWithNumber, callbackWithoutArgument }
export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchSpecificSnapshot(path: string, name?: string): R;
    }
  }
}

export type Bindings = {
  DB: D1Database;
};

declare global {
  namespace Process {
    interface Env {}
  }
}

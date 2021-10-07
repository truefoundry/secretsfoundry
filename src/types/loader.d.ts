type LoaderUnion<T> = new(...args : any[]) => T;

interface ILoader {
  resolveVariable: (...args: string[]) => Promise<string>;

  canResolve: (variable: string) => boolean;

  getArgsFromStr: (argsStr: string) => Record<string, string>;
}
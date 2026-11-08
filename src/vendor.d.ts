declare module "git-current-commit" {
  type Callback = (err: Error | null, sha?: string) => void;

  function gitCurrentCommit(cb: Callback): void;
  function gitCurrentCommit(dir: string, cb: Callback): void;
  namespace gitCurrentCommit {
    function sync(dir?: string): string;
    function promise(dir?: string): Promise<string>;
  }
  export default gitCurrentCommit;
}

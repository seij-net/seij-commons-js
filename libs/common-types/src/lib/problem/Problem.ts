import { isString } from "lodash-es";

export class Problem {
  constructor(public readonly json: ProblemJson) {}

  public get type(): string {
    return this.json.type;
  }
  public get title(): string {
    return this.json.title;
  }
  public get detail(): string | null {
    return this.json.detail ?? null;
  }
  public get instance(): string | null {
    return this.json.instance ?? null;
  }
  public get status(): number | null {
    return this.json.status ?? null;
  }
}
export interface ProblemJson {
  type: string;
  status?: number;
  title: string;
  detail?: string;
  instance?: string;
}

type UnknownProblem = unknown | null | undefined;

export function toProblem(...errs: UnknownProblem[]): Problem | null {
  if (errs.length === 0) return null;
  for (const err of errs) {
    if (err === null) continue;
    if (err === undefined) continue;
    if (err instanceof Problem) return err;
    if (err instanceof Error) return new Problem({ type: "about:blank", title: err.message });
    if (err instanceof DOMException) return new Problem({ type: "about:blank", title: err.message });
    if (isString(err)) return new Problem({ type: "about:blank", title: err });
    return new Problem({ type: "about:blank", title: "" + err });
  }
  return null;
}

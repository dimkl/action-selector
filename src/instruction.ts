import { InvalidEncodedInstructionError } from "./errors";
import { EchoFormatter, HexFormatter } from "./formatter";
import type { Formatter } from "./formatter";
import { EchoParser, HexParser } from "./parser";
import type { Parser } from "./parser";

export const ACTIONS = [
  "blur",
  "click",
  "focus",
  "hidePopover",
  "showPopover",
  "togglePopover",
] as const;

export type Fn = (...a: unknown[]) => void;

export type Selector = string;
export type MethodAction = (typeof ACTIONS)[number];
export type Action = MethodAction;

export interface Instruction {
  action: Action;
  selector: Selector;
}
export type SerializedInstruction = `${Action}=${Selector}`;

export class InstructionEncoder {
  #formatter: Formatter;

  constructor(formatter: Formatter = new EchoFormatter()) {
    this.#formatter = formatter;
  }

  encode(instruction: Instruction): string {
    return this.#formatter.format(
      `${instruction.action}=${instruction.selector}`,
    );
  }
}

export class BatchInstructionEncoder {
  #encoder = new InstructionEncoder();
  #formatter: Formatter;

  constructor(formatter: Formatter = new HexFormatter()) {
    this.#formatter = formatter;
  }

  encode(instructions: Instruction[]): string {
    return this.#formatter.format(
      instructions.map(i => this.#encoder.encode(i)).join("|"),
    );
  }
}

export class InstructionDecoder {
  #parser: Parser;

  constructor(parser: Parser = new EchoParser()) {
    this.#parser = parser;
  }

  decode(value: string): Instruction {
    const parts = this.#parser.parse(value).split("=");
    if (parts.length !== 2) {
      throw new InvalidEncodedInstructionError(value);
    }

    return { action: parts[0] as Action, selector: parts[1] };
  }
}

export class BatchInstructionDecoder {
  #decoder = new InstructionDecoder();
  #parser: Parser;

  constructor(parser: Parser = new HexParser()) {
    this.#parser = parser;
  }

  decode(value: string): Instruction[] {
    return this.#parser
      .parse(value)
      .split("|")
      .map(i => this.#decoder.decode(i));
  }
}

export class InstructionInvoker {
  constructor(readonly customActions: Record<string, Fn> = {}) {}

  find(actionName: Action, el: Element): Fn | undefined {
    let fn;
    if (this.customActions[actionName]) {
      fn = this.customActions[actionName];
    } else if (ACTIONS.includes(actionName)) {
      fn = el[actionName] && el[actionName];
    }
    return fn;
  }

  invoke(actionName: Action, el: Element): Error | undefined {
    const fn = this.find(actionName, el);
    if (!fn) return;

    try {
      fn.bind(el)();
    } catch (err) {
      return err;
    }
  }
}

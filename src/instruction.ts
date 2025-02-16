import { InvalidEncodedInstructionError } from "./errors";

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
  hexEncode(value: string) {
    const utf8encoder = new TextEncoder();
    const rb = utf8encoder.encode(value);
    let r = "";
    for (const b of rb) {
      r += ("0" + b.toString(16)).slice(-2);
    }
    return r;
  }

  encode(instruction: Instruction): string {
    return `${instruction.action}=${instruction.selector}`;
  }
}

export class BatchInstructionEncoder {
  #encoder = new InstructionEncoder();

  encode(instructions: Instruction[]): string {
    return this.#encoder.hexEncode(
      instructions.map(this.#encoder.encode).join("|"),
    );
  }
}

export class InstructionDecoder {
  hexDecode(str: string) {
    return decodeURIComponent(
      str.replace(/[0-9a-f]{2}/g, "%$&"), // add '%' before each 2 characters
    );
  }

  decode(value: string): Instruction {
    const parts = value.split("=");
    if (parts.length !== 2) {
      throw new InvalidEncodedInstructionError(value);
    }

    return { action: parts[0] as Action, selector: parts[1] };
  }
}

export class BatchInstructionDecoder {
  #decoder = new InstructionDecoder();

  decode(value: string): Instruction[] {
    return this.#decoder.hexDecode(value).split("|").map(this.#decoder.decode);
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

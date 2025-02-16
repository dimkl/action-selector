import { InvalidEncodedInstructionError } from "./errors";

export const ACTIONS = [
  "blur",
  "click",
  "focus",
  "hidePopover",
  "showPopover",
  "togglePopover",
] as const;
export const EVENTS = [
  "beforetoggle",
  "change",
  "commandExperimental",
  "copy",
  "cut",
  "drag",
  "dragend",
  "dragenter",
  "dragleave",
  "dragover",
  "dragstart",
  "drop",
  "error",
  "load",
  "paste",
  "toggle",
] as const;

export type Selector = string;
export type Fn = (...a: unknown[]) => void;
export type MethodAction = (typeof ACTIONS)[number];
export type EventAction = (typeof EVENTS)[number];
export type Action = MethodAction | EventAction;

export interface Instruction {
  action: Action;
  selector: Selector;
}
export type SerializedInstruction = `${Action}=${Selector}`;

export class InstructionEncoder {
  encode(instruction: Instruction): string {
    return `${instruction.action}=${instruction.selector}`;
  }
}

export class BatchInstructionEncoder {
  #encoder = new InstructionEncoder();

  hexEncode(value: string) {
    const utf8encoder = new TextEncoder();
    const rb = utf8encoder.encode(value);
    let r = "";
    for (const b of rb) {
      r += ("0" + b.toString(16)).slice(-2);
    }
    return r;
  }

  encode(instructions: Instruction[]): string {
    return this.hexEncode(instructions.map(this.#encoder.encode).join("|"));
  }
}

export class InstructionDecoder {
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

  hexDecode(str: string) {
    return decodeURIComponent(
      str.replace(/[0-9a-f]{2}/g, "%$&"), // add '%' before each 2 characters
    );
  }

  decode(value: string): Instruction[] {
    return this.hexDecode(value).split("|").map(this.#decoder.decode);
  }
}

export class InstructionInvoker {
  constructor(readonly customActions:  Record<string, Fn>) {}

  find(actionName: Action, el: Element): Fn | undefined {
    let fn;
    if (this.customActions[actionName]) {
      fn = this.customActions[actionName];
    }
    // @ts-expect-error Should be fixed somehow
    else if (EVENTS.includes(actionName)) {
      fn = el[`on${actionName}`] && el[`on${actionName}`];
    }
    // @ts-expect-error Should be fixed somehow
    else if (ACTIONS.includes(actionName)) {
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

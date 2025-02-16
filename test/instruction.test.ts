import { expect, describe, test, afterEach } from "vitest";
import {
  InstructionEncoder,
  BatchInstructionEncoder,
  InstructionDecoder,
  BatchInstructionDecoder,
  InstructionInvoker,
} from "../src/instruction";

import {
  instructions,
  encodedInstruction,
  encodedInstructions,
} from "./fixtures";

describe("InstructionEncoder", () => {
  test("encodes instruction to string", () => {
    const result = new InstructionEncoder().encode(instructions[0]);
    expect(result).toEqual(encodedInstruction);
  });
});

describe("BatchInstructionEncoder", () => {
  test("encodes instructions to string", () => {
    const result = new BatchInstructionEncoder().encode(instructions);
    expect(result).toEqual(encodedInstructions);
  });
});

describe("InstructionDecoder", () => {
  test("decodes instruction from string", () => {
    const result = new InstructionDecoder().decode(encodedInstruction);
    expect(result).toEqual(instructions[0]);
  });
});

describe("BatchInstructionDecoder", () => {
  test("decodes instructions from string", () => {
    const result = new BatchInstructionDecoder().decode(encodedInstructions);
    expect(result).toEqual(instructions);
  });
});

describe("InstructionInvoker", () => {
  afterEach(() => {
    document.body.click = () => null;
  });

  test("invokes instruction to element", () => {
    const error = new InstructionInvoker().invoke("click", document.body);
    expect(error).toBeUndefined();
  });

  test("handles error from invoked instruction to element", () => {
    document.body.click = () => {
      throw new Error("click errored");
    };

    const error = new InstructionInvoker().invoke("click", document.body);
    expect(error).toMatchObject({ message: "click errored" });
  });
});

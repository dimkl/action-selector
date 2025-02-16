import type { Instruction } from "../src/instruction";

export const instructions = [
  { action: "click", selector: "p" },
  { action: "blur", selector: "p" },
  { action: "focus", selector: "p" },
] as Instruction[];

export const encodedInstruction = "click=p";
export const encodedInstructions =
  "636c69636b3d707c626c75723d707c666f6375733d70";

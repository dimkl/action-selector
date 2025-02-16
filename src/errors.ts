export class InvalidEncodedInstructionError extends Error {
  constructor(instruction: string) {
    super(
      `Encoded instruction "${instruction}" should have "{Action}={Selector}" format!`,
    );
  }
}

export class InvalidSelectorError extends Error {
  constructor(selector: string) {
    super(`Cannot find element with selector "${selector}"!`);
  }
}

export class InvalidActionError extends Error {
  constructor(action: string, element: Element) {
    super(`Action ${action} does not exist for element ${element.getHTML()}`);
  }
}

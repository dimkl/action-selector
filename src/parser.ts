export interface Parser<T = string> {
  parse: (string) => T;
}

export class EchoParser implements Parser {
  parse(value: string) {
    return value;
  }
}

export class HexParser implements Parser {
  parse(value: string) {
    return decodeURIComponent(
      value.replace(/[0-9a-f]{2}/g, "%$&"), // add '%' before each 2 characters
    );
  }
}

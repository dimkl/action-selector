export interface Formatter {
  format: (string) => string;
}

export class EchoFormatter implements Formatter {
  format(value: string) {
    return value;
  }
}

export class HexFormatter implements Formatter {
  format(value: string) {
    const utf8encoder = new TextEncoder();
    const rb = utf8encoder.encode(value);
    let r = "";
    for (const b of rb) {
      r += ("0" + b.toString(16)).slice(-2);
    }
    return r;
  }
}

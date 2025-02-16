import { expect, describe, test, afterEach } from "vitest";
import { ActionSelector } from "../src/action-selector";

import { instructions } from "./fixtures";

describe("ActionSelector", () => {
  afterEach(() => {
    const p = document.querySelector("p");
    if (p) document.body.removeChild(p);
  });

  test("success", () => {
    document.body.appendChild(document.createElement("p"));

    const result = new ActionSelector({
      container: document.body,
      instructions,
    }).execute();
    expect(result.success).toEqual(true);
    expect(result.errors).toEqual([]);
  });

  test("executes all actions and fails any selector is missing from container", () => {
    const result = new ActionSelector({
      container: document.body,
      instructions,
    }).execute();
    expect(result.success).toEqual(false);
    expect(result.errors).toEqual([
      expect.objectContaining({
        message: 'Cannot find element with selector "p"!',
      }),
      expect.objectContaining({
        message: 'Cannot find element with selector "p"!',
      }),
      expect.objectContaining({
        message: 'Cannot find element with selector "p"!',
      }),
    ]);
  });
});

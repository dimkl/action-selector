import { InvalidSelectorError, InvalidActionError } from "./errors";
import type { Instruction, Action, Fn } from "./instruction";
import { InstructionInvoker } from "./instruction";

interface Logger {
  warn: Fn;
}
type ActionMapper = Record<string, Fn>;
type ActionAlias = Record<string, Action>;

interface ActionSelectorConfig {
  container: Element | string;
  instructions: Instruction[];
  actions?: {
    mapper?: ActionMapper;
    aliases?: ActionAlias;
  };
  logger?: Logger;
}
interface ActionSelectorResult {
  success: boolean;
  errors: Error[];
}

export class ActionSelector {
  #container: Element;
  #instructions: Instruction[];
  #actionsMapper: ActionMapper;
  #actionsAliases: ActionAlias;
  #logger: Logger;

  constructor(config: ActionSelectorConfig) {
    const {
      container,
      instructions = [],
      actions = {},
      logger = { warn: console.warn },
    } = config;

    this.#container =
      typeof container === "string" ? this.#findElement(container) : container;
    this.#instructions = instructions;
    this.#actionsMapper = actions.mapper || {};
    this.#actionsAliases = actions.aliases || {};
    this.#logger = logger;
  }

  #findElement(selector: string): Element {
    const container = document.querySelector(selector);
    if (!container) throw new InvalidSelectorError(selector);

    return container;
  }

  execute(): ActionSelectorResult {
    const errors = this.#instructions
      .map(({ selector, action }) => {
        const el = this.#container.querySelector(selector) as HTMLElement;

        if (!el) {
          return new InvalidSelectorError(selector);
        }

        const actionName = this.#actionsAliases[action] || action;
        const invoker = new InstructionInvoker(this.#actionsMapper);
        if (!invoker.find(actionName, el)) {
          return new InvalidActionError(action, el);
        }

        return invoker.invoke(actionName, el);
      })
      .filter(Boolean) as Error[];

    return { success: errors.length === 0, errors };
  }

  bindAction(action: string, callback: Fn): this {
    if (this.#actionsMapper[action]) {
      this.#logger.warn(`Overriding existing ${action} with new callback!`);
    }

    this.#actionsMapper[action] = callback;

    return this;
  }

  bindActionAlias(action: string, alias: string): this {
    if (this.#actionsAliases[action]) {
      this.#logger.warn(
        `Overriding existing ${action} alias from ${
          this.#actionsAliases[action]
        } to ${alias}!`,
      );
    }

    this.#actionsAliases[action] = alias as Action;

    return this;
  }
}

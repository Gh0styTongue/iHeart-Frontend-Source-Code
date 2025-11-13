/**
 * Manages a registry of slots, allowing for registration, addition, and removal of slots.
 */
import type { Logger } from '@iheartradio/web.utilities/create-logger';

export class SlotRegistry {
  #registeredSlots: Set<symbol>;
  #addedSlots: Set<string>;
  #logger?: Logger;
  #isTakeover: boolean;

  constructor(logger?: Logger) {
    this.#registeredSlots = new Set<symbol>();
    this.#addedSlots = new Set<string>();
    this.#isTakeover = false;
    if (logger) {
      this.#logger = logger;
    }
  }

  registerSlot() {
    const slot = Symbol();
    this.#registeredSlots.add(slot);
    this.#logger?.info(
      `Registering slot in SlotRegistry, # of registered slots: ${this.#registeredSlots.size}`,
    );
    return slot;
  }

  addSlot(slotId: string) {
    this.#addedSlots.add(slotId);
    this.#logger?.info(
      `Adding slot "${slotId}" to SlotRegistry, # of added slots: ${this.#addedSlots.size}`,
    );
  }

  unregisterSlot(slot: symbol) {
    this.#registeredSlots.delete(slot);
    this.#logger?.info(
      `Unregistering slot from SlotRegistry, # of registered slots: ${this.#registeredSlots.size}`,
    );
  }

  removeSlot(slotId: string) {
    this.#addedSlots.delete(slotId);
    this.#logger?.info(
      `Removing slot "${slotId}" from SlotRegistry, # of added slots: ${this.#addedSlots.size}`,
    );
  }

  get registeredSize() {
    this.#logger?.info(
      `SlotRegistry registeredSize: ${this.#registeredSlots.size}`,
    );
    return this.#registeredSlots.size;
  }

  get addedSize() {
    this.#logger?.info(`SlotRegistry addedSize: ${this.#addedSlots.size}`);
    return this.#addedSlots.size;
  }

  get isTakeover() {
    return this.#isTakeover;
  }

  set isTakeover(value: boolean) {
    this.#isTakeover = value;
  }
}

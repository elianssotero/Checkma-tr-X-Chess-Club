/**
 * Provider adapter base interface.
 *
 * This file is a minimally reconstructed replacement derived from the recovered
 * provider snippets in recovery-codes(1).html. It is not an original artifact.
 */
export class BaseProvider {
  constructor(providerId) {
    this.providerId = providerId;
  }

  async generate() {
    throw new Error(`${this.providerId}.generate() not implemented`);
  }

  async *stream() {
    throw new Error(`${this.providerId}.stream() not implemented`);
  }

  async healthCheck() {
    return { ok: true };
  }
}

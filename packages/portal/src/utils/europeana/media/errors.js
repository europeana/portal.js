export class IIIFInfoJsonError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IIIFInfoJsonError';
  }
}

export class IIIFManifestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'IIIFManifestError';
  }
}

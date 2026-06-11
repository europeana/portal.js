export class Token {
  static ID = '';
  #value = undefined;
  storage;

  static get id() {
    return `${this.ID}_token`;
  }

  constructor({ storage }) {
    this.storage = storage;
    this.load();
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.save();
  }

  clear() {
    this.value = undefined;
  }

  save() {
    if (this.value === undefined) {
      this.storage?.remove(this.constructor.id);
    } else {
      // TODO: consider & test expiration of the cookies
      this.storage?.set(this.constructor.id, this.value);
    }
  }

  load() {
    this.value = this.storage?.get(this.constructor.id);
  }
}
export class AccessToken extends Token {
  static ID = 'access';
}
export class RefreshToken extends Token {
  static ID = 'refresh';
}

export const createTokens = ({ storage }) => {
  return {
    access: new AccessToken({ storage }),
    clear() {
      // TODO: ensure that after this happens on server-side, on client-side
      //       the cookies & localStorage are cleared too
      this.access.clear();
      this.refresh.clear();
    },
    refresh: new RefreshToken({ storage }),
    setFromResponse(response) {
      this.access.value = response.data[AccessToken.id];
      this.refresh.value = response.data[RefreshToken.id];
    }
  };
};

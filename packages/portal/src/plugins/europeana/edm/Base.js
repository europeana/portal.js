export default class Base {
  // Fields to pick when constructing.
  // If empty, pick all.
  // Override in derived classes.
  static fields = [];

  // Map of property names to classes to instantiate for that property.
  // e.g. `{ webResources: WebResource }`
  // Override in derived classes.
  static propertyClasses = {};

  constructor(data) {
    for (const field in data) {
      if ((this.constructor.fields.length === 0) || this.constructor.fields.includes(field)) {
        if (this.constructor.propertyClasses[field]) {
          if (Array.isArray(data[field])) {
            this[field] = data[field].map((val) => new this.constructor.propertyClasses[field](val));
          } else {
            this[field] = new this.constructor.propertyClasses[field](data[field]);
          }
        } else {
          this[field] = data[field];
        }
      }
    }
  }
}

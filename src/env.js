module.exports = class Env {
  constructor(record, parent) {
    this.record = record;
    this.parent = parent;
  }

  define(name, value) {
    this.record[name] = value;
    return value;
  }

  assign(name, value) {
    this.resolve(name).record[name] = value;
    return value;
  }

  lookup(name) {
    return this.resolve(name).record[name];
  }

  resolve(name) {
    if (this.record.hasOwnProperty(name)) {
      return this;
    }

    if (this.parent == null) {
      throw new ReferenceError(`Variable "${name}" is not defined!`);
    }

    return this.parent.resolve(name);
  }
};

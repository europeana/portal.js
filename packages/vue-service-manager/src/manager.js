import { ref } from 'vue';

// TODO: detect when a service exists for which no selection has been made, e.g.
//       when new services have been added since selections were saved
export default class ServiceManager {
  selections = ref({});
  #serviceMap = {};

  constructor({ callback, services } = {}) {
    this.services = services;
    this.callback = callback;

    this.forEachService((service) => {
      this.#serviceMap[service.name] = service;
    });
    console.log('this.#serviceMap', this.#serviceMap)
  }

  forEachService(callback, targetServices = this.services) {
    for (const service of targetServices) {
      if (service.services) {
        this.forEachService(callback, service.services);
      }
      callback(service);
    }
  }

  serviceIsEnabled(name) {
    return this.selections.value[name];
  }

  serviceHasSelection(name) {
    return Object.keys(this.selections.value).includes(name);
  }

  get selectionsAreStored() {
    return !!localStorage.serviceManager;
  }

  // TODO: make computed
  get enabledServices() {
    return Object.keys(this.selections.value).filter((name) => this.selections.value[name]);
  }

  loadSelections() {
    if (this.selectionsAreStored) {
      this.selections.value = JSON.parse(localStorage.serviceManager);
    }
  }

  saveSelections() {
    localStorage.serviceManager = JSON.stringify(this.selections.value);
  }

  initSelections() {
    this.forEachService((service) => {
      if (service.required) {
        // force required services to be enableed, all the time
        this.enableService(service.name);
      } else {
        // not-required services favour the existing selection, otherwise default
        // to disableed
        if (!this.serviceHasSelection(service.name)) {
          this.disableService(service.name);
        }
      }
    });
  }

  getService(name) {
    return this.#serviceMap[name];
  }

  disableService(name) {
    // console.log('disableService', name)
    this.selections.value[name] = !!this.getService(name).required;
    // this.callback?.(service, this.selections.value[service.name]);
  }

  enableService(name) {
    this.selections.value[name] = true;
    // this.callback?.(service, this.selections.value[service.name]);
  }

  updateService(name, enabled) {
    enabled ? this.enableService(name) : this.disableService(name);
  }

  enableAllServices({ save = false } = {}) {
    this.forEachService((service) => {
      this.enableService(service.name);
    });

    if (save) {
      this.saveSelections();
    }
  }

  disableAllServices({ save = false } = {}) {
    this.forEachService((service) => {
      this.disableService(service.name);
    });

    if (save) {
      this.saveSelections();
    }
  }
}

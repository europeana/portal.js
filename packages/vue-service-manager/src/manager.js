import { ref } from 'vue';

export default class ServiceManager {
  selections = ref({});

  constructor({ callback, services } = {}) {
    this.services = services;
    this.callback = callback;
  }

  serviceIsSelected(service) {
    return this.selections.value[service.name];
  }

  serviceHasSelection(service) {
    return Object.keys(this.selections.value).includes(service.name);
  }

  get selectionsAreStored() {
    return !!localStorage.serviceSelections;
  }

  loadSelections() {
    if (this.selectionsAreStored) {
      this.selections.value = JSON.parse(localStorage.serviceSelections);
    }
  }

  storeSelections() {
    localStorage.serviceSelections = JSON.stringify(this.selections.value);
  }

  initSelections(targetServices = this.services) {
    for (const service of targetServices) {
      if (service.services) {
        this.initSelections(service.services);
      } else if (service.name) {
        if (service.required) {
          // force required services to be selected, all the time
          this.selectService(service);
        } else {
          // not-required services favour the existing selection, otherwise default
          // to deselected
          if (!this.serviceHasSelection(service)) {
            this.deselectService(service);
          }
        }
      }
    }
  }

  deselectService(service) {
    this.selections.value[service.name] = !!service.required;
    this.callback?.(service, this.selections.value[service.name]);
  }

  selectService(service) {
    this.selections.value[service.name] = true;
    this.callback?.(service, this.selections.value[service.name]);
  }

  selectAllServices(targetServices = this.services, { store = false } = {}) {
    for (const service of targetServices) {
      if (service.services) {
        this.selectAllServices(service.services);
      } else if (service.name) {
        this.selectService(service);
      }
    }

    if (store) {
      this.storeSelections();
    }
  }

  deselectAllServices(targetServices = this.services, { store = false } = {}) {
    for (const service of targetServices) {
      if (service.services) {
        this.deselectAllServices(service.services);
      } else if (service.name) {
        this.deselectService(service);
      }
    }

    if (store) {
      this.storeSelections();
    }
  }
}

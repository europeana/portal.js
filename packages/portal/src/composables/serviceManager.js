import { ref } from 'vue';

export default function useServiceManager(config = {}) {
  const { callback, services } = config;

  const selections = ref({});

  const serviceIsSelected = (service) => {
    return selections.value[service.name];
  };

  const serviceHasSelection = (service) => {
    return Object.keys(selections.value).includes(service.name);
  };

  // method, not computed, as localStorage is not reactive
  const selectionsAreStored = () => {
    return !!localStorage.serviceSelections;
  };

  const loadSelections = () => {
    if (selectionsAreStored) {
      selections.value = JSON.parse(localStorage.serviceSelections);
    }
  };

  const storeSelections = () => {
    localStorage.serviceSelections = JSON.stringify(selections.value);
  };

  const initSelections = (targetServices = services) => {
    for (const service of targetServices) {
      if (service.services) {
        initSelections(service.services);
      } else if (service.name) {
        if (service.required) {
          // force required services to be selected, all the time
          selectService(service);
        } else {
          // not-required services favour the existing selection, otherwise default
          // to deselected
          if (!serviceHasSelection(service)) {
            deselectService(service);
          }
        }
      }
    }
  };

  const deselectService = (service) => {
    selections.value[service.name] = service.required ? true : false;
    callback?.(service, selections.value[service.name]);
  };

  const selectService = (service) => {
    selections.value[service.name] = true;
    callback?.(service, selections.value[service.name]);
  };

  const selectAllServices = (targetServices = services, { store = false } = {}) => {
    for (const service of targetServices) {
      if (service.services) {
        selectAllServices(service.services);
      } else if (service.name) {
        selectService(service);
      }
    }

    if (store) {
      storeSelections();
    }
  };

  const deselectAllServices = (targetServices = services, { store = false } = {}) => {
    for (const service of targetServices) {
      if (service.services) {
        deselectAllServices(service.services);
      } else if (service.name) {
        deselectService(service);
      }
    }

    if (store) {
      storeSelections();
    }
  };

  loadSelections();
  initSelections();

  return {
    deselectAllServices,
    deselectService,
    loadSelections,
    selections,
    selectionsAreStored,
    selectAllServices,
    selectService,
    serviceIsSelected,
    services,
    storeSelections
  };
};

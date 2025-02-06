import { computed, readonly, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep.js';

const definitions = ref([]);
const disabled = ref([]);
const enabled = ref([]);
const saved = ref(false);
const selected = ref([]);

const forEach = (callback, { services = definitions.value } = {}) => {
  for (const service of services) {
    if (service.services) {
      forEach(callback, { services: service.services });
    }
    callback(service);
  }
};

const withServiceName = (serviceOrName, callback) => callback(serviceOrName?.name || serviceOrName);

const definitionMap = computed(() => {
  let map = {};
  forEach((service) => {
    map[service.name] = service;
  }, { services: definitions.value });
  return map;
});

const children = (service) => {
  return service.services ? service.services.map(children).flat() : service;
};

const isEnabled = (serviceOrName) => withServiceName(serviceOrName,
  (name) => enabled.value.includes(name)
);

const hasSelection = (serviceOrName) => withServiceName(serviceOrName,
  (name) => disabled.value.includes(name) || enabled.value.includes(name)
);

const loadStorage = () => {
  saved.value = !!localStorage.serviceManager;
  if (saved.value) {
    const parsed = JSON.parse(localStorage.serviceManager);
    (parsed.disabled || []).forEach(disable);
    (parsed.enabled || []).forEach(enable);
  }
};

// TODO: store expiration/timestamp too
const saveStorage = () => {
  localStorage.serviceManager = JSON.stringify({
    disabled: disabled.value,
    enabled: enabled.value
  });
  saved.value = true;
};

const select = (serviceOrName) => withServiceName(serviceOrName,
  (name) => {
    pushUnlessIncluded(selected.value, name);
  }
);

const deselect = (serviceOrName) => withServiceName(serviceOrName,
  (name) => {
    selected.value = removeArrayElement(selected.value, name);
  }
);

const isSelected = (serviceOrName) => withServiceName(serviceOrName,
  (name) => selected.value.includes(name)
);

const resetSelections = () => {
  forEach((service) => {
    if (enabled.value.includes(service.name) || service.required) {
      select(service);
    } else {
      deselect(service);
    }
  });
};

const get = (serviceOrName) => withServiceName(serviceOrName,
  (name) => definitionMap.value[name]
);

const pushUnlessIncluded = (array, element)  => {
  array.includes(element) || array.push(element);
};

const removeArrayElement = (array, element)  => {
  return array.filter((e) => e !== element);
};

const disable = (serviceOrName) => withServiceName(serviceOrName,
  (name) => {
    if (!get(name).required) {
      enabled.value = removeArrayElement(enabled.value, name);
      pushUnlessIncluded(disabled.value, name);
    }
  }
);

const enable = (serviceOrName) => withServiceName(serviceOrName,
  (name) => {
    disabled.value = removeArrayElement(disabled.value, name);
    pushUnlessIncluded(enabled.value, name);
  }
);

// filter the full service list to a subset, maintaining structure of ancestors
const pick = (target, list) => {
  if (Array.isArray(target)) {
    return target.map((one) => pick(one, list)).filter(Boolean);
  } else if (list.includes(target.name)) {
    return target;
  } else if (target.services) {
    target.services = pick(target.services, list);
    if (target.services.length) {
      return target;
    }
  }

  return null;
};

export function configure(config = {}) {
  if (config.definitions) {
    definitions.value = config.definitions;
    loadStorage();
    resetSelections();
  }
}

export default function useServiceManager(options = {}) {
  const services = ref([]);

  if (options.pick) {
    services.value = pick(cloneDeep(definitions.value), options.pick);
  } else {
    services.value = definitions.value;
  }

  const serviceMap = computed(() => {
    let map = {};
    forEach((service) => {
      map[service.name] = service;
    }, { services: services.value });
    return map;
  });

  const allServiceSelectionsStored = computed(() => {
    return saved.value && Object.keys(serviceMap.value).every((name) => enabled.value.includes(name) || disabled.value.includes(name));
  });

  const selectAll = () => forEach(select, { services: services.value });

  const deselectAll = () => forEach(deselect, { services: services.value });

  const apply = () => {
    forEach((service) => {
      if (selected.value.includes(service.name) || service.required) {
        enable(service);
      } else {
        disable(service);
      }
    }, { services: services.value });
    saveStorage();
    resetSelections();
  };

  return {
    allServiceSelectionsStored,
    apply,
    children,
    definitions: readonly(definitions),
    deselect,
    deselectAll,
    disable,
    disabled: readonly(disabled),
    enable,
    enabled: readonly(enabled),
    forEach,
    get,
    hasSelection,
    resetSelections,
    isEnabled,
    isSelected,
    loadStorage,
    saveStorage,
    saved: readonly(saved),
    select,
    selectAll,
    selected: readonly(selected),
    services: readonly(services)
  };
}

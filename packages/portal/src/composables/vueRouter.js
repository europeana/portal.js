import { computed, getCurrentInstance } from 'vue';

const getCurrentInstanceRoot = () => {
  const instance = getCurrentInstance();
  return instance.proxy.$root;
};

export const useRoute = () => {
  console.log('useRoute');
  const root = getCurrentInstanceRoot();
  const route = computed(() => root.$route);
  return route;
};

export const useRouter = () => {
  const root = getCurrentInstanceRoot();
  const router = computed(() => root.$router);
  return router;
};

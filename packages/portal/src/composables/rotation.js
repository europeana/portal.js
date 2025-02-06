import { ref } from 'vue';

// current rotation in radians
const rotation = ref(0);

const reset = () => {
  rotation.value = 0;
};
const rotateLess = () => {
  rotation.value = rotation.value - (Math.PI / 2);
};
const rotateMore = () => {
  rotation.value = rotation.value + (Math.PI / 2);
};
const setRotation = (value) => {
  rotation.value = value;
};

export default function useRotation() {
  return {
    reset,
    rotateLess,
    rotateMore,
    rotation,
    setRotation
  };
}

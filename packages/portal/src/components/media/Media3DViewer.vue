<template>
  <div ref="viewer" />
</template>

<script>
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  // TODO: add controls to interact with model
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  export default {
    props: {
      url: {
        type: String,
        required: true
      }
    },

    mounted() {
      this.initThreeJS();
    },

    methods: {
      initThreeJS() {
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(60, 1200 / 660, 0.1, 1000);
        camera.position.set(0, 10, 1);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(1200, 660);
        this.$refs.viewer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight('#FFFFFF', 1);
        scene.add(ambientLight);

        // TODO: More lights? DirectionalLight?

        const loader = new GLTFLoader();

        loader.load(this.url, (gltf) => {
          const model = gltf.scene;

          // Adjust scale to get model into view (can vary a lot per model)
          model.scale.set(0.005, 0.005, 0.005);
          // model.scale.set(10, 10, 10);

          scene.add(model);
          renderer.render(scene, camera);
        }, undefined, (error) => {
          console.error(error);
        });
      }
    }
  };
</script>

<template>
  <div
    ref="viewer"
    class="d-flex justify-content-center"
  />
</template>

<script>
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
        // Docs create a scene: https://threejs.org/manual/#en/creating-a-scene
        const scene = new THREE.Scene();

        // Docs camera: https://threejs.org/docs/?q=camera#PerspectiveCamera
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
        camera.position.set(0, 4, 0);

        const renderer = new THREE.WebGLRenderer();
        // TODO: set responsive width/height
        renderer.setSize(660, 660);
        this.$refs.viewer.appendChild(renderer.domElement);

        // Docs controls: https://threejs.org/docs/?q=orbit#OrbitControls
        new OrbitControls(camera, renderer.domElement);

        // Docs lights: https://threejs.org/manual/#en/lights
        const ambientLight = new THREE.AmbientLight('#FFFFFF', 3);
        scene.add(ambientLight);

        // Docs loading 3D models: https://threejs.org/manual/#en/loading-3d-models
        const loader = new GLTFLoader();

        loader.load(
          this.url,
          (gltf) => {
            const model = gltf.scene;

            this.scaleModel(model);

            scene.add(model);

            function animate() {
              requestAnimationFrame(animate); // needed for OrbitControls to work
              renderer.render(scene, camera);
            }
            animate();
          },
          undefined,
          (error) => {
            console.error(error);
          }
        );
      },

      scaleModel(model) {
        // create box from model to get size
        const modelBox = new THREE.Box3().setFromObject(model);
        const size = modelBox.getSize(new THREE.Vector3());

        // Rescale the model
        const maxAxis = Math.max(size.x, size.y, size.z);
        model.scale.setScalar(2 / maxAxis);
      }
    }
  };
</script>

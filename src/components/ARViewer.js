import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ARViewer() {

  const videoRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {

    // CAMERA ACCESS
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    }).then(stream => {
      videoRef.current.srcObject = stream;
    });

    // SCENE
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );

    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // LIGHT
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    // LOAD MODEL
    const loader = new GLTFLoader();
    let ring;

    loader.load("/models/ring.glb", (gltf) => {

      ring = gltf.scene;
      ring.scale.set(0.01,0.01,0.01);
      ring.position.set(0,0,-1);

      scene.add(ring);

    });

    // TOUCH CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;

    // ANIMATION LOOP
    function animate(){

      requestAnimationFrame(animate);

      if(ring){
        ring.rotation.y += 0.01; // auto rotation
      }

      controls.update();
      renderer.render(scene,camera);

    }

    animate();

  }, []);

  return (

    <div>

      {/* Camera Feed */}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          objectFit:"cover"
        }}
      />

      {/* 3D Canvas */}

      <canvas
        ref={canvasRef}
        style={{
          position:"absolute",
          top:0
        }}
      />

    </div>

  );
}
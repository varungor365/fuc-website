'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface VirtualClosetProps {
  designs: Array<{ id: string; imageUrl: string; title: string }>;
}

export default function VirtualCloset({ designs }: VirtualClosetProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(800, 600);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Create 3D gallery
    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];

    designs.forEach((design, index) => {
      const texture = textureLoader.load(design.imageUrl);
      const geometry = new THREE.PlaneGeometry(2, 2.5);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);

      const angle = (index / designs.length) * Math.PI * 2;
      const radius = 4;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.lookAt(0, 0, 0);

      mesh.userData = { id: design.id, title: design.title };
      meshes.push(mesh);
      scene.add(mesh);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const selected = intersects[0].object;
        setSelectedDesign(selected.userData.id);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('click', onMouseClick);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [designs]);

  return (
    <div className="relative">
      <div ref={mountRef} className="rounded-xl overflow-hidden" />
      {selectedDesign && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-6 py-3 rounded-lg text-white">
          <p className="text-sm">Selected: {designs.find(d => d.id === selectedDesign)?.title}</p>
        </div>
      )}
    </div>
  );
}

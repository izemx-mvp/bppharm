import { useEffect, useRef, useState } from "react";
import { logoUrl, productImages } from "./assets";

/** Browser-only, progressively enhanced product sculpture. */
export function CosmeticScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};
    async function mount() {
      const THREE = await import("three");
      const { RoomEnvironment } =
        await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed || !host) return;
      const styles = getComputedStyle(host);
      const sample = document.createElement("canvas").getContext("2d");
      const color = (token: string) => {
        if (!sample) return new THREE.Color();
        sample.fillStyle = styles.getPropertyValue(token).trim();
        sample.fillRect(0, 0, 1, 1);
        const [r, g, b] = sample.getImageData(0, 0, 1, 1).data;
        return new THREE.Color(`rgb(${r},${g},${b})`);
      };
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      host.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 60);
      camera.position.set(0, 1.1, 10.8);
      camera.lookAt(0, 0.05, 0);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      room.dispose();
      pmrem.dispose();
      const ambient = new THREE.HemisphereLight(color("--card"), color("--scene-sage"), 1.2);
      scene.add(ambient);
      const key = new THREE.DirectionalLight(color("--card"), 2.5);
      key.position.set(-3, 6, 5);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.radius = 4;
      key.shadow.normalBias = 0.025;
      scene.add(key);
      const rim = new THREE.DirectionalLight(color("--gold-soft"), 3);
      rim.position.set(4, 2, -2);
      scene.add(rim);
      const sculpture = new THREE.Group();
      scene.add(sculpture);
      const ivory = new THREE.MeshPhysicalMaterial({
        color: color("--scene-ivory"),
        roughness: 0.24,
        metalness: 0.06,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
      });
      const gold = new THREE.MeshStandardMaterial({
        color: color("--scene-gold"),
        metalness: 0.87,
        roughness: 0.24,
      });
      const glass = new THREE.MeshPhysicalMaterial({
        color: color("--scene-glass"),
        transmission: 0.72,
        thickness: 0.6,
        roughness: 0.12,
        metalness: 0.02,
        ior: 1.46,
        transparent: true,
        opacity: 0.9,
        clearcoat: 1,
      });
      const pale = new THREE.MeshStandardMaterial({
        color: color("--scene-sage"),
        roughness: 0.58,
      });
      const cylinder = (
        parent: InstanceType<typeof THREE.Group>,
        radius: number,
        height: number,
        y: number,
        material: InstanceType<typeof THREE.Material>,
        top = radius,
      ) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, radius, height, 96), material);
        mesh.position.y = y;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };
      const serum = new THREE.Group();
      serum.position.set(0.65, 0.13, 0.4);
      serum.rotation.z = -0.09;
      sculpture.add(serum);
      cylinder(serum, 0.53, 1.7, -0.25, glass);
      cylinder(serum, 0.48, 0.1, -1.08, glass);
      cylinder(serum, 0.42, 0.22, 0.64, glass, 0.28);
      cylinder(serum, 0.3, 0.17, 0.84, gold);
      cylinder(serum, 0.31, 0.43, 1.14, gold);
      cylinder(serum, 0.25, 0.43, 1.55, ivory, 0.2);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 48, 24), ivory);
      dome.position.y = 1.77;
      serum.add(dome);
      const liquid = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.45, 1.14, 64),
        new THREE.MeshPhysicalMaterial({
          color: color("--scene-serum"),
          transparent: true,
          opacity: 0.28,
          roughness: 0.18,
        }),
      );
      liquid.position.y = -0.5;
      serum.add(liquid);
      const pipette = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.7, 24), ivory);
      pipette.position.y = -0.1;
      serum.add(pipette);

      const sunscreen = new THREE.Group();
      sunscreen.position.set(-0.85, -0.18, -0.1);
      sunscreen.rotation.z = 0.16;
      sunscreen.rotation.y = 0.12;
      sculpture.add(sunscreen);
      const profile = [
        [0, -1.1],
        [0.43, -1.1],
        [0.51, -0.98],
        [0.55, -0.6],
        [0.6, 0.4],
        [0.58, 0.85],
        [0.5, 1],
        [0, 1],
      ].map(([x, y]) => new THREE.Vector2(x, y));
      const tube = new THREE.Mesh(new THREE.LatheGeometry(profile, 96), ivory);
      tube.scale.z = 0.62;
      tube.castShadow = true;
      sunscreen.add(tube);
      const cap = cylinder(sunscreen, 0.43, 0.36, -1.27, ivory);
      cap.scale.z = 0.72;
      const seam = cylinder(sunscreen, 0.44, 0.035, -1.08, gold);
      seam.scale.z = 0.72;

      const labelTextures: InstanceType<typeof THREE.Texture>[] = [];
      const addLabel = (
        parent: InstanceType<typeof THREE.Group>,
        title: string,
        subtitle: string,
        z: number,
        y: number,
        width: number,
        height: number,
      ) => {
        const canvas = document.createElement("canvas");
        canvas.width = 768;
        canvas.height = 1024;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = styles.getPropertyValue("--scene-ivory").trim();
        ctx.fillRect(0, 0, 768, 1024);
        ctx.textAlign = "center";
        ctx.fillStyle = styles.getPropertyValue("--foreground").trim();
        ctx.font = "500 46px Manrope, sans-serif";
        ctx.fillText("PHOTO WHITE", 384, 180);
        ctx.font = "400 20px DM Sans, sans-serif";
        ctx.fillText("EXPERTISE DERMOCOSMÉTIQUE", 384, 225);
        ctx.fillStyle = styles.getPropertyValue("--scene-gold").trim();
        ctx.fillRect(294, 275, 180, 3);
        ctx.fillStyle = styles.getPropertyValue("--primary").trim();
        ctx.font = "600 63px Manrope, sans-serif";
        ctx.fillText(title, 384, 455);
        ctx.font = "400 30px DM Sans, sans-serif";
        ctx.fillText(subtitle, 384, 525);
        ctx.font = "400 22px DM Sans, sans-serif";
        ctx.fillText("PHOTO WHITE · MAROC", 384, 820);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        labelTextures.push(texture);
        const label = new THREE.Mesh(
          new THREE.PlaneGeometry(width, height),
          new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
        );
        label.position.set(0, y, z);
        parent.add(label);
        const logo = new Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          if (disposed) return;
          ctx.fillStyle = styles.getPropertyValue("--scene-ivory").trim();
          ctx.fillRect(80, 60, 608, 190);
          ctx.drawImage(logo, 140, 65, 488, 148);
          texture.needsUpdate = true;
        };
        logo.src = logoUrl;
      };
      addLabel(serum, "ÉCLAT", "Sérum éclaircissant", 0.535, -0.25, 0.74, 1.04);
      addLabel(sunscreen, "SPF 50+", "Protection invisible", 0.36, 0.03, 0.86, 1.22);

      const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(2.25, 2.3, 0.2, 128), pale);
      pedestal.position.set(0, -1.85, 0);
      pedestal.receiveShadow = true;
      scene.add(pedestal);
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.ShadowMaterial({ opacity: 0.12 }),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.96;
      floor.receiveShadow = true;
      scene.add(floor);
      const pointer = { x: 0, y: 0 };
      const onMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.35;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 0.12;
      };
      const onLeave = () => {
        pointer.x = 0;
        pointer.y = 0;
      };
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
      const resize = () => {
        const width = host.clientWidth,
          height = host.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = camera.aspect < 0.85 ? 12.6 : 10.8;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(host);
      resize();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      const clock = new THREE.Clock();
      let visible = true;
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
      });
      visibility.observe(host);
      renderer.setAnimationLoop(() => {
        if (disposed || !visible || document.hidden) return;
        const t = clock.getElapsedTime();
        if (!reduce.matches) {
          sculpture.rotation.y +=
            (Math.sin(t * 0.22) * 0.12 + pointer.x - sculpture.rotation.y) * 0.035;
          sculpture.rotation.x += (-pointer.y - sculpture.rotation.x) * 0.035;
          serum.position.y = 0.13 + Math.sin(t * 0.72) * 0.1;
          sunscreen.position.y = -0.18 + Math.sin(t * 0.72 + 1.8) * 0.08;
        }
        renderer.render(scene, camera);
      });
      setReady(true);
      cleanup = () => {
        renderer.setAnimationLoop(null);
        observer.disconnect();
        visibility.disconnect();
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        labelTextures.forEach((texture) => texture.dispose());
        environment.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    mount().catch(() => {
      /* Keep official product photography when WebGL is unavailable. */
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return (
    <div
      className={`cosmetic-stage ${ready ? "scene-ready" : ""}`}
      role="img"
      aria-label="Photo White : protection solaire et sérum, produits en trois dimensions animés"
    >
      <div className="cosmetic-fallback" aria-hidden="true">
        <img src={productImages[0]} alt="" />
        <img src={productImages[4]} alt="" />
      </div>
      <div className="cosmetic-canvas" ref={hostRef} aria-hidden="true" />
      <span className="scene-caption">PHOTO WHITE / COLLECTION ÉCLAT</span>
    </div>
  );
}

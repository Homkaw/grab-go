import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js';

  const host = document.getElementById('gameCanvas');
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(7, 6.3, 12.7);
  camera.lookAt(0, 2.45, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  host.appendChild(renderer.domElement);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x8b63aa, 2.7);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 3.1);
  mainLight.position.set(3, 8, 7);
  scene.add(mainLight);

  const pinkLight = new THREE.PointLight(0xff7fc1, 26, 10);
  pinkLight.position.set(-2, 4, 3);
  scene.add(pinkLight);

  const fillLight = new THREE.PointLight(0xaaa3ff, 18, 8);
  fillLight.position.set(2, 3, -1);
  scene.add(fillLight);

  const mat = (color, roughness = 0.42, metalness = 0) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });

  const shell = mat('#ff98c9');
  const dark = mat('#624274');
  const white = mat('#fffaff');
  const metal = mat('#cdd9e7', 0.2, 0.72);
  const glow = new THREE.MeshBasicMaterial({ color: '#ffc6ef' });

  const cube = (w, h, d, m, x, y, z, parent = scene) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z);
    parent.add(o);
    return o;
  };

  const ball = (r, m, x, y, z, group, sx = 1, sy = 1, sz = 1) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 16), m);
    o.position.set(x, y, z);
    o.scale.set(sx, sy, sz);
    group.add(o);
    return o;
  };

  const rod = (a, b, r, m, parent = scene) => {
    const v1 = new THREE.Vector3(...a);
    const v2 = new THREE.Vector3(...b);
    const diff = v2.clone().sub(v1);

    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, diff.length(), 10),
      m
    );

    mesh.position.copy(v1).add(v2).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      diff.normalize()
    );

    parent.add(mesh);
    return mesh;
  };

  // Корпус автомата
  cube(4.25, 1.25, 3.25, shell, 0, 0.62, 0);
  cube(3.7, 0.83, 0.06, white, 0, 0.72, 1.66);
  cube(0.86, 0.52, 0.08, dark, -1.1, 0.56, 1.72);
  cube(0.58, 0.1, 0.12, metal, 0.93, 0.71, 1.74);
  ball(0.10, glow, 1.08, 0.91, 1.72, scene);

  cube(3.72, 0.16, 2.73, white, 0, 1.29, 0);

  cube(4.22, 0.25, 3.23, shell, 0, 4.65, 0);
  cube(4.15, 0.57, 3.28, dark, 0, 5.05, 0);
  cube(3.9, 0.41, 0.12, shell, 0, 5.05, 1.68);
  cube(3.6, 0.09, 0.15, glow, 0, 4.79, 1.78);

  for (const x of [-2.02, 2.02]) {
    for (const z of [-1.52, 1.52]) {
      cube(0.13, 3.24, 0.13, shell, x, 2.96, z);
      cube(0.045, 3.05, 0.05, glow, x * 0.985, 2.96, z + 0.01);
    }
  }

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.10,
    roughness: 0.04,
    metalness: 0,
    depthWrite: false,
    side: THREE.DoubleSide
  });

  cube(3.96, 3.03, 0.03, glass, 0, 2.94, 1.56);
  cube(0.03, 3.03, 3.01, glass, 1.96, 2.94, 0);
  cube(0.03, 3.03, 3.01, glass, -1.96, 2.94, 0);
  cube(3.96, 3.03, 0.03, glass, 0, 2.94, -1.51);

  // Игрушки
  const plushes = [];

  function plush(x, z, color, kind = 'bear', size = 0.86) {
    const g = new THREE.Group();
    g.position.set(x, 1.53, z);
    g.scale.setScalar(size);
    scene.add(g);

    const fur = mat(color, 0.94);
    const inner = mat('#ffe7ed', 0.95);
    const eyes = mat('#30213a', 0.38);
    const blush = mat('#f7a2b7', 1);

    ball(0.44, fur, 0, 0.02, 0, g, 1, 1.1, 0.82);
    ball(0.41, fur, 0, 0.55, 0.03, g);

    ball(0.19, fur, -0.44, 0.08, 0.07, g);
    ball(0.19, fur, 0.44, 0.08, 0.07, g);

    ball(0.19, fur, -0.24, -0.33, 0.18, g, 1.1, 0.7, 1);
    ball(0.19, fur, 0.24, -0.33, 0.18, g, 1.1, 0.7, 1);

    if (kind === 'bunny') {
      ball(0.16, fur, -0.22, 1.02, 0, g, 0.72, 2, 0.65);
      ball(0.16, fur, 0.22, 1.02, 0, g, 0.72, 2, 0.65);
      ball(0.11, inner, -0.22, 1.02, 0.08, g, 0.5, 2, 0.3);
      ball(0.11, inner, 0.22, 1.02, 0.08, g, 0.5, 2, 0.3);
    } else {
      ball(0.20, fur, -0.32, 0.84, -0.02, g);
      ball(0.20, fur, 0.32, 0.84, -0.02, g);
      ball(0.11, inner, -0.33, 0.85, 0.12, g);
      ball(0.11, inner, 0.33, 0.85, 0.12, g);
    }

    ball(0.063, eyes, -0.16, 0.60, 0.39, g);
    ball(0.063, eyes, 0.16, 0.60, 0.39, g);
    ball(0.075, inner, 0, 0.40, 0.41, g, 1.7, 0.9, 0.7);
    ball(0.045, eyes, 0, 0.43, 0.475, g);

    ball(0.075, blush, -0.30, 0.42, 0.35, g, 1.3, 0.7, 0.4);
    ball(0.075, blush, 0.30, 0.42, 0.35, g, 1.3, 0.7, 0.4);

    plushes.push({
      group: g,
      taken: false,
      baseX: x,
      baseY: 1.53,
      baseZ: z,
      size,
      bobOffset: Math.random() * Math.PI * 2,
      bobSpeed: 0.9 + Math.random() * 0.8,
      bobAmount: 0.03 + Math.random() * 0.03,
      tiltAmount: 0.05 + Math.random() * 0.04
    });
  }

  plush(-1.25, -0.63, '#cbb3ff', 'bear', 0.80);
  plush(-0.40, -0.70, '#a4dbff', 'bear', 0.85);
  plush(0.49, -0.68, '#ffe38c', 'bunny', 0.77);
  plush(1.32, -0.45, '#b7f8d5', 'bear', 0.83);
  plush(-1.2, 0.48, '#f8e3c6', 'bear', 0.83);
  plush(-0.38, 0.51, '#ffb6d4', 'bunny', 0.79);
  plush(0.54, 0.50, '#ddd0ff', 'bear', 0.88);
  plush(1.31, 0.51, '#ffc59d', 'bear', 0.78);

  // Клешня
  const claw = new THREE.Group();
  scene.add(claw);
  claw.position.set(0, 3.94, 0.45);

  cube(0.5, 0.16, 0.5, metal, 0, 0.04, 0, claw);
  ball(0.18, metal, 0, -0.18, 0, claw);

  const fingers = [];
  for (let i = 0; i < 3; i++) {
    const root = new THREE.Group();
    root.position.set(0, -0.19, 0);
    root.rotation.y = i * 2 * Math.PI / 3;
    claw.add(root);

    rod([0.03, 0, 0], [0.42, -0.54, 0], 0.052, metal, root);
    rod([0.42, -0.54, 0], [0.31, -0.69, 0], 0.048, metal, root);
    ball(0.075, metal, 0.42, -0.54, 0, root);

    fingers.push(root);
  }

  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 1, 12),
    metal
  );
  scene.add(cable);

  const MAX_Y = 3.94;
  const MIN_Y = 2.55;
  const TOP = 4.52;

  const SUCCESS_CHANCE = 0.72;    // шанс вообще зацепить
  const DROP_CHANCE = 0.38;       // шанс уронить по пути, если уже зацепили

  const target = { x: 0, z: 0.45 };

  let phase = 'idle';
  let phaseStart = 0;
  let selected = null;
  let phaseX = 0;
  let phaseZ = 0;
  let prizeY = 0;
  let wins = 0;
  let attempts = 0;

  let hasCatch = false;
  let shouldDrop = false;
  let dropProgressPoint = 0.58;
  let isDroppingNow = false;
  let dropStartX = 0;
  let dropStartY = 0;
  let dropStartZ = 0;
  let dropTargetY = 1.56;
  let finalMissMessage = 'Ой, мимо! Попробуй ещё 💜';

  const btn = document.getElementById('grabBtn');
  const status = document.getElementById('gameStatus');

  const setStatus = (msg) => {
    status.textContent = msg;
  };

  const ease = (t) => t * t * (3 - 2 * t);
  const mix = (a, b, t) => a + (b - a) * t;

  const setPhase = (name, now) => {
    phase = name;
    phaseStart = now;
  };

  function move(dx, dz) {
    if (phase !== 'idle') return;

    target.x = THREE.MathUtils.clamp(target.x + dx, -1.35, 1.35);
    target.z = THREE.MathUtils.clamp(target.z + dz, -0.68, 0.73);
  }

  document.querySelectorAll('[data-move]').forEach((b) => {
    b.addEventListener('click', () => {
      const d = b.dataset.move;
      if (d === 'left') move(-0.32, 0);
      if (d === 'right') move(0.32, 0);
      if (d === 'up') move(0, -0.30);
      if (d === 'down') move(0, 0.30);

      document.getElementById('scene').focus({ preventScroll: true });
    });
  });

  document.getElementById('scene').addEventListener('keydown', (e) => {
    const moves = {
      ArrowLeft: [-0.32, 0],
      ArrowRight: [0.32, 0],
      ArrowUp: [0, -0.30],
      ArrowDown: [0, 0.30]
    };

    if (moves[e.key]) {
      e.preventDefault();
      move(...moves[e.key]);
    }

    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target === document.getElementById('scene')) {
        e.preventDefault();
        start();
      }
    }
  });

  function start() {
    if (phase !== 'idle') return;

    attempts++;
    hasCatch = false;
    shouldDrop = false;
    isDroppingNow = false;
    finalMissMessage = 'Ой, мимо! Попробуй ещё 💜';

    const x = claw.position.x;
    const z = claw.position.z;

    let best = Infinity;
    selected = null;

    for (const item of plushes) {
      if (item.taken) continue;

      const d = Math.hypot(
        item.group.position.x - x,
        item.group.position.z - z
      );

      if (d < best) {
        best = d;
        selected = item;
      }
    }

    if (best > 0.69) {
      selected = null;
      hasCatch = false;
      finalMissMessage = 'Клешня опустилась не совсем точно 😅';
    } else if (selected) {
      hasCatch = Math.random() < SUCCESS_CHANCE;

      if (hasCatch) {
        shouldDrop = Math.random() < DROP_CHANCE;
        dropProgressPoint = 0.38 + Math.random() * 0.34;
      } else {
        finalMissMessage = 'Почти! Игрушка выскользнула из клешни 🥺';
      }
    }

    phaseX = x;
    phaseZ = z;
    btn.disabled = true;
    setStatus('Клешня опускается…');
    setPhase('drop', performance.now());
  }

  btn.addEventListener('click', start);

  function resize() {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;

    camera.position.set(
      w < 520 ? 8 : 7,
      w < 520 ? 6.4 : 6.3,
      w < 520 ? 15.4 : 12.7
    );
    camera.lookAt(0, 2.65, 0);
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize);
  resize();

  function animateIdlePlushes(nowSeconds) {
    for (const item of plushes) {
      if (item.taken) continue;
      if (selected === item && (phase === 'lift' || phase === 'travel' || phase === 'release' || phase === 'failDrop')) continue;

      const bob = Math.sin(nowSeconds * item.bobSpeed + item.bobOffset) * item.bobAmount;
      const tilt = Math.sin(nowSeconds * (item.bobSpeed * 0.7) + item.bobOffset) * item.tiltAmount;

      item.group.position.y = item.baseY + bob;
      item.group.rotation.z = tilt;
      item.group.rotation.x = Math.sin(nowSeconds * 0.8 + item.bobOffset) * 0.03;
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);

    const t = (now - phaseStart) / 1000;
    const time = now / 1000;

    animateIdlePlushes(time);

    if (phase === 'idle') {
      claw.position.x = mix(claw.position.x, target.x, 0.12);
      claw.position.z = mix(claw.position.z, target.z, 0.12);
    }

    else if (phase === 'drop') {
      claw.position.y = mix(MAX_Y, MIN_Y, ease(Math.min(t / 0.95, 1)));

      if (t >= 0.95) {
        setPhase('close', now);
        setStatus('Захватываем игрушку…');
      }
    }

    else if (phase === 'close') {
      fingers.forEach((f) => {
        f.rotation.z = mix(0.33, -0.18, ease(Math.min(t / 0.45, 1)));
      });

      if (t >= 0.45) {
        if (selected && hasCatch) {
          setStatus(shouldDrop ? 'Схватили... только бы не уронить 👀' : 'Есть захват! Поднимаем 🧸');
        } else {
          setStatus(finalMissMessage);
        }

        setPhase('lift', now);
      }
    }

    else if (phase === 'lift') {
      claw.position.y = mix(MIN_Y, MAX_Y, ease(Math.min(t / 1.25, 1)));

      if (selected && hasCatch) {
        selected.group.position.set(
          claw.position.x,
          claw.position.y - 1.02,
          claw.position.z + 0.1
        );
        selected.group.rotation.z = 0;
        selected.group.rotation.x = 0;
      }

      if (t >= 1.25) {
        setPhase('travel', now);
      }
    }

    else if (phase === 'travel') {
      const p = ease(Math.min(t / 1.0, 1));

      claw.position.x = mix(phaseX, -1.15, p);
      claw.position.z = mix(phaseZ, 0.75, p);

      if (selected && hasCatch && !isDroppingNow) {
        selected.group.position.set(
          claw.position.x,
          claw.position.y - 1.02,
          claw.position.z + 0.1
        );
      }

      if (selected && hasCatch && shouldDrop && !isDroppingNow && p >= dropProgressPoint) {
        isDroppingNow = true;

        dropStartX = selected.group.position.x;
        dropStartY = selected.group.position.y;
        dropStartZ = selected.group.position.z;

        dropTargetY = 1.53 + Math.random() * 0.08;
        setStatus('Ой! Игрушка сорвалась 😭');
        setPhase('failDrop', now);
      } else if (t >= 1.0) {
        prizeY = selected?.group.position.y ?? 0;
        setPhase('release', now);
      }
    }

    else if (phase === 'failDrop') {
      const p = ease(Math.min(t / 0.5, 1));

      fingers.forEach((f) => {
        f.rotation.z = mix(-0.18, 0.24, p);
      });

      if (selected) {
        selected.group.position.x = mix(dropStartX, dropStartX + (Math.random() - 0.5) * 0.18, p);
        selected.group.position.y = mix(dropStartY, dropTargetY, p);
        selected.group.position.z = mix(dropStartZ, dropStartZ + (Math.random() - 0.5) * 0.18, p);
        selected.group.rotation.z = mix(0, (Math.random() - 0.5) * 0.9, p);
        selected.group.rotation.x = mix(0, (Math.random() - 0.5) * 0.6, p);
      }

      if (t >= 0.5) {
        if (selected) {
          selected.group.position.y = dropTargetY;
          selected.baseX = selected.group.position.x;
          selected.baseY = selected.group.position.y;
          selected.baseZ = selected.group.position.z;
        }

        setPhase('return', now);
      }
    }

    else if (phase === 'release') {
      const p = ease(Math.min(t / 0.65, 1));

      fingers.forEach((f) => {
        f.rotation.z = mix(-0.18, 0.33, p);
      });

      if (selected && hasCatch) {
        selected.group.position.y = mix(prizeY, 0.05, p);
        selected.group.scale.setScalar((1 - p) * selected.size);
      }

      if (t >= 0.65) {
        if (selected && hasCatch) {
          selected.group.visible = false;
          selected.taken = true;
          wins++;
          setStatus(`Ура! Поймано игрушек: ${wins} из ${attempts} попыток 🧸`);
        }

        setPhase('return', now);
      }
    }

    else if (phase === 'return') {
      const p = ease(Math.min(t / 0.95, 1));

      claw.position.x = mix(-1.15, 0, p);
      claw.position.z = mix(0.75, 0.45, p);

      if (t >= 0.95) {
        target.x = 0;
        target.z = 0.45;
        selected = null;
        hasCatch = false;
        shouldDrop = false;
        isDroppingNow = false;
        btn.disabled = false;
        setPhase('idle', now);
      }
    }

    cable.position.set(
      claw.position.x,
      (TOP + claw.position.y) / 2,
      claw.position.z
    );
    cable.scale.y = Math.max(0.05, TOP - claw.position.y);

    renderer.render(scene, camera);
  }

  fingers.forEach((f) => {
    f.rotation.z = 0.33;
  });

  requestAnimationFrame(frame);
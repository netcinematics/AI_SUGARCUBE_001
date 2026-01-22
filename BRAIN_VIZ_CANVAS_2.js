// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import * as THREE from './lib_threejs/three.module.js';
import { OrbitControls } from './lib_threejs/OrbitControls.js';

export function initBrainViz() {
    console.log("initBrainViz started");
    const container = document.getElementById('CANVAS_BRAIN_VIZ_1');
    if (!container) {
        console.error("CANVAS_BRAIN_VIZ_1 not found!");
        return;
    }

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true }); // alpha: true for transparent background if needed

    renderer.setSize(container.clientWidth, container.clientHeight);
    // Clear any existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
    const axesHelper = new THREE.AxesHelper(12);
    scene.add(axesHelper);


    // --- Helper Functions ---
    // function addDiagonalLines() {
    //     const cubeSize = 2;
    //     const halfSize = cubeSize / 2;
    //     const lineLength = 9;
    //     const corners = [
    //         { start: [-halfSize, -halfSize, halfSize], dir: [-1, -1, 1] },
    //         { start: [halfSize, -halfSize, halfSize], dir: [1, -1, 1] },
    //         { start: [-halfSize, halfSize, halfSize], dir: [-1, 1, 1] },
    //         { start: [halfSize, halfSize, halfSize], dir: [1, 1, 1] },
    //         { start: [-halfSize, -halfSize, -halfSize], dir: [-1, -1, -1] },
    //         { start: [halfSize, -halfSize, -halfSize], dir: [1, -1, -1] },
    //         { start: [-halfSize, halfSize, -halfSize], dir: [-1, 1, -1] },
    //         { start: [halfSize, halfSize, -halfSize], dir: [1, 1, -1] }
    //     ];

    //     corners.forEach(corner => {
    //         const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00FFFF });
    //         const points = [];
    //         points.push(new THREE.Vector3(...corner.start));
    //         points.push(new THREE.Vector3(
    //             corner.start[0] + corner.dir[0] * lineLength,
    //             corner.start[1] + corner.dir[1] * lineLength,
    //             corner.start[2] + corner.dir[2] * lineLength
    //         ));
    //         const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
    //         const line = new THREE.Line(lineGeometry, lineMaterial);
    //         scene.add(line);
    //     });
    // }
    // addDiagonalLines();

    function add_Sphere_Anchors() {
        const points_NUM_1 = 10;//20;
        const points = [
            { x: points_NUM_1, y: points_NUM_1, z: points_NUM_1 }, { x: -points_NUM_1, y: points_NUM_1, z: points_NUM_1 }, { x: -points_NUM_1, y: -points_NUM_1, z: points_NUM_1 }, { x: -points_NUM_1, y: -points_NUM_1, z: -points_NUM_1 },
            { x: points_NUM_1, y: points_NUM_1, z: -points_NUM_1 }, { x: points_NUM_1, y: -points_NUM_1, z: -points_NUM_1 }, { x: -points_NUM_1, y: points_NUM_1, z: -points_NUM_1 }, { x: points_NUM_1, y: -points_NUM_1, z: points_NUM_1 }
        ];
        let sphereGeometry = new THREE.SphereGeometry(1.222, 32, 32);
        let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x39FF8D, transparent: true, opacity: 0.8 });
        let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, 0, 0);
        scene.add(sphere);
        sphereGeometry = new THREE.SphereGeometry(0.666, 32, 32);
        for (let i = 0; i < points.length; i++) {
            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(points[i].x, points[i].y, points[i].z);
            scene.add(sphere);
        }
    }

    function add_Sugar_ORBZ_1(aMIN, aMAX) {
        //---- ****** ORBZ ****** ----
        // Set this for the dimensions of the sugarcube.
        // let aMIN = -10; let aMAX = 10;
        const sphereGeometry = new THREE.SphereGeometry(0.111, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.222 });

        for (let x = aMIN; x < aMAX; x++) {
            for (let y = aMIN; y < aMAX; y++) {
                for (let z = aMIN; z < aMAX; z++) {
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    sphere.position.set(x, y, z);
                    scene.add(sphere);
                }
            }
        }
    }

    // function add_Sugar_ORBZ_2(XDIM, YDIM, ZDIM) {
    function add_SUB_CUBE_3(sub_cube) {
        //---- ****** ORBZ ****** ----
        // Set this for the dimensions of the sugarcube.
        const sphereGeometry = new THREE.SphereGeometry(0.111, 32, 32);
        // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.222 });
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: sub_cube.color, transparent: true, opacity: 0.222 });

        // let XDIM = 4, YDIM = 4, ZDIM = 4;
        //CONTAINS SUB-CUBE OFFSET inside the iterater definition to give block_spike offset.
        for (let x = sub_cube.XDIM > 0 ? 1 : -1; x !== sub_cube.XDIM; sub_cube.XDIM > 0 ? x++ : x--) {
            for (let y = sub_cube.XDIM > 0 ? 1 : -1; y !== sub_cube.YDIM; sub_cube.YDIM > 0 ? y++ : y--) {
                for (let z = sub_cube.XDIM > 0 ? 1 : -1; z !== sub_cube.ZDIM; sub_cube.ZDIM > 0 ? z++ : z--) {
                    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                    sphere.position.set(x, y, z);
                    scene.add(sphere);
                }
            }
        }
    }

    // function add_ORBZ_1() {
    // add_Sugar_ORBZ_1(-3, 3);  //MIN and MAX values for the ORBZ.
    // add_Sugar_ORBZ_2(4, 4, 4);  //MIN and MAX values for the ORBZ.
    // }|
    function add_SUB_CUBES_1() {
        // add_Sugar_ORBZ_1(-3, 3);  //MIN and MAX values for the ORBZ.
        // add_Sugar_ORBZ_2(4, 4, 4);  //MIN and MAX values for the ORBZ.
        add_SUB_CUBE_3({ XDIM: 4, YDIM: 4, ZDIM: 4, color: 0x00FFFF });  //MIN and MAX values for the ORBZ.
        add_SUB_CUBE_3({ XDIM: -4, YDIM: -4, ZDIM: -4, color: 0x00FFFF });  //MIN and MAX values for the ORBZ.
        add_SUB_CUBE_3({ XDIM: 4, YDIM: 4, ZDIM: -4, color: 0x00FFFF });  //MIN and MAX values for the ORBZ.
        add_SUB_CUBE_3({ XDIM: 4, YDIM: -4, ZDIM: -4, color: 0x00FFFF });  //MIN and MAX values for the ORBZ.

        add_SUB_CUBE_3({ XDIM: 4, YDIM: -4, ZDIM: 4, color: 0x00FFFF });
        add_SUB_CUBE_3({ XDIM: -4, YDIM: 4, ZDIM: 4, color: 0x00FFFF });
        add_SUB_CUBE_3({ XDIM: -4, YDIM: 4, ZDIM: -4, color: 0x00FFFF });
        add_SUB_CUBE_3({ XDIM: -4, YDIM: -4, ZDIM: 4, color: 0x00FFFF });
        // add_SUB_CUBE_3({ XDIM: -4, YDIM: -4, ZDIM: -4, color: 0x00FFFF });  //MIN and MAX values for the ORBZ.
        // add_Sugar_ORBZ_1(-10, 10);  //MIN and MAX values for the ORBZ.
        // add_Sphere_Anchors();
    }
    add_SUB_CUBES_1();

    function add_Tesseract_1() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0x4682B4, transparent: true, opacity: 0.9 });
        const box = new THREE.Mesh(geometry, material);
        scene.add(box);
        const materialLine = new THREE.LineBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.1 });

        const points_NUM_2 = 20;//10;
        const points = [
            { x: points_NUM_2, y: points_NUM_2, z: points_NUM_2 }, { x: -points_NUM_2, y: points_NUM_2, z: points_NUM_2 }, { x: -points_NUM_2, y: -points_NUM_2, z: points_NUM_2 }, { x: -points_NUM_2, y: -points_NUM_2, z: -points_NUM_2 },
            { x: points_NUM_2, y: points_NUM_2, z: -points_NUM_2 }, { x: points_NUM_2, y: -points_NUM_2, z: -points_NUM_2 }, { x: -points_NUM_2, y: points_NUM_2, z: -points_NUM_2 }, { x: points_NUM_2, y: -points_NUM_2, z: points_NUM_2 }
        ];

        for (let i = 0; i < points.length; i++) {
            for (let j = 0; j < points.length; j++) {
                if (points[i] === points[j]) continue;
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(points[i].x, points[i].y, points[i].z),
                    new THREE.Vector3(points[j].x, points[j].y, points[j].z)
                ]);
                const line = new THREE.Line(geometry, materialLine);
                scene.add(line);
            }
        }

        const points100 = [
            { x: 100, y: 100, z: 100 }, { x: -100, y: 100, z: 100 }, { x: -100, y: -100, z: 100 }, { x: -100, y: -100, z: -100 },
            { x: 100, y: 100, z: -100 }, { x: 100, y: -100, z: -100 }, { x: -100, y: 100, z: -100 }, { x: 100, y: -100, z: 100 }
        ];

        for (let i = 0; i < points100.length; i++) {
            for (let j = 0; j < points100.length; j++) {
                if (points100[i] === points100[j]) continue;
                const geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(points100[i].x, points100[i].y, points100[i].z),
                    new THREE.Vector3(points100[j].x, points100[j].y, points100[j].z)
                ]);
                const line = new THREE.Line(geometry, materialLine);
                scene.add(line);
            }
        }
    }
    // add_Tesseract_1();

    function add_Anchor_Boxes() {
        const xcubeSize = 1;
        const xsquareGeometry = new THREE.BoxGeometry(xcubeSize, xcubeSize, xcubeSize);
        const xsquareMaterial = new THREE.MeshBasicMaterial({ color: 0x4682B4, transparent: true, opacity: 0.8 });

        const xPoints = [
            { x: 10, y: 10, z: 10 }, { x: -10, y: 10, z: 10 }, { x: 10, y: -10, z: 10 }, { x: 10, y: 10, z: -10 },
            { x: -10, y: -10, z: 10 }, { x: 10, y: -10, z: -10 }, { x: -10, y: 10, z: -10 }, { x: -10, y: -10, z: -10 }
        ];

        xPoints.forEach(spot => {
            const xSquare = new THREE.Mesh(xsquareGeometry, xsquareMaterial);
            xSquare.position.set(spot.x, spot.y, spot.z);
            scene.add(xSquare);
        });
    }
    // add_Anchor_Boxes();

    const points = [
        { x: 0, y: 10, z: 0, txt: 'up', color: 0xFFFF00 },
        { x: 0, y: -10, z: 0, txt: 'down', color: 0xFFA500 },
        { x: 0, y: 0, z: 10, txt: 'north', color: 0x0000FF },
        { x: 10, y: 0, z: 0, txt: 'east', color: 0x800080 },
        { x: 0, y: 0, z: -10, txt: 'south', color: 0xFF0000 },
        { x: -10, y: 0, z: 0, txt: 'west', color: 0x00FF00 }
    ];

    function createIntermediateSpheres(start, end, color, count = 6) {
        for (let i = 1; i < count + 1; i++) {
            const t = i / (count + 1);
            const x = start.x + (end.x - start.x) * t;
            const y = start.y + (end.y - start.y) * t;
            const z = start.z + (end.z - start.z) * t;

            const baseRadius = 0.333;
            const maxRadiusMultiplier = 2.5;
            const radius = baseRadius * (maxRadiusMultiplier - (t * (maxRadiusMultiplier - 1)));

            const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.6 });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(x, y, z);
            scene.add(sphere);
        }
    }

    function add_Dimension_Spikes() {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
        const spheres = new Map();
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        points.forEach(point => {
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: point.color });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(point.x, point.y, point.z);
            scene.add(sphere);
            spheres.set(sphere.id, point);

            createIntermediateSpheres(
                { x: 0, y: 0, z: 0 },
                { x: point.x, y: point.y, z: point.z },
                point.color
            );

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 256;
            context.font = '44px Impact';
            context.fillStyle = 'aqua';
            context.textAlign = 'center';
            context.fillText(point.txt, 128, 128);

            const texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;

            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.position.set(point.x, point.y + 1, point.z);
            sprite.scale.set(4, 2, 1);
            scene.add(sprite);
        });
    }
    add_Dimension_Spikes();

    // **** --- INITIALIZE SUGARCUBE VIZUALIZATION ---- **** //
    camera.position.set(15, 15, -15);
    camera.lookAt(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // *******--- Interaction --- ***************************//
    // Note: Interaction (click) needs to listen on the rendered canvas
    function onClick(event) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const clickedSphere = intersects[0].object;
            const pointData = spheres.get(clickedSphere.id);
            if (pointData) {
                console.log(`Clicked point: ${pointData.txt} (position: x=${pointData.x}, y=${pointData.y}, z=${pointData.z})`);
                // Optionally update a UI element if available
                const infoPanel = document.getElementById('info-panel');
                if (infoPanel) {
                    infoPanel.textContent = `Clicked point: ${pointData.txt} (position: x=${pointData.x}, y=${pointData.y}, z=${pointData.z})`;
                }
            }
        }
    }
    renderer.domElement.addEventListener('click', onClick, false);

    function onWindowResize() {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize, false);
}
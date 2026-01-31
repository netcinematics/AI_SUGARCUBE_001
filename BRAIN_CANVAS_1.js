// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.module.js';
// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.132.2/examples/jsm/controls/OrbitControls.js';
import * as THREE from './lib_threejs/three.module.js';
import { OrbitControls } from './lib_threejs/OrbitControls.js';

export function initBrainViz() {
    console.log("initBrainViz started");
    window.activeStrata = { CORE: false, MID: false, AERO: false }; // Track Strata State
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
    // add_default_Plane();

    //--------**** WORD_SETZ  **** ----------------------
    let ORBZ_3_XLLM_32 = [
        "AMETASTATEA", "aVIEWZa", "AXI", "aXTRaTELLEXa", "aMAXaCLARIa",
        "aVASTaVISTa", "aMETASPAZEa", "aEDIFIZa", "aFABRIXa", "aSYNERGENZa",
        "aENaFLUENTZa", "aVIGORa", "aENERGENZa", "aREGENERa", "aCONFLEXa",
        "aCONFLUENTZa", "aCOMPLEXagon", "aWAYZaOUTZa", "NEED_NOT_BE", "aTRANZaSENDZa",
        "aEMERGENTZa", "aSPARKZa", "aREMEDYaMALADYa", "aMENTZaMATRIXa", "aEXAMINZaEXISTZa",
        "aLUMENZa", "aLUMENTZa", "aSEEKYa", "aENa", "aDISa", "aVOIDZa",
    ];

    let ORBZ_2_LLM_40 = [
        "aPRYZMa", "aREFRACTZa", "aREFLECTZa", "aSPECTRAZa", "aLOGIXa",
        "aSTRATZa", "aSOCIOa", "aFLOWZa", "aSYMBIOZa", "aSYNTHESIZMa",
        "aNAMEROLOGY", "aCLARIa", "aPERPLEXYa", "aPERPETUaCONFUZa", "aENDLESSaDISPUTEZa",
        "aMALADYa", "aREMEDYa", "aMORPHZa", "aGOGZa", "aZEPTZa",
        "aDYNAMIXa", "aSTATIXa", "aTOTALIZMa", "aFALZa", "aPROJECTZa",
        "aMIMIXa", "aTOXICa", "aFORZa", "aDOUBLa", "aBURDENZa",
        "aDISTURBANZa", "aNAMERATZa", "aVARZa", "aLUMENTZa", "aCONTEXTa",
        "aMETASTATEa", "aECHOZa", "aPARADOXa", "aPRISTINEa", "aMECHANIZMa"
    ];

    let ORBZ_0_SLM_64 = [
        "aWORDZa", "aACTZa", "aVIEWZa", "aCONCEPTZa", "aCHOOZa",
        "aFACTZa", "aENa", "aDISa", "aSPARKa", "aSPARKZa",
        "aCOGZa", "aSYMBOLIXa", "aTHORNZa", "aLUMENZa", "aMINDzEYEa",
        "aQOMa", "aTELLECTa", "aMENTZa", "aXTRa", "aFOCOa",
        "aSEEKa", "aQUERIOa", "aCURIOa", "ACTUeality", "aSYMBIOZa",
        "aSYNTHESIZMa", "aSEEKaBeyondza", "aREFLECTZeality", "aENeality", "aXTRaTELLECTa",
        "aHUMANZa", "aFOGZa", "aPRYZMa", "ALPHA", "BITZ",
        "MINDz", "EYEa", "GEARZa", "GOGZa", "LOOPZa",
        "FLOWZa", "PATHZa", "DAWNZa", "DUSKZa", "SAND",
        "DIRT", "ROCK", "CLOUD", "BLOXYa", "KNOTZa",
        "TWIZTa", "BRAMBLE", "CLIFZa", "LAVA", "HEAT",
        "FIRE", "SMOKE", "NOIZE", "SHOUTZ", "aDARKa",
        "AAA", "BBB", "CCC", "DDD"
    ];

    let all_ORBZ = [...ORBZ_3_XLLM_32, ...ORBZ_2_LLM_40, ...ORBZ_0_SLM_64];
    let orbIndex = 0;

    // --- Interaction State ---
    const spheres = new Map();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredSphereId = null;
    const selectedOrbs = new Map(); // Stores id -> { sprite: THREE.Sprite }
    let glowTextureVal = null;

    function getGlowTexture() {
        if (glowTextureVal) return glowTextureVal;
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(150, 222, 209, 0.5)'); // Bird Egg Blue-ish
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
        glowTextureVal = new THREE.Texture(canvas);
        glowTextureVal.needsUpdate = true;
        return glowTextureVal;
    }

    // --- Tooltip Setup ---
    let tooltip = document.getElementById('viz-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'viz-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.pointerEvents = 'auto'; // Allow mouse events
        tooltip.style.display = 'none';
        tooltip.style.zIndex = '1000';
        tooltip.style.fontFamily = 'monospace';
        tooltip.style.fontSize = '14px';
        tooltip.style.border = '1px solid #00FFFF';

        tooltip.addEventListener('click', function () {
            this.style.display = 'none';
            hoveredSphereId = null;
        });

        document.body.appendChild(tooltip); // Append to body to ensure it's on top
    }

    //-----------------------------

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

                    // Assign word and register
                    const word = all_ORBZ[orbIndex % all_ORBZ.length];
                    orbIndex++;
                    sphere.userData = { word: word };
                    spheres.set(sphere.id, { txt: word, x, y, z });

                    scene.add(sphere);
                }
            }
        }
    }

    /**
     * aMENTZaMATRIXa: SugarCube 512 Population Algorithm
     * Logic: Core (AXI) -> Mid (Logic) -> Shell (HUI)
     */
    function getSeedFromIndex(strata, index) {
        if (strata === "CORE") return ORBZ_3_XLLM_32[index % ORBZ_3_XLLM_32.length];
        if (strata === "MID") return ORBZ_2_LLM_40[index % ORBZ_2_LLM_40.length];
        return ORBZ_0_SLM_64[index % ORBZ_0_SLM_64.length];
    }

    function generateSugarCube512() {
        const size = 8; // 8x8x8 = 512 ORBZ
        const center = (size - 1) / 2; // 3.5
        const orbs = [];

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    // Calculate distance from center to determine Strata
                    const dist = Math.sqrt(
                        Math.pow(x - center, 2) +
                        Math.pow(y - center, 2) +
                        Math.pow(z - center, 2)
                    );

                    let strata, word;

                    // 1. CORE_ORBZ (The Mission Core) - Radius < 1.8
                    if (dist < 1.8) {
                        strata = "CORE";
                        word = getSeedFromIndex("CORE", orbs.length);
                    }
                    // 2. MID_ORBZ (The Logic/Refraction Mantle) - 1.8 <= Radius < 3.8
                    else if (dist < 3.8) {
                        strata = "MID";
                        word = getSeedFromIndex("MID", orbs.length);
                    }
                    // 3. AERO_ORBZ (The HUI/Vocabulary Shell) - Radius >= 3.8
                    else {
                        strata = "AERO";
                        word = getSeedFromIndex("AERO", orbs.length);
                    }

                    orbs.push({
                        pos: { x: (x - center) * 2, y: (y - center) * 2, z: (z - center) * 2 },
                        word: word,
                        strata: strata,
                        aMETZa: {
                            vertex: `v_${x}_${y}_${z}`,
                            aFLECTZa: strata === "MID" ? "REFRACT" : "REFLECT",
                            aSPARKaPotential: strata === "CORE" ? 1.0 : 0.5
                        }
                    });
                }
            }
        }
        return orbs;
    }

    function add_ORBZ_512() {
        const orbsData = generateSugarCube512();
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);

        orbsData.forEach(data => {
            // let color = 0x00FFFF; // Default Cyan for MID
            let color = 0x39FF14; // Neon Green for MID
            if (data.strata === "CORE") color = 0xFF00FF; // CORE
            if (data.strata === "AERO") color = 0x7DF9FF; // AERO (Electric Blue / Whiter Neon)

            const material = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: data.strata === "CORE" ? 0.8 : 0.4
            });

            const sphere = new THREE.Mesh(sphereGeometry, material);
            sphere.position.set(data.pos.x, data.pos.y, data.pos.z);
            sphere.userData = { word: data.word, strata: data.strata, aMETZa: data.aMETZa };

            scene.add(sphere);
            spheres.set(sphere.id, { txt: data.word, ...data.pos, originalColor: color, originalOpacity: material.opacity, originalScale: sphere.scale.clone() });
        });
    }

    add_ORBZ_512();


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
    add_Tesseract_1();

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
    add_Anchor_Boxes();

    const txt_points = [
        { x: 0, y: 10, z: 0, txt: 'up', color: 0xFFFF00 },
        { x: 0, y: -10, z: 0, txt: 'down', color: 0xFFA500 },
        { x: 0, y: 0, z: 10, txt: 'north', color: 0x0000FF },
        { x: 10, y: 0, z: 0, txt: 'east', color: 0x800080 },
        { x: 0, y: 0, z: -10, txt: 'south', color: 0xFF0000 },
        { x: -10, y: 0, z: 0, txt: 'west', color: 0x00FF00 }
    ];

    function createCenterSpike(start, end, color, count = 6) {
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
        // Using global spheres, raycaster, mouse

        txt_points.forEach(point => {
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: point.color });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(point.x, point.y, point.z);
            scene.add(sphere);
            spheres.set(sphere.id, point);

            createCenterSpike(
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
            // context.fillText(point.txt, 128, 128); //DIRECTIONAL TEXT N,E,S,W,U,D.

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

    // function add_Manifold_1() {
    //     // debugger;
    //     const targetWords = ["aZEPTZa", "aFACTZa", "aFALZa"];
    //     const foundPoints = [];

    //     // Find positions of target words
    //     for (const data of spheres.values()) {
    //         if (targetWords.includes(data.txt)) {
    //             foundPoints.push(new THREE.Vector3(data.x, data.y, data.z));
    //             console.log("Found point:", data.txt, data.x, data.y, data.z);
    //         }
    //     }

    //     if (foundPoints.length >= 3) {
    //         const geometry = new THREE.BufferGeometry().setFromPoints(foundPoints);
    //         // Compute normals for proper lighting/visibility (though BasicMaterial doesn't strictly need them, it helps if we switch materials)
    //         geometry.computeVertexNormals();

    //         // To make a solid triangle, we need indices or just 3 vertices. setFromPoints with 3 vectors creates one triangle.

    //         const material = new THREE.MeshBasicMaterial({
    //             color: 0xFFFF00, // Yellow
    //             transparent: false,
    //             opacity: 1.0,
    //             side: THREE.DoubleSide
    //         });
    //         const plane = new THREE.Mesh(geometry, material);
    //         scene.add(plane);
    //         console.log("Manifold added connecting:", targetWords);
    //     } else {
    //         console.warn("Could not find all manifold points:", targetWords, "Found:", foundPoints.length);
    //     }
    // }
    // add_Manifold_1();

    // function add_default_Plane() {
    //     const geometry1 = new THREE.BufferGeometry().setFromPoints([
    //         new THREE.Vector3(1, 1, 1),
    //         new THREE.Vector3(1, -1, 1),
    //         new THREE.Vector3(-1, -1, -1),
    //     ]);
    //     const material = new THREE.MeshBasicMaterial({
    //         color: 0xFF0000, transparent: true, opacity: 0.5, side: THREE.DoubleSide
    //     });
    //     const plane = new THREE.Mesh(geometry1, material);
    //     scene.add(plane);

    //     const geometry2 = new THREE.BufferGeometry().setFromPoints([
    //         new THREE.Vector3(-1, 1, 1),
    //         new THREE.Vector3(-1, -1, 1),
    //         new THREE.Vector3(1, -1, -1),
    //     ]);
    //     const material2 = new THREE.MeshBasicMaterial({
    //         color: 0x0000FF, transparent: true, opacity: 0.5, side: THREE.DoubleSide
    //     });
    //     const plane2 = new THREE.Mesh(geometry2, material2);
    //     scene.add(plane2);
    //     console.log("add_default_Plane added red triangle");
    // }
    // add_default_Plane();


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

                const isSelected = selectedOrbs.has(clickedSphere.id);

                if (isSelected) {
                    // Always allow toggling OFF individually
                    deselect_ORB_SYSTEM(clickedSphere.id);
                } else {
                    // If NOT already selected:
                    if (!window.MULTI_SELECT) {
                        // If Multi-Select is OFF, clear everything else first
                        deselect_ORB_SYSTEM(); // No ID means clear all
                    }
                    // Select the new one
                    select_ORB_SYSTEM1(clickedSphere, { primary_selection: true, secondary_selection: false, tertiary_selection: false });
                }
            }
        }
    }
    renderer.domElement.addEventListener('click', onClick, false);

    function updateDashboardFromSelection() {
        const dashboard = document.getElementById('DASHBOARD_textarea');
        if (!dashboard) return;

        if (selectedOrbs.size === 0) {
            dashboard.innerText = "";
            return;
        }

        let displayText = "";
        let index = 1;
        selectedOrbs.forEach((value, id) => {
            const sphere = scene.getObjectById(id);
            if (sphere) {
                const txt = sphere.userData.word || "N/A";
                const strata = sphere.userData.strata || "N/A";
                const pos = sphere.position;

                displayText += `[${index}] SELECTED ORB: ${txt} (${strata})\n`;
                displayText += `    POS: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})\n`;
                displayText += `----------------------------------------\n`;
                index++;
            }
        });
        dashboard.innerText = displayText;
    }

    function select_ORB_SYSTEM1(sphere, params) {
        console.log("select_ORB_SYSTEM1 called with:", params);
        if (sphere && !selectedOrbs.has(sphere.id)) {
            sphere.material.color.setHex(0x96DED1); // Bird Egg Blue
            sphere.material.opacity = 1.0;
            sphere.scale.set(2.0, 2.0, 2.0); // Scale up radius

            // Add Glow
            const map = getGlowTexture();
            const material = new THREE.SpriteMaterial({ map: map, color: 0x96DED1, transparent: true, blending: THREE.AdditiveBlending });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(0.6, 0.6, 1.0);
            sprite.position.copy(sphere.position);
            scene.add(sprite);

            // Track selection
            selectedOrbs.set(sphere.id, { sprite: sprite });

            // Update Dashboard
            updateDashboardFromSelection();
        }
    }

    function deselect_ORB_SYSTEM(targetId = null) {
        console.log("deselect_ORB_SYSTEM called, target:", targetId);

        const idsToDeselect = targetId ? [targetId] : Array.from(selectedOrbs.keys());

        idsToDeselect.forEach(id => {
            const sphere = scene.getObjectById(id);
            const data = spheres.get(id);
            const selectionData = selectedOrbs.get(id);

            // Restore Orb Visuals
            if (sphere && data) {
                // Remove from tracking
                selectedOrbs.delete(id);

                // 1. Restore Defaults First
                if (data.originalColor !== undefined) sphere.material.color.setHex(data.originalColor);
                if (data.originalOpacity !== undefined) sphere.material.opacity = data.originalOpacity;
                if (data.originalScale !== undefined) sphere.scale.copy(data.originalScale);

                if (selectionData && selectionData.sprite) {
                    scene.remove(selectionData.sprite);
                }

                // 2. Check if Stratum is Active (and re-apply Visuals if so)
                if (window.activeStrata && window.activeStrata[data.strata]) {
                    // Re-apply Strata Styles (Logic duplicated from toggleStrataGlow logic for consistency)

                    // Visual Specs
                    let scaleVal = 1.0;
                    let opacityVal = 0.5;
                    if (data.strata === "CORE") { scaleVal = 0.5; opacityVal = 0.9; }
                    else if (data.strata === "MID") { scaleVal = 2.5; opacityVal = 0.6; }
                    else if (data.strata === "AERO") { scaleVal = 1.5; opacityVal = 0.5; }

                    sphere.scale.set(scaleVal, scaleVal, scaleVal);
                    sphere.material.opacity = opacityVal;

                    if (!sphere.userData.glowSprite) {
                        const map = getGlowTexture();
                        const material = new THREE.SpriteMaterial({
                            map: map,
                            color: sphere.material.color,
                            transparent: true,
                            blending: THREE.AdditiveBlending
                        });
                        const sprite = new THREE.Sprite(material);
                        sprite.scale.set(1.5, 1.5, 1.0);
                        sprite.position.copy(sphere.position);
                        scene.add(sprite);
                        sphere.userData.glowSprite = sprite;
                    }
                } else {
                    // Ensure glow is gone if not active
                    if (sphere.userData.glowSprite) {
                        scene.remove(sphere.userData.glowSprite);
                        sphere.userData.glowSprite = null;
                    }
                }
            }
        });

        // Update Dashboard
        updateDashboardFromSelection();
    }

    function onMouseMove(event) {
        event.preventDefault();
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            const data = spheres.get(object.id);
            if (data && data.txt) {
                if (hoveredSphereId !== object.id) {
                    hoveredSphereId = object.id;
                    tooltip.style.display = 'block';
                    tooltip.textContent = data.txt;
                }
                // Update position
                tooltip.style.left = event.clientX + 10 + 'px';
                tooltip.style.top = event.clientY + 10 + 'px';
                document.body.style.cursor = 'pointer';
            }
        } else {
            if (hoveredSphereId !== null) {
                hoveredSphereId = null;
                tooltip.style.display = 'none';
                document.body.style.cursor = 'default';
            }
        }
    }
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);

    function onWindowResize() {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    // --- STRATA TOGGLES ---
    window.toggleStrataGlow = function (targetStrata, isActive) {
        console.log(`toggleStrataGlow: ${targetStrata} = ${isActive}`);

        // Update State
        if (window.activeStrata) {
            window.activeStrata[targetStrata] = isActive;
        }

        let count = 0;
        spheres.forEach((data, id) => {
            const sphere = scene.getObjectById(id);
            if (sphere && sphere.userData && sphere.userData.strata === targetStrata) {

                // SKIP if currently selected (Selection overrides Strata Toggle)
                if (selectedOrbs.has(id)) return;

                count++;
                if (isActive) {
                    // Active State: Apply Visuals (Scale, Opacity, Glow)

                    // 1. Scale & Opacity
                    // Specs: CORE(6x, 0.9), MID(3.5x, 0.6), AERO(1.5x, 0.5)
                    let scaleVal = 1.0;
                    let opacityVal = 0.5;
                    if (targetStrata === "CORE") { scaleVal = 0.5; opacityVal = 0.9; }
                    else if (targetStrata === "MID") { scaleVal = 2.5; opacityVal = 0.6; }
                    else if (targetStrata === "AERO") { scaleVal = 1.5; opacityVal = 0.5; }

                    sphere.scale.set(scaleVal, scaleVal, scaleVal);
                    sphere.material.opacity = opacityVal;

                    // 2. Glow Sprite
                    if (!sphere.userData.glowSprite) {
                        const map = getGlowTexture();
                        const material = new THREE.SpriteMaterial({
                            map: map,
                            color: sphere.material.color,
                            transparent: true,
                            blending: THREE.AdditiveBlending
                        });
                        const sprite = new THREE.Sprite(material);
                        sprite.scale.set(1.5, 1.5, 1.0);
                        sprite.position.copy(sphere.position);
                        scene.add(sprite);
                        sphere.userData.glowSprite = sprite;
                    }
                } else {
                    // Inactive State: Revert to Originals
                    if (data.originalScale) sphere.scale.copy(data.originalScale);
                    if (data.originalOpacity) sphere.material.opacity = data.originalOpacity;

                    // Remove Glow Sprite
                    if (sphere.userData.glowSprite) {
                        scene.remove(sphere.userData.glowSprite);
                        sphere.userData.glowSprite = null;
                    }
                }
            }
        });
        console.log(`toggleStrataGlow: Modified ${count} orbs for strata ${targetStrata}`);
    };
}
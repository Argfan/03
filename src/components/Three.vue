<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

  import {Mesh, MeshBasicMaterial, PerspectiveCamera, Scene,  WebGLRenderer, BoxGeometry,  MeshStandardMaterial, PointLight, MeshLambertMaterial, MeshNormalMaterial, MeshPhongMaterial, Object3D, SphereGeometry, MeshToonMaterial, Shape, ShapeGeometry, ExtrudeGeometry} from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  import { useWindowSize } from '@vueuse/core';

  import {Pane} from 'tweakpane';
  import * as TweakpaneEssentialsPlugin from '@tweakpane/plugin-essentials/dist/tweakpane-plugin-essentials.min.js';

  import {ambienlight, directionalLight, pointLight,  spotLight,  } from '../models/light'
  import { useClip } from '../store/clipStore'
  import { storeToRefs } from 'pinia';

  import ClipPathType from '../models/ClipPathType';

  const clipC = useClip()
  const {clipPath} = storeToRefs(clipC)


  const pane = new Pane();
  pane.registerPlugin(TweakpaneEssentialsPlugin);
  

  // console.log(ambienlight.color.convertLinearToSRGB());
  

  const fpsGraph = pane.addBlade({
    view: 'fpsgraph',
    label: 'FPS',
  });
  const PARAMS = {
    speed: 50,

  };   

  const cornerList = pane.addBlade({
    view: 'list',
    label: 'Углов',
    options: [
      {text: '3', value: '3'},
      {text: '4', value: '4'},
      {text: '5', value: '5'},
      {text: '6', value: '6'},
      {text: '7', value: '7'},
      {text: '8', value: '8'},
    ],
    value: '4',
  }).on('change', (ev)=>{
    clipC.setClipCorner(+ev.value)
  })

  
  watch(clipPath, 
    ()=>{
      console.log('asdasd');      
        
    })

  clipC.$subscribe(()=>{
    draw()
    
  })


  const canvas = ref<HTMLCanvasElement | null>(null)
  const {width, height} = useWindowSize()

  let renderer: WebGLRenderer
  let camera: PerspectiveCamera
  let constrols: OrbitControls
  let meshArr: Mesh[] = [];

  const aspectRaio = computed(()=> width.value / height.value)
 
  const scene = new Scene()
  camera = new PerspectiveCamera(75, aspectRaio.value, 0.1, 1000)

  scene.add(camera)

  camera.position.z = 5
  camera.position.y = 5




  const plane = new Mesh(
    new BoxGeometry(5,0.1,5),
    new MeshStandardMaterial(),    
  )

  plane.position.set(0, -1.5, 0)
  plane.receiveShadow = true;  

  // scene.add(plane)  

  scene.add( ambienlight );

  scene.add( directionalLight );

  camera.add( pointLight );
  scene.add( pointLight );
  // scene.add( pointLight2 );
  scene.add( spotLight )

 
  
  const geneeateShape = (cPth: ClipPathType[])=>{
    console.log(cPth);
    

    const size = 5

    const shape = new Shape()

    shape.moveTo( cPth[0].x*size, cPth[0].y*size )
    for (let i = 1; i < cPth.length; i++) {
      shape.lineTo( cPth[i].x*size, cPth[i].y*size )      
    }
    shape.autoClose=true;

    // cPth.forEach((el, i)=>{
    //   if(i) shape.moveTo( el.x*size, el.y*size )
    //   else shape.lineTo( el.x*size, el.y*size )
    // })
    console.log(shape);
    


    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 0 };
    const geometry = new ExtrudeGeometry( shape, extrudeSettings );
    const material = new MeshStandardMaterial(  );
    const smesh = new Mesh( geometry, material ) ;

    // var vertices = geometry.vertices;

    smesh.position.set(-size/2, 0, -size/2)
    smesh.rotation.x = Math.PI/2

    scene.add( smesh );
    meshArr.push(smesh)

    console.log(smesh);

  // smesh.geometry.parameters.shapes.curves[0].v1.x = 5
}
  const draw = ()=> {
    meshArr.forEach(e=>{
        e.geometry.dispose();
        e.material.dispose();
        scene.remove(e);
    });
    meshArr=[];    

    geneeateShape(clipPath.value)
    
    meshArr.forEach(e=>{
        e.castShadow=true;
        scene.add(e);
    }); 
  }

  const updateRenderer = ()=>{
    renderer.setSize(width.value, height.value)
    renderer.setPixelRatio(window.devicePixelRatio)
  }
  const updateCamera= ()=>{
    camera.aspect = aspectRaio.value
    camera.updateProjectionMatrix()    
  }

  watch(aspectRaio, updateRenderer)
  watch(aspectRaio, updateCamera)

  let b = 0

  const smeshAnim = () =>{
    // smesh.rotation.x = b
    // console.log(b);
    
    // b+=0.01
  }



  const loop = ()=>{    

    smeshAnim()

    fpsGraph.begin();
    renderer.render(scene, camera)
    constrols.update()
    fpsGraph.end();
    requestAnimationFrame(loop)
  }
  
  const init = () => {
    renderer = new WebGLRenderer({canvas: canvas.value as HTMLCanvasElement, antialias: true})
    renderer.shadowMap.enabled = true;
    // renderer.setClearColor(0xfafafa);
    constrols = new OrbitControls(camera, renderer.domElement)
    constrols.enableDamping = true
    camera.lookAt( 0, 0, 0 );
    updateRenderer()
    updateCamera()
    
    loop()

  }


onMounted(()=>{
  init()
})

</script>

<template>
  {{  }}
    <canvas ref="canvas"></canvas>

</template>

<style scoped>

canvas{
  position: fixed;
  width: 100vw; height: 100vh; 
  top: 0;left: 0;right: 0;bottom: 0;
}

</style>

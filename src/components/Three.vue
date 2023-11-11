<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

  import {Mesh, PerspectiveCamera, Scene,  WebGLRenderer, BoxGeometry,  MeshStandardMaterial, Shape, ExtrudeGeometry} from 'three'
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
  import { useWindowSize } from '@vueuse/core';

  import { ListBladeApi, Pane} from 'tweakpane';

  import {ambienlight, directionalLight, pointLight,  spotLight,  } from '../models/light'
  import { useClip } from '../store/clipStore'
  import { storeToRefs } from 'pinia';

  import ClipPathType from '../models/ClipPathType';

  const clipC = useClip()
  const {clipPath} = storeToRefs(clipC)


  const pane = new Pane();

  

  // console.log(ambienlight.color.convertLinearToSRGB());
  


  // const PARAMS = {
  //   speed: 50,

  // };   

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
  }) as  ListBladeApi<any>

  cornerList.on('change', (ev:any)=>{
    clipC.setClipCorner(+ev.value)
  })
  console.log(cornerList);
  
  // cornerList.addEventListener('change', ()=>{})
  
  watch(clipPath, 
    ()=>{   
        
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
 
    const size = 5

    const shape = new Shape()

    // shape.moveTo( cPth[0].x*size, cPth[0].y*size )
    // for (let i = 1; i < cPth.length; i++) {
    //   shape.lineTo( cPth[i].x*size, cPth[i].y*size )      
    // }
    
    cPth.forEach((el, i)=>{
      if(i==0) shape.moveTo( el.x*size, el.y*size )
      else shape.lineTo( el.x*size, el.y*size )
    })
    
    shape.autoClose=true;
    


    const extrudeSettings = { depth: 0.1, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0, bevelThickness: 0 };
    const geometry = new ExtrudeGeometry( shape, extrudeSettings );
    const material = new MeshStandardMaterial(  );
    const smesh = new Mesh( geometry, material ) ;

    // var vertices = geometry.vertices;

    smesh.position.set(-size/2, 0, -size/2)
    smesh.rotation.x = Math.PI/2

    scene.add( smesh );
    meshArr.push(smesh)



  // smesh.geometry.parameters.shapes.curves[0].v1.x = 5
}
  const draw = ()=> {
    meshArr.forEach(e=>{
        e.geometry.dispose();
        // e.material.dispose();
        // console.log(e.material);
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



  const loop = ()=>{    

    renderer.render(scene, camera)
    constrols.update()

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

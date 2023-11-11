<script setup lang="ts">

import { Ref, computed, onMounted, reactive, ref, watch } from 'vue'
import { getGUID } from '../service/helpers'
import Handle from '../models/Handle'
import {cornersParametr} from '../moks/Clip_moks'
import { useMouse } from '@vueuse/core'

import { useClip } from '../store/clipStore'
import { storeToRefs } from 'pinia'
import ClipPathType from '../models/ClipPathType'

const clipC = useClip()
const {clipCorner} = storeToRefs(clipC)

console.log(clipCorner);


const { x, y } = useMouse()
const cMouse = reactive({x: 0, y:0})

interface PropTypes {
  c_count: number
  c_width: number,
  c_height: number
}
const p = defineProps<PropTypes>()



const isDraging = ref(false)

const clipPath:Ref<ClipPathType[]> = ref([])

// const pRef = toRef(p)

watch(clipCorner, ()=>{
  init()  
})

let handles:Ref<Handle[]> = ref([])
const handle = reactive(new Handle())

const init = ()=>{  
  const corners = cornersParametr[clipCorner.value-3]
  handles.value = []
  clipPath.value = []
  corners.forEach((el)=>{
    const id = getGUID()
    handles.value.push({
      id: id,
      x: el[0],
      y: el[1],
      l: el[0]*p.c_width,
      t: el[1]*p.c_height,
      tx: 0,
      ty: 0,
      isDraging: false
    })
    clipPath.value.push({id:id,x:el[0],y:el[1]})
    clipC.setClipPath(clipPath.value)
  })
} 

watch(x, ()=>{
  hTranslate()
})
watch(y, ()=>{
  hTranslate()
})
const hTranslate = ()=>{
  if(handle.isDraging){
    
    handle.tx = x.value-cMouse.x
    handle.ty = y.value-cMouse.y
    if(handle.tx+handle.l>=p.c_width) handle.tx = p.c_width - handle.l
    if(handle.ty+handle.t>=p.c_width) handle.ty = p.c_width - handle.t
    if(handle.tx+handle.l<=0) handle.tx = -handle.l
    if(handle.ty+handle.t<=0) handle.ty = -handle.t
    // handle.l = x.value-cMouse.x - handle.l
    // handle.t = y.value-cMouse.y
    handle.x = ((handle.l+handle.tx)/p.c_width)
    handle.y = ((handle.t+handle.ty)/p.c_height)
    const hh = handles.value.find(el=>el.id==handle.id)
    if(hh) Object.assign(hh, handle)
    clipPathInit()
  }
}
const asd = ()=>{
  console.log('click');   
}
const hMousedown = (h: Handle)=>{
  isDraging.value = true
  h.isDraging = true
  cMouse.x=x.value
  cMouse.y=y.value
  
  Object.assign(handle, h)  
}
const wMouseup = (event: MouseEvent)=>{
  event.preventDefault()
  isDraging.value = false
  cMouse.x = 0
  cMouse.y = 0
  handle.isDraging = false
  handle.l += handle.tx 
  handle.t += handle.ty
  handle.tx = 0 
  handle.ty = 0 
  const hh = handles.value.find(el=>el.id==handle.id)
  if(hh) Object.assign(hh, handle)
}
const hdragover = (event: MouseEvent)=>{
  event.preventDefault()
}
const clipPathInit = ()=>{
  const clip = clipPath.value.find(el=>el.id==handle.id)
  if(clip){
    clip.x=handle.x
    clip.y=handle.y
  }
  clipC.setClipPath(clipPath.value)
}


const clipStyle = computed(()=>{
  let s=''
  clipPath.value.forEach((el, i, arr)=>{
    if(i==arr.length-1) s+=`${el.x*100}% ${el.y*100}%`
    else s+=`${el.x*100}% ${el.y*100}%,`
  })
  return `polygon(${s})` 
})

onMounted(()=>{
  init()
  window.addEventListener('mouseup', wMouseup, false)
  window.addEventListener('dragend', wMouseup, false)
  console.log(clipPath.value);
  
})

</script>

<template>
  <div class="clip_block" :style="{'width': p.c_width+16+'px', 'height': p.c_height+16+'px'}">
    <div class="clipboard" :style="{'clip-path': clipStyle}" 
    ></div>
    
    <div class="handles" @dragover="hdragover">
      <div class="handle" 
        v-for="h in handles" 
        :key="h.id"
        @click="asd"
        @mousedown="hMousedown(h)"
        draggable="false"
        @mouseup="wMouseup"
        :style="{'left': h.l+'px', 'top': h.t+'px', 'transform': `translate3d(${h.tx}px, ${h.ty}px, 0)`}"
        :class="{'isDragging': h.isDraging}"
      ></div>
      <!-- <div class="handle" 
        v-for="h in handles" 
        :key="h.id"
        @click="asd"
        @dragstart.stop="hdragstart(h)"        
        @dragend="hdragend"
        :style="{'left': h.l+'px', 'top': h.t+'px', 'background-color': h.color}"
        :class="{'isDraging': h.isDraging}"
      ></div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
../model/Handle
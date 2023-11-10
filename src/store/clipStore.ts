
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';
import ClipPathType from '../models/ClipPathType';

export const useClip = defineStore('clip', () => {
    const clipCorner:Ref<number> = ref(4)
    const clipPath:Ref<ClipPathType[]> = ref([])
    const getClipCorner = ()=>{
        return clipCorner.value
    }
    const setClipCorner = (c: number)=>{
        clipCorner.value = c
    }
    const getClipPath = ()=>{
        return clipPath.value
    }
    const setClipPath = (c: ClipPathType[])=>{
        clipPath.value = c
    }
  
    return { clipCorner, clipPath, getClipCorner, setClipCorner, getClipPath, setClipPath}
})
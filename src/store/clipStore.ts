
import { defineStore } from 'pinia';
import { Ref, ref } from 'vue';

export const useClip = defineStore('clip', () => {
    const clipCorner:Ref<number> = ref(4)

    const getClipCorner = ()=>{
        return clipCorner.value
    }
    const setClipCorner = (c: number)=>{
        clipCorner.value = c
    }
  
    return { clipCorner, getClipCorner, setClipCorner}
})
import { Object3D, Scene } from "three";

export const addSceneEntity = (scene: Scene,...obj: Object3D[])=>{
  obj.forEach(el=>scene.add(el))    
}
export const removeSceneEntity = (scene: Scene, ...obj: Object3D[]) => {
  obj.forEach(el=>{
    const selectedObject = scene.getObjectByName(el.name);
    if(selectedObject) scene.remove( selectedObject );
  })
}

export const showSceneEntity = (...obj: Object3D[])=>{
  obj.forEach(el=>el.visible = true)    
}
export const hideSceneEntity = (...obj: Object3D[])=>{
  obj.forEach(el=>el.visible = false)      
}

export const getGUID = () => {
  const _p8 = (s?: boolean) => {
      var p = (Math.random().toString(16) + '000000000').substr(2, 8);
      return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
  };
  return (_p8() + _p8(true) + _p8(true) + _p8()).toUpperCase();
};
import { AmbientLight, DirectionalLight, DirectionalLightHelper, PointLight, PointLightHelper, SpotLight, SpotLightHelper } from "three";

export const ambienlight = new AmbientLight( 0x444444 )
ambienlight.name = 'ambienlight'

export const directionalLight = new DirectionalLight( 0x9999ff, 2 );
directionalLight.position.set( 0, 4, -3.5 );
directionalLight.name = 'directionalLight'
directionalLight.castShadow=true
directionalLight.shadow.mapSize.width = 512; // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5; // default
directionalLight.shadow.camera.far = 500; // default

export const directionalLightHelper = new DirectionalLightHelper( directionalLight, 1 , '#8888ff' );
directionalLightHelper.name = 'directionalLightHelper'

export const pointLight = new PointLight( 0x00ff00, 1 );
pointLight.position.set( -0.75, 0.75, 0.75 );
pointLight.name = 'pointLight'
pointLight.castShadow=true

const sphereSize = 1;
export const pointLightHelper = new PointLightHelper( pointLight, sphereSize, 'green' );
pointLightHelper.name = 'pointLightHelper'

export const spotLight = new SpotLight( 0xff0000 );
spotLight.intensity = 10
spotLight.distance = 5
spotLight.name = 'spotLight'
spotLight.position.set( 1.2, 1.2, 1.2);
spotLight.castShadow=true
spotLight.shadow.mapSize.width = 512; // default
spotLight.shadow.mapSize.height = 512; // default
spotLight.shadow.camera.near = 0.5; // default
spotLight.shadow.camera.far = 500; // default
spotLight.shadow.focus = 1; // default

export const spotLightHelper = new SpotLightHelper( spotLight, 'red' );
spotLightHelper.name = 'spotLightHelper'


export const pointLight2 = new PointLight( 0xffffff, 1 );

pointLight2.name = 'pointLight2'
pointLight2.castShadow=true
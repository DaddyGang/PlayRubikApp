/* eslint-disable */
import * as THREE from 'three'

//基础模型参数
const BasicParams = {
  x: 0,
  y: 0,
  z: 0,
  num: 3,
  len: 50,
  //右、左、上、下、前、后
  colors: ['#ff6b02', '#dd422f',
    '#ffffff', '#fdcd02',
    '#3d81f7', '#019d53']
};

/**
 * 简易魔方
 * x、y、z 魔方中心点坐标
 * num 魔方阶数
 * len 小方块宽高
 * colors 魔方六面体颜色
 */
function SimpleCube(x, y, z, num, len, colors) {
  //魔方左上角坐标
  let leftUpX = x - num/2*len;
  let leftUpY = y + num/2*len;
  let leftUpZ = z + num/2*len;

  let cubes = [];
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num * num; j++) {

      let myFaces = [];
      for (let k = 0; k < 6; k++) {
        myFaces[k] = faces(colors[k]);
      }

      let materials = [];
      for (let k = 0; k < 6; k++) {
        let texture = new THREE.Texture(myFaces[k]);
        texture.needsUpdate = true;
        materials.push(new THREE.MeshLambertMaterial({ map: texture}));
      }

      let cubegeo = new THREE.BoxGeometry(len, len, len);
      let cube = new THREE.Mesh(cubegeo, materials);

      //依次计算各个小方块中心点坐标
      cube.position.x = (leftUpX + len / 2) + (j % num) * len;
      cube.position.y = (leftUpY - len / 2) - parseInt(j / num) * len;
      cube.position.z = (leftUpZ - len / 2) - i * len;
      cubes.push(cube)
    }
  }
  return cubes;
}

function faces(rgbaColor) {
  let canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  let context = canvas.getContext('2d');
  //画一个宽高都是256的黑色正方形
  context.fillStyle = 'rgba(0,0,0,1)';
  context.fillRect(0, 0, 256, 256);
  //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
  context.rect(16, 16, 224, 224);
  context.lineJoin = 'round';
  context.lineWidth = 16;
  context.fillStyle = rgbaColor;
  context.strokeStyle = rgbaColor;
  context.stroke();
  context.fill();
  return canvas;
}

export default class Rubik {
    constructor(main){
      this.main = main;
    }

    model(type) {
      // 创建魔方集合
      this.group = new THREE.Group();
      this.group.childType = type;

      this.cubes = SimpleCube(BasicParams.x, BasicParams.y, BasicParams.z, BasicParams.num, BasicParams.len, BasicParams.colors);//生成魔方小正方体
      for (let i = 0; i < this.cubes.length; i++) {
        let item = this.cubes[i];
        this.group.add(item);
      }
      if(type=='frontView'){
        this.group.rotateY(45/180*Math.PI);
      }else{
        this.group.rotateY((270-45) / 180 * Math.PI);
      }
      this.group.rotateOnAxis(new THREE.Vector3(1, 0, 1), 25 / 180 * Math.PI);
      this.main.scene.add(this.group);
  }

  resizeHeight(percent, transformTag) {
    if (percent < this.main.minPercent) {
      percent = this.main.minPercent;
    }
    if (percent > (1 - this.main.minPercent)) {
      percent = 1 - this.main.minPercent;
    }
    this.group.scale.set(percent, percent, percent);
    this.group.position.y = this.main.originHeight * (0.5 - percent / 2) * transformTag;
  }


}

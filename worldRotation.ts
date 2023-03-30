import { MathUtils, Matrix4, Vector3, Euler, Object3D, Quaternion } from 'three';

/**
 * @author 冯超
 * @param mesh
 * @returns
 */
// 修改方向，子元素的几何体跟随一起旋转()
export function getWorldRotation(mesh: Object3D) {
  const orldQuaternion = new Quaternion();
  mesh.getWorldQuaternion(orldQuaternion);
  const rotation = new Euler().setFromQuaternion(orldQuaternion);
  return rotation;
}

/**
 *相对于世界轴的修改旋转
 * @author 冯超
 * @param mesh 要修改的对象
 * @param rotation 角度
 * @returns void
 */
export function setWorldRotation(mesh: Object3D, rotation: Vector3, scene:Object3D): void {
  mesh.matrixWorld.makeRotationFromQuaternion(
    new Quaternion().setFromEuler(
      new Euler(MathUtils.degToRad(rotation.x), MathUtils.degToRad(rotation.y), MathUtils.degToRad(rotation.z))
    )
  );
  let cloneMatrix;

  // 有父级取父级的世界矩阵，没有就取场景的矩阵
  if (mesh.parent) {
    cloneMatrix = mesh.parent.matrixWorld.clone().invert();
  } else {
    cloneMatrix = scene.matrixWorld.clone().invert();
  }

  // 计算并更改自己本地矩阵
  mesh.matrix.multiplyMatrices(cloneMatrix, mesh.matrixWorld);
  mesh.rotation.setFromRotationMatrix(mesh.matrix);
}

/**
 *相对于世界轴的修改位置
 * @author 冯超
 * @param mesh 要修改的对象
 * @param rotation 相当于大地的位置
 * @returns void
 */
export function setWorldPosition(mesh: Object3D, position: Vector3, scene: Object3D): void {
  mesh.matrixWorld.setPosition(position.x, position.y, position.z);
  let cloneMatrix;
  // 有父级取父级的世界矩阵，没有就取场景的矩阵
  if (mesh.parent) {
    cloneMatrix = mesh.parent.matrixWorld.clone().invert();
  } else {
    cloneMatrix = scene.matrixWorld.clone().invert();
  }
  // 计算并更改自己本地矩阵
  mesh.matrix.multiplyMatrices(cloneMatrix, mesh.matrixWorld);
  mesh.position.setFromMatrixPosition(mesh.matrix);
}

// 矩阵计算两个相对的坐标
/**
 * 矩阵计算两个相对的坐标
 * @author 冯超
 * @param parent3dObject 父级3D对象
 * @param child3dObject 子3D对象
 * @returns void
 */
export function relativeMatrix4(parent3dObject: Object3D, child3dObject: Object3D): Matrix4 {
  return parent3dObject.matrixWorld.clone().invert().multiply(child3dObject.matrixWorld);
}

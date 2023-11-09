export default class Handle {
  id: string = ''
  x: number = 0
  y: number = 0
  l: number = 0
  t: number = 0
  tx: number = 0
  ty: number = 0
  isDraging: boolean = false
  public constructor(init?: Partial<Handle>) {
    Object.assign(this, init);
  }
}
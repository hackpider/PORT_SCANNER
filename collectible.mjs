export default class Collectible {
  constructor(x, y) {
    this.id = Date.now() + Math.floor(Math.random() * 1000);
    this.x = x;
    this.y = y;
    this.value = Math.floor(Math.random() * 10) + 1;
    this.radius = 10;
    this.color = 'gold';
  }
}
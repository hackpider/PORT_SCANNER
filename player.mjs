export default class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.score = 0;
    this.radius = 15;
    this.color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }

  movePlayer(direction, amount) {
    switch (direction) {
      case 'up':
        this.y -= amount;
        break;
      case 'down':
        this.y += amount;
        break;
      case 'left':
        this.x -= amount;
        break;
      case 'right':
        this.x += amount;
        break;
    }
  }

  calculateRank(players) {
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex(p => p.id === this.id) + 1;
    return `Rank: ${rank}/${players.length}`;
  }

  collision(collectible) {
    const distance = Math.sqrt(
      Math.pow(this.x - collectible.x, 2) + 
      Math.pow(this.y - collectible.y, 2)
    );
    return distance < this.radius + collectible.radius;
  }
}
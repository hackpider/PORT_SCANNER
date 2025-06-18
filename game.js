class Game {
  constructor() {
    this.players = {};
    this.collectibles = [];
    this.generateCollectibles(5);
  }

  addPlayer(playerId) {
    this.players[playerId] = {
      x: Math.random() * 800,
      y: Math.random() * 600,
      score: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
  }

  removePlayer(playerId) {
    delete this.players[playerId];
  }

  generateCollectibles(count) {
    for (let i = 0; i < count; i++) {
      this.collectibles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        id: Date.now() + i,
        value: Math.floor(Math.random() * 10) + 1
      });
    }
  }

  handlePlayerMove(playerId, moveData) {
    const player = this.players[playerId];
    if (!player) return;

    // Update player position
    player.x = moveData.x;
    player.y = moveData.y;

    // Check for collectible collisions
    this.collectibles = this.collectibles.filter(collectible => {
      const distance = Math.sqrt(
        Math.pow(player.x - collectible.x, 2) + 
        Math.pow(player.y - collectible.y, 2)
      );
      
      if (distance < 20) { // Collision detected
        player.score += collectible.value;
        return false;
      }
      return true;
    });

    // Regenerate collectibles if running low
    if (this.collectibles.length < 2) {
      this.generateCollectibles(3);
    }
  }

  getPublicState() {
    // Sort players by score for ranking
    const rankedPlayers = Object.entries(this.players)
      .sort((a, b) => b[1].score - a[1].score)
      .map(([id, data], index) => ({
        id,
        ...data,
        rank: index + 1
      }));
    
    return {
      players: rankedPlayers,
      collectibles: this.collectibles
    };
  }
}

module.exports = Game;
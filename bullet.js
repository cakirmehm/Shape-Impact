export default class Bullet {
    constructor(gameWidth, gameHeight, player) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.vy = -1;

        this.x = player.x + player.width / 2;
        this.y = player.y;

        this.damage = player.bulletDamage;

        this.width = this.damage;
        this.height = this.width;

        this.markedAsDeleted = false;
    }

    draw(context) {
        // if (!this.hitTheEnemy)
        {
            context.strokeStyle = 'red';
            context.strokeRect(this.x, this.y, this.width, this.height);

            context.fillStyle = 'lightsalmon';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    update() {
        // this.x = this.player.x + this.player.width / 2;
        this.y += this.vy;

        if (this.y < 0) {
            this.markedAsDeleted = true;
        }
    }

    hasCollision(that) {
        return (
            this.x < that.x + that.width &&
            this.x + this.width > that.x &&
            this.y < that.y + that.height &&
            this.height + this.y > that.y
        );
    }
}

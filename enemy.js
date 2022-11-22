export default class Enemy {
    constructor(gameWidth, gameHeight, level) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.health = getRand(5 * level, 20 * level);
        this.width = 50 + this.health;
        this.height = this.width;

        this.level = level;

        this.x = getRand(0, this.gameWidth - this.width);
        this.y = 0 - this.width;

        this.fillColor = 'salmon';

        this.isHealing = getRand(1, 5) === 3;
        this.isEnergetic = getRand(1, 5) === 3;

        this.vy = 0;
        this.vx = 0;

        this.dir = getRand(0, 4) - 2;

        this.IsCollidedWithPlayer = false;
        this.markedAsDeleted = false;
    }

    draw(context) {
        if (this.health > 0 && context != undefined) {
            context.strokeStyle = 'red';
            //context.strokeRect(this.x, this.y, this.width, this.width);

            //

            context.beginPath();
            // context.roundRect(
            //     this.x,
            //     this.y,
            //     this.width,
            //     this.height,
            //     this.health
            // );

            context.stroke();

            context.fillStyle = this.fillColor;
            context.fillRect(this.x, this.y, this.width, this.width);
            context.fill();

            context.fillStyle = 'white';
            context.font = '20px Tahoma';
            context.fillText(
                `${this.health}`.padStart(3, ' ').padEnd(3, ' '),
                this.x + this.width * 0.2,
                this.y + this.width * 0.6
            );
        }

        this.fillColor = this.isEnergetic ? 'brown' : 'salmon';
    }

    update() {
        if (!this.IsCollidedWithPlayer) {
            if (this.isEnergetic) {
                this.vx = this.dir;
                this.vy = 2;
            } else {
                this.vy = 1;
            }
        }

        // this.vx = getRand(-1, 2);

        this.x += this.vx;
        if (this.x < 0) this.x = 0;
        else if (this.x + this.width > this.gameWidth)
            this.x = this.gameWidth - this.width;

        this.y += this.vy;

        if (this.y > this.gameHeight) this.markedAsDeleted = true;

        this.width = Math.max(50, 100 - this.health);
    }

    takeDamage(val) {
        this.health -= val;

        this.fillColor = 'aqua';
    }

    isOutOfScreen() {
        return this.y + this.height >= this.gameHeight;
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

const getRand = function (startInc, endInc) {
    return Math.trunc(Math.random() * (endInc - startInc)) + startInc;
};

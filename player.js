import Bullet from './bullet.js';

export default class Player {
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        this.width = 50;
        this.height = 50;

        this.bullets = [];

        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height * 2;

        this.vx = 0;
        this.vy = 0;

        this.score = 0;

        this.health = 100;
        this.maxHealth = 100;

        this.kills = 0;

        this.speed = 1;
        this.maxSpeed = 10;

        this.bulletDamage = 5;
        this.bulletMaxDamage = 50;
        this.bulletDelay = 10;

        this.timerTillNextBullet = 0;
    }

    draw(context) {
        // context.strokeStyle = 'lime';
        let green = Math.round((this.health * 255) / this.maxHealth);
        context.strokeStyle = `rgb(0,${green},0)`;
        context.strokeRect(this.x, this.y, this.width, this.height);

        context.fillStyle = `rgb(0,${green},0)`;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(input) {
        if (input.keys.has('ArrowLeft') || input.keys.has('swipe left'))
            this.vx = -6;
        else if (input.keys.has('ArrowRight') || input.keys.has('swipe right'))
            this.vx = 6;
        else
            this.vx =
                this.vx > 0
                    ? Math.max(0, this.vx - 0.05)
                    : Math.min(0, this.vx + 0.05);

        if (input.keys.has('ArrowUp') || input.keys.has('swipe up'))
            this.vy = -6;
        else if (input.keys.has('ArrowDown') || input.keys.has('swipe down'))
            this.vy = 6;
        else
            this.vy =
                this.vy > 0
                    ? Math.max(0, this.vy - 0.05)
                    : Math.min(0, this.vy + 0.05);

        if (input.keys.has(' ') || input.keys.has('swipe touched')) {
            if (this.timerTillNextBullet <= 0) {
                const blt = new Bullet(this.gameWidth, this.gameHeight, this);
                this.bullets.push(blt);
                this.timerTillNextBullet = this.bulletDelay;
            }

            this.timerTillNextBullet--;
        }

        this.speed = Math.round(this.score / 10000) + 1;

        this.x += this.speed * this.vx;
        if (this.x > this.gameWidth - this.width)
            this.x = this.gameWidth - this.width;
        else if (this.x < 0) this.x = 0;

        this.y += this.speed * this.vy;
        if (this.y > this.gameHeight - this.height)
            this.y = this.gameHeight - this.height;
        else if (this.y < this.gameHeight / 2) this.y = this.gameHeight / 2;

        this.bulletDamage = Math.min(
            this.bulletMaxDamage,
            5 * (Math.round(this.score / 5000) + 1)
        );

        this.bulletDelay = Math.max(3, 10 - Math.round(this.score / 5000));
        // this.maxHealth = 100 * (1 + Math.round(this.score / 5000));
        // this.health = Math.min(this.health, this.maxHealth);
    }

    takeDamage(val) {
        this.health -= val;
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

import Enemy from './enemy.js';
import InputHandler from './inputHandler.js';
import Player from './player.js';

let ENEMY_AT_MAX = 5;

function start() {
    const canvas = document.getElementById('canvas1');

    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 700;

    let gameLevel = 1;
    let player = new Player(canvas.width, canvas.height);
    let input = new InputHandler();
    let enemies = [];
    let gameOver = false;

    let enemyDelay = 500;
    let timerTillNextEnemy = 0;

    function setCommonStyles(context) {
        context.shadowColor = '#d53';
        context.shadowBlur = 20;
        context.lineJoin = 'bevel';
        context.lineWidth = 5;
    }

    function displayGameOverStats(context) {
        context.font = '32px Tahoma';
        context.fillStyle = 'salmon';
        context.fillText(
            `GAME OVER!`,
            canvas.width * 0.31,
            canvas.height * 0.2
        );

        context.fillText(
            `Your Score is ${player.score}!`,
            canvas.width * 0.27,
            canvas.height * 0.3
        );
    }

    function displayStatusText(context) {
        context.font = '12px Tahoma';
        context.fillStyle = 'lime';
        context.fillText(
            `Level: ${gameLevel}\n
            \n
            Enemies: ${enemies.length}\n
             \n
            Score: ${player.score}\n
            `,
            16,
            16
        );

        context.fillText(
            `Health: ${player.health} / ${player.maxHealth}\n
            Damage: ${player.bulletDamage} / ${player.bulletMaxDamage}\n
            Speed: ${player.speed} /  ${player.maxSpeed}\n
            Kills: ${player.kills}\n
            `,
            16,
            canvas.height - 16
        );
    }

    function gameLoop() {
        setCommonStyles(ctx);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        player.draw(ctx);
        player.update(input);

        if (enemies.length < ENEMY_AT_MAX) {
            const en = new Enemy(canvas.width, canvas.height, gameLevel);
            enemies.push(en);
        }

        enemies.forEach(ene => {
            if (gameOver == false) {
                // // player can stand against an enemy
                // if (player.hasCollision(ene)) {
                //     console.log('Collision');
                //     ene.IsCollidedWithPlayer = true;
                //     ene.vy = 0;
                // }

                // enemy gives some damage to the player
                if (ene.markedAsDeleted == false && ene.isOutOfScreen()) {
                    player.takeDamage(ene.health);

                    if (player.health <= 0) {
                        gameOver = true;
                        displayGameOverStats(ctx);
                    }
                    ene.markedAsDeleted = true;
                }

                // enemy vs player bullets
                player.bullets.forEach(b => {
                    if (b.hasCollision(ene)) {
                        b.hitTheEnemy = true;
                        ene.takeDamage(b.damage);

                        // enemy down
                        if (ene.health <= 0) {
                            ene.markedAsDeleted = true;
                            b.markedAsDeleted = true;
                            player.kills++;
                            player.health++;
                            player.score += 100;
                        }

                        player.score +=
                            ene.health < player.bulletDamage
                                ? Math.min(ene.health, player.bulletDamage)
                                : player.bulletDamage;
                    }

                    enemies = enemies.filter(e => e.health > 0);

                    b.draw(ctx);
                    b.update(enemies);
                });

                // Remove out of screen bullets
                player.bullets = player.bullets.filter(
                    b => !b.markedAsDeleted && !b.hitTheEnemy
                );

                // draw & update enemy
                ene.draw(ctx);
                ene.update();
            }
        });

        enemies = enemies.filter(e => !e.markedAsDeleted && !e.hitByTheBullet);

        gameLevel = 1 + Math.round(player.score / 5000);
        ENEMY_AT_MAX = 5 * gameLevel;

        displayStatusText(ctx);

        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            displayGameOverStats(ctx);
        }
    }

    gameLoop();
}

start();

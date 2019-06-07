// Javascript file

// Constants
const cHeight = 450;
const cWidth = 650;
const framRte = 60;

function Player(hp, x, y) {

    this.alive = true;
    this.hp = hp;
    this.x = x;
    this.y = y;

    this.delayedshoot = false;
    this.kills = 0;
}

function Bullet(x, y, x2, y2, speed) {
    this.alive = true;
    this.x = x;
    this.y = y;
    this.speed = speed;
    // calculation
    this.angle = Math.atan2(y2 -y, x2 - x);
    this.accelX = Math.cos(this.angle);
    this.accelY = Math.sin(this.angle);

    this.move = function() {
        this.x += this.accelX * this.speed;
        this.y += this.accelY * this.speed;
    }

    // collision
    if (this.x > cWidth || this.x < 0 || this.y > cHeight || this.y < 0) {
        this.alive = false;
    }
}

function setup() {

    let canvas = createCanvas(cWidth, cHeight);
    canvas.parent("#canvasCore");

    // player creation
    player = new Player(3, 50, height/2);
    bullets = new Array();
    enemies = new Array;

    enemySpawn = setInterval(function() {enemies.push(new Enemy(3))}, 900);


    frameRate(framRte);
}

function Enemy(speed) {
    this.alive = true;
    this.x = cWidth;
    this.y = Math.floor(Math.random() * (cHeight + 1));

    this.hp = 5;
    this.speed = speed;
    this.angle = Math.atan2(player.y - this.y, player.x- this.x);
    this.accelX = Math.cos(this.angle);
    this.accelY = Math.sin(this.angle);

    this.move = function() {
        this.x += this.accelX;
        this.y += this.accelY;

        if (this.x < player.x + 20) {
            this.alive = false;
            player.hp --;

            if (player.hp <= 0) {
                var r = confirm("You died and the Kangz took over (Total Kills: " + player.kills + ")" + " \n Press ok to try again.");

            if (r == true) {
                location.reload();
                }
                else {
                    window.location.replace("https://www.youtube.com/watch?v=f2JDto0KSr0");
                }

               
            }

        }

        //bullet collision
        for (let i = 0; i < bullets.length; i++) {
            let c1c2 = Math.sqrt(Math.pow(this.x - bullets[i].x, 2) + Math.pow(this.y - bullets[i].y, 2));

            if (c1c2 <= 25) { // bullet radius = 5, enemy radius = 20
                this.hp --;
                bullets.splice(i, 1);
                if (this.hp <= 0) {
                    this.alive = false;
                    player.kills ++;
                }
            }
        }
    }
}


function eventHandler(){

    if (isKeyPressed) {
        if (!player.delayedshoot) {
        bullets.push(new Bullet(player.x, player.y, mouseX, mouseY, 5));
        player.delayedshoot = true;
        setTimeout(function() {player.delayedshoot = false;}, 90);
    }
    }
}

function draw() {
clear();
document.body.style.backgroundImage = "url('pyramid_PNG35.png')";
document.body.style.backgroundRepeat = "no-repeat";
document.body.style.backgroundPosition = "top";



//player
strokeWeight(3);
stroke("black");
fill("white");
circle(player.x, player.y, 30);
fill("orange");
text(player.hp , player.x -10, player.y + 5);


for (let i = 0; i < bullets.length; i++) {
    if (bullets[i].alive) {
        circle(bullets[i].x, bullets[i].y, 5);
        bullets[i].move();
    } else {
        bullets.splice(i, 1);
        
    }
}

// enemies
stroke("purple");
fill("black");
for(let i =0; i < enemies.length; i++) {
    if (!enemies[i].alive) {
        enemies.splice(i, 1);
        
    } else {
        enemies[i].move();
        fill("black");
        circle(enemies[i].x, enemies[i].y, 30);
        fill("white");
        text(enemies[i].hp , enemies[i].x-10, enemies[i].y+5);
        
    }
}
fill("white");
textSize(25);
text("Kangs killed " + player.kills, 50, cHeight - 400);

eventHandler();
}
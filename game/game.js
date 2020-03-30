let canvas = document.getElementById('mainCanvas');
let ctx = canvas.getContext('2d');
let pause_now = false;

ctx.fillStyle = "#0ff";

let a = 5;
let ship = new Image();
ship.src = "game-media/Spaceship3.jpg";
let scale = 8;
ship.width = 15 * scale;
ship.height = 10 * scale;
let ship_x = (canvas.width - ship.width) / 2;
let ship_y = canvas.height - ship.height;
let ship_x_velocity = 0;
let ship_y_velocity = 0;
let ship_jump = false;
let ship_life = 3;
let points = 0;
let start_moment = 0, timer = 0;
let screen_points = document.getElementById('score');
let screen_time = document.getElementById('time');
let bonus_life_time = 0;
let miron_mad = false; let miron_mad_count = 0;
let bullets = [], bullet_time = 0, bullet_speed = 10 * (11 - scale);

function Bullet(x, y, direction){
	this.x = x;
	this.y = y;
	this.direction = direction;
	this.bullet = document.createElement('img');

	if(direction == 'left')

		this.bullet.src = 'game-media/bulletLeft.png';

	else if(direction == 'up')

		this.bullet.src = 'game-media/bulletUp.png';

	else if(direction == 'right')

		this.bullet.src = 'game-media/bulletRight.png';

	else

		this.bullet.src = 'game-media/bulletDown.png';
}

let bullet_control = function(keyPressed){

	let date = new Date();
	let current_time = date.getTime();

	if(current_time - bullet_time < 100)

		return;

	bullet_time = current_time;

	let bulletSound = document.createElement('audio');
	bulletSound.src = 'game-media/bullet.mp3';
	bulletSound.play();

	if(keyPressed.keyCode == 39)

		bullets.push(new Bullet(ship_x + ship.width, ship_y + (ship.height - 5) / 2, 'right'));

	else if(keyPressed.keyCode == 38)

		bullets.push(new Bullet(ship_x + (ship.width - 5) / 2, ship_y - 10, 'up'));

	else if(keyPressed.keyCode == 37)

		bullets.push(new Bullet(ship_x - 10, ship_y + (ship.height - 5) / 2, 'left'));

	else

		bullets.push(new Bullet(ship_x + (ship.width - 5) / 2, ship_y + ship.height, 'down'));
}

let play = false;
let mainAudio = document.createElement("audio");
mainAudio.src = "game-media/gameMusic.mp3";

let playSong = function(){

	play = !play;

	if(play){
		let soundImg = document.getElementById('soundImg');
		soundImg.src = 'game-media/soundOn.png';
		mainAudio.play();
		mainAudio.loop = 'infinite';
	}

	else{
		let soundImg = document.getElementById('soundImg');
		soundImg.src = 'game-media/soundOff.png';
		mainAudio.pause();
	}
}

let checkStatus = function(){

	let heart1 = document.getElementById('heart1');
	let heart2 = document.getElementById('heart2');
	let heart3 = document.getElementById('heart3');

	if(ship_life == 3)

		heart1.src = heart2.src = heart3.src = 'game-media/heart.jpg';

	else if(ship_life == 2){

		heart1.src = heart2.src = 'game-media/heart.jpg';
		heart3.src = 'game-media/heartLow.jpg';
	}

	else if(ship_life == 1){

		heart1.src = 'game-media/heart.jpg';
		heart2.src = heart3.src = 'game-media/heartLow.jpg';
	}

	else{
		let game_over = document.createElement("audio");
		game_over.src = "game-media/final_sound.mp3";
		heart1.src = heart2.src = heart3.src = 'game-media/heartLow.jpg';
		game_over.play();
		setTimeout(function(){window.location = 'game-over/game-over.html';}, 2000);
		pause_now = true;
	}
}

let drawS = function(){
	ship.onload = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(ship, ship_x, ship_y, ship.width, ship.height);
	}
}

let draw = function (){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(ship, ship_x, ship_y, ship.width, ship.height);
}

let controller = {

	up: false,
	down: false,
	left: false,
	right: false,
	shoot_up: false,
	shoot_left: false,
	shoot_right: false,
	shoot_down: false,

	keyListener: function(event){

		if(!play)
			playSong();

		let keyState = (event.type == 'keydown')?true:false;

		if(keyState == true && 37 <= event.keyCode && event.keyCode <= 40)

			bullet_control(event);

		else if(keyState == true && event.keyCode == 27)

			Pause();

		else{

			switch(event.keyCode) {

			    case 65:   
				    controller.left = keyState;
				 break;
			      
			    case 87:
			        controller.up = keyState;
			    break;
			      
			    case 68:
			        controller.right = keyState;
			    break;

			    case 83:
			    	controller.down = keyState;

			    case 37:
			        controller.shoot_right = keyState;
			    break;

			    case 38:
			        controller.shoot_up = keyState;
			    break;

			    case 39:
			        controller.shoot_left = keyState;
			    break;

			    case 40:
			    	controller.shoot_down = keyState;
			    break;
	    	}
	    }
	}
};

let audioJump = function(){
		let audio = document.createElement("audio");
		audio.src = "game-media/jump.mp3";
		audio.play();
}

let shipMovement = function(){

	window.addEventListener('keydown', controller.keyListener);
	window.addEventListener('keyup', controller.keyListener);

	if(controller.up && !ship_jump){

		audioJump();
		ship_y_velocity -= 9;
		ship_jump = true;
	}

	if(controller.down)

		ship_y_velocity += 1;

	if(controller.left)

		ship_x_velocity -= 0.5;

	if(controller.right)

		ship_x_velocity += 0.5;

	if(ship_y < canvas.height - ship.height)

		ship_y_velocity += 0.5;

	if(0 >= ship_x + ship_x_velocity){

		ship_x = 0;
		ship_x_velocity = 0;
	}

	if(ship_x + ship_x_velocity + ship.width >= canvas.width){

		ship_x = canvas.width - ship.width;
		ship_x_velocity = 0;
	}

	else

		ship_x += ship_x_velocity * scale / 5;

	ship_y += ship_y_velocity * scale / 5;
	ship_x_velocity *= 0.9;

	if(ship_y > canvas.height - ship.height){

		ship_jump = false;
		ship_y = canvas.height - ship.height;
		ship_y_velocity = 0;
	}
}

let enemies = [], enemy_time = 1000, enemy_lastTime = 0;

let Enemy = function(x, y, type, speed, attack_delay, bullet_speed, size){
	this.x = x;
	this.y = y;
	this.type = type; 
	this.speed = speed * (10 - scale);
	this.size = size;

	if(type == 'shooter'){
		this.speed = speed;
		this.attack_delay = attack_delay;
		this.bullet_speed = bullet_speed * (11 - scale);
		this.last_attack = 0;
		this.bullets = [];
	}

	this.enemy = document.createElement('img');
	this.enemy.style.width = this.enemy.style.height = size + 'px';
	this.enemy.src = 'game-media/Enemy/' + Math.round(Math.random() * 34 + 1) + '.png';
	this.enemy.id = type;
}

let enemyBullet = function(x, y, speed){
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.bullet = document.createElement('img');
	this.bullet.src = 'game-media/EnemyBullet.png';
	this.bullet.width = this.bullet.width * scale;
	this.bullet.height = this.bullet.height * scale;
	this.bullet.id = 'enemyBullet';
}

let Enemy_generator = function(){

	let date = new Date();
	let current_time = date.getTime();
	
	if(current_time - enemy_lastTime < enemy_time)

		return;

	enemy_lastTime = current_time;

	let type = Math.round(Math.random() * 5 + 1);
	let speed = Math.round(Math.random() + 2);
	let size = (2 - speed + 3) * 4 * scale;
	let poz = (canvas.width - ship.width - ship_x <= ship.x) ? (0 - size) : canvas.width;

	if(type == 1 || type == 2)

		enemies.push(new Enemy(poz, canvas.height - size, 'runner', speed, 0, 0, size));		

	else if(type == 3){

		let attack_delay = Math.round(Math.random() * 500 + 250);
		let bullet_speed = 10 - attack_delay / 100;
		enemies.push(new Enemy(poz, 0, 'shooter', speed, attack_delay, bullet_speed, size));	
	}

	else{

		let x = Math.round(Math.random() * 3) + 1;

		if(x == 1)

			enemies.push(new Enemy(0 - size, Math.round(Math.random() * canvas.height - size), 'flyer', speed, 0, 0, size));

		else if(x == 2 || x == 3)

			enemies.push(new Enemy(Math.round(Math.random() * (canvas.width - 60) + 30), 0 - size, 'flyer', speed, 0, 0, size));
			
		else

			enemies.push(new Enemy(canvas.width, Math.round(Math.random() * canvas.height - size), 'flyer', speed, 0, 0, size));
	}
}

let Enemy_update = function(){

	let i = 0;

	while(i < enemies.length){

		if(((enemies[i].x <= ship_x + a && enemies[i].x + enemies[i].speed + enemies[i].size >= ship_x + a) || (enemies[i].x + enemies[i].size >= ship_x + ship.width - a && enemies[i].x - enemies[i].speed <= ship_x + ship.width - a) || (ship_x + a <= enemies[i].x && enemies[i].x <= ship_x + ship.width - a) || (ship_x + a <= enemies[i].x + enemies[i].size && enemies[i].x + enemies[i].size <= ship_x + ship.width - a)) && ((enemies[i].y <= ship_y + a && enemies[i].y + enemies[i].size + enemies[i].speed >= ship_y + a) || (enemies[i].y + enemies[i].size >= ship_y + ship.height - a && enemies[i].y - enemies[i].speed <= ship_y + ship.height - a) || (ship_y + a <= enemies[i].y && enemies[i].y <= ship_y + ship.height - a) || (ship_y + a <= enemies[i].y + enemies[i].size && enemies[i].y + enemies[i].size <= ship_y + ship.height - a))){
			if(ship_life > 0 && !miron_mad){
				ship_life--;
				let audioMad = document.createElement("audio");
				audioMad.src = "game-media/damageAudio.mp3";
				audioMad.play();
				miron_mad = true;
			}

				enemies.splice(i, 1);
		}

		else{

			let j = 0, ok = true;

			while(j < bullets.length){

				if((bullets[j].direction == 'up' || bullets[j].direction == 'down') && ((enemies[i].x <= bullets[j].x + a && enemies[i].x + enemies[i].speed + enemies[i].size >= bullets[j].x + a) || (enemies[i].x + enemies[i].size >= bullets[j].x + 5 - a && enemies[i].x - enemies[i].speed <= bullets[j].x + 5 - a) || (bullets[j].x + a <= enemies[i].x && enemies[i].x <= bullets[j].x + 5 - a) || (bullets[j].x + a <= enemies[i].x + enemies[i].size && enemies[i].x + enemies[i].size <= bullets[j].x + 5 - a)) && ((enemies[i].y <= bullets[j].y + a && enemies[i].y + enemies[i].size + enemies[i].speed >= bullets[j].y + a) || (enemies[i].y + enemies[i].size >= bullets[j].y + 10 - a && enemies[i].y - enemies[i].speed <= bullets[j].y + 10 - a) || (bullets[j].y + a <= enemies[i].y && enemies[i].y <= bullets[j].y + 10 - a) || (bullets[j].y + a <= enemies[i].y + enemies[i].size && enemies[i].y + enemies[i].size <= bullets[j].y + 10 - a))){
					bullets.splice(j, 1);
					enemies.splice(i, 1);
					points += 1; ok = false;
					screen_points.textContent = 'Score: ' + points;
					break;
				}

				else if((bullets[j].direction == 'left' || bullets[j].direction == 'right') && ((enemies[i].x <= bullets[j].x + a && enemies[i].x + enemies[i].speed + enemies[i].size >= bullets[j].x + a) || (enemies[i].x + enemies[i].size >= bullets[j].x + 10 - a && enemies[i].x - enemies[i].speed <= bullets[j].x + 10 - a) || (bullets[j].x + a <= enemies[i].x && enemies[i].x <= bullets[j].x + 10 - a) || (bullets[j].x + a <= enemies[i].x + enemies[i].size && enemies[i].x + enemies[i].size <= bullets[j].x + 10 - a)) && ((enemies[i].y <= bullets[j].y + a && enemies[i].y + enemies[i].size + enemies[i].speed >= bullets[j].y + a) || (enemies[i].y + enemies[i].size >= bullets[j].y + 5 - a && enemies[i].y - enemies[i].speed <= bullets[j].y + 5 - a) || (bullets[j].y + a <= enemies[i].y && enemies[i].y <= bullets[j].y + 5 - a) || (bullets[j].y + a <= enemies[i].y + enemies[i].size && enemies[i].y + enemies[i].size <= bullets[j].y + 5 - a))){
					bullets.splice(j, 1);
					enemies.splice(i, 1);
					points += 1; ok = false;
					screen_points.textContent = 'Score: ' + points;
					break;
				}

				j++;
			}

			if(ok){

				if(enemies[i].type == 'runner' || enemies[i].type == 'shooter'){
					
					if(enemies[i].x + enemies[i].size / 2 < ship_x + ship.width / 2 && enemies[i].x + enemies[i].speed + enemies[i].size / 2 < ship_x + ship.width / 2)
						enemies[i].x += enemies[i].speed;

					else if(enemies[i].x + enemies[i].size / 2 > ship_x + ship.width / 2 && enemies[i].x - enemies[i].speed + enemies[i].size / 2 > ship_x + ship.width / 2)
						enemies[i].x -= enemies[i].speed;

					if(enemies[i].type == 'shooter'){

						let j = 0;

						while(j < enemies[i].bullets.length){

							let x = enemies[i].bullets[j].x, y = enemies[i].bullets[j].y, speed = enemies[i].bullets[j].speed;

							if(((x <= ship_x + a && x + 5 >= ship_x + a) || (x + 5 >= ship_x + ship.width - a && x <= ship_x + ship.width - a) || (ship_x + a <= x && x <= ship_x + ship.width - a) || (ship_x + a <= x + 5 && x + 5 <= ship_x + ship.width - a)) && ((y <= ship_y + a && y + 5 + speed >= ship_y + a) || (y + 5 >= ship_y + ship.height - a && y - speed <= ship_y + ship.height - a) || (ship_y + a <= y && y <= ship_y + ship.height - a) || (ship_y + a <= y + 5 && y + 5 <= ship_y + ship.height - a))){
								enemies[i].bullets.splice(j, 1);
								if(ship_life > 0 && !miron_mad){
									let audioMad = document.createElement("audio");
									audioMad.src = "game-media/damageAudio.mp3";
									audioMad.play();
									miron_mad = true;
									ship_life--;
								}
							}

							else if(y > canvas.height)
								enemies[i].bullets.splice(j, 1);

							else{
								enemies[i].bullets[j].y += enemies[i].bullets[j].speed;
								ctx.drawImage(enemies[i].bullets[j].bullet, enemies[i].bullets[j].x, enemies[i].bullets[j].y, 5, 5);
								j++;
							}
						}

						let date = new Date();
						let current_bulletTime = date.getTime();

						if(current_bulletTime - enemies[i].last_attack >= enemies[i].attack_delay){

							enemies[i].last_attack = current_bulletTime;
							enemies[i].bullets.push(new enemyBullet(enemies[i].x + (enemies[i].size - 5) / 2, enemies[i].y + enemies[i].size, enemies[i].bullet_speed));
						}
					}
				}

				else{

					let x = ship_x + ship.width / 2, y = ship_y + ship.height / 2, x1 = enemies[i].x + enemies[i].size / 2, y1 = enemies[i].y + enemies[i].size / 2, x2 = 'undefined', y2;

					if(enemies[i].x + enemies[i].size / 2 <= x && enemies[i].y + enemies[i].size / 2 <= y){

						if(x - enemies[i].x - enemies[i].size >= y - enemies[i].y - enemies[i].size){
							enemies[i].x += enemies[i].speed;
							x2 = enemies[i].x + enemies[i].size / 2;
						}

						else{
							enemies[i].y += enemies[i].speed;
							y2 = enemies[i].y + enemies[i].size / 2;
						}
					}

					else if(enemies[i].x + enemies[i].size / 2 >= x && enemies[i].y + enemies[i].size / 2 <= y){

						if(enemies[i].x - x >= y - enemies[i].y - enemies[i].size){
							enemies[i].x -= enemies[i].speed;
							x2 = enemies[i].x + enemies[i].size / 2;
						}

						else{
							enemies[i].y += enemies[i].speed;
							y2 = enemies[i].y + enemies[i].size / 2;
						}
					}

					else if(enemies[i].x + enemies[i].size / 2 <= x && enemies[i].y + enemies[i].size / 2 >= y){

						if(x - enemies[i].x - enemies[i].size >= enemies[i].y - y){
							enemies[i].x += enemies[i].speed;
							x2 = enemies[i].x + enemies[i].size / 2;
						}

						else{
							enemies[i].y -= enemies[i].speed;
							y2 = enemies[i].y + enemies[i].size / 2;
						}
					}

					else{
						if(enemies[i].x - x >= enemies[i].y - y){
							enemies[i].x -= enemies[i].speed;
							x2 = enemies[i].x + enemies[i].size / 2;
						}

						else{
							enemies[i].y -= enemies[i].speed;
							y2 = enemies[i].y + enemies[i].size / 2;
						}
					}

					if(x2 == 'undefined'){
						x2 = x - (y - y2)/(y - y1)*(x - x1);
						enemies[i].x = x2 - enemies[i].size / 2;
					}

					else{
						y2 = y - (y - y1)/(x - x1)*(x - x2);
						enemies[i].y = y2 - enemies[i].size / 2;
					}
				}

				ctx.drawImage(enemies[i].enemy, enemies[i].x, enemies[i].y, enemies[i].size, enemies[i].size);

				i++;
			}
		}
	}

	Enemy_generator();
}

let update = function(){

	draw();

	let i = 0;

	while(i < bullets.length){

		if(bullets[i].x < -10 || bullets[i].y < -10 || bullets[i].x > canvas.width)

			bullets.splice(i, 1);

		else{

			if(bullets[i].direction == 'left'){
				ctx.drawImage(bullets[i].bullet, bullets[i].x, bullets[i].y, 10, 5);
				bullets[i].x -= bullet_speed;
			 	bullets[i].bullet.style.left = bullets[i].x + 'px';
			}

			else if(bullets[i].direction == 'up'){
				ctx.drawImage(bullets[i].bullet, bullets[i].x, bullets[i].y, 5, 10);
				bullets[i].y -= bullet_speed;
				bullets[i].bullet.style.top = bullets[i].y + 'px';
			}
			else if(bullets[i].direction == 'right'){
				ctx.drawImage(bullets[i].bullet, bullets[i].x, bullets[i].y, 10, 5);
				bullets[i].x += bullet_speed;
				bullets[i].bullet.style.left = bullets[i].x + 'px';
			}	

			else{
				ctx.drawImage(bullets[i].bullet, bullets[i].x, bullets[i].y, 5, 10);
				bullets[i].y += bullet_speed;
				bullets[i].bullet.style.top = bullets[i].y + 'px';
			}

			i++;
		}
	}
}

let checkMiron = function(){

	let curDate = new Date();
	let curTime = curDate.getTime();

	if(miron_mad == false){

		ship.src = "game-media/Spaceship3.jpg";
		miron_mad_count = curTime;
	}

	else{

		ship.src = 'game-media/shipMad.jpg';
		
		if(curTime - miron_mad_count > 2000)
			
			miron_mad = false;
	}
}

let gameLoop = function(){

	let current_date = new Date();
	let pass_time = current_date.getTime();

	if(start_moment == 0)

		bonus_life_time = timer = start_moment = pass_time;

	else if(pass_time - start_moment > 10000){
		enemy_time -= 50;
		start_moment = pass_time;
	}

	if(pass_time - bonus_life_time >= 10000){

		if(ship_life < 3)
			ship_life++;
		
		bonus_life_time = pass_time;
		let bonusAudio = document.createElement('audio');
		bonusAudio.src = 'game-media/bonusAudio.mp3';
		bonusAudio.play();
	}

	screen_time.textContent = 'Time: ' + Math.floor((pass_time - timer) / 1000) + 's';

	checkMiron();

	shipMovement();

	update();

	Enemy_update();

	checkStatus();

	if(!pause_now)

		window.requestAnimationFrame(gameLoop);
}

gameLoop();

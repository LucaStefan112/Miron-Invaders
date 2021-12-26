let play = false;
let mainAudio = document.createElement("audio");
mainAudio.src = "media/main.mp3";

//Fade effect for changing windows:
function Fade(){
	let fade = document.createElement('div');
	let body = document.getElementById('body');
	body.appendChild(fade);
	fade.id = 'box';
}
				
function playAudio(){
	let audio = document.createElement("audio");
	audio.src = "media/start.mp3";
	audio.play();
	setTimeout(function(){window.location = 'game/game.html';}, 2000);
}

//Background sound:
let playSong = function(){

	play = !play;

	if(play){
		let soundImg = document.getElementById('soundImg');
		soundImg.src = 'media/soundOn.png';
		mainAudio.play();
		mainAudio.loop = 'infinite';
	}

	else{
		let soundImg = document.getElementById('soundImg');
		soundImg.src = 'media/soundOff.png';
		mainAudio.pause();
	}
}

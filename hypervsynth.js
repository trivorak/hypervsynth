var audioCtx = new (window.AudioContext || window.webkitAudioContext);

var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
var osc4 = audioCtx.createOscillator();
var lowpass = audioCtx.createBiquadFilter();
var synthmixer = audioCtx.createGain();
var volume = audioCtx.createGain();

synthmixer.connect(lowpass);
lowpass.connect(volume);
volume.connect(audioCtx.destination);

synthmixer.gain.value = 0.15;

//Spin up Oscillators
osc1.frequency.value = getRandomBetween(110,600);
osc1.type = "sine";
osc1.detune = 0;
osc1.start();
osc1.connect(synthmixer);

osc2.frequency.value = getRandomBetween(110,600);
osc2.type = "sine";
osc2.detune = 200;
osc2.start();
osc2.connect(synthmixer);

osc3.frequency.value = getRandomBetween(110,600);
osc3.type = "sine";
osc3.detune = 300;
osc3.start();
osc3.connect(synthmixer);

osc4.frequency.value = getRandomBetween(110,600);
osc4.type = "sine";
osc4.detune = 400;
osc4.start();
osc4.connect(synthmixer);

//Adjust Filter Parameters
lowpass.type = "lowpass";
lowpass.frequency.value = (osc1.frequency.value + osc2.frequency.value + osc3.frequency.value + osc4.frequency.value)/4/2

function getRandomBetween(min,max){
	return Math.random()*(max-min)+min;
}

function setRandomNotes(min,max){
	osc1.frequency.value = getRandomBetween(min,max);
	osc2.frequency.value = getRandomBetween(min,max);
	osc3.frequency.value = getRandomBetween(min,max);
	osc4.frequency.value = getRandomBetween(min,max);
}

function setFilterHalfWay(){
	lowpass.frequency.value = (osc1.frequency.value + osc2.frequency.value + osc3.frequency.value + osc4.frequency.value)/4/2
}

function newNotes(min,max) {
	setRandomNotes(min,max);
	setFilterHalfWay();
}
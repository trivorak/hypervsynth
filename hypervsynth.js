var audioCtx = new (window.AudioContext || window.webkitAudioContext);


var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
var osc4 = audioCtx.createOscillator();
var lowpass = audioCtx.createBiquadFilter();
var synthmixer = audioCtx.createGain();
var volume = audioCtx.createGain();

//Delay Module
var delay = audioCtx.createDelay();
var fbLowpass = audioCtx.createBiquadFilter();
var fbGain = audioCtx.createGain();
var delayGain = audioCtx.createGain();
var dryGain = audioCtx.createGain();
var delayInput = audioCtx.createGain();
var delayOutput = audioCtx.createGain();
//Connect Delay Chain Main
delayInput.connect(delay);
delay.connect(delayGain);
delayGain.connect(delayOutput);
//FeedbackLoop
delay.connect(fbLowpass);
fbLowpass.connect(fbGain);
fbGain.connect(delay);
//Dry Thru
delayInput.connect(dryGain);
dryGain.connect(delayOutput)


//Conect Modules
synthmixer.connect(lowpass);
lowpass.connect(delayInput);
delayOutput.connect(volume);
volume.connect(audioCtx.destination);


//Set Defaults
synthmixer.gain.value = 0.15;
delayGain.gain.value = 0.5;
dryGain.gain.value = 0.5;
fbGain.gain.value = 0.75;
delay.delayTime.value = 0.400;
fbLowpass.type = "lowpass";
fbLowpass.frequency.value = 250;

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
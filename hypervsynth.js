var audioCtx = new (window.AudioContext || window.webkitAudioContext);


var osc1 = audioCtx.createOscillator();
var osc2 = audioCtx.createOscillator();
var osc3 = audioCtx.createOscillator();
var osc4 = audioCtx.createOscillator();
var subOsc = audioCtx.createOscillator();
var lowpass = audioCtx.createBiquadFilter();
var synthmixer = audioCtx.createGain();
var volume = audioCtx.createGain();

//Create Oscillator Array for cleaner controll
var osc = [osc1, osc2, osc3, osc4];

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
osc.forEach(element => element.connect(synthmixer));
subOsc.connect(synthmixer);
synthmixer.connect(lowpass);
lowpass.connect(delayInput);
delayOutput.connect(volume);
volume.connect(audioCtx.destination);


//Set Defaults
synthmixer.gain.value = 0.15;
setDelayWet(0.5);
fbGain.gain.value = 0.65;
delay.delayTime.value = 0.400;
fbLowpass.type = "lowpass";
fbLowpass.frequency.value = 250;
lowpass.type = "lowpass";
lowpass.frequency.value = (osc1.frequency.value + osc2.frequency.value + osc3.frequency.value + osc4.frequency.value)/4/2


//Spin up Oscillators
osc.forEach(element => element.frequency.value = getRandomBetween(110,600));
osc.forEach(element => element.type = "sine");
osc.forEach(element => element.detune.value = getRandomBetween(-1000,1000));
osc.forEach(element => element.start());
subOsc.frequency.value = setSubOsc();
subOsc.type = "square";
subOsc.start();



//Utility Functions
//----------------------------------------------------------
//Random Number between a min and max 
function getRandomBetween(min,max){
	return Math.random()*(max-min)+min;
}


//Oscillator Functions
//----------------------------------------------------------
//Change Oscillators to a new set of Frequencies (Random)
function newNotes(min,max) {
	setRandomNotes(min,max);
	setFilterHalfWay();
	setSubOsc();
}

// Random Notes Function affect all in osc array
function setRandomNotes(min,max){
	osc.forEach(element => element.frequency.value = getRandomBetween(min,max));
}

function setSubOsc(){
	subOsc.frequency.value = (osc[0].frequency.value + osc[1].frequency.value + osc[2].frequency.value + osc[3].frequency.value)/4/2
}

//Filter Functions
//----------------------------------------------------------
//Set Cutoff Freq of Lowpass at Average(osc frequencies) / 2
function setFilterHalfWay(){
	lowpass.frequency.value = (osc1.frequency.value + osc2.frequency.value + osc3.frequency.value + osc4.frequency.value)/4/2
}


//Delay Function
//----------------------------------------------------------
//Set Delay Wet&Dry Mix
function setDelayWet(wetValue){
	if (wetValue > 1) {
		wetValue = 1;
	} 
	if (wetValue < 0) {
		wetValue = 0;
	}
	delayGain.gain.value = wetValue;
	dryGain.gain.value = 1 - wetValue;
}


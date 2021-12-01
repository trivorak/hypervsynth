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
var delayModOsc = audioCtx.createOscillator();
var delayModGain = audioCtx.createGain();

// Connect Delay Chain Main
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

// Reverb Unit

// Init Modules
var reverbInput = audioCtx.createGain();
var reDelayL1 = audioCtx.createDelay();
var reDelayL2 = audioCtx.createDelay();
var reDelay1Gain = audioCtx.createGain();
var reDelay2Gain = audioCtx.createGain();
var reFeedback1Gain = audioCtx.createGain();
var reFeedback2Gain = audioCtx.createGain();
var passthru = audioCtx.createGain();
var crossL1 = audioCtx.createGain();
var crossL2 = audioCtx.createGain();
var reverbOutput = audioCtx.createGain();
//Connect Input -> Split two lines -> output gain -> output mixer (merger)
reverbInput.connect(reDelayL1);
reverbInput.connect(reDelayL2);
reverbInput.connect(passthru);
reDelayL1.connect(reDelay1Gain);
reDelayL2.connect(reDelay2Gain);
passthru.connect(reverbOutput);
reDelay1Gain.connect(reverbOutput);
reDelay2Gain.connect(reverbOutput);
//Feedback Loops
reDelay1Gain.connect(reFeedback1Gain);
reDelay2Gain.connect(reFeedback2Gain);
reFeedback1Gain.connect(reDelayL1);
reFeedback2Gain.connect(reDelayL2);
// Crossfeed lines
reDelay1Gain.connect(crossL1);
reDelay2Gain.connect(crossL2);
crossL1.connect(reDelayL2);
crossL2.connect(reDelayL1);
// Reverb Defaults
//----------------------------------------------------------
// Setup Defaults to prevent crazy feedback
reDelay1Gain.gain.value = 0.5;
reDelay2Gain.gain.value = 0.5;
reFeedback1Gain.gain.value = 0.5;
reFeedback2Gain.gain.value = 0.5;
reDelayL1.delayTime.value = 0.1;
reDelayL2.delayTime.value = 0.333;
delayModOsc.frequency.value = 0.05;
delayModGain.gain.value = 10;
//ModLFO
delayModOsc.connect(delayModGain);
delayModGain.connect(reDelayL1.delayTime);
delayModGain.connect(reDelayL2.delayTime);
delayModOsc.start();


// Conect Modules
osc.forEach(element => element.connect(synthmixer));
subOsc.connect(synthmixer);
synthmixer.connect(lowpass);
lowpass.connect(delayInput);
delayOutput.connect(reverbInput);
reverbOutput.connect(volume);
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
setReverbWet(0.65);
setReverbTime(150);
setReverbFeeback(0.95);

//Spin up Oscillators
osc.forEach(element => element.frequency.value = getRandomBetween(110,600));
osc.forEach(element => element.type = "sine");
osc.forEach(element => element.detune.value = getRandomBetween(-1000,1000));
osc.forEach(element => element.start());
setSubOsc();
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

// Set Sub Oscillator frequency @ 8th of the Average (of 4 osc)
function setSubOsc(){
	subOsc.frequency.value = lowpass.frequency.value/4
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

function setDelayTime(time){
	delay.delayTime.value = time;
}

function setDelayFilterCutoff(cutoff){
	fbLowpass.frequency.value = cutoff;
}

function setDelayFeedbackGain(fbgain){
	fbGain.gain.value = fbgain;
}


//Reverb Functions
//----------------------------------------------------------
//Set Delay Wet&Dry Mix 
function setReverbWet(wetValue){
		if (wetValue > 1) {
		wetValue = 1;
	} 
	if (wetValue = 0) {
		wetValue = 0.001;
	}
	reDelay1Gain.gain.value = wetValue / 2;
		reDelay2Gain.gain.value = wetValue / 2;
		passthru.gain.value = 1 - wetValue;
}

//Set Delay Time based on a 1/13 prime number idea 
function setReverbTime(inputTime){
		reDelayL1.delayTime.value = inputTime * 1;
		reDelayL2.delayTime.value = inputTime * 13;
}

function setReverbFeeback(feedback){
		reFeedback1Gain.gain.value = feedback;
		reFeedback2Gain.gain.value = feedback;
}
		

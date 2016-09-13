(function () {
	'use strict';
	angular
		.module('APP')
		.controller('Goban', Goban);

	Goban.$inject = ['$interval', '$timeout', '$window'];

	function Goban($interval, $timeout, $window) {
		var vm = this;

		var visualizer = {};
		init();
		console.log('', visualizer);
		vm.buildAudio = buildAudio;
		vm.buildVisualizer = buildVisualizer;
		vm.initializeVisualizerContexts = initializeVisualizerContexts;
		vm.playMusic = playMusic;

		function init() {
			buildGoban();
			vm.kifu = getKifu();
			buildVisualizer();
			// orchestrate();
		}

		function animate() {
			if (!visualizer.playing) {
				return;
			}
			window.requestAnimationFrame(animate);
			visualizer.analyser.getByteFrequencyData(visualizer.frequencyData);
			visualizer.analyser.getByteTimeDomainData(visualizer.timeData);
			visualizer.avg = getAvg([].slice.call(visualizer.frequencyData)) * visualizer.gainNode.gain.value;

			clearCanvas();

			if (visualizer.SHOW_STAR_FIELD) {
				drawStarField();
			}

			if (visualizer.SHOW_AVERAGE) {
				drawAverageCircle();
			}

			if (visualizer.SHOW_WAVEFORM) {
				drawWaveform();
			}
		}

		function AvgPoint(config) {
			this.index = config.index;
			this.angle = (this.index * 360) / visualizer.TOTAL_AVG_POINTS;

			this.updateDynamics = function () {
				this.radius = Math.abs(visualizer.w, visualizer.h) / 100;
				this.x = visualizer.cx + this.radius * Math.sin(visualizer.PI_HALF * this.angle);
				this.y = visualizer.cy + this.radius * Math.cos(visualizer.PI_HALF * this.angle);
			}

			this.updateDynamics();

			this.value = Math.random() * 256;
			this.dx = this.x + this.value * Math.sin(visualizer.PI_HALF * this.angle);
			this.dy = this.y + this.value * Math.cos(visualizer.PI_HALF * this.angle);
		}

		function buildAudio() {
			initVisualizerSettings();
			// var audio = document.getElementById("audioElement");
			// audio.oncanplaythrough = function () {

			// 	ctx = document.createElement('canvas').getContext('2d');
			// 	actx = new AudioContext();

			// 	document.body.appendChild(ctx.canvas);

			// 	resizeHandler();
			// 	initializeAudio();
			// };
		}

		function buildGoban() {
			var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

			var goban = [];
			var column;
			var row;
			var coordinates;
			for (var i = 0, len = columns.length; i < len; i++) {
				goban[i] = [];
				row = 19;
				column = columns[i];
				for (var j = 0; j < 19; j++) {
					coordinates = column + row;
					goban[i][j] = {
						coordinates: coordinates,
						column: column,
						row: row,
						hoshi: isHoshi(coordinates)
					};
					row--;
				}
			}

			vm.goban = goban;
			// vm.gobanWidth = angular.element('.goban').css('width');
			vm.moveNumber = 0;

		}

		function buildVisualizer() {
			var defaults = {};

			defaults.fftSize = 1024;
			// [32, 64, 128, 256, 512, 1024, 2048]

			defaults.background_gradient_color_1 = 'black';
			defaults.background_color = 'rgba(0, 0, 1, 1)';
			defaults.background_gradient_color_2 = 'hsl(240, 0%, 2%)';
			defaults.background_gradient_color_3 = 'hsl(240, 50%, 4%)';

			defaults.stars_color = '#465677';
			defaults.stars_color_2 = '#427773';
			defaults.stars_color_3 = '#c6cc89';
			defaults.stars_color_4 = '#efb0bb';
			defaults.stars_color_5 = '#5f674b';
			defaults.stars_color_6 = '#b2d2ce';
			defaults.stars_color_7 = '#e4c0a4';
			defaults.stars_color_8 = '#35b5a5';
			defaults.stars_color_9 = '#35b5a5';
			defaults.stars_color_10 = '#35b5a5';
			defaults.stars_color_11 = '#35b5a5';
			defaults.stars_color_12 = '#35b5a5';
			defaults.stars_color_special = '#F451BA';
			defaults.TOTAL_STARS = 1000;
			defaults.STARS_BREAK_POINT = 140;
			defaults.stars = [];

			defaults.waveform_color = 'rgba(29, 36, 57, 0.05)';
			defaults.waveform_color_2 = 'rgba(0,0,0,0)';
			defaults.waveform_line_color = 'rgba(157, 242, 157, 0.11)';
			defaults.waveform_line_color_2 = 'rgba(157, 242, 157, 0.8)';
			defaults.waveform_tick = 0.05;
			defaults.TOTAL_POINTS = defaults.fftSize / 2;
			defaults.points = [];

			defaults.bubble_avg_color = 'rgba(29, 36, 57, 0.1)';
			defaults.bubble_avg_color_2 = 'rgba(29, 36, 57, 0.05)';
			defaults.bubble_avg_line_color = 'rgba(77, 218, 248, 1)';
			defaults.bubble_avg_line_color_2 = 'rgba(77, 218, 248, 1)';
			defaults.bubble_avg_tick = 0.001;
			defaults.TOTAL_AVG_POINTS = 64;
			defaults.AVG_BREAK_POINT = 100;
			defaults.avg_points = [];

			defaults.SHOW_STAR_FIELD = true;
			defaults.SHOW_WAVEFORM = true;
			defaults.SHOW_AVERAGE = true;

			// defaults.AudioContext = (window.AudioContext || window.webkitAudioContext);
			// defaults.floor = Math.floor;
			// defaults.round = Math.round;
			// defaults.random = Math.random;
			// defaults.sin = Math.sin;
			// defaults.cos = Math.cos;
			defaults.PI = Math.PI;
			defaults.PI_TWO = defaults.PI * 2;
			defaults.PI_HALF = defaults.PI / 180;

			defaults.w = 0;
			defaults.h = 0;
			defaults.cx = 0;
			defaults.cy = 0;

			defaults.playing = false;
			// defaults.startedAt;
			// defaults.pausedAt;

			defaults.rotation = 0;
			defaults.msgElement = document.querySelector('#loading .msg');
			// defaults.avg;
			// defaults.ctx;
			// defaults.actx;
			// defaults.asource;
			// defaults.gainNode;
			// defaults.analyser;
			// defaults.frequencyData;
			// defaults.frequencyDataLength;
			// defaults.timeData;

			visualizer = defaults;
			angular.element($window).bind('resize', resizeHandler, false);
		}

		function clearCanvas() {
			var gradient = visualizer.ctx.createLinearGradient(0, 0, 0, visualizer.h);
			gradient.addColorStop(0, visualizer.background_gradient_color_3);
			gradient.addColorStop(0.15, visualizer.background_gradient_color_2);
			gradient.addColorStop(0.5, visualizer.background_gradient_color_1);
			gradient.addColorStop(0.85, visualizer.background_gradient_color_2);
			gradient.addColorStop(1, visualizer.background_gradient_color_3);

			visualizer.ctx.beginPath();
			visualizer.ctx.globalCompositeOperation = "source-over";
			visualizer.ctx.fillStyle = gradient;
			visualizer.ctx.fillRect(0, 0, visualizer.w, visualizer.h);
			visualizer.ctx.fill();
			visualizer.ctx.closePath();

			gradient = null;
		}

		function createAudioControls() {
			// var playButton = document.createElement('a');

			// playButton.setAttribute('id', 'playcontrol');
			// playButton.textContent = "pause";
			// angular.element('.chart-container').append(playButton);

			// playButton.addEventListener('click', function (e) {
			// 	e.preventDefault();
			// 	this.textContent = playing ? "play" : "pause";
			// 	toggleAudio();
			// });

			playMusic();
			// hideLoader();
		}

		function createPoints() {
			var i;

			i = -1;
			while (++i < visualizer.TOTAL_POINTS) {
				visualizer.points.push(new Point({
					index: i + 1
				}));
			}

			i = -1;
			while (++i < visualizer.TOTAL_AVG_POINTS) {
				visualizer.avg_points.push(new AvgPoint({
					index: i + 1
				}));
			}

			i = null;
		}

		function createStarField() {
			var i = -1;

			while (++i < visualizer.TOTAL_STARS) {
				visualizer.stars.push(new Star(i));
			}

			i = null;
		}

		function createSvg(parent, height, width) {
			return d3.select(parent).append('svg').attr('height', height).attr('width', width);
		}

		function drawAverageCircle() {
			var i, len, p, value, xc, yc;

			if (visualizer.avg > visualizer.AVG_BREAK_POINT) {
				visualizer.rotation += -visualizer.bubble_avg_tick;
				value = visualizer.avg + Math.random() * 10;
				visualizer.ctx.strokeStyle = visualizer.bubble_avg_line_color_2;
				visualizer.ctx.fillStyle = visualizer.bubble_avg_color_2;
			} else {
				visualizer.rotation += visualizer.bubble_avg_tick;
				value = visualizer.avg;
				visualizer.ctx.strokeStyle = visualizer.bubble_avg_line_color;
				visualizer.ctx.fillStyle = visualizer.bubble_avg_color;
			}

			visualizer.ctx.beginPath();
			visualizer.ctx.lineWidth = 1;
			visualizer.ctx.lineCap = "round";

			visualizer.ctx.save();
			visualizer.ctx.translate(-(visualizer.cx - visualizer.w * .32 / 2), 0);
			// visualizer.ctx.translate(visualizer.cx, visualizer.cy);
			// visualizer.ctx.rotate(visualizer.rotation);
			// visualizer.ctx.translate(-visualizer.cx, -visualizer.cy);

			visualizer.ctx.moveTo(visualizer.avg_points[0].dx, visualizer.avg_points[0].dy);

			for (i = 0, len = visualizer.TOTAL_AVG_POINTS; i < len - 1; i++) {
				p = visualizer.avg_points[i];
				p.dx = p.x + value * Math.sin(visualizer.PI_HALF * p.angle);
				p.dy = p.y + value * Math.cos(visualizer.PI_HALF * p.angle);
				xc = (p.dx + visualizer.avg_points[i + 1].dx) / 2;
				yc = (p.dy + visualizer.avg_points[i + 1].dy) / 2;

				visualizer.ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
			}

			p = visualizer.avg_points[i];
			p.dx = p.x + value * Math.sin(visualizer.PI_HALF * p.angle);
			p.dy = p.y + value * Math.cos(visualizer.PI_HALF * p.angle);
			xc = (p.dx + visualizer.avg_points[0].dx) / 2;
			yc = (p.dy + visualizer.avg_points[0].dy) / 2;

			visualizer.ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
			visualizer.ctx.quadraticCurveTo(xc, yc, visualizer.avg_points[0].dx, visualizer.avg_points[0].dy);

			visualizer.ctx.stroke();
			visualizer.ctx.fill();
			visualizer.ctx.restore();
			visualizer.ctx.closePath();

			i = len = p = value = xc = yc = null;
		}

		function drawStarField() {
			var i, len, p, tick;

			for (i = 0, len = visualizer.stars.length; i < len; i++) {
				p = visualizer.stars[i];
				tick = (visualizer.avg > visualizer.AVG_BREAK_POINT) ? (visualizer.avg / 20) : (visualizer.avg / 50);
				p.x += p.dx * tick;
				p.y += p.dy * tick;
				p.z += p.dz;

				p.dx += p.ddx;
				p.dy += p.ddy;
				p.radius = 0.2 + ((p.max_depth - p.z) * .1);

				if (p.x < -visualizer.cx || p.x > visualizer.cx || p.y < -visualizer.cy || p.y > visualizer.cy) {
					visualizer.stars[i] = new Star();
					continue;
				}

				visualizer.ctx.beginPath();
				visualizer.ctx.globalCompositeOperation = "lighter";
				visualizer.ctx.fillStyle = p.color;
				visualizer.ctx.arc(p.x + visualizer.cx, p.y + visualizer.cy, p.radius, visualizer.PI_TWO, false);
				visualizer.ctx.fill();
				visualizer.ctx.closePath();
			}

			i = len = p = tick = null;
		}

		function drawWaveform() {
			var i, len, p, value, xc, yc;

			if (visualizer.avg > visualizer.AVG_BREAK_POINT) {
				visualizer.rotation += visualizer.waveform_tick;
				visualizer.ctx.strokeStyle = visualizer.waveform_line_color_2;
				visualizer.ctx.fillStyle = visualizer.waveform_color_2;
			} else {
				visualizer.rotation += -visualizer.waveform_tick;
				visualizer.ctx.strokeStyle = visualizer.waveform_line_color;
				visualizer.ctx.fillStyle = visualizer.waveform_color;
			}

			visualizer.ctx.beginPath();
			visualizer.ctx.lineWidth = 1;
			visualizer.ctx.lineCap = "round";

			visualizer.ctx.save();
			visualizer.ctx.translate(visualizer.cx - visualizer.w * .32 / 2, 0);
			// visualizer.ctx.translate(visualizer.cx, visualizer.cy);
			// visualizer.ctx.rotate(visualizer.rotation)
			// visualizer.ctx.translate(-visualizer.cx, -visualizer.cy);

			visualizer.ctx.moveTo(visualizer.points[0].dx, visualizer.points[0].dy);
			for (i = 0, len = visualizer.TOTAL_POINTS; i < len - 1; i++) {
				p = visualizer.points[i];
				value = visualizer.timeData[i];
				p.dx = p.x + value * Math.sin(visualizer.PI_HALF * p.angle);
				p.dy = p.y + value * Math.cos(visualizer.PI_HALF * p.angle);
				xc = (p.dx + visualizer.points[i + 1].dx) / 2;
				yc = (p.dy + visualizer.points[i + 1].dy) / 2;

				visualizer.ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
			}

			value = visualizer.timeData[i];
			p = visualizer.points[i];
			p.dx = p.x + value * Math.sin(visualizer.PI_HALF * p.angle);
			p.dy = p.y + value * Math.cos(visualizer.PI_HALF * p.angle);
			xc = (p.dx + visualizer.points[0].dx) / 2;
			yc = (p.dy + visualizer.points[0].dy) / 2;

			visualizer.ctx.quadraticCurveTo(p.dx, p.dy, xc, yc);
			visualizer.ctx.quadraticCurveTo(xc, yc, visualizer.points[0].dx, visualizer.points[0].dy);

			visualizer.ctx.stroke();
			visualizer.ctx.fill();
			visualizer.ctx.restore();
			visualizer.ctx.closePath();

			i = len = p = value = xc = yc = null;
		}

		function getAvg(values) {
			var value = 0;

			values.forEach(function (v) {
				value += v;
			})

			return value / values.length;
		}

		function getPoint(coordinates) {
			var columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
			var column = columns.indexOf(coordinates.slice(0, 1));
			var row = 19 - coordinates.slice(1);
			return vm.goban[column][row];
		}

		function initializeAudio() {
			var xmlHTTP = new XMLHttpRequest();

			vm.loadMessage = '- Loading Audio Buffer -';

			xmlHTTP.open('GET', 'app/assets/sairyou-no-itte.mp3', true);
			xmlHTTP.responseType = "arraybuffer";

			xmlHTTP.onload = function (e) {
				vm.loadMessage = '- Decoding Audio File Data -';
				visualizer.analyser = visualizer.actx.createAnalyser();
				visualizer.analyser.fftSize = visualizer.fftSize;
				visualizer.analyser.minDecibels = -100;
				visualizer.analyser.maxDecibels = -30;
				visualizer.analyser.smoothingTimeConstant = 0.8;

				visualizer.actx.decodeAudioData(this.response, function (buffer) {
					vm.loadMessage = '- Ready -';

					visualizer.audio_buffer = buffer;
					visualizer.gainNode = visualizer.actx.createGain();

					visualizer.gainNode.connect(visualizer.analyser);
					visualizer.analyser.connect(visualizer.actx.destination);

					visualizer.frequencyDataLength = visualizer.analyser.frequencyBinCount;
					visualizer.frequencyData = new Uint8Array(visualizer.frequencyDataLength);
					visualizer.timeData = new Uint8Array(visualizer.frequencyDataLength);
					createStarField();
					createPoints();
					createAudioControls();
				}, function (e) {
					alert("Error decoding audio data" + e.err);
				});
			};

			xmlHTTP.send();
		}

		function initializeVisualizerContexts() {
			if (!window.AudioContext) {
				featureNotSupported();
				return;
			}

			visualizer.ctx = document.createElement('canvas').getContext('2d');
			visualizer.actx = new AudioContext();
			angular.element('.chart-container').append(visualizer.ctx.canvas);

			resizeHandler();
			initializeAudio();
		}

		function isHoshi(coordinates) {
			var hoshi = ['D16', 'K16', 'Q16', 'D10', 'K10', 'Q10', 'D4', 'K4', 'Q4'];
			return hoshi.indexOf(coordinates) === -1 ? false : true;
		}

		function playAura(coordinates) {
			var auraWrapper = angular.element('[coordinates=' + coordinates + '] .circuit-wrapper');
			var aura = $('<div class="effect ' + vm.currentColor + '"></div>')
			auraWrapper.append(aura);
			$timeout(function () {
				aura.remove()
			}, 5000);
		}

		function playGame(kifu, seconds) {
			if (!kifu.length) {
				return;
			}
			var gameLength = kifu.length;
			var interval = seconds / gameLength * 1000;
			var i = 0;
			$interval(function () {
				vm.moveNumber++;
				vm.currentColor = vm.moveNumber % 2 === 0 ? 'white' : 'black';
				kifu[i++]();
			}, interval, gameLength);
		}

		function playMove(move, prisoners) {
			return function () {
				if (move === 'pass') {
					return;
				}
				setStone(move, vm.currentColor);
				removePrisoners(prisoners);
				playAura(move);
			};
		}

		function playMusic() {
			var audioElement = document.getElementById('audioElement');
			visualizer.playing = true;
			visualizer.startedAt = visualizer.pausedAt ? Date.now() - visualizer.pausedAt : Date.now();
			visualizer.asource = null;
			visualizer.asource = visualizer.actx.createBufferSource();
			visualizer.asource.buffer = visualizer.audio_buffer;
			visualizer.asource.loop = false;
			visualizer.asource.connect(visualizer.gainNode);
			visualizer.pausedAt ? visualizer.asource.start(0, visualizer.pausedAt / 1000) : visualizer.asource.start();
			// visualizer.asource.stop(4)
			visualizer.asource.onended = function () {
				visualizer.playing = false;
				console.log('', visualizer);
				console.log('Your audio has finished playing');
			}

			animate();
			playGame(vm.kifu, 105);

		}

		function Point(config) {
			this.index = config.index;
			this.angle = (this.index * 360) / visualizer.TOTAL_POINTS;

			this.updateDynamics = function () {
				this.radius = Math.abs(visualizer.w, visualizer.h) / 100;
				this.x = visualizer.cx + this.radius * Math.sin(visualizer.PI_HALF * this.angle);
				this.y = visualizer.cy + this.radius * Math.cos(visualizer.PI_HALF * this.angle);
			}

			this.updateDynamics();

			this.value = Math.random() * 256;
			this.dx = this.x + this.value * Math.sin(visualizer.PI_HALF * this.angle);
			this.dy = this.y + this.value * Math.cos(visualizer.PI_HALF * this.angle);
		}

		function removePrisoners(prisoners) {
			if (prisoners) {
				for (var i = 0, len = prisoners.length; i < len; i++) {
					removeStone(prisoners[i]);
				}
			}
		}

		function removeStone(coordinates) {
			getPoint(coordinates).ishi = '';
		}

		function resizeHandler() {
			$timeout(function () {
				console.log('', 'resizing');
				visualizer.w = $('.chart-container').innerWidth();
				visualizer.h = $('.chart-container').innerHeight();
				visualizer.cx = visualizer.w / 2;
				visualizer.cy = visualizer.h / 2;

				visualizer.ctx.canvas.width = visualizer.w;
				visualizer.ctx.canvas.height = visualizer.h;

				visualizer.points.forEach(function (p) {
					p.updateDynamics();
				});

				visualizer.avg_points.forEach(function (p) {
					p.updateDynamics();
				});
			}, 0);
		}

		function setStone(coordinates, color) {
			getPoint(coordinates).ishi = color;
		}

		function Star(index) {
			var xc, yc;

			this.x = Math.random() * visualizer.w - visualizer.cx;
			this.y = Math.random() * visualizer.h - visualizer.cy;
			this.z = this.max_depth = Math.max(visualizer.w / visualizer.h);
			this.radius = 0.2;

			xc = this.x > 0 ? 1 : -1;
			yc = this.y > 0 ? 1 : -1;

			if (Math.abs(this.x) > Math.abs(this.y)) {
				this.dx = 1.0;
				this.dy = Math.abs(this.y / this.x);
			} else {
				this.dx = Math.abs(this.x / this.y);
				this.dy = 1.0;
			}

			this.dx *= xc;
			this.dy *= yc;
			this.dz = -0.1;
			this.ddx = .001 * this.dx;
			this.ddy = .001 * this.dy;

			// if (this.y > (visualizer.cy / 2)) {
			// 	this.color = (index % 2 == 0) ? visualizer.stars_color_2 : visualizer.stars_color_3;
			// } else {
			// 	if (visualizer.avg > visualizer.AVG_BREAK_POINT + 10) {
			// 		this.color = visualizer.stars_color_2;
			// 	} else if (visualizer.avg > visualizer.STARS_BREAK_POINT) {
			// 		this.color = visualizer.stars_color_special;
			// 	} else {
			// 		this.color = (index % 2 == 0) ? visualizer.stars_color : visualizer.stars_color_4;
			// 	}
			// }
			var rand = Math.random();
			var randInt = Math.floor(rand * 100);
			if (rand > 0.38) {
				this.color = visualizer.stars_color;
			} else {
				this.color = visualizer['stars_color_' + randInt];
			}
			xc = yc = null;
		}

		function getKifu() {
			return [playMove('Q16'), playMove('D4'), playMove('C16'), playMove('R4'), playMove('P4'), playMove('P3'), playMove('O3'), playMove('Q3'), playMove('C6'), playMove('F3'), playMove('N4'), playMove('Q5'), playMove('J3'), playMove('E17'), playMove('H16'), playMove('C13'), playMove('E16'), playMove('C10'), playMove('D17'), playMove('B4'), playMove('O17'), playMove('R11'), playMove('E4'), playMove('E5'), playMove('D9'), playMove('F4'), playMove('C9'), playMove('D10'), playMove('E10'), playMove('E11'), playMove('F11'), playMove('E12'), playMove('F12'), playMove('B10'), playMove('F9'), playMove('F13'), playMove('G13'), playMove('F14'), playMove('G14'), playMove('N17'), playMove('N16'), playMove('M17'), playMove('O18'), playMove('J16'), playMove('H17'), playMove('K13'), playMove('Q10'), playMove('Q11'), playMove('P10'), playMove('P11'), playMove('O11'), playMove('O12'), playMove('N12'), playMove('O13'), playMove('N13'), playMove('N11'), playMove('O10'), playMove('N14'), playMove('M11'), playMove('O15'), playMove('O16'), playMove('N10'), playMove('M14'), playMove('N9'), playMove('N15'), playMove('O14'), playMove('M12'), playMove('R10'), playMove('L9'), playMove('J9'), playMove('K11'), playMove('G12'), playMove('H10'), playMove('G15'), playMove('H15'), playMove('F16'), playMove('F17'), playMove('L11'), playMove('K10'), playMove('M10'), playMove('L12'), playMove('K12'), playMove('N8'), playMove('O9'), playMove('P8'), playMove('P9'), playMove('Q9'), playMove('Q8'), playMove('R9'), playMove('O8'), playMove('L10', ['L11']), playMove('J11'), playMove('S9'), playMove('P7', ['P8']), playMove('Q13'), playMove('R8'), playMove('C4'), playMove('C5'), playMove('P15'), playMove('S8'), playMove('T9'), playMove('S10'), playMove('H13'), playMove('J10'), playMove('L7'), playMove('G11'), playMove('F10'), playMove('K8'), playMove('L8'), playMove('G8'), playMove('F8'), playMove('G7'), playMove('C12'), playMove('E15'), playMove('E18', ['E17']), playMove('B13'), playMove('D13'), playMove('E13'), playMove('E6'), playMove('F5'), playMove('D14'), playMove('D12'), playMove('J7'), playMove('H9'), playMove('B6'), playMove('J14'), playMove('G16'), playMove('F15'), playMove('H14'), playMove('J12'), playMove('B12'), playMove('C11'), playMove('H5'), playMove('G5'), playMove('P2'), playMove('S13'), playMove('D6'), playMove('C3', ['C4']), playMove('Q2'), playMove('R2'), playMove('S14'), playMove('R13'), playMove('R14'), playMove('K17'), playMove('G2'), playMove('T14'), playMove('T15'), playMove('T13'), playMove('S16'), playMove('B8'), playMove('B9'), playMove('A9'), playMove('C8'), playMove('H6'), playMove('J6'), playMove('H4'), playMove('F2'), playMove('E2'), playMove('E1'), playMove('D1'), playMove('A12'), playMove('A11'), playMove('L16'), playMove('J15'), playMove('L17'), playMove('L18'), playMove('G9'), playMove('J18'), playMove('R12'), playMove('S12'), playMove('R1'), playMove('S1'), playMove('P12'), playMove('T8'), playMove('P14'), playMove('T10', ['O11', 'O10', 'P10', 'Q10', 'Q9', 'R9', 'S9', 'T9']), playMove('O11'), playMove('O10', ['O11']), playMove('P5'), playMove('K4')];
		}
	}
})();

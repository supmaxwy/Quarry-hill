
const SPIN_MULTIPLIER = 45;
const MIN_PARTICLE_COUNT = 9000;
const MAX_PARTICLE_COUNT = 10000;
const MIN_PARTICLE_SIZE = 2;
const MAX_PARTICLE_SIZE = 10;
const MIN_FORCE = 0.7;
const MAX_FORCE = 0.9;
const REPULSION_RADIUS = 50;
const REPULSION_STRENGTH = 0.9;
const IMG_RESIZED_WIDTH = 1000;
const IMG_SCAN_STEPS = 5;

const DrawTypes = {
	Rect: 0,
	Ellipse: 1,
	Triangle: 2
};

var imgNames = ["map.png"];
var particles = [];
var indices = [];
var imgIndex = 0;
var drawType = 0;
var particleCount = 1000;
var maxSize = 0;
var img;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); 
  canvas.canvas.oncontextmenu = () => false;
  loadImg(imgNames[0]);
}

function draw() {
  background(0);

  fill(255);
  noStroke();
  text(
    `
    —— How to interact ——
    Move mouse over to interact with it.

    —— Controls ——
    Right-click: Show source image
    Space: Change particle type,

    —— Meaning of colors ——
    Red: Gas Works, Factory, Burial Ground
    Else: Dwlling house

		It shows the unhealthy conditions of people 
		living in the quarry hill area around 1900.`,
    0, 0, width * 0.5, height * 0.5);
	    
  if (img == null) {
    return;
  }

  push();
  translate(width / 2 - img.width / 2, height / 2 - img.height / 2);

	fill(255);
	noStroke();
	
	rectMode(CENTER);
	
	particles.forEach(particle => {
		particle.move();
		
		push();
		translate(particle.pos.x, particle.pos.y);
		
		let spin = particle.vel.mag() * SPIN_MULTIPLIER;
		rotate(radians(particle.mapped_angle + spin));
		
		fill(particle.color);
		
		switch(drawType) {
			case DrawTypes.Ellipse:
				ellipse(0, 0, particle.size, particle.size);
				break;
			case DrawTypes.Rect:
				rect(0, 0, particle.size, particle.size);
				break;
			case DrawTypes.Triangle:
				triangle(
					particle.size * -0.5, particle.size * -0.5, 
					0, particle.size, 
					particle.size * 0.5, particle.size * -0.5);
		}
		
		pop();
	});
	
	rectMode(CORNER);
	
	if (mouseIsPressed && mouseButton == RIGHT) {
		image(img, 0, 0);
	}
	
	pop();
}

function keyPressed() {
	if (key == '+') {
		particleCount = min(particleCount + 50, MAX_PARTICLE_COUNT);
		spawnParticles();
	}
	
	if (key == '-') {
		particleCount = max(particleCount - 50, MIN_PARTICLE_COUNT);
		spawnParticles();
	}
	
	if (key == ' ') {
		nextDrawType();
	}
}

function mousePressed() {
	if (mouseButton == LEFT) {
		loadNextImg();
	}
}
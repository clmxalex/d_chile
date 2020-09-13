class Chunk {
  constructor( x, y, width, height ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.offsetX = random(-150, 150);
    this.offsetY = random(-150, 150);
    
    this.animations = {};
    
    this.goto(0,0);
  }
  
  goto( x, y, duration = random(1000, 2000) ) {
    const now = Date.now();
    this.animations.offsetX = { 
      target: this, 
      prop: 'offsetX', 
      start: this.offsetX, 
      end: x, 
      started: now, 
      complete: now + duration, 
      easingFunc: this.easeMethod
    };
    this.animations.offsetY = { 
      target: this, 
      prop: 'offsetY', 
      start: this.offsetY, 
      end: y, 
      started: now, 
      complete: now + duration, 
      easingFunc: 
      this.easeMethod};
  }
  
  move() {
    const now = Date.now();    
    for( var el in this.animations ) {
      const anim = this.animations[el];
      if( now >= anim.complete ) {
        anim.progress = 1;
        anim.target[anim.prop] = anim.end;
      } else {
        anim.progress = ( now - anim.started ) / ( anim.complete - anim.started);
        anim.target[anim.prop] = anim.start + (anim.end - anim.start) * anim.easingFunc(anim.progress);
      }
    }
  }
  
  /** 
   * elastic ease
   * based on: https://github.com/jeremyckahn/shifty/blob/master/src/easing-functions.js
   **/
  easeMethod(pos) {
    if (pos < (1 / 2.75)) {
      return (7.5625 * pos * pos);
    } else if (pos < (2 / 2.75)) {
      return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    } else if (pos < (2.5 / 2.75)) {
      return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    } else {
      return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
    }
	}
}

const sketchpad = Sketch.create({
  
  container: document.getElementById( 'container' ),
  
  chunks: [],
  
  columns: 50,
  
  setup() {
    this.image = new Image();
    this.image.addEventListener('load', () => {
      this.chop();
      this.draw();
    });
    
    this.image.src = "chile.jpg"
  },
  
  chop() {
    const dim = this.image.width / this.columns,
          rows = Math.ceil(this.image.height/dim);
    
    for( let i = 0; i < this.columns; i++ ){
      for( let j = 0; j < rows; j++ ){
        this.chunks.push( 
          new Chunk(i*dim, j*dim, dim, dim)
        ); 
      }
    }
  },
  
  mousedown(evt) {
    this.chunks.forEach( chunk => {      
      chunk.offsetX += this.touches[0].x - this.image.width/2 + random(-200, 200);
      chunk.offsetY += this.touches[0].y - this.image.height/2 + random(-200, 200);
      chunk.goto(0,0);
    });
  },
  
  update() {
    this.chunks.forEach( chunk => {      
      chunk.move();
    });
  },
  
  draw() {
    // this.globalAlpha = 1;
    this.drawImage( this.image, 0, 0 );
    // this.globalCompositeOperation  = 'lighter';
    this.chunks.forEach( chunk => {
      this.save();
      this.translate( chunk.x + chunk.width/2, chunk.y + chunk.height/2);
      this.rotate(chunk.rad);
      this.drawImage( this.image, chunk.x, chunk.y, chunk.width, chunk.height, -chunk.width/2 + chunk.offsetX, -chunk.height/2 + chunk.offsetY, chunk.width, chunk.height );
      this.restore();
    });
    // this.stop();
  }
});
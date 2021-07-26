class Vector{
		constructor(arr) {
			this.arr = arr;
		}

		add(vec) {
			for (var i = 0; i < this.arr.length; i++) {
				this.arr[i] = this.arr[i] + vec.arr[i];
			}
			return this;
		}

		subtract(vec) {
			for (var i = 0; i< this.arr.length; i++) {
				this.arr[i] = this.arr[i] - vec.arr[i];
			}

			return this;
		}

		norm() {
			var n = 0;
			for (var i = 0; i < this.arr.length; i++) {
				n = n + this.arr[i]*this.arr[i];
			}
			return Math.sqrt(n);
		}

		multiply(x) {
			for (var i = 0; i < this.arr.length; i++) {
				this.arr[i] = this.arr[i]*x;
			}
			return this;
		}

		coord(i) {
			return this.arr[i];
		}

		dot(vec) {
			var prod = 0;
			for (var i = 0; i < this.arr.length; i++) {
				prod = prod + this.arr[i] * vec.arr[i];
			}

			return prod;
		}
	}

	class Rectangle{
		constructor(P, Q, ctx) {
			var p1 = Math.min(P[0],Q[0]);
			var q1 = Math.max(P[0],Q[0]);

			var p2 = Math.min(P[1],Q[1]);
			var q2 = Math.max(P[1],Q[1]);

			this.P = new Vector([p1,p2]);
			this.Q = new Vector([q1,q2]);

			this.width = q1 - p1;
			this.height = q2 - p2;

			this.ctx = ctx;
		}

		print() {
			console.log(this.P);
			console.log(this.Q);
			console.log(this.width);
			console.log(this.height);
			console.log(this.ctx);
		}

		draw() {
			this.ctx.fillStyle = "#0672d6";

			this.ctx.fillRect(this.P.coord(0), this.P.coord(1), this.width, this.height);
		}
	}

	class Ball {
		constructor(rad, pos, vec, ctx) {
			this.rad = rad;
			this.pos = new Vector(pos);
			this.vec = new Vector(vec);

			this.ctx = ctx;
		}

		draw() {
			this.ctx.beginPath();
			this.ctx.arc(this.pos.coord(0), this.pos.coord(1), this.rad, 0, 2*Math.PI,false);
			this.ctx.fillStyle = "#ff0000";

			this.ctx.fill();
		}

		move() {
			this.pos.add(this.vec);
		}


		collisionInner(rect) {
			var p1 = rect.P.coord(0);
			var q1 = rect.Q.coord(0);

			var p2 = rect.P.coord(1);
			var q2 = rect.Q.coord(1);

			var x1 = this.pos.coord(0);
			var x2 = this.pos.coord(1);

			var v1 = this.vec.coord(0);
			var v2 = this.vec.coord(1);

			var collided = false;

			if ( p1 < x1 && x1 < p1 + this.rad) {
				// Check if ball is actually moving into the side
				if (v1 < 0) {
					v1 = -v1;
					this.vec = new Vector([v1,v2]);
				}
				collided = true;
			}

			if ( p2 < x2 && x2 < p2 + this.rad) {
				if ( v2 < 0) {
					v2 = -v2;
					this.vec = new Vector([v1,v2]);
				}
				collided = true;
			}

			if (q1 - this.rad < x1 && x1 < q1) {
				if (v1 > 0) {
					v1 = - v1;
					this.vec = new Vector([v1,v2]);
				}
				
				collided = true;
			}
			if (q2 - this.rad < x2 && x2 < q2) {
				if (v2 > 0) {
					v2 = -v2;
					this.vec = new Vector([v1,v2]);
				}
			
				collided = true;
			}
			return collided;
		}

		collisionOuter(rect) {
			var p1 = rect.P.coord(0);
			var q1 = rect.Q.coord(0);

			var p2 = rect.P.coord(1);
			var q2 = rect.Q.coord(1);

			var x1 = this.pos.coord(0);
			var x2 = this.pos.coord(1);

			var v1 = this.vec.coord(0);
			var v2 = this.vec.coord(1);

			// Test collision top left corner
			var corner = new Vector([p1,p2]);
			var u = new Vector([x1,x2]);
			u.subtract(corner);

			if (x1 <= corner.coord(0) && x2 <= corner.coord(1) && u.norm() <= this.rad) {
				var w = new Vector([v1,v2]);
				var s = 2*this.vec.dot(u)/u.dot(u);
				if (s < 0) {
					this.vec = w.subtract(u.multiply(s));
				}

				return true;
			}

			// Test collision top right corner
			var corner = new Vector([q1,p2]);
			var u = new Vector([x1,x2]);
			u.subtract(corner);

			if (x1 >= corner.coord(0) && x2 <= corner.coord(1) && u.norm() <= this.rad) {
				var w = new Vector([v1,v2]);
				var s = 2*this.vec.dot(u)/u.dot(u);
				if (s < 0) {
					this.vec = w.subtract(u.multiply(s));
				}

				return true;
			}

			// Test collision bottom right corner
			var corner = new Vector([q1,q2]);
			var u = new Vector([x1,x2]);
			u.subtract(corner);

			if (x1 >= corner.coord(0) && x2 >= corner.coord(1) && u.norm() <= this.rad) {
				var w = new Vector([v1,v2]);
				var s = 2*this.vec.dot(u)/u.dot(u);
				if (s < 0) {
					this.vec = w.subtract(u.multiply(s));
				}

				return true;
			}

			// Test collision bottom left corner
			var corner = new Vector([p1,q2]);
			var u = new Vector([x1,x2]);
			u.subtract(corner);

			if (x1 >= corner.coord(0) && x2 >= corner.coord(1) && u.norm() <= this.rad) {
				var w = new Vector([v1,v2]);
				var s = 2*this.vec.dot(u)/u.dot(u);
				if (s < 0) {
					this.vec = w.subtract(u.multiply(s));
				}

				return true;
			}


			// Test collision left side

			if ( p1 - this.rad<= x1 && x1 <= p1 && p2 <= x2 && x2 <= q2) {
				if (v1 > 0) {
					v1 = -v1;
					this.vec = new Vector([v1,v2]);
				}
				return true;
			}

			// Test collision right side
			if ( q1 <= x1 && x1 <= q1 + this.rad && p2 <= x2 && x2 <= q2) {
				if (v1 < 0) {
					v1 = -v1;
					this.vec = new Vector([v1,v2]);
				}
				return true;
			}

			// Test collision top side

			if ( p1 <= x1 && x1 <= q1 && p2 - this.rad <= x2 && x2 <= p2) {
				if (v2 > 0) {
					v2 = -v2;
					this.vec = new Vector([v1,v2]);
				}
				return true;
			}

			// Test collision bottom side

			if ( p1 <= x1 && x1 <= q1 && q2 <= x2 && x2 <= q2 + this.rad) {
				if (v2 < 0) {
					v2 = -v2;
					this.vec = new Vector([v1,v2]);
				}
				return true;
			}

			

			return false;
		}

		printxy() {
			console.log(this.pos.coord(0), this.pos.coord(1));
		}
	}

	function randomBetween(a,b) {
		return a + Math.random() *( b - a );
	}

	class Billiard {
		constructor(canvas) { 
			this.ctx = canvas.getContext("2d");

			this.WIDTH = canvas.width;

			this.HEIGHT = canvas.height;

			this.outerBox = null;

			this.obstacles = [];
	
			this.ball = null;

			this.timer = null;
		}

		init() {
			// Set the canvas to fill the entire viewport:

			this.ctx.canvas.width = document.body.clientWidth;
			this.ctx.canvas.height = document.body.clientHeight;

			// Introduce shorthands for width and height:
			this.WIDTH = this.ctx.canvas.width;

			this.HEIGHT = this.ctx.canvas.height;

			// Set the bounding box for the billiard

			this.outerBox = new Rectangle([0,0],[this.WIDTH, this.HEIGHT], this.ctx);

			// Add the ball:
	
			this.ball = new Ball(5, [10,10], [3,2], this.ctx);

			this.ball.draw();

			this.obstacles = [];

			// Look for all DOM objects that have the class "obstacle". These will be added as obstacles for the billiard.

			var obstaclelist = document.querySelectorAll(".billiard-obstacle");

			for(var i =0; i < obstaclelist.length; i++) {
				var obj = obstaclelist[i];

				var left = obj.offsetLeft;
				var top = obj.offsetTop;
				var width = obj.offsetWidth;
				var height = obj.offsetHeight;

				var rect = new Rectangle([left, top], [left + width, top + height], this.ctx);

				this.obstacles.push(rect);
			}

			// Setup this Billiard object as EventHandler for the 'resize' event of the window:

			window.addEventListener('resize', this);

		}

		update() {
			this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

			this.ball.draw();

			for (var i = 0; i < this.obstacles.length; i++) {
				this.ball.collisionOuter(this.obstacles[i]);
			}

			this.ball.collisionInner(this.outerBox);

			this.ball.move();

		}

		start() {
			if (this.timer == null) {
				this.timer = setInterval(this.run, 10, this);
			}
		}

		stop() {
			clearInterval(this.timer);
			this.timer = null;
		}

		run(bill) {
			bill.update();
		}

		handleEvent(event) {
			if (event.type == 'resize') {
				this.init();
			}
		}
	}
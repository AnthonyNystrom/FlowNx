var DemoUtils = function() {
	function r(a, e) {
		if (a < e)
			return a;
		return e
	}
	function s(a, e) {
		if (a > e)
			return a;
		return e
	}
	function l(a, e) {
		this.interval_ms_ = 1E3 / a;
		this.callback_ = e;
		this.t_ = 0;
		this.step_ = 1;
		this.interval_handle_ = null
	}
	function t(a, e) {
		var d = {
			first_event : true,
			is_clicking : false,
			last_x : 0,
			last_y : 0
		};
		a.addEventListener("touchstart", function(b) {
			d.is_clicking = true;
			d.last_x = b.touches[0].clientX;
			d.last_y = b.touches[0].clientY;
			b.preventDefault();
			return false
		}, false);
		a.addEventListener("touchend", function(b) {
			d.is_clicking = false;
			b.preventDefault();
			return false
		}, false);
		a.addEventListener("touchmove", function(b) {
			var c = d.last_x - b.touches[0].clientX, g = d.last_y
					- b.touches[0].clientY;
			d.last_x = b.touches[0].clientX;
			d.last_y = b.touches[0].clientY;
			if (d.first_event)
				d.first_event = false;
			else
				e( {
					is_clicking : d.is_clicking,
					canvas_x : d.last_x,
					canvas_y : d.last_y,
					delta_x : c,
					delta_y : g,
					touch : true,
					shift : false,
					ctrl : false
				});
			b.preventDefault();
			return false
		}, false)
	}
	function p(a, e) {
		function d(c) {
			if (typeof c.offsetX == "number")
				return {
					x : c.offsetX,
					y : c.offsetY
				};
			var g = {
				x : 0,
				y : 0
			}, k = c.target, j = k.offsetParent;
			if (j) {
				g.x += k.offsetLeft - j.offsetLeft;
				g.y += k.offsetTop - j.offsetTop
			}
			return {
				x : c.layerX - g.x,
				y : c.layerY - g.y
			}
		}
		var b = {
			first_event : true,
			is_clicking : false,
			last_x : 0,
			last_y : 0
		};
		a.addEventListener("mousedown", function(c) {
			var g = d(c);
			b.is_clicking = true;
			b.last_x = g.x;
			b.last_y = g.y;
			c.preventDefault();
			return false
		}, false);
		a.addEventListener("mouseup", function(c) {
			b.is_clicking = false;
			c.preventDefault();
			return false
		}, false);
		a.addEventListener("mouseout", function(c) {
			b.is_clicking = false;
			c.preventDefault();
			return false
		}, false);
		a.addEventListener("mousemove", function(c) {
			var g = d(c), k = b.last_x - g.x, j = b.last_y - g.y;
			b.last_x = g.x;
			b.last_y = g.y;
			if (b.first_event)
				b.first_event = false;
			else
				e( {
					is_clicking : b.is_clicking,
					canvas_x : b.last_x,
					canvas_y : b.last_y,
					delta_x : k,
					delta_y : j,
					shift : c.shiftKey,
					ctrl : c.ctrlKey
				});
			c.preventDefault();
			return false
		}, false)
	}
	function u(a, e) {
		function d(b) {
			e(b.detail ? -b.detail : b.wheelDelta / 40);
			b.stopPropagation();
			b.preventDefault();
			return false
		}
		a.addEventListener("DOMMouseScroll", d, false);
		a.addEventListener("mousewheel", d, false)
	}
	function m() {
		this.options_ = []
	}
	l.prototype.isRunning = function() {
		return this.interval_handle_ !== null
	};
	l.prototype.start = function() {
		if (!this.isRunning()) {
			var a = this;
			this.interval_handle_ = setInterval(function() {
				var e = a.callback_;
				e(a.t_);
				a.t_ += a.step_
			}, this.interval_ms_)
		}
	};
	l.prototype.stop = function() {
		if (this.isRunning()) {
			clearInterval(this.interval_handle_);
			this.interval_handle_ = null
		}
	};
	l.prototype.set_t = function(a) {
		this.t_ = a
	};
	l.prototype.set_step = function(a) {
		this.step_ = a
	};
	l.prototype.reverse_step_direction = function() {
		this.step_ = -this.step_
	};
	m.prototype.addEntry = function(a, e, d) {
		this.options_.push( [ a, !!e, d ])
	};
	m.prototype.populateDiv = function(a) {
		for ( var e = this.options_, d = 0, b = e.length; d < b; ++d) {
			var c = e[d], g = c[0], k = c[1];
			c = c[2];
			var j = document.createElement("span");
			j.style.marginRight = "20px";
			var h = document.createElement("input");
			h.type = "checkbox";
			if (k)
				h.checked = true;
			h.addEventListener("change", c, false);
			j.appendChild(h);
			j.appendChild(document.createTextNode(" " + g));
			a.appendChild(j)
		}
	};
	m.prototype.createBefore = function(a) {
		var e = document.createElement("div");
		this.populateDiv(e);
		a = a.parentNode;
		a.insertBefore(e, a.firstChild)
	};
	return {
		Ticker : l,
		registerMouseListener : p,
		autoCamera : function(a, e, d, b, c, g, k, j, h) {
			function q() {
				var f = a.camera.transform;
				f.reset();
				f.rotateZ(i.rotate_z);
				f.rotateY(i.rotate_y);
				f.rotateX(i.rotate_x);
				f.translate(i.x, i.y, i.z)
			}
			function o(f) {
				if (f.is_clicking) {
					if (f.shift && f.ctrl)
						a.camera.focal_length = r(10, s(0.05,
								a.camera.focal_length + f.delta_y * 0.01));
					else if (f.shift) {
						i.z += f.delta_y * 0.01;
						if (h.zAxisLimit !== undefined && i.z > h.zAxisLimit)
							i.z = h.zAxisLimit
					} else if (f.ctrl) {
						i.x -= f.delta_x * 0.01;
						i.y -= f.delta_y * 0.01
					} else {
						i.rotate_y -= f.delta_x * 0.01;
						i.rotate_x -= f.delta_y * 0.01
					}
					n != null && clearTimeout(n);
					n = setTimeout(function() {
						n = null;
						q();
						j();
						//f.touch === true ? h.touchDrawCallback(false) : j()
					}, 0)
				}
			}
			var i = {
				rotate_x : c,
				rotate_y : g,
				rotate_z : k,
				x : e,
				y : d,
				z : b
			};
			h = h !== undefined ? h : {};
			var n = null;
			p(a.canvas, o);
			h.touchDrawCallback !== undefined && t(a.canvas, o);
			if (h.panZOnMouseWheel === true) {
				var v = h.panZOnMouseWheelScale !== undefined ? h.panZOnMouseWheelScale
						: 30;
				u(a.canvas, function(f) {
					o( {
						is_clicking : true,
						canvas_x : null,
						canvas_y : null,
						delta_x : 0,
						delta_y : f * v,
						shift : true,
						ctrl : false
					})
				})
			}
			q()
		},
		ToggleToolbar : m
	}
}();

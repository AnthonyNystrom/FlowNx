function start3d(sss) {
	function v(a, c) {
		if (a < c)
			return a;
		return c
	}
	function w(a, c) {
		if (a > c)
			return a;
		return c
	}
	function x(a) {
		for ( var c = [], b = 3, d = a.length; b < d; b += 1) {
			var e = a.length, g = {
				c0 : {
					x : a[b - 1].x / 6 + a[b - 2].x - a[b - 3].x / 6,
					y : a[b - 1].y / 6 + a[b - 2].y - a[b - 3].y / 6,
					z : a[b - 1].z / 6 + a[b - 2].z - a[b - 3].z / 6
				},
				c1 : {
					x : a[b].x / -6 + a[b - 1].x + a[b - 2].x / 6,
					y : a[b].y / -6 + a[b - 1].y + a[b - 2].y / 6,
					z : a[b].z / -6 + a[b - 1].z + a[b - 2].z / 6
				}
			};
			a.push(g.c0);
			a.push(g.c1);
			c.push(new Pre3d.Curve(b - 1, e, e + 1))
		}
		b = new Pre3d.Path;
		b.points = a;
		b.curves = c;
		b.starting_point = 1;
		return b
	}
	function k(a) {
		for ( var c = [], b = 1, d = a.length; b < d; b += 1)
			c.push(new Pre3d.Curve(b, b, null));
		b = new Pre3d.Path;
		b.points = a;
		b.curves = c;
		b.starting_point = 0;
		return b
	}
	function l(a) {
		m = [];
		var c = q ? n : 0;
		if (r)
			for ( var b = -1; b <= 1; b += n) {
				for ( var d = [], e = -1 - c; e <= 1 + c; e += n) {
					var g = a(b, e);
					isFinite(g) && d.push( {
						x : b,
						y : v(1E3, w(-1000, g)),
						z : e
					})
				}
				d.length >= 4 && m.push(q === true ? x(d) : k(d))
			}
		if (s)
			for (e = -1; e <= 1; e += n) {
				d = [];
				for (b = -1 - c; b <= 1 + c; b += n) {
					g = a(b, e);
					isFinite(g) && d.push( {
						x : b,
						y : v(1E3, w(-1000, g)),
						z : e
					})
				}
				d.length >= 4 && m.push(q === true ? x(d) : k(d))
			}
		y = m.length
	}
	function z() {
		h.clearBackground();
		h.ctx.setStrokeColor(0.4, 0.4, 0.4, 1);
		for ( var a = 0; a < C; ++a)
			h.drawPath(A[a])
	}
	function f() {
		z();
		h.ctx.setStrokeColor(t.r, t.g, t.b, t.a);
		for ( var a = 0; a < y; ++a)
			h.drawPath(m[a])
	}
	function o(a, c) {
		j = GraphyCalcCalculator
				.create_evaluator(GraphyCalcCalculator.parse(a));
		l(j);
		if (c === true)
			window.location.hash = encodeURI(a)
	}
	var p = document.getElementById("canvas"), h = new Pre3d.Renderer(p), u = "sinc(x * 10) * sinc(y * 10)", j = null, s = true, r = true, q = true, n = 0.05, B = document.location.hash
			.slice(1);
	//if (B.length !== 0)
		//u = decodeURI(B);
		u="";
	var m = null, y = null, A = [ k( [ {
		x : -1,
		y : 0,
		z : 0
	}, {
		x : 0,
		y : 0,
		z : 0
	}, {
		x : 1,
		y : 0,
		z : 0
	} ]), k( [ {
		x : 0,
		y : -1,
		z : 0
	}, {
		x : 0,
		y : 0,
		z : 0
	}, {
		x : 0,
		y : 1,
		z : 0
	} ]), k( [ {
		x : 0,
		y : 0,
		z : -1
	}, {
		x : 0,
		y : 0,
		z : 0
	}, {
		x : 0,
		y : 0,
		z : 1
	} ]) ], C = A.length, t = new Pre3d.RGBA(109 / 255, 194 / 255, 237 / 255, 1);
	h.ctx.lineWidth = 0.7;
//	p.addEventListener("touchend", function() {
//		setTimeout(function() {
//			f()
//		}, 50)
//	}, false);
	h.camera.focal_length = 2.5;
	DemoUtils.autoCamera(h, 0, 0, -3, 0.5, 0.5, 0, f, {
		panZOnMouseWheel : true,
		panZOnMouseWheelScale : 5,
		zAxisLimit : -1,
		touchDrawCallback : z
	});
	//alert(sss);
	//o("sqrt(0.01 - x^2 - y^2)", false);
	//f();
	u=sss;
	o(u, true);
	f();
	
	var i = document.getElementById("equationinput");
	i.value = u;
//	i.addEventListener("change", function() {
//		try {
//			o(this.value, true);
//			f()
//		} catch (a) {
//		}
//	}, false);
	document.getElementById("radio_xy").checked = true;
	document.getElementById("radio_xy").addEventListener("click", function() {
		s = r = true;
		l(j);
		f()
	}, false);
	document.getElementById("radio_x").addEventListener("click", function() {
		s = true;
		r = false;
		l(j);
		f()
	}, false);
	document.getElementById("radio_y").addEventListener("click", function() {
		s = false;
		r = true;
		l(j);
		f()
	}, false);
	p = document.getElementById("smoothcheck");
	p.checked = true;
	p.addEventListener("click", function() {
		q = this.checked;
		l(j);
		f()
	}, false);
	document.getElementById("ex_sinc").addEventListener("click", function(a) {
		i.value = u;
		o(i.value, true);
		f();
		a.preventDefault();
		return false
	}, false);
	document.getElementById("ex_exp").addEventListener("click", function(a) {
		i.value = "exp(-(x*3)^2)/3 + exp(-(y*3)^2)/3";
		o(i.value, true);
		f();
		a.preventDefault();
		return false
	}, false);
	document.getElementById("ex_dome").addEventListener("click", function(a) {
		i.value = "sqrt(1 - x^2 - y^2)";
		o(i.value, true);
		f();
		a.preventDefault();
		return false
	}, false);
	document.getElementById("helplink").addEventListener("click", function(a) {
		var c = document.getElementById("help");
		if (c.style.display !== "block") {
			c.style.display = "block";
			a.target.innerHTML = "Hide Help"
		} else {
			c.style.display = "none";
			a.target.innerHTML = "Help"
		}
		a.preventDefault();
		return false
	}, false)
};

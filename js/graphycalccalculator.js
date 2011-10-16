var GraphyCalcCalculator = function() {
	function k(a, c, b, h) {
		return {
			lbp : c,
			led : function(g, i) {
				this.left = g;
				this.right = i.expression(c - b, i);
				this.type = "op_b" + a;
				return this
			},
			nud : function(g) {
				if (h !== 1)
					throw "error in operator nud";
				this.left = g.expression(70, g);
				this.type = "op_u" + a;
				return this
			}
		}
	}
	function l(a) {
		return {
			type : "value",
			value : a,
			led : function() {
				throw "led called on a value token.";
			},
			nud : function() {
				return this
			}
		}
	}
	function m(a) {
		return {
			type : "function",
			value : a,
			led : function() {
				throw "Internal error: led called on a function.";
			},
			nud : function(c) {
				this.left = c.expression(70, c);
				return this
			}
		}
	}
	function n(a) {
		return {
			type : "variable",
			value : a,
			led : function() {
				throw "Internal error: led called on a variable.";
			},
			nud : function() {
				return this
			}
		}
	}
	function o(a) {
		for ( var c = [], b = 0, h = a.length, g = /^-?[0-9]+/, i = /^-?(([0-9]+\.[0-9]*)|(\.[0-9]+))/, p = /^[a-zA-Z_][a-zA-Z0-9_]*/; b < h;) {
			var d = a.slice(b), e;
			switch (d[0]) {
			case "+":
			case "-":
				c.push(k(d[0], 50, 0, 1));
				++b;
				continue;
			case "*":
			case "/":
				c.push(k(d[0], 60, 0, 0));
				++b;
				continue;
			case "^":
				c.push(k(d[0], 75, 1, 0));
				++b;
				continue;
			case ")":
				c.push( {
					type : ")",
					lbp : 0,
					led : function() {
						throw "Internal error: led called on ')'";
					},
					nud : function() {
						throw "Internal error: nud called on ')'";
					}
				});
				++b;
				continue;
			case "(":
				c.push( {
					type : "(",
					lbp : 80,
					led : function() {
						throw "Interal error, led called on '('";
					},
					nud : function(j) {
						var q = j.expression(0, j);
						if (j.token().type != ")")
							throw "Unmatched left parenthesis.";
						j.advance();
						return q
					}
				});
				++b;
				continue;
			case " ":
			case "\t":
			case "\r":
			case "\n":
				++b;
				continue;
			default:
			}
			if ((e = d.match(i)) !== null) {
				c.push(l(parseFloat(e[0])));
				b += e[0].length
			} else if ((e = d.match(g)) !== null) {
				c.push(l(parseInt(e[0])));
				b += e[0].length
			} else if ((e = d.match(p)) !== null) {
				if (e[0] == "x" || e[0] == "y")
					c.push(n(e[0]));
				else {
					d = r[e[0]];
					if (d !== undefined)
						c.push(m(d));
					else {
						d = s[e[0]];
						if (d !== undefined)
							c.push(l(d));
						else
							throw "unknown symbol " + e[0];
					}
				}
				b += e[0].length
			} else
				throw "Failed in processing input: " + d;
		}
		return c
	}
	function t(a) {
		a = {
			tokens : a,
			i : 0,
			at_end : function() {
				return this.i >= this.tokens.length
			},
			token : function() {
				if (this.at_end())
					return {
						lbp : 0,
						type : "end"
					};
				return this.tokens[this.i]
			},
			advance : function() {
				++this.i
			},
			expression : function(c, b) {
				if (!b.at_end()) {
					var h = b.token();
					b.advance();
					for ( var g = h.nud(b); c < b.token().lbp;) {
						h = b.token();
						b.advance();
						g = h.led(g, b)
					}
					return g
				}
			}
		};
		return a.expression(0, a)
	}
	function f(a, c, b) {
		if (a === undefined)
			throw "Error parsing input, probably invalid.";
		switch (a.type) {
		case "value":
			return a.value;
		case "variable":
			return a.value === "x" ? c : b;
		case "function":
			return a.value(f(a.left, c, b));
		case "op_u+":
			return f(a.left, c, b);
		case "op_b+":
			return f(a.left, c, b) + f(a.right, c, b);
		case "op_u-":
			return -f(a.left, c, b);
		case "op_b-":
			return f(a.left, c, b) - f(a.right, c, b);
		case "op_b*":
			return f(a.left, c, b) * f(a.right, c, b);
		case "op_b/":
			return f(a.left, c, b) / f(a.right, c, b);
		case "op_b^":
			return Math.pow(f(a.left, c, b), f(a.right, c, b));
		default:
			throw "Internal error, unhandled node: " + a.type + " " + a.value;
		}
	}
	var r = {
		abs : Math.abs,
		acos : Math.acos,
		asin : Math.asin,
		atan : Math.atan,
		ceil : Math.ceil,
		cos : Math.cos,
		exp : Math.exp,
		floor : Math.floor,
		log : Math.log,
		round : Math.round,
		sin : Math.sin,
		sinc : function(a) {
			return a == 0 ? 1 : Math.sin(a) / a
		},
		sqrt : Math.sqrt,
		tan : Math.tan
	}, s = {
		E : Math.E,
		e : Math.E,
		pi : Math.PI,
		PI : Math.PI
	};
	return {
		parse : function(a) {
			return t(o(a))
		},
		create_evaluator : function(a) {
			return function(c, b) {
				return f(a, c, b)
			}
		}
	}
}();

/***************************************************/
/*********Common classes and functions**************/
/***************************************************/

function Hash()
{
	this.length = 0;
	this.items = new Array();
	for (var i = 0; i < arguments.length; i += 2) {
		if (typeof(arguments[i + 1]) != 'undefined') {
			this.items[arguments[i]] = arguments[i + 1];
			this.length++;
		}
	}
   
	this.removeItem = function(in_key)
	{
		var tmp_previous;
		if (typeof(this.items[in_key]) != 'undefined') {
			this.length--;
			var tmp_previous = this.items[in_key];
			delete this.items[in_key];
		}
	   
		return tmp_previous;
	}

	this.getItem = function(in_key) {
		return this.items[in_key];
	}

	this.setItem = function(in_key, in_value)
	{
		var tmp_previous;
		if (typeof(in_value) != 'undefined') {
			if (typeof(this.items[in_key]) == 'undefined') {
				this.length++;
			}
			else {
				tmp_previous = this.items[in_key];
			}

			this.items[in_key] = in_value;
		}
	   
		return tmp_previous;
	}

	this.hasItem = function(in_key)
	{
		return typeof(this.items[in_key]) != 'undefined';
	}

	this.clear = function()
	{
		for (var i in this.items) {
			delete this.items[i];
		}

		this.length = 0;
	}
}


function Point(x,y) {
    this.x = (x === undefined)?0:x;
    this.y = (y === undefined)?0:y;
}

//p1: point1, p2: point2
function Link(p1,p2) {
	this.p1=new Point(p1.x,p1.y);
	this.p2=new Point(p2.x,p2.y);
}


function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.parentNode;
    }
    return new Point(_x,_y);
}


function findPosX(obj){
	var curleft = 0;
	if(obj.offsetParent)
		while(1){
			curleft += obj.offsetLeft;
			if(!obj.offsetParent)break;
			obj = obj.offsetParent;
		}
	else if(obj.x)curleft += obj.x;
	return curleft;
}


function findPosY(obj){
	var curtop = 0;
	if(obj.offsetParent)
		while(1){
			curtop += obj.offsetTop;
			if(!obj.offsetParent)break;
			obj = obj.offsetParent;
		}
	else if(obj.y)curtop += obj.y;
	return curtop;
}

function isNumber(s){
	//return typeof s === 'number' && isFinite(s);
	return !isNaN(parseFloat(s)) && isFinite(s);
	//return s-0 == s && s.length>0;
}



//Array.prototype.toXml = function(t){
//    var s = new Array(), i, l = this.length, v;
//    var t2 = (t.charAt(t.length-1)=='s')?t.substring(0,t.length-1):t;
//   
//    for(i=0;i<l;i++){
//        v = this[i];
//        switch (typeof v) {
//            case 'undefined':
//            case 'function':
//            case 'unknown':break;
//            case 'object':if(v!=null){s.push(v.toXml(t2));}break;
//            case 'string':v = v.toXml();
//            default:s.push('<'+t2+'>'+v+'');
//        }
//    }
//    if(s.length>1)return '<'+t+'>'+s.join('')+'';
//    return s;
//};
//
//Object.prototype.toXml = function(t){
//    var sa = new Array(''), se = new Array('');
//    if(!t) t=this._tagName||'object';
//   
//    for(var i in this){               
//        if (this.hasOwnProperty(i) && i.charAt(0)!='_') {
//            var v = this[i];
//            switch (typeof v) {
//                case 'undefined':
//                case 'function':
//                case 'unknown':break;
//                case 'object':if(v!=null){se.push(v.toXml(i));}break;
//                case 'string':v = v.toXml();
//                default: sa.push(' '+i+'="'+v+'"');
//            }
//        }
//    }
//    var s = se.join('');
//    return '<'+t+sa.join('')+((s!='')?'>'+s+'':'/>');
//};
//
//String.prototype.toXml = function(){
//    return this.replace('&','&amp;').
//      replace('<','&lt;').replace('>','&gt;').
//      replace('\'','&apos;').replace('"','&quot;');
//};


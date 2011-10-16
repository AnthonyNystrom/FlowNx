/***************************************************/
/*********Functions for managing Nodes *************/
/***************************************************/
function NodeData(){
	this.schemaId = null; //index that to identify each schema
	this.nodeType = ""; //to answer: function, operator ..; 1 or 2 input; Add or NumericResult node 

	this.nodeId = null; //index that to identify each node
	this.nodeLeftId = null; //id of left node
	this.nodeRightId = null; //id of right node
	this.parentNodeSId = new Array(); //array of parent ids
	
	this.nodeFormula = ""; //fomula generated base on both right and left fomula and node type itself
	this.nodeFormulaLeft = ""; //generated base on all subnodes
	this.nodeFormulaRight = ""; //generated base on all subnodes

	this.nodeComputeVal=""; //Computed value base on both lef and right subnodes
	this.nodeComputeValLef=""; //Computed value base on sub left node
	this.nodeComputeValRight=""; //Computed value base on sub right node
	
	this.nodeAssignVal=""; //Assigned value base on both lef and right subnodes
	this.nodeAssignValLeft=""; //Assigned value base on sub left node
	this.nodeAssignValRight=""; //Assigned value base on sub right node
	
	this.nodeDisplayVal=""; //Assigned value base on both lef and right subnodes
	this.nodeDisplayValLeft=""; //Assigned value base on sub left node
	this.nodeDisplayValRight=""; //Assigned value base on sub right node
	
	this.position=new Point(0,0); //Keeping the position of a node: top, left
	this.headderHeight=22; //Node height
	
	this.in1Position=new Point(0,0); //Keeping the position input1/LEFT input,  use to draw ENDING point of link
	this.in2Position=new Point(0,0); //Keeping the position input2/RIGHT input,  use to draw ENDING point of link
	this.outPosition=new Point(0,0); //Keeping the position output, use to draw STARTING point of link
	this.label="";
	
	this.bgColor="FFFFFF";
	this.titleColor1="888888";//"73716F";//266DBB
	this.titleColor2="FFFFFF";
	this.borderWidth="1";
	this.borderColor="BBBBBB";
	this.borderColorSelected="78FAFC";
	this.titleFontSize="12";
	this.titleFontColor="FFFFFF";
	this.contentFontSize="12";
	this.contentColor="000000";
	this.height=48;
	this.width=60;
	
	this.movable="yes";
	this.enable="yes";

	this.expressionText=""; //Text representing this node in an expression
	this.accExpressionText=""; //Text representing this node and ALL SUB node in an expression
	this.level="";
	
	this.getNodePosition = function(){
		return this.position;
	}
	
	//Check if this node is the PARENT of the given node (the context is within a set of given nodes)
	this.isParentOf = function(childNode,nodeList){
		var c=childNode;
		var p=this;
		if(c==null)return false;
		if(c.parentNodeSId.length==0) return false;
		for(var k=0; k<c.parentNodeSId.length;k++){
			if (c.parentNodeSId[k]==p.nodeId)return true;
		}
		for(var k=0; k<c.parentNodeSId.length;k++){
			if (p.isParentOf(nodes.getItem(c.parentNodeSId[k])))return true;
		}
		return false;
	}
	
	//Check if this node is a CHILD of a given node (the context is within a set of given nodes)
	this.isChildOf = function(parentNode,nodeList){
		var c=this;
		var p=parentNode;
		if(p==null)return false;
		if(c.parentNodeSId.length==0) return false;
		for(var k=0; k<c.parentNodeSId.length;k++){
			if (c.parentNodeSId[k]==p.nodeId)return true;
		}
		for(var k=0; k<c.parentNodeSId.length;k++){
			if (nodes.getItem(c.parentNodeSId[k]).isChildOf(p))return true;
		}
		return false;
	}
}

/*Check relation between two nodes (the context is within a set of global nodes list)*/
function isParentRelation(parentNode,childNode){
	var c=childNode;
	var p=parentNode;
	if(c==null)return false;
	if(c.parentNodeSId.length==0) return false;
	for(var k=0; k<c.parentNodeSId.length;k++){
		if (c.parentNodeSId[k]==p.nodeId)return true;
	}
	for(var k=0; k<c.parentNodeSId.length;k++){
		if (isParentRelation(p,nodes.getItem(c.parentNodeSId[k])))return true;
	}
	return false;
}

/*Check relation between two nodes (the context is within a set of global notes list)*/
function isChildRelation(childNode,parentNode){
	var c=childNode;
	var p=parentNode;
	if(p==null)return false;
	if(c.parentNodeSId.length==0) return false;
	for(var k=0; k<c.parentNodeSId.length;k++){
		if (c.parentNodeSId[k]==p.nodeId)return true;
	}
	for(var k=0; k<c.parentNodeSId.length;k++){
		if (isChildRelation(nodes.getItem(c.parentNodeSId[k]),p))return true;
	}
	return false;
}



//Compute value for the whole diagram 
function computeSchemaValue(nodes){
	ret ="";
	if (nodes == null)throw "NODE_LIST_NULL";
	if (!(nodes instanceof Hash))throw "HASH_OF_NODE_EXPECTED";
	if (nodes.length==0)return ret;

	//find root nodes in the nodes list
	var roots = findRootNodes();
	//dumpNodeList(roots);
	
	if (roots.length>1) throw "MULTIPLE_ROOT";
	var root=null;
	
	for (var k in roots.items){
		root= roots.items[k];
	}
	ret = computeVal4ANode(root,nodes);
	
	return ret;
}


//Compute value for a node 
function computeVal4ANode(n,nodeList){
	var ret = "[nodetypenotmatch]";
	if (n==null)throw "NODE_NULL";
	//if (!(n instanceof NodeData))throw "NODE_INSTANCE_EXPECTED";
	if(n.nodeType==PROGRAM_INPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM_OUTPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==NUMERIC_RESULT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM) throw "UNSUPPORT_NODE_TYPE";
	
	//this is a constant node logic or numeric
	if(havingNoInput(n)){
		//alert("no");
		ret =n.nodeComputeVal;
		return ret;
	}
	//this is a functin/operator with ONLY ONE parameter
	if(having1Input(n)){ 
		//alert("1");
		var ln  =nodeList.getItem(n.nodeLeftId);
		var s =computeVal4ANode(ln,nodeList);
		ret = evalueateNode(n,s);
		n.nodeComputeVal=ret;
		return ret;
	}
	//this is a functin/operator with TWO parameters
	if(having2Input(n)){
		//alert("2");		
		var ln  =nodeList.getItem(n.nodeLeftId);
		var sl =computeVal4ANode(ln,nodeList);
		
		var rn  =nodeList.getItem(n.nodeRightId);
		var sr =computeVal4ANode(rn,nodeList);
		ret = evalueateNode(n,sl,sr);
		
		n.nodeComputeVal=ret;
		return ret;
	}
	return ret;
}


//Generate expression for a give node list 
function generateScript(schema){
	var ret ="GENERATING!";
	var nodes = schema.nodes
	if (nodes == null)throw "NODE_LIST_NULL";
	if (!(nodes instanceof Hash))throw "HASH_OF_NODE_EXPECTED";
	if (nodes.length==0)return ret;
	
	//find root nodes in the nodes list
	var roots = findRootNodes();
	if( schema.rootNodes!=null) schema.rootNodes.clear();
	schema.rootNodes=roots;
	
	//Check root condition
	if (roots.length>1) throw "MULTIPLE_ROOT";
	var root=null;
	for (var k in roots.items){
		root= roots.items[k];
	}
	
	//Generate the main content
	ret = generateScript4ANode(root,nodes);
	
	
	
	//Main business
	ret ="ret="+ret+";";
	
	//Declare parameter
	var dcParams="";
	for (var k in nodes.items){
		var n= nodes.items[k];
		if(isParameter(n)){
			dcParams += "var " +n.expressionText+" ;";
		}
	}
	
	//Assign value for parameter
	var assignParams="";
	for (var k in nodes.items){
		var n= nodes.items[k];
		if(isParameter(n)){
			if(n.nodeType==PARAM_NUMBER_PI) assignParams += n.expressionText+"=Math.PI;";
			else if(n.nodeType==PARAM_NUMBER_E) assignParams += n.expressionText+"=Math.E;";
			else{
				assignParams += "if((parameters==undefined)||(parameters." + n.expressionText+ " == undefined)){";
				if(isNumericType(n)) assignParams +=n.expressionText+"=0;";
				else assignParams +=n.expressionText+"=false;";
				assignParams += "}else{"+
				n.expressionText+"= parameters."+n.expressionText+ " ;"+
				"}";
			}
		}
	}
	
	//Assemble fuction
	var beginFunction = 
		"/*This function is generated by flowNx*/ " +
		"function flowNxGenerateFunction(parameters){" +
			"var ret;";
	var endFunction = 
			"return ret;" +
		"}";
	
	
	return beginFunction+ dcParams+assignParams +ret+endFunction;
}


//Generate expression for a give node list 
function generateScript4ANode(n,nodeList){
	var ret = "";
	if (n==null)throw "NODE_NULL";
	//if (!(n instanceof NodeData))throw "NODE_INSTANCE_EXPECTED";
	if(n.nodeType==PROGRAM_INPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM_OUTPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==NUMERIC_RESULT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM) throw "UNSUPPORT_NODE_TYPE";
	
	//this is a constant node logic or numeric
	if(havingNoInput(n)){
		var ret="";
		var s =n.expressionText;
		if(isNumber(s)&& parseFloat(s)<0){
			ret = "("+s+")";
		}else{
			ret =s;
		}
		return ret;
	}
	//Out put is number
	if(!isOutputLogic(n)){
		//this is a functin/operator with ONLY ONE parameter
		if(having1Input(n)){ 
			var ln  =nodeList.getItem(n.nodeLeftId);
			var s =generateScript4ANode(ln,nodeList);
			if(n.nodeType==LOG10) ret="Math.log("+s+")/Math.log(10)";
			else ret = getNodeScript(n) + "("  + s + ")";
			return ret;
		}
		//this is a functin/operator with TWO parameters
		if(having2Input(n)){
			
			var ln  =nodeList.getItem(n.nodeLeftId);
			var sl =generateScript4ANode(ln,nodeList);
			
			var rn  =nodeList.getItem(n.nodeRightId);
			var sr =generateScript4ANode(rn,nodeList);
			
			if(isFunctionType(n)){
				if(n.nodeType==MOD){
					var operator = n.expressionText.trim();
					ret=wrapParenthese(sl,operator)+"%"+wrapParenthese(sr,operator);
				}else	ret = getNodeScript(n) + "("  + sl + "," + sr + ")";
			}else if(isOperatorType(n)){
				if(n.nodeType==POW) ret="Math.pow("+sl+","+sr+")";
				else{
					var operator = n.expressionText.trim();
					ret = wrapParenthese(sl,operator) + getNodeScript(n) + wrapParenthese(sr,operator);
				}
			}
			return ret;
		}
	//Output is logic
	}else{
		if(n.nodeType==NOT){
			var ln  =nodeList.getItem(n.nodeLeftId);
			var s =generateScript4ANode(ln,nodeList);
			return "!("+s+")";
		}else{
			var ln  =nodeList.getItem(n.nodeLeftId);
			var sl =generateScript4ANode(ln,nodeList);
			
			var rn  =nodeList.getItem(n.nodeRightId);
			var sr =generateScript4ANode(rn,nodeList);
			if(n.nodeType==XOR) return "(("+sl+") || ("+sr+")) && !(("+sl+") && ("+sr+"))";
			else return "("+sl+")" + getNodeScript(n) + "("+sr+")" ;
		}
	}
	return ret;
}


//Generate expression for a give node list 
function generateExpession(schema){
	var ret ="GENERATING!";
	var nodes = schema.nodes
	if (nodes == null)throw "NODE_LIST_NULL";
	if (!(nodes instanceof Hash))throw "HASH_OF_NODE_EXPECTED";
	if (nodes.length==0)return ret;

	//find root nodes in the nodes list
	var roots = findRootNodes();
	if( schema.rootNodes!=null) schema.rootNodes.clear();
	schema.rootNodes=roots;
	
	//dumpNodeList(roots);
	
	if (roots.length>1) throw "MULTIPLE_ROOT";
	var root=null;
	
	for (var k in roots.items){
		root= roots.items[k];
	}
	
	ret = generateExpession4ANode(root,nodes);
	ret = standardizeStr(ret);
	
	return ret;
}


//Generate expression for a give node list 
function generateExpession4ANode(n,nodeList){
	var ret = "[nodetypenotmatch]";
	if (n==null)throw "NODE_NULL";
	//if (!(n instanceof NodeData))throw "NODE_INSTANCE_EXPECTED";
	if(n.nodeType==PROGRAM_INPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM_OUTPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==NUMERIC_RESULT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM) throw "UNSUPPORT_NODE_TYPE";
	
	//this is a constant node logic or numeric
	if(havingNoInput(n)){
		var ret="";
		var s =n.expressionText;
		if(isNumber(s)&& parseFloat(s)<0){
			ret = "("+s+")";
		}else{
			ret =s;
		}
		n.accExpressionText=ret;
		return ret;
	}
	//this is a functin/operator with ONLY ONE parameter
	if(having1Input(n)){ 
		var ln  =nodeList.getItem(n.nodeLeftId);
		var s =generateExpession4ANode(ln,nodeList);
		ret = n.expressionText + "("  + s + ")";
		n.accExpressionText=ret;
		return ret;
	}
	//this is a functin/operator with TWO parameters
	if(having2Input(n)){
		
		var ln  =nodeList.getItem(n.nodeLeftId);
		var sl =generateExpession4ANode(ln,nodeList);
		
		var rn  =nodeList.getItem(n.nodeRightId);
		var sr =generateExpession4ANode(rn,nodeList);

		if(isFunctionType(n)){
			ret = n.expressionText + "("  + sl + "," + sr + ")";
		}else if(isOperatorType(n)){
			//ret = "("  + sl + n.expressionText + sr + ")";
			var operator = n.expressionText.trim();
			ret = wrapParenthese(sl,operator) + n.expressionText + wrapParenthese(sr,operator);
			//if(chrPos(ret,["+","-"])!=-1)ret = "("  + ret + ")";
		}
		n.accExpressionText=ret;
		return ret;
	}
	return ret;
}

//Apply operator need to wrap right/left operant with parenthese if need
function wrapParenthese(s,operator){
	var ret=s;
	if(operator=="^"){
		if(chrPos(s,["+","-"])!=-1 || chrPos(s,["*","/"])!=-1) ret = "("  + ret + ")";
	}else if(operator=="*" || operator=="/" ){
		if(chrPos(s,["+","-"])!=-1 ) ret = "("  + ret + ")";
	}
	return ret;
}



//Get current max node id, that help to create next node id for new node creation
function getNextNodeIdSequence(){
	return nodeIdSeq++ ;
}

//Find all node that has no parent and add them to a hash, consider that is a list of root nodes
function findRootNodes(ns){
	var roots = new Hash();
	var _nodes=null;
	if(ns==undefined) _nodes=nodes; else _nodes=ns;
	for (var k in _nodes.items){
		var n= _nodes.items[k];
		//alert("id:" + n.nodeId +" parent:"+n.parentNodeSId.length);
		if(n.parentNodeSId.length==0 ){
			roots.setItem(n.nodeId,n);
		} 
	}
	return roots
}

//Find all node that has no parent and add them to a hash, consider that is a list of root nodes
function refreshRootNodes(){
	rootNodes.clear();
	rootNodes=findRootNodes();
}

function createANodeFromToolBox(nType,p){
	//Update global nodeIdSeq by calling getNodeIdSequence()
	var newNodeId = getNextNodeIdSequence();
	n=new NodeData();
	n.schemaId = currentSchemaId; 
	n.nodeType = nType;
	n.nodeId = newNodeId;
	n.nodeLeftId = "";
	n.nodeRightId = "";
	n.position.x=p.x; //alert(p.x+":"+p.y);
	n.position.y=p.y;
	nodes.setItem(n.nodeId, n);

	//Calculate some implying data
	setNodeValue(n);
	setNodeAppearance(n);
	return n;
}


//Check if output from node 1 can be input to n2
function checkIfLinkAlow(n1,n2){
	if(n1.nodeId==n2.nodeId)return false;
	//Avoide RECURSIVE reference: if n1 already a parent or grand parent, grand grand parent of p2 then prevent n2 to be come parent of n1
	if(isParentRelation(n1,n2))return false;

	return checkNodeTypeMatch(n1,n2);
}
//Check type of two node are matched
function checkNodeTypeMatch(n1,n2){
	//const INPUT_BOOLEAN="inBool_";
	//const INPUT_NUMBER="inNum_";
	//const OUT_BOOLEAN="outBool_";
	//const OUT_NUMBER="outNum_";
	
	if(n1.nodeType.indexOf(OUT_NUMBER)>-1 && n2.nodeType.indexOf(IN_NUMBER)>-1) return true; 
	if(n1.nodeType.indexOf(OUT_BOOLEAN)>-1 && n2.nodeType.indexOf(IN_BOOLEAN)>-1) return true; 
}


//Calculate input, ouput position using for drawing starting poing and ending point of links
function setNodeAppearance(n){
	
	//Node width and height
	if(having1Input(n)){
		n.height=42;
		n.width=110;
	}
	if(having2Input(n)){
		n.height=60;
		n.width=110;
	}
	if(havingNoInput(n)){
		n.height=42;
		n.width=68;
	}
	if (isParameter(n)) n.width=68;
	//Input, output position to used to draw links
	calculateInOutPosition(n);
	
	//Node label
	setNodeLabel(n);

	//Node expression text
	setNodeExpressionText(n);
	
	//Node graph expression text
	//setNodeGraphExpressionText(n);
}

//Calculate/set node value for input, output. DONE ONLY WHEN NO INITALL VALUE GIVEN AS CREATION TIME
function setNodeValue(n){
	//alert(isInputType(n));
	if(isInputType(n)){
		if(isNumericType(n)){
			if(n.nodeDisplayVal==""){
				n.nodeAssignVal="0";
				n.nodeDisplayVal="0";
				n.nodeComputeVal="0";
				n.expressionText="0";
				n.accExpressionText="0";
			}
		}else if(isLogicType(n)){
			if(n.nodeDisplayVal==""){
				n.nodeAssignVal="false";
				n.nodeDisplayVal="false";
				n.nodeComputeVal="false";
				n.expressionText="false";
				n.accExpressionText="false"
			}
		}  
	}else{
		n.nodeDisplayVal="Result";	
	} 
	if(isParameter(n)){
		if(isNumericType(n)){
			if(n.nodeDisplayVal=="Result" ||n.nodeDisplayVal=="" ){
				n.nodeAssignVal="0";
				n.nodeDisplayVal="0";
				n.nodeComputeVal="0";
				n.expressionText="Parameter";
				n.accExpressionText="Parameter";
			}
			if(n.nodeType==PARAM_NUMBER_PI ){
				n.nodeAssignVal=Math.PI;
				n.nodeDisplayVal=Math.PI.toString().substr(0,9);
				n.nodeComputeVal=Math.PI;
				n.expressionText="PI";
				n.accExpressionText="PI";
				n.label="PI";
			}
			if(n.nodeType==PARAM_NUMBER_E ){
				n.nodeAssignVal=Math.E;
				n.nodeDisplayVal=Math.E.toString().substr(0,9);
				n.nodeComputeVal=Math.E;
				n.expressionText="E";
				n.accExpressionText="E";
				n.label="E";
			}
		}
		if(isLogicType(n)){
			if(n.nodeDisplayVal=="Result" ||n.nodeDisplayVal=="" ){
				n.nodeAssignVal="false";
				n.nodeDisplayVal="false";
				n.nodeComputeVal="false";
				n.expressionText="Parameter";
				n.accExpressionText="Parameter";
			}
		}
	} 

}


//Calculate input, ouput position using for drawing starting poing and ending point of links
function calculateInOutPosition(n){
	//output
	n.outPosition.x = n.position.x + parseInt(n.width);
	//if(isFunctionType(n)||isOperatorType(n))n.outPosition.x = n.position.x +100;
	//else n.outPosition.x = n.position.x +60;

	n.outPosition.y = n.position.y+n.headderHeight+6;
	
	//input 1
	n.in1Position.x = n.position.x;
	n.in1Position.y = n.position.y+n.headderHeight+6;
	
	//input 2
	n.in2Position.x = n.position.x;
	n.in2Position.y = n.position.y+n.headderHeight+26;
}


//For testing only globle nodes to generate links
function generateLinks1(){
	links.clear();
	links.setItem("2-1", new Link(new Point(100,200), new Point(200,100)));
	links.setItem("3-1", new Link(new Point(100,350), new Point(200,100)));
}

//Get node position
function getNodePosition(node){
	return node.position;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isParameter(n){
	var s = n.nodeType;;
	return s.indexOf("param_")>=0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isOperatorType(n){
	var s = n.nodeType;;
	return s.indexOf("operator_")>=0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isFunctionType(n){
	var s = n.nodeType;;
	return s.indexOf("function_")>=0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isNumericType(n){
	var s = n.nodeType;;
	return s.indexOf("number_")>0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isLogicType(n){
	var s = n.nodeType;;
	return s.indexOf("logic_")>0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isOutputLogic(n){
	var s = n.nodeType;;
	return s.indexOf("outBool_")>0;
}

//check if give node or give nodetype (string) is beloing 2-input node type
function isInputType(n){
	var s = n.nodeType;
	return s.indexOf("input_")>=0;
}


//check node is enable or not
function isEnable(n){
	return n.enable=="yes";
}

//check node is movable
function isMovable(n){
	return n.movable=="yes";
}

//check if give node or give nodetype (string) is beloing 2-input node type
function having2Input(n){
	var s = n.nodeType;;
	return s.indexOf("2_")>0;
}

//check if give node or give nodetype (string) is beloing 1-input node type
function having1Input(n){
	var s = n.nodeType;;
	return s.indexOf("1_")>0;
}

//check if give node or give nodetype (string) having no input; the param or input node type will past this test
function havingNoInput(n){
	var s = n.nodeType;;
	return s.indexOf("0_")>0;
}

//check if give node or give nodetype (string) is beloing 1-input node type
function setNodeLabel(n,s){
	var ret="";
	if(s===undefined){
		var ss=n.nodeType;
		if(ss==ABS) ret="ABS";
		if(ss==COS) ret="COS";
		if(ss==EXP) ret="EXP";
		if(ss==LOG) ret="LOG";
		if(ss==LOG10) ret="LOG10";
		if(ss==NOT) ret="NOT";
		if(ss==POW2) ret="POW2";
		if(ss==POW3) ret="POW3";
		if(ss==SIN) ret="SIN";
		if(ss==SQRT) ret="SQRT";
		if(ss==TAN) ret="TAN";
		if(ss==AND) ret="AND";
		if(ss==EQUAL) ret="EQUAL";
		if(ss==GREATER) ret="GREATER";
		if(ss==GREATER_EQUAL) ret="GREATER EQUAL";
		if(ss==LESS) ret="LESS";
		if(ss==LESS_EQUAL) ret="LESS EQUAL";
		if(ss==MAX) ret="MAX";
		if(ss==MIN) ret="MIN";
		if(ss==MOD) ret="MOD";
		if(ss==NOT_EQUAL) ret="NOT EQUAL";
		if(ss==OR) ret="OR";
		if(ss==POW) ret="POW";
		if(ss==XOR) ret="XOR";
		if(ss==ADD) ret="ADD";
		if(ss==DIVIDE) ret="DIVIDE";
		if(ss==MULTIPLE) ret="MULTIPLE";
		if(ss==SUBTRACT) ret="SUBTRACT";
		if(ss==INPUT_NUMBER) ret="Number";
		if(ss==INPUT_BOOLEAN) ret="Boolean";
		if(ss==PARAM_NUMBER) ret=n.expressionText;
		if(ss==PARAM_BOOLEAN) ret=n.expressionText;
		if(ss==PROGRAM_INPUT) ret="Program Input";
		if(ss==PROGRAM_OUTPUT) ret="Program Output";
		if(ss==NUMERIC_RESULT) ret="Numeric Result";
		if(ss==PROGRAM) ret="Program";
		
		if(ss==ASIN) ret="ATAN";
		if(ss==ATAN) ret="ASIN";
		if(ss==ACOS) ret="ACOS";
		if(ss==ROUND) ret="ROUND";
		if(ss==CEIL) ret="CEIL";
		if(ss==FLOOR) ret="FLOOR";
		if(ss==PARAM_NUMBER_E) ret="E";
		if(ss==PARAM_NUMBER_PI) ret="PI";
	}
	else{
		ret=s;
	}
	n.label=ret;
}

//check if give node or give nodetype (string) is beloing 1-input node type
function nodeLabel2NodeType(s){
	var ret="";
	var ss= s.trim().toUpperCase();
	if(ss=="ABS") ret=ABS;
	if(ss=="COS") ret=COS;
	if(ss=="EXP") ret=EXP;
	if(ss=="LOG") ret=LOG;
	if(ss=="LOG10") ret=LOG10;
	if(ss=="NOT") ret=NOT;
	if(ss=="POW2") ret=POW2;
	if(ss=="POW3") ret=POW3;
	if(ss=="SIN") ret=SIN;
	if(ss=="SQRT") ret=SQRT;
	if(ss=="TAN") ret=TAN;
	if(ss=="AND") ret=AND;
	if(ss=="EQUAL") ret=EQUAL;
	if(ss=="GREATER") ret=GREATER;
	if(ss=="GREATER_EQUAL") ret=GREATER_EQUAL;
	if(ss=="LESS") ret=LESS;
	if(ss=="LESS_EQUAL") ret=LESS_EQUAL;
	if(ss=="MAX") ret=MAX;
	if(ss=="MIN") ret=MIN;
	if(ss=="MOD") ret=MOD;
	if(ss=="NOT_EQUAL") ret=NOT_EQUAL;
	if(ss=="OR") ret=OR;
	if(ss=="POW") ret=POW;
	if(ss=="XOR") ret=XOR;
	if(ss=="ADD") ret=ADD;
	if(ss=="DIVIDE") ret=DIVIDE;
	if(ss=="MULTIPLE") ret=MULTIPLE;
	if(ss=="SUBTRACT") ret=SUBTRACT;
	if(ss=="INPUT_NUMBER") ret=INPUT_NUMBER;
	if(ss=="INPUT_BOOLEAN") ret=INPUT_BOOLEAN;
	if(ss=="PARAM_NUMBER") ret=PARAM_NUMBER;
	if(ss=="PARAM_BOOLEAN") ret=PARAM_BOOLEAN;
	if(ss=="PROGRAM_INPUT") ret=PROGRAM_INPUT;
	if(ss=="PROGRAM_OUTPUT") ret=PROGRAM_OUTPUT;
	if(ss=="NUMERIC_RESULT") ret=NUMERIC_RESULT;
	if(ss=="PROGRAM")  ret=PROGRAM;
	
	if(ss=="ASIN") ret=ATAN;
	if(ss=="ATAN") ret=ASIN;
	if(ss=="ACOS") ret=ACOS;
	if(ss=="ROUND") ret=ROUND;
	if(ss=="CEIL") ret=CEIL;
	if(ss=="FLOOR") ret=FLOOR;
	if(ss=="E") ret=PARAM_NUMBER_E;
	if(ss=="PI") ret=PARAM_NUMBER_PI;
	
	return ret;
}

//check if give node or give nodetype (string) is beloing 1-input node type
function setNodeExpressionText(n){
	var ret="";
	var ss=n.nodeType;
	if(ss==ABS) ret="ABS";
	if(ss==COS) ret="COS";
	if(ss==EXP) ret="EXP";
	if(ss==LOG) ret="LOG";
	if(ss==LOG10) ret="LOG10";
	if(ss==NOT) ret="NOT";
	if(ss==POW2) ret="POW2";
	if(ss==POW3) ret="POW3";
	if(ss==SIN) ret="SIN";
	if(ss==SQRT) ret="SQRT";
	if(ss==TAN) ret="TAN";
	if(ss==AND) ret="AND";
	if(ss==EQUAL) ret="EQUAL";
	if(ss==GREATER) ret="GREATER";
	if(ss==GREATER_EQUAL) ret="GREATER EQUAL";
	if(ss==LESS) ret="LESS";
	if(ss==LESS_EQUAL) ret="LESS EQUAL";
	if(ss==MAX) ret="MAX";
	if(ss==MIN) ret="MIN";
	if(ss==MOD) ret="MOD";
	if(ss==NOT_EQUAL) ret="NOT EQUAL";
	if(ss==OR) ret="OR";
	if(ss==POW) ret="^";
	if(ss==XOR) ret="XOR";
	if(ss==ADD) ret=" + ";
	if(ss==DIVIDE) ret=" / ";
	if(ss==MULTIPLE) ret=" * ";
	if(ss==SUBTRACT) ret=" - ";
	if(ss==INPUT_NUMBER) ret=n.nodeComputeVal;
	if(ss==INPUT_BOOLEAN) ret=n.nodeComputeVal;
	if(ss==PARAM_NUMBER) ret=n.expressionText;
	if(ss==PARAM_BOOLEAN) ret=n.expressionText;
	if(ss==PROGRAM_INPUT) ret="ProgramInput";
	if(ss==PROGRAM_OUTPUT) ret="ProgramOutput";
	if(ss==NUMERIC_RESULT) ret="NumericResult";
	if(ss==PROGRAM) ret="Program";
	
	if(ss==ASIN) ret="ATAN";
	if(ss==ATAN) ret="ASIN";
	if(ss==ACOS) ret="ACOS";
	if(ss==ROUND) ret="ROUND";
	if(ss==CEIL) ret="CEIL";
	if(ss==FLOOR) ret="FLOOR";
	if(ss==PARAM_NUMBER_E) ret="E";
	if(ss==PARAM_NUMBER_PI) ret="PI";
	
	n.expressionText=ret;
}

//evalute node base on the input value of right and left node
function getNodeScript(n){
	var ret="";
	ss=n.nodeType;
	if(ss==ABS) ret="Math.abs";
	if(ss==COS) ret="Math.cos";
	if(ss==EXP) ret="Math.exp";
	if(ss==LOG) ret="Math.log";
	//if(ss==LOG10) ret="Math.log";
	//if(ss==NOT) ret=";
	if(ss==SIN) ret="Math.sin";
	if(ss==SQRT) ret="Math.sqrt"; 
	if(ss==TAN) ret="Math.tan"; 
	if(ss==AND) ret=" && ";
	if(ss==EQUAL) ret=" == "; 
	if(ss==GREATER) ret=" > ";
	if(ss==GREATER_EQUAL) ret=" >= ";
	if(ss==LESS) ret=" < ";
	if(ss==LESS_EQUAL) ret=" <= ";
	if(ss==MAX) ret="Math.max";
	if(ss==MIN) ret="Math.min"; 
	//if(ss==MOD) ret=";
	if(ss==NOT_EQUAL) ret=" != ";
	if(ss==OR) ret=" || ";
	//if(ss==XOR) ret=";               
	//if(ss==POW) ret="Math.pow";
	if(ss==ADD) ret="+";
	if(ss==DIVIDE) ret= "/";
	if(ss==MULTIPLE) ret= "*";
	if(ss==SUBTRACT) ret="-"; 
	//if(ss==INPUT_NUMBER) ret=n.nodeComputeVal;
	//if(ss==INPUT_BOOLEAN) ret=n.nodeComputeVal;
	//if(ss==PARAM_NUMBER) ret=n.nodeComputeVal;
	//if(ss==PARAM_BOOLEAN) ret=n.nodeComputeVal;
	//if(ss==PROGRAM_INPUT) ret="ProgramInput";
	//if(ss==PROGRAM_OUTPUT) ret="ProgramOutput";
	//if(ss==NUMERIC_RESULT) ret="NumericResult";
	//if(ss==PROGRAM) ret="Program";
	
	if(ss==ASIN) ret="Math.asin"; 
	if(ss==ATAN) ret="Math.atan";
	if(ss==ACOS) ret="Math.acos"; 
	if(ss==ROUND) ret="Math.round";
	if(ss==CEIL) ret="Math.ceil"; 
	if(ss==FLOOR) ret="Math.floor"; 
	//if(ss==PARAM_NUMBER_E) ret="Math.E";
	//if(ss==PARAM_NUMBER_PI) ret="Math.PI";
	
	//alert("id:"+n.nodeId +"_left:"+sl +" _right:"+sr +"_value:"+ret);
	return ret;
}
//evalute node base on the input value of right and left node
function evalueateNode(n,sl,sr){
	var ret="";
	if(n.nodeType.indexOf(IN_NUMBER)>-1){
		if(sl!=undefined)sl=parseFloat(sl);
		if(sr!=undefined)sr=parseFloat(sr);
	}else{
		if(sl!=undefined)sl=(sl=="true")?true:false;
		if(sr!=undefined)sr=(sr=="true")?true:false;
	}
	ss=n.nodeType;
	if(ss==ABS) ret=Math.abs(sl);
	if(ss==COS) ret=Math.cos(sl);
	if(ss==EXP) ret=Math.exp(sl);
	if(ss==LOG) ret=Math.log(sl);
	if(ss==LOG10) ret=Math.log(sl)/Math.log(10);
	if(ss==NOT) ret=(sl=="true")?false:true;
	if(ss==POW2) ret=Math.pow(sl,2);
	if(ss==POW3) ret=Math.pow(sl,3);
	if(ss==SIN) ret=Math.sin(sl);
	if(ss==SQRT) ret=Math.sqrt(sl);
	if(ss==TAN) ret=Math.tan(sl);
	if(ss==AND) ret=sl && sr;
	if(ss==EQUAL) ret=(sl==sr);
	if(ss==GREATER) ret=(sl>sr);
	if(ss==GREATER_EQUAL) ret=(sl>=sr);
	if(ss==LESS) ret=(sl<sr);
	if(ss==LESS_EQUAL) ret=(sl<=sr);
	if(ss==MAX) ret=Math.max(sl,sr);
	if(ss==MIN) ret=Math.min(sl,sr);
	if(ss==MOD) ret=(sl % sr);
	if(ss==NOT_EQUAL) ret=!(sl==sr);
	if(ss==OR) ret=(sl || sr);
	if(ss==POW) ret=Math.pow(sl,sr);
	if(ss==XOR) ret=(sl || sr) && !(sl && sr);
	if(ss==ADD) ret=(sl+sr);
	if(ss==DIVIDE) ret= (sl/sr);
	if(ss==MULTIPLE) ret= (sl*sr);
	if(ss==SUBTRACT) ret=(sl-sr);
	if(ss==INPUT_NUMBER) ret=n.nodeComputeVal;
	if(ss==INPUT_BOOLEAN) ret=n.nodeComputeVal;
	if(ss==PARAM_NUMBER) ret=n.nodeComputeVal;
	if(ss==PARAM_BOOLEAN) ret=n.nodeComputeVal;
	if(ss==PROGRAM_INPUT) ret="ProgramInput";
	if(ss==PROGRAM_OUTPUT) ret="ProgramOutput";
	if(ss==NUMERIC_RESULT) ret="NumericResult";
	if(ss==PROGRAM) ret="Program";
	
	if(ss==ASIN) ret=Math.asin(sl);
	if(ss==ATAN) ret=Math.atan(sl);
	if(ss==ACOS) ret=Math.acos(sl);
	if(ss==ROUND) ret=Math.round(sl);
	if(ss==CEIL) ret=Math.ceil(sl);
	if(ss==FLOOR) ret=Math.floor(sl);
	if(ss==PARAM_NUMBER_E) ret=Math.E;
	if(ss==PARAM_NUMBER_PI) ret=Math.PI;
	
	//alert("id:"+n.nodeId +"_left:"+sl +" _right:"+sr +"_value:"+ret);
	return ret;
}

////check if give node or give nodetype (string) is beloing 1-input node type
//function setNodeGraphExpressionText(n){
//	var ret="";
//	var ss=n.nodeType;
//	if(ss==ABS) ret="abs";
//	if(ss==COS) ret="cos";
//	if(ss==EXP) ret="exp";
//	if(ss==LOG) ret="log";
//	//if(ss==LOG10) ret="LOG10"; //Note support check on the beginning
//	//if(ss==NOT) ret="NOT";
//	if(ss==POW2) ret="^2";
//	if(ss==POW3) ret="^3";
//	if(ss==SIN) ret="sin";
//	if(ss==SQRT) ret="sqrt";
//	if(ss==TAN) ret="tan";
//	//if(ss==AND) ret="AND";
//	//if(ss==EQUAL) ret="EQUAL";
//	//if(ss==GREATER) ret="GREATER";
//	//if(ss==GREATER_EQUAL) ret="GREATER EQUAL";
//	//if(ss==LESS) ret="LESS";
//	//if(ss==LESS_EQUAL) ret="LESS EQUAL";
//	//if(ss==MAX) ret="MAX";
//	//if(ss==MIN) ret="MIN";
//	//if(ss==MOD) ret="MOD";
//	//if(ss==NOT_EQUAL) ret="NOT EQUAL";
//	//if(ss==OR) ret="OR";
//	if(ss==POW) ret="^";
//	//if(ss==XOR) ret="XOR";
//	if(ss==ADD) ret=" + ";
//	if(ss==DIVIDE) ret=" / ";
//	if(ss==MULTIPLE) ret=" * ";
//	if(ss==SUBTRACT) ret=" - ";
//	if(ss==INPUT_NUMBER) ret="0";
//	//if(ss==INPUT_BOOLEAN) ret=n.nodeComputeVal;
//	if(ss==PARAM_NUMBER) ret="x";
//	//if(ss==PARAM_BOOLEAN) ret=n.nodeComputeVal;
//	//if(ss==PROGRAM_INPUT) ret="ProgramInput";
//	//if(ss==PROGRAM_OUTPUT) ret="ProgramOutput";
//	//if(ss==NUMERIC_RESULT) ret="NumericResult";
//	//if(ss==PROGRAM) ret="Program";
//	
//	n.expressionText=ret;
//}


/*Dump the given node list*/
function dumpNodeList(lst){
	var s="dumpNodeList: ";
	for (var k in lst.items){
		var n= lst.items[k];
			s+="n:"+n.nodeId;
			s+="\n";
	}
	alert(s);
}

/*Node type processing error handler */
function nodeErrHandeler(e){
	if(e=="NODE_LIST_NULL"){				printOutput("The schema is empty.");
	}else if(e=="HASH_OF_NODE_EXPECTED"){	printOutput("List of node is corrupted. Notify host owner of this error.");
	}else if(e=="MULTIPLE_ROOT"){			printOutput("Too many root nodes. The schema should have only one root node.");
	}else if(e=="NODE_NULL"){				printOutput("Some argument for functions or operator are missing. Recheck the diagram.");
	}else if(e=="NODE_INSTANCE_EXPECTED"){	printOutput("Node type is corrupted. Notify host owner of this error");
	}else if(e=="UNSUPPORT_NODE_TYPE"){		printOutput("Schema contain unsupported node type. The later version the more node types are supported.");

	}else if(e=="INVALID_DATA_TYPE_BOOLEAN"){printOutput("Graph support only numeric data.");
	}else if(e=="UNSUPPORT_FUNCTION_LOG10"){printOutput("Graph does not support function 'LOG10'.");
	}else if(e=="UNSUPPORT_FUNCTION_MAX"){	printOutput("Graph does not support function 'MAX'.");
	}else if(e=="UNSUPPORT_FUNCTION_MIN"){	printOutput("Graph does not support function 'MIN'.");
	}else if(e=="UNSUPPORT_FUNCTION_MOD"){	printOutput("Graph does not support function 'MOD'.");
	}else if(e=="ONLY_X_OR_Y_PARAMETER_ACCEPTED"){printOutput("Graph supports only 3D, thus only accepts 'X' parameter and(or) 'Y' parameter. Graph does not support multi-dimension");
	}
}

//Generate expression for a give node list 
function generateGraphExpession(nodes){
	ret ="GENERATING!";
	if (nodes == null)throw "NODE_LIST_NULL";
	if (!(nodes instanceof Hash))throw "HASH_OF_NODE_EXPECTED";
	if (nodes.length==0)return ret;

	//find root nodes in the nodes list
	var roots = findRootNodes();
	//dumpNodeList(roots);
	
	if (roots.length>1) throw "MULTIPLE_ROOT";
	var root=null;
	
	for (var k in roots.items){
		root= roots.items[k];
	}
	
	ret = generateGraphExpession4ANode(root,nodes);
	
	return ret.toLowerCase();
}


//Generate expression for a give node list 
function generateGraphExpession4ANode(n,nodeList){
	var ret = "[nodetypenotmatch]";
	if (n==null)throw "NODE_NULL";
	//if (!(n instanceof NodeData))throw "NODE_INSTANCE_EXPECTED";
	if(n.nodeType==PROGRAM_INPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM_OUTPUT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==NUMERIC_RESULT) throw "UNSUPPORT_NODE_TYPE";
	if(n.nodeType==PROGRAM) throw "UNSUPPORT_NODE_TYPE";
	//Node type that is not support
	if(isLogicType(n)|| isOutputLogic(n)) throw "INVALID_DATA_TYPE_BOOLEAN";
	if(n.nodeType==LOG10) throw "UNSUPPORT_FUNCTION_LOG10";
	if(n.nodeType==MAX) throw "UNSUPPORT_FUNCTION_MAX";
	if(n.nodeType==MIN) throw "UNSUPPORT_FUNCTION_MIN";
	if(n.nodeType==MOD) throw "UNSUPPORT_FUNCTION_MOD";
	
	//this is a constant node logic or numeric
	if(havingNoInput(n)){
		var ret =n.expressionText;
		ret=ret.trim().toLowerCase(); 
		if(isParameter(n)){
			if(n.nodeType==PARAM_NUMBER_PI) ret=Math.PI;
			else if(n.nodeType==PARAM_NUMBER_E )ret=Math.E;
			else if(ret!="x" && ret!="y" )throw "ONLY_X_OR_Y_PARAMETER_ACCEPTED";
		}
		n.accExpressionText=ret;
		return ret;
	}
	//this is a functin/operator with ONLY ONE parameter
	if(having1Input(n)){ 
		var ln  =nodeList.getItem(n.nodeLeftId);
		var s =generateGraphExpession4ANode(ln,nodeList);
		if(n.nodeType==POW2){
			ret = "("  + s + ")" + "^2" ;//x^2 , x^3; x is the result from left node 
		}else if(n.nodeType==POW3 ){
			ret = "("  + s + ")" + "^3" ; 
		}else {
			ret = n.expressionText + "("  + s + ")";
		}
		n.accExpressionText=ret;
		return ret;
	}
	//this is a functin/operator with TWO parameters
	if(having2Input(n)){
		
		var ln  =nodeList.getItem(n.nodeLeftId);
		var sl =generateGraphExpession4ANode(ln,nodeList);
		
		var rn  =nodeList.getItem(n.nodeRightId);
		var sr =generateGraphExpession4ANode(rn,nodeList);

		if(isFunctionType(n)){
			if(n.nodeType==POW){
				ret = "("  + sl + "^" + sr + ")";// x^y;
			}else{
				ret = n.expressionText + "("  + sl + "," + sr + ")";
			}
		}else if(isOperatorType(n)){
			ret = "("  + sl + n.expressionText + sr + ")";
			var operator=n.expressionText.trim();
			ret = wrapParenthese(sl,operator) + n.expressionText + wrapParenthese(sr,operator);
		}
		n.accExpressionText=ret;
		return ret;
	}
	return ret;
}

//Agregate same parameter on diagram into one
function agregateParam(schema){
	var nodes=schema.nodes;
	var params=new Hash();
	var s="";
	for (var k in nodes.items){
		var n= nodes.items[k];
		if(isParameter(n)){
			//if new param add to param list
			if(!params.hasItem(n.label)){
				params.setItem(n.label, n);
				//n.width=60; calculateInOutPosition(n);
			//If the param already exist on the list
			}else{
				var param = params.getItem(n.label);
				for(var ii=0;ii<n.parentNodeSId.length;ii++){
					var p = nodes.getItem(n.parentNodeSId[ii]);
					if(p.nodeRightId==n.nodeId)p.nodeRightId = param.nodeId; 
					if(p.nodeLeftId==n.nodeId)p.nodeLeftId = param.nodeId;
					param.parentNodeSId.push(p.nodeId);
					nodes.removeItem(n.nodeId);
				}
			}
		}
	}
}


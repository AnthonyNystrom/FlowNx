/***************************************************/
/*********Function for managing Diagram ************/
/***************************************************/

//common.js required => common classes and functions
//sytem.js required => for global variables and configuration
//This contain most function using for create and manipulate canvas

//Caculate current diagram position store it to the Global variable; diagram is fix 0:0 inside div#diagramContainer

//Keep the current selected left or right input of a load, Use to identify which input (left/right) that user is currenttly selected.




/*Apply properties value. Used when user agree to apply new properties values  to current selected node*/
function applyPropertiesVals(){
	if(!($("#nodePropertiesList").is(":hidden"))){
		
		nId=currentNode.nodeId;
		
		//Check if any mofication is made(Only enable button to call this function if change available. So simple skip this check)
		//Done! see line above
		
		//Update node model
		prop2Node();
		
		
		//Remove current node on the screen
		//Draw new node from model
		//Remove all nodes. Should not deal with one node because changing the properties leading to re redraw ling
		$("div#diagram").html("");
		
		//Base on global nodes generate links data
		generateLinks(rootNodes,nodes);
		
		//Draw all nodes and add drag action basing on global nodes
		drawNodes();
		
		//Draw all links basing on global links 
		drawLinks();
	
		//Set it to be current node
		//Done!, actually all node under the model is still there intact
		
		//Set it to be selected node
		$("div#node"+nId).addClass("node-selected");
	}else{
		var schema = schemas.getItem(currentSchemaId);
		prop2Schema(schema);
		schema2View(schema);
	}
}


/*Apply properties value. Used when user agree to apply new properties values  to current selected node*/
function cancelPropertiesVals(){
	nId=currentNode.nodeId;

	//Read current node attribute to fill in the properties box
	node2Prop();
}


/*Getting data from properties box to update to currently selected node'model*/
function prop2Node(){
	currentNode.bgColor=        $("input#n_bgColor").attr("value");
	currentNode.titleColor1=    $("input#n_titleColor1").attr("value");
	currentNode.titleColor2=    $("input#n_titleColor2").attr("value");
	currentNode.borderWidth=    $("input#n_borderWidth").attr("value");
	currentNode.borderColor=    $("input#n_borderColor").attr("value");
	currentNode.titleFontSize=  $("input#n_titleFontSize").attr("value")
	currentNode.titleFontColor= $("input#n_titleFontColor").attr("value")
	currentNode.contentFontSize=$("input#n_contentFontSize").attr("value");
	currentNode.contentColor=   $("input#n_contentColor").attr("value");
	currentNode.height=         $("input#n_height").attr("value");
	currentNode.width=          $("input#n_width").attr("value");
	currentNode.movable=       $("input#n_Movable").attr("value");
	currentNode.enable=         $("input#n_Enable").attr("value");
	currentNode.movable=(document.getElementById("n_Movable").selectedIndex==0)?"yes":"no";
	currentNode.enable=(document.getElementById("n_Enable").selectedIndex==0)?"yes":"no";
	if(currentNode.enable=="no"){
		$(".disableList").addClass("activeDisableList").removeClass("hide");
		$("div#n_Operation_Disable").css("top","16px").css("height","16px");
	}else{
		$(".disableList").removeClass("activeDisableList").addClass("hide");;
	}
	if(isInputType(currentNode)){
		var sTmp = $("input#n_assignedVal").attr("value");
		currentNode.nodeAssignVal=sTmp;
		currentNode.nodeDisplayVal=sTmp;
		currentNode.nodeComputeVal=sTmp;
		var sTmp = $("input#n_expressionText").attr("value");
		currentNode.expressionText=sTmp;
		currentNode.accExpressionText=sTmp;
	}
	if(isParameter(currentNode)){
		var sTmp = $("input#n_assignedVal").attr("value");
		currentNode.nodeAssignVal=sTmp;
		currentNode.nodeComputeVal=sTmp;
		currentNode.nodeDisplayVal=sTmp;
		var sTmp = $("input#n_expressionText").attr("value");
		currentNode.expressionText=sTmp;
		currentNode.accExpressionText=sTmp;
		currentNode.label=sTmp;
	}
}


/*Getting data from currently selected node'model to update to properties box */
function node2Prop(){
	//Set value for porperties input
	$("input#n_bgColor").attr        ("value",currentNode.bgColor        );
	$("input#n_titleColor1").attr    ("value",currentNode.titleColor1    );
	$("input#n_titleColor2").attr    ("value",currentNode.titleColor2    );
	$("input#n_borderWidth").attr    ("value",currentNode.borderWidth    );
	$("input#n_borderColor").attr    ("value",currentNode.borderColor    );
	$("input#n_titleFontSize").attr  ("value",currentNode.titleFontSize  );
	$("input#n_titleFontColor").attr ("value",currentNode.titleFontColor );
	$("input#n_contentFontSize").attr("value",currentNode.contentFontSize);
	$("input#n_contentColor").attr   ("value",currentNode.contentColor   );
	$("input#n_height").attr         ("value",currentNode.height         );
	$("input#n_width").attr          ("value",currentNode.width          );
	$("input#n_Movable").attr       ("value",currentNode.movable       );
	$("input#n_Enable").attr         ("value",currentNode.enable         );
	$("input#n_assignedVal").attr    ("value",currentNode.nodeAssignVal  );
	$("input#n_computeVal").attr     ("value",currentNode.nodeComputeVal );
	$("input#n_expressionText").attr ("value",currentNode.expressionText );
	if(isInputType(currentNode)){
		$("input#n_assignedVal").each(function(){
			this.disabled = false;
		});
	}else{
		$("input#n_assignedVal").attr("disabled","true");
	}
	
	document.getElementById("n_Movable").selectedIndex =(currentNode.movable=="yes")?0:1;
	document.getElementById("n_Enable").selectedIndex =(currentNode.enable=="yes")?0:1;
	if(currentNode.enable=="no"){
		$(".disableList").addClass("activeDisableList").removeClass("hide");
		$("div#n_Operation_Disable").css("top","16px");
		$("div#n_Operation_Disable").css("height","16px");
	}else{
		$(".disableList").removeClass("activeDisableList").addClass("hide");;
	}
	
	//Show the color on properties input
	$("input#n_bgColor").css        ("background","#"+currentNode.bgColor        );
	$("input#n_titleColor1").css    ("background","#"+currentNode.titleColor1    );
	$("input#n_titleColor2").css    ("background","#"+currentNode.titleColor2    );
	$("input#n_borderColor").css    ("background","#"+currentNode.borderColor    );
	$("input#n_titleFontColor").css ("background","#"+currentNode.titleFontColor );
	$("input#n_contentColor").css   ("background","#"+currentNode.contentColor   );
	
	//if(isParameter(currentNode)){
	var el=document.getElementById("n_expressionText");
	if(isParameter(currentNode)) el.disabled=false;
	else el.disabled=true;
	if(currentNode.nodeType==PARAM_NUMBER_PI ||currentNode.nodeType==PARAM_NUMBER_E ) el.disabled=true;

}



/*Getting data from properties box to update to the schema*/
function prop2Schema(schema){
	schema.title=        $("input#p_title").attr("value");
	schema.bgColor=    $("input#p_bgColor").attr("value");
	schema.enable=(document.getElementById("p_Enable").selectedIndex==0)?"yes":"no";
}

/*Getting data from a schema to show on the properties box */
function schema2Prop(schema){
	//Set value for porperties input
	$("input#p_title").attr("value",schema.title);
	$("input#p_bgColor").attr("value",schema.bgColor);
	$("input#p_bgColor").css("background","#"+schema.bgColor);
	document.getElementById("p_Enable").selectedIndex =(schema.enable =="yes")?0:1;
}

/*Getting data from a schema to show on the properties box */
function schema2View(schema){
	$("li#schema_"+schema.id).text(schema.title);
	$("#contentBgColor").css("background","#"+schema.bgColor );
	
	//Lock the content by covering it with lockDiagram div
	if(schema.enable=="no"){
		$('#lockDiagram').show();
		$('#pagePropertiesList .disableList').show();
		$('#pageData .disableList').show();
		
	}else{ 
		$('#lockDiagram').hide();
		$('#pagePropertiesList .disableList').hide();
		$('#pageData .disableList').hide();
	}
}


function updateCurrentDiagramPosition(){
	$("div#diagramContainer").each(function(){
		diagramPosition.x = parseInt($(this).css("left"));
		diagramPosition.y = parseInt($(this).css("top"));
	});
}

//Create divs corespondign to each node
function drawNodes(){
	//Clear the screen
	$("#diagram").html("");
	
	for (var k in nodes.items){
		var n= nodes.items[k];
		drawANode(n);
	}
	//Add all nessary action to nodes
	addNodeActions();
}


//Add all nessary action to nodes
function addNodeActions(){
	//Drag action allow node to be move around on screen
	addDragAction();
	
	//This action used to make node to be come most front
	addNodeSelectAction();
	
	//This action used to Link node's output ot other input
	addLinkInputOutputAction();

	//This action used to delete node
	addDeleteAction();
}

//This action used to delete node
function addDeleteAction(){
	$(".node").keypress(function(event){
		if(event.keyCode==9)alert("delete?");
	});
}
//Link node's output ot other input 
function addLinkInputOutputAction(){
	//Link previously selected input to this ouput
	$("div.node div.parent").click(function(){
		//A note needs input
		if(currentSelectedInput.inputType!=""){ //{inputType:"left/right",nodeId:"id"}
			var n1 = null; //This node
			var n1Id = $(this).parent().parent().attr("id").substr(4); //.parent.nodeContent.Node
			n1=nodes.getItem(n1Id);
			
			var n2= null; // Node from current selected
			var n2Id = currentSelectedInput.nodeId;
			n2=nodes.getItem(n2Id);
			
			if(checkIfLinkAlow(n1,n2)){ 
			//if(false){
				//alert("OK");
				
				//Create link under data between 2 node
				n1.parentNodeSId.push(n2.nodeId);
				
				var preNodeId="";
				//Keep the old vesion and Update new value for Left child, or Right child
				if(currentSelectedInput.inputType.indexOf("left")>-1){//Note that some other class also added so just check if it contains class of "left"
					preNodeId = n2.nodeLeftId;
					n2.nodeLeftId = n1.nodeId;
				}else{
					preNodeId = n2.nodeRightId;
					n2.nodeRightId = n1.nodeId;
				} 

				//Update the node (of old version) that it does not have corresponding father 
				if(preNodeId){
					var preNode=nodes.getItem(preNodeId);
					preNode.parentNodeSId.pop(n2.nodeId);
					//Check if current child becom root node
					if(preNode.parentNodeSId.length==0)rootNodes.setItem(preNode.nodeId, preNode);
				} 
				
				//Drawlink on the screen
				//Base on global nodes generate links data
				links.clear();
				links=generateLinks(rootNodes,nodes);
				//dumpLink(null);
				
				//Draw all nodes and add drag action basing on global nodes
				//drawNodes();
				
				//Draw all links basing on global links 
				drawLinks();
			}
		}
		
		//Clear the select after process
		currentSelectedInput.inputType="";
		$("div.left,div.right").removeClass("input-selected");
		//$('#output1').html("");
	});
	
	//Selecting left/right input when click on them
	$("div.node div.left,div.node div.right").click(function(e){
		var event = e || window.event;
		
		//Main proccess here
		var sClass=$(this).attr("class");
		currentSelectedInput.inputType=sClass;
		var nId = $(this).parent().parent().attr("id").substr(4); //node86
		currentSelectedInput.nodeId=nId;
		//$('#schema2ExpressionTxt').html(currentSelectedInput.inputType+"::"+currentSelectedInput.nodeId);
		
		//Stop propagation to prevent conflict
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
		
	});
	
	//DE-Selecting left/right input when click on the diagram on the other node'area
	$("div#diagram, div.node").click(function(e){
		var event = e || window.event;
		
		//Main proccess here
		currentSelectedInput.inputType="";
		$("div.left,div.right").removeClass("input-selected");
		$('#output1').html("");
		
		//Stop propagation to prevent conflict
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	});
	//DIAGRAM CLICK show the page's properties page and remove selectin
	$("div#diagram").click(function(e){
		$("div.node").removeClass("node-selected");
		currentNode = null;
		
		//Show properties box for page/tab
		$("div#nodePropertiesList").addClass("hide");
		$("div#pagePropertiesList").removeClass("hide");
		
		//Sink down the height of the properties box 
		//$("div#properties").css("height","208px");
	});
}

function dumpLink(el){
	var s="";
	for (var k in links.items){
		var l= links.items[k];
		s+="K:"+k+":::";
		s+="p1:"+l.p1.x +":"+l.p1.y;
		s+="p2:"+l.p2.x +":"+l.p2.y;
		s+="\n";
	}
	alert(s);
}
function dumpNodePosition(el){
	var s="";
	for (var k in nodes.items){
		var n= nodes.items[k];
		s+="id:"+n.nodeId+"---x:"+n.position.x+"---y:"+n.position.y;
		s+="\n";
	}
	$(el).text(s);
}
function dumpNodeOutPosition(el){
	var s="";
	for (var k in nodes.items){
		var n= nodes.items[k];
		s+="id:"+n.nodeId+"---x:"+n.outPosition.x+"---y:"+n.outPosition.y;
		s+="\n";
	}
	$(el).text(s);
}

//Determin the GLOBAL CURRENT NODE that user is focusing on , used to redraw link of node if use drag node around
//Create mouse down action for each node, use to move node to be come most front
function addNodeSelectAction(){
	$("div.node").mousedown(function(){
		var nid=this.id.substr(4);
		currentNode=nodes.getItem(nid);
		$("div#output1").text("addNodeSelectAction:"+currentNode.nodeId);
		currentNodeWrapper =$("wrap"+nid)[0];
		$("div.node").css("z-index",1000);
		$(this).css("z-index",1001);
		
		//Show properties box for node
		$("div#nodePropertiesList").removeClass("hide");
		$("div#pagePropertiesList").addClass("hide");
		
		//Expand down the height of the properties box 
		//$("div#properties").css("height","368px");
		
		$("div.node").removeClass("node-selected");
		$(this).addClass("node-selected");
		
		//Read current node attribute to fill in the properties box; currunt node is assign when mouse down (same time with this event)
		node2Prop();
		
		//dumpLink(document.getElementById("output2"));
		//dumpNodePosition(document.getElementById("output2"));
		//dumpNodeOutPosition(document.getElementById("output2"));
	});

	//Auto expand properties if node clicked
	$("div.node").dblclick(function(e){
		var event = e || window.event;
		w=window.innerWidth; 
		l=parseInt($("#properties").css("left"));
		$("#properties").animate({left: w-300-6+"px",top:"2px"},200);
		window.getSelection().removeAllRanges();
		//if(w-l<300)	$("#properties").animate({left: w-300+"px",top:"2px"  }, 1000 );
		//if(w-l==300) $("#properties").animate({left: w+"px",top:"2px"  }, 1000 );
		if(event.stopPropagation) event.stopPropagation(); else event.cancelBubble=true;
	});


	$("div.left,div.right").click(function(){
		$("div.left,div.right").removeClass("input-selected");
		$(this).addClass("input-selected");
	});
}


//Create divs corespondign to each node
function drawANode(node){
	var nid="node"+node.nodeId;
	var wid="wrap"+node.nodeId;
	var p =node.position;
	nodeStyle="";
	nodeStyle +="height:"+node.height+"px;";
	nodeStyle +="width:"+node.width+"px;";

	//Appearance of the node
	var bgColor= node.bgColor ;
	//var borderWidth= node.borderWidth ;
	//var borderColor= node.borderColor ;
	var contentFontSize= node.contentFontSize ;
	var contentColor= node.contentColor ;
	nodeStyle +="background: #"+bgColor+";";
	//nodeStyle +="border-width:"+borderWidth+"px;";
	//nodeStyle +="border-color: #"+borderColor+";";
	nodeStyle +="font-size: "+contentFontSize+"px;";
	nodeStyle +="color: #"+contentColor+";";


	//Appearance of the title
	var titleColor1= node.titleColor1 ;
	var titleColor2= node.titleColor2 ;
	var titleFontSize= node.titleFontSize ;
	var titleFontColor= node.titleFontColor ;
	titleStyle="";
	//titleStyle +="background:-webkit-gradient(linear,left top,right top,color-stop(0.1, red),color-stop(0.8, white));";
	//titleStyle +="background:-webkit-gradient(linear,left top, right top,color-stop(0, #"+titleColor1+"),color-stop(1, #"+titleColor2+"));";
	//titleStyle +="background:-moz-linear-gradient(left center, #"+titleColor1+", #"+titleColor2+");";
	titleStyle +="background:#"+titleColor1+";";
	titleStyle +="font-size: "+titleFontSize+"px;";
	titleStyle +="color: #"+titleFontColor+";";
	titleStyle += (node.enable=="yes" && node.movable=="yes")?"cursor: move;":"cursor: default;";

	if(havingNoInput(node)){
		var displayInputStyleLeft="display:none;";
		var displayInputStyleRight="display:none;";
	}else if(having1Input(node)){
		var displayInputStyleRight="display:none;";
	} 
	var nodeFlag="";
	if(node.enable=="no"){
		nodeFlag="<img src='images/locked-node.png' alt='lock' />";
	}else if(node.movable=="no"){
		nodeFlag="<img src='images/pined-node.png' alt='lock' />";
	}
	
	
	var displayValInput = node.nodeDisplayVal;
	s="	<div id='"+wid+"' style='position:absolute;left:"+p.x+"px;top:"+p.y+"px;' class='nodeWrapper'>"+
			"<div id='"+nid+"' class='node' style='"+nodeStyle+"' >"+
				"<div class='nodeHeader' style='"+titleStyle+"' ><span>"+node.label+"</span><div class='nodeFlag'>"+nodeFlag+"</div></div>"+
				"<div class='nodeContent'>"+
					"<div class='parent'><span>"+displayValInput+"<</span></div>"+
					"<div style='"+displayInputStyleLeft+"' class='left'><span>>ValueA</span></div>"+
					"<div style='"+displayInputStyleRight+"' class='right'><span>>ValueB</span></div>"+
				"</div>"+
			"</div>"+
		"</div>";
	$("#diagram").append(s);
}


//Add drag action to nodes
function addDragAction(){
	$("div.node").each(function(){
		var nId=this.id.substr(4);
		var n=nodes.getItem(nId);
		if(isEnable(n)&& isMovable(n)){
			$(this).draggable({
				drag:function(event,el){
					var nid="node"+currentNode.nodeId;
					var wid="wrap"+currentNode.nodeId;
					var x =  parseInt($("#"+wid).css("left"));
					var y =  parseInt($("#"+wid).css("top"));
					var w =  parseInt($("#"+wid).css("width"));
					var h =  parseInt($("#"+wid).css("height"));
					var maxX=window.innerWidth;
					var maxY=window.innerHeight;

					if(el.position.left<-x)el.position.left = -x+5; //left most
					if(el.position.left>maxX-x-w-5)el.position.left = maxX-x-w-5;//right most
					//if(el.position.left>maxX-x-w-5) return false; //cancel event
					if(el.position.top<-y)el.position.top = -y+5;//up most
					if(el.position.top>maxY-y-h-215)el.position.top = maxY-y-h-215;//down most //193 for header, nav bar, bottom bar
					
					currentNode.position.x=el.position.left+x;
					currentNode.position.y=el.position.top+y;
					calculateInOutPosition(currentNode);
					links.clear();
					links=generateLinks(rootNodes,nodes);
					drawLinks();//el change position leadding to redraw all links
					}
				,handle:"div.nodeHeader"
				,scroll: false
			});
		}
	})
}

//Draw All flexible arrowed link (link between block item on screen)
function drawLinks(){
	//alert("drawLinks:");
	//dumpLink(null);
	
	//Clear canvas before draw
	var h=diagramCanvas.height;
	var w=diagramCanvas.width;
	ctx.clearRect(0,0,w,h);
	//Draw all links
	for (var k in links.items){
		var l= links.items[k];
		drawALink(l)
	}
}


//Draw flexible arrowed link (link between block item on screen)
function drawALink(link){
	var p1=link.p1;
	var p2 =link.p2;
	var l1=30;
	var l2=30;

	var x1=p1.x;
	var y1=p1.y;
	
	var x2=p2.x;
	var y2=p2.y;

	var xm=(x1+x2)/2;
	var ym=(y1+y2)/2;

	var xmc=x1+l1;
	var ymc=y1;

	var xc2=x2-l2;
	var yc2=y2;

	var oldvalue = ctx.lineWidth;
	ctx.lineWidth =oldvalue*2;
	
	var oldStroke = ctx.strokeStyle;
	ctx.strokeStyle ="#666";
//    ctx.beginPath();
//    ctx.moveTo(x1,y1); 
//    ctx.quadraticCurveTo(x1+2,y1+5,x1+5,y1); 
//    ctx.quadraticCurveTo(xmc,ymc,xm+2,ym+2); 
//    ctx.quadraticCurveTo(xc2,yc2+5,x2,y2); 
//    ctx.stroke();
//	ctx.strokeStyle =oldStroke;
	
    ctx.beginPath();
    ctx.moveTo(x1,y1); 
    ctx.quadraticCurveTo(x1+2,y1,x1+5,y1); 
    ctx.quadraticCurveTo(xmc,ymc,xm,ym); 
    ctx.quadraticCurveTo(xc2,yc2,x2,y2); 
    ctx.stroke();

    ctx.lineWidth =oldvalue;

    drawTriangle(p2,ctx);
}


//Get position of an element projecting on canvas, useful in case the div containing the element is not sharply overlap the canvas
function posOnCanvas(e){
	var p = getOffset(e);
	return{x:p.x-canvasPos.x, y:p.y-canvasPos.y};
}
	

//Just for testing the function of drawing arrow
function testDrawShape(){
	if (diagramCanvas.getContext){
		var ctx = diagramCanvas.getContext('2d');
		ctx.clearRect(0,0,diagramCanvas.width,diagramCanvas.height );
		
		var p1= new Point(150,150);
		var p2= new Point(200,200);
		drawLink(p1,p2,ctx);
		
		p2= new Point(230,100);
		drawLink(p1,p2,ctx);
		
		p2= new Point(30,100);
		drawLink(p1,p2,ctx);
		
		p2= new Point(10,200);
		drawLink(p1,p2,ctx);
	}else{
		alert('You need Safari or Firefox 1.5+ to see this demo.');
	}
}

//Util fuction
function drawCircle(p,r){
	if (diagramCanvas.getContext){
		r=(r===undefined)?50:r;
		var ctx = diagramCanvas.getContext('2d');
		var x=p.x;
		var y=p.y
		ctx.arc(x,y,r,0,Math.PI*2,true)
	}else{
		alert('You need Safari or Firefox 1.5+ to see this demo.');
	}
}


//Draw arrow head. will be use for link
function drawTriangle(p,ctx){
	var x=p.x;
	var y=p.y;
	ctx.beginPath();  
	ctx.moveTo(x,y);  
	ctx.lineTo(x-5,y-5);  
	ctx.lineTo(x-5,y+5);
	ctx.lineTo(x,y);  
	ctx.fill();
}

//this is an object to store data as user intending to link 2 node on the screen
function CurrentSelectedInput(inputType,nodeId){
	this.inputType=inputType;
	this.nodeId=nodeId;
}



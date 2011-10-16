/***************************************************/
/*********Functions, action of the site ************/
/***************************************************/
var diagramClickMonitor = 0;
$(document).ready(function(){
	initApp();
	//defaultSchema=new SchemaData();
	
	//loadSchema(defaultSchema,"data.xml");
	resizeContent();
	$("#schema2ExpressionTxt input").val("sqrt(1 - x^2 - y^2)");
	expression2SchemaAction();
	schemas.getItem(currentSchemaId).title="Unsaved Schema";
	$("#schema_"+currentSchemaId).text("Unsaved Schema");
	//Attach schema to global schema list
	//schemas.setItem(defaultSchema.id,defaultSchema);
	//currentSchemaId = defaultSchema.id;
	//showSchema(defaultSchema,true);
	
	//==========================CREATE NODE FROM TOOL BOX===============================
	//Disable slection use for drag and drop action
	$("div.toolItem").disableSelection();
	
	//Start drag action
	$("div.toolItem").mousedown(function(e){
		//Change cursor
		$("#addingNode").show();
		
		//Keep node type because use seem want to add new node
		var s=this.id;
		addingNodeType=s;
		//$('#output1').html(s);
	});
	//Cancel drag action
	$("div.toolItem").mouseup(function(e){
		//Reset cursor to default
		$("#addingNode").hide();
		
		//Clear adding node because use change their my NOT want to add new node
		addingNodeType="";
	});
	
	//Drop action on the diagram to create new node
	$("div#diagram").mouseup(function(e){
		if (addingNodeType !="" ){
			var tp=getOffset($("#diagramContainer")[0]);
			var x=e.pageX-tp.x; if (x<0)x=0;
			var y=e.pageY-tp.y; if (y<0)y=0;
			//Create a new node data 
			p=new Point(x,y);
			nType=addingNodeType;
			var newNode = createANodeFromToolBox(nType,p);
			
			//Draw the newly created node
			drawANode(newNode);
			
			//Newly created one does not have parent -> consider as a root
			rootNodes.setItem(newNode.nodeId,newNode);
			
			//Add all nessary action to nodes
			addNodeActions();
			
			//Reset cursor to default
			$("#addingNode").hide();
	
			//Clear adding node after finish adding, prepare for the next
			addingNodeType="";
		}
	});


	//==========================TOOL BOX COLAPSE/EXPAND===============================
	//Colapse/expand nodes inside toolbox
	$("div.toolList").disableSelection();
	$("div.toolList").click(function(){
		s=$(this).children("p").text();
		if($("div#"+s).is(":hidden"))$("div#"+s).slideDown();
		else	$("div#"+s).slideUp();
		$(this).toggleClass("colapse");
	});
	
	//Animate in, out the whole toolbox
	$("#toolBoxHandle").disableSelection();
	$("div#toolBoxHandle").dblclick(function(){
		$("#toolBox").animate({left: "-154px",top:"2px"  }, 1000 );
	});
	$("div#toolBoxHandle").click(function(){
		var l =parseInt($("#toolBox").css("left"));
		if(l==-154)$("#toolBox").animate({left: "2px",top:"2px"  }, 500 );
		else if(l==2)$("#toolBox").animate({left: "-154px",top:"2px"  }, 500 );
		else if(l>=-75 && l<75)	$("#toolBox").animate({left: "2px",top:"2px"  }, 500 );
		else if(l<-75) $("#toolBox").animate({left: "-154px",top:"2px"  }, 500 );
	});
	
	//Close the toolbox, for old version only
	$("div#toolBoxClose").click(function(){
		var s = "div#toolBoxContent";
		if($(s).is(":hidden")){
			$(s).slideDown();
			$(this).removeClass("openDown").addClass("closeUp");
		}else{
			$(s).slideUp();
			$(this).removeClass("closeUp").addClass("openDown");
		}
	});
	

	//==========================PROPERTIES BOX COLAPSE/EXPAND===============================
	//Colapse/expand nodes inside properties box
	$("div.propertiesList, div.propItemTitle").disableSelection();
	$("div.propertiesList").click(function(){
		s=$(this).children("p").text();
		
		if($(this).parent().attr("id")=="pagePropertiesList") s="page"+s;
		
		if($("div#"+s).is(":hidden"))$("div#"+s).slideDown();
		else	$("div#"+s).slideUp();
		$(this).toggleClass("colapse");
	});

	//Animate in, out the whole toolbox
	$("#propBoxHandle").disableSelection();
	$("div#propBoxHandle").dblclick(function(){
		$("#properties").animate({left: w+"px",top:"2px"  }, 1000 );
	});
	$("div#propBoxHandle").click(function(e){
		var event = e || window.event;
		w=window.innerWidth; 
		l=parseInt($("#properties").css("left"));
		if(l==w)	$("#properties").animate({left: w-300-6+"px",top:"2px"  }, 500 );
		else if(l==w-300-6) $("#properties").animate({left: w+"px",top:"2px"  }, 500 );
		else if(l>w-150) $("#properties").animate({left: w+"px",top:"2px"  }, 500 );
		else if(l<=w-150 && l>w-450)$("#properties").animate({left: w-300-6+"px",top:"2px"  }, 500 );
		//Stop propagation to prevent conflict
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	});
	$("#properties").animate({left: window.innerWidth+"px",top:"2px"  }, 10 );
	
	//Close the toolbox, for old version only
	$("div#propBoxClose").click(function(){
		var s = "div#propBoxContent";
		if($(s).is(":hidden")){
			$(s).slideDown();
			$(this).removeClass("openDown").addClass("closeUp");
		}else{
			$(s).slideUp();
			$(this).removeClass("closeUp").addClass("openDown");
		}
	});

	//Apply properties values
	$("#applyProp").click(function(){
		applyPropertiesVals();	
	});
	
	//Cancel properties values
	$("#cancelProp").click(function(){
		cancelPropertiesVals();	
	});
	
	//Animate Apply/Cancel button
	$("#applyProp , #cancelProp").mousedown(function(){
		$(this).removeClass("normalBtn").addClass("clickBtn");
	});
	$("#applyProp , #cancelProp").mouseup(function(){
		$(this).removeClass("clickBtn").addClass("normalBtn");
	});
	

	//==========================SCHEMA COMMAND BUTTON===============================
	//create new schema
	$("#newSchema").click(function(){
		$( "#dialogWrapper" ).fadeIn("slow");
		$( "#newSchemaDailog" ).dialog( "open" );
	})
	//Close/delete schema
	$("#deleteSchema").click(function(){
		$( "#dialogWrapper" ).fadeIn("slow");
		$( "#deleteSchemaDailog" ).dialog( "open" );
	})
	//save schema
	$("#saveSchema").click(function(){
		$( "#dialogWrapper" ).fadeIn("slow");
		$( "#saveSchemaDailog" ).dialog( "open" );
	})
	//load schema
	$("#openSchema").click(function(){
		$( "#dialogWrapper" ).fadeIn("slow");
		$( "#openSchemaDialog" ).dialog( "open" );//	openSchema(sName);
	})
	
	
	
	//==========================SCHEMA OPERATION===============================
	//generate graph from schema
	$("div#schema2GraphBtn").click(function(){
		//generate graph expression. This is different from the generate normal expression: Alredy ensure only parameter x and/or y accepted 
		if(nodes.length==0){
			errorMsg="Diagram is empty!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
			}
		try{
			var ret = generateGraphExpession(nodes);
			$("div#schema2ExpressionTxt input").val(ret);
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#grapContainer" ).dialog( "open" );
			tctGval=ret.toLowerCase();
			start3d(tctGval);
		}
		catch(e){
			nodeErrHandeler(e);
		}
	});

	//generate expression from schema
	$("div#schema2ExpressionBtn").click(function(){
		if(nodes.length==0){alert("Diagram is empty!"); exit;}
		try{
			var ret = generateExpession(schemas.getItem(currentSchemaId));
			$("div#schema2ExpressionTxt input").val(ret);

//			var schema = schemas.getItem(currentSchemaId);
//			if(links!=null && links instanceof Hash)links.clear();
//			links = generateLinks(schema.rootNodes, schema.nodes);
		}
		catch(e){
			nodeErrHandeler(e);
		}
	})
	//comput value from schema
	$("div#schema2ValBtn").click(function(){
		if(nodes.length==0){alert("Diagram is empty!"); exit;}
		try{
			var ret = computeSchemaValue(nodes);
			$("div#schema2ExpressionTxt input").val(ret);
		}
		catch(e){
			nodeErrHandeler(e);
		}
	})
	
	//generate  schema from expression
	$("div#expression2SchemaBtn").click(function(){
		expression2SchemaAction();
	})

	//generate javascript from schema
	$("div#schema2ScriptBtn").click(function(){
		if(nodes.length==0){alert("Diagram is empty!"); exit;}
		try{
			//var ret = generateExpession(schemas.getItem(currentSchemaId));
			var ret = generateScript(schemas.getItem(currentSchemaId));
		    
			//document.getElementById('scriptGeneratedContent').disabled = true;
		    var js_source =ret.replace(/^\s+/, '');
		    var sTmp = js_beautify((js_source), {
		            indent_size: 1,
		            indent_char: '\t',
		            preserve_newlines:true,
		            braces_on_own_line: false,
		            keep_array_indentation:true,
		            space_after_anon_function:true});

		    ret = "<code class='language-javascript' id='scriptGeneratedContent'>" + sTmp+ "</code>"			
			$("#scriptGeneratedContent").remove();
			$("#generateJavascript").append(ret);
			
			
			$("#scriptGeneratedContent").syntaxHighlight();
			
			//Show up
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#generateJavascript" ).dialog( "open" );
		}
		catch(e){
			nodeErrHandeler(e);
		}
		
		$("#scriptGeneratedContent").dblclick(function(){
			autoSelect(this);
		});
		$("#selectAllCode").disableSelection();
//		var schema = schemas.getItem(currentSchemaId);
//		if(links!=null && links instanceof Hash)links.clear();
//		links = generateLinks(schema.rootNodes, schema.nodes);
		
	});

	//==========================NODE COMMAND BUTTON===============================
	addNodeCmdBtnAction();


	//==========================WINDOW RESIZE===============================
	$(window).resize(function() {
		//User resize after open, make sure content fitting in to window
		resizeContent();
	});
	
	//Opening time, make sure content fitting in to window
	resizeContent();

	
	//==========================SHOW PROPERTIES PAGE AS DBLCLICK ON CANVAS===============================
	var clicktimer;
	$("div#diagram").disableSelection();
	$("div#diagram").click(function(e) {
	    e= window.event || e;
	    //Double clickk -> show the properties tab
	    if(clicktimer){
	        clearTimeout(clicktimer);
	        clicktimer= null;
	        
	        //$("div#schema2ExpressionTxt").html("you double");
			w=window.innerWidth; 
			l=parseInt($("#properties").css("left"));
			$("#properties").animate({"left": w-300-6+"px"},200);
			//$("#properties").css("left", w-300-6+"px");
			window.getSelection().removeAllRanges();
	    }
	    
	    //Singgle click-> hide the properties tab
	    else clicktimer= setTimeout(function(e){
	        clicktimer= null;
	        
	        //$("div#schema2ExpressionTxt").html("you single");
			w=window.innerWidth; 
			l=parseInt($("#properties").css("left"));
			$("#properties").animate({"left": w+"px"},1000);
			//$("#properties").css("left", w+"px");
			
	    },300);
	});
	
	//==========================UTIL ACTION===============================
	$("div.movableBox").draggable({
		drag:function(event,el){;}
		,handle:".event"
		,scroll:false
	});
	
	$("div#logo").disableSelection();
	
	$(document).mousemove(function(e){
	     $("#addingNode").css('left', e.pageX - 20).css('top', e.pageY + 7);
	     //$('#output .boxContent').html("X Axis : " + e.pageX + "	 Y Axis : " + e.pageY);
	});

	//About dialog
	$("a#about").click(function(){
		$( "#dialogWrapper" ).fadeIn("slow");
		$( "#aboutDialog" ).dialog( "open" );
		$("#aboutDialog a").blur();
		$("#aboutTxt p").focus();
	})

	//Scroll tab thumbnail action
	$("#thumbScrollLeft").click(function(){
		scrollTabs("left");
	})
	$("#thumbScrollRight").click(function(){
		scrollTabs("right");
	})
	
	$("#newSchema,#openSchema,#saveSchema,#deleteSchema, #schema2GraphBtn, #schema2ExpressionBtn,#expression2SchemaBtn,#schema2ValBtn,#schema2ScriptBtn").tipsy({fade: true, gravity: 'se',opacity:1});
	$("#copy,#paste,#cut").tipsy({fade: true, gravity: 'sw',opacity:1});
});

/*Scroll tab thumbnail*/
function scrollTabs(direction){
	var tabs=$("#tabThumbnail");//content
	var newL=0;
	var curL =parseInt(tabs.css("left"));
	var w = parseInt($("#thumbList").css("width"));//viewport
	curL = -curL;
	if(direction == "right")curL +=w;

	var p=0;
	var accW=0;
	$("#thumbList li").each(function(index){
		accW += this.offsetWidth+2;
		if(accW>=curL){
			p=index;
			return false;
		}
	});
	//scroll to left
	if(direction=="left"){
		p -=1;
		newL=0;
		$("#thumbList li").each(function(index){
			if(index<=p)newL += this.offsetWidth+2;
			else return false;
		});
		newL= -newL;
		tabs.animate({"left":newL+"px"},"fast");
		
		//once sroll left -> enable scroll right
		$("#thumbScrollRight").show();

		//If at the leftmost -> disable scroll left
		if(newL==0)$("#thumbScrollLeft").hide();
	//scroll to right
	}else{
		if(accW==curL) p+=1;
		newL=0;
		$("#thumbList li").each(function(index){
			if(index<=p)newL += this.offsetWidth+2;
			else return false;
		});
		newL= -newL+w;
		tabs.animate({"left":newL+"px"},"fast");

		//once sroll right -> enable scroll left
		$("#thumbScrollLeft").show();
		
		//If at the right most -> disable scroll right
		var totalW=0;
		$("#thumbList li").each(function(index){
			totalW += this.offsetWidth+2;
		});
		if(-newL+w ==totalW )$("#thumbScrollRight").hide();
	}
}

/*Resize content to fit when resizing window*/
function resizeContent(){
	var w=window.innerWidth;
	var h=window.innerHeight - 204;
	$('#contentContainer, #diagram, #lockDiagram,#contentBgColor').css("width", w+"px").css("height", h+"px");
	$("#properties").css("left", w+"px");
	$("#graphOption").show();
	$("#tabThumbnailContainer").css("width", w-200+"px");
	$("#thumbList").css("width", w-236+"px");
}

/*Tabthumbnail action: hover, click*/
function addTabActions(){
	$("#tabThumbnail li").disableSelection();
	
	//Show corresponding schema and Turn tab to blue when selected
	$("#tabThumbnail li").click(function(){
		$("#tabThumbnail li").removeClass("activeTab");
		$(this).addClass("activeTab");
		currentSchemaId = this.id.substr(7);
		var curSchema=schemas.getItem(currentSchemaId);
		showSchema(curSchema);
		//Showing the accExpression
		var rns=curSchema.rootNodes;
		for(var k in rns.items){
			var rn=rns.items[k];
			break;
		}
		var expression= rn==undefined?"":rn.accExpressionText;
		$("#schema2ExpressionTxt input").val(expression.toLowerCase());

	})

	//Highligh when hoving
	$("#tabThumbnail li").hover(
		function(){
			$(this).addClass("hover");
			}
		,function(){	
			$(this).removeClass("hover");
			}
		)
		
};	

/*Display give schema to screen */
function showSchema(schema,justAdded){
	//ONLY show tab
	if(justAdded == undefined){
		//Show new schema
		initSchema(schema);
		if(links!=null && links instanceof Hash)links.clear();
		links = generateLinks(schema.rootNodes, schema.nodes);
		drawSchema(schema);

		$("#tabThumbnail li").removeClass("activeTab");
		$("#schema_"+schema.id).addClass("activeTab");
	//Include create new tab
	}else{
		//create new tab
		$("#tabThumbnail").append("<li id='schema_"+schema.id+"' class='activeTab'>"+schema.title+"</li>");

		//Show scroll if need and make sure new one is shown
		var w = parseInt($("#thumbList").css("width"));//viewport
		var accW=0;
		$("#thumbList li").each(function(index){
			accW += this.offsetWidth+2;
		});
		
		if(accW>w){
			$("#thumbScrollLeft").show();
			//make sure new one is shown
			$("#tabThumbnail").animate({"left":w-accW+"px"},"fast");
		}else{
			$("#thumbScrollLeft, #thumbScrollRight").hide();
		}
		
		//switch tab to new one
		$("#tabThumbnail li").removeClass("activeTab");
		$("#schema_"+schema.id).addClass("activeTab");
		
		//Show new schema
		initSchema(schema);
		drawSchema(schema);
		
		//Action for new tab
		addTabActions();
		
		$("#tabThumbnail li").disableSelection();
	}
	schema2Prop(schema);
	schema2View(schema);
}

/*Actions for note command button: COPY, PASTE, DELETE*/
function addNodeCmdBtnAction(){
	//---CUT action this is DELETE action---
	$("#cut").click(function(){
		//Check condition
		if(schemas.getItem(currentSchemaId).enable!="yes"){
			errorMsg="Diagram is disable!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
			}
		if(nodes.length==0){
			errorMsg="Diagram is empty!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
		}
		if(currentNode==null){
			errorMsg="No node slected, select targeted node for action.";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
				return false;
			}
		
		curId=currentNode.nodeId;
		//Delete from root node list if exist
		if(rootNodes.getItem(curId)!=undefined){
			rootNodes.removeItem(curId);
		}
		
		//Update relation to right child if any
		var nId=currentNode.nodeRightId;
		if(nId!=null && nId!=""){
			var n =nodes.getItem(nId); 
			for(var i=0;i<n.parentNodeSId.length;i++){
				if(n.parentNodeSId[i]==curId)n.parentNodeSId.splice(i,1);
			}
			//If right child dose not have any more parent then it become root
			if(n.parentNodeSId.length==0)rootNodes.setItem(nId,n);

		}
		//Update relation to left child if any
		var nId=currentNode.nodeLeftId;
		if(nId!=null  && nId!=""){
			var n =nodes.getItem(nId);
			for(var i=0;i<n.parentNodeSId.length;i++){
				if(n.parentNodeSId[i]==curId)n.parentNodeSId.splice(i,1);
			}
			//If left child dose not have any more parent then it become root
			if(n.parentNodeSId.length==0)rootNodes.setItem(nId,n);
		}
		//Remove relation from some parents to this node
		for(var i=0;i<currentNode.parentNodeSId.length;i++){
			var p=nodes.getItem(currentNode.parentNodeSId[i]);
			if(p.nodeLeftId==curId)p.nodeLeftId="";
			if(p.nodeRightId==curId)p.nodeRightId="";
		}

		//Delete this node
		nodes.removeItem(curId);
		
		links.clear();
		links=generateLinks(rootNodes,nodes);
		drawSchema(schemas.getItem(currentSchemaId));
		currentNode=null;
	});

	//---COPY action, accompany with paste action---
	$("#copy").click(function(){
		//Check condition
		if(schemas.getItem(currentSchemaId).enable!="yes"){
			errorMsg="Diagram is disable!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
			}
		if(nodes.length==0){
			errorMsg="Diagram is empty!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
			}
		if(currentNode==null){
			errorMsg="No node slected, select targeted node for action.";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
				return false;
			}
		//Put to clipbroad 
		clipBoard=currentNode;
			
	});
	//---PASTE action, accompany with copy action---
	$("#paste").click(function(){
		//Check condition
		if(schemas.getItem(currentSchemaId).enable!="yes"){
			errorMsg="Diagram is disable!";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
			return false;
			}
		if(clipBoard==null){
			errorMsg="Clipboard is empty.";
			$( "#dialogWrapper" ).fadeIn("slow");
			$( "#noNodeSelectionErr" ).dialog( "open" );
				return false;
			}
		//crete new
		var n = new NodeData();
		var c=clipBoard;
		
		//Copy data to new node
		n.nodeType = c.nodeType; 
		n.label = c.label;

		n.nodeAssignVal=c.nodeAssignVal; 
		n.nodeAssignValLeft=c.nodeAssignValLeft;
		n.nodeAssignValRight=c.nodeAssignValRight;
		
		n.nodeFormula = c.nodeFormula;
		n.nodeFormulaLeft = c.nodeFormulaLeft;
		n.nodeFormulaRight = c.nodeFormulaRight;

		n.nodeComputeVal= c.nodeComputeVal;
		n.nodeComputeValLef= c.nodeComputeValLef;
		n.nodeComputeValRight= c.nodeComputeValRight;
		
		n.nodeDisplayVal= c.nodeDisplayVal;
		n.nodeDisplayValLeft= c.nodeDisplayValLeft;
		n.nodeDisplayValRight= c.nodeDisplayValRight;

		n.position=new Point(c.position.x,c.position.y);
		n.in1Position=new Point(c.in1Position.x,c.in1Position.y);
		n.in2Position=new Point(c.in2Position.x,c.in2Position.y); 
		n.outPosition=new Point(c.outPosition.x,c.outPosition.y);
		
		n.bgColor=c.bgColor;
		n.titleColor1=c.titleColor1;
		n.titleColor2=c.titleColor2;
		n.borderWidth=c.borderWidth;
		n.borderColor=c.borderColor;
		n.borderColorSelected=c.borderColorSelected;
		n.titleFontSize=c.titleFontSize;
		n.titleFontColor=c.titleFontColor;
		n.contentFontSize=c.contentFontSize;
		n.contentColor=c.contentColor;
		n.width=c.width;
		n.height=c.height;
		
		n.movable="yes";
		n.enable="yes";

		n.expressionText=c.expressionText;
		n.accExpressionText=c.accExpressionText;

		n.schemaId = currentSchemaId; 
		n.nodeId=getNextNodeIdSequence();
		
		rootNodes.setItem(n.nodeId,n);
		nodes.setItem(n.nodeId,n);
		
		//Draw all nodes and add drag action basing on global nodes
		drawNodes();
		//links.clear();
		//links = generateLinks(rootNodes, nodes);
		//Draw all links basing on global links 
		drawLinks();
	});
}

/*Print to output: display message with hightlight color the automatically cleared*/
function printOutput(s){
	if (outputTimeOut1 != null) clearTimeout(outputTimeOut1);
	if (outputTimeOut2 != null) clearTimeout(outputTimeOut2);
	if (outputTimeOut3 != null) clearTimeout(outputTimeOut2);
	var out=$("#output p");
	out.text(s).addClass( "outputHighlight" ).css("font-weight","bold");
	outputTimeOut1 = setTimeout(function(){out.removeClass("outputHighlight",2000);},1000);
	outputTimeOut2 = setTimeout(function(){out.css("font-weight","normal");},4000);
	outputTimeOut3 = setTimeout(function(){out.text("");},12000);
}

/*Get first position of a char in side a string, -1 if not found*/
function chrPos(s,cs){
	var csn = cs.length;
	var str=s.trim();
	var n=str.length;
	if(n==0) return -1;
//	var i=0;
//	while(i<n){
//		var ch = str.charAt(i);
//		if(ch=="("){
//			i=findCloseingBracePos(str,i);
//			if(i==-1)return -1;
//		}else{
//			for(var k=0; k<csn;k++){
//				if(cs[k]==ch) return i;
//			}
//		}
//		i +=1;
//	}

	
	var i=n-1;
	while(i>-1){
		var ch = str.charAt(i);
		if(ch==")"){
			i=findOpeningBracePos(str,i);
			if(i==-1)return -1;
		}else{
			for(var k=0; k<csn;k++){
				if(cs[k]==ch) return i;
			}
		}
		i =i-1;
	}
	return -1;
}
/*Get first position of a char in side a string, -1 if not found*/
function standardizeStr(s){
	if(!isBraceValid(s)) throw "STRING_ERROR";
	var str = s.trim();
	str = str.toLowerCase();
	var n=str.length-1;
	while(str.charAt(0)=="(" && findCloseingBracePos(str,0)==n){
		str=str.substr(1,n-1);
		str=str.trim();
		var n=str.length-1;
	}
	return str;
}

/*Get first position of a char in side a string, -1 if not found*/
function findCloseingBracePos(s,p){
	var str = s.trim();
	var n=str.length;
	if(n==0) return -1;
	if(p>=n) return -1;
	var Cn=1; //Counting how many opening brace is not closed at this position of string
	for(var i=p+1; i<n;i++){
		var ch =str.charAt(i);
		Cn +=  ch=="("?1:0;
		Cn +=  ch==")"?-1:0;
		if(Cn==0)	return i;
	}
	return -1;
}

function findOpeningBracePos(s,p){
	var str = s.trim();
	var n=str.length;
	if(n==0) return -1;
	if(p<0||p>n-1) return -1;
	var Cn=1; //Counting how many opening brace is not closed at this position of string
	for(var i=p-1; i>-1;i--){
		var ch =str.charAt(i);
		Cn +=  ch==")"?1:0;
		Cn +=  ch=="("?-1:0;
		if(Cn==0)	return i;
	}
	return -1;
}

/*Get first position of a char in side a string, -1 if not found*/
function isBraceValid(s){
	var str = s.trim();
	var n=str.length;
	if(n==0) return true;
	var Cn=0; //Counting how many opening brace is not closed at this position of string
	for(var i=0; i<n;i++){
		var ch =str.charAt(i);
		Cn +=  ch=="("?1:0;
		Cn +=  ch==")"?-1:0;
	}
	return Cn==0;
}

function allOrperatorConverter(s){
	var str = s.trim();
	str=str.replace(" ","");
	str=standardizeStr(str); //break the outmost braces if available
	var n=str.length;
	if(n==0) return "";

	var nComa = chrPos(str,[","]);
	if(nComa >= 0)	return(allOrperatorConverter(str.substr(0,nComa)) + ","+allOrperatorConverter(str.substr(nComa+1)));

	
	var nPlus = chrPos(str,["+","-"]);
	if(nPlus >= 0)	return(anOrperatorConverter(str,nPlus));

	var nMulti = chrPos(str,["*","/"]);
	if(nMulti >=0)	return(anOrperatorConverter(str,nMulti));

	var nPow = chrPos(str,["^"]);
	if(nPow >=0)	return(anOrperatorConverter(str,nPow));
	

	var count=-1;
	var openPos = new Array();
	var closePos = new Array();
	var inBraceTxt =new Array();
	
	var i=0;
	while(i<n){
		var ch = str.charAt(i);
		if(ch=="("){
			count +=1;
			openPos[count]=i;
			
			i=findCloseingBracePos(str,i);
			if(i==-1)throw CLOSING_BRACE_EXPECTED;
			else{
				closePos[count]=i;
				inBraceTxt[count] = str.substr(openPos[count]+1,closePos[count]-openPos[count]-1);
				if(inBraceTxt[count]=="") throw EMPTY_BRACE_FOUND;
			} 
		}
		i +=1;
	}
	if(count==-1){
		return str;
	}else{
		var ret="";
		var prevPos=0;
		//alert(str);
		
		for(var ii =0; ii<=count;ii++){
			//alert(prevPos);alert(openPos[ii]);
			ret = ret + str.substr(prevPos,openPos[ii]-prevPos+1) + allOrperatorConverter(inBraceTxt[count]);
			prevPos=closePos[count];
		}
		if(prevPos<n){ret = ret + str.substr(prevPos);}
		return ret;
	}
}


function anOrperatorConverter(s,p){
	var str = s;
	var n=str.length;
	var ch=str.charAt(p);
	//operator right at the begining ie: -12*3; 
	if((p==0)&&(ch!="-")) throw "OPERANT_EXPECTED";
	if((p==0)&&(ch=="-")){
		var s1="0";
		var s2=str.substr(p+1); s2=allOrperatorConverter(s2);
	}else{
		var s1=str.substr(0,p); s1=allOrperatorConverter(s1);
		var s2=str.substr(p+1); s2=allOrperatorConverter(s2);
	}
	if(ch=="-") return "SUBTRACT("+s1+","+s2+")";
	if(ch=="+") return "ADD("+s1+","+s2+")";
	if(ch=="*") return "MULTIPLE("+s1+","+s2+")";
	if(ch=="/") return "DIVIDE("+s1+","+s2+")";
	if(ch=="^") return "POW("+s1+","+s2+")";
}


function extendNode(n,schema,h){
	//---get expression---
	var exp=n.accExpressionText.trim();
	if (exp==null || exp=="") throw "PARAMETER_EXPECTED_FOR_FUNCTION";
	var openBracePos=exp.indexOf("("); 
	
	//---leaf, Set node type for this. Need check if this is logic, numeric or  error input data---
	if(openBracePos==-1){
		if (exp=="true" ||exp=="false")n.nodeType=INPUT_BOOLEAN;
		else if(isNumber(exp))n.nodeType=INPUT_NUMBER;
		else n.nodeType=PARAM_NUMBER;//throw "FUNCTION_PARAMETER_UNKNOWN_DATA_TYPE";
		n.expressionText=exp;
	
	//---Not leaf, set node type only then create childs--- 
	}else{
		//set type
		var fName=exp.substr(0,openBracePos);
		n.nodeType=nodeLabel2NodeType(fName);
		if(n.nodeType=="")throw "UNKNOWN_FUNCTION";
		n.expressionText=fName;
		
		//Extract parameters
		var fParams=exp.substr(openBracePos+1);
		fParams=fParams.substr(0,fParams.length-1);
		if(fParams=="")throw "PARAMETER_EXPECTED_FOR_FUNCTION";
		
		var paramSeparatorPos=findParamSeparatorPos(fParams);
		var p1="";
		var p2="";
		if (paramSeparatorPos==-1){
			p1=fParams.substr(0);
		}else{
			p1=fParams.substr(0,paramSeparatorPos);
			p2=fParams.substr(paramSeparatorPos+1);
		}
		
		//Create left nodes
		var ln=new NodeData();
		ln.nodeId = getNextNodeIdSequence();
		ln.accExpressionText=p1;
		//ln.expressionText=p1;
		if(h>0){
			var dy=hhh/Math.pow(2,h+1);
			if (dy<25) dy=25
			ln.position.y = n.position.y-dy+8;
		}
		//link to parent and parent link back to this node
		ln.parentNodeSId.push(n.nodeId);
		n.nodeLeftId=ln.nodeId;
		//extend this node
		extendNode(ln,schema,h+1);
		

		//Create right nodes
		if(p2!=""){
			var rn=new NodeData();
			rn.nodeId = getNextNodeIdSequence();
			rn.accExpressionText=p2;
			//rn.expressionText=p2;
			if(h>0){
				var dy=hhh/Math.pow(2,h+1);
				if (dy<25) dy=25
				rn.position.y = n.position.y+dy+8;
			}

			//link to parent and parent link back to this node
			rn.parentNodeSId.push(n.nodeId);
			n.nodeRightId=rn.nodeId;
			//extend this node
			extendNode(rn,schema,h+1);

		}
		
	}
	//---Set other data for node--- 
	n.schemaId = schema.id;
	if(h>0){
		n.position.x=www-h*120;
	}
	//setNodeValue(n);
	n.accExpressionText=exp;
	//n.expressionText=exp;
	n.level=h;
	if(isInputType(n)){
		n.nodeAssignVal=exp;
		n.nodeDisplayVal=exp;
		n.nodeComputeVal=exp;
	}else if(isParameter(n)){
		n.nodeAssignVal=0;
		n.nodeDisplayVal=0;
		n.nodeComputeVal=0;
	}else{
		n.nodeDisplayVal="Result";
	}
	setNodeAppearance(n);
	
	//---Add to schema---
	schema.nodes.setItem(n.nodeId, n);
}

function findParamSeparatorPos(s){
	var str = s.trim();
	var n=str.length;
	if(n==0) return -1;
	var Cn=0; //Counting how many opening brace is not closed at this position of string
	for(var i=0; i<n;i++){
		var ch =str.charAt(i);
		Cn +=  ch=="("?1:0;
		Cn +=  ch==")"?-1:0;
		if(Cn==0 && ch==",")return i;
	}
	return -1;
}

function adjustXposition(schema){
	var nodes=schema.nodes;
	var maxLevel= 0;

	//If root node have only one LEFT or RIGHT sub node then Also ajust y position (shift up or down) 
	var rn=null ;
	for (var k in schema.rootNodes.items){
		rn= schema.rootNodes.items[k];
		break;
	}
	var dy=0;
	if(rn.nodeRightId==null||rn.nodeRightId=="") dy=rn.position.y/3;
	if(rn.nodeLeftId==null||rn.nodeLeftId=="") dy=-rn.position.y/3;
	
	
	for (var k in nodes.items){
		var n= nodes.items[k];
		if(maxLevel<n.level){
			maxLevel=n.level;
		}
	}
	var interval= www/maxLevel;
	//interval-=20;
	
	for (var k in nodes.items){
		var n= nodes.items[k];
		//alert(www-n.position.level*interval);
		n.position.x=www-(n.level-0.32)*interval;
		
		if(n.level==1 && n.position.x+130>=www)n.position.x=www-130;
		if(dy!=0)n.position.y += dy;
		calculateInOutPosition(n);
	}
	
}
function expression2SchemaAction(){
	try{
		//s="(cos(12)-((sin(10-7+3)-3+5*85*sin(10-7+3)-(max(2,4)/(5+2)-2/3)))) ";
		//s="(cos(12)-sin(10-7+3))";
		//s="(sin(10-3))";
		var s=$("div#schema2ExpressionTxt input").val();
		
		s=s.replace(" ",""); //alert(s);
		s=standardizeStr(s); //alert(s);
		//Keep this original expression for display later
		var oriS=s;
		s=allOrperatorConverter(s);
		
		//Create new schema
		var nSchema = createSchema();
		
		//Create root node
		var r=new NodeData();
		r.nodeId = getNextNodeIdSequence();
		r.expressionText=s;
		r.accExpressionText=s;
		nSchema.rootNodes = new Hash();
		nSchema.rootNodes.setItem(r.nodeId,r);
		www= $("#diagram").css("width").replace("px","");
		hhh=$("#diagram").css("height").replace("px","")-100;
		r.position.x=www; 
		r.position.y=hhh/2;
		r.level=1;
		
		//Extend nodes
		extendNode(r,nSchema,1);
		
		//Notify user if schema has only one node
		if(nSchema.nodes.length<2)throw "SCHEMA_SHOULD_HAVE_MORE_THAN_ONE_NODE"
		
		//Adjust x position depending node level
		adjustXposition(nSchema);
		agregateParam(nSchema);
		
		oriS =oriS.toLowerCase();
		r.accExpressionText=oriS;
		$("div#schema2ExpressionTxt input").val(oriS);
		nSchema.title="Generated Diagram";
		//Attach schema to global schema list
		schemas.setItem(nSchema.id,nSchema);
		currentSchemaId = nSchema.id;
		//links.clear();
		nSchema.links=generateLinks(nSchema.rootNodes,nSchema.nodes);
		
		showSchema(nSchema,true);
	}
	catch(e){
		printOutput(e);
	}
}

function doFormat(jsv) {
    if (jsv.value != "") {
        try {
            eval("var tmpf = function(){" + jsv.value + "}");
            var fjs = tmpf.toString();
            jsv.value = fjs.substring(fjs.indexOf("{") + 1, fjs.lastIndexOf("}"));
        } catch (ex) {
            jsv.value = ex.toString();
        }
    }
}

function copy_to_clipboard(text)  
{  
    if(window.clipboardData)  
    {  
    window.clipboardData.setData('text',text);  
    }  
    else  
    {  
        var clipboarddiv=document.getElementById('divclipboardswf');  
    if(clipboarddiv==null)  
    {  
       clipboarddiv=document.createElement('div');  
           clipboarddiv.setAttribute("name", "divclipboardswf");  
       clipboarddiv.setAttribute("id", "divclipboardswf");  
       document.body.appendChild(clipboarddiv);  
    }  
        clipboarddiv.innerHTML='<embed src="js/clipboard.swf" FlashVars="clipboard='+  
encodeURIComponent(text)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';  
    }  
    alert('The text is copied to your clipboard...');  
    return false;  
}


function autoSelect(el) {
	  if (/textarea/i.test(el.tagName) || (/input/i.test(el.tagName) && /text/i.test(el.type))) {
	    el.select();
	  } else if (!!window.getSelection) { // FF, Safari, Chrome, Opera
	    var sel = window.getSelection();
	    var range = document.createRange();
	    range.selectNodeContents(el);
	    sel.removeAllRanges();
	    sel.addRange(range);
	  } else if (!!document.selection) { // IE
	    document.selection.empty();
	    var range = document.body.createTextRange();
	    range.moveToElementText(el);
	    range.select();
	  }
};
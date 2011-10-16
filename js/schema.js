/***************************************************/
/*********Functions for managing Schemas************/
/***************************************************/

function SchemaData(){
	this.id = null;
	this.title = "";  
	this.bgColor="FFFFFF";
	this.enable="yes";

	this.width=1000; 
	this.height=700;
	var diagramPosition=new Point(0,0);
	
	this.nodes = null ; //A Hash() keeping all nodes of schema;
	this.links=null; //A Hash() keeping all links between nodes of schema
	this.rootNodes = null;  //A Hash() keeping all root nodes of schema
	this.currentNode=null; //will be NodeData(); this is the current selected one
	
	this.addingNodeType="";
	this.currentNodeWrapper = null; //Used to monitor drag action
	this.currentSelectedInput = null;  //this is an object {inputType:"left/right",nodeId:"id"} = ""; //Used to monitor ceating link
	
	//Load schema from given xml file  
	this.loadFromXmlFile = function(xmlDataFilePath){
	};
}

function loadSchema(schema,schemaName){
	//Open file
	
	//Title
	schema.title="Unsaved schema";
	schema.id=1;
	//Fetch data to create nodes
	schema.nodes = new Hash();

	//Reading xml file to put in the public nodes
	var n1= new NodeData();
	n1.id = 1; 
	n1.nodeType = ADD; 
	n1.nodeId = 1;
	n1.nodeLeftId = 2;
	n1.nodeRightId = 3;
	n1.position.x=550;
	n1.position.y=200;
	n1.bgColor="FFFFFF";        
	n1.titleColor1="888888";//2282E3    73716F
	n1.titleColor2="FFFFFF";    
	n1.borderColor="";    
	n1.titleFontColor=""; 
	n1.contentColor="000000";  
	n1.movable="no";
	n1.expressionText="POW";
	schema.nodes.setItem(n1.nodeId, n1);
	var n2= new NodeData();
	n2.id = 1; 
	n2.nodeType = ABS; 
	n2.nodeId = 2; 
	n2.nodeLeftId = 4;
	n2.nodeRightId = "";
	n2.parentNodeSId = [1];
	n2.position.x=350;
	n2.position.y=100;
	n2.bgColor="FFFFFF";        
	n2.titleColor1="888888";    
	n2.titleColor2="FFFFFF";    
	n2.borderColor="";    
	n2.titleFontColor=""; 
	n2.contentColor="000000";
	n2.enable="no";
	n2.expressionText="ABS";
	schema.nodes.setItem(n2.nodeId, n2);
	var n3= new NodeData();
	n3.id = 1; 
	n3.nodeType = ADD; 
	n3.nodeId = 3; 
	n3.nodeLeftId = 5;
	n3.nodeRightId = 6;
	n3.parentNodeSId = [1];
	n3.position.x=350;
	n3.position.y=300;
	n3.titleColor1="888888";    
	n3.titleColor2="FFFFFF";    
	n3.bgColor="FFFFFF"; 
	n3.expressionText="ADD";
	schema.nodes.setItem(n3.nodeId, n3);
	var n4= new NodeData();
	n4.id = 1; 
	n4.nodeType = INPUT_NUMBER; 
	n4.nodeId = 4; 
	n4.nodeLeftId = "";
	n4.nodeRightId = "";
	n4.parentNodeSId = [2];
	n4.position.x=200;
	n4.position.y=50;
	n4.titleColor1="888888";        
	n4.titleColor2="FFFFFF";
	n4.nodeDisplayVal="-4";
	n4.nodeAssignVal="-4";
	n4.expressionText="-4";
	n4.nodeComputeVal ="-4";
	schema.nodes.setItem(n4.nodeId, n4);
	var n5= new NodeData();
	n5.id = 1; 
	n5.nodeType = INPUT_NUMBER; 
	n5.nodeId = 5; 
	n5.nodeLeftId = "";
	n5.nodeRightId = "";
	n5.parentNodeSId = [3];
	n5.position.x=200;
	n5.position.y=200;
	n5.titleColor1="888888";        
	n5.titleColor2="FFFFFF";
	n5.nodeDisplayVal="16";
	n5.nodeAssignVal="16";
	n5.expressionText="16";
	n5.nodeComputeVal ="16";
	schema.nodes.setItem(n5.nodeId, n5);
	var n6= new NodeData();
	n6.id = 1; 
	n6.nodeType = INPUT_NUMBER; 
	n6.nodeId = 6; 
	n6.nodeLeftId = "";
	n6.nodeRightId = "";
	n6.parentNodeSId = [3];
	n6.position.x=200;
	n6.position.y=400;
	n6.titleColor1="888888";        
	n6.titleColor2="FFFFFF";    
	n6.nodeDisplayVal="-19";
	n6.nodeAssignVal="-19";
	n6.expressionText="-19";
	n6.nodeComputeVal ="-19";
	schema.nodes.setItem(n6.nodeId, n6);
	//Calculate some implying data
	for (var k in schema.nodes.items){
		var n= schema.nodes.items[k];
		setNodeAppearance(n);
		setNodeValue(n);
	}	

	//Fetch data to create other: root, current node
	schema.rootNodes = new Hash();
	schema.rootNodes.setItem(n1.nodeId, n1);
	schema.currentNode=null;
	
	//Generate link
	schema.links = generateLinks(schema.rootNodes, schema.nodes);

	//Closs file
}

function drawSchema(schema){
	//Draw all nodes and add drag action basing on global nodes
	drawNodes();
	
	//Draw all links basing on global links 
	drawLinks();
}

function initSchema(schema){
	//Init some status and user-action-monitoring variables 
	schema.addingNodeType="";
	schema.currentNodeWrapper = null; //Used to monitor drag action
	//ret is an object {inputType:"left/right",nodeId:"id"} = ""; //Used to monitor ceating link
	schema.currentSelectedInput = new CurrentSelectedInput("","");

	//Set all globale variable to this schema varialble
	nodes=schema.nodes;
	links=schema.links;
	rootNodes =schema.rootNodes;
	currentSchemaId=schema.id;
	addingNodeType=schema.addingNodeType;
	currentNode = schema.currentNode; 
	currentNodeWrapper = schema.currentNodeWrapper; 
	currentSelectedInput = schema.currentSelectedInput;
}


/*Crete new schema*/
function createSchema(){
	//---Get temporary id, after save to db will be give an official id---
	var id=getNextSchemaId();

	//---Creting new schema---
	ret=new SchemaData();
	
	//---Seting ninitial value---
	ret.id = id;
	ret.title = "New schema";  
	
	ret.nodes = new Hash();
	ret.links= new Hash();
	ret.rootNodes = new Hash();
	ret.currentNode=null;
	return ret;
}

/*Get id for schema. id in shema table is not auto incresed*/
function getNextSchemaId(){
	//Use user id to get sequence = count(hisSchema)+1
	return ++schemaIdSeq;
}


//Travers tree to generate links
function generateLinks(rootNodes,nodes){
	var lns = new Hash();
	for (var k in rootNodes.items){
		var n= rootNodes.items[k];
		generateLinkEachNode(lns,n,nodes);
	}
	return lns;
}


//Check if the node have left node and(or) right node then create corresponding links
function generateLinkEachNode(lns,n,nodes){
	var in1p=n.in1Position;
	var in2p=n.in2Position;

	var lnId=n.nodeLeftId;
	if(lnId!= null && lnId!= ""){
		var ln = nodes.getItem(lnId);
		var p=ln.outPosition;
		lns.setItem("l-"+ln.nodeId+"-"+n.nodeId, new Link(p, in1p));
		generateLinkEachNode(lns,ln,nodes);
	}
	
	var rnId=n.nodeRightId; 
	if(rnId!=null && rnId!=""){
		var rn = nodes.getItem(rnId);
		var p=rn.outPosition;
		lns.setItem("r-"+rn.nodeId+"-"+n.nodeId, new Link(p, in2p));
		generateLinkEachNode(lns,rn,nodes);
	}
}


//Delete schema
function deleteSchema(){
	//Check if any tab existing to the Right/Left of current tab
	var nextId=null;
	var nexTab=null;
	nextTab=document.getElementById("schema_"+currentSchemaId).nextSibling;
	if(nextTab==null)nextTab=document.getElementById("schema_"+currentSchemaId).previousSibling;
	if(nextTab!=null)nextId=nextTab.id;
	
	//Delete the current
	schemas.removeItem(currentSchemaId);
	
	//Delete tab on screen
	$("#schema_"+currentSchemaId).remove();

	//focus on next exisiting tab if any
	if(nextId!=null){
		var nSchema=schemas.getItem(nextId.substr(7));
		showSchema(nSchema);
	}else{
		//Create new schema
		var nSchema = createSchema();
		//Attach schema to global schema list
		schemas.setItem(nSchema.id,nSchema);
		currentSchemaId = nSchema.id;
		showSchema(nSchema,true);
	}
	
	//Show scroll if need 
	var w = parseInt($("#thumbList").css("width"));//viewport
	var accW=0;
	$("#thumbList li").each(function(index){
		accW += this.offsetWidth+2;
	});
	
	if(accW>w){
		$("#thumbScrollLeft, #thumbScrollRight").show();
		//make sure new one is shown
		//$("#tabThumbnail").animate({"left":w-accW+"px"},"fast");
	}else{
		$("#thumbScrollLeft, #thumbScrollRight").hide();
		$("#tabThumbnail").animate({"left":"0px"},"fast");
	}

}
//Create new schema
function newSchema(title){
	//Create new schema
	var nSchema = createSchema();
	nSchema.title=title;
	//Attach schema to global schema list
	schemas.setItem(nSchema.id,nSchema);
	currentSchemaId = nSchema.id;
	showSchema(nSchema,true);
	$("div#schema2ExpressionTxt input").val("");
}
//Open/Load saved schema
function openSchema(sName){
	var isOpenning=false;
	var tabs =$("#tabThumbnail li");
	tabs.each(function(){
		var s = $(this).text();
		if(s==sName){
			tabs.removeClass("activeTab");
			$(this).addClass("activeTab");
			currentSchemaId=this.id.substr(7);
			showSchema(schemas.getItem(currentSchemaId));
			isOpenning =true;
			return false;
		}
	});
	if (!isOpenning){
		var sData=localStorage.getItem("flowNx_"+sName);
		if(sData==null ||sData==undefined)printOutput("Schema "+sName+" does not exist.")
		
		sData= " var loadedSchema = "+ sData;
		eval(sData);
		
		//alert(loadedSchema.nodes.length);
		var lst=loadedSchema.nodes;
		loadedSchema.nodes = new Hash();
		for (var k in lst.items){
			var n= lst.items[k];
			if(n!=null){
				loadedSchema.nodes.setItem(n.nodeId,n);
			}
		}
		loadedSchema.rootNodes=findRootNodes(loadedSchema.nodes);
		loadedSchema.links = generateLinks(loadedSchema.rootNodes, loadedSchema.nodes);
		
		schemas.setItem(loadedSchema.id,loadedSchema);
		currentSchemaId = loadedSchema.id;
		showSchema(loadedSchema,true);
		
	}
	//Showing the accExpression
	var curSchema=schemas.getItem(currentSchemaId);
	var rns=curSchema.rootNodes;
	for(var k in rns.items){
		var rn=rns.items[k];
		break;
	}
	var expression= rn==undefined?"":rn.accExpressionText;
	$("#schema2ExpressionTxt input").val(expression.toLowerCase());
}

//Save schema
function saveSchema(sName){
	var cs = schemas.getItem(currentSchemaId);
	schemas.removeItem(currentSchemaId);
	var curTabThumbnail=$("li#schema_"+currentSchemaId);
	cs.title=sName;
	currentSchemaId=getNextSchemaId();
	cs.id=currentSchemaId;
	schemas.setItem(cs.id,cs);
	curTabThumbnail.text(cs.title);
	curTabThumbnail.attr("id","schema_"+cs.id);
	
	sData = JSON.stringify(cs);
	localStorage.setItem("flowNx_"+sName,sData);
	schema2Prop(cs);
}

//get List of save schema name
function getLstSavedSchema(userName){
	ret = new Array();
	for (var i=0; i<=localStorage.length-1; i++){  
		var key = localStorage.key(i);
		if(key.indexOf('flowNx_'>-1))ret.push(key.substr(7));
	}  
	return ret;
}




/*OPEN schema dialog*/
$(function() {
	var	tips = $( "#openSchemaDialog.validateTips" );
	var schemaLst = $("#schemaLst");
	$( "#openSchemaDialog" ).dialog({
		autoOpen: false
		,height: 150
		,width: 300
		,modal: true
		,buttons: {
			"Close": function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
			}
		,open:function(event,ui){
			var thisDialog=this;
			//clear the list
			schemaLst.html("");
			
			//Get list of saved schema' name
			var lst=getLstSavedSchema("TCT");
			if(lst.length==0){$("#openSchemaDialog .validateTips").text("No schema found.")}
			else{
				var count=0;
				if (lst!==null && lst!=undefined){
					for(var k in lst){
						count += 1;
						schemaLst.append("<div class='schemaLstItem'>"+lst[k]+"<div title='Delete schema' class='schemaItemDelete'>X</div></div>");
					}
				}
				if(count>15) count=15;
				$("#openSchemaDialog").css("height",count*22+16+"px");
				
				//Open schema when click on name
				$("#openSchemaDialog .schemaLstItem").click(function(){
					var sName=$(this).text();
					sName=sName.substr(0,sName.length-1);
					openSchema(sName);
					$( thisDialog ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
				});
				//Delete schema when click on 'X' icon right to the name
				$("#openSchemaDialog .schemaItemDelete").click(function(){
					var parent =$(this).parent();
					var sName=parent.text();
					sName=sName.substr(0,sName.length-1); 
					localStorage.removeItem("flowNx_"+sName);
					parent.remove();
					
				});
			}
		}
		,close: function() {$( "#dialogWrapper"	).fadeOut();}
	});
});	

/*Error notification for cut/copy/delete a NODE*/
$(function() {
	var	tips = $( "#aboutDialog .validateTips" );
	$( "#aboutDialog" ).dialog({
		autoOpen: false
		,height: 350
		,width: 450
		,modal: true
		,buttons: {
			OK: function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
		}
		//,open:function(event,ui){$("#aboutDialog .ui-button").focus();}
	});
});	


/*Error notification for cut/copy/delete a NODE*/
$(function() {
	var	tips = $( "#noNodeSelectionErr .validateTips" );
	$( "#noNodeSelectionErr" ).dialog({
		autoOpen: false
		,height: 150
		,width: 300
		,modal: true
		,buttons: {
		OK: function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
	}
	,open:function(event,ui){tips.text(errorMsg);}
	});
});	


/*NEW schema dialog*/
$(function() {
	var name = $( "#newName" ),
		allFields = $( [] ).add( name );
	var	tips = $( "#newSchemaDailog .validateTips" );

	function updateTips( t ) {
		var oldTip = tips.text();
		tips
			.text( t )
			.addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
		setTimeout(function() {
			tips.text(oldTip);
		}, 2000 );
		name.focus();
	}

	function checkLength( o) {
		if ( o.val().trim().length==0) {
			//o.addClass( "ui-state-error" );
			updateTips( "Name can not be empty." );
			return false;
		} else {
			return true;
		}
	}
	function checkUnique( o ) {
		//check against existing schemas
		var found=false;
		$("#tabThumbnail li").each(function(){
			if($(this).text()==o.val()){
				found=true;
				return false;
			}
		});
		if(found){
			updateTips( "Name is alredy exist in opening schemas" );
			return false;
		}
		//for(var k in schemas.items){
		//	if(schemas.items[k].title==o.val()){
		//		updateTips( "Name is alredy exist. Opening schema" );
		//		return false;
		//	}
		//}

		//check against save schemas
		var s=localStorage.getItem("flowNx_"+o.val());
		if (s!=null && s != undefined) {
			updateTips( "Name is alredy exist in saved schemas" );
			return false;
		} 
		return true;
	}

	function checkRegexp( o, regexp, n ) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass( "ui-state-error" );
			updateTips( n );
			return false;
		} else {
			return true;
		}
	}
	
	$( "#newSchemaDailog" ).dialog({
		autoOpen: false,
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			"Create new schema": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );

				bValid = bValid && checkLength( name );
				bValid = bValid && checkUnique( name);

				if ( bValid ) {
					newSchema(name.val());
					$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
			}
		}
		,close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );$( "#dialogWrapper" ).fadeOut();
		}
		,open: function() {
			//Capture key enter
			name.keypress(function(event) {
				  if (event.keyCode == '13') {
						var bValid = true;
						allFields.removeClass( "ui-state-error" );

						bValid = bValid && checkLength( name );
						bValid = bValid && checkUnique( name);

						if ( bValid ) {
							newSchema(name.val());
							$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
						}
						return false;
				   }
			});
		}
	});

});	


/*Close schema dialog*/
$(function() {
	$( "#deleteSchemaDailog" ).dialog({
		autoOpen: false,
		height: 150,
		width: 350,
		modal: true,
		buttons: {
				"Close schema": function() {
						deleteSchema();
						$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
						}
				,Cancel: function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
			},
		close: function() {$( "#dialogWrapper" ).fadeOut();}
	});

});	


/*SAVE schema dialog*/
$(function() {
	var name = $( "#saveName" ),
		allFields = $( [] ).add( name );
	var saveOverwrite = $( "input#saveOverwrite" );
	var	tips = $( "#saveSchemaDailog .validateTips" );
	

	function updateTips( t ) {
		var oldTip = tips.text();
		tips
			.text( t )
			.addClass( "ui-state-highlight" );
		setTimeout(function() {
			tips.removeClass( "ui-state-highlight", 1500 );
		}, 500 );
		setTimeout(function() {
			tips.text(oldTip);
		}, 2000 );
		name.focus();
	}

	function checkLength( o) {
		if ( o.val().trim().length==0) {
			//o.addClass( "ui-state-error" );
			updateTips( "Name can not be empty." );
			return false;
		} else {
			return true;
		}
	}
	function checkUnique( o ) {
		//check against existing schemas
		var found=false;
		$("#tabThumbnail li").each(function(){
			if($(this).text()==o.val()){
				found=true;
				return false;
			}
		});
		if(found){
			updateTips( "Name is alredy exist in opening schemas" );
			return false;
		}

		//check against save schemas
		var s=localStorage.getItem("flowNx_"+o.val());
		if (s!=null && s != undefined) {
			updateTips( "Name is alredy exist in saved schemas" );
			return false;
		} 
		return true;
	}

	function checkRegexp( o, regexp, n ) {
		if ( !( regexp.test( o.val() ) ) ) {
			o.addClass( "ui-state-error" );
			updateTips( n );
			return false;
		} else {
			return true;
		}
	}
	
	$( "#saveSchemaDailog" ).dialog({
		autoOpen: false,
		height: 250,
		width: 350,
		modal: true,
		buttons: {
			"Save schema": function() {
				var bValid = true;
				allFields.removeClass( "ui-state-error" );

				if(!saveOverwrite.attr("checked"))bValid = bValid && checkUnique( name);
				bValid = bValid && checkLength( name );

				if ( bValid ) {
					saveSchema(name.val());
					$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
				}
			},
			Cancel: function() {
				$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
			}
		}
		,close: function() {
			allFields.val( "" ).removeClass( "ui-state-error" );$( "#dialogWrapper" ).fadeOut();
		}
		,open: function() {
			//Default is save for the current opening -> overwrite the existing one
			$( "#saveName" ).val(schemas.getItem(currentSchemaId).title);
			saveOverwrite.attr("checked",true);
			
			//Capture key enter
			name.keypress(function(event) {
				if (event.keyCode == '13') {
					return false;
					//var bValid = true;
					//allFields.removeClass( "ui-state-error" );
					//
					//if(!saveOverwrite.attr("checked"))bValid = bValid && checkUnique( name);
					//bValid = bValid && checkLength( name );
					//if ( bValid ) {
					//	saveSchema(name.val());
					//	$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();
					//}else{ return false; }
				}
			});
		}
	});
});	



/*Grap container*/
$(function() {
	$( "#grapContainer" ).dialog({
		autoOpen: false
		,height: 680
		,width: 880
		,modal: true
		,resizable:false
		,buttons: {
		Close: function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
	}
	,open:function(event,ui){
		//$("input#equationinput").val(tctGval);
		//alert(tctGval);
		}
	});
});	


/*Generate javascript*/
$(function() {
	$( "#generateJavascript" ).dialog({
		autoOpen: false
		,height: 560
		,width: 680
		,modal: true
		,resizable:false
		,buttons: {
		Close: function() {$( this ).dialog( "close" );$( "#dialogWrapper" ).fadeOut();}
	}
	});
});	


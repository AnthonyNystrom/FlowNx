/***************************************************/
/*********Global configuration and variables********/
/***************************************************/
const LOGIC_DATA="logic_";
const NUMERIC_DATA="numeric_";
const IN_BOOLEAN="inBool_";
const IN_NUMBER="inNum_";
const OUT_BOOLEAN="outBool_";
const OUT_NUMBER="outNum_";
	
const PARAM="param_";
const OPERATOR="operator_";
const TYPE="type_";

const PARAM_BOOLEAN="param_logic_0_boolean_outBool_";
const PARAM_NUMBER="param_number_0_outNum_";
const PARAM_NUMBER_PI="param_number_0_outNum_pi_";
const PARAM_NUMBER_E="param_number_0_outNum_e_";

const OPERATOR_1="operator_1_";
const OPERATOR_2="operator_2_";
const FUNCTION_1="function_1_";
const FUNCTION_2="function_2_";
const FUNCTION="function_";
const ONE_INPUT="1_";
const TWO_INPUT="2_";

const ABS="function_1_abs_inNum_outNum_";
const COS="function_1_cos_inNum_outNum_";
const EXP="function_1_exp_inNum_outNum_";
const LOG="function_1_log_inNum_outNum_";
const LOG10="function_1_log1_inNum_outNum_";
const NOT="function_logic_1_not_inBool_outBool_";
const POW2="function_1_pow2_inNum_outNum_";
const POW3="function_1_pow3_inNum_outNum_";
const SIN="function_1_sin_inNum_outNum_";
const SQRT="function_1_sqrt_inNum_outNum_";
const TAN="function_1_tan_inNum_outNum_";

const ASIN="function_1_asin_inNum_outNum_";
const ACOS="function_1_acos_inNum_outNum_";
const ATAN="function_1_atan_inNum_outNum_";
const ROUND="function_1_round_inNum_outNum_";
const CEIL="function_1_ceil_inNum_outNum_";
const FLOOR="function_1_floor_inNum_outNum_";

const AND="function_logic_2_and_inBool_outBool_";
const EQUAL="function_2_equal_inNum_outBool_";
const GREATER="function_2_greater_inNum_outBool_";
const GREATER_EQUAL="function_2_greaterEqual_inNum_outBool_";
const LESS="function_2_less_inNum_outBool_";
const LESS_EQUAL="function_2_lessEqual_inNum_outBool_";
const MAX="function_2_max_inNum_outNum_";
const MIN="function_2_min_inNum_outNum_";
const MOD="function_2_mod_inNum_outNum_";
const NOT_EQUAL="function_2_notEqual_inNum_outBool_";
const OR="function_logic_2_or_inBool_outBool_";
const POW="operator_2_pow_inNum_outNum_";
const XOR="function_logic_2_xor_inBool_outBool_";

const ADD="operator_2_add_inNum_outNum_";
const DIVIDE="operator_2_divide_inNum_outNum_";
const MULTIPLE="operator_2_multiple_inNum_outNum_";
const SUBTRACT="operator_2_subtract_inNum_outNum_";

const INPUT_NUMBER="input_number_0_outNum_";
const INPUT_BOOLEAN="input_logic_boolean_0_outBool_";

const PROGRAM_INPUT="program_input_1_";
const PROGRAM_OUTPUT="program_output_1_";
const NUMERIC_RESULT="numeric_result_1_";
const PROGRAM="program_1_";

//Canvas for drawing Links only, box is on a div hoving on canvas 
var diagramCanvas;
//canvas's context will be 2d
var ctx;
//Keeping the id of current active schema
var nodeIdSeq="100";
//sequence to keep schema id
var schemaIdSeq=0;
//Keeping the id of current active schema
var currentSchemaId="";

var currentSchema=null;

//Global schema list
var schemas=null;


//hash of nodes: key: nodeID; value: a Node
var nodes=null;//new Hash();
//hash of links: key: node1ID_node2ID; value: a Link; link.p1: point1, link.p2: point2
var links=null;//new Hash(); 
//Root nodes; a node that does not have parent is consider as a root node
var rootNodes =null;//new Hash();

//gobal current node on the screen
var currentNode = null; 
//gobal current node wraper on the screen
var currentNodeWrapper = null; 
var currentSelectedInput = "";
var addingNodeType="";
var clipBoard=null; //Use to contain node for copy and paste

//Diagram position
var diagramPosition=new Point(0,0);
//a Point: position of canvas
var canvasPos; 
//global error message
var errorMsg;
var outputTimeOut1 =null;
var outputTimeOut2 =null;
var outputTimeOut3 =null;
var currentExpression="";
tctGval="";

function initApp(){
	//---General init done AFTER AUTHENTICATION---
	//Canvas, context
	diagramCanvas = document.getElementById('diagramCanvas');
	diagramCanvas.height=2600;
	diagramCanvas.width=3600;
	
	diag = document.getElementById('diagram');
	
	canvasPos = getOffset(diagramCanvas);
	updateCurrentDiagramPosition();
	if (diagramCanvas.getContext) ctx = diagramCanvas.getContext('2d');
	
	//Empty Schema list and current schema
	schemas=new Hash();
	currentSchemaId = "";

	//Sequence for shcemas, nodes
	nodeIdSeq="100";
	schemaIdSeq=1;
}
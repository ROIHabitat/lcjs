
/***TOTAL SIZE***/
var cSize = 576;
/****************/
var sectionGrid = {};
var qtrs = {};
//Names of types for toolbar
var coverTypes = ["CROP","GRASS","TREES","WETLAND"];
//Colour of types on canvas. Should match CSS file. Order same as coverTypes
var colours = ["#D8D827", "#D88027", "#80EF44", "#ADD8E6"];
//Tooltip text in toolbar. Order same as above.
var toolTips = [
	"Crop can often be identified by linear patterns from farming equipment<br><b><i>Click for examples</i></b>",
	"Grass is any open area without tree cover not being used in crop production<br><b><i>Click for examples</i></b>",
	"Trees are fairly easy to identify on air photos because of their distinctive texture<br><b><i>Click for examples</i></b>",
	"Wetland refers to areas of water, or areas that likely contained water<br><b><i>Click for examples</i></b>"
]
var activeType;

var currentArea = 0;
var lastSection;

var btnDown = false;
var prevClicked = false;

var cvrs = ["","","",""];
var firstRun = true;

var gridBrdr = '';

function createSections(gSize,corner){
	
    var qc = document.getElementById("qc");
	var count = 1;
	
	var inc = 100/gSize;
	
	if (firstRun){ //executes for the first full grid only. Prevents creating duplicate DIVs
	
	//Set canvas & container size
	document.getElementById("qcCanvas").height = cSize;
	document.getElementById("qcCanvas").width = cSize;
	qc.style.height = cSize + "px";
	qc.style.width = cSize + "px";
	
		for (var x = 0; x < gSize; x++){
			for (var y = 0; y < gSize; y++){
				
			 var sec = document.createElement('div');

				if (gSize == 2){
				
					sec.setAttribute('class','firstOverlay');
					sec.setAttribute('onClick','imageZoom('+count+')')

					var ns, we;
					if (x == 0){we = "W"}else{we="E"}
					if (y == 0){ns = "N"}else{ns="S"}
						
					var secLabel = document.createElement("label");
					var secName = count + "sec";
					secLabel.setAttribute('class','secText');
					secLabel.innerHTML = ns + we;
					sec.id = secName;
					sec.appendChild(secLabel);		
					count++;
					
					qtrs[secName] = {};
					qtrs[secName].completed = false;
					qtrs[secName].partial = false;
					qtrs[secName].covers = ["","","",""];
			
				} else {
					var secName = String.fromCharCode(65+x) + String.fromCharCode(65+y);
					sec.setAttribute('class','secOverlay ' + gridBrdr);
					sectionGrid.cell = secName;
					
					sectionGrid[secName] = {};
					sectionGrid[secName].clicked = false;
					sectionGrid[secName].category = null;
				}
				sec.id = secName;
													
				sec.draggable = false;
				sec.style.left = x*inc + "%";
				sec.style.top = y*inc + "%";
				sec.style.height = inc + "%";
				sec.style.width = inc + "%";
				
				qc.appendChild(sec);
			}
		}
	} else {  
		if (qtrs[corner+"sec"].completed || qtrs[corner+"sec"].partial){//Loads already categorized sections if section was previously clicked
			for (var x = 0; x < gSize; x++){
				for (var y = 0; y < gSize; y++){
					for (var c=0; c<qtrs[corner+"sec"].covers.length; c++){
						secName = String.fromCharCode(65+x) + String.fromCharCode(65+y);
						if (qtrs[corner+"sec"].covers[c].indexOf(corner+secName) >= 0){
							sectionGrid[secName].clicked = true;
							sectionGrid[secName].category = c;
							document.getElementById(secName).setAttribute('class','secOverlay ' + gridBrdr);
							document.getElementById(secName).classList.add('chosen_'+c);
							break; //match found, break cover type loop
						} else { 
							sectionGrid[secName].clicked = false;
							sectionGrid[secName].category = null;
							document.getElementById(secName).setAttribute('class','secOverlay ' + gridBrdr);
						}
					}
				}
			}
		} else { //Clears grid object if moving to new section
			for (var x = 0; x < gSize; x++){
				for (var y = 0; y < gSize; y++){
					secName = String.fromCharCode(65+x) + String.fromCharCode(65+y);
					sectionGrid[secName].clicked = false;
					sectionGrid[secName].category = null;
					document.getElementById(secName).setAttribute('class','secOverlay ' + gridBrdr);
				}
			}
		}
	}
	
	//End of loops
		
	if (firstRun && gSize > 2){ //Create toolbar on right side, for first section only
		
		document.body.setAttribute('onMouseDown',"mousedown()");
		document.body.setAttribute("onMouseUp", "mouseup()");
	
		//Next button
		var nextBTN = document.createElement("div");
		nextBTN.id = "next";
		document.getElementById("btnBar").appendChild(nextBTN);
		nextBTN.innerHTML = "NEXT >>";
		nextBTN.classList.add("disabled");

		//Clear button
		var clearText = document.createElement("div");
		var allOFF = document.createElement('div')
		clearText.setAttribute('onClick','allOFF(false)');
		clearText.id = "cleartext";
		clearText.style.height = "46px";
		clearText.style.paddingTop = "30px";
		allOFF.id = "allOFF";
		allOFF.setAttribute('class','toggleBTN');
		clearText.innerHTML = 'CLEAR';
		allOFF.appendChild(clearText);
		document.getElementById("btnBar").appendChild(allOFF);
		var confirmText = document.createElement("div");
		var confirmbox = document.createElement("input");
		confirmbox.type = "checkbox";
		confirmbox.id = "confirmbox";
		confirmText.id = "confirmtext";
		confirmText.innerHTML = "Clear all cells. <br> Confirm?<br><br>";
		confirmText.style.width = "100%";
		confirmText.setAttribute("class","confirm");
		confirmText.setAttribute("onClick","allOFF(true)");
		confirmText.style.display = "none";
		confirmbox.style.display = "none";
		confirmbox.style.marginLeft = "32px";
		allOFF.appendChild(confirmText);
		allOFF.appendChild(confirmbox);
		
		//Build selection buttons, create tooltips
		for (type in coverTypes){
			var btn3 = document.createElement('div'), btn1 = document.createElement('div'), spacer = document.createElement('div'), tiptext = document.createElement('span');
			btn1.id = type+"btn1";
			btn3.id = type+"btn3";
			btn1.setAttribute('class','selectBTN');
			btn3.setAttribute('class','selectBTN');
			btn1.setAttribute('onClick',"selectSize(this,0)");
			btn3.setAttribute('onClick',"selectSize(this,1)");
			spacer.setAttribute('class','spacer');
			tiptext.setAttribute('class','tooltiptext');
			var page = Number(type) + 5;
			tiptext.setAttribute('onclick','showDivs('+(page)+')')
			tiptext.innerHTML =  coverTypes[type] + "<span class='tooltipbox'>"+toolTips[type]+"</span>";
			spacer.appendChild(tiptext);
			btn1.innerHTML = '1x1<div style="border:1px solid black; height:10px; width:10px; margin:5px 12px;"></div>'
			btn3.innerHTML = '3x3<table style="width:19px; height:19px; margin-left:8.5px;"><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table></div>'
			document.getElementById("btnBar").appendChild(spacer);
			document.getElementById("btnBar").appendChild(btn3);
			document.getElementById("btnBar").appendChild(btn1);
		}
		
		selectSize(document.getElementById("0btn1"),0);
		
		//elements created, prevents running generation code again
		firstRun = false;
	} 
}

//Disables next button during animatation to prevent clicking
function toggleNext(){
	var nextbtn = document.getElementById("next");
	
	nextbtn.classList.toggle("disabled");
	nextbtn.classList.toggle("active");
	if (nextbtn.classList.contains("active")){nextbtn.setAttribute('onClick','imageZoom(5)');}
	else {nextbtn.removeAttribute('onClick');}
	
}

function imageZoom(corner){
	
	if(!firstRun && corner != 5){toggleNext();}
	
	var qtrs4 = document.getElementsByClassName('firstOverlay');
			
		/***/if (corner == 1){x=0; y=0;}
		else if (corner == 3){x=1; y=0;}
		else if (corner == 2){x=0; y=1;}
		else if (corner == 4){x=1; y=1;}
		
		var pic = document.getElementById("newimg");
		if (corner != 5){
			
			var id = setInterval(zoomimg, 8);
			var pos = 0;
			var size = 100;
			
			function zoomimg() {
				if (pos == 100) {
					clearInterval(id);
					toggleNext();
					pic.style.zIndex = "0";
				} else {
					pos++;
					size++; 
					if (x == 1){pic.style.right = x * pos + '%'; pic.style.left = null;}
					else {pic.style.left = '0%'; pic.style.right = null;}
					pic.style.bottom = y * pos +'%';
					pic.style.height = size + '%'; 
					pic.style.width = size + '%'; 
				}
			
			}

			for (qtr = 0; qtr<qtrs4.length; qtr++){qtrs4[qtr].style.display = "none"}

		} else {
			
			var id = setInterval(zoomout, 5);
			var pos = 100;
			var size = 200;
			
			function zoomout() {
				if (pos == 0) {
					clearInterval(id);
					for (qtr = 0; qtr<qtrs4.length; qtr++){qtrs4[qtr].style.display = "block";document.getElementById("qcCanvas").style.display = "block";}
				} else {
					pos--;
					size--; 
					if (x == 1){pic.style.right = x * pos + '%'; pic.style.left = null;}
					else {pic.style.left = '0%'; pic.style.right = null;}
					pic.style.bottom = y * pos +'%';
					pic.style.height = size + '%'; 
					pic.style.width = size + '%'; 
					
				}
			}
			pic.style.zIndex = "2";			
		
		}
	
/**AREA RECORDING CODE**/

	//Loop to distribute activated cell names to corresponding text box for recording
	if (corner == 5){ //Executes when returning to 2x2 grid
		var secName = lastSection + "sec";
		for (var q=0;q<qtrs[secName].covers.length;q++){
			qtrs[secName].covers[q] = "";
		}
		for (section in sectionGrid){ //fills array
			if (sectionGrid[section].clicked){
				cvrs[sectionGrid[section].category] += lastSection + section;
				qtrs[secName].covers[sectionGrid[section].category] += lastSection + section;
			}
		}

		for (c=0; c<4; c++){document.getElementById("cvr"+c).value = "";} //Prevents duplicating cells in reporting
		var totalArea = 0;
		var canvas = document.getElementById("qcCanvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0,cSize,cSize);
		
		for (qtr in qtrs){
			var largeSection = document.getElementById(qtr);
			var secArea = 0;
			
			for (c=0; c<4; c++){ //populates fields from array.
				document.getElementById("cvr"+c).value += qtrs[qtr].covers[c];
				totalArea += qtrs[qtr].covers[c].length/3;
				secArea += qtrs[qtr].covers[c].length/3;
				
				//paint canvas
				fillSections(qtrs[qtr].covers[c],qtr,c);
			}
			
			if (secArea > 547){
				qtrs[qtr].completed = true;
				qtrs[qtr].partial = false;
				largeSection.classList.add("complete");
				largeSection.classList.remove("partial");
			} else if (secArea > 0) {
				qtrs[qtr].partial = true;
				qtrs[qtr].completed = false;
				largeSection.classList.remove("complete");
				largeSection.classList.add("partial");

			} else { //Area = 0
				qtrs[qtr].partial = false;
				qtrs[qtr].completed = false;
				largeSection.classList.remove("complete");
				largeSection.classList.remove("partial");
			}
		}
		document.getElementById("progressFill").style.width = (totalArea / 2304)*100 + "%";
		document.getElementById("progressFill").innerHTML = Math.round((totalArea / 2304)*100) + "%"
		document.getElementById("areaOutput").value = totalArea;
		document.getElementById("btnBar").style.visibility = "hidden";
		
		var areaBoxes = document.getElementsByClassName("areabox");
		var typeList = document.getElementsByClassName("cvrtype");
		for (box in areaBoxes){
			try {areaBoxes[box].value = typeList[box].value.length/3;}
			catch (e) {areaBoxes[box].value = 0;}
		}
		
	} else { //Executes on 24x24 grid, save last quarter selected
		lastSection = corner;
		document.getElementById("btnBar").style.visibility = "visible";
		document.getElementById("qcCanvas").style.display = "none";
		
		createSections(24,corner);
	}
/**END AREA CODE**/
	
	if ((totalArea / 2304)>0.95){document.getElementById("outputs").style.display = "block"; }
	else {document.getElementById("outputs").style.display = "none"; }
}

function fillSections(covers,sec,t){
	var gSize = Math.sqrt(cSize); //24
	var inc = cSize/(2*gSize);
	var nswe = ["NW","SW","NE","SE"]
	
	var c = sec.slice(0,1) - 1;
		
	var canvas = document.getElementById("qcCanvas");
	var ctx = canvas.getContext("2d");
	
	for (var x = 0; x < gSize; x++){
		for (var y = 0; y < gSize; y++){
			
			var secName= (c+1) + String.fromCharCode(65+x) + String.fromCharCode(65+y);
			
			if (covers.indexOf(secName) >= 0){		
				var xAdj = 0; 
				var yAdj = 0;
				if (nswe[c] == "SE" || nswe[c] == "SW") {yAdj = cSize/2;}
				if (nswe[c] == "NE" || nswe[c] == "SE") {xAdj = cSize/2;}
				var xpos = x*inc+xAdj;
				var ypos = y*inc+yAdj;
			
				ctx.fillStyle = colours[t];
				ctx.fillRect(xpos,ypos,inc,inc);
			}
		}
	}
}

function recordArea(selectedSec,size,drag){
	var section = selectedSec.id;
	var x = section.charCodeAt(0) - 65;
	var y = section.charCodeAt(1) - 65;
	var onClass, offClass;
	
	if (!drag){ //Cell was clicked, not dragged into
		if (!sectionGrid[section].clicked){
			prevClicked = false; 
		} else {
			prevClicked = true; 
		}
	}
	
	if (btnDown || !drag){
		if (!prevClicked){setClass = 'secOverlay chosen_'+activeType + ' ' + gridBrdr;}
		else {setClass = 'secOverlay ' + gridBrdr;}
		
		//loops to expand selection area: size=1 if 3x3, 0 if 1x1
		for (var n = x-size; n <= x+size; n++){
			for (var i = y-size; i <= y+size; i++){
				var cell = String.fromCharCode(65+n) + String.fromCharCode(65+i);
				if (n < 0 || i < 0){continue;}
				else if (n > 23 || i > 23){continue;}
			
			//Area recording code: handles highliting cells on the image, toggle on/off in object attributes
				if (sectionGrid[cell].category == activeType || !sectionGrid[cell].clicked){
					document.getElementById(cell).setAttribute('class',setClass);
					sectionGrid[cell].clicked = !prevClicked;
					sectionGrid[cell].category = activeType;
				} else if (prevClicked){
					document.getElementById(cell).setAttribute('class',setClass);
					sectionGrid[cell].clicked = !prevClicked;
					sectionGrid[cell].category = null;
				}
			// end area handler
			}
		}
	} else if (size ==1 && !btnDown){ // highlites 3x3 area when not holding mouse down
		for (var n = x-size; n <= x+size; n++){
			for (var i = y-size; i <= y+size; i++){
				var cell = String.fromCharCode(65+n) + String.fromCharCode(65+i);
				if (n < 0 || i < 0){continue;}
				else if (n > 23 || i > 23){continue;}
				
				if (sectionGrid[cell].clicked){document.getElementById(cell).classList.add('changedCellHilite');
				} else {document.getElementById(cell).classList.add('secFill');}	
			}
		}
	}
}

function clearFill(selectedSec){ //function to clear highlited cells when mousing over map without button down
	var section = selectedSec.id;
	var x = section.charCodeAt(0) - 65;
	var y = section.charCodeAt(1) - 65;
	
	for (var n = x-1; n <= x+1; n++){
		for (var i = y-1; i <= y+1; i++){
			var cell = String.fromCharCode(65+n) + String.fromCharCode(65+i);
			if (n < 0 || i < 0){continue;}
			else if (n > 23 || i > 23){continue;}
		
			if (sectionGrid[cell].clicked){document.getElementById(cell).classList.remove('changedCellHilite');
			} else {document.getElementById(cell).classList.remove('secFill');}
		}
	}
}

function allOFF(clearAll){
	var btn = document.getElementById("allOFF");
		
	if (!clearAll){
		btn.classList.add("confirmBTN");
		btn.classList.remove("toggleBTN");
		document.getElementById("cleartext").style.display = "none";
		document.getElementById("confirmtext").style.display = "block";
		document.getElementById("confirmbox").style.display = "block";
	} else {
		
		if (document.getElementById("confirmbox").checked){
			var cell;
			for (cell in sectionGrid){
				if (sectionGrid[cell].clicked){
					document.getElementById(cell).classList.remove('chosen_'+sectionGrid[cell].category)
					sectionGrid[cell].clicked = false;
					sectionGrid[cell].category = null;
				}
			}
			for (c=0;c<cvrs.length;c++){
				qtrs[lastSection+"sec"].covers[c] = "";
			}
			
			document.getElementById("confirmbox").checked = false;
		}
		
		btn.classList.remove("confirmBTN");
		btn.classList.add("toggleBTN");

		document.getElementById("cleartext").style.display = "block";
		document.getElementById("confirmtext").style.display = "none";
		document.getElementById("confirmbox").style.display = "none";
	}
}

function mousedown(){btnDown = true;}
function mouseup(){btnDown = false;}


function showGrid(showHide){
	var cell;
	if (showHide == 'show'){gridBrdr = '';}
	else {gridBrdr = 'hiddenGrid';}
	
	for (cell in sectionGrid){
		try{
			if (document.getElementById(cell).classList.contains("hiddenGrid")){
				document.getElementById(cell).classList.remove("hiddenGrid");
			} else {document.getElementById(cell).classList.add("hiddenGrid");}
		}
		catch(e){continue;}
	}
}

//Handles selection size from button toolbar
function selectSize(btn,size){
	//var sections = document.getElementById("qc").children;
	var sections = document.getElementsByClassName("secOverlay")
	var btnid = btn.id;
	var type = btnid.slice(0,1);
	var btns = document.getElementsByClassName("selectBTN");
	activeType = type;
	
	
	for (var s=0; s<sections.length; s++){
		sections[s].setAttribute('onmousedown','recordArea(this,'+size+',false)');
		sections[s].setAttribute('onmouseenter','recordArea(this,'+size+',true)');
		
 
		if (size == 1){sections[s].setAttribute('onmouseout','clearFill(this)')}
		else {sections[s].removeAttribute('onmouseout');}
	}
	for (a=0; a<btns.length; a++){
		btns[a].setAttribute("class","selectBTN")
	}
	btn.classList.add("chosen_"+type);
}

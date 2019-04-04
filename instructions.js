var imgfldr = "http://home.cc.umanitoba.ca/~miller6/";
var cutout = 5; //set value to page to be removed

var pages= [
	//0
	"<br>You are about to participate in a land classification survey using air photos of land parcels in Manitoba, Canada.<br><br>"+
	"The photos are of individual land parcels (~800x800 metre areas).<br><br>"+
	"You will be asked to classify land as one of four land cover types: <b>TREES</b>, <b>GRASS</b>, <b>CROPS</b>, or <b>WETLAND</b>. This will be done by clicking on cells within a grid overlaid on the air photo.<br><br>"+
	"Land cover classification can be a tricky and uncertain process. You will likely feel uncertain about your choices at times. <i>Use your best guess.</i><br><br>",
	//1	
	"<figure style='float:right'><img src='"+imgfldr+"example1.png' height='250px'></figure><br>"+
	"Classifications are done in two stages.<br><br>"+
	"First, you will be shown an air photo of a parcel of land broken into four quarters: NW, NE, SW, and SE.<br><br>"+ 
	"Clicking on any of these quarters will zoom in to the corresponding quarter of the air photo.<br>",
	//2
	"<figure style='float:right'><img src='"+imgfldr+"example2.png' height='250px'></figure><br>"+
	"The second part of the classification is to mark grid cells as one of four cover types. This is done on a 24x24 grid overlaid on the zoomed quarter.<br><br>"+
	"The '<b>Grid:</b>' option on the left side of the image can be used to show or hide this grid<br><br>"+
	"You will be asked to identify each grid cell as a specific land cover type if <u>more than half</u> of its area is that type. Use your best guess if it's really close.<br>",
	//3
	"<br>In order to receive payment, at least <b>95%</b> of the cells must be classified. The progress bar along the top will show you how much you have done.<br><br>"+
	"Once the classification is at least 95% complete, a submit button will appear at the bottom of the page. Clicking this button will submit the HIT. Failing or circumventing this requirement will result in the HIT being 	rejected.",
	//4
	"<figure style='float:right'><figcaption>Classification<br>Toolbar</figcaption><img src='"+imgfldr+"example3.png' height='300px'></figure>"+
	"<br>The toolbar to the right of the zoomed photo will allow you to choose one of the four different cover types.<br><br>"+
	"Click on the 1x1 or 3x3 button of a specific land cover type to 'paint' that type onto the grid cells.<br><br>"+
	"If a majority of the the cell is a type not listed (such as buildings or roads) <i>leave the cell blank</i><br><br>"+
	"Click on an empty cell and drag to 'paint' the classification on the image. To 'erase' the classification, click on a filled cell and drag.<br><br>"+
	"The CLEAR button can be used to remove all classifications from the photo.<br><br>"+
	"Click the red NEXT>> button at the top to return to the large photo.<br>",
	//5 (Removed after first viewing)
	"<br>Click on the help (<b>?</b>) button to the left of the image to view these instructions again.<br><br>"+
	"Click the next button to see examples of each cover type to help with identification.<br><br>"+
	"At any time, you can click outside this window to close it and begin the classification.<br><br>"+
	"<div class='beginbtn' onclick='hideDivs()'>BEGIN</div>",
	//6
	"<p>Crop</p><br>"+
	"Crop can often be identified by linear patterns from farming equipment, and may appear \"smoother\" than the surrounding vegetation.<br><br>"+
	"<table class='infotable'>"+
	"<tr><td><img src='"+imgfldr+"crop1.jpg'></td><td>Both halves of this image are crop</td></tr>"+
	"<tr><td><img src='"+imgfldr+"crop2.jpg'></td><td>Crop in black and white</td></tr>"+
	"<tr><td><img src='"+imgfldr+"crop3.jpg'></td><td>Crop surrounding natural vegetation</td></tr>"+
	"<tr><td><img src='"+imgfldr+"crop4.jpg'></td><td>Three different types of crop</td></tr>"+
	"<tr><td><img src='"+imgfldr+"crop5.jpg'></td><td>Two different crops in black and white</td></tr></table>",
	//7
	"<p>Grass</p><br>"+
	"For the purpose of this study, <b>grass</b> is any open area without tree cover <i>not being used in crop production.</i><br><br>"+
	"<table class='infotable'>"+
	"<tr><td><img src='"+imgfldr+"Grass1.jpg'></td><td>Open grass surrounded by trees</td></tr>"+
	"<tr><td><img src='"+imgfldr+"Grass2.jpg'></td><td>Grass with some sparse tree cover. If a cell looks mixed between trees and grass, use your best guess. </td></tr>"+
	"<tr><td><img src='"+imgfldr+"Grass3.jpg'></td><td>Open field not being used for crops</td></tr>"+
	"<tr><td><img src='"+imgfldr+"Grass4.jpg'></td><td>Grass beside some barns. There is crop visible on the left.</td></tr></table>",
	//8
	"<p>Trees</p><br>"+
	"Trees are fairly easy to identify on air photos because of their distinctive texture.<br><br>"+
	"<table class='infotable'>"+
	"<tr><td><img src='"+imgfldr+"Trees1.jpg'></td><td>Trees in black and white</td></tr>"+
	"<tr><td><img src='"+imgfldr+"Trees2.jpg'></td><td>Trees of varying heights. If the trees look very small or sparse, classify as grass.</td></tr></table>",
	//9
	"<p>Wetland</p><br>"+
	"Wetland refers to areas of open water, or areas that likely contained water when the photo was taken. Water appears very dark and smooth on air photos.<br><br>"+
	"<table class='infotable'>"+
	"<tr><td><img src='"+imgfldr+"Wetland1.jpg'></td><td>Open pond beside crop</td></tr>"+
	"<tr><td><img src='"+imgfldr+"Wetland2.jpg'></td><td>Three small wetlands surrounded by crop</td></tr>"+
	"<tr><td><img src='"+imgfldr+"Wetland3.jpg'></td><td>Long, narrow wetland</td></tr></table>",
];

var p = 0;
var first = true;

function hideDivs(){
	document.getElementById("instructions").style.display = "none";
	document.getElementById("instructionsWrapper").style.display = "none";
	if (first){
		document.getElementById("closeinfo").innerHTML = "Click outside to close";
		first = false;
		pages.splice(cutout,1);
	}
}
 
 function showDivs(page) {
	document.getElementById("instructions").style.display = "block";
	document.getElementById("instructionsWrapper").style.display = "block";
	p=page;
	document.getElementById("content").innerHTML = pages[page];
	document.getElementById("instructionsWrapper").setAttribute('onclick',"hideDivs()");
}

 
function writeInstructions(){
	document.getElementById("content").innerHTML = pages[0];
	
	var nextP = document.createElement("div");
	var prevP = document.createElement("div");
	nextP.id = "nextP";
	prevP.id = "prevP";
	nextP.classList.add("pageBTN","activeBTN");
	prevP.classList.add("pageBTN", "disabledBTN");
	nextP.innerHTML = "→";
	prevP.innerHTML = "←";
	nextP.setAttribute("onclick","changePage(1)");
	prevP.setAttribute("onclick","changePage(-1)");
	document.getElementById("btns").appendChild(nextP);
	document.getElementById("btns").appendChild(prevP);
}

function changePage(updn){
	
	p += updn;
	var next = document.getElementById("nextP");
	var prev = document.getElementById("prevP")
	if (p == cutout+1 && first){
		document.getElementById("instructionsWrapper").setAttribute('onclick',"hideDivs()");
		document.getElementById("closeinfo").innerHTML = "Click outside to close";
		first = false;
		pages.splice(cutout,1);
		p=cutout;
	}
	
	if (p<0){
		deactivate(prev);
		p = 0;
		return;
	} else if (p==0){
		deactivate(prev);
	} else if (p>0 && p < pages.length-1){
		if (next.classList.contains("disabledBTN")){activate(next);}	
		if (prev.classList.contains("disabledBTN")){activate(prev);}	
	} else if (p == pages.length-1){
		deactivate(next);
	} else if (p >= pages.length){
		deactivate(next);
		p = pages.length - 1;
		return;
	}
	
	document.getElementById("content").innerHTML = pages[p];
	
}

function activate(btn){btn.classList.add("activeBTN");btn.classList.remove("disabledBTN");}
function deactivate(btn){btn.classList.remove("activeBTN");btn.classList.add("disabledBTN");}

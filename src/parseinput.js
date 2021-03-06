function getInputSequences() {
  "use strict";
  var seqBox = document.getElementById("SEQ_BOX");
  var dotbrBox = document.getElementById("DOTBR_BOX");
  var sequence = seqBox.value;
  var dotbr = dotbrBox.value;

  return [sequence, dotbr];
}

function main() {
  "use strict";
  //initalize input boxes with example structure
  document.getElementById("SEQ_BOX").value = "CAGCACGACACUAGCAGUCAGUGUCAGACUGCARACAGCACGACACUAGCAGUCAGUGUCAGACUGCARACAGCACGACACUAGCAGUCAGUGUCAGACUGCARA";
  document.getElementById("DOTBR_BOX").value = "..(((((...(((((...(((((...(((((.....)))))...))))).....(((((...(((((.....)))))...))))).....)))))...)))))..";
  //init colors
  $("#acolor").spectrum({color: "#64F73F"});
  $("#ccolor").spectrum({color: "#FFB340"});
  $("#gcolor").spectrum({color: "#EB413C"});
  $("#ucolor").spectrum({color: "#3C88EE"});
  $("#selcolor").spectrum({color: "#F6F6F6"});
  //init alert box
  document.getElementById( "ALERT" ).value = "";

  var input = getInputSequences();
  var struct = transformDotBracket(input[0], input[1]);
  visCytoscapeJs(struct);

  var runButton = document.getElementById("PERFORM_VIS");
  runButton.readOnly = true;
  runButton.addEventListener("click", function(){ 
    document.getElementById("ALERT").value = "";
  	var input = getInputSequences();
  	if(checkConditions(input)){
  		var struct = transformDotBracket(input[0], input[1]);
  		visCytoscapeJs(struct);
  	}
  }, false);

  var seqBox = document.getElementById("SEQ_BOX");
  seqBox.addEventListener("keypress", function(){
      var pos = doGetCaretPosition(seqBox);
      var dotbrBox = document.getElementById("DOTBR_BOX");
      dotbrBox.value = [dotbrBox.value.slice(0, pos), ".", dotbrBox.value.slice(pos)].join("");
  }, false);
}

function checkConditions(sequences){
  "use strict";
  var isFine = true;
  if(sequences[0].length === 0 || sequences[1].length === 0){
    isFine = false;
    document.getElementById("ALERT").value = "Please enter a sequence!";
  }
  else if(sequences[0].length != sequences[1].length){
    isFine = false;
    document.getElementById("ALERT").value = "Sequences must have equal length!";
  }
  else if(! sequences[1].match("^[().]+$")){
    isFine = false;
    document.getElementById("ALERT").value = "Dot-bracket sequence may only contain \"(\", \")\", or \".\"!";
  }
  else if(! sequences[0].match("^[ACGUTRYSWKMBDHVNacgutryswkmbdhvn-]+$")){
    isFine = false;
    document.getElementById("ALERT").value = "Sequence may only contain IUPAC-characters!";
  }
  return isFine;
}

function doGetCaretPosition (ctrl) {
  var CaretPos = 0;  
  // IE Support
  if (document.selection) {
    ctrl.focus ();
    var Sel = document.selection.createRange ();
    Sel.moveStart ('character', -ctrl.value.length);
    CaretPos = Sel.text.length;
  }
  // Firefox support
  else if (ctrl.selectionStart || ctrl.selectionStart == '0')
    CaretPos = ctrl.selectionStart;
  return (CaretPos);
}

$( document ).ready(main);

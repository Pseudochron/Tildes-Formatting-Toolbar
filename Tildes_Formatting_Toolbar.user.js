// ==UserScript==
// @name		Tildes Formatting Toolbar
// @namespace	pseudochron.com
// @description	Adds a toolbar with buttons for bold, italic, and more
// @include		https://tildes.net/*
// @grant		none
// @version		1.0.0
// ==/UserScript==


var markdownMenus = document.getElementsByClassName("tab-markdown-mode");

var replyButtons = document.getElementsByName("reply");

for (var i=0; i<replyButtons.length; i++) {
	  replyButtons[i].addEventListener("click", replyClick);
}

var editButtons = document.getElementsByName("edit");
for (var i=0; i<editButtons.length; i++) {
	  editButtons[i].addEventListener("click", replyClick);
}

for (var i=0; i<markdownMenus.length; i++) {
	  buildToolbar(markdownMenus[i]);
}

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };

//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
	for(let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			//console.log('A child node has been added or removed.');
			//console.log(mutation);
			
			var newMarkdownMenus = mutation.target.getElementsByClassName("tab-markdown-mode");
			
			if (newMarkdownMenus.length > 0) {
	            //console.log('A tab-markdown-mode node has been added or removed.');
	            
	            observer.disconnect();
	            
	            var commentBoxes = document.getElementsByName("markdown");
	            for (var i=0; i<commentBoxes.length; i++) {
						commentBoxes[i].onkeydown = function(e) {
						  if (e.which == 77) {
							    //console.log("M key was pressed");
						  } else if (e.ctrlKey && e.which == 66) {
							    //console.log("Ctrl + B shortcut combination was pressed");
							    surroundText(this, "**");
							    e.preventDefault();
							    e.stopPropagation();  
						  } else if (e.ctrlKey && e.which == 73) {
							    surroundText(this, "*");
							    e.preventDefault();
							    e.stopPropagation(); 
						  } else if (e.ctrlKey && e.which == 75) {
							    surroundText(this, "[", "](url)");
							    e.preventDefault();
							    e.stopPropagation(); 
						  }
						};
	            }
	            
	            markdownMenus = document.getElementsByClassName("tab-markdown-mode");
				for (var i=0; i<markdownMenus.length; i++) {
					
					//test if it already has a toolbar
					if (markdownMenus[i].nextSibling.className != "form-buttons markdown-toolbar") {
					
						buildToolbar(markdownMenus[i]);
						//console.log("Building toolbar number " + i);
					}
				}
			}
		}
	}
	//var newMarkdownMenus = document.getElementsByClassName("tab-markdown-mode");

};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

function replyClick() {
	//console.log("reply click");
	var article = this.parentNode.parentNode.parentNode.parentNode;
	//console.log(article.id);
	//var textArea = article.getElementsByTagName("textarea")[0];

	// Start observing the target node for configured mutations
	observer.observe(article, config);
	
	//var markdownMenu = article.getElementsByClassName("tab-markdown-mode")[0];
	//console.log(markdownMenu.childElementCount);
	
	//buildToolbar(markdownMenu);
}

function buildToolbar(markdownMenu) {
	var toolbar = document.createElement("div");
	toolbar.className = "form-buttons markdown-toolbar";
	//toolbar.style = "display: inline;";
	//toolbar.innerHTML = '<button type="button" class="btn btn-bold" onClick="console.log(this.className)" style="font-weight: bold"><b>B</b></button>' + 
	//	 '<button type="button" class="btn btn-italic"	onClick="console.log(this.className)" style="font-style: italic"><em>i</em></button>';
	
	var olButton = document.createElement("button");
	olButton.addEventListener("click", ol);
	olButton.className = "btn btn-ol";
	olButton.innerHTML = "<small>1. â€•<br/>2. â€•<br/>3. â€•<br/></small>";
	olButton.type ="button";
	olButton.title = "Numbered List"; 
	//olButton.style = "margin-left: 0; border-left: none; line-height: 0.5rem; padding-top: 2px; width: 24px;";
	olButton.style = "line-height: 0.5rem; padding-top: 3px; width: 36px;";
	toolbar.appendChild(olButton);	
	
	var ulButton = document.createElement("button");
	ulButton.addEventListener("click", ul);
	ulButton.className = "btn btn-ul";
	ulButton.innerHTML = "â€¢ â€•<br/>â€¢ â€•<br/>â€¢ â€•<br/>";
	ulButton.type ="button";
	ulButton.title = "Bulleted List"; 
	//ulButton.style = "line-height: 0.5rem; letter-spacing: -0.05rem; padding-top: 1px; padding-left: 0.2rem; width: 24px;";
	ulButton.style = " line-height: 0.5rem; padding-top: 2px; width: 36px;";
	toolbar.appendChild(ulButton);
	
	var detailsButton = document.createElement("button");
	detailsButton.addEventListener("click", details);
	detailsButton.className = "btn btn-details";
	//detailsButton.innerHTML = "&#9654;<small>D</small>";
	detailsButton.type ="button";
	detailsButton.title = "Details / Spoiler"; 
	detailsButton.style = "font-weight: normal; width: 36px;"
	toolbar.appendChild(detailsButton);
	
	var detailsButtonOutline = document.createElement("span");
	detailsButtonOutline.innerHTML = "<small>&#9654;</small> &nbsp;&nbsp;";
	detailsButtonOutline.style = "outline: 1px dotted; padding-left: 3px; padding-right: 3px; padding-top: 0; padding-bottom: 0; line-height: 0.5rem; ";
	detailsButton.appendChild(detailsButtonOutline);
	
	var codeButton = document.createElement("button");
	codeButton.addEventListener("click", code);
	codeButton.className = "btn btn-code";
	codeButton.innerHTML = "&lt; &gt;";
	codeButton.type ="button";
	codeButton.title = "Code"; 
	codeButton.style = "width: 36px;"
	toolbar.appendChild(codeButton);
	
	var quoteButton = document.createElement("button");
	quoteButton.addEventListener("click", quote);
	quoteButton.className = "btn btn-quote";
	//quoteButton.innerHTML = "&#128630;"; // doesn't display in Chrome
	quoteButton.innerHTML = "&#10077;";
	quoteButton.type ="button";
	quoteButton.title = "Quote"; 
	quoteButton.style = "font-size: 1.3rem; font-weight: normal; padding-top: 10px; width: 36px;";
	toolbar.appendChild(quoteButton);
	
	var supButton = document.createElement("button");
	supButton.addEventListener("click", sup);
	supButton.className = "btn btn-sup";
	supButton.innerHTML = "A<sup><b>2</b></sup>";
	supButton.type ="button";
	supButton.title = "Superscript"; 
	supButton.style = "margin-left: 0; border-left: none; font-weight: normal; width: 24px;";
	toolbar.appendChild(supButton);
	
	var subButton = document.createElement("button");
	subButton.addEventListener("click", sub);
	subButton.className = "btn btn-sub";
	subButton.innerHTML = "A<sub><b>2</b></sub>";
	subButton.type ="button";
	subButton.title = "Subscript"; 
	subButton.style = "font-weight: normal; width: 24px;";
	toolbar.appendChild(subButton);
	
	var smallButton = document.createElement("button");
	smallButton.addEventListener("click", small);
	smallButton.className = "btn btn-small";
	smallButton.innerHTML = "<small>S</small><sup><small>&#9660;</small></sup>";
	smallButton.type ="button";
	smallButton.title = "Small"; 
	smallButton.style = "margin-left: 0; border-left: none; width: 24px;"
	toolbar.appendChild(smallButton);
	
	var headerButton = document.createElement("button");
	headerButton.addEventListener("click", header);
	headerButton.className = "btn btn-header";
	headerButton.innerHTML = "<big>H</big><sup><small>&#9650;</small></sup>";
	headerButton.type ="button";
	headerButton.title = "Header"; 
	headerButton.style = "width: 24px;"
	toolbar.appendChild(headerButton);
	
	var linkButton = document.createElement("button");
	linkButton.addEventListener("click", linkify);
	linkButton.className = "btn btn-linkify";
	//linkButton.innerHTML = "<small>URL</small>";
	linkButton.innerHTML = "&#128279;";
	linkButton.type ="button";
	linkButton.title = "Link (Ctrl-K)"; //75
	linkButton.style = "font-family: Arial, 'Segoe UI Emoji', 'Segoe UI Symbol'; font-weight: normal; font-size: 1rem;  width: 36px;"
	toolbar.appendChild(linkButton);	
	
	var strikeButton = document.createElement("button");
	strikeButton.addEventListener("click", strike);
	strikeButton.className = "btn btn-strike";
	strikeButton.innerHTML = "<del>&nbsp;s&nbsp;</del>";
	strikeButton.type ="button";
	strikeButton.title = "Strikethrough";
	strikeButton.style = "font-size: 0.8rem; padding-top: 2px; font-weight: normal; width: 36px;"
	toolbar.appendChild(strikeButton);
	
	var italicButton = document.createElement("button");
	italicButton.addEventListener("click", italicize);
	italicButton.className = "btn btn-italic";
	italicButton.innerHTML = "<i>i</i>";
	italicButton.type ="button";
	italicButton.title = "Italic (Ctrl-I)"; //73
	italicButton.style = "width: 36px;"
	toolbar.appendChild(italicButton);
	
	var boldButton = document.createElement("button");
	boldButton.addEventListener("click", embolden);
	boldButton.className = "btn btn-bold";
	boldButton.innerHTML = "B";
	boldButton.type ="button";
	boldButton.title = "Bold (Ctrl-B)"; //66
	boldButton.style = "font-weight: 900; width: 36px;"
	toolbar.appendChild(boldButton);
	
	markdownMenu.parentNode.insertBefore(toolbar, markdownMenu.nextSibling);
	//markdownMenus[i].append(toolbar);
}


var commentBox = document.getElementsByTagName("textarea")[0];

if (commentBox) {
  commentBox.onkeydown = function(e) {
    if (e.which == 77) {
        //console.log("M key was pressed");
    } else if (e.ctrlKey && e.which == 66) {
        //console.log("Ctrl + B shortcut combination was pressed");
        surroundText(commentBox, "**");
        e.preventDefault();
        e.stopPropagation();  
    } else if (e.ctrlKey && e.which == 73) {
        surroundText(commentBox, "*");
        e.preventDefault();
        e.stopPropagation(); 
    } else if (e.ctrlKey && e.which == 75) {
        surroundText(commentBox, "[", "](url)");
        e.preventDefault();
        e.stopPropagation(); 
    }
  };
}
	

function embolden() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "**");
}

function italicize() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "*");
}

function linkify() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "[", "](url)");
}

function strike() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "~~");
}

function sub() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "<sub>", "</sub>");
}

function sup() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "<sup>", "</sup>");
}

function small() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "<small>", "</small>");
}

function code() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
  
	var startPos = commentBox.selectionStart;
	var endPos = commentBox.selectionEnd;
  
	var value = commentBox.value;
	var selection = value.substr(startPos, endPos - startPos);
	var textArray = selection.split("\n");
	
	var start = "```\n";
	var end = "\n```";
	// if there are multiple lines selected
	if (textArray.length > 1) {
		//block code    
		surroundText(commentBox, start, end)
	} else {
		//inline code
		surroundText(commentBox, "`");
	}
}

function details() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	surroundText(commentBox, "<details>\n<summary>Click to view</summary>\n\n", "\n</details>");
}

function header() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	prependLines(commentBox, "#", false);
}

function quote() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	prependLines(commentBox, "> ", true);
}

function ul() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	prependLines(commentBox, "* ", true);
}

function ol() {
	var commentBox = this.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	prependLines(commentBox, "1. ", true);
}

function prependLines(commentBox, prefix, toggle) {
	var startPos = commentBox.selectionStart;
	var endPos = commentBox.selectionEnd;
	
	var value = commentBox.value;
	
	var preSelection = value.substr(0, startPos);
	var selection = value.substr(startPos, endPos - startPos);
	var preSelTextArray = preSelection.split("\n");
	var textArray = selection.split("\n");
  
  //var lastPreSelLine = preSelTextArray[preSelTextArray.length - 1];
  
  // The pop() method removes the last element of an array, and returns that element.
  var lastPreSelLine = preSelTextArray.pop();
  
  preSelection = preSelTextArray.join("\n");
  
  if (preSelTextArray.length > 0) {
    preSelection += "\n";
  }
  
  // go to the beginning of the first selected line
  textArray[0] = lastPreSelLine + textArray[0];
  
  var prefixCount = 0;
  var removedFirstLinePrefix = false;
  
  for (i = 0; i < textArray.length; i++) {
    if (toggle) {
      // if the line starts with the prefix already
      if (textArray[i].substr(0, prefix.length) == prefix) {
        // remove the prefix
        textArray[i] = textArray[i].substr(prefix.length,textArray[i].length);
        prefixCount--;
        if (i == 0) {
          removedFirstLinePrefix = true;
        }
      } else {
        // add the prefix
        textArray[i] = prefix + textArray[i];
        prefixCount++;
      }
    } else {
      // if the line starts with the prefix already
      if (textArray[i].substr(0, prefix.length) == prefix) {
        // add the prefix again
        textArray[i] = prefix + textArray[i];
        prefixCount++;
      } else {
          //add a space after the prefix
          textArray[i] = prefix + " "+ textArray[i];       
       }
    }
  } 
  
  selection = textArray.join("\n");
  
  commentBox.value = preSelection + selection + value.substr(endPos);
  commentBox.focus();
	//commentBox.setSelectionRange(startPos + prefix.length,endPos + prefix.length);
  
  if (removedFirstLinePrefix) {
    commentBox.setSelectionRange(startPos - prefix.length, endPos + (prefix.length * prefixCount) );
  } else {
    commentBox.setSelectionRange(startPos + prefix.length, endPos + (prefix.length * prefixCount) );
  }
}

function surroundText(commentBox, prefix, postfix) {
	// if you pass only one argument, it's used for both beginning and end
	if (postfix === undefined) postfix = prefix;
  
	var startPos = commentBox.selectionStart;
	var endPos = commentBox.selectionEnd;
		
	//console.log(startPos + ", " + endPos);
	
	var value = commentBox.value;
	
	//console.log(value.substr(startPos, endPos));
	commentBox.value = value.substr(0, startPos) + prefix + value.substr(startPos, endPos - startPos) + postfix + value.substr(endPos);
	
	commentBox.focus();
	
	commentBox.setSelectionRange(startPos + prefix.length,endPos + prefix.length);
}

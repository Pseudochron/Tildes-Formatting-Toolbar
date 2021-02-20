// ==UserScript==
// @name		Tildes Formatting Toolbar
// @namespace	pseudochron.com
// @description Adds a toolbar with buttons for bold, italic, and more
// @include 	https://tildes.net/*
// @version 	0.0.1
// @grant		GM_addStyle
// ==/UserScript==
/*
GM_addStyle( "div.toolbar button.btn-italic {font-style: italic;}" );
GM_addStyle( "div.toolbar {border: 2px solid red;}" );


var style = document.createElement('style');
style.innerHTML = 'body {display: none!important;}';

// Get the first script tag
var ref = document.querySelector('script');

// Insert our new styles before the first script tag
ref.parentNode.insertBefore(style, ref);


var commentBoxes = document.getElementsByName("markdown");

for (var i=0; i<commentBoxes.length; i++) {
  console.log(commentBoxes[i].id);
}
*/

var markdownMenus = document.getElementsByClassName("tab-markdown-mode");

var replyButtons = document.getElementsByName("reply");

for (var i=0; i<replyButtons.length; i++) {
	  replyButtons[i].addEventListener("click", replyClick);
}




for (var i=0; i<markdownMenus.length; i++) {
	  buildToolbar(markdownMenus[i]);
}


//https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

// Options for the observer (which mutations to observe)
const config = { childList: true, subtree: true };
	
// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
	for(let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			console.log('A child node has been added or removed.');
			console.log(mutation);
			
			var newMarkdownMenus = mutation.target.getElementsByClassName("tab-markdown-mode");
			
			if (newMarkdownMenus.length > 0) {
	            console.log('A tab-markdown-mode node has been added or removed.');
	            
	            observer.disconnect();
	            
	            var commentBoxes = document.getElementsByName("markdown");
	            for (var i=0; i<commentBoxes.length; i++) {
		            
		            
						commentBoxes[i].onkeydown = function(e) {
						  if (e.which == 77) {
							    console.log("M key was pressed");
						  } else if (e.ctrlKey && e.which == 66) {
							    console.log("Ctrl + B shortcut combination was pressed");
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
						console.log("Building toolbar number " + i);
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
	console.log("reply click");
	var article = this.parentNode.parentNode.parentNode.parentNode;
	console.log(article.id);
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
	//toolbar.innerHTML = '<button type="button" class="btn btn-bold" onClick="console.log(this.className)" style="font-weight: bold"><b>B</b></button>' + 
	//	 '<button type="button" class="btn btn-italic"	onClick="console.log(this.className)" style="font-style: italic"><em>i</em></button>';
	
	
	var linkButton = document.createElement("button");
	linkButton.addEventListener("click", linkify);
	linkButton.className = "btn btn-linkify";
	linkButton.innerHTML = "<small>URL</small>";
	linkButton.type ="button";
	linkButton.title = "Link (Ctrl-K)" //75
	toolbar.appendChild(linkButton);	
	
	var italicButton = document.createElement("button");
	italicButton.addEventListener("click", italicize);
	italicButton.className = "btn btn-italic";
	italicButton.innerHTML = "&nbsp;&nbsp;&nbsp;<i>i</i>&nbsp;&nbsp;";
	italicButton.type ="button";
	italicButton.title = "Italic (Ctrl-I)" //73
	toolbar.appendChild(italicButton);
	
	
	var boldButton = document.createElement("button");
	boldButton.addEventListener("click", embolden);
	boldButton.className = "btn btn-bold";
	boldButton.innerHTML = "&nbsp;<b>B</b>&nbsp;&nbsp;";
	boldButton.type ="button";
	boldButton.title = "Bold (Ctrl-B)" //66
	toolbar.appendChild(boldButton);
	
	
	
	markdownMenu.parentNode.insertBefore(toolbar, markdownMenu.nextSibling);
	//markdownMenus[i].append(toolbar);
	
	/*
	var commentBox = markdownMenu.parentNode.parentNode.parentNode.getElementsByTagName("textarea")[0];
	commentBox.onkeypress = function(e) {
		if (e.ctrlKey && e.which == 66) {
			//alert("Ctrl + B shortcut combination was pressed");
			surroundText(commentBox, "**");
		} else if (e.ctrlKey && e.which == 73) {
			surroundText(commentBox, "*");
		} else if (e.ctrlKey && e.which == 75) {
			surroundText(commentBox, "[", "](url)");
		}
	};
*/
}




	var commentBox = document.getElementsByTagName("textarea")[0];
	/*
	document.onkeydown = function(e) {
		if (e.ctrlKey && e.which == 66) {
			console.log("Ctrl + B shortcut combination was pressed");
			surroundText(commentBox, "**");
		} else if (e.ctrlKey && e.which == 73) {
			surroundText(commentBox, "*");
		} else if (e.ctrlKey && e.which == 75) {
			surroundText(commentBox, "[", "](url)");
		}
	};
*/
commentBox.onkeydown = function(e) {
  if (e.which == 77) {
	    console.log("M key was pressed");
  } else if (e.ctrlKey && e.which == 66) {
	    console.log("Ctrl + B shortcut combination was pressed");
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

function surroundText(commentBox, prefix, postfix) {
	// if you pass only one argument, it's used for both beginning and end
	if (postfix === undefined) postfix = prefix;
  
	var startPos = commentBox.selectionStart;
	var endPos = commentBox.selectionEnd;
		
	console.log(startPos + ", " + endPos);
	
	var value = commentBox.value;
	
	//if (startPos != endPos) {
	console.log(value.substr(startPos, endPos));
	commentBox.value = value.substr(0, startPos) + prefix + value.substr(startPos, endPos - startPos) + postfix + value.substr(endPos);
	//} else {
		
	//}
	
	commentBox.focus();
	
	commentBox.setSelectionRange(startPos + prefix.length,endPos + prefix.length);
	
  
}





@import 'common.js'
//@import 'library/sandbox.js'

var offset = 100;

var onRun = function(context) {

  var doc = context.document;
  var selection = context.selection;
  var pages = [doc pages];

  //name of the Symbols page
  var symbolsPageName = "Symbols";

  //initialize the variables
  var previousX = 0;
  var previousWidth = 0;
  var previousY = 0;
  var previousHeight = 0;
  var symbolY = 0;
  var y = 0;

  //if the doc has a symbol page store it in here
  var hasSymbolsPage = false;
  hasSymbolsPage = checkIfHasSymbolsPage(pages, symbolsPageName);

  //reference a selected layer
  var selection = context.selection;

  if(hasSymbolsPage == true){

    organizeSymbols(doc, pages, symbolsPageName, symbolY, previousX, previousWidth, previousY, previousHeight);
    alert("The symbols are all lined up in a nice row.", "Organization Complete!");

  } else {
    //alert user if no symbols page found
    alert("No Symbols Page Found!", "There is no page in this document named: "+symbolsPageName);
  }
}

function checkIfHasSymbolsPage(pages, symbolsPageName){

  var symbolPageCount = 0;

  for (var i = 0; i < pages.count(); i++){

    //reference each page
    var page = pages[i];

    //get the page name
    var pageName = [page name];

    //checks if the doc has a page with the name symbolsPageName
    if (pageName == symbolsPageName){
      symbolPageCount = symbolPageCount + 1;
    }
  }
  if(symbolPageCount > 0){
    return true;
  }else{
    return false;
  }
}

// Create a sort function for symbols (boards) within the groups by name
var hasAlerted = false;

function sortSymbols(a, b) {

  if (!hasAlerted) alert(`Sort: ${a.name}, ${b.name}`);
  hasAlerted = true;

  var nameA = a.name.toUpperCase(); // ignore upper and lowercase
  var nameB = b.name.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

function organizeSymbols(doc, pages, symbolsPageName, symbolY, previousX, previousWidth){
  //loop through the pages array
  for (var i = 0; i < pages.count(); i++){ 

    //reference each page
    var page = pages[i];

    //get the page name
    var pageName = [page name]; 

    //checks if the page name is Symbols
    if (pageName == symbolsPageName){

      //reference the artboards of each symbol
      var symbolGroups = {};
      var artboards = [page artboards];
      var previousY = 0;

      for (var z = 0; z < artboards.count(); z++){ 

        //var previousX = 0;
        //reference each artboard of each page
        var artboard = artboards[z];
        //reference the artboard's frame
        var artboardFrame = artboard.frame();

        var groupNames = artboard.name().split('/');
        var groupName = groupNames[0]; 
        var symbolName = artboard.name();

        if (!symbolGroups[groupName]) { 
          symbolGroups[groupName] = { boards: [{ idx: z, name: symbolName }], maxHeight: artboardFrame.height() };
        }  else {
          symbolGroups[groupName].boards.push({ idx: z, name: symbolName });
          symbolGroups[groupName].maxHeight = Math.max(symbolGroups[groupName].maxHeight, artboardFrame.height()); 
        } 
      }

      Object.keys(symbolGroups).sort().forEach(name => { 
        previousX = 0;
        previousWidth = 0; 

        symbolGroups[name].boards.sort(sortSymbols).forEach(artboardRef => {
          try {
            //reference the artboard's frame
            var artboard = artboards[artboardRef.idx];
            var artboardFrame = artboard.frame();
            var x = previousX + previousWidth;

            artboardFrame.setX(x);
            artboardFrame.setY(previousY);

            previousX = x + offset;
            previousWidth = artboardFrame.width();
          } catch (e) {
            alert('Error ' + e);
            throw e;
          }
        }); 

        previousY = previousY + symbolGroups[name].maxHeight + offset; 
      });

    } 
  }
}

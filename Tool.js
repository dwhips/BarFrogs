 //Helper Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomInt(max){
    return Math.floor(Math.random() * max);
}

//UI Support
function DeleteChildrenElements(parentElement)
{
    while (parentElement.firstChild) {
        parentElement.firstChild.remove()
    }
}

function GetClassElementByIndex(iTargetElement,
    strSearchClassName)
{
    var elSearchingDiv = document.querySelectorAll("."+strSearchClassName);
    if (elSearchingDiv.length === 0) throw new Error("Failed to find any elements for the class name: " + strSearchClassName);

    for(iElement = 0; iElement < elSearchingDiv.length; iElement++)
    {
        if (iElement === iTargetElement)
        {
            return elSearchingDiv[iElement];
        }
    }
    throw new Error("Could not find index " + iTargetElement + " a class div for class name: " + strSearchClassName + ". Only " + elSearchingDiv.length + "elements are available.");
}
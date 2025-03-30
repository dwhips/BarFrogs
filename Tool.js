 //Helper Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomInt(max){
    var test  = Math.floor(Math.random() * max);
    console.log(test);
    return test;
}
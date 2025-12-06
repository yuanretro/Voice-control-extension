const vh = window.innerHeight;
const vw = window.innerWidth;
const wordToNumMap = {
    'zero': 0,
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9,
    'ten' :10
};

let currentWord = "";
let allElements;
let navigableElements = [];

allElements = document.body.querySelectorAll('*');
allElements.forEach((element) => {
    if (element.checkVisibility()) {
        navigableElements.push(element);
    }
});
console.log(`${navigableElements.length} nevigable elements found.`);


function reload(){
    window.location.reload(true);
}


function customScroll(direction, relativeSize)
{
    if (direction === 0) { // up
        window.scrollBy({
            top: -vh / relativeSize,
            left: 0,
            behavior: "smooth"
        })
    } else if (direction === 1) { // down
        window.scrollBy({
            top: vh / relativeSize,
            left: 0,
            behavior: "smooth"
        })
    } else if (direction === 2) { // left
        window.scrollBy({
            top: 0,
            left: -vw / relativeSize,
            behavior: "smooth"
        })
    } else if (direction === 3) { // right
        window.scrollBy({
            top: 0,
            left: vw / relativeSize,
            behavior: "smooth"
        })
    }
}

function scrollToBottom(){
    window.scrollBy({
            top: document.body.scrollHeight,
            behavior: "smooth"
    })
}

function scrollToTop(){
    window.scrollTo({
            top: 0,
            behavior: "smooth"
    })
}

function getElementClosestToViewport(elements)
{
    let closest = null;
    let closestDistance = Infinity;

    elements.forEach(el => { // loop through all elements, find distance closest to screen
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = el;
        }
    });

    return closest;
}


function getElementsOnScreen(elements)
{
    let toReturn = []
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const distance = rect.top;
        if ((distance >= 0 && distance <= vh) || (distance + rect.height >= 0 && distance + rect.height <= vh)) {
            toReturn.push(element)
        }
    })

    return toReturn
}


function goBack(){
    history.go(-1); // go back one time (tab history)
}


function goForward(){
    history.go(1); // go forward one time (tab history)
}


function playVideo(activeElement)
{
    if (!activeElement) return null; //if no video found


    if (activeElement.tagName.toLowerCase() === "iframe") {
        const player = new YT.Player(activeElement);
        player.playVideo();
    }
    else{
        activeElement.play?.();
    }
    return activeElement;

}


function pauseVideo(activeElement) {
    if (!activeElement) return null; //if no video found


    if (activeElement.tagName.toLowerCase() === "iframe") {
        const player = new YT.Player(activeElement);
        player.pauseVideo();
    }
    else{
        activeElement.pause();
    }


}


function customZoom(direction){
    if(direction === 0) {
        let currentZoom = parseFloat(document.body.style.zoom) || 1;
        document.body.style.zoom = (currentZoom + 0.1).toFixed(2);
    }else if(direction === 1) {
        let currentZoom = parseFloat(document.body.style.zoom) || 1;
        document.body.style.zoom = (currentZoom - 0.1).toFixed(2);
    }
}

const originalColors = navigableElements.map(el => el.style.backgroundColor);

let elementNumber = 0;
let currentElement;

function highlightElement(index) {
    navigableElements.forEach((el, i) => {
        el.style.backgroundColor = originalColors[i];
    });

    currentElement = navigableElements[index];
    currentElement.style.backgroundColor = "#fbff00ff";

    currentElement.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    console.log("Focused:", currentElement.tagName);
}

function scrollToNextElement() {
    elementNumber = (elementNumber + 1) % navigableElements.length;
    highlightElement(elementNumber);
}

function scrollToPreviousElement() {
    elementNumber = (elementNumber - 1 + navigableElements.length) % navigableElements.length;
    highlightElement(elementNumber);
}

function tryPlayVideo() {
    const onScreenVideos = getElementsOnScreen(Array.from(document.querySelectorAll("video, iframe")))

    if (onScreenVideos.length >= 2) {
        // const rawUserInput = prompt("Multiple videos found, which one do you want to play? (Enter an integer):")
        const parsedUserInput = +wordToNumMap[currentWord];


        if (parsedUserInput <= onScreenVideos.length && parsedUserInput > 0) {
            const activeElement = onScreenVideos[parsedUserInput - 1];
            playVideo(activeElement)
        } else {
            console.log("Invalid number, please try again!")
        }
    } else {
        const activeElement = getElementClosestToViewport(onScreenVideos)
        playVideo(activeElement)
    }
}
function tryPauseVideo() {
    const onScreenVideos = getElementsOnScreen(Array.from(document.querySelectorAll("video, iframe")))

    if (onScreenVideos.length >= 2) {
        // const rawUserInput = prompt("Multiple videos found, which one do you want to pause? (Enter an integer):")
        const parsedUserInput = +wordToNumMap[currentWord];


        if (parsedUserInput <= onScreenVideos.length && parsedUserInput > 0) {
            const activeElement = onScreenVideos[parsedUserInput - 1];
            pauseVideo(activeElement)
        } else {
            console.log("Invalid number, please try again!")
        }
    } else {
        const activeElement = getElementClosestToViewport(onScreenVideos)
        pauseVideo(activeElement)
    }
}

function navigate() {
    //console.log(currentElement.href);
    const url = new URL(currentElement.href, window.location.href);
    window.location.href = url.href;
    //console.log(url.href);
    console.log(`Navigating to ${url.href}`);
    currentElement.onclick();
}


function action (keyword) {
    currentWord = keyword;
    switch (keyword) {
        case "up":
            customScroll(0, 2);
            break;
        case "down":
            customScroll(1, 2);
            break;
        case "left":
            customScroll(2, 2);
            break;
        case "right":
            customScroll(3, 2);
            break;
        case "big":
            customZoom(0);
            break;
        case "small":
            customZoom(1);
            break;
        case "before":
            goBack();
            break;
        case "after":
            goForward();
            break;
        case "next":
            scrollToNextElement();
            break;
        case "previous":
            scrollToPreviousElement();
        case "play":
            tryPlayVideo();
            break;
        case "pause":
            tryPauseVideo();
            break;
        case "enter":
            navigate();
            break;
        case "top":
            scrollToTop();
            break;
        case "end":
            scrollToBottom();
            break;
        case "fresh":
            reload();
            break;
    }
}


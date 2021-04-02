const movables = ['1:1', '1:2', '2:1', '2:2', '2:3', '3:2', '3:3', '3:1', '1:3'];
let truckLayout;
let truckCells;
let frameWidth;
let frameHeight;
let dragItem;
let active = false;
var currentX;
var currentY;
let movableItem;
let packages = 0;

class movable {
    constructor(element, w, h, cols, rows) {
        this.element = element;
        this.width = cols;
        this.height = rows;
        this.xPos = $(element).offset().left;
        this.yPos = $(element).offset().top;
        this.endXPos = this.xPos + w * cols;
        this.endYPos = this.yPos + h * rows;
        this.initialXPos = $(element).offset().left;
        this.initialYPos = $(element).offset().top;
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function startGame() {
    truckLayout = document.getElementById('truckLayout');
    truckCells = document.getElementsByClassName('truckCell');
    frameWidth = truckCells[0].offsetWidth;
    frameHeight = truckCells[0].offsetHeight;
    generatePackage();
}

function finishMiniGame() {
    movableItem.xPos = 0;
    movableItem.yPos = 0;
    movableItem.width = 0;
    movableItem.height = 0;
    drawCoords(movableItem);
    movableItem.element.innerHTML = '';
    movableItem = null;
}

function generatePackage() {
    var div = document.createElement('div');
    $(div).addClass('movable');
    $(div).attr('name', movables[getRandomInt(movables.length)]);
    div.addEventListener("mousedown", startDrag, false);
    div.addEventListener("mouseup", endDrag, false);
    div.addEventListener("mousemove", drag, false);
    $('#rightGamePanel').append(div);
    movableItem = new movable(div, frameWidth, frameHeight, $(div).attr('name').split(':')[0], $(div).attr('name').split(':')[1]);
    drawCoords(movableItem);
}

function drawCoords(object) {
    // object.element.innerHTML = `(${object.xPos} , ${object.yPos})<br>(${object.endXPos}, ${object.endYPos})`;
    object.element.style.width = frameWidth * object.width+'px';
    object.element.style.height = frameHeight * object.height+'px';
}

function startDrag(e) {
    console.log('start drag');
    if(e.target === movableItem.element) {
        active = true;
        dragItem = movableItem;
    }
    currentX = dragItem.xPos;
    currentY = dragItem.yPos;
    dragItem.element.innerHTML = '';
}

function endDrag(e) {

    if(!isElementInPlace(currentX, currentY, truckLayout)) {
        moveItem(dragItem.initialXPos, dragItem.initialYPos, dragItem);
    } else {
        var parentFrame = highlightFrame(currentX, currentY, true);
        stickToFrame(parentFrame, dragItem);
    }

    active = false;

    highlightFrame(0, 0, false);
}

function drag(e) {
    if(active && isMouseInContainer(e) && !isMouseOutOfBox(e)) {
        e.preventDefault();
        currentX += e.movementX;
        currentY += e.movementY;

        moveItem(currentX, currentY, dragItem);
        highlightFrame(currentX, currentY, false);
    } else if(active && (!isMouseInContainer(e) || isMouseOutOfBox(e))) {
        moveItem(dragItem.initialXPos, dragItem.initialYPos, dragItem);
        active = false;
        highlightFrame(0, 0, false);
    }
}

function isMouseInContainer(e) {
    if(e.clientX < $('#container').offset().left || e.clientY < $('#container').offset().top || e.clientX > $('#container').offset().left+$('#container').width() || e.clientY > $('#container').offset().top+$('#container').height()) {
        return false;
    } else {
        return true;
    }
}

function isMouseOutOfBox(e) {
    if(e.clientX < dragItem.xPos || e.clientY < dragItem.yPos || e.clientX > dragItem.xPos + frameWidth * dragItem.width || e.clientY > dragItem.yPos + frameHeight * dragItem.height) {
        return true;
    } else {
        return false;
    }
}

function moveItem (xPos, yPos, el) {
    el.xPos = xPos;
    el.yPos = yPos;
    el.endXPos = xPos + frameWidth;
    el.endYPos = yPos + frameHeight;
    el.element.offsetLeft = xPos;
    el.element.offsetTop = yPos;
    $(el.element).offset({top:yPos, left:xPos});
    drawCoords(el);
}

function isElementInPlace(x, y, el) {
    var x0 = $(el).offset().left;
    var y0 = $(el).offset().top;
    var x1 = x0 + $(el).width();
    var y1 = y0 + $(el).height();
    console.log(`(${x0}, ${y0}) -- (${x1}, ${y1})     ||      (${x}, ${y})`)
    if(x0 <= x && x <= x1 && y0 <= y && y <= y1 || x0 <= x + frameWidth && x + frameWidth <= x1 && y0 <= y && y <= y1 || x0 <= x && x <= x1 && y0 <= y + frameHeight && y + frameHeight <= y1 || x0 <= x + frameWidth && x + frameWidth <= x1 && y0 <= y + frameHeight && y + frameHeight <= y1) {
        return true;
    } else {
        return false;
    }
}

function highlightFrame(x, y, returnElement) {
    for(var i = 0; i < truckCells.length; i++) {
        if($(truckCells[i]).attr('name') == 'empty' && $(truckCells[i]).offset().left <= x && x <= $(truckCells[i]).offset().left+frameWidth && $(truckCells[i]).offset().top <= y && y <= $(truckCells[i]).offset().top+frameHeight) {
            $(truckCells[i]).css('outline', '3px solid red');
            if(returnElement) {
                return truckCells[i];
            }
        } else {
            $(truckCells[i]).css('outline', 'none');
        }
    }
}

function stickToFrame (parent, child) {
    if($(parent).attr('name') == 'empty') {
        console.log(`${child.height}:${child.width}`)
        if(child.height >= 1 || child.width >= 1) {
            if(parseInt($(parent).attr('id').split(':')[1]) + parseInt(child.width) <= 3 && parseInt($(parent).attr('id').split(':')[0]) + parseInt(child.height) <= 6) {
                for(var i = parseInt($(parent).attr('id').split(':')[1]); i < parseInt($(parent).attr('id').split(':')[1]) + parseInt(child.width); i++) {
                    for(var j = parseInt($(parent).attr('id').split(':')[0]); j < parseInt($(parent).attr('id').split(':')[0]) + parseInt(child.height); j++) {
                        if($(document.getElementById(`${j}:${i}`)).attr('name') != 'empty') {
                            moveItem(child.initialXPos, child.initialYPos, child);
                            return;
                        }
                    }
                }
                for(var i = parseInt($(parent).attr('id').split(':')[1]); i < parseInt($(parent).attr('id').split(':')[1]) + parseInt(child.width); i++) {
                    for(var j = parseInt($(parent).attr('id').split(':')[0]); j < parseInt($(parent).attr('id').split(':')[0]) + parseInt(child.height); j++) {
                        $(document.getElementById(`${j}:${i}`)).attr('name', 'filled')
                    }
                }
            } else {
                moveItem(child.initialXPos, child.initialYPos, child);
                return;
            }
        }
        $(child.element).offset({top:$(parent).offset().top, left:$(parent).offset().left});
        child.element.removeEventListener("mousedown", startDrag, false);
        child.element.removeEventListener("mouseup", endDrag, false);
        child.element.removeEventListener("mousemove", drag, false);
        $(child.element).attr('class', 'moved');
        packages++;
        generatePackage();
    } else {
        moveItem(child.initialXPos, child.initialYPos, child);
        return;
    }
}

//output functions for RAGE:MP (custom online engine for "Grand Theft Auto V")

function terminateJob() {
    mp.trigger('terminateJob');
}

function finishMiniGame() {
    mp.trigger('startSupplier', packages);
}
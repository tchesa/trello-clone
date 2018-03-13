var draggingCard;
var targetBoard;
var onBoard = false;
var helper;
var helperTrans;
var pos;

function onDragStart (e) {
	// var helper = this.cloneNode(true);
	// document.getElementById("panel-body").appendChild(helper);
	draggingCard = this;
	targetBoard = this.parentElement;
	helper = draggingCard.cloneNode(true);
	draggingCard.className = draggingCard.className + " dragging-card";

	helper.id = "card-helper";
	var boards = document.querySelectorAll('ul.task-list');
	boards[boards.length - 1].appendChild(helper);
	helperTrans = {
		x: e.clientX - draggingCard.getBoundingClientRect().left,
		y: e.clientY - draggingCard.getBoundingClientRect().top
	};
	helper.style.left = (e.clientX - helperTrans.x) + "px";
	helper.style.top = (e.clientY - helperTrans.y) + "px";

	var cards = document.querySelectorAll('ul.task-list li, .list a.add-card-btn');
	[].forEach.call(cards, function(card) {
		if (card != draggingCard)
			card.style.pointerEvents = "none";
	});
	onBoard = true;
}

function onDrag (e) {
	// destroys old placeholder
	var placeholder = document.getElementById("card-placeholder");
	if (placeholder) placeholder.parentNode.removeChild(placeholder);

	// creates new placeholder object
	var placeholder = document.createElement("li");
	placeholder.id = "card-placeholder";
	placeholder.className = "card-ghost";
	placeholder.style.height = draggingCard.getBoundingClientRect().height + "px";

	pos = getBoardPosition(targetBoard, e.clientY);
	
	if (pos < targetBoard.children.length) targetBoard.insertBefore(placeholder, targetBoard.children[pos]);
	else targetBoard.appendChild(placeholder);

	helper.style.left = (e.clientX - helperTrans.x) + "px";
	helper.style.top = (e.clientY - helperTrans.y) + "px";
}

function onDragEnter (e) {
	targetBoard = this.querySelector("ul.task-list");
	onBoard = true;
}

function onDragLeave (e) {
	onBoard = false;
}

function onDragEnd (e) {
	var placeholder = document.getElementById("card-placeholder");
	if (placeholder) placeholder.parentNode.removeChild(placeholder);
	draggingCard.className = draggingCard.className.replace("dragging-card", "").trim();

	var clone = draggingCard.cloneNode(true);
	
	helper.parentElement.removeChild(helper);
	draggingCard.parentElement.removeChild(draggingCard);
	var pos = getBoardPosition(targetBoard, e.clientY);
	if (pos < targetBoard.children.length) targetBoard.insertBefore(clone, targetBoard.children[pos]);
	else targetBoard.appendChild(clone);
	configCardElement(clone);

	var cards = document.querySelectorAll('ul.task-list li, .list a.add-card-btn');
	[].forEach.call(cards, function(card) {
		card.style.pointerEvents = "auto";
	});
}

function getBoardPosition (board, yPosition) {
	var boardCards = board.querySelectorAll('li:not(card-helper)');
	var i = 0;
	[].forEach.call(boardCards, function(card) {
		var rect = card.getBoundingClientRect();
		if (yPosition > rect.top + rect.height) i++;
	});
	return i;
}

var cards = document.querySelectorAll('.task-list li');
[].forEach.call(cards, function(card) {
	configCardElement(card);
});

function configCardElement (card) {
	card.addEventListener('dragstart', onDragStart, false);
	card.addEventListener('drag', onDrag, false);
	card.addEventListener('dragend', onDragEnd, false);
}

var boards = document.querySelectorAll('.list');
[].forEach.call(boards, function(board) {
	board.addEventListener('dragenter', onDragEnter, false);
	board.addEventListener('dragleave', onDragLeave, false);
});
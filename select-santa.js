function randomIntGenerator(limit) {
	return Math.floor(Math.random()*(limit))
}

function pickSanta (child, santasLeft) {
	var len = santasLeft.length
	var chosen_santa = santasLeft[randomIntGenerator(len)]
	while (chosen_santa === child) {

		// if the last person gets themselves, stop the process and catch it later
		if (santasLeft.length === 1) {
			redo = true;
			break;
		}
		else {
			chosen_santa = santasLeft[randomIntGenerator(len)];
		}
	};
	return chosen_santa
};

function draw (children, santasLeft) {
  childToSanta = []
  redo = false
  for (i = 0; i < children.length; i++) {
  	santa = pickSanta(children[i], santasLeft)
  	childToSanta[children[i]] = santa
  	santasLeft.splice(santasLeft.indexOf(santa), 1)
  };
  return childToSanta
};

function validDraw() {

	// any way we can avoid this repetition? 
  var santas = Array("Vicky", "Kim", "Kathryn", "Timmy", "Jacob", "Brian")
  var children = Array("Vicky", "Kim", "Kathryn", "Timmy", "Jacob", "Brian")

  var attemptToDraw = draw(children, santas)
	while (redo === true) validDraw()

	return attemptToDraw
};

console.log(validDraw())

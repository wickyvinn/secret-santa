
var secretSanta = function(people) {
  this.people = people;
  this.redo   = false;
}
 
secretSanta.prototype.randomIntGenerator = function(limit) {
    return Math.floor(Math.random()*(limit))
}

secretSanta.prototype.pickSanta = function(child, santasLeft) {
    var len = santasLeft.length
    var chosen_santa = santasLeft[this.randomIntGenerator(len)]
    while (chosen_santa === child) {

      // if the last person gets themselves, stop the process and catch it later
      if (santasLeft.length === 1) {
        this.redo = true;
        break;
      }
      else {
        chosen_santa = santasLeft[this.randomIntGenerator(len)];
      }
    };
 
   return chosen_santa
}

secretSanta.prototype.draw = function(children, santasLeft) {
  childToSanta = []
  this.redo = false
 
  for (i = 0; i < children.length; i++) {
    santa = this.pickSanta(children[i], santasLeft)     
    childToSanta[children[i]] = santa
    console.log("Children to Santa: ", childToSanta);
    santasLeft.splice(santasLeft.indexOf(santa), 1)
  };

  return childToSanta
}

secretSanta.prototype.validDraw = function () {
    var santas = Array();
    for (p in this.people) santas.push(this.people[p]);
    var children = Array();
    for (p in this.people) children.push(this.people[p]);

    var attemptToDraw = this.draw(children, santas);
    if(this.redo) {
      return this.validDraw();
    }
    return attemptToDraw;
};

module.exports = secretSanta;

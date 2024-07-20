/*
@title: SpriMons
@author: Bartosz Budnik 
@tags: [Arcade, RPG, Training, Turn-Based]
@addedOn: 2024-00-00
*/


// ---------------------------------- Sprites setup ----------------------------------
// Character sprites
const boy = 'b';
const girl = 'g';
const orpheus = 'o';
var player = 'b';
// Boxes
const box = 'd';
const selectionBox = 's'


setLegend(
  [ boy, bitmap`
....00000000....
...0333333330...
..033333333330..
..011333333110..
.0CCC111111CCC0.
.0C2220220222C0.
..022202202220..
...0022992200...
..033000000330..
.02733333333720.
.02273333337220.
..000533335000..
...0575555750...
...0777007770...
...0550..0550...
....00....00....` ],
  [ girl, bitmap`
....00000000....
...0888888880...
..088888888880..
..0HH888888HH0..
.0CCCHHHHHHCCC0.
.0CC22022022CC0.
..0C22022022C0..
..0C02299220C0..
..0CC000000CC0..
.02FC666666CF20.
.022F666666F220.
..000566665000..
...0575555750...
...0777007770...
...0110..0110...
....00....00....`],
  [ orpheus, bitmap`
...000000.......
...0222220......
..00202020......
..022020220.....
..022222220.....
..022222220.....
...00022220.....
.002200002200...
022222222222200.
0220222222022020
.000222222000220
...022222202220.
..022222222020..
..02220022200...
..0220..0220....
...00....00.....`],
  [ box, bitmap`
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111
1111111111111111`],
  [ selectionBox, bitmap`
0000000000000000
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0..............0
0000000000000000`]
)


// ---------------------------------- Helper functions ----------------------------------
// Write the correct dialogue line, depending on the argument
function startDialogue(line, choice, select = 0, chose = false) {
  if (!choice[0]) {
    let text = ""

    // Set the correct text
    switch(line) {
      case 0:
        text = "Welcome to the\nHack Club's\nWorld!";
        break;
      case 1:
        text = "Here we take care \nof SpriMons,\ntrain them\nand battle along\nwith them"
        break;
      case 2:
        text = "Everything was\nfun and all, but\nsomeone fed\nHakkuun some\nsleeping pills!"
        break;
      case 3:
        text = "Arcade cannot\ncontinue without\nher!\nYou must\nsave this event!"
        break;
      case 4:
        text = "You can do this,\nby finding enough\ntickets.\nWe need them to\nwake her up!"
        break;
      case 5:
        text = "When she will\nsmell them, she\nwill wake up\nfor sure!"
        break;
      case 6:
        text = "Go on!\nYou must save us!"
        break;
      case 7:
        text = "Ah, I forgot!\nAre you a boy\nor a girl?"
        choice[0] = true
        break;
    }
    addText(text, {x: 2, y: 9, color: 3})
  }

  // Let player choose the gender
  else {
    // Draw the choices
    addSprite(1, 2, boy)
    addSprite(7, 2, girl)

    // Draw selection box on top of the current gender
    if (select == 0)
      addSprite(1, 2, selectionBox)
    else
      addSprite(7, 2, selectionBox)

    // Handle choosing the gender
    if (chose) {
      if (select == 0)
        player = boy
      else
        player = girl
      choice[0] = false
    }
  }
}


// ---------------------------------- Levels setup ----------------------------------
const levels = {
  "Start": map`
.........
.........
....o....
.........
ddddddddd
ddddddddd
ddddddddd
ddddddddd`
}
let level = "Start"
setMap(levels[level]);


// Current state (There are 5 states of the game: Dialogue, Choice, Overworld, Battle, Menu)
let state = "Dialogue";
// Current dialogue line
let line = 0
// Current choice
let choice = [false]
// Selection index
let select = 0
let chose = false


// ---------------------------------- Input setup ----------------------------------
// Dialogue input
if (state == "Dialogue") {
  onInput("k", () => {
    clearText()
    line += 1
  })

  onInput("l", () => {
    clearText()
    line += 1
  })

  if (choice[0]) {
    onInput("a", () => {
      select -= 1
      if (select < 0) 
        select = 0
    })

    onInput("d", () => {
      select += 1
      if (select > 1) 
        select = 1
    })

    onInput("k", () => {
      chose = true
    })

    onInput("l", () => {
      chose = true
    })
  }
}

if (state == "Overworld") {
  onInput("s", () => {
  getFirst(boy).y += 1
})
}


// ---------------------------------- Input handling ----------------------------------
afterInput(() => {
  if (state == "Dialogue") {
    // Start the beginning dialogue
    if (level == "Start") {
      clearTile(1, 2)
      clearTile(7, 2)
        
      startDialogue(line, choice, select, chose)
    }
  }
})



// ---------------------------------- Start the game ----------------------------------
startDialogue(line, choice)
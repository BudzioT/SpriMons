/*
@title: SpriMons
@author: Bartosz Budnik 
@tags: [Arcade, Hack-Club, RPG, Training, Turn-Based]
@addedOn: 2024-07-20
*/


// ---------------------------------- Sprites setup ----------------------------------
// Character sprites
const boy = 'b';
const girl = 'g';
const orpheus = 'o';
let player = '';
// Boxes
const box = 'd';
const selectionBox = 's'

// Overworld tiles
const grass = 'q'
const crate = 'c'
const earth = 'e'
const tallGrass = 't'

const girlGraphics = bitmap`
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
....00....00....`
const boyGraphics = bitmap`
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
....00....00....`


setLegend(
  // Dialog and general
  [ boy, boyGraphics ],
  [ girl, girlGraphics],
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
0000000000000000`],
  
  // Overworld
  [ grass, bitmap`
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444
4444444444444444` ],
  [ earth, bitmap`
CCCCCCCCCCCCCCCC
CCCCCCCCLLCCCCCC
CCCCCCCCCLCCCLCC
CCLCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCLCCCCCC
CCCCCLLLCCCCLCCC
CCCCCCLCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCLCC
CCCCLCCCLCCCCLCC
CCCCCCCCLCCCLLCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC
CCCCCCCCCCCCCCCC`],
  [ crate, bitmap`
0000000000000000
0CC0CC0CC0CC0CC0
0C999999999999C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C90CC0CC0CC09C0
0C999999999999C0
0CC0CC0CC0CC0CC0
0000000000000000` ],
  [ tallGrass, bitmap`
................
..DD..D.DD......
..D4D.D.D4D.....
..D44D4D44D.....
DDD44D4D44D.....
D4DD4D4D444D.D..
.D4DDD4DD4DDD4D.
.DD4DD44D4444DD.
..D44D44D4444D..
..D444D44444DD..
..D44444444DD...
..D4444444DD....
..D444444DD.....
...DDDDDD.......
....DDD.........
................` ]
)

// ---------------------------------- Helper functions ----------------------------------
// Write the correct dialogue line, depending on the argument
function startDialogue(line, choice, select, chose) {
  let text = ""
  clearTile(1, 2)
  clearTile(7, 2)
  
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
      
      // Draw the choices
      addSprite(1, 2, boy)
      addSprite(7, 2, girl)

      // Draw selection box on top of the current gender, select it
      if (select == 0) {
        addSprite(1, 2, selectionBox)
        player = boy
      }
      else {
        addSprite(7, 2, selectionBox)
        player = girl
      }      
      break;
    case 8: 
      text = "Yes...\nI remember now!\nYou are a "
      if (player == boy)
        text += "boy"
      else
        text += "girl"
      break;
    case 9:
      text = "You are our\nlast hope!\nPlease save us!"
      break;
  }
  
  addText(text, {x: 2, y: 9, color: 3})
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
ddddddddd`,
  "OverworldBoy": map`
qqqqq
qqqqq
qqbqq
qqqqq
qqqqq`,
  "OverworldGirl": map`
qqqqq
qqqqq
qqgqq
qqqqq
qqqqq`
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
onInput("k", () => {
  if (state == "Dialogue") {
    // Accept the choice
    if (choice[0]) {
      chose = true
    }
    // Go to the next line
    clearText()
    line += 1

    if (level == "Start") {
      // Start the overworld map
      if (line >= 8) {
        if (player == boy)
          level = "OverworldBoy"
        
        else
          level = "OverworldGirl"

        state = "Overworld"
        setMap(levels[level])
      }
    }
  }
})


onInput("l", () => {
  if (state == "Dialogue") {
    // Accept the choice
    if (choice[0]) {
      chose = true
    }
    // Go to the next line
    clearText()
    line += 1

    if (level == "Start") {
      // Start the game's overworld if needed
      if (line >= 9) {
        if (player == boy)
          level = "OverworldBoy"
        else
          level = "OverworldGirl"
        
        state = "Overworld"
        setMap(levels[level])
      }
    }
  }
})


onInput("w", () => {
  // Handle movement
  if (state == "Overworld") {
    if (level == "OverworldGirl") {
      getFirst(girl).y -= 1
    }
    else {
      getFirst(boy).y -= 1
    }
  }
})

onInput("s", () => {
  // Handle movement
  if (state == "Overworld") {
    if (level == "OverworldGirl") {
      getFirst(girl).y += 1
    }
    else {
      getFirst(boy).y += 1
    }
  }
})


onInput("a", () => {
  // Handle player choosing
  if (state == "Dialogue") {
    if (level == "Start") {
      select -= 1
      if (select < 0) 
        select = 0
    }
  }

  // Control movement
  if (state == "Overworld") {
    if (level == "OverworldGirl") {
      getFirst(girl).x -= 1
    }
    else {
      getFirst(boy).x -= 1
    }
  }
})

onInput("d", () => {
  // Handle player choosing
  if (state == "Dialogue") {
    if (level == "Start") {
      
      select += 1
      if (select > 1) 
        select = 1
    }
  }

  // Control movement
  if (state == "Overworld") {
    if (level == "OverworldGirl") {
      getFirst(girl).x += 1
    }
    else {
      getFirst(boy).x += 1
    }
  }
})


// ---------------------------------- Input handling ----------------------------------
afterInput(() => {
  if (state == "Dialogue") {
    // Start the beginning dialogue
    if (level == "Start") {
      startDialogue(line, choice, select, chose)
    }
  }
})


// ---------------------------------- Start the game ----------------------------------
startDialogue(line, choice, select, chose)
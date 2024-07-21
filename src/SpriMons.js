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
// Boxes
const box = 'd';
const selectionBox = 's'

// Overworld tiles
const grass = 'q'
const crate = 'c'
const earth = 'e'
const tallGrass = 't'
const ticket = 'v'

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

let player = 'x';
let gender = 'b'


setLegend(
  // Dialog and general
  [ boy, boyGraphics ],
  [ girl, girlGraphics],
  [ player, boyGraphics],
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
4444444444444444
44DD44D4DD444444
44D4D4D4D4D44444
44D44D4D44D44444
DDD44D4D44D44444
D4DD4D4D444D4D44
4D4DDD4DD4DDD4D4
4DD4DD44D4444DD4
44D44D44D4444D44
44D444D44444DD44
44D44444444DD444
44D4444444DD4444
44D444444DD44444
444DDDDDD4444444
4444DDD444444444
4444444444444444` ],
  [ ticket, bitmap`
................
.....88..88.....
....83388338....
....83333338....
....83333338....
....83333338....
....83333338....
....83388338....
....83388338....
....83333338....
....83333338....
....83333338....
....83333338....
....83388338....
.....88..88.....
................`]
)

// Player's position
let playerX = 1
let playerY = 1
let autoMap = []

// ---------------------------------- Helper functions ----------------------------------
// Prepare the map
function createMap() {
  var map = []
  // Get every tile of the current map, save them in the variable
  for (let i = 0; i < height(); i++) {
    map.push([])

    for (let j = 0; j < width(); j++) {
      map[i].push([])

      // Go through each of the sprites that are in this place and insert them
      let sprites = getTile(j, i)
      for (let k = 0; k < sprites.length; k++)
        map[i][j].push(sprites[k].type)
    }
  }

  return map
}

// Set the current map to the given one
function setCurrentMap(map) {
  var tempMap = ""
  // Get structure of the map
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      tempMap += '.'
    }
    tempMap += '\n'
  }

  // Set the map
  setMap(tempMap)

  // Add sprites to it
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      for (let k = 0; k < map[i][j].length; k++) {
        addSprite(j, i, map[i][j][k])
      }
    }
  }
}

// Setup the map, so it sticks to the player
function setupMap(posX, posY, width, height, map) {
  // Get dimensions
  var secondMap = []
  let mapWidth = map[0].length
  let mapHeight = map.length

  posX = Math.max(Math.min(mapWidth - width, posX), 0)
  posY = Math.max(Math.min(mapHeight - height, posY), 0)

  // Build the new map only from the given range
  for (let i = 0; i < height; i++) {
    secondMap.push([])
    for (let j = 0; j < width; j++) {
      secondMap[i].push([])

      for (var k = 0; k < map[i+posY][j+posX].length; k++) {
        secondMap[i][j].push(map[i+posY][j+posX][k])
      }
    }
  }

  return secondMap
}


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
        gender = boy
        player.type = boy
      }
      else {
        addSprite(7, 2, selectionBox)
        player.type = girl
      }      
      break;
    case 8: 
      text = "Yes...\nI remember now!\nYou are a "
      if (gender == boy)
        text += "boy"
      else
        text += "girl"
      break;
    case 9:
      text = "Which SpriMon\nmatches your vibe\n the most?"
      break;
    case 10:
      text = "You are our\nlast hope!\nPlease save us!"
      break;
  }
  
  addText(text, {x: 2, y: 9, color: 3})
}

function createOverworld() {
  setSolids([girl, boy, crate]);
  setPushables({
    [boy]: [crate],
    [girl]: [crate]
  })

  if (gender == "boy")
    player.type == boy
  else
    player.type == girl
  
  level = "Overworld"
  state = "Overworld"
  setMap(levels[level])
  setBackground(earth)

  addSprite(1, 1, player)

  playerX = 1
  playerY = 1

  autoMap = createMap()
  setCurrentMap(autoMap)
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
  "Overworld": map`
c...tttttt..ttttttttttttttttttttv.....
....tttttt..ttttttttttttttttttttt.....
cc..tttttt..tttttttttvttttttttttt.....
....tttttt..ttttttttttttttttttttt.....
....tttttt..ttttttttttttttttttttt.....
tttt.........ccccccccc........c.......
tttt..........................c.......
tttt..................................
tttt..................................
vttt......qqqqqqqqqqqqqqqqqqqqqqq.....
tttt......qqccccccccc.................
tttt......qqqqqqqqqqqqqqqqqqqqqqq.....
tttt......qqttqqqqqqqqqqqqqqqqqqq.....
tttt......qqttqc......................
..........qqttt.ttttttttttttttttt.....
..........qqttt.tttttttqqqqqqqqqq.....
.c.ttttt..qqttt.tt....................
.c.ttttt..qqttt.tt.qqqqqqqqqqqqqq.....
.c.ttvtt..qqtttttt.qqqqttttttttqq.....
.c.ttttt..qqtttttt.qqqqttttttttqq.....
...ttttt..qqtttvtt.qqqqttttttttqq.....
..........qqtttttt.qqqqtttc.tttqq.....
..........qqtttttt.qqqqttt.vtttqq.....
.cc.......qqtttcqq.qqqqttttttttqq.....
cttc......qqtttcqq.qqqqttttttttqq.....
vtt.......qqtttcqq.qqqqttttttttqq.ccc.
ttt.......qqtttcqq.qqqqqqccccccccccccc
........................cttttttttttttt
........................cttttttttttttt
........................cttttttttttvtt
........................cttttttttttttt
........................cttttttttttttt`,
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

// Tickets count
tickets = 0


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
        createOverworld()
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
      if (line >= 8) {
        createOverworld()
      }
    }
  }
})


onInput("w", () => {
  // Handle movement
  if (state == "Overworld") {
    setCurrentMap(autoMap);
    getFirst(player).y -= 1
    playerY = getFirst(player).y;
  }
})

onInput("s", () => {
  // Handle movement
  if (state == "Overworld") {
    setCurrentMap(autoMap);
    getFirst(player).y += 1
    playerY = getFirst(player).y;
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
    setCurrentMap(autoMap);
    getFirst(player).x -= 1
    playerX = getFirst(player).x;
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
    setCurrentMap(autoMap);
    getFirst(player).x += 1
    playerX = getFirst(player).x;
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

  else if (level == "Overworld") {
    clearText()
    text = "Tickets: " + tickets.toString()
    addText(text, {x: 9, y: 0, color: color`2`})
    
    // Make player able to collect tickets
    playerTickets = tilesWith(player, ticket)
    
    if (playerTickets.length > 0) {
      tickets += 1
      tiles = getAll(ticket)
      
      for (let i = 0; i < tiles.length; i++) {
        if (Math.abs(tiles[i].x - playerX) < 5) {
          if (Math.abs(tiles[i].y - playerY) < 5)
            tiles[i].remove()
        }
      }
    }

    // Update the camera position
    autoMap = createMap();
    setCurrentMap(setupMap(playerX - 5, playerY - 4, 10, 8, autoMap))
  }
})


// ---------------------------------- Start the game ----------------------------------
startDialogue(line, choice, select, chose)
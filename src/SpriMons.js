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
const hakkuun = 'h';
const hackMon = 'm';
const sprigus = 'u';
const raspberin = 'r';
const gitbon = 'n';

const spriMonsData = { 
  [orpheus]: { "HP": 10, "SP": 5, "DMG1": 3, "DMG2": 2, "COST1": 2, "COST2": 1,"EXP": 50, 
            "DROP": 35, "NAME1": "Punch", "NAME2": "Scratch", "NICKNAME": "Orpheus"},
  [hakkuun]: { "HP": 8, "SP": 7, "DMG1": 4, "DMG2": 2, "COST1": 3, "COST2": 1, "EXP": 45, 
            "DROP": 40, "NAME1": "Swipe", "NAME2": "Scratch", "NICKNAME": "Hakkuun"},
  [hackMon]: { "HP": 13, "SP": 10, "DMG1": 2, "DMG2": 1, "COST1": 2, "COST2": 1, "EXP": 50, 
            "DROP": 45, "NAME1": "Code", "NAME2": "Break", "NICKNAME": "HackMon"},
  [sprigus]: { "HP": 5, "SP": 7, "DMG1": 5, "DMG2": 3, "COST1": 3, "COST2": 2, "EXP": 30, 
            "DROP": 50, "NAME1": "Push", "NAME2": "Jump", "NICKNAME": "Sprigus"},
  [raspberin]: { "HP": 7, "SP": 8, "DMG1": 4, "DMG2": 2, "COST1": 3, "COST2": 2, "EXP": 40, 
              "DROP": 45, "NAME1": "Beep", "NAME2": "Light", "NICKNAME": "Raspberin"},
  [gitbon]: { "HP": 9, "SP": 7, "DMG1": 3, "DMG2": 2, "COST1": 2, "COST2": 1, "EXP": 45, 
              "DROP": 50, "NAME1": "Push", "NAME2": "Pull", "NICKNAME": "Gitbon"}
};
  
// Boxes
const box = 'd';
const selectionBox = 's';

// Overworld tiles
const grass = 'q';
const crate = 'c';
const earth = 'e';
const tallGrass = 't';
const ticket = 'v';
const yubiKey = 'y';

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
....00....00....`;
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
....00....00....`;

let player = '';
let opponents = [orpheus, hackMon, sprigus, raspberin, gitbon];

// Opponent stats
let opponent = '';
let opponentStats = {};
let opponentLevel = 1;
let opponentHp = 0;
let opponentSp = 0;

// Starter SpriMon stats
let spriMon = '';
let spriMonLevel = 1;
let exp = 0;
let stats = {};
let hp = 0;
let sp = 0;

// Battle flags
let action = false;
let enemyTurn = false;
let attack = 0;
let rest = false;
let enemyRest = false;
let loadBattle = true;
let lastPlayer = false;
let leaveBattle = false;


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
  [ hakkuun, bitmap`
...L.LLLLLL.L...
..L1L111111L1L..
...LL020020LL...
....L020020L....
....L111111L....
.....L1111L.....
......LLLL......
.....L1111L..LLL
....L111111L.L0L
...L1L1111L1L11L
....LL1111LL000L
.....L1111L101L.
.....L1111L101L.
....LL1LL1LLLL..
...L11L..L11L...
....LL....LL....`],
  [ hackMon, bitmap`
.22222222222222.
8888888888888888
8888288888888888
7777277777777777
0000200000000000
0000200000000000
CCCC2C222CCCCCCC
9999229992999999
9999299999299999
6666266666266666
DDDD2DDDDD2DDDDD
DDDD2DDDDD2DDDDD
4444244444244444
5555255555255555
5555555555555555
.HHHHHHHHHHHHHH.`],
  [ sprigus, bitmap`
................
................
........444.....
.......4DD4.....
......44D4......
......2222......
....22000022....
....20000002....
....20200202....
....20200202....
....20000002....
....22000022....
.....222222.....
......2..2......
.....22..22.....
................`],
  [ raspberin, bitmap`
...000....000...
..04440..04440..
..044DD00DD440..
...0000000000...
....03133130....
...0331331330...
..031103301130..
..033301103330..
..013313313310..
..031301103130..
..013330033310..
...0333113330...
....00133100....
......0000......
................
................`],
  [ gitbon, bitmap`
.00000000000000.
0222000000002220
0022222222222200
0002222222222000
0002222222222000
0002222222222000
0002222222222000
0000222222220000
0000022222200000
0000000220000000
0000000222000000
0022002222200000
0002222222200000
0000002222200000
.00000222220000.
..000022222000..` ],
  
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
................`],
  [ yubiKey, bitmap`
................
....0000000.....
....0000000.....
....0066600.....
....0606060.....
....0660660.....
....0660660.....
....0066600.....
....0000000.....
....0000000.....
....0000000.....
....0000000.....
....0000000.....
......111.......
......111.......
................`]
);

// Player's position
let playerX = 1;
let playerY = 1;
let lastPlayerX = playerX;
let lastPlayerY = playerY;
let autoMap = [];

let movement = true;
let hakkuunInteraction = false;

let maxLine = 12;
let maxHakkuunLine = 5;

// ---------------------------------- Helper functions ----------------------------------
// Prepare the map
function createMap() {
  var map = [];
  // Get every tile of the current map, save them in the variable
  for (let i = 0; i < height(); i++) {
    map.push([]);

    for (let j = 0; j < width(); j++) {
      map[i].push([]);

      // Go through each of the sprites that are in this place and insert them
      let sprites = getTile(j, i)
      for (let k = 0; k < sprites.length; k++)
        map[i][j].push(sprites[k].type);
    }
  }

  return map;
}

// Set the current map to the given one
function setCurrentMap(map) {
  var tempMap = "";
  // Get structure of the map
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      tempMap += '.';
    }
    tempMap += '\n';
  }

  // Set the map
  setMap(tempMap);

  // Add sprites to it
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      for (let k = 0; k < map[i][j].length; k++) {
        addSprite(j, i, map[i][j][k]);
      }
    }
  }
}

// Setup the map, so it sticks to the player
function setupMap(posX, posY, width, height, map) {
  // Get dimensions
  var secondMap = [];
  let mapWidth = map[0].length;
  let mapHeight = map.length;

  posX = Math.max(Math.min(mapWidth - width, posX), 0);
  posY = Math.max(Math.min(mapHeight - height, posY), 0);

  // Build the new map only from the given range
  for (let i = 0; i < height; i++) {
    secondMap.push([]);
    for (let j = 0; j < width; j++) {
      secondMap[i].push([]);

      for (var k = 0; k < map[i+posY][j+posX].length; k++) {
        secondMap[i][j].push(map[i+posY][j+posX][k]);
      }
    }
  }

  return secondMap;
}


// Write the correct dialogue line, depending on the argument
function startDialogue(line, choice, select, chose) {
  let text = "";
  clearTile(1, 2);
  clearTile(2, 2);
  clearTile(3, 2);
  clearTile(5, 2);
  clearTile(7, 2);
  
  // Set the correct text
  switch(line) {
    case 0:
      text = "Welcome to the\nHack Club's\nWorld!";
      break;
    case 1:
      text = "Here we take care \nof SpriMons,\ntrain them\nand battle along\nwith them";
      break;
    case 2:
      text = "Everything was\nfun and all, but\nsomeone fed\nHakkuun some\nsleeping pills!";
      break;
    case 3:
      text = "Arcade cannot\ncontinue without\nher!\nYou must\nsave this event!";
      break;
    case 4:
      text = "You can do this,\nby finding enough\ntickets.\nWe need them to\nwake her up!";
      break;
    case 5:
      text = "When she will\nsmell them, she\nwill wake up\nfor sure!";
      break;
    case 6:
      text = "Go on!\nYou must save us!";
      break;
    case 7:
      text = "Ah, I forgot!\nAre you a boy\nor a girl?";
      choice[0] = true;
      choice[1] = false;
      
      // Draw the choices
      addSprite(1, 2, boy);
      addSprite(7, 2, girl);

      // Draw selection box on top of the current gender, select it
      if (select == 0) {
        addSprite(1, 2, selectionBox);
        player = boy;
      }
      else {
        addSprite(7, 2, selectionBox);
        player = girl;
      }      
      break;
    case 8: 
      text = "Yes...\nI remember now!\nYou are a ";
      if (player == boy)
        text += "boy";
      else
        text += "girl";
      break;
    case 9:
      text = "Which SpriMon\nmatches your vibe\nthe most?";
      choice[0] = false
      choice[1] = true;
      
      addSprite(1, 2, hackMon)
      addSprite(2, 2, raspberin)
      addSprite(3, 2, sprigus)
      
      if (select == 0) {
        addSprite(1, 2, selectionBox)
        spriMon = hackMon
      }
      else if (select == 1) {
        addSprite(2, 2, selectionBox)
        spriMon = raspberin
      }
      else {
        addSprite(3, 2, selectionBox)
        spriMon = sprigus
      }
      break;
    case 10:
      text = "You are our\nlast hope!\nPlease save us!";
      break;
    case 11:
      text = "(Not like\nI want YubiKey\nfor that 8 \ntickets)...";
      break;
    case 12:
      text = "Ehem... Go now!";
      break;
  }
  
  addText(text, {x: 2, y: 9, color: 3});
}

// Start the ending dialogue
function EndDialogue(line) {
  let text = "";

  switch (line) {
    case 0:
      text = "Huh...\n I've overslept\n a little..."
      break;
    case 1:
      text = "WHAT? almost \n10000 people\nare taking\n part of\nArcade???"
      break;
    case 2:
      text = "I need to\ngo back to work!\nbut thanks\nfor tickets!"
      break;
    case 3:
      addSprite(6, 2, yubiKey)
      text = "Here's\nyour reward. It's\nthe best one!"
      break;
    case 4:
      text = "Use it well,\nenjoy your stay\n\nat Hack Club!"
      break;
    case 5:
      text = "This community\nwouldn't be the\nsame without\n\nYOU!"
      break;
  }

  addText(text, {x: 2, y: 9, color: 3});
}

// Create the overworld map
function createOverworld() {
  setSolids([girl, boy, crate]);
  setPushables({
    [boy]: [crate],
    [girl]: [crate]
  });
  
  level = "Overworld";
  state = "Overworld";
  setMap(levels[level]);
  setBackground(earth);

  if (player == boy)
    addSprite(1, 1, boy);
  else
    addSprite(1, 1, girl);

  playerX = 1;
  playerY = 1;

  autoMap = createMap();
  setCurrentMap(autoMap);
}

function endScreen() {
  level = "End"
  state = "End"
  setMap(levels[level]);
  setBackground(earth);

  addText("Have fun building!\n\nWE LOVE Hack Club!", {x: 1, y: 8, color: color`2`});
}

// Handle the accept buttons
function handleAccept() {
  if (state == "Dialogue") {
    // Accept the choice
    if (choice[0]) {
      chose = true;
    }

    if (choice[1]) {
      chose = true;
    }
    // Go to the next line
    clearText();
    line += 1;

    if (level == "Start") {
      if (line == 8)
        chose = false;
      
      // Start the overworld map
      if (line > maxLine) {
        createOverworld();
      }
    }

    if (level == "HakkuunConversation") {
      // Move to the end screen
      if (line > maxHakkuunLine) {
        endScreen();
      }
    }
  }

  else if (state == "Overworld") {
    playerHakkuun = tilesWith(player, hakkuun)
    if (playerHakkuun.length > 0)
      hakkuunInteraction = true
  }
}

// Handle battle system
function battle() {
  // Set the scene
  level = "Battle";
  state = "Battle";
  setBackground(box);
  setMap(levels[level]);

  playerX = 1;
  playerY = 1;

  // Add sprites
  addSprite(6, 3, opponent);
  addSprite(6, 6, spriMon);
  // Set the map
  autoMap = createMap();
  setCurrentMap(autoMap);

  // Give proper statistics
  opponentStats = { ...spriMonsData[opponent] };
  stats = { ...spriMonsData[spriMon] };

  for (let stat in opponentStats) {
    if (typeof opponentStats[stat] == 'number') {
      if (stat != "COST1" && stat != "COST2")
        opponentStats[stat] *= (opponentLevel * 1.3);
    }
  }

  for (let stat in stats) {
    if (typeof stats[stat] === 'number') {
      if (stat != "COST1" && stat != "COST2")
        stats[stat] *= (spriMonLevel * 1.3);
    }
  }

  // Set correct stats
  hp = Math.round(spriMonsData[spriMon]["HP"]);
  sp = Math.round(spriMonsData[spriMon]["SP"]);
  opponentHp = Math.round(opponentStats["HP"]);
  opponentSp = Math.round(opponentStats["SP"]);

  loadBattle = false;

  battleText();
  movesText();
}

// Write the basic battle info
function battleText() {
  addText(opponentStats["NICKNAME"], {x: 8, y: 2, color: color`2`});
  addText("HP: " + opponentHp, {x: 0, y: 2, color: color`3`});
  addText("SP: " + opponentSp, {x: 0, y: 4, color: color`7`});
  addText(opponentLevel + '', {x: 18, y: 2, color: color`2`});
  
  addText(stats["NICKNAME"], {x: 8, y: 7, color: color`2`});
  addText("HP: " + hp, {x: 0, y: 7, color: color`3`});
  addText("SP: " + sp, {x: 0, y: 9, color: color`7`});
  addText(spriMonLevel + '', {x: 18, y: 7, color: color`2`});
}

// Write names of the player's spriMon moves
function movesText() {
  addText(stats["NAME1"] + '', {x: 1, y: 12, color: color`4`});
  addText(stats["NAME2"] + '', {x: 10, y: 12, color: color`4`});
}

// Handle the battle's process
function battleOnGoing() {
  // If there was an attempt to make a attack
  if (attack && !action) {
    action = true;
    lastPlayer = true;
    
    text = '';
    // Rest if there isn't any stamina
    if (Math.floor(sp) <= 0) {
      rest = true;
      let regainedSp = Math.floor(Math.random() * stats["SP"] / 10 + 1);
      sp += regainedSp;
      text = "Your " + stats["NICKNAME"] + "\nrests and regains\n" + regainedSp
        + " SP";
    }
    // Make the first attack
    else if (attack == 1 && sp > stats["COST1"]) {
      opponentHp -= Math.floor(stats["DMG1"]);
      sp -= Math.floor(stats["COST1"]);
      text = "Your " + stats["NICKNAME"] + "\nused " + stats["NAME1"] + "\ndealing " 
        + Math.floor(stats["DMG1"]) + " dmg!";
    }
    // Use the second attack
    else if (attack == 2 && sp > stats["COST2"]) {
        opponentHp -= Math.floor(stats["DMG2"]);
        sp -= Math.floor(stats["COST2"]);
        text = "Your " + stats["NICKNAME"] + "\nused " + stats["NAME2"] + "\ndealing " 
          + Math.floor(stats["DMG2"]) + " dmg!";
    }

    else {
      rest = true;
      let regainedSp = Math.floor(Math.random() * stats["SP"] / 10 + 1);
      sp += regainedSp;
      text = "Your " + stats["NICKNAME"] + "\nrests and regains\n" + regainedSp
        + " SP";
    }

    clearText();
    addText(text, {x: 1, y: 12, color: color`6`})

    // Turn the flags
    attack = 0;
  }

  // Handle enemy's actions
  else if (enemyTurn) {
    action = true;

    text = '';
    
    enemyTurn = Math.floor(Math.random() * 2) + 1;
    
    if (Math.floor(opponentSp) <= 0) {
      opponentRest = true;
      let regainedSp = Math.floor(Math.random() * opponentStats["SP"] / 10 + 2);
      opponentSp += regainedSp;
      text = "Wild " + opponentStats["NICKNAME"] + 
        "\nrests and regains\n" + regainedSp + " SP";
    }

    else if (enemyTurn == 1 && opponentSp > opponentStats["COST1"]) {
      hp -= Math.floor(opponentStats["DMG1"]);
      opponentSp -= Math.floor(opponentStats["COST1"]);
      text = "Wild " + opponentStats["NICKNAME"] + "\nused " 
        + opponentStats["NAME1"] + "\ndealing " + Math.floor(opponentStats["DMG1"]) 
        + " dmg!";
    }

    // Use the second attack
    else if (enemyTurn == 2 && opponentSp > opponentStats["COST2"]) {
      hp -= Math.floor(opponentStats["DMG2"]);
      opponentSp -= Math.floor(opponentStats["COST2"]);
      text = "Wild " + opponentStats["NICKNAME"] + "\nused " 
        + opponentStats["NAME2"] + "\ndealing " + Math.floor(opponentStats["DMG2"]) 
        + " dmg!";
    }

    else {
      opponentRest = true;
      let regainedSp = Math.floor(Math.random() * opponentStats["SP"] / 10 + 2);
      opponentSp += regainedSp;
      text = "Wild " + opponentStats["NICKNAME"] + 
        "\nrests and regains\n" + regainedSp + " SP";
    }

    clearText();
    addText(text, {x: 1, y: 12, color: color`6`})

    enemyTurn = 0;
  }

  else if (action) {
    if (lastPlayer) {
      clearText();
      battleText();
      enemyTurn = true;
      lastPlayer = false;
    }
    else {
      clearText();
      battleText();
      movesText();
    }
    action = false;
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
ddddddddd`,
  "Overworld": map`
c...tttttt..ttttttttttttttttttttv.....
....tttttt..ttttttttttttttttttttt.....
cc..tttttt..tttttttttvttttttttttt.....
.h..tttttt..ttttttttttttttttttttt.....
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
  "HakkuunConversation": map`
.........
.........
....h....
.........
ddddddddd
ddddddddd
ddddddddd
ddddddddd`,
  "HakkuunBattle": map``,
  "Battle": map`
dddd.....dddd
....dd.dd....
ddddddddddddd
dddd.....dddd
....dd.dd....
ddddddddddddd
.............
ddddddddddddd
.............
.............`,
  "End": map`
yyyyyy
yhobgy
......
......
yyyyyy`
};

let level = "Start";
setMap(levels[level]);


// Current state (There are 5 states of the game: Dialogue, Menu, Overworld, Battle, End)
let state = "Dialogue";
// Current dialogue line
let line = 0;
// Current choice
let choice = [false, false];
// Selection index
let select = 0;
let chose = false;

// Tickets count
let tickets = 0;


// ---------------------------------- Input setup ----------------------------------
// Dialogue input
onInput("k", () => {
  handleAccept();
});


onInput("l", () => {
  handleAccept();
});


onInput("w", () => {
  // Handle movement
  if (state == "Overworld") {
    setCurrentMap(autoMap);
    if (player == girl) {
      getFirst(girl).y -= 1;
      playerY = getFirst(girl).y;
    }
    else {
      getFirst(boy).y -= 1;
      playerY = getFirst(boy).y;
    }
    lastPlayerY = playerY;

    movement = true;
  }
})

onInput("s", () => {
  // Handle movement
  if (state == "Overworld") {
    setCurrentMap(autoMap);
    if (player == girl) {
      getFirst(girl).y += 1;
      playerY = getFirst(girl).y;
    }
    else {
      getFirst(boy).y += 1;
      playerY = getFirst(boy).y;
    }
    lastPlayerY = playerY;

    movement = true;
  }
})


onInput("a", () => {
  // Handle player choosing
  if (state == "Dialogue") {
    if (level == "Start") {
      select -= 1;
      if (select < 0) 
        select = 0;
    }
  }

  // Control movement
  if (state == "Overworld") {
    setCurrentMap(autoMap);
    if (player == girl) {
      getFirst(girl).x -= 1;
      playerX = getFirst(girl).x;
    }
    else {
      getFirst(boy).x -= 1;
      playerX = getFirst(boy).x;
    }
    lastPlayerX = playerX;

    movement = true;
  }

  // Handle choosing attack in battle
  if (state == "Battle") {
    if (!action)
      attack = 1;
  }
})

onInput("d", () => {
  // Handle player choosing
  if (state == "Dialogue") {
    if (level == "Start") {
      select += 1;
      if (choice[0]) {
      if (select > 1) 
        select = 1;
      }

      else if (choice[1]) {
        if (select > 2)
          select = 2;
      }
    }
  }

  // Control movement
  else if (state == "Overworld") {
    setCurrentMap(autoMap);
    if (player == girl) {
      getFirst(girl).x += 1;
      playerX = getFirst(girl).x;
    }
    else {
      getFirst(boy).x += 1;
      playerX = getFirst(boy).x;
    }
    lastPlayerX = playerX;

    movement = true;
  }

  // Choose an attack
  else if (state == "Battle") {
    if (!action) {
      attack = 2;
    }
  }
})


// ---------------------------------- Input handling ----------------------------------
afterInput(() => {
  if (state == "Dialogue") {
    // Start the beginning dialogue
    if (level == "Start") {
      startDialogue(line, choice, select, chose);
    }

    // Go on with the Hakkuun conversation
    if (level == "HakkuunConversation")
      EndDialogue(line);
  }

  // Handle battle system
  else if (state == "Battle") {
    // Load the battle for the first time
    if (loadBattle) {
      battle();
    }

    battleOnGoing();
    if (!lastPlayer) {
      movesText();
    }

    // Handle losing or winning
    if (opponentHp <= 0) {
      exp += opponentStats["DROP"];
      if (exp >= stats["EXP"]) {
        spriMonLevel += 1;
        exp = 0;
      }

      addText("You earned " + Math.floor(opponentStats["DROP"]) + " exp!", { x: 1, y: 12, 
                                                                color: color`9`});

      leaveBattle = true;
    }
    else if (hp <= 0) {
      leaveBattle = true;
    }

    if (leaveBattle) {
      clearText();
      level = "Overworld";
      state = "Overworld";
      
      setMap(levels[level]);
      setBackground(earth);

      if (player == boy)
        addSprite(lastPlayerX, lastPlayerY, boy);
      else
        addSprite(lastPlayerX, lastPlayerY, girl);
      
      playerX = lastPlayerX;
      playerY = lastPlayerY;

      autoMap = createMap();
      setCurrentMap(autoMap);

      loadBattle = true;

      // Set correct stats
      hp = Math.round(spriMonsData[spriMon]["HP"]);
      sp = Math.round(spriMonsData[spriMon]["SP"]);
      opponentHp = Math.round(opponentStats["HP"]);
      opponentSp = Math.round(opponentStats["SP"]);
      
      leaveBattle = false;
    }
  }

  else if (level == "Overworld") {
    // Write tickets count
    clearText();
    text = "Tickets: " + tickets.toString();
    addText(text, {x: 9, y: 0, color: color`2`});
    
    // Make player able to collect tickets
    playerTickets = tilesWith(player, ticket);
    
    if (playerTickets.length > 0) {
      tickets += 1;
      tiles = getAll(ticket);
      
      for (let i = 0; i < tiles.length; i++) {
        if (Math.abs(tiles[i].x - playerX) < 5) {
          if (Math.abs(tiles[i].y - playerY) < 5)
            tiles[i].remove();
        }
      }
    }

    // Check if a battle should occur
    playerGrass = tilesWith(player, tallGrass)
    if (playerGrass.length > 0) {
      let chance = Math.random()
      if (chance < 0.1) {
        opponent = opponents[Math.floor(Math.random() * opponents.length)]
        opponentLevel = Math.floor(Math.random() * spriMonLevel + 1)
        
        clearText()
        battle()
        movement = false;
        return;
      }
    } 

    // Update the camera position
    if (movement && state != "Battle") {
      autoMap = createMap();
      setCurrentMap(setupMap(playerX - 5, playerY - 4, 10, 8, autoMap));
    }

    // Interact with hakkuun
    if (hakkuunInteraction) {
      // Hakkuun is asleep when player doesn't have enough tickets
      if (tickets < 1)
        addText("zzzzzz...", {x: 1, y: 9, color: color`2`});
      // Prepare the hakkuun conversation
      else {
        state = "Dialogue";
        level = "HakkuunConversation";
        setMap(levels[level]);
        line = 0;
        select = 0;
      }
      hakkuunInteraction = false;
    }

    movement = false;
  }
})


// ---------------------------------- Start the game ----------------------------------
startDialogue(line, choice, select, chose);
function CanIDie(playerState, enemiesStates) {
  var fromWhere = [];
  const playerState_X = playerState.position[1]; 
  const playerState_Y = playerState.position[0]; 

  for (let i = 0; i < enemiesStates.length; i++) {
    let vivo = enemiesStates[i].isAlive;
    if (playerState_X === enemiesStates[i].position[1]) {
      if (enemiesStates[i].position[0] > playerState_Y && enemiesStates[i].direction === 'north' && enemiesStates[i].ammo > 0 && vivo) {
        if (fromWhere.includes(3) === false) {
          fromWhere.push(3)
        }
      }
      if (enemiesStates[i].position[0] < playerState_Y && enemiesStates[i].direction === 'south' && enemiesStates[i].ammo > 0 && vivo) {
        if (fromWhere.includes(1) === false) {
          fromWhere.push(1)
        }
      }
    }
    if (playerState_Y === enemiesStates[i].position[0]) {
      if (enemiesStates[i].position[1] > playerState_X && enemiesStates[i].direction === 'west' && enemiesStates[i].ammo > 0 && vivo) {
        if (fromWhere.includes(2) === false) {
          fromWhere.push(2)
        }
      }

      if (enemiesStates[i].position[1] < playerState_X && enemiesStates[i].direction === 'east' && enemiesStates[i].ammo > 0 && vivo) {
        if (fromWhere.includes(4) === false) {
          fromWhere.push(4)
        }
      }
    }
  }
  //console.log(fromWhere + ' fromWhere')
  return fromWhere;
}

function willIDie(playerState, enemiesStates) {
  let fakePlayerState = playerState;
  if (playerState.direction === 'north') {
    fakePlayerState.position[1]--;
  } else if (playerState.direction === 'east') {
    fakePlayerState.position[0]++;
  } else if (playerState.direction === 'south') {
    fakePlayerState.position[1]++;
  } else if (playerState.direction === 'west') {
    fakePlayerState.position[0]--;
  }
  let canIDie = CanIDie(fakePlayerState, enemiesStates);
  if (canIDie.length === 0) {
    return false;
  }
  return true;
}

function CanIRun(fromWhere, playerState) {
  if ((fromWhere.includes(1) || fromWhere.includes(3)) && (playerState.direction === 'west' || playerState.direction === 'east')) {
    //return console.log('run 1');
    return true;
  } else if ((fromWhere.includes(2) || fromWhere.includes(4)) && (playerState.direction === 'south' || playerState.direction === 'north')) {
    //return console.log('run 2');
    return true;
  } 
  //return console.log('not run'); 
  return false;
}

function nearestAmmo(playerState, gameEnvironment) {
  let ammoPositions = gameEnvironment.ammoPosition;
  if (ammoPositions.length > 0) {
    let smallerDistance = 46;
    let pS = playerState;
    let coordenadas = gameEnvironment.ammoPosition[0];
    for (let i = 0; i < ammoPositions.length; i++) {
      const x = ammoPositions[i][1];
      const y = ammoPositions[i][0];

      const x_distance = pS.position[1] - x; 
      const y_distance = pS.position[0] - y;
      const distance = Math.sqrt((Math.pow(x_distance, 2) + Math.pow(y_distance, 2)));
      if (distance < smallerDistance) {
        smallerDistance = distance;
        coordenadas = ammoPositions[i];
      }
    }
    //console.log(coordenadas + ' coord')
    return coordenadas;
  }
}

function CanIKillIt(playerState, fromWhere) {
  let enemyPosition = fromWhere[0];
  if (enemyPosition === 1 && playerState.direction === 'north') {
    //return console.log('CanIKillIt - north');
    return true;
  } else if (enemyPosition === 2 && playerState.direction === 'east') {
    //return console.log('CanIKillIt east');
    return true;
  } else if (enemyPosition === 3 && playerState.direction === 'south') {
   // return console.log('CanIKillIt - south');
    return true;
  } else if (enemyPosition === 4 && playerState.direction === 'west') {
    //return console.log('CanIKillIt - west');
    return true;
  } else {
    //return console.log('!CanIKillIt');
    return false;
  }
}

function CanIKill(playerState, enemiesStates) {
  const playerState_X = playerState.position[1];
  const playerState_Y = playerState.position[0];
  for (let i = 0; i < enemiesStates.length; i++) {
    let vivo = enemiesStates[i].isAlive;
    if (playerState_X === enemiesStates[i].position[1]) {
      if (enemiesStates[i].position[0] > playerState_Y && (playerState.direction === 'south') && (playerState.ammo > 0) && vivo) {
        //return console.log('CanIKill - south');
        return true;
      }
      if (enemiesStates[i].position[0] < playerState_Y && (playerState.direction === 'north') && (playerState.ammo > 0) && vivo) {
        //return console.log('CanIKill - north');
        return true;
      }
    }
    if (playerState_Y === enemiesStates[i].position[0]) {
      if (enemiesStates[i].position[1] > playerState_X && (playerState.direction === 'east') && (playerState.ammo > 0) && vivo) {
        //return console.log('CanIKill - east');
        return true;
      }
      if (enemiesStates[i].position[1] < playerState_X && (playerState.direction === 'west') && (playerState.ammo > 0) && vivo) {
        //return console.log('CanIKill - west');
        return true;
      }
    }
  }
  //return console.log('!CanIKill');
  return false;
}

function whatToDo(pS, eS, gE) {
  const ammo_position = nearestAmmo(pS, gE);
  const playerState_X = pS.position[1];
  const playerState_Y = pS.position[0];
  let canIDie = CanIDie(pS, eS);
  console.log(canIDie)
  if (canIDie.length > 0) {
    if (canIDie.length === 1) {
      if (CanIKillIt(pS, canIDie)) {
        return 'shoot';
      } else if (CanIRun(canIDie, pS)) {
        return 'move';
      } else {
        return 'shoot'; 
      }
    } else if (canIDie.length === 2 && ((canIDie.includes(1) && canIDie.includes(3)) || (canIDie.includes(4) && canIDie.includes(2)))) {
      if (CanIRun(canIDie, pS)) {
        return 'move';
      } else {
        return 'shoot';
      }
    } else if (canIDie.length === 2) {
      return 'shoot';
    }
  } else if (CanIKill(pS, eS)) {
    return 'shoot';
  } else {
    if (pS.ammo < 3) {
      if (playerState_X !== ammo_position[1]) {
        if (ammo_position[1] > playerState_X) {
          if (pS.direction !== 'east') {
            return 'east';
          } else if (!willIDie(pS, eS)) {
            return 'move';
          } else {
            return 'Will die X >';
          }
        }
        else if (ammo_position[1] < playerState_X) {
          if (pS.direction !== 'west') {
            return 'west';
          } else if (!willIDie(pS, eS)) {
            return 'move';
          } else {
            return 'Will die X <';
          }
        }
      }
      if (playerState_Y !== ammo_position[0]) {
        if (ammo_position[0] > playerState_Y) {
          if (pS.direction !== 'south') {
            return 'south';
          } else if (!willIDie(pS, eS)) {
            return 'move';
          } else {
            return 'Will die Y >';
          }
        } 
        else if (ammo_position[0] < playerState_Y) {
          if (pS.direction !== 'north') {
            return 'north';
          } else if (!willIDie(pS, eS)) {
            return 'move';
          } else {
            return 'Will die Y <';
          }
        } 
      }
    } else {
      return 'Ammo is full, nothing to do';
    }
  }
}

  const player = {
    info: {
      name: "Titan",
      style: 1,
    },
    ai: (playerState, enemiesState, gameEnvironment) => {
      return whatToDo(playerState, enemiesState, gameEnvironment)
    }
  };

module.exports = player;
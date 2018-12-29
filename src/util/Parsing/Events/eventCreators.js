import { findPlayerId } from '@/util/dataParsing';

//////////////////////////////
// EVENT CREATORS
/////////////////////////////

// Shot
export const createShotEvent = description => {

    let playerName;
    let event;

    // Penalty Shot
    if(description.includes('Penalty Shot by ')){
        playerName = description.replace("Penalty Shot by ", "").split(" for ")[0];
        event = 'penaltyShot';
    } else{
        playerName = description.replace("Shot by ", "").replace(".", "");
        event = 'shot';
    }

    const player = findPlayerId(playerName);

    return {
        event,
        player
    }
}

// Goal
export const createGoalEvent = description => {

    const playerName = description.replace("Goal by ", "").replace(".", "");
    const player = findPlayerId(playerName);

    return {
        event: 'goal',
        player
    }
}

// Save
export const createSaveEvent = description => {
    const isRebound = description.includes(' with a ');
    
    const playerName = description.replace("Stopped by ", "").split("with")[0].trim();
    const player = findPlayerId(playerName);

    return {
        event: 'shotSaved',
        player,
        isRebound
    }


}

// Deflect
export const createDeflectEvent = description => {

    const playerName = description.replace("Deflect By ", "").replace(".", "");
    const player = findPlayerId(playerName);

    return {
        event: 'shotDeflect',
        player
    }
}

// Shot Missed
export const createMissedShotEvent = () => ({
    event: 'shotMissed'
});

export const createShotHitPostEvent = () => ({
    event: 'shotHitPost'
});

// Shot Blocked
export const createShotBlockedEvent = description => {
    const playerName = description.replace("Shot Blocked by ", "").replace(".", "");
    const player = findPlayerId(playerName);
    
    return {
        event: 'shotBlocked',
        player
    }
}

// Faceoff
export const createFaceoffEvent = description => {
    
    let [winnerName, loserAndLocation] = description.split(" wins face-off versus ");
    let [loserName, location] = loserAndLocation.split(" in ");

    const winner = findPlayerId(winnerName);
    const loser = findPlayerId(loserName);

    // TODO - grab player from player object.. link ID
    return {
        event: 'faceoff',
        winner,
        loser,
        location,
        description
    }
}

// Hit
export const createHitEvent = description => {
    
    let [loserName, winnerAndTurnover] = description.split(" is hit by ");
    let winnerName,
        turnover = false;
    
    // If 'and loses puck' is in the description, then it was a turnover
    if(winnerAndTurnover.includes('and loses puck')){
        winnerName = winnerAndTurnover.replace(' and loses puck.', '')
        turnover = true;
    } else {
        winnerName = winnerAndTurnover.replace('.', '');
    }

    const winner = findPlayerId(winnerName);
    const loser = findPlayerId(loserName);

    // TODO - grab player from player object.. link ID
    return {
        event: 'hit',
        winner,
        loser,
        turnover,
        description
    }
}

// Minor Penalty
// Could be "Penalty to Brandon Carlo for instigated a fight."
export const createPenaltyEvent = description => {
    
    let [type, playerAndInfraction ] = description.split(" to ");
    let [playerName, penalty] = playerAndInfraction.split(" for ");

    if(description.includes('instigated')){
        type = 'Minor';
    } else{
        type = type.split(' ')[0];
    }
    
    const player = findPlayerId(playerName);

    // TODO - grab player from player object.. link ID
    return {
        event: 'penalty',
        type,
        player,
        penalty: penalty.replace('.', ''),
        description
    }
}

// Fight ... TODO
// "Luke Glendening and Brayden Schenn fight to a draw."
// "Scottie Upshall beats up Brandon Carlo."
export const createFightingEvent = description => {
    let fighterOneName, fighterTwoName, isDraw = false; 

    if(description.includes(' beats up ')){
        [ fighterOneName, fighterTwoName ] = description.split(' beats up ');
    } else{
        [ fighterOneName, fighterTwoName ] = description.split(' and ');
        fighterTwoName = fighterTwoName.replace(" fight to a draw.", '');
        isDraw = true;
    }

    const fighterOne = findPlayerId(fighterOneName);
    const fighterTwo = findPlayerId(fighterTwoName.replace('.', ''));

    return {
        event: 'fight',
        fighterOne,
        fighterTwo,
        isDraw,
        description
    }
}

// "Penalty to Scottie Upshall for Fighting."
export const createFightingPenaltyEvent = description => {

    // If this is an instigator penalty
    if(description.includes('instigated')){
        return createPenaltyEvent(description);
    }

    
    let playerName = description.replace('Penalty to ', '').replace(' for Fighting.', '');
    const player = findPlayerId(playerName);

    return {
        event: 'penalty',
        type: 'Major',
        penalty: 'Fighting',
        player,
        description
    }
}

export const createMisconductPenaltyEvent = description => {
    const text = description.replace('Major / Game Misconduct Penalty to ', '');
    const [playerName, penalty] = text.split(' for ');
    const player = findPlayerId(playerName);
    
    return {
        event: 'misconduct',
        type: 'Misconduct',
        penalty: penalty.replace('.', ''),
        player,
        description
    }
}

export const createEjectedEvent = description => {
    
    let playerName = description.replace(' is ejected from game.', '');
    const player = findPlayerId(playerName);
    
    return {
        event: 'ejected',
        player,
        description
    }
}


// Injury (Anze Kopitar from Sabres is injured at 19:24 of 1st period (Lacerated Right Calf).)
export const createInjuryEvent = description => {

    let [ playerAndTeam, timeAndInjury ] = description.split(" is injured at ");
    let playerName = playerAndTeam.split(" from ")[0];
    let injury = paranthesisRegex.exec(timeAndInjury)[1];

    
    const player = findPlayerId(playerName);
    

    return {
        event: 'injury',
        player,
        injury,
        description
    }
}

// Offside
export const createOffsideEvent = description => {
    
    return {
        event: 'offside',
        description
    }
}

// Icing
export const createIcingEvent = description => {

    let playerName = description.replace("Icing by ", '');
    const player = findPlayerId(playerName);

    
    return {
        event: 'icing',
        player,
        description
    }
}

// Goalie Pulled
export const createGoaliePulledEvent = description => {

    description = description.replace(" is pulled from the net.", '');
    
    let playerName = description.split(", ")[1];
    const player = findPlayerId(playerName);

    return {
        event: 'goaliePulled',
        player,
        description
    }
}

// Goalie Returned
export const createGoalieReturnedEvent = description => {

    description = description.replace(" was sent back in the game.", '');
    let playerName = description.split(" from ")[0];

    const player = findPlayerId(playerName);

    return {
        event: 'goalieReturned',
        player,
        description
    }
}

// Goalie Replaced
export const createGoalieReplacedEvent = description => {

    const playerName = description.replace(" enters game", '');
    const player = findPlayerId(playerName);

    return {
        event: 'goalieReplaced',
        player,
        description
    }
}

export const createGoalReviewedEvent = () => ({
    event: 'goalReviewed'
});

export const createGoalReviewNoGoodEvent = () => ({
    event: 'goalReviewNoGood'
});

export const createGoalReviewGoodEvent = () => ({
    event: 'goalReviewGood'
});

// Util
const paranthesisRegex = /\(([^)]+)\)/;


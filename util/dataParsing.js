import { getPlayers } from './Parsing/Players/index';
import { includePlayerStats } from './Parsing/Stats/index';
import { getGameEvents } from './Parsing/Event/index';
import { mapScoringPlays } from './Parsing/Event/Goals';

let players = {};
let events = {}

export const mapData = data => {
    
    // Get Players
    players = getPlayers(data);

    // Get Player Stats.. will mutate player object
    includePlayerStats(data, players);

    // Get events
    const events = getGameEvents(data, players);

    // TODO.. get scoring plays.. maybe add them to the goal events?
    mapScoringPlays(data, events);

    debugger;

    // TODO.. get refs

    // TODO.. get attendance 
}




// Helpers
export const addPlayer = ({ name, properties }) => {
    let formattedKey = toCamelCase(name);

    if(!players[formattedKey]){
        players[formattedKey] = { ...properties };
    }

    return players[formattedKey];
}

export const findPlayer = player => {
    let formattedKey = toCamelCase(player);
    return players[formattedKey];
}


export const findPlayerId = player => {
    let formattedKey = toCamelCase(player);
    return players[formattedKey].id;
}

// Utils
const phraseToUpper = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
export const toCamelCase = str => phraseToUpper(str.replace(/[^\w\s]/gi, "")).replace(/\s+/g, '');
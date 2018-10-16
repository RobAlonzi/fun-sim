import { getGameInfo } from './Parsing/Game';
import { getPlayers } from './Parsing/Players';
import { includePlayerStats } from './Parsing/Stats';
import { getGameEvents } from './Parsing/Events';
import { mapScoringPlays } from './Parsing/Goals';

let players = {};

export const mapData = data => {
    
    // Get Players
    players = getPlayers(data);

    // Get Player Stats.. will mutate player object
    includePlayerStats(data, players);

    // Get Game Stats
    const { teams, game } = getGameInfo(data, players);

    // Get events
    const events = getGameEvents(data, players);

    // Add scoring details to the goal events.. will mutate events object
    mapScoringPlays(data, events, teams);

    return {
        game,
        teams,
        players,
        events
    }
}




// Helpers
export const addPlayer = ({ name, properties }) => {
    let formattedKey = toCamelCase(name);

    if(!players[formattedKey]){
        players[formattedKey] = { id: formattedKey, name, ...properties };
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
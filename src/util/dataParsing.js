import cloneDeep from 'lodash.clonedeep';

import { getGameInfo } from './Parsing/Game';
import { getPlayers } from './Parsing/Players';
import { includePlayerStats } from './Parsing/Stats';
import { getGameEvents } from './Parsing/Events';
import { mapScoringPlays } from './Parsing/Goals';

let players = {};
const GAME_SETTINGS = {};

export const mapData = (data, isPlayoffs) => {

    // TODO .. clean up
    // Set Game Settings
    GAME_SETTINGS.GAME_TYPE = isPlayoffs ? 'Playoff' : 'Regular Season';
    
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


    // TODO: Clean this up in the functions above!
    const liveStats = { players: {} };
    const finalStats = { players: {} };
    Object.values(players).forEach(player => {
        const {stats, ...otherStats} = player;
        liveStats.players[otherStats.id] = {
            ...otherStats,
            stats: stats.live,
        }

        finalStats.players[otherStats.id] = {
            ...otherStats,
            stats: stats.final,
        }
    });


    liveStats.teams = cloneDeep(teams);
    finalStats.teams = cloneDeep(teams);

    // Live
    liveStats.teams[liveStats.teams.home].stats = cloneDeep(liveStats.teams[liveStats.teams.home].stats.live);
    liveStats.teams[liveStats.teams.visitor].stats = cloneDeep(liveStats.teams[liveStats.teams.visitor].stats.live);

    // Final
    finalStats.teams[finalStats.teams.home].stats = cloneDeep(finalStats.teams[finalStats.teams.home].stats.final);
    finalStats.teams[finalStats.teams.visitor].stats = cloneDeep(finalStats.teams[finalStats.teams.visitor].stats.final);


    // Map how many periods there are
    // TODO: Get this from the parsing?
    const periods = {};
    Object.values(events).forEach((item, index) => {
        const periodNumber = index + 1;

        // If REG season, OT is 5 mins
        const totalTime = getGameType() === 'Playoff' || periodNumber <= 3 ? 1200 : 300;

        // Item[1] is for 1 Second on the clock.. all periods should have this
        periods[item[1].time.key] = {
            key: item[1].time.key,
            name: item[1].time.period,
            number: periodNumber,
            isExtraTime: periodNumber > 3,
            totalTime,
        };
    });
    
    return {
        game,
        teams: liveStats.teams,
        players: liveStats.players,
        periods,
        final: { ...finalStats, events }
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

export const getGameType = () => GAME_SETTINGS.GAME_TYPE;
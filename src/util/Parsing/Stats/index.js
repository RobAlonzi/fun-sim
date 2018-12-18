import $ from 'jquery';

import { fullNameToAbbr } from '@/util/Teams';
import { findPlayer, addPlayer } from '@/util/dataParsing';

//Player Name              G  A  P  +/- PIM S  H  SB GA TA FO     MP     PP MP  PK MP
const statLine = {
    goals: 0,
    assists: 0,
    points: 0,
    plusMinus: 0,
    pims: 0,
    shots: 0,
    hits: 0,
    shotsBlocked: 0,
    giveaways: 0,
    takeaways: 0,
    faceoffsWon: 0,
    faceoffsTaken: 0,
    minutesPlayed: 0,
    ppMinutesPlayed: 0,
    pkMinutesPlayed: 0
};

const goalieStatLine = {
    saves: 0,
    shots: 0,
    toi: 0,
    descision: '-', 
    wins: 0, 
    loss: 0, 
    otl: 0, 
}

// This will add stats and finalStats properties to the player objects
export const includePlayerStats = data => {
    parsePlayerTables(data);
    parseGoalieHTML(data);
}

const parsePlayerTables = (data) => {
    $(data).filter(".STHSGame_PlayerStatTable").each((index, el) => {

        let team = fullNameToAbbr($(el).prev()[0].innerText.split(' for ')[1]);

        // Get text inside stats table pre
        let statsTable = $(el).children().first()[0].childNodes[0].data;
        let arr = statsTable.split(' ');

        // Take away the header (should always be the first 46 indexes)
        arr.splice(0, 46);

        // Then Take away the big spacer for the first index, it also has the first player's first name (weirdness)
        // Also take away the tabs
        arr[0] = arr[0].replace(/-/g, "");
        arr.forEach((item, i) => arr[i] = item.replace(/\n/ig, ''));

        // loop through.. if two consectutive items with only text in them appear.. must be a name
        for(let i = 1; i < arr.length; i++){
            let prevItem = arr[i - 1];
            let item = arr[i];
            let nextItem = arr[i + 1];

            // Combine them if this it's a player name [includes letters, period, apostrophie, hyphen]
            if(/^[a-zA-Z\.\-\-\ ']+$/.test(prevItem) && /^[a-zA-Z\.\-\-\ ']+$/.test(item)){

                arr[i - 1] = `${prevItem} ${item}`;
                arr[i] = '';

                if(/^[a-zA-Z\.\-\-\ ']+$/.test(nextItem)){
                    arr[i - 1] = `${prevItem} ${item} ${nextItem}`;
                    arr[i + 1] = '';
                }
            }

        }

        // Remove the blank entries
        arr = arr.filter(item => item !== '');
        return getPlayerStats(arr, team);
    });
}

const getPlayerStats = (arr, team) => {

    let currentPlayer = null;
    
    arr.forEach((stat, i) => {
        // If it's a name.. find that player in the object
        if(/^[a-zA-Z\.\-\-\ ']+$/.test(stat)){
            
            // Create player key and refrence it from the object.. should be util'ed
            let player = findPlayer(stat);

            // Why no player?!
            if(!player){

                // Add him with basic stuff
                player = addPlayer({
                    name: stat,
                    properties: {
                        team,
                        stats: { 
                            live: { ...statLine },
                            final: { ...statLine }
                        },
                    }
                });
                // Why no player?!
                // 1. Player is not on a standard line and only on Extra Fwd / DEF lines and I have been too lazy to program those in (ex Game 102 [Jordan Swarz])
                debugger;  
            }

            player.stats = {
                live: { ...statLine },
                final: { ...statLine }
            }

            currentPlayer = player;
            return;
        }

        // These are the stat lines
        // Player Name              G  A  P  +/- PIM S  H  SB GA TA FO     MP     PP MP  PK MP

        // Goals
        if(i % 15 === 1){
            currentPlayer.stats.goals = parseInt(stat);
            return;
        }

        // Assists
        if(i % 15 === 2){
            currentPlayer.stats.assists = parseInt(stat);
            return;
        }

        // Points
        if(i % 15 === 3){
            currentPlayer.stats.points = parseInt(stat);
            return;
        }

        // Plus Minus
        if(i % 15 === 4){
            currentPlayer.stats.plusMinus = stat;
            return;
        }

        // PIM
        if(i % 15 === 5){
            currentPlayer.stats.pims = parseInt(stat);
            return;
        }

        // Shots
        if(i % 15 === 6){
            currentPlayer.stats.shots = parseInt(stat);
            return;
        }

        // Hits
        if(i % 15 === 7){
            currentPlayer.stats.hits = parseInt(stat);
            return;
        }

        // Shots Blocked
        if(i % 15 === 8){
            currentPlayer.stats.shotsBlocked = parseInt(stat);
            return;
        }

        // Giveaways
        if(i % 15 === 9){
            currentPlayer.stats.giveaways = parseInt(stat);
            return;
        }

        // Takeaways
        if(i % 15 === 10){
            currentPlayer.stats.takeaways = parseInt(stat);
            return;
        }

        // Faceoffs
        if(i % 15 === 11){
            let [faceoffsWon, faceoffsTaken ] = stat.split('/');
            currentPlayer.stats.faceoffsWon = parseInt(faceoffsWon);
            currentPlayer.stats.faceoffsTaken = parseInt(faceoffsTaken);
            return;
        }

        // Minutes Played
        if(i % 15 === 12){
            let [minutes, seconds ] = stat.split(':');
            let toi = parseInt(minutes) * 60 + parseInt(seconds);

            currentPlayer.stats.minutesPlayed = toi;
            return;
        }

        // PP Minutes Played
        if(i % 15 === 13){
            let [minutes, seconds ] = stat.split(':');
            let toi = parseInt(minutes) * 60 + parseInt(seconds);

            currentPlayer.stats.ppMinutesPlayed = toi;
            return;
        }

        // PK Minutes Played
        if(i % 15 === 14){
            let [minutes, seconds ] = stat.split(':');
            let toi = parseInt(minutes) * 60 + parseInt(seconds);

            currentPlayer.stats.pkMinutesPlayed = toi;
            return;
        }
    })
}

//Ondrej Pavelec (STL), 30 saves from 32 shots - (0.938), 40:15 minutes
//Marc-Andre Fleury (STL), 8 saves from 12 shots - (0.667), L, 4-4-0, 19:45 minutes
const parseGoalieHTML = data => {
    $(data).filter(".STHSGame_GoalerStats").each((index, el) => {
        Array.prototype.slice.call(el.childNodes).filter(node => node.nodeName !== "BR").map(node => {
                let desc = node.nodeValue;
                let [ nameAndTeam, savesShots, ...other ] = desc.split(', ');
                let descision, wins, loss, otl;

                //This will isolate the player name
                let playerName = nameAndTeam.split(' (')[0];
                let player = findPlayer(playerName);

                let [ saves, shots ] = savesShots.split(' saves from ');
                shots = shots.split(' ')[0];

                // The goalie got a win or a loss
                if(other.length > 1){
                    descision = other[0];
                    [ wins, loss, otl ] = other[1].split('-');
                    
                    // Take them out
                    other.splice(0, 2);
                }

                let [minutes, seconds] = other[0].split(' ')[0].split(':');
                let toi = parseInt(minutes) * 60 + parseInt(seconds);

                player.stats = {
                    live: { ...goalieStatLine },
                    final: { 
                        saves: parseInt(saves),
                        shots: parseInt(shots),
                        toi,
                        descision: descision ? descision : goalieStatLine.descision, 
                        wins: wins ? parseInt(wins) : goalieStatLine.wins, 
                        loss: loss ? parseInt(loss) : goalieStatLine.loss, 
                        otl: otl ? parseInt(otl) : goalieStatLine.otl, 
                    }
                };
        });  
    });
}
import $ from 'jquery';

import { fullNameToAbbr } from '@/util/Teams';
import { toCamelCase } from '@/util/dataParsing';

const FORWARD = 'F';
const PP_FORWARD = 'PPF';
const PK_FORWARD = 'PKF';
const PK3_FORWARD = 'PK3F';
const FOUR_ON_FOUR_FORWARD = 'FONFF';
const EXTRA_FORWARD = 'XF';

const DEFENSE = 'D';
const PP_DEFENSE = 'PPD';
const PK_DEFENSE = 'PKD';
const PK3_DEFENSE = 'PK3D';
const FOUR_ON_FOUR_DEFENSE = 'FONFD';
const EXTRA_DEFENSE = 'XD';

const GOALIE = 'G';

const LAST_MINUTE_OFFENSIVE = 'LMO';
const LAST_MINUTE_DEFENSIVE = 'LMD';
const PENALTY_SHOTS = 'PS';
const SCRATCHES = 'SCR';

let output = {};

export const getPlayers = data => {

    $(data).filter(".STHSGame_TeamLine").each((index, el) => {
        let team = fullNameToAbbr(el.textContent);
        
        // Should only be B tags
        $(el).nextAll( "pre" ).first().children().each((index, el) => {
            
            let position = getPosition(el.textContent);
            
            $(el).nextUntilWithTextNodes("b").each((i, el) => {

                // I hate pre tags.. let's split them
                let arr = el.wholeText.split(' ');


                // Trying to normalize the output a little bit.. need to have no names beside each other in the array for the next bit to work
                for(let i = 1; i < arr.length; i++){
                    let item = arr[i];


                    if([':', '-', 'PK', 'PP'].includes(item)){
                        arr[i] = '';
                        continue;
                    }

                    if(item.includes(',')){
                        arr.splice((i + 1), 0, '');
                        arr[i] = item.replace(',', '');
                        continue;
                    }

                    // EDGE CASE Pierre-Edouard Bellemare doesn't have a space between him and the next guy so we gotta do weird stuffs..ugh
                    // Don't think anyone has four names.. yet
                    if(isNaN(item) && isNaN(arr[i - 1] || '') && isNaN(arr[i - 2] || '') && isNaN(arr[i + 1] || '')){
                        arr.splice(i, 0, '');
                    }
                }
                

                // loop through.. if two consectutive items with text in them appear.. must be a name
                for(let i = 1; i < arr.length; i++){
                    let prevItem = arr[i - 1];
                    let item = arr[i];
                    let nextItem = arr[i + 1] || '';



                    // Combine them if this is true
                    // Added a second blank item so to not lose a length on the array and throw i out of whack
                    // This mimics just moving the text into the previous field
                    if(isNaN(prevItem) && isNaN(item)){

                        if(isNaN(nextItem)){
                            arr[i - 1] = `${prevItem} ${item} ${nextItem}`;
                            arr[i] = '';
                            arr[i + 1] = '';
                            continue;
                        }

                        arr[i - 1] = `${prevItem} ${item}`;
                        arr[i] = '';
                    }

                }

                // Filter down the array to only names
                let players = arr.filter(item => item !== '' && isNaN(item));

                // If goalie, remove index 0 and 2
                if(position === GOALIE){
                    players.splice(0, 1);
                    players.splice(1, 1);
                }

                // TODO.. extra forwards / D and scratches are messed up.. not going to worry for now
                addPositionToPlayer({ position, players, team });
            })
        });
    });

    return output;
}

// TO DO.. finish up the players 
const addPositionToPlayer = ({ position, players, team }) => {
    switch(position){
        case FORWARD:
            return addPosition({players, team, position: FORWARD, line: FORWARD, lineSeperator: 3});
        case PP_FORWARD:
            return addPosition({players, team, position: FORWARD, line: PP_FORWARD, lineSeperator: 3});
        case PK_FORWARD:
            return addPosition({players, team, position: FORWARD, line: PK_FORWARD, lineSeperator: 2});
        case PK3_FORWARD:
            return addPosition({players, team, position: FORWARD, line: PK3_FORWARD, lineSeperator: 1});
        case FOUR_ON_FOUR_FORWARD:
            return addPosition({players, team, position: FORWARD, line: FOUR_ON_FOUR_FORWARD, lineSeperator: 2});
        case DEFENSE:
            return addPosition({players, team, position: DEFENSE, line: DEFENSE, lineSeperator: 2});    
        case PP_DEFENSE:
            return addPosition({players, team, position: DEFENSE, line: PP_DEFENSE, lineSeperator: 2});
        case PK_DEFENSE:
            return addPosition({players, team, position: DEFENSE, line: PK_DEFENSE, lineSeperator: 2});
        case PK3_DEFENSE:
            return addPosition({players, team, position: DEFENSE, line: PK3_DEFENSE, lineSeperator: 2});
        case FOUR_ON_FOUR_DEFENSE:
            return addPosition({players, team, position: DEFENSE, line: FOUR_ON_FOUR_DEFENSE, lineSeperator: 2});
        case PENALTY_SHOTS:
            return addPosition({players, team, position: PENALTY_SHOTS, line: PENALTY_SHOTS, lineSeperator: 1});   
        case GOALIE:
            return addPosition({players, team, position: GOALIE, line: GOALIE, lineSeperator: 1});      
        case EXTRA_FORWARD:
            return addExtrasPosition({players, team, position: EXTRA_FORWARD }); 
        case EXTRA_DEFENSE:
            return addExtrasPosition({players, team, position: EXTRA_DEFENSE }); 
        case LAST_MINUTE_OFFENSIVE:
        case LAST_MINUTE_DEFENSIVE:
        case SCRATCHES:
            // Do these if neccessary
            return false;
        default:
            //debugger;       
    }
}

// Standard Lines.. TODO.. addplayer in dataParsing.js.. or in here
const addPosition = ({ players, team, position, line, lineSeperator }) => {

    players.forEach((player, index) => {

        let formattedName = toCamelCase(player.replace(/[^\w\s]/gi, ""));
        let lineNumber = Math.ceil((index / lineSeperator) + 0.001);

        // Already has it.. just push the position
        if(output.hasOwnProperty(formattedName)){
            output[formattedName].lines.push(`${line}${lineNumber}`)
        } else {
            output[formattedName] = {
                id: formattedName,
                name: player,
                team,
                position,
                lines: [`${line}${lineNumber}`],
                stats: {}
            }
        }
    });
}


const addExtrasPosition = ({players, team, position }) => {
    players.shift();

    const positions = position === EXTRA_FORWARD ? ['EV1', 'EV2', 'EV3', 'PP1', 'PP2', 'PK' ] : ['EV1', 'EV2', 'EV3', 'PP', 'PK1', 'PK2' ];

    players.forEach((player, index) => {

        let formattedName = toCamelCase(player.replace(/[^\w\s]/gi, ""));

        // Already has it.. just push the position
        if(output.hasOwnProperty(formattedName)){
            output[formattedName].lines.push(`XF-${positions[index]}`)
        } else {
            output[formattedName] = {
                id: formattedName,
                name: player,
                team,
                position,
                lines: [`XF-${positions[index]}`],
                stats: {}
            }
        }
    });
}

const getPosition = text => {
    if(text.includes('5 vs 5 Forward')){
        return FORWARD;
    }

    if(text.includes('5 vs 5 Defense')){
        return DEFENSE;
    }

    if(text.includes('PowerPlay Forward')){
        return PP_FORWARD;
    }

    if(text.includes('PowerPlay Defense')){
        return PP_DEFENSE;
    }

    if(text.includes('Penalty Kill 4 Players Forward')){
        return PK_FORWARD;
    }

    if(text.includes('Penalty Kill 4 Players Defense')){
        return PK_DEFENSE;
    }

    if(text.includes('Penalty Kill - 3 Players Forward')){
        return PK3_FORWARD;
    }

    if(text.includes('Penalty Kill - 3 Players Defense')){
        return PK3_DEFENSE;
    }

    if(text.includes('4 vs 4 Forward')){
        return FOUR_ON_FOUR_FORWARD;
    }

    if(text.includes('4 vs 4 Defense')){
        return FOUR_ON_FOUR_DEFENSE;
    }

    if(text.includes('Last Minutes Offensive')){
        return LAST_MINUTE_OFFENSIVE;
    }

    if(text.includes('Last Minutes Defensive')){
        return LAST_MINUTE_DEFENSIVE;
    }

    if(text.includes('Goaltenders')){
        return GOALIE;
    }

    if(text.includes('Extra Forwards')){
        return EXTRA_FORWARD;
    }

    if(text.includes('Extra Defensemen')){
        return EXTRA_DEFENSE;
    }

    if(text.includes('Penalty Shots')){
        return PENALTY_SHOTS;
    }

    if(text.includes('Scratches')){
        return SCRATCHES;
    }

    debugger;
    // WHY YOU GET HERE?
}

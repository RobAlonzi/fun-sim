import { findPlayerId, toCamelCase } from '@/util/dataParsing';
import { betweenParenthesis } from '@/util/Parsing/helpers';
import { fullNameToAbbr } from '@/util/Teams';

export const mapScoringPlays = (data, events, teams) => {
    let goals = getScoringPlays(data, teams);

    goals.forEach(goal => {
        let { period, time } = goal;
        let timeEvents = events[period][time].events;

        for(let i = 0, length = timeEvents.length; i < length; i++){
            let result = timeEvents[i].result;

            // Find the goal event, morph it
            if(result.type === 'goal'){
                events[period][time].events[i].result = {
                    ...result,
                    team: goal.team,
                    score: goal.score,
                    player: goal.scorer,
                    assists: goal.assists,
                    variant: goal.variant
                }

                break;
            }
        }
    });
}

const getScoringPlays = (data, teams) => {
    let output = [];
    let score = { [teams.home]: 0, [teams.visitor]: 0}

    $(data).filter(".STHSGame_Period, .STHSGame_Overtime").each((index, el) => {
        let period = el.innerText;

        // Need to match up this key with the OT key from the events
        // 1stOvertimePeriod, 2ndOvertimePeriod etc
        if(period.includes("Overtime")){
            let otNumber = period.split('#')[1];
            let variation;

            // Don't have to worry (I hope) for 20+ OTs so this will do
            switch(otNumber){
                case '1':
                    variation = 'st';
                    break;
                case '2':
                    variation = 'nd';
                    break;
                case '3':
                    variation = 'rd';
                    break;
                default:
                    variation = 'th';
            };

            period = `${otNumber}${variation} Overtime Period`;
        }

        // Get text inside stats table pre.. filter out the BRs and the empty lines
        let goals = Array.prototype.slice.call($(el).next()[0].childNodes).filter(node => {
            if(node.nodeName === "BR"){ return false }

            node.textContent = node.textContent.replace(/\n/g, '');

            if(node.textContent === "" || node.textContent === 'No Goal'){ return false; }

            return true;
        });

        goals.forEach(node => {
            let time, variant, goalSeasonTotal;

            // Split up the text into variables
            let [team, playersTime] = node.textContent.split(' , ');

            // Turn 1. Avalanche into just the team
            team = team.split('. ');
            team.shift();
            team = fullNameToAbbr(team.join(' '));

            let [goalSummary, timeVariant] = playersTime.split(' at ');
            
            // If goals were (Empty Net), (PP) or (SH)
            // "18:13 (PP)"
            if(timeVariant.includes("(")){
                // [ "18:13", "(PP)"]
                let timeStr = timeVariant.split(' ');
                let [minutes, seconds] = timeStr[0].split(':');
                time = parseInt(minutes) * 60 + parseInt(seconds);

                // Get between the parentheseis
                variant = betweenParenthesis(timeStr.join(' '));

            } else{
                let [minutes, seconds ] = timeVariant.split(':');
                time = parseInt(minutes) * 60 + parseInt(seconds);
            }

            // Goal summary
            //"J.T. Miller 3 (Brett Pesce 2, Mark Stone 4)"
            let [ goalScorer, assists ] = goalSummary.split('(');
            
            // clean up goals before passing to function to find player
            goalScorer = goalScorer.split(' ').filter(item => item !== "");
            goalSeasonTotal = goalScorer.pop();

            assists = assists.split(', ').filter(item => item !== "").map(item => item.replace(')', '')).map(item => {
                let count = 1;
                let player = item.split(' ').filter(item => item !== "");

                // Weird thing where goalies getting assist don't have a count (GAME 222 YEAR 2017)
                // TODO.. known bug if goalie is like Jean Luc Picard (3 in the array but no count)
                if(player.length > 2){
                    count = player.pop();
                }

                return {
                    id: findPlayerId(player.join(" ")),
                    total: parseInt(count)
                }
            });

            // Change score, get the previous score or use original score
            score = {
                ...(output.length > 0 ? output[output.length - 1].score : score),
                [team]: (output.length > 0 ? output[output.length - 1].score[team] : score[team]) + 1
            }

            output.push({
                period: toCamelCase(period),
                team,
                score,
                time,
                variant: variant ? variant : "EV",
                scorer: {
                    id: findPlayerId(goalScorer.join(" ")),
                    total: parseInt(goalSeasonTotal)
                },
                assists 
            });

        });
    });

    return output;
}

const determineBaseTime = period => {

    let [periodNumber, periodVariant] = period.split(' ');

    // Get the actual numbers
    periodNumber = parseInt((periodNumber.split('').filter(item => !isNaN(item)).join('') - 1) * 1200);

    return periodVariant.includes('overtime') ? periodNumber + 3600 : periodNumber;
}
import { findPlayerId, toCamelCase } from 'util/dataParsing';

export const mapScoringPlays = (data, events) => {
    let goals = getScoringPlays(data);

    goals.forEach(goal => {
        let { period, time } = goal;
        let timeEvents = events[period][time].events;

        timeEvents.map((event, index) => {
            let result = event.result;

            // Find the goal event, morph it
            if(result.type === 'goal'){
                events[period][time].events[index] = {
                    ...result,
                    player: goal.scorer,
                    assists: goal.assists,
                    variant: goal.variant
                }
            }
        });
    });

}

const getScoringPlays = data => {
    let output = [];

    $(data).filter(".STHSGame_Period").each((index, el) => {
        let period = el.innerText;

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
            team = team.split('. ')[1];

            let [goalSummary, timeVariant] = playersTime.split(' at ');
            

            // If goals were (Empty Net), (PP) or (SH)
            // "18:13 (PP)"
            if(timeVariant.includes("(")){
                // [ "18:13", "(PP)"]
                let timeStr = timeVariant.split(' ');
                let [minutes, seconds] = timeStr[0].split(':');
                time = parseInt(minutes) * 60 + parseInt(seconds);

                // Get between the parentheseis
                variant = paranthesisRegex.exec(timeStr[1])[1];

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
                    player: findPlayerId(player.join(" ")),
                    count: parseInt(count)
                }
            });
            
            output.push({
                period: toCamelCase(period),
                time,
                variant: variant ? variant : "EV",
                scorer: {
                    player: findPlayerId(goalScorer.join(" ")),
                    total: parseInt(goalSeasonTotal)
                },
                assists 
            });

        });
    });

    return output;
}


const paranthesisRegex = /\(([^)]+)\)/;
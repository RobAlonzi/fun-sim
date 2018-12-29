import $ from 'jquery';
import { getGameType } from '@/util/dataParsing';

import {
    createShotEvent,
    createGoalEvent,
    createSaveEvent,
    createDeflectEvent,
    createMissedShotEvent,
    createShotHitPostEvent,
    createShotBlockedEvent,
    createFaceoffEvent,
    createHitEvent,
    createPenaltyEvent,
    createFightingEvent,
    createFightingPenaltyEvent,
    createMisconductPenaltyEvent,
    createEjectedEvent,
    createInjuryEvent,
    createOffsideEvent,
    createIcingEvent,
    createGoaliePulledEvent,
    createGoalieReturnedEvent,
    createGoalieReplacedEvent,
    createGoalReviewedEvent,
    createGoalReviewGoodEvent,
    createGoalReviewNoGoodEvent
} from './eventCreators';
    
/*/////////////////////////////////////////
This parses the play by play list and turns
an array of all the events
/////////////////////////////////////////*/
export const getGameEvents = data => {
    let output = [];
    
    // Select each of the possible period types
    $(data).filter("h4.STHSGame_PlayByPlayPeriod, h4.STHSGame_PlayByPlayOvertime, h4.STHSGame_PlayByPlayShootout").each((index, el) => {
        
        // Keep going until you hit another period
        $(el).nextUntilWithTextNodes("h4.STHSGame_PlayByPlayPeriod, h4.STHSGame_PlayByPlayOvertime, h4.STHSGame_PlayByPlayShootout").each((i, el) => {
            let event;

            // If you hit a link tag.. end it all
            if(el.nodeName === "A"){
                return false;
            }

            // We don't care about <br/> or carriage return or single periods after bold text
            if(el.nodeName === 'BR' || el.data === '\n' || el.data === '. '){
                return;
            }

            // If it's a summary node, remove it as well
            if(el.nodeName !== 'B' && (el.data.includes("Goals for this period are") || el.data.includes("Shots for this period are") )){
                return;
            }

            // No data and a B node needs to be combined with the node before it
            if(!el.data && el.nodeName === 'B'){
                event = output.pop();
                event = `${event} ${el.innerText}`;
            } else{
                event = el.data;
            }

            output.push(event.trim());
        });
      });

      return convertEvents(output);
}

/*/////////////////////////////////////////
This will take the array of events,
get their timestamp, and turn them into objects
/////////////////////////////////////////*/
const convertEvents = events => {
    let output = {};

    // Break off array into time and desc
    events.forEach(event => {
        let [time, desc] = event.split(" - ");

        // Determine period
        time = determineTimeAndPeriod(time);


        if(!output.hasOwnProperty(time.key)){
            output[time.key] = {
                [time.time] : {
                    time,
                    events: [desc]
                }
            }
        } else if(!output[time.key].hasOwnProperty(time.time)){
            output[time.key][time.time] = {
                time,
                events: [desc]
            };
        } else{
            output[time.key][time.time].events.push(desc);
        }
    });

    // Combine events into one object
    Object.keys(output).map(periodKey => Object.keys(output[periodKey]).map(timeKey => {

        // TODO.. pass in team / goal info.. strip away fightPenalty.. useless
        let events = output[periodKey][timeKey].events.map(event => mapEvent(event));

        // Mutate the object, replacing the data
        output[periodKey][timeKey] = {
            time: output[periodKey][timeKey].time,
            events: combineSimilarEvents(events)
        };
    }));

    // Return the output
    return output;
}

/*/////////////////////////////////////////
Takes a time from an events and converts into
a second timestamp for the period
/////////////////////////////////////////*/
const determineTimeAndPeriod = str => {
    let [time, period] = str.split(" of ");
    let [mins, secs] = time.split(":");

    time = (parseInt(mins) * 60) + parseInt(secs);
    let key = toCamelCase(period);

    // This is for regular season shootouts! They are displayed as 1st OT at 5:00
    if (getGameType() === 'Regular Season' && key === '1stOvertimePeriod' && time === 300){
        return {
            key: 'shootout',
            period: 'Shootout',
            time: 1
        }
    }

    return {
        key,
        period: phraseToUpper(period),
        time
    }
}

/*/////////////////////////////////////////
Depending on the text found in the event
this will dispatch the correct eventCreator
/////////////////////////////////////////*/
const mapEvent = event => {

    // Shot
    if(event.includes('Shot by ')){
        return createShotEvent(event);
    }

    // Goal
    if(event.includes('Goal by ')){
        return createGoalEvent(event);
    }

    // Save 
    if(event.includes('Stopped by ')){
        return createSaveEvent(event);
    }

    // Deflect
    if(event.includes('Deflect By ')){
        return createDeflectEvent(event);
    }

    // Shot Blocked
    if(event.includes('Shot Blocked by')){
        return createShotBlockedEvent(event);
    } 

    // Shot Missed
    if(event === 'Shot Misses the Net.'){
        return createMissedShotEvent()
    }

    // Shot Hit Post
    if(event === 'Shot Hit the Post.'){
        return createShotHitPostEvent()
    }

    // Faceoff
    if(event.includes('face-off')){
        return createFaceoffEvent(event);
    }

    // Hit
    if(event.includes('is hit by')){
        return createHitEvent(event);
    }

    // Minor Penalty
    if(event.includes('Minor Penalty')){
        return createPenaltyEvent(event);
    }

    // Misconduct Penalty 
    if(event.includes('Misconduct Penalty')){
        return createMisconductPenaltyEvent(event);
    }

    // Figthting Penalty
    if(event.includes('Penalty')){
        return createFightingPenaltyEvent(event);
    }

    // Fight
    if(event.includes('fight') || event.includes('beats up')){
        return createFightingEvent(event);
    }


    // Ejected
    if(event.includes('ejected')){
        return createEjectedEvent(event);
    }

    // Injury
    if(event.includes('injured')){
        return createInjuryEvent(event);
    }

    // Offside
    if(event.includes('Off-side')){
        return createOffsideEvent(event);
    }

    // Icing
    if(event.includes('Icing')){
        return createIcingEvent(event);
    }
    
    // Goalie Pulled
    if(event.includes('pulled from the net')){
        return createGoaliePulledEvent(event);
    }

    // Goalie Returned
    if(event.includes('was sent back in the game')){
        return createGoalieReturnedEvent(event);
    }

    // Goalie Replaced
    if(event.includes(' enters game')){
        return createGoalieReplacedEvent(event);
    }

    // Goal Reviewed
    if(event === 'The goal is going for a video replay.'){
        return createGoalReviewedEvent();
    }

    // Goal Reviewed -- Good 
    if(event === 'The goal is good.'){
        return createGoalReviewGoodEvent();
    }

    if(event === 'The goal is refused.'){
        return createGoalReviewNoGoodEvent();
    }

    // WTF
    console.error(`NEW EVENT: ${event}`);
    debugger;
}

/*/////////////////////////////////////////
If two events happen at the same time but
can be combines (deflected shot, goal, save),
this will do it
/////////////////////////////////////////*/
const combineSimilarEvents = events => {

    if(events.length === 1){
        return events;
    }

    let shotEvents = ['shot', 'penaltyShot'];
    let shotResultEvents = ['shotMissed', 'shotHitPost', 'shotBlocked', 'shotSaved', 'goal'];

    for(let i = 0; i < events.length; i++){
        let currentEvent = events[i].event;
        let nextEvent = events[i + 1] && events[i + 1].event;

        // Combine the deflect if the shot was deflected
        if(currentEvent === 'shot' && nextEvent === 'shotDeflect'){

            let { event, ...other } =  events[i + 1];

            events[i].deflect = {
                ...other
            }

            // Remove the deflect event
            events.splice((i + 1), 1);
            --i;
            
            continue;
        }

        // Goal Review
        if(shotEvents.includes(currentEvent) && nextEvent === 'goalReviewed'){
            
            events[i].review = {
                outcome: events[i + 2].event
            }

            // Remove the shot event
            events.splice((i + 1), 2);
            i = (i - 2) < 0 ? -1 : (i - 2);

            continue;
        }

        // Combine the shot events
        if(shotEvents.includes(currentEvent) && shotResultEvents.includes(nextEvent)){

            let { event, ...other } = events[i + 1];

            events[i].result = {
                type: event,
                ...other 
            }

            // Remove the shot event
            events.splice((i + 1), 1);
            --i;

            continue;
        }
    }
    
    return events;
}

// Utils
const phraseToUpper = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
const toCamelCase = str => phraseToUpper(str).replace(/\s+/g, '');
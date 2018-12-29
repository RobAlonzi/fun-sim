import { Container } from 'unstated';
import set from 'lodash.set';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';

import { formatTime } from '@/util/Format';

export default class GameContainer extends Container {

    constructor(props = {}) {
        super(props);
        this.state = mapDefaultState(props);
    }

    updatedState = {};
    intervention = null;

    startGame = () => {
        // Set up any team stats, players, text

        // Set interval
        this.__startHeartbeat();
    }

    pauseGame = isPaused => {
        this.setState(() => ({
            settings: {
                ...this.state.settings,
                isPaused
            }
        }))
    }

    updateGameSpeed = speed => {
        this.setState(() => ({
            settings: {
                ...this.state.settings,
                gameSpeed: speed
            }
        }))
    }

    // PRIVATE
    __startHeartbeat = () => {
        let nextFn = this.__startHeartbeat;
        let period = null;
        this.__addToState(null, null, { reset: true });

        // If we just had a goal in OT.. end the game
        if (this.state.clock.period.isExtraTime && this.intervention && this.intervention.reason === 'goal') {
            this.__endGame();
            return;
        }

        // Game clock state changes
        const clock = this.__calculateClockRange();


        // Clock related logic
        if (clock.periodChange) {
            period = this.__getNextPeriod();
        }


        // Adding Events
        this.__addEvents(clock.from, clock.to);

        if (clock.periodChange) {
            if (period && period.key === 'shootout') {
                nextFn = this.__startShootout;
            }

            if (!period) {
                nextFn = this.__endGame;
            }
        }

        // Set the state
        this.__setNewState(nextFn);
    }

    __startShootout = () => {
        const { final: { events } } = this.state;
        const shootoutAttempts = Object.values(events['shootout'])[0].events;
        let winnerKey;
        let attemptNumber = 0;
        const updatedState = {};

        const [home, visitor] = this.__getTeamKeys();
        updatedState.shootout = {
            [home]: [],
            [visitor]: [],
        }
        

        const interval = setInterval(() => {
            
            // Attempts
            const event = shootoutAttempts[attemptNumber];
            attemptNumber += 1;

            // Adding Events
            updatedState.events = [{ data: { ...event, isShootoutAttempt: true } }, ...this.state.events]
            const team = this.__getPlayerTeam(event.player);
            const result = event.result.type === 'goal' ? 'goal' : 'miss';

            updatedState.shootout[team] = [...updatedState.shootout[team], {
                player: event.player,
                result
            }];

            if (attemptNumber === shootoutAttempts.length) {

                // If last shot is a goal.. shooter team wins
                // If save.. goalie team wins
                if(event.result.type === 'goal'){
                    winnerKey = this.state.players[event.player].team;
                } else {
                    winnerKey = this.__getOppositeTeamKey(this.state.players[event.player].team)
                }

                updatedState.teams = {
                    ...this.state.teams,
                    [winnerKey]: {
                        ...this.state.teams[winnerKey],
                        stats: {
                            ...this.state.teams[winnerKey].stats,
                            goals: {
                                ...this.state.teams[winnerKey].stats.goals,
                                total: this.state.teams[winnerKey].stats.goals.total + 1
                            }
                        }
                    }
                }                
            }

            this.setState(updatedState);

            if (attemptNumber === shootoutAttempts.length) {
                clearInterval(interval);
                this.__endGame();
            }
        }, 1000);
    }

    __endGame = () => {
        const isExtraTime = this.state.clock.period.isExtraTime;
        const isShootout = this.state.clock.period.isExtraTime && this.state.clock.period.key === 'shootout';
        let name = 'Final';
        
        if(isExtraTime && !isShootout){
            name = `${name} (OT)`;
        }

        if(isShootout){
            name = `${name} (SO)`;
        }

        const endGameState = {
            teams: this.state.final.teams,
            players: this.state.final.players,
            clock: {
                ...this.state.clock,
                period: {
                    key: 'final',
                    name,
                    isExtraTime,
                    isShootout,
                }
            } 
        };
        
        this.setState(endGameState);
    }

    __calculateClockRange = () => {
        const { clock, settings } = this.state;
        let from = clock.time;
        let to = from + settings.gameSpeed;
        let periodChange = false;

        // If the clock is at 0, change period
        if (from === clock.period.totalTime) {
            periodChange = true;
        }

        // If there was an intervention, bump the clock one second
        if (this.intervention) {
            from += 1;
        }

        // Over amount of seconds in a period.. set it to 0:00
        if (to > clock.period.totalTime) {
            to = clock.period.totalTime;
        }

        // Adjust State
        this.__addToState(['clock', 'time'], to);

        // Return data
        return { from, to, periodChange };
    }

    __getNextPeriod = () => {
        const { periods, clock } = this.state;
        const period = Object.values(periods).find(period => period.number === clock.period.number + 1);

        if (period) {
            this.__addToState(['clock'], { time: 0, period });
        }

        return period;
    }

    /*/////////////////////////////////////////////////
    /////////////////// EVENTS ///////////////////////
    */////////////////////////////////////////////////
    __addEvents = (prevTime, newTime) => {
        const { final: { events }, clock: { period } } = this.state;
        const newEvents = [];

        // Resetting the invervention
        this.intervention = null;

        for (let i = prevTime; i < newTime; i++) {
            if (this.intervention) {
                break;
            }

            const plays = events[period.key][i];
            if (plays) {

                for (let j = 0, { length } = plays.events; j < length; j += 1) {
                    const play = plays.events[j];

                    newEvents.unshift({ time: plays.time, data: play });
                    
                    const gotEvents = ['faceoff', 'shot', 'penalty', 'hit', 'icing', 'offside', 'fight', 'ejected', 'injury', 'goalieReplaced'];

                    if(!gotEvents.includes(play.event)){
                        debugger;
                    }

                    // FACEOFF
                    if (play.event === 'faceoff') {
                        this.__addFaceoff(play);
                    }

                    // SHOT
                    if (play.event === 'shot') {

                        if(play.result.type === 'shotBlocked'){
                            this.__addPlayerBlockedShot(play);
                        }

                        // Shot was saved
                        if (play.result.type === 'shotSaved') {
                            this.__addPlayerShot(play);
                            this.__addTeamShot(play);
                            this.__addGoalieShotAgainst(play.result);
                            this.__addSave(play.result);
                        }

                        // Adding goals
                        if (play.result && play.result.type === 'goal') {
                            // TODO.. add goalie shot against
                            this.__addPlayerShot(play);
                            this.__addTeamShot(play);
                            this.__addGoal({ time: plays.time, data: play.result });
                            this.intervention = { time: plays.time.time, reason: 'goal', delay: 5000 };
                        }
                    }

                    // HIT
                    if (play.event === 'hit') {
                        this.__addHit(play);
                    }


                    // PENALTY
                    if (play.event === 'penalty') {
                        this.__addPenalty({ time: plays.time, data: play })
                    }

                    // FIGHT
                    if (play.event === 'fight') {
                        this.__addFight({ time: plays.time, data: play })
                    }

                    // EJECTED
                    if (play.event === 'ejected') {
                        this.__addEjection({ time: plays.time, data: play })
                    }

                    // INJURY
                    if (play.event === 'injury') {
                        this.__addInjury({ time: plays.time, data: play });
                    }

                    // GOALIE SWITCH
                    if (play.event === 'goalieReplaced') {
                        this.__switchGoalie({ time: plays.time, data: play });
                    }
                }
            }
        }

        // Add Events to State
        this.__addToState(['events'], newEvents);

        if (this.intervention) {
            this.__addToState(['clock', 'time'], this.intervention.time);
        }
    }

    __addPlayerShot = shot => {
        // Player
        const playerKey = shot.deflect ? shot.deflect.player : shot.player;
        const prevValue = get(this.updatedState, ['players', playerKey, 'stats', 'shots'], this.state.players[playerKey].stats.shots);
        this.__addToState(['players', playerKey, 'stats', 'shots'], prevValue + 1);
    }

    __addPlayerBlockedShot = shot => {
        const playerKey = shot.result.player;
        const teamKey = this.state.players[playerKey].team;
        const playerObjPath = ['players', playerKey, 'stats', 'shotsBlocked'];
        const teamObjPath = ['teams', teamKey, 'stats', 'blockedShots'];
        const prevValue = get(this.updatedState, playerObjPath, this.state.players[playerKey].stats.shotsBlocked);
        const prevTeamValue = get(this.updatedState, teamObjPath, this.state.teams[teamKey].stats.blockedShots);
        this.__addToState(['players', playerKey, 'stats', 'shotsBlocked'], prevValue + 1);
        this.__addToState(['teams', teamKey, 'stats', 'blockedShots'], prevTeamValue + 1);
    }

    __addTeamShot = shot => {
        const teamKey = this.state.players[shot.player].team;
        const prevValue = get(this.updatedState, ['teams', teamKey, 'stats', 'shots', 'total'], this.state.teams[teamKey].stats.shots.total);
        this.__addToState(['teams', teamKey, 'stats', 'shots', 'total'], prevValue + 1);
    }

    __addGoalieShotAgainst = shot => {
        // Goalie
        const goalieKey = shot.player;
        const prevValue = get(this.updatedState, ['players', goalieKey, 'stats', 'shots'], this.state.players[goalieKey].stats.shots);
        this.__addToState(['players', goalieKey, 'stats', 'shots'], prevValue + 1);
    }

    __addSave = save => {
        const prevValue = get(this.updatedState, ['players', save.player, 'stats', 'saves'], this.state.players[save.player].stats.saves);
        this.__addToState(['players', save.player, 'stats', 'saves'], prevValue + 1);
    }

    __addGoal = goal => {
        // Add goal to player
        const goalScorer = goal.data.player.id;
        const goalObjPath = ['players', goalScorer, 'stats', 'goals'];
        const prevGoalValue = get(this.updatedState, goalObjPath, this.state.players[goalScorer].stats.goals);
        this.__addToState(goalObjPath, prevGoalValue + 1);

        // Adding assists
        goal.data.assists.forEach(assist => {
            const assistObjPath = ['players', assist.id, 'stats', 'assists'];
            const prevAssistValue = get(this.updatedState, assistObjPath, this.state.players[assist.id].stats.assists);
            this.__addToState(assistObjPath, prevAssistValue + 1);
        });

        // Add team goal
        const teamObjPath = ['teams', goal.data.team, 'stats', 'goals', 'total'];
        const prevTeamGoalValue = get(this.updatedState, teamObjPath, this.state.teams[goal.data.team].stats.goals.total);
        this.__addToState(teamObjPath, prevTeamGoalValue + 1);

        // Get goalie
        const goalieKey = this.__getTeamGoalie(this.__getOppositeTeamKey(goal.data.team));
        const prevValue = get(this.updatedState, ['players', goalieKey, 'stats', 'shots'], this.state.players[goalieKey].stats.shots);
        this.__addToState(['players', goalieKey, 'stats', 'shots'], prevValue + 1);

        // State
        this.__addToState(['goals'], goal);
    }

    __addPenalty = penalty => {
        let minutes;

        switch (penalty.data.type) {
            case 'Minor':
                minutes = 2;
                break;
            case 'Major':
                minutes = 5;
                break;
            default:
                minutes = 2;
                break;
        }

        const penalties = this.updatedState.penalties || [];
        const playerObjPath = ['players', penalty.data.player, 'stats', 'pims'];
        const teamObjPath = ['teams', this.state.players[penalty.data.player].team, 'stats', 'pims'];

        // Prev Values
        const prevPlayerValue = get(this.updatedState, playerObjPath, this.state.players[penalty.data.player].stats.pims);
        const prevTeamValue = get(this.updatedState, teamObjPath, this.state.teams[this.state.players[penalty.data.player].team].stats.pims);
        

        // State
        this.__addToState(['penalties'], [penalty, ...penalties]);
        this.__addToState(playerObjPath, prevPlayerValue + minutes);
        this.__addToState(teamObjPath, prevTeamValue + minutes);

        if(minutes === 2 || penalty.data.penalty !== 'Fighting'){
            const prevCurrentPenalties = get(this.updatedState, ['currentPenalties'], []);
            const data = {
                player: this.state.players[penalty.data.player].name,
                type: penalty.data.type,
                penalty: penalty.data.penalty,
                team: this.state.players[penalty.data.player].team,
                period: penalty.time.key,
                start: penalty.time.time,
                duration: minutes * 60,
            };
            this.__addToState(['currentPenalties'], [data, ...prevCurrentPenalties]);
        }
    }

    __addFight = fight => {
        const notePath = ['notes'];
        const prevValue = get(this.updatedState, notePath, this.state.notes);
        
        const data = {
            desc: fight.data.description,
            time: fight.time
        };
        
        this.__addToState(notePath, [...prevValue, data]);
    }

    __addEjection = ejection => {
        const notePath = ['notes'];
        const prevValue = get(this.updatedState, notePath, this.state.notes);
        const teamKey = this.__getPlayerTeam(ejection.data.player);
        
        const data = {
            desc: ejection.data.description.replace(' is ejected ', ` (${teamKey.toUpperCase()}) is ejected `),
            time: ejection.time
        };
        
        this.__addToState(notePath, [...prevValue, data]);
    }

    __addInjury = injury => {
        const notePath = ['notes'];
        const prevValue = get(this.updatedState, notePath, this.state.notes);
        
        const data = {
            desc: injury.data.description,
            time: injury.time
        };
        
        this.__addToState(notePath, [...prevValue, data]);
    }

    __addFaceoff = faceoff => {
        const winningPlayerObjPath = ['players', faceoff.winner, 'stats'];
        const winningTeamObjPath = ['teams', this.state.players[faceoff.winner].team, 'stats'];
        const losingPlayerObjPath = ['players', faceoff.loser, 'stats'];

        // Prev Values
        const winningPlayerTaken = get(this.updatedState, [...winningPlayerObjPath, 'faceoffsTaken'], this.state.players[faceoff.winner].stats.faceoffsTaken);
        const winningPlayerWon = get(this.updatedState, [...winningPlayerObjPath, 'faceoffsWon'], this.state.players[faceoff.winner].stats.faceoffsWon);
        const winningTeamWon = get(this.updatedState, [...winningTeamObjPath, 'faceoffWins'], this.state.teams[this.state.players[faceoff.winner].team].stats.faceoffWins);
        const losingPlayerTaken = get(this.updatedState, [...losingPlayerObjPath, 'faceoffsTaken'], this.state.players[faceoff.loser].stats.faceoffsTaken);

        // State
        this.__addToState([...winningPlayerObjPath, 'faceoffsTaken'], winningPlayerTaken + 1);
        this.__addToState([...winningPlayerObjPath, 'faceoffsWon'], winningPlayerWon + 1);
        this.__addToState([...losingPlayerObjPath, 'faceoffsTaken'], losingPlayerTaken + 1);
        this.__addToState([...winningTeamObjPath, 'faceoffWins'], winningTeamWon + 1);
    }

    __addHit = hit => {
        const playerObjPath = ['players', hit.winner, 'stats', 'hits'];
        const teamObjPath = ['teams', this.state.players[hit.winner].team, 'stats', 'hits'];

        // Prev Values
        const prevPlayerValue = get(this.updatedState, playerObjPath, this.state.players[hit.winner].stats.hits);
        const prevTeamValue = get(this.updatedState, teamObjPath, this.state.teams[this.state.players[hit.winner].team].stats.hits);

        // State
        this.__addToState(playerObjPath, prevPlayerValue + 1);
        this.__addToState(teamObjPath, prevTeamValue + 1);
    }

    __switchGoalie = event => {
        const teamKey = this.__getPlayerTeam(event.data.player);
        const goalPath = ['teams', teamKey, 'inGoal'];
        this.__addToState(goalPath, event.data.player);


        // Adding player stat line
        const playerObjPath = ['players', event.data.player, 'stats'];
        const prevPlayerValue = get(this.updatedState, playerObjPath, this.state.players[event.data.player].stats);

        if(!Object.values(prevPlayerValue).length){
            this.__addToState(playerObjPath, { saves: 0, shots: 0 });
        }

        // Adding note.
        const notePath = ['notes'];
        const prevValue = get(this.updatedState, notePath, this.state.notes);
        
        const data = {
            desc: event.data.description,
            time: event.time
        };
        
        this.__addToState(notePath, [...prevValue, data]);
    }



    /*/////////////////////////////////////////////////
    //////////////////// STATE ////////////////////////
    */////////////////////////////////////////////////
    __addToState = (path, value, { reset } = {}) => {

        if (reset) {
            this.updatedState = {};
            return;
        }

        this.updatedState = set(this.updatedState, path, value);
    }

    __setNewState = callback => {

        let newState = {
            clock: {}
        };


        // Clock
        newState.clock.period = this.updatedState.clock.period || this.state.clock.period;
        newState.clock.time = this.updatedState.clock.time;

        // Events
        if (this.updatedState.events.length) {
            newState.events = [...this.updatedState.events, ...this.state.events];
        }

        // Penalties
        if (this.updatedState.penalties) {
            newState.penalties = [...this.state.penalties, ...this.updatedState.penalties];
        }

        // Current penalties clock
        if (this.updatedState.currentPenalties || this.state.currentPenalties) {
            const currentPenalties = [];
            [...(this.updatedState.currentPenalties || []), ...(this.state.currentPenalties || [])].forEach(penalty => {
                // It's still the same period the penalty took place
                if (newState.clock.period.key === penalty.period){
                    // If the penalty hasn't expired yet
                    if ((penalty.start + penalty.duration) > newState.clock.time){
                        currentPenalties.push({
                            ...penalty,
                            remaining: (penalty.start + penalty.duration) - newState.clock.time
                        });
                    }
                } else {
                    // Different period.. do different math
                    const periodTime = this.state.periods[penalty.period].totalTime;
                    if ((penalty.start + penalty.duration) > (periodTime + newState.clock.time)){
                        currentPenalties.push({
                            ...penalty,
                            remaining: (penalty.start + penalty.duration) - (periodTime + newState.clock.time)
                        });
                    }
                }
            });

            newState.currentPenalties = currentPenalties;
        }

        // Goals
        if (this.updatedState.goals) {
            newState.goals = { ...this.state.goals };
            if (Object.prototype.hasOwnProperty.call(this.state.goals, newState.clock.period.key)) {
                newState.goals[newState.clock.period.key] = [...this.state.goals[newState.clock.period.key], this.updatedState.goals]
            } else {
                newState.goals[newState.clock.period.key] = [this.updatedState.goals];
            }

            // If the last goal was a PP goal, we need to wipe one of the penalties
            // TODO: Coinciding penalties?
            const latestGoal = newState.goals[newState.clock.period.key][newState.goals[newState.clock.period.key].length - 1];
            if(latestGoal.data.variant === 'PP'){
                // Find the first minor from the other team
                const index = newState.currentPenalties.findIndex(penalty => penalty.team === this.__getOppositeTeamKey(latestGoal.data.team) && penalty.type === 'Minor');
                newState.currentPenalties.splice(index, 1);
            }
        }

        // Player stats
        if (this.updatedState.players) {
            newState.players = cloneDeep(this.state.players);
            Object.entries(this.updatedState.players).forEach(player => {
                const [key, stats] = player;
                Object.values(stats).forEach(stat => {
                    Object.keys(stat).forEach(statKey => {
                        newState.players[key].stats[statKey] = stat[statKey];
                    });
                });
            });
        }

        if (this.updatedState.teams) {
            newState.teams = cloneDeep(this.state.teams);
            Object.entries(this.updatedState.teams).forEach(team => {
                const [key, stats] = team;
                const { inGoal, ...other } = stats;

                if(inGoal){
                    newState.teams[key].inGoal = inGoal;
                }
                
                Object.values(other).forEach(stat => {
                    Object.keys(stat).forEach(statKey => {
                        newState.teams[key].stats[statKey] = cloneDeep(stat[statKey]);
                    });
                });
            });
        }

        // NOTES
        if (this.updatedState.notes) {
            newState.notes = this.updatedState.notes;
        }

        // Set the state!
        this.setState(() => newState);

        setTimeout(() => {
            callback();
        }, get(this, ['intervention', 'delay'], 1000));
    }

    // UTIL
    __getPlayerTeam = key => playerTeamKey(this.state.players[key]);
    __getTeamGoalie = key => getGoalie(this.state.teams, key);
    __getOppositeTeamKey = key => oppositeTeamKey(this.state.teams, key);
    __getTeamKeys = () => getTeamKeys(this.state.teams);
}



const mapDefaultState = props => {
    const output = {
        loading: true,
        final: {},
        settings: {
            gameSpeed: 10,
            isPaused: false,
        },
    };

    if (!!props.loading) {
        return output;
    }

    let { game, players, teams, periods, final } = props.data;

    return {
        clock: {
            period: Object.values(periods)[0],
            time: 0,
        },
        currentPenalties: [],
        events: [],
        final,
        game,
        goals: {},
        loading: props.loading,
        notes: [],
        penalties: [],
        periods,
        players,
        settings: {
            gameSpeed: 10,
            isPaused: false,
        },
        shootout: {},
        teams,
    }

}

function getTeamKeys(teams){
    return Object.keys(teams).filter(key => !['home', 'visitor'].includes(key));
}

function playerTeamKey(player){
    return player.team;
}

function oppositeTeamKey(teams, teamKey){
    return Object.keys(teams).filter(key => !['home', 'visitor', teamKey].includes(key)).join();
}

function getGoalie(teams, key){
    return teams[key].inGoal;
}
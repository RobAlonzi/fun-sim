import { Container } from 'unstated';
import set from 'lodash.set';
import get from 'lodash.get';
import cloneDeep from 'lodash.clonedeep';

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
            if (period.key === 'shootout') {
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

        const interval = setInterval(() => {
            const event = shootoutAttempts[attemptNumber];
            this.setState(() => ({
                events: [{ data: { ...event, isShootoutAttempt: true } }, ...this.state.events]
            }));
            attemptNumber += 1;

            if (attemptNumber === shootoutAttempts.length) {
                debugger;

                // If last shot is a goal.. shooter team wins
                // If save.. goalie team wins
                if(event.result.type === 'goal'){
                    winnerKey = this.state.players[event.player].team;
                } else {
                    winnerKey = oppositeTeamKey(this.state.teams, this.state.players[event.player].team)
                }

                this.setState(() => ({
                    teams: { 
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
                }));

                clearInterval(interval);
                this.__endGame();
            }
        }, 1000);
    }

    __endGame = () => {

    }

    __calculateClockRange = () => {
        const { clock, settings } = this.state;
        let from = clock.time;
        let to = from + settings.timeInterval;
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
                    
                    const gotEvents = ['faceoff', 'shot', 'penalty', 'hit', 'icing', 'offside'];

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
                            break;
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
        // Add shots + goals to player
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
        const goalieKey = getGoalie(this.state.teams, oppositeTeamKey(this.state.teams, goal.data.team));
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

        // TODO..manual merge of each piece of state

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

        // Goals
        if (this.updatedState.goals) {
            newState.goals = { ...this.state.goals };
            if (Object.prototype.hasOwnProperty.call(this.state.goals, newState.clock.period.key)) {
                newState.goals[newState.clock.period.key] = [this.updatedState.goals, ...this.state.goals[newState.clock.period.key]]
            } else {
                newState.goals[newState.clock.period.key] = [this.updatedState.goals];
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
                Object.values(stats).forEach(stat => {
                    Object.keys(stat).forEach(statKey => {
                        newState.teams[key].stats[statKey] = cloneDeep(stat[statKey]);
                    });
                });
            });
        }

        // Set the state!
        this.setState(() => newState);

        setTimeout(() => {
            callback();
        }, get(this, ['intervention', 'delay'], 1000));
    }
}



const mapDefaultState = props => {
    const output = {
        loading: true,
        finalData: {},
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
        events: [],
        final,
        game,
        goals: {},
        loading: props.loading,
        notes: [],
        penalties: [],
        periods: periods,
        players,
        settings: {
            timeInterval: 500,
        },
        teams,
    }

}

function oppositeTeamKey(teams, teamKey){
    return Object.keys(teams).filter(key => !['home', 'visitor', teamKey].includes(key)).join();
}

function getGoalie(teams, key){
    return teams[key].skaters.inGoal;
}
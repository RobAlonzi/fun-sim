import { Container } from 'unstated';

export default class GameContainer extends Container {
    
    constructor(props = {}) {
        super(props);
        this.state = mapDefaultState(props);
    }

    // Debugger function to map data
    startGame = () => {
        let plays = [];
        Object.entries(this.state.events.final).map(([period, events]) => {
            Object.values(events).forEach(event => {
                
                event.events.forEach(play => {
                    plays.push(play);

                    if(play.event === 'shot'){

                        // Adding goals
                        if(play.result.type === 'goal'){
                            this.__addGoal(period, { time: event.time, data: play.result });
                        }
                    }
                })
            })
        });

        this.setState(() => ({
            events: {
                ...this.state.events,
                live: plays
            }
        }))
    }

    // PRIVATE
    __addGoal = (period, goal) => {

        const newState = this.state.events.goals;

        if(newState.hasOwnProperty(period)){
            newState[period].push(goal);
        } else {
            newState[period] = [goal];
        }

        this.setState(() => ({
            events:{
                ...this.state.events,
                goals: newState
            }
        }))
    }
}


const mapDefaultState = props => {
    const output = {
        loading: true,
        finalData: {},
    };

    if(!!props.loading){
        return output;
    }

    let { events, game, players, teams } = props.data;

    return {
        clock: {
            totalTime: 0,
            periodTime: 0,
            period: 1,
            periodDesc: '1st Period'
        },
        game,
        players,
        teams,
        loading: props.loading,
        data: props.data,
        events: {
            final: events,
            live: [],
            goals: {},
            penalties: []
        }
    }

}
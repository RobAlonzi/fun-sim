import { findTeamByFullName } from 'util/Teams';
import { removeNewLine, newLineToSpace, betweenParenthesis } from 'util/Parsing/helpers';
import { findPlayer } from 'util/dataParsing';


const INITIAL_TEAM_STATLINE = {
    goals: {},
    shots: {},
    powerplay: { attempts: 0, goals: 0, pct: 0 },
    penaltyKill: { attempts: 0, kills: 0, pct: 0 },
    blockedShots: 0,
    faceoffWins: 0,
    hits: 0,
    pims: 0
}

export const getGameInfo = (data, players) => {

    // Get Date
    const date = getDate(data);

    // Get Teams and Data
    const teams = getTeamInfo(data, players);

    // Get Rink and Attendance
    const venueInfo = getVenueInfo(data);

    // Get Refs
    const officials = getGameOfficials(data);

    // Get Three Stars
    const threeStars = getThreeStars(data);


    return {
        teams,
        game: {
            date,
            venueInfo,
            officials,
            threeStars
        }
    }
}


const getTeamInfo = (data, players) => {
    const string = removeNewLine($(data).closest(".STHSGame_Result").text());
    let [ visitor, home ] = string.split(' vs ');

    // Get rid of the (R3) text if any
    home = home.split('(')[0];

    // Find them
    visitor = findTeamByFullName(visitor);
    home = findTeamByFullName(home);

    // Get their stats
    const { home: homeStats, visitor: visitorStats } = getTeamStats(data);

    // Get players for each team
    const { homePlayers, homeGoalies, visitorPlayers, visitorGoalies } = getTeamPlayers(players, home.key);

    return {
        [home.key] : {
            ...home,
            stats: {
                live: INITIAL_TEAM_STATLINE,
                final: { ...homeStats }
            },
            skaters: {
                players: homePlayers,
                goalies: homeGoalies
            }
        },
        [visitor.key] : {
            ...visitor,
            stats: {
                live: INITIAL_TEAM_STATLINE,
                final: { ...visitorStats }
            },
            skaters: {
                players: visitorPlayers,
                goalies: visitorGoalies
            }
        },
        home: home.key,
        visitor: visitor.key
    }
}

const getTeamPlayers = (players, homeTeam) => {
    const homePlayers = [];
    const homeGoalies = [];
    const visitorPlayers = [];
    const visitorGoalies = [];

    Object.values(players).map(player => {
        if(player.team === homeTeam){
            player.position === "G" ? homeGoalies.push(player.id) : homePlayers.push(player.id);
        } else{
            player.position === "G" ? visitorGoalies.push(player.id) : visitorPlayers.push(player.id);
        }
    });

    return {
        homePlayers,
        homeGoalies,
        visitorPlayers,
        visitorGoalies
    }
}

const getTeamStats = data => {
    // Get goals
    const { visitorGoals, homeGoals } = getTeamGoalsByPeriod(data);

    // Get shots
    const { visitorShots, homeShots } = getTeamShotsByPeriod(data);

    // Get powerplay / penalty kill
    const {visitorPP, visitorPK, homePP, homePK } = getTeamSpecialTeamsInfo(data);

    // Get hits, fo wins, blocked shots, pims
    const {visitorOtherStats, homeOtherStats} = getTeamOtherStats(data);


    return {
        home: {
            goals: homeGoals,
            shots: homeShots,
            powerplay: homePP,
            penaltyKill: homePK,
            ...homeOtherStats
        },
        visitor: {
            goals: visitorGoals,
            shots: visitorShots,
            powerplay: visitorPP,
            penaltyKill: visitorPK,
            ...visitorOtherStats
        }
    }
}

const getTeamOtherStats = data => {

    let output = {};

    $(data).filter('.STHSGame_TeamStat').each((index, el) => {
        let [ team, hits, foWins, blockedShots, pims ] = el.innerText.split(' - ');
        
        // First is always visiting team
        if(index === 0){
            output.visitorOtherStats = {
                hits: parseInt(hits.split(' : ')[1]),
                faceoffWins: parseInt(foWins.split(' : ')[1]),
                blockedShots: parseInt(blockedShots.split(' : ')[1]),
                pims: parseInt(pims.split(' : ')[1]),
            };
        } else{
            output.homeOtherStats = {
                hits: parseInt(hits.split(' : ')[1]),
                faceoffWins: parseInt(foWins.split(' : ')[1]),
                blockedShots: parseInt(blockedShots.split(' : ')[1]),
                pims: parseInt(pims.split(' : ')[1]),
            };
        }
        
    });

    return output;
}

const getTeamSpecialTeamsInfo = data => {

    let output = {};

    $(data).filter(".STHSGame_PowerPlay").each((index, el) => {
    
        let chances = el.innerText.split(' - ')[1];
        
        let [ goals, attempts ] = chances.split(' on ');
        attempts = attempts.replace(' Attempt(s)', '');

        goals = parseInt(goals);
        attempts = parseInt(attempts);

        // First is always visiting team
        if(index === 0){
            output.visitorPP = {
                goals,
                attempts,
                pct: Number((goals / attempts * 100).toFixed(1))
            };
        } else{
            output.homePP = {
                goals,
                attempts,
                pct: Number((goals / attempts * 100).toFixed(1))
            };
        }
    });

    output.visitorPK = {
        kills: (output.homePP.attempts - output.homePP.goals),
        attempts: output.homePP.attempts,
        pct: Number(((output.homePP.attempts - output.homePP.goals) / output.homePP.attempts * 100).toFixed(1))
    };

    output.homePK = {
        kills: (output.visitorPP.attempts - output.visitorPP.goals),
        attempts: output.visitorPP.attempts,
        pct: Number(((output.visitorPP.attempts - output.visitorPP.goals) / output.visitorPP.attempts * 100).toFixed(1))
    };

    return output;
}


const getTeamGoalsByPeriod = data => {
    let output = {}

    $(data).find(".STHSGame_GoalsTable").find('.STHSGame_GoalsTeamName').each((index, el) => {
        let periodGoals = {};

        $(el).nextUntil( ".STHSGame_GoalsTotal" ).each((index, el) => {
            const periodNumber = parseInt(el.className.replace('STHSGame_GoalsPeriod', ''));
            const periodText = `period${periodNumber}`;
            const goals = parseInt(el.textContent);


            periodGoals[periodText] = {
                period: periodNumber,
                goals
            }
        });

        periodGoals.total = Object.values(periodGoals).reduce((acc, item) => acc + item.goals, 0);

        // First is always visiting team
        if(index === 0){
            output.visitorGoals = periodGoals;
        } else{
            output.homeGoals = periodGoals;
        }
    });

    return output;
}

const getTeamShotsByPeriod = data => {
    let output = {}

    $(data).find(".STHSGame_ShotsTable").find('.STHSGame_GoalsTeamName').each((index, el) => {
        let periodShots = {};

        $(el).nextUntil( ".STHSGame_ShotsTotal" ).each((index, el) => {
            const periodNumber = parseInt(el.className.replace('STHSGame_ShotsPeriod', ''));
            const periodText = `period${periodNumber}`;
            const shots = parseInt(el.textContent);


            periodShots[periodText] = {
                period: periodNumber,
                shots
            }
        });

        periodShots.total = Object.values(periodShots).reduce((acc, item) => acc + item.shots, 0);

        // First is always visiting team
        if(index === 0){
            output.visitorShots = periodShots;
        } else{
            output.homeShots = periodShots;
        }
    });

    return output;
}

const getDate = data => {
    const string = $(data).closest(".STHSGame_NowTime").text();
    let date = string.split(' -  ')[1]
    
    return date.split(' at ')[0]; 
}

const getGameOfficials = data => {
    const string = newLineToSpace($(data).closest(".STHSGame_Official").text());
    let [junk, referees, linesman ] = string.split(' : ');
    
    referees = referees.split(' and ');
    referees[1] = referees[1].replace(' Linesman', '');

    linesman = linesman.split(' and ');
    linesman[1] = linesman[1].trim();
    
    return {
        referees,
        linesman
    }
}

const getThreeStars = data => {
    const string = removeNewLine($(data).closest(".STHSGame_3Star").text());
    let arr = string.split(' - ');
    arr.shift();

    return arr.map(str => {
        const [player] = str.split(' (');
        return findPlayer(player);
    });
}

const getVenueInfo = data => {
    let arr = $(data).closest(".STHSGame_FinanceTitle").nextUntilWithTextNodes(".STHSGame_TeamLine").map((index, node) => {

        let isValid = true;

        if(node.nodeName === "BR"){ isValid = false }

        node.textContent = removeNewLine(node.textContent)

        if(node.textContent === ""){ isValid = false; }

        if(isValid){
            return node;
        }
    });

    // Lucky the output is always the same... should always be a 10 item array
    // First five are attendance and income by section
    let sections = arr.splice(0, 5).map(node => node.textContent);
    
    // Next is Rink
    let rink = arr.splice(0, 1).map(node => node.innerText)[0];

    // Then total attendance
    let totalAttendance = arr.splice(0, 1).map(node => node.textContent)[0];

    // Income breakdown
    let income = arr.splice(0, 2).map(node => node.textContent);

    // Total Income
    let totalIncome = arr.splice(0, 1).map(node => node.innerText)[0];

    // Map Everything
    sections = mapSectionData(sections);
    totalAttendance = mapAttendance(totalAttendance);
    income = mapIncome(income);
    totalIncome = getIncomeAmount(totalIncome);

    return {
        rink: rink.replace('Game was played at the ', '').replace('.', ''),
        sections,
        income,
        totals: {
            attendance: totalAttendance,
            income: totalIncome
        }
    }
}

const mapSectionData = data => {

    // Level 1 -- Attendance: 5676 (91.40%) -- Ticket Income $930,864
    return data.map(level => {
        let [name, attendance, income] = level.split(' -- ');

        // Format income.. Ticket Income $930,864
        income = parseInt(income.split(' $')[1].replace(',',''));

        // Format attendance.. Attendance: 5676 (91.40%)
        attendance = mapAttendance(attendance);

        return {
            name,
            income,
            attendance
        }
    })
}

// Attendance: 5676 (91.40%) OR Total Attendance: 17277 (92.74%)
const mapAttendance = attendance => {
    let formattedStr = attendance.replace('Total ', '');
    let [ trash, amount, pct ] = formattedStr.split(' ');

    return {
        amount: parseInt(amount),
        pct: parseFloat(betweenParenthesis(pct).replace('%', ''))
    }
}

const mapIncome = data => {
    // Total Ticket Income: $2,140,875
    // Other Income:  $214,088
    return data.map((income, i) => {
        let name = i === 0 ? 'Ticket' : 'Other';
        let amount = getIncomeAmount(income);
        
        return {
            name,
            amount
        }
    })
}

const getIncomeAmount = str => currencyToFloat(str.replace(/ +(?= )/g,'').split(': $')[1]);
const currencyToFloat = str => parseInt(str.replace('$', '').replace(/\,/g,''));
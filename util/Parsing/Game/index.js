import { findTeamByNickname } from 'util/Teams';
import { removeNewLine, betweenParenthesis } from 'util/Parsing/helpers';

export const getGameInfo = data => {
    // Get Teams and Data
    const teams = getTeamInfo(data);

    // Get Rink and Attendance
    const venueInfo = getVenueInfo(data);
    debugger; 

    // Get Refs

    // Get Three Stars

    // Get Date

    return {

    }
}


const getTeamInfo = data => {
    const string = removeNewLine($(data).closest(".STHSGame_Result").text());
    let [ visitor, home ] = string.split(' vs ');

    // Find them
    visitor = findTeamByNickname(visitor);
    home = findTeamByNickname(home);

    return {
        [home.key] : {
            ...home,
            isHome: true
        },
        [visitor.key] : {
            ...visitor
        }
    }
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
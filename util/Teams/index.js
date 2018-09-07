export const findTeamByNickname = team => {
    const abbr = nicknameToAbbr(team);
    return abbrToTeam(abbr);
}

export const findTeamByAbbr = team => {
    const abbr = team.replace(' ', '').toLowerCase();
    return abbrToTeam(abbr);
}

export const nicknameToAbbr = nickname => {
    const formatted = nickname.replace(' ', '').toLowerCase();
    return nicknames[formatted];
}

const abbrToTeam = abbr => ({
	...teams[abbr],
	key: abbr
})

// Nickname Mapping
const nicknames = {
    ducks : 'ana',
    coyotes : 'arz',
    bruins : 'bos',
    sabres : 'buf',
    flames : 'cgy',
    hurricanes : 'car',
    blackhawks : 'chi',
    avalanche : 'col',
    bluejackets : 'cbj',
    stars : 'dal',
    redwings : 'det',
    oilers : 'edm',
    panthers : 'fla',
    kings : 'lak',
    wild : 'min',
    canadiens : 'mtl',
    predators : 'nsh',
    devils : 'njd',
    islanders : 'nyi',
    rangers : 'nyr',
    senators : 'ott',
    flyers : 'phi',
    penguins : 'pit',
    sharks : 'sjs',
    blues : 'stl',
    lightning : 'tbl',
    mapleleafs : 'tor',
    canucks : 'van',
    goldenknights : 'vgk',
    capitals : 'wsh',
    jets : 'wpg',
}

// All Team info
const teams = {
	ana: {
		id: 24,
		name: "Anaheim Ducks"
	},
	arz: {
		id: 53,
		name: "Arizona Coyotes"
	},
	bos: {
		id: 6,
		name: "Boston Bruins"
	},
	buf: {
		id: 7,
		name: "Buffalo Sabres"
	},
	cgy: {
		id: 20,
		name: "Calgary Flames"
	},
	car: {
		id: 12,
		name: "Carolina Hurricanes"
	},
	chi: {
		id: 16,
		name: "Chicago Blackhawks"
	},
	col: {
		id: 21,
		name: "Colorado Avalanche"
	},
	cbj: {
		id: 29,
		name: "Columbus Blue Jackets"
	},
	dal: {
		id: 25,
		name: "Dallas Stars"
	},
	det: {
		id: 17,
		name: "Detroit Red Wings"
	},
	edm: {
		id: 22,
		name: "Edmonton Oilers"
	},
	fla: {
		id: 13,
		name: "Florida Panthers"
	},
	lak: {
		id: 26,
		name: "Los Angeles Kings"
	},
	min: {
		id: 30,
		name: "Minnesota Wild"
	},
	mtl: {
		id: 8,
		name: "Montréal Canadiens"
	},
	nsh: {
		id: 18,
		name: "Nashville Predators"
	},
	njd: {
		id: 1,
		name: "New Jersey Devils"
	},
	nyi: {
		id: 2,
		name: "New York Islanders"
	},
	nyr: {
		id: 3,
		name: "New York Rangers"
	},
	ott: {
		id: 9,
		name: "Ottawa Senators"
	},
	phi: {
		id: 4,
		name: "Philadelphia Flyers"
	},
	pit: {
		id: 5,
		name: "Pittsburgh Penguins"
	},
	sjs: {
		id: 28,
		name: "San Jose Sharks"
	},
	stl: {
		id: 19,
		name: "St. Louis Blues"
	},
	tbl: {
		id: 14,
		name: "Tampa Bay Lightning"
	},
	tor: {
		id: 10,
		name: "Toronto Maple Leafs"
	},
	van: {
		id: 23,
		name: "Vancouver Canucks"
	},
	vgk: {
		id: 54,
		name: "Vegas Golden Knights"
	},
	wsh: {
		id: 15,
		name: "Washington Capitals"
	},
	wpg: {
		id: 52,
		name: "Winnipeg Jets"
	}
};
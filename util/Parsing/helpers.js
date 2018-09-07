export const removeNewLine = str => str.replace(/\n/g, '');

export const betweenParenthesis = str => paranthesisRegex.exec(str)[1];


const paranthesisRegex = /\(([^)]+)\)/;
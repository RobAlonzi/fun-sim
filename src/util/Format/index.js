export const formatCurrency = number => {
    return `$${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

export function formatTime(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
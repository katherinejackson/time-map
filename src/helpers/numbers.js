export const formatNumbers = (num) => {
    if (num >= 1000000000) {
        return `${Math.floor(num/1000000000)} B`
    } else if (num >= 1000000) {
        return `${Math.floor(num/1000000)} M`
    } else {
        return `${Math.floor(num/1000)} K`
    }
}

export const formatTradeNumbers = (num) => {
    if (num >= 1000000) {
        return `${Math.floor(num/1000000)} B`
    } else if (num >= 1000) {
        return `${Math.floor(num/1000)} M`
    } else {
        return `${num} K`
    }
}
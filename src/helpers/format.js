export const formatNumbers = (num) => {
    if (num >= 1000000000) {
        return `${Math.floor(num/1000000000)} B`
    } else if (num >= 1000000) {
        return `${Math.floor(num/1000000)} M`
    } else if (num >= 1000) {
        return `${Math.floor(num/1000)} K`
    } else {
        return num
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

export const formatNames = (names) => {
    if (names.length === 1) {
        return names[0]
    } else if (names.length === 2) {
        return `${names[0]} and ${names[1]}`
    } else if (names.length === 3) {
        return `${names[0]}, ${names[1]} and ${names[2]}`
    } else {
        return `${names[0]}, ${names[1]} and ${names.length - 2} more`
    }
}
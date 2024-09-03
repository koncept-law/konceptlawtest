export const numberConvertion = (value) => {
    // Convert value to a number if it's a string
    const num = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(num)) return value; // Return the original value if it's not a number

    if (num < 1000) return num.toString(); // Return the number as is if less than 1000

    if (num >= 1000 && num < 1000000) {
        return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
    }

    if (num >= 1000000 && num < 1000000000) {
        return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
    }

    if (num >= 1000000000 && num < 1000000000000) {
        return (num / 1000000000).toFixed(num % 1000000000 === 0 ? 0 : 1) + "B";
    }

    if (num >= 1000000000000) {
        return (num / 1000000000000).toFixed(num % 1000000000000 === 0 ? 0 : 1) + "T";
    }

    return value; // Default return in case the number doesn't fit any condition
};

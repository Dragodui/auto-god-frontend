export const generateMapsLink = (location: string) => {
    return `https://www.google.com/maps?q=${location.replace(' ', '')}`
}
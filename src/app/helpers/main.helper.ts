export class MainHelper {
    /**
     * @static GetRandomNumber
     * @param {number} length
     * @returns {string}
     */
    static GetRandomNumber = (length: number = 4): number => {
        return Math.floor((Math.random() * Math.pow(10, length)) + Math.pow(9, length - 1));
    };
}

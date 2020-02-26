export class MainHelper {
    /**
     * @static GetRandomNumber
     * @param {number} length
     * @returns {string}
     */
    static GetRandomNumber = (length: number = 4): number => {
        if (length === 1) {
            return Math.floor((Math.random() * 9) + 1);
        }

        return Math.floor((Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1))) + Math.pow(10, length - 1));
    };
}

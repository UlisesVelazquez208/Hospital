/**
 * Format Date to readable format.
 */
class DateFormatter {

    /**
     * Constructor.
     */
    constructor() {
        this.date = '';
    }

    /**
     * Setter method.
     *
     * @param prop
     * @param value
     */
    set(value) {
        this.date = value;
        return this;
    }

    /**
     * Getter method.
     * @param prop
     * @returns {*}
     */
    get(prop){
        return this[prop];
    }

    /**
     * Format Date.
     *
     * @param date
     * @returns {*}
     */
    format() {
        this.date = new Date(this.date);

        let date = [this.date.getFullYear(),parseInt(this.date.getMonth()) + 1, this.date.getDate()]

        return date.join('/');
    }

};

export default DateFormatter;

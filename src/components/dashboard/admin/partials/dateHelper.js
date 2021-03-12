class dateHelper {

    getMonthStartDate() {
        var today = new Date();
        return today.getFullYear() + '-' + (parseInt(today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()) + 1) + '-01';
    }

    getMonthEndDate() {
        var today = new Date();
        return today.getFullYear() + '-' + (parseInt(today.getMonth() < 10 ? '0' + today.getMonth() : today.getMonth()) + 1) + '-30';
    }

}

export default dateHelper;



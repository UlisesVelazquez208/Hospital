<template>
    <vue-monthly-picker class="date-picker-container"
                        v-model="selectedMonth"
                        :monthLabels="locale"
                        @selected="handleSelect"
                        :dateFormat="format"
                        :clearOption=false
                        alignment="center"
    ></vue-monthly-picker>
</template>

<script>

    import VueMonthlyPicker from 'vue-monthly-picker'
    import moment from 'moment';

    export default {
        name: "date-filter",
        props: {
            name: {
                type: String,
                required: true,
            },
            value: {
                type: Date,
                default: function () {
                    return new Date();
                },
            }
        },
        components: {
            VueMonthlyPicker
        },
        data: function () {
            return {
                format: 'MMMM, YYYY',
                selectedMonth: moment(),
                locale: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            };
        },
        methods: {
            handleSelect(value) {

                let
                    format = 'YYYY-MM-DD',
                    date = new Date(value.format(format)),
                    y = date.getFullYear(),
                    m = date.getMonth(),
                    firstDay = new Date(y, m, 1),
                    lastDay = new Date(y, m + 1, 0);

                firstDay = moment(firstDay).format(format);
                lastDay = moment(lastDay).format(format);

                this.$eventBus.$emit('widgets-date-picker-update', {
                    name: this.name,
                    date: value,
                    first_day: firstDay,
                    last_day: lastDay
                });
            },
        }
    }
</script>

<style>
    .month-year-display {
        width: 10rem !important;
        float: right;
        background: #0082c9 !important;
        text-align: center !important;
        padding: 10px !important;
        color: #fff !important;
        border-radius: 5px !important;
    }

    .vue-monthly-picker .date-popover {
        max-width: 200px !important;
        left: auto !important;
        right: -8rem !important;
        top: 30px !important;
    }
    .vue-monthly-picker .month-picker-wrapper {
        width:auto !important;
    }
</style>

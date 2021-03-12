<template>
    <component-container-white title="FAQs created by Category" :date-picker="true" date-picker-name="faqCreatedByCategory">

        <error-message v-if="error" :error="errorMessage"/>

        <empty-message v-else-if="empty" :message="emptyMessage"/>

        <loading-spinner v-else-if="!bar.series.length" :is-loading="!bar.series.length"/>

        <div v-else style="height: 350px;">
            <IEcharts :option="bar" :loading="loading"></IEcharts>
        </div>

    </component-container-white>
</template>

<script>
    import ComponentContainer from "../../../pages/componentContainer";
    import ErrorMessage from "../../frontLiner/partials/error-message";
    import EmptyMessage from "../../frontLiner/partials/empty-message";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import IEcharts from 'vue-echarts-v3/src/lite.js';
    import 'echarts/lib/chart/bar';
    import moment from 'moment';
    import ComponentContainerWhite from "../../../pages/componentContainerWhite";

    export default {
        name: "faqs-created-by-category",
        components: {ComponentContainerWhite, LoadingSpinner, EmptyMessage, ErrorMessage, ComponentContainer, IEcharts},
        data() {
            return {
                empty: false,
                emptyMessage: 'No data found!',
                error: false,
                errorMessage: 'Something went wrong please try again later!',
                loading: false,
                bar: {
                    grid: {
                        top: 25,
                        bottom: 40,
                        right: '7%',
                    },
                    xAxis: {
                        data: [],
                        axisLabel: {
                            inside: false,
                            textStyle: {
                                color: '#000',
                                fontSize: 10,
                            },
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            show: false
                        },
                        z: 10
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#999'
                            }
                        }
                    },
                    series: []
                },
            }
        },
        created: function () {
            let date = new Date(),
                format = 'YYYY-MM-DD',
                y = date.getFullYear(),
                m = date.getMonth(),
                firstDay = new Date(y, m, 1),
                lastDay = new Date(y, m + 1, 0);

            firstDay = moment(firstDay).format(format);
            lastDay = moment(lastDay).format(format);

            this.getData({
                first_day: firstDay,
                last_day: lastDay
            });
            this.listen();
        },
        methods: {
            listen: function () {
                this.$eventBus.$on('widgets-date-picker-update', this.updateDate);
            },
            updateDate: function (data) {
                switch (data.name) {
                    case 'faqCreatedByCategory':
                        this.getData(data);
                        break;
                }
            },
            getData: function (date) {

                let url = '/api/service-category/faqs-count';

                this.bar.series = [];
                this.bar.xAxis.data = [];
                this.empty = false;
                this.error = false;

                if (date) {
                    url += '?start_date=' + date.first_day + '&end_date=' + date.last_day;
                }

                this.$apis.createEntity({name: url});

                this.$apis.endpoints.getAll().then(this.success).catch(this.failure);
            },
            success: function ({data}) {

                let labels = [], series = [];

                if (!data.length) {
                    this.empty = true;
                    return;
                }

                for (let row of data) {
                    if (row.no_of_faqs) {
                        labels.push(row.name);
                        series.push(row.no_of_faqs);
                    }
                }

                if(!series.length){
                    this.empty = true;
                    return true;
                }

                this.bar.xAxis.data = labels;

                this.bar.series.push({
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#64b7e3'
                        }
                    },
                    barWidth: 20,
                    data: series
                });

                this.$forceUpdate();
            },
            failure: function (e) {
                this.error = true;
                console.log(e);
            }
        },
    }
</script>

<style scoped>

</style>

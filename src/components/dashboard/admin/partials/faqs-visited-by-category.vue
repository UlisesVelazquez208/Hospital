<template>
    <component-container-white title="FAQs visited by category" :date-picker="true" date-picker-name="faqVisitedByCategory">

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
    import ComponentContainerWhite from "../../../pages/componentContainerWhite";

    export default {
        name: "faqs-visited-by-category",
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
                                color: '#999',
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
                    case 'faqVisitedByCategory':
                        this.getData(data);
                        break;
                }
            },
            getData: function (date) {

                let url = '/api/service-category/faq-views';

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

                //  data = JSON.parse('[{"id":106,"name":"meme","parent_id":null,"icon":"fa-ambulance","created_by":2,"created_at":"2018-07-05 07:57:11","updated_at":"2018-07-05 07:57:11","deleted_at":null,"views":30},{"id":108,"name":"test cat1","parent_id":null,"icon":"fa-address-book","created_by":2,"created_at":"2018-07-05 07:57:22","updated_at":"2018-07-05 07:58:47","deleted_at":null,"views":18},{"id":111,"name":"temp","parent_id":null,"icon":"fa-american-sign-language-interpreting","created_by":2,"created_at":"2018-07-05 08:24:58","updated_at":"2018-07-05 12:11:56","deleted_at":null,"views":5},{"id":122,"name":"Assistance","parent_id":null,"icon":"fa-font","created_by":2,"created_at":"2018-07-09 14:16:20","updated_at":"2018-07-09 14:16:20","deleted_at":null,"views":12},{"id":126,"name":"Education","parent_id":null,"icon":"fa-graduation-cap","created_by":2,"created_at":"2018-07-09 14:22:01","updated_at":"2018-07-09 14:22:01","deleted_at":null,"views":5},{"id":135,"name":"Health","parent_id":null,"icon":"fa-user-md","created_by":2,"created_at":"2018-07-09 14:27:03","updated_at":"2018-07-09 14:27:03","deleted_at":null,"views":11}]');

                let labels = [], series = [];

                if (!data.length) {
                    this.empty = true;
                    return;
                }

                for (let row of data) {
                    if(row.views > 0){
                        labels.push(row.name);
                        series.push(row.views);
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

<template>
    <component-container-white title="Public vs Private FAQs">

        <error-message v-if="error" :error="errorMessage"/>

        <empty-message v-else-if="empty" :message="emptyMessage"/>

        <loading-spinner v-else-if="!ajaxpie.legend.data.length" :is-loading="!ajaxpie.legend.data.length"/>

        <div v-else style="height: 250px">
            <IEcharts :option="ajaxpie"></IEcharts>
        </div>


    </component-container-white>
</template>
<script>
    // import VueChartist from 'v-chartist';
    import ComponentContainer from "../../../pages/componentContainer";
    import ErrorMessage from "../../frontLiner/partials/error-message";
    import EmptyMessage from "../../frontLiner/partials/empty-message";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import IEcharts from 'vue-echarts-v3/src/lite.js';
    import 'echarts/lib/chart/pie';
    import ComponentContainerWhite from "../../../pages/componentContainerWhite";

    export default {
        name: "public-vs-private",
        components: {
            ComponentContainerWhite,
            LoadingSpinner,
            EmptyMessage,
            ErrorMessage,
            ComponentContainer,
            IEcharts
        },
        mounted: function () {
            this.getData();
        },
        data() {
            return {
                groups:{
                    UNHCR_STAFF:'STAFF',
                    PARTNERS:'PARTNERS',
                    PUBLIC:'PUBLIC',
                },
                empty: false,
                emptyMessage: 'No data found!',
                error: false,
                errorMessage: 'Something went wrong please try again later!',
                ajaxpie: {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: '10',
                        data: [],
                        color: [
                            '#00ff00', '#2fa3e2', '#d4ab6e', '#5c5c40'
                        ]
                    },
                    series: [{
                        name: 'Source',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        center: ['50%', '50%'],
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                },
                            },
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data: [],
                        color: [
                            '#f3975b', '#2fa3e2', '#d4ab6e', '#5c5c40'
                        ]
                    }]
                }
            }
        },
        methods: {
            getData: function () {

                let url = '/api/faq/by-visibility';

                this.data = [];
                this.empty = false;
                this.error = false;

                this.$apis.createEntity({name: url});
                return this.$apis.endpoints.getAll().then(this.success).catch(this.failure);

            },
            success: function ({data}) {
                // console.log(this.groups);
                this.ajaxpie.series[0].data = data.map((row) => {
                    // console.log(Object.keys(this.groups), this.groups[row.visibility_group]);
                    var theGroup = this.groups[row.visibility_group];
                    // var visiblityOption = Object.keys(this.groups).map(function(key) {
                    //     return row.key;
                    // })
                    // console.log(visiblityOption);
                    return {
                        name: theGroup + ' (' + row.percentage +'%)',
                        value: row.percentage
                    };
                });

                for (let row of data) {
                    this.ajaxpie.legend.data.push(row.visibility_group + ' </br>' + row.percentage + '%');
                }
            },
            failure: function (e) {
                console.log(e);
                this.error = true;
            }
        },

    }
</script>
<style src="chartist/dist/chartist.css"></style>
<style scoped>
    .container {
        height: 250px;
    }
</style>


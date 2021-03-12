<template>
    <component-container-white title="Top 5 FAQs viewed" class="top-faq-viewed" :date-picker="true"
                         date-picker-name="topFaqViewDate">
        <error-message v-if="topFaqViewedError" :error="topFaqViewedErrorMessage"/>

        <empty-message v-else-if="topFaqViewedEmpty" :message="topFaqViewedEmptyMessage"/>

        <loading-spinner v-else-if="!topFaqViewed.length" :is-loading="!topFaqViewed.length"></loading-spinner>

        <template v-else>
            <top-faq-view-row v-for="(faq, index) in topFaqViewed" :faq="faq" :max-views="topFaqMaxView"
                              :key="index"></top-faq-view-row>
        </template>
    </component-container-white>
</template>

<script>
    import componentContainer from '../../../pages/componentContainer.vue'
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import ErrorMessage from "./error-message";
    import EmptyMessage from "./empty-message";
    import TopFaqViewRow from "./top-faq-view-row";
    import ComponentContainerWhite from "../../../pages/componentContainerWhite";

    export default {
        name: "top-faq-viewed",
        data: function () {
            return {
                topFaqViewed: [],
                topFaqMaxView: 0,
                topFaqViewedEmpty: false,
                topFaqViewedEmptyMessage: 'No data found',
                topFaqViewedError: false,
                topFaqViewedErrorMessage: 'Something went wrong please try again later!',
            }
        },
        components: {
            ComponentContainerWhite,
            TopFaqViewRow,
            EmptyMessage,
            ErrorMessage,
            LoadingSpinner,
            componentContainer
        },
        created: function () {
            this.getTopFaqViewed();
            this.listen();
        },
        methods: {
            listen: function () {
                this.$eventBus.$on('widgets-date-picker-update', this.updateDate);
            },
            updateDate: function (data) {
                switch (data.name) {
                    case 'topFaqViewDate':
                        this.getTopFaqViewed(data);
                        break;
                }
            },
            getTopFaqViewed: function (date) {

                let url = '/api/faq/trending?with[]=serviceCategories';

                this.topFaqViewed = [];
                this.topFaqViewedEmpty = false;
                this.topFaqViewedError = false;

                if (date) {
                    url += '&start_date=' + date.first_day + '&end_date=' + date.last_day;
                }

                this.$apis.createEntity({name: url});

                return this.$apis.endpoints.getAll().then(this.getTopFaqViewedSuccess).catch(this.getTopFaqViewedFailure);
            },
            getTopFaqViewedSuccess: function ({data}) {

                let maxValue = 0;

                this.topFaqViewed = data.map(function (faq) {
                    if (parseInt(faq.views) > parseInt(maxValue)) {
                        maxValue = faq.views;
                    }

                    return faq;
                });

                this.topFaqMaxView = maxValue;

                if (!this.topFaqViewed.length) {
                    this.topFaqViewedEmpty = true;
                }

                this.$forceUpdate();
            },
            getTopFaqViewedFailure: function (e) {
                this.topFaqViewedError = true;
            },
        }
    }
</script>

<style scoped>
    .card-text-error {
        text-align: center;
        font-size: 14px;
        color: #712b21
    }

    .custom-style {
        margin-bottom: 50px;
    }
</style>

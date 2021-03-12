<template>
    <component-container title="Dashboard" icon="fa-pie-chart">
        <b-row>
            <b-col cols="12">
                <top-faq-viewed/>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="7" md="12" sm="12" cols="12" class="mb-3">
                <top-searched-hash-tags style="max-height: 400px;"/>
            </b-col>
            <b-col lg="5" md="12" sm="12" cols="12" class="text-left public-vs-private-chart donut-chart">
                <public-vs-private style="max-height: 400px;" class="chart-holder"/>
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="6" md="12" sm="12" cols="12" class="mb-3">
                <faqs-created-by-category/>
            </b-col>
            <b-col lg="6" md="12" sm="12" cols="12">
                <faqs-visited-by-category/>
            </b-col>
        </b-row>

    </component-container>
</template>

<script>
    import topFaqViewed from "./partials/top-faq-viewed";
    import TopSearchedHashTags from "./partials/top-searched-hash-tags";
    import PublicVsPrivate from "./partials/public-vs-private";
    import FaqsVisitedByCategory from "./partials/faqs-visited-by-category";
    import FaqsCreatedByCategory from "./partials/faqs-created-by-category";
    import ComponentContainer from "../../pages/componentContainer";

    export default {
        name: "front-liner-dashboard",
        components: {
            ComponentContainer,
            FaqsCreatedByCategory,
            FaqsVisitedByCategory,
            PublicVsPrivate,
            TopSearchedHashTags,
            topFaqViewed,
        },
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-admin-dashboard');
        }
    }
</script>

<style scoped>
    .row {
        margin-bottom: 30px;
    }
</style>

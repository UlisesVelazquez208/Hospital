<template>
    <component-container title="Home.TrendingFAQs" class="trending-faqs">

        <error-message v-if="errors.trendingFaqs" :error="errors.trendingFaqs"/>

        <empty-message v-else-if="trendingFaqsEmpty" :message="trendingFaqsEmptyMessage"/>

        <loading-spinner v-else-if="!faqs.length" :is-loading="!faqs.length"></loading-spinner>

        <faq-card v-else v-for="(faq, index) in faqs" :showAnswer="false" :faq="faq" :key="index"/>

    </component-container>
</template>

<script>
    import componentContainer from '../../../pages/componentContainer.vue'
    import FaqCard from "./faqCard";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import ErrorMessage from "./error-message";
    import EmptyMessage from "./empty-message";

    export default {
        components: {
            EmptyMessage,
            ErrorMessage,
            LoadingSpinner,
            FaqCard,
            componentContainer,
        },
        props: {
            faqs: {
                type: Array,
                required: true
            },
            errors: {
                type: Object,
                default: {}
            },
            trendingFaqsEmpty: {
                type: Boolean,
                default: false
            },
            trendingFaqsEmptyMessage: {
                type: String,
                default: ''
            }
        },
        name: "trending-faqs"
    }
</script>

<style scoped>
    /* .trending-faqs {
        width: 31%;
        display: inline-block;
    } */
    .card-text-error{
        text-align: center;
        font-size: 14px;
        color: #712b21
    }
</style>

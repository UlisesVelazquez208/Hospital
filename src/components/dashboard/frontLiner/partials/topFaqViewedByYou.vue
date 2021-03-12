<template>
    <component-container title="Top FAQs viewed by you" class="faq-viewed-by-you">
        <error-message v-if="errors.topFaqViewedByYou" :error="errors.topFaqViewedByYou"/>

        <empty-message v-else-if="topFaqViewedByYouEmpty" :message="topFaqViewedByYouEmptyMessage"/>

        <loading-spinner v-else-if="!faqs.length" :is-loading="!faqs.length"></loading-spinner>

        <faq-card v-else v-for="(faq, index) in faqs"  :faq="faq" :key="index"/>
    </component-container>
</template>

<script>
    import componentContainer from '../../../pages/componentContainer.vue'
    import FaqCard from "./faqCard";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import ErrorMessage from "./error-message";
    import EmptyMessage from "./empty-message";
    export default {
        props: {
            faqs: {
                type: Array,
                required: true
            },
            errors: {
                type: Object,
                default: {}
            },
            topFaqViewedByYouEmpty: {
                type: Boolean,
                default: false
            },
            topFaqViewedByYouEmptyMessage: {
                type: String,
                default: ''
            }
        },
        components: {
            EmptyMessage,
            ErrorMessage,
            LoadingSpinner,
            FaqCard,
            componentContainer,
        },
        name: "top-faq-viewed-by-you"
    }
</script>

<style scoped>
    /* .faq-viewed-by-you{
        width: 67%;
        display:inline-block;
    } */
    .card-text-error{
        text-align: center;
        font-size: 14px;
        color: #712b21
    }
</style>

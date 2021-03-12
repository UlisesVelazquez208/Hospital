<template>
    <component-container title="Home.LatestMedia" class="latest-media">

        <error-message v-if="errors.trendingFaqs" :error="errors.trendingFaqs"/>

        <empty-message v-else-if="latestMediaEmpty" :message="latestMediaEmptyMessage"/>

        <loading-spinner v-else-if="!media.length" :is-loading="!media.length"></loading-spinner>

        <media-card v-else v-for="(mediaItem, index) in media" :media="mediaItem" :key="index"/>

    </component-container>
</template>

<script>
    import componentContainer from '../../../pages/componentContainer.vue'
    import MediaCard from "./mediaCard";
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import ErrorMessage from "./error-message";
    import EmptyMessage from "./empty-message";

    export default {
        components: {
            EmptyMessage,
            ErrorMessage,
            LoadingSpinner,
            MediaCard,
            componentContainer,
        },
        props: {
            media: {
                type: Array,
                required: true
            },
            errors: {
                type: Object,
                default: {}
            },
            latestMediaEmpty: {
                type: Boolean,
                default: false
            },
            latestMediaEmptyMessage: {
                type: String,
                default: ''
            }
        },
        name: "latest-media"
    }
</script>

<style scoped>
    .card-text-error{
        text-align: center;
        font-size: 14px;
        color: #712b21
    }
</style>

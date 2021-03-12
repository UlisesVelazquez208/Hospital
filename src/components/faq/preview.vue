<template>
    <!--<div class="component-container">-->

    <component-container title="FAQ.Preview">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <!-- Add FAQ Main Details -->
        <show-faq :faqModel="componentData" :showComment=false></show-faq>

        <show-translations :languageContents="componentData.translations" v-if="componentData.translations.length > 0"></show-translations>
        <!-- Directory -->
        <show-directory :faqModel="componentData" :showModal=false :showComment=false></show-directory>

        <!--Media Content-->
        <show-media-content :faqModel="componentData" :showComment=false></show-media-content>

        <!--Hashtags-->
        <show-hashtag :faqModel="componentData" :showComment=false></show-hashtag>

        <!--Social media-->
        <show-social-media :faqModel="componentData" :showComment=false></show-social-media>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue"
    import env from "../../envs/Env-develop"
    import coreFormClass from "../core/form/script";
    import componentContainer from '../pages/componentContainer.vue'
    import showFAQ from './partials/showFAQ.vue'
    import showDirectory from './partials/showDirectory.vue'
    import showHashtag from './partials/showHashtags.vue'
    import showMediaContent from './partials/showMediaContent.vue'
    import showSocialMedia from './partials/showSocialMedia.vue'
    import showFAQTranslation from './partials/showFAQTranslation';
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    import LoadingButton from '../spinner/loading-button.vue'
    import LoadingSpinner from "../spinner/loading-spinner";

    var faqPreview = {
        // ===Component name
        name: "preview-faq",
        // ===Props passed to component
        props: {
        componentData:{
            type:Object,
            required:true
        },
        isModal:{
            type:Boolean,
            required:true,
            default:true
        }
        },
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            "show-faq": showFAQ,
            "show-directory": showDirectory,
            "show-hashtag": showHashtag,
            "show-media-content": showMediaContent,
            "show-social-media": showSocialMedia,
            'ClipLoader': ClipLoader,
            'loading-button': LoadingButton,
            "show-translations": showFAQTranslation
        },
        // ===component Data properties
        data() {
            return {
                languageContents:[],
                theLanguages:[],
                loadingSpinner: false,
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
        },
        // ===Computed properties for the component
        created: function () {
        },

        // ===Component methods
        methods: {
            getModule() {
                return "faq";
            },
        }
    };

    export default faqPreview;
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
    .white-section_details {
        padding: 25px 0 35px;

    }

    .faq-submit {
        font-size: 20px;
        padding: 10px 50px;
        background-color: #0072BC;
        border-color: #0072BC !important;
    }

    .faq-draft {
        font-size: 20px;
        padding: 10px 74px !important;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
    }
    .btn-nav {
        padding:10px 30px !important;
    }
</style>

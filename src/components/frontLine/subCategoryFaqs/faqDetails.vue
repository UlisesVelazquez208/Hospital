<template>
    <div class="faq-per-category-details-container" style="height: 100%">
        <div v-if="faqBusy" class="no-faq-container">
            <div class="loading-class-container">
                <loading-spinner :is-loading="faqBusy"></loading-spinner>
            </div>
        </div>

        <div v-else-if="!singlefaq" class="no-faq-container">
            <div class="text-center no-faq">
                <h2>{{ $t('Search.ChooseQuestion') }}</h2>
            </div>
        </div>

        <div v-else-if="singlefaq">
            <b-tabs>
                <b-tab title="General info" class="general-info">
                    <faq-info :faq="singlefaq"></faq-info>
                    <faq-directories :faq="singlefaq"></faq-directories>
                    <faq-tags :faq="singlefaq"></faq-tags>
                    <faq-social-media :faq="singlefaq"></faq-social-media>
                </b-tab>

                <b-tab title="Related Content" class="related-content" @click="onClickMediaContentTab">
                    <poster-media-content-box :posters="posterMedia"></poster-media-content-box>
                    <video-media-content-box :videos="videoMedia"></video-media-content-box>
                    <audio-media-content-box :audios="audioMedia"></audio-media-content-box>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
    import VideoMediaContent from "../partials/VideoMediaContentBox.vue"
    import AudioMediaContent from "../partials/AudioMediaContentBox.vue"
    import PosterMediaContent from "../partials/PosterMediaContentBox.vue"
    import AbstractGoogleMap from "../../widgets/google_map/abstract-google-map.vue"
    import FaqInfo from "../partials/faq-info";
    import FaqDirectories from "../partials/faq-directories";
    import FaqTags from "../partials/faq-tags";
    import FaqSocialMedia from "../partials/faq-social-media";
    import LoadingSpinner from "../../spinner/loading-spinner";
    // import {EventBus} from "./../../../eventbus/event-bus.js";

    export default {
        props: ["singlefaq", "faqBusy"],
        name: "faqs-details",
        components: {
            LoadingSpinner,
            FaqSocialMedia,
            FaqTags,
            FaqDirectories,
            FaqInfo,
            'video-media-content-box': VideoMediaContent,
            'audio-media-content-box': AudioMediaContent,
            'poster-media-content-box': PosterMediaContent,
            'abstract-google-map': AbstractGoogleMap,
        },
        data() {
            return {
                media: null,
                mediaTab: false,
            }
        },
        computed: {
            audioMedia() {
                return this.media == null ? [] : this.media.filter(media => media.content_type == "AUDIO");
            },
            videoMedia() {
                return this.media == null ? [] : this.media.filter(media => media.content_type == "VIDEO");
            },
            posterMedia() {
                return this.media == null ? [] : this.media.filter(media => ['POSTER', 'PDF'].includes(media.content_type));
            }
        },
        mounted() {
            // EventBus.$on('locale', this.localeUpdated);
        },
        beforeUpdate() {
            $(document).ready(function () {
                $('.VueCarousel-inner').each(function (index, element) {
                    $(element).find('VueCarousel-slide').slice(0, 4).addClass('VueCarousel-slide-active');
                    $(element).attr("style", "transform: translate(0px, 0px); transition: transform 0.5s ease; visibility: visible;");
                });
            });
        },
        methods: {
            onClickMediaContentTab: function () {
                this.mediaTab = true;
                this.media = this.singlefaq.media;
            },
            onHashTagClicked: function (hashTag) {

            },
       },
        watch: {
            singlefaq: function () {
                if (this.mediaTab && this.singlefaq) {
                    this.media = this.singlefaq.media;
                }
            }
        }
    }
</script>

<style type="text/css" lang="scss">
    .faq-per-category-details-container {
        .general-info-container {
            box-shadow: 2px 2px 15px 0px #ccc;
            border-radius: 4px;
            margin-bottom: 10px;
            background-color: #FAFAFA;

            .faq, .section-title {
                color: #0072BC;
                font-weight: bold;
                font-size: 16px;
                overflow-wrap: break-word;
                word-wrap: break-word;
            }
            .faq-answer {
                font-size: 14px;
                overflow-wrap: break-word;
                word-wrap: break-word;
                white-space: pre-line;

                ul {
                    list-style: inherit !important;
                }
            }
            .directory-title {

                font-weight: bold;
                font-size: 14px;
                margin-bottom: 15px;
            }
            .directory-details {
                ul {
                    list-style: none;
                    padding: 0;
                    li {

                        min-height: 150px;
                        padding: 15px 15px;
                        /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
                        margin: 15px 0;
                        position: relative;
                        .img-container {
                            .rounded {
                                border-radius: 0.8rem !important;
                            }
                            display: inline;
                            padding: 0;
                            img {
                                max-height: 120px;
                            }
                            @media (max-width: 620px) {
                                padding: 0 0 15px 15px;
                            }
                        }
                        .directory-contact-info {
                            /*margin-top: 36px;*/
                            .working-hours {
                                display: inline-block;
                                padding-left: 22px;
                                /*display: none;*/
                                &:first-of-type {
                                    padding-left: 0px;
                                    display: inline-block;

                                }
                                .day {
                                    // text-transform: capitalize;
                                }
                            }
                        }
                        .directory-info-container {
                            .address-location {
                                p {
                                    font-weight: bold;
                                }

                            }
                        }
                        p {
                            margin-bottom: 5px;
                            display: inline-block !important;
                        }
                        i {
                            width: 15px;
                        }
                        span {
                            /*font-weight: bold;*/
                            text-transform: capitalize;
                        }
                    }
                }

            }
            .map-location {
                /*i{*/
                /*padding-left: 0;*/
                /*}*/
            }
            .hashtag-details {
                .hashtags-list {
                    overflow: auto;
                    padding: 3px 15px;
                    margin: 0;

                    li {
                        display: inline;
                        float: left;
                    }
                }
                .hashtag-link {
                    display: block;
                    padding: 10px;
                    margin-right: 5px;
                    margin-bottom: 5px;
                    background-color: #E1EFF5;
                    border-radius: 4px;
                    color: #000;
                }
            }
            .sociallinks-details {
                .sociallink-list {
                    padding: 5px 0;
                    margin-bottom: 0;
                    margin-top: 0;
                    li {
                        padding: 8px 0;
                    }
                    .social-link {
                        /*display: block;*/
                        /*padding: 10px;*/
                        /*!*border: 1px solid red;*!*/
                        /*margin-right: 5px;*/
                        /*background-color: #E1EFF5;*/
                        border-radius: 4px;
                        color: #000;
                        /*font-weight: bold;*/
                        font-size: 14px;
                    }
                }
            }

        }
        .tabs .tab-content {
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 10px;
            background-color: #F3F3F3;

        }
        .nav-link {
            display: block;
            padding: 1rem 1.5rem;
            margin-right: 10px;
        }
        .nav-tabs .nav-link {
            font-size: 14px;
            color: #000;
            border-color: #ddd;
        }
        .nav-tabs .nav-link.active {
            background-color: #F3F3F3;
            border-color: #ddd #ddd #F3F3F3;
        }

        .no-faq-container {
            background-color: #F3F3F3;
            border: 1px solid #ddd;
            height: 100%;

            .no-faq {
                color: #0072BC;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            i {
                font-size: 120px;
            }
            h2 {
                font-size: 18px;
            }
        }

        .general-info, .related-content {
            padding: 15px 10px;
            height: calc(100vh - 174px);
            overflow-y: scroll;
        }
    }

    .VueCarousel-slide {
        // width: 25%;
    }

    .VueCarousel-inner {
        flex-basis: 25% !important;
    }

    .media-header {
        &.card {
            background-color: #FAFAFA;
        }
        .card-header {
            background-color: #0072BC;
            font-size: 18px;
            // border: none;
            // background-color: transparent;
        }
        .card-body {
            padding: 0.5rem;
        }
    }

    .loadingClass {
        position: relative;
        text-align: center;
        margin-top: 1%;
        margin-bottom: 5%;
        background: white;
        padding: 10px;
        height: auto;
        border: 1px solid #f7f7f7;
        border-radius: 10px;
    }

    .loading-class-container {
        padding-top: 20px;
        width: 90%;
        margin: 0 auto;
    }
</style>


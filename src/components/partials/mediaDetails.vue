<template>
    <div style="height: 100%">
        <div v-if="mediaBusy" class="no-faq-container">
            <div class="loading-class-container">
                <loading-spinner :is-loading="mediaBusy"></loading-spinner>
            </div>
        </div>

        <div v-else-if="!singleMedia" class="no-faq-container">
            <div class="text-center no-faq">
                <h2>{{ $t('Media.ChooseItem')}}</h2>
            </div>
        </div>

        <div v-else-if="singleMedia" class="faq-details-container">
            <b-tabs>

                <b-tab title="General info" class="general-info">
                    <div class="text-left p-4 widget_social_icons general-info-container ">
                        <div class="widget_social_inner1">
                            <h5 class="faq">{{singleMedia.title}}</h5>
                        </div>
                        <div class="service-categories" v-if="singleMedia.service_categories">
                            <span class="service__title">Service Categories: </span>{{ singleMedia.service_categories.map(a=>a.name).join(', ') }}
                        </div>
                        <div class="service-categories" v-if="singleMedia.nationalities">
                            <span class="service__title">Nationalities:</span> {{ singleMedia.nationalities.map(a=>a.country).join(', ') }}
                        </div>
                        <div class="service-categories" v-if="singleMedia.countries">
                            <span class="service__title">Countries:</span> {{ singleMedia.countries.map(a=>a.country).join(', ') }}
                        </div>
                        <div class="service-categories" v-if="singleMedia.content_type">
                            <span class="service__title">Content Type:</span> {{ singleMedia.content_type }}
                        </div>
                        <hr>
                        <div class="block__description" v-html="singleMedia.description"></div>
                        <hr>
                        <div v-if="videoMedia()">
                            <iframe :src="getMeta(singleMedia.meta, 'embed_url')" frameborder="0"
                                        class="iframe-video"></iframe>
                        </div>
                        <div v-if="audioMedia()">
                            <iframe
                                :src="getMeta(singleMedia.meta, 'embed_url') ? getMeta(singleMedia.meta, 'embed_url'):singleMedia.url" frameborder="0"
                                class="iframe-soundcloud"
                            ></iframe>
                        </div>
                        <div v-if="posterMedia()">
                            <carousel class="gap--top"
                                    :perPage="4"
                                    :loop="true"
                                    :mouseDrag="true"
                                    :paginationEnabled="false"
                                    navigationPrevLabel='<a href="#" style="display: block; position: relative; left: 25px; font-size: 20px;">❮</a>'
                                    navigationNextLabel='<a href="#" style="display: block; position: relative; right: 25px; font-size: 20px;">❯</a>'
                                    :navigationEnabled="false"
                            >
                                <slide @slideClick="setCurrentUrl(singleMedia.url)"
                                    v-b-modal.modal1
                                    :key="singleMedia.id" :data-index="singleMedia.id"
                                    style="padding-left:10px;">
                                    <b-card style="cursor: pointer" :footer="singleMedia.title">
                                        <div style="overflow:hidden; vertical-align: middle;text-align:center;">
                                            <b-card-img :src="singleMedia.url" :alt="singleMedia.title"></b-card-img>
                                        </div>
                                    </b-card>
                                </slide>
                            </carousel>
                        </div>
                        <div v-if="pdfMedia()">
                            <a :href="singleMedia.url" target="_blank" class="btn btn-secondary"> Click here to download</a>
                        </div>
                    </div>
                    <b-modal size="lg" :hide-header="true" centered :hide-footer="true" id="modal1" title="Bootstrap-Vue">
                        <div class="text-center custom-style">
                            <a :href="currentUrl" target="_blank">
                                <img :src="currentUrl" class="img-fluid"/>
                            </a>
                        </div>
                    </b-modal>
                </b-tab>

            </b-tabs>
        </div>


    </div>
</template>


<script>
import mediaDetails from './mediaDetails.js';
export default mediaDetails;

</script>


<style type="text/css" lang="scss">
    .img-lg{
        max-width:60%;
    }
    .gap--top .VueCarousel-wrapper{
        padding-top: 15px;
    }
    .service__title{
        font-weight: 700;
        margin-right: 5px;
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
    .faq-answer  ul{
        list-style:inherit !important;
    }
    .faq-details-container {
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
                                    text-transform: lowercase;
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

    .VueCarousel-slide {
        width: 25%;
        min-width: 150px;
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
    .card{
        &:hover{
            box-shadow: 1px 1px 15px -8px #8e8c8e;
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

    .general-info, .related-content {
        padding: 15px 10px;
    }
    .selected-list {
        margin-left: 13px;

        ul {
            list-style: none;
            padding: 0;
            margin: 20px 0px;
        }
        li {
            min-height: 150px;
            padding: 15px 15px;
            border: 1px solid #ccc;
            -webkit-border-radius: 5px 5px;
            -moz-border-radius: 5px 5px;
            border-radius: 5px 5px;
            /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
            /*box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);*/
            margin: 15px 0;
            position: relative;
            img {
                max-height: 120px;
            }
            .directory-title {
                font-weight: bold;
                font-size: 15px;
                margin-bottom: 20px;
            }
            .directory-info {
                margin-bottom: 8px;
                div {
                    display: inline-block;

                    padding-left: 25px;
                    /*display: none;*/
                    &:first-of-type {
                        padding-left: 0;
                        display: inline-block;

                    }
                }
                p {
                    margin-bottom: 0;
                    display: inline-block !important;
                }
                i {
                    width: 15px;
                    vertical-align: top;
                }
                .timeFrom {
                    padding: 10px;
                }
                .day {
                    text-transform: lowercase;
                }
            }

        }
    }
    .selected-list ul li span {
        display: block;
    }
    .selected-list ul li span label{
        font-size: small;
        font-weight: 500;
    }

    #modal1 .img-fluid {
        max-height: 80vh;
    }
</style>


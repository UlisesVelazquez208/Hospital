<template>
    <div style="height: 100%">
        <div v-if="directoryBusy" class="no-faq-container">
            <div class="loading-class-container">
                <loading-spinner :is-loading="directoryBusy"></loading-spinner>
            </div>
        </div>

        <div v-else-if="!singleDirectory" class="no-faq-container">
            <div class="text-center no-faq">
                <h2>Choose a directory to see detail here </h2>
            </div>
        </div>

        <div v-else-if="singleDirectory" class="faq-details-container">
            <b-tabs>
                <b-tab title="General info" class="general-info">
                    <!-- Directory Info -->
                    <directory-info :singleDirectory="singleDirectory"></directory-info>
                    <!-- Hashtags -->
                    <hashtags :hashtags="singleDirectory.hashtags" v-if="singleDirectory.hashtags"></hashtags>
                    <!-- Directory Media Links -->
                    <directory-media-links
                        v-if="singleDirectory.directory_media_links.length > 0"
                        :directoryMediaLinks="singleDirectory.directory_media_links"
                    ></directory-media-links>

                    <white-container title="Contact.ContactInformation">
                        <div class="selected-list">
                            <div class="row">
                                <div class="col-lg-12 col-md-12">
                                    <ul>
                                        <li v-for="(contactForm, index) in singleDirectory.contact_forms === null?[]:singleDirectory.contact_forms" :key="index">
                                            <contact-detail :contactModel="contactForm" :directory="singleDirectory"></contact-detail>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </white-container>
                </b-tab>

            </b-tabs>
            <component-as-modal buttonTag=""
                                showModalButton=""
                                componentName="contactFormMap"
                                :componentData="mapModalData">
            </component-as-modal>
            <!-- Map Modal -->
        </div>
    </div>
</template>


<script>
import directoryDetails from './directoryDetails.js';
export default directoryDetails;
</script>

<style type="text/css" lang="scss">
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
            .faq-answer  ul{
                list-style:inherit !important;
            }
            .directory-title {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 15px;
            }
            .directory-details {
                height: 100%;
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
                            display: inline;
                            padding: 0;
                            .rounded {
                                border-radius: 0.8rem !important;
                            }
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

            .img-container {
                img {
                    max-height: 120px;
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
                    margin-top: -0.25rem;
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
</style>


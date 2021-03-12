<template>
    <div class="search-results-page">
        <b-row>
            <b-col cols="12" lg="12" md="12">
                <small-search-box :keyword="decodeURIComponent(keyword)" :theSection="searchOption" :countryIds="countryIds" :countrySelect="countrySelect" :countryOptions="countryOptions"></small-search-box>
            </b-col>
        </b-row>
        <div class="new-container">
            <b-row class="ml-0">
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 faqs-list-wrapper">
                    <div v-if="isDirectory">
                        <directory-list :resultItems="resultItems" :total="total" :catBusy="catBusy" :countrySelect="countrySelect"></directory-list>
                    </div>
                    <div v-if="isMedia">
                        <media-list :resultItems="resultItems" :total="total" :catBusy="catBusy"></media-list>
                    </div>
                    <div v-if="isFAQ">
                        <faq-list :resultItems="resultItems" :total="total" :catBusy="catBusy"></faq-list>
                    </div>
                </div>
                <b-col cols="12" lg="8" md="8">
                    <div style="height: 100%" v-if="isFAQ">
                        <faqs-details :singlefaq="singleFaq" :faqBusy="faqBusy"></faqs-details>
                    </div>
                    <div style="height: 100%" v-if="isDirectory">
                        <directory-details :singleDirectory="singleDirectory" :directoryBusy="directoryBusy"></directory-details>
                    </div>
                    <div style="height: 100%" v-if="isMedia">
                        <media-details :singleMedia="singleMedia" :mediaBusy="mediaBusy"></media-details>
                    </div>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import Result from './result-script';

export default Result;
</script>
<style type="text/css" lang="scss" scoped>
    .container {
        height: 700px;
        overflow-y: scroll;
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

    .faq-container {
        box-shadow: 1px 1px 4px 1px #ccc;
        border-radius: 4px;
        margin-top: 10px;
        margin-bottom: 10px;
        background-color: #FAFAFA;
        padding-top: 30px;
        padding-bottom: 30px;
        position: relative;
        .widget_social_inner1 {
            margin: 20px 20px 20px 5px;
            font-family: Helvetica;
        }
        .text-ash {
            margin: 20px 20px 60px 5px;
            font-family: Helvetica;
        }
        .add-to-list {
            color: #0072BC;
            position: absolute;
            bottom: -2px;
            right: 14px;
            font-size: 12px;
            // margin-bottom: 15px;
            margin-top:10px;
        }
    }
    .service-categories {
        font-weight: normal;
    }

    .faq {
        color: #0072BC;
        cursor: pointer;
        font-size: 16px;
        overflow-wrap: break-word;
        word-wrap: break-word;

    }

    .faq-answer {
        font-size: 14px;
        color: #606060;
        font-family: Helvetica;
        word-wrap: break-word;
    }

    .faqs-list-wrapper {
        background-color: #F4F4F4;
        border: 1px solid #ddd;
    }

    .faqs-list-nav {
        color: #1D87C4;
        padding: 30px 15px 10px 15px;
    }

    .search_faq_form {
        border-radius: 20px 20px;
    }
</style>

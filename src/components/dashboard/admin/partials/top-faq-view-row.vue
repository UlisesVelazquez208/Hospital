<template>
    <b-row class="row-style">
        <b-col cols="3" class="text-left faq-title text-wrap">{{faq.question}}</b-col>
        <b-col cols="7">
            <b-progress height="35px" :value="calculateWidth(faq.views)" variant="info" hide-value
                        class="mb-4"></b-progress>
        </b-col>
        <b-col cols="2" class="text-center">{{faq.views}} views</b-col>
    </b-row>
</template>

<script>
    export default {
        name: "top-faq-view-row",
        props: {
            faq: {
                type: Object,
                required: true
            },
            maxViews: {
                required: true
            }
        },
        methods: {
            calculateWidth: function (view) {
                return 100 * parseInt(view) / parseInt(this.maxViews);
            }
        }
    }
</script>

<style>
    .faq-title {
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
        /*overflow: hidden;*/
    }

    .row-style {
        color: #525252;
        font-family: "Helvetica";
        font-size: 15px;
    }

    .bg-info {
        background-color: #64b7e3 !important;
    }

    @media screen and (max-width: 767px) {
        .faq-title {
            font-weight: 700;
            margin-bottom: 5px;
            max-width: 100%;
            flex: 0 0 100%;
        }
        .text-center{
            flex: 0 0 40%;
            max-width: 500px;
        }
    }
    @media screen and (max-width: 500px) {
        .faq-title,
        .text-center,
        .col-7{
            flex: 0 0 100%;
            max-width: 100%;
        }
        .col-7 .mb-4.progress{
            margin-bottom: 5px!important;
        }
        .text-center.col-2{
            margin-bottom: 10px;
            padding-bottom: 15px;
            text-align: left!important;
            border-bottom: 1px solid #ccc;
        }

    }
</style>

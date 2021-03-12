<template>
    <white-container title="Home.FAQ">

        <div class="faq-data">
            <!-- Question -->
            <div class="faq-question faq-data-item font-weight-bold">{{faqModel.question}}</div>
            <!-- Answer -->
            <div class="faq-answer faq-data-item" v-html="faqModel.answer"></div>
            <!-- Service Category -->
            <div class="row faq-data-item">
                <div class="col-3 font-weight-bold">{{ $t('Common.ServiceCategory')}}:</div>
                <div class="col-9">
                    {{serviceCategories}}
                </div>
            </div>
            <!-- Nationality -->
            <div class="row faq-data-item">
                <div class="col-3 font-weight-bold">{{ $t('Common.Nationality')}}:</div>
                <div class="col-9">
                    {{nationalities}}
                </div>
            </div>
            <!-- Country -->
            <div class="row faq-data-item">
                <div class="col-3 font-weight-bold">{{ $t('Common.Country')}}:</div>
                <div class="col-9">
                    {{countries}}
                </div>
            </div>
            <!-- visible by -->
            <div class="row faq-data-item">
                <div class="col-3 font-weight-bold">{{ $t('FAQ.VisibleBy')}}:</div>
                <div class="col-9">
                    {{faqModel.visible}}
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="faq_section_comment" :showComment="showComment"
                     :comments="comments"
        ></comment-section>

    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import CommentSection from "./comment-section.vue";

    export default {
        name: "add-faq",
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            showComment:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        components: {
            CommentSection,
            whiteContainer,
        },
        data() {
            return {
                categoryOptions: [],
                nationalityOptions: [],
                countryOptions: [],
                visiblebyValue: "null",
            }
        },
        // ===Code to be executed when Component is mounted
        created() {

        },
        // ===Component methods
        methods: {
        },
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'FAQ');
            },
            serviceCategories: function() {
                if (this.faqModel.service_categories == null)
                    return "";

                return this.faqModel.service_categories.map(function(item){
                    if(item.name) {
                        return item.name;
                    } else {
                        return item.label;
                    }
                }
                // a=>a.name
                ).join(', ');
            },
            nationalities: function() {
                if (this.faqModel.nationalities == null)
                    return "";

                return this.faqModel.nationalities.map(function(item){
                    if(item.nationality) {
                        return item.nationality;
                    } else {
                        return item.label;
                    }
                }
                // a=>a.name
                ).join(', ');
                // return this.faqModel.nationalities.map(a=>a.nationality).join(', ');
            },
            countries: function() {
                if (this.faqModel.countries == null)
                    return "";

                return this.faqModel.countries.map(function(item){
                    if(item.country) {
                        return item.country;
                    } else {
                        return item.label;
                    }
                }
                // a=>a.name
                ).join(', ');
                // return this.faqModel.countries.map(a=>a.country).join(', ');
            },
        }
    };
</script>
<style type="text/css" lang="scss">



    .faq-data {
        padding: 0;
        .faq-answer.faq-data-item  ul{
            list-style:inherit !important;
        }
    }

    .faq-data-item {
        margin-bottom: 9px;
    }

    .faq-answer {
        margin-bottom: 35px;
        white-space: pre-line;
    }
</style>

<template>
    <div class="text-left p-4 widget_social_icons general-info-container ">
        <div v-if="faqQuestion !== '' && faqAnswer !== ''">
            <div class="widget_social_inner1">
                <h5 class="faq">{{faqQuestion}}</h5>
            </div>
            <div class="answer-container">
                <p class="faq-answer" v-html="faqAnswer"></p>
            </div>
        </div>
        <div v-else>
            {{ $t('Common.NoTranslation') }}
        </div>
        <div class="add-to-list" style="overflow: hidden">
                                <span class="glyphicon glyphicon-plus" style="font-size: 15px"
                                      aria-hidden="true"></span>
            <p>
                <router-link class="float-right" tag="a" :to="'/my-list/create-mylist/'+faq.id">
                    <i class="fa fa-plus-square"></i> Add to list
                </router-link>
            </p>
        </div>
    </div>
</template>

<script>
    import {EventBus} from "./../../../eventbus/event-bus.js";
    export default {
        name: "faq-info",
        props: {
            faq: {
                required: true,
                type: Object
            }
        },
        data(){
            return {
                faqQuestion:"",
                faqAnswer:""
            };
        },
        created(){
            EventBus.$on('locale', this.localeUpdated);
        },
        mounted() {
            let currentLocale = localStorage.getItem('locale');
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            this.faqQuestion = this.faq.question;
            this.faqAnswer = this.faq.completeAnswer;

            let selectedLang = theLanguages.filter((item)=> {
                if(item.acronym ==  currentLocale) {
                    return item;
                }
            });

            if(selectedLang !== null) {
                let langID = selectedLang[0].id;
                let langFound = false;
                let translations = this.faq.translations;

                if(translations.length > 0) {
                    for(var i = 0; i < translations.length; i++) {
                        let theText = translations[i];
                        if(theText.language_id == langID) {
                            this.faqQuestion = theText.question;
                            this.faqAnswer = theText.answer;
                            langFound = true;
                            break;
                        }
                    }
                }

                if(langFound == false) {
                    let isDefault = this.checkDefaultLocale(currentLocale);

                    if(isDefault == false) {
                        this.faqQuestion = '';
                        this.faqAnswer = '';
                    }
                }
            }

        },
        methods:{
            localeUpdated:function(event) {
                this.faqQuestion = '';
                this.faqAnswer = '';
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let selectedLang = theLanguages.filter((item)=> {
                    if(item.acronym ==  event) {
                        return item;
                    }
                });

                if(selectedLang !== null) {
                    let langID = selectedLang[0].id;
                    let langFound = false;
                    let translations = this.faq.translations;
                    
                    if(translations.length > 0) {
                        for(var i = 0; i < translations.length; i++) {
                            let theText = translations[i];
                            if(theText.language_id == langID) {
                                this.faqQuestion = theText.question;
                                this.faqAnswer = theText.answer;
                                langFound = true;
                                break;
                            }
                        }
                    }

                    if(langFound == false) {
                        let isDefault = this.checkDefaultLocale(event);

                        if(isDefault == false) {
                            this.faqQuestion = '';
                            this.faqAnswer = '';
                        } else {
                            this.faqQuestion = this.faq.question;
                            this.faqAnswer = this.faq.answer;
                        }
                    }
                    
                }
            },
            checkDefaultLocale:function(locale) {
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let theItem = theLanguages.filter((item)=> {
                    if(item.acronym == locale && item.is_default == 1) {
                        return item;
                    }
                });

                if(theItem.length > 0){
                    return true;
                }
                return false;
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <div class="text-left p-4 widget_social_icons general-info-container ">
        <h5 class="section-title">{{ $t('Menu.Hashtags') }}</h5>
        <div class="hashtag-details">
            <ul class="hashtags-list" v-if="hashtagList && hashtagList.length">
                <li v-for="(item) in hashtagList" :key="item.id">
                    <router-link tag="a" class="hashtag-link" :to="'/frontline/faq-hashtag/' + item.text">
                        #{{item.text}}
                    </router-link>
                </li>
            </ul>
            <not-found v-else text="Common.NoHashtags" icon="fa-question-circle"></not-found>
        </div>
    </div>
</template>

<script>
    import NotFound from "./not-found";
    import {EventBus} from "./../../../eventbus/event-bus.js";
    export default {
        name: "faq-tags",
        components: {NotFound},
        props: {
            faq: {
                required: true,
                type: Object
            }
        },
        data(){
            return {
                hashtagList:[]
            }
        },
        created(){
            EventBus.$on('locale', this.localeUpdate);
        },
        mounted() {
            let currentLocale = localStorage.getItem('locale');
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            let selectedLang = theLanguages.filter((item)=> {
                if(item.acronym ==  currentLocale) {
                    return item;
                }
            });

            if(this.faq.hashtags !== null && this.faq.hashtags.length > 0) {
                for(var i = 0; i < this.faq.hashtags.length; i++) {
                    let theItem = this.faq.hashtags[i];

                    if(selectedLang !== null && theItem.translations.length > 0) {
                        let langID = selectedLang[0].id;
                        let translations = theItem.translations;
                        let tranlatedItem = translations.filter((a) => {
                            if(a.language_id == langID) {
                                this.hashtagList.push({id:theItem.id,text:a.name});
                                return;
                            }
                        });
                    } else {
                        this.hashtagList.push({id: theItem.id, text: theItem.hashtag});
                    }
                }
            }
        },
        methods:{
            localeUpdate:function(event) {
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let selectedLang = theLanguages.filter((item)=> {
                    if(item.acronym ==  event) {
                        return item;
                    }
                });

                this.hashtagList = [];
                if(this.faq.hashtags !== null) {
                    for(var i = 0; i < this.faq.hashtags.length; i++) {
                        let theItem = this.faq.hashtags[i];

                        if(selectedLang !== null && theItem.translations.length > 0) {
                            let langID = selectedLang[0].id;
                            let translations = theItem.translations;
                            let tranlatedItem = translations.filter((a) => {
                                if(a.language_id == langID) {
                                    this.hashtagList.push({id:theItem.id,text:a.name});
                                    return;
                                }
                            });
                        } else {
                            this.hashtagList.push({id: theItem.id, text: theItem.hashtag});
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>

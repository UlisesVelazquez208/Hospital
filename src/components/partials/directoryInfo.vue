<template>
    <div class="text-left p-4 widget_social_icons general-info-container">
        <b-row>
            <b-col md="2" lg="2" class="text-center img-container pr-0 pt-0">
                <img
                    v-if="singleDirectory.directory_media"
                    :src="singleDirectory.directory_media.url"
                    :alt="singleDirectory.directory_media.title"
                    class="img-fluid"
                />
                <b-card v-else>
                    <not-found text="Common.NoLogo" icon="fa-question"></not-found>
                </b-card>
            </b-col>
            <b-col md="10" lg="10" class="directory-info-container">
                <div class="widget_social_inner1">
                    <h5 class="faq">
                        <span v-if="dirName">{{dirName}} </span>
                        <span v-else>{{ $t('Common.NoTranslation') }}</span>
                        <span v-if="dirAcronym">({{dirAcronym}})</span></h5>
                </div>
                <div v-if="dirAlternativeName" class="alternative-name">
                    {{ $t('Directory.AlternativeName') }}: {{ dirAlternativeName}}
                </div>
                <div class="service-categories" v-if="singleDirectory.service_categories">
                    {{ $t('Common.ServiceCategory') }}: {{ categoryNames }}
                </div>
                <div class="service-categories" v-if="singleDirectory.directory_type">
                    {{ $t('DirectoryType.DirectoryType') }}: {{ typeName }}
                </div>
                <hr>
                <p class="faq-answer" v-html="dirDescription"></p>
            </b-col>
        </b-row>
    </div>
</template>
<script>
import {EventBus} from "./../../eventbus/event-bus";
import NotFound from "./../frontLine/partials/not-found";

export default {
    props:["singleDirectory"],
    components:{
        NotFound
    },
    data:function(){
        return {
            dirName:"",
            dirAcronym:"",
            dirDescription: "",
            dirAlternativeName:"",
            categoryNames:"",
            typeName:"",
            serviceCategories:[]
        };
    },
    created(){
        EventBus.$on('locale', this.localeUpdated);
    },
    mounted() {
        let currentLocale = localStorage.getItem('locale');
        let theLanguages = JSON.parse(localStorage.getItem('languages'));

        this.dirName = this.singleDirectory.name;
        this.dirAcronym = this.singleDirectory.acronym;
        this.dirDescription = this.singleDirectory.description;
        this.dirAlternativeName = this.singleDirectory.alternative_name;

        let selectedLang = theLanguages.filter((item)=> {
            if(item.acronym ==  currentLocale) {
                return item;
            }
        });

        if(selectedLang !== null) {
            let langID = selectedLang[0].id;
            let langFound = false;
            let translations = this.singleDirectory.translations;

            if(translations.length > 0) {
                for(var i = 0; i < translations.length; i++) {
                    let theText = translations[i];
                    if(theText.language_id == langID) {
                        this.dirName = theText.name;
                        this.dirAcronym = theText.acronym;
                        this.dirDescription = theText.description;
                        this.dirAlternativeName = theText.alternative_name;
                        langFound = true;
                        break;
                    }
                }
            }

            this.serviceCategories = this.singleDirectory.service_categories;
            this.loadServiceCategories(langID);
            this.loadDirectoryType(langID);

            if(langFound == false) {
                let isDefault = this.checkDefaultLocale(currentLocale);

                if(isDefault == false) {
                    this.dirName = '';
                    this.dirAcronym = '';
                    this.dirDescription = '';
                    this.dirAlternativeName = '';
                    this.categoryNames = '';
                }
            }
        }
    },
    methods:{
        localeUpdated:function(event) {
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            this.dirName = this.singleDirectory.name;
            this.dirAcronym = this.singleDirectory.acronym;
            this.dirDescription = this.singleDirectory.description;
            this.dirAlternativeName = this.singleDirectory.alternative_name;
    
            let selectedLang = theLanguages.filter((item)=> {
                if(item.acronym ==  event) {
                    return item;
                }
            });
    
            if(selectedLang !== null) {
                let langID = selectedLang[0].id;
                let langFound = false;
                let translations = this.singleDirectory.translations;
    
                if(translations.length > 0) {
                    for(var i = 0; i < translations.length; i++) {
                        let theText = translations[i];
                        if(theText.language_id == langID) {
                            this.dirName = theText.name;
                            this.dirAcronym = theText.acronym;
                            this.dirDescription = theText.description;
                            this.dirAlternativeName = theText.alternative_name;
                            langFound = true;
                            break;
                        }
                    }
                }
    
                this.loadServiceCategories(langID);
                this.loadDirectoryType(langID);

                if(langFound == false) {
                    let isDefault = this.checkDefaultLocale(event);
    
                    if(isDefault == false) {
                        this.dirName = '';
                        this.dirAcronym = '';
                        this.dirDescription = '';
                        this.dirAlternativeName = '';
                        this.categoryNames = '';
                    }
                }
            }
        },
        loadServiceCategories:function(langID) {
            for(var i = 0; i < this.serviceCategories.length; i++) {
                let theItem = this.serviceCategories[i];
                let translations = theItem.translations;
                let catNames = [];

                for(var j = 0; j < translations.length; j++) {
                    let transItem = translations[j];
                    if(transItem.language_id == langID) {
                        catNames.push(transItem.name);
                    }

                }
                this.categoryNames = catNames.join(', ');
            }
        },
        loadDirectoryType: function(langID) {
            let translations = this.singleDirectory.directory_type.translations;
            if(translations.length > 0) {
                for(var i = 0; i < translations.length; i++) {
                    let transItem = translations[i];
                    if(transItem.language_id == langID) {
                        this.typeName = transItem.name;
                        break;
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
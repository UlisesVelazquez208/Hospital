<template>
    <div class="row w-100 m-0">
        <div class="img-container col-lg-2 col-md-2 text-center">
            <img v-if="directory.directory_media" class="img-fluid"
                    :src="directory.directory_media.url"
                    :alt="directory.directory_media.title">

            <b-card  v-else class="float-sm-left">
                <not-found text="Common.NoLogo" icon="fa-question"></not-found>
            </b-card>

        </div>

        <div class="directory-info-container col-lg-10 col-md-10">
            <div class="row">
                <div class="col-md-12">
                    <h4 class="directory-title"><span v-if="dirName">{{dirName}}
                        <span v-if="dirAcronym">({{ dirAcronym }})</span>
                            <span v-if="directory.contact_forms.length > 0">
                                -  {{ directory.contact_forms[0].directory_country ?
                                        directory.contact_forms[0].directory_country.country : directory.contact_forms[0].country }}
                            </span>
                        </span>
                        <span v-else>{{ $t('Common.NoTranslation') }}</span>
                    </h4>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="addresses" v-if="dirContacts.length > 0" v-for="(contact, contactID) in dirContacts" :key="contactID">
                        <contact-detail :contactModel="contact"></contact-detail>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import ComponentAsModal from "../../modal/component-as-modal";
    import {EventBus} from "../../../eventbus/event-bus";
    import contactDetail from './../../partials/contact-detail.vue';
    import NotFound from "./not-found";

    export default {
        name: "faq-directory",
        components: {
            ComponentAsModal, 
            NotFound,
            "contact-detail": contactDetail
        },
        props: {
            directory: {
                required: true,
                type: Object
            },
            dirContacts:{
                type:Array,
                required:false
            }
        },
        data() {
            return {
                mapModalData: {},
                dirName:"",
                dirAcronym:""
            }
        },
        created(){
            EventBus.$on('locale', this.localeUpdated);
        },
        mounted() {
            let currentLocale = localStorage.getItem('locale');
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            this.dirName = this.directory.name;
            this.dirAcronym = this.directory.acronym;

            let selectedLang = theLanguages.filter((item)=> {
                if(item.acronym ==  currentLocale) {
                    return item;
                }
            });

            if(selectedLang !== null) {
                let langID = selectedLang[0].id;
                let langFound = false;
                let translations = this.directory.translations;

                if(translations.length > 0) {
                    for(var i = 0; i < translations.length; i++) {
                        let theText = translations[i];
                        if(theText.language_id == langID) {
                            this.dirName = theText.name;
                            this.dirAcronym = theText.acronym;
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
        // filters: {
        //     capitalize: function (value) {
        //         if (!value) return ''
        //         value = value.toString()
        //         return value.charAt(0).toUpperCase() + value.slice(1)
        //     }
        // },
        methods: {
            onModalButtonClicked: function () {
                let mapData = {
                    contactForm: this.contactAddress,
                    name: this.directory.name,
                    id: this.directory.id,
                };
                
                EventBus.$emit('show-map', mapData);
            },
            localeUpdated:function(event) {
            this.dirName = this.directory.name;
            this.dirAcronym = this.directory.acronym;
                let theLanguages = JSON.parse(localStorage.getItem('languages'));

                let selectedLang = theLanguages.filter((item)=> {
                    if(item.acronym ==  event) {
                        return item;
                    }
                });

                if(selectedLang !== null) {
                    let langID = selectedLang[0].id;
                    let langFound = false;
                    let translations = this.directory.translations;
                    
                    if(translations.length > 0) {
                        for(var i = 0; i < translations.length; i++) {
                            let theText = translations[i];
                            if(theText.language_id == langID) {
                                this.dirName = theText.name;
                                this.dirAcronym = theText.acronym;
                                langFound = true;
                                break;
                            }
                        }
                    }

                    if(langFound == false) {
                        let isDefault = this.checkDefaultLocale(event);

                        if(isDefault == false) {
                            this.dirName = '';
                            this.dirAcronym = '';
                        } else {
                            this.dirName = this.directory.name;
                            this.dirAcronym = this.directory.acronym;
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
        },
        computed:{
        }
    }
</script>
<style>
.faq-details-container .general-info-container .directory-details ul li i {
    vertical-align: top;
}
</style>
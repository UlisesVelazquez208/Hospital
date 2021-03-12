<template>
    <div class="address">
        <h5 v-if="contactModel.contact_label">{{ contactModel.contact_label }}</h5>
        <div class="directory-info" v-if="contactModel.address_line_one != null || contactModel.building_name  != null || contactModel.landmark != null || contactModel.metro != null || contactModel.postal_code  != null || contactModel.city != null || contactModel.neighbourhood != null || contactModel.proximity != null || contactModel.district != null || contactModel.governorate != null || contactModel.directory_country != null  || contactModel.country != null || contactModel.lat > 0  || contactModel.lng > 0 || contactModel.pluscode != null">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-map-marker"></i>
            </span>
            <p class="pt-1">
                <label v-if="contactModel.address_line_one">{{ contactModel.address_line_one }} <span v-if="contactModel.address_line_two">{{ contactModel.address_line_two }} </span></label>
                <span v-if="contactModel.building_name" class="address-item">
                    <label>{{ $t('Contact.BuildingName') }}:</label> {{ contactModel.building_name}}
                </span>
                <span v-if="contactModel.landmark" class="address-item">
                    <label>{{ $t('Contact.Landmark') }}:</label> {{ contactModel.landmark}}
                </span>
                <span v-if="contactModel.metro" class="address-item">
                    <label>{{ $t('Contact.Metro') }}:</label> {{ contactModel.metro}}
                </span>
                <span v-if="contactModel.postal_code" class="address-item">
                    <label>{{ $t('Contact.Postal') }}: </label> {{ contactModel.postal_code}}
                </span>
                <span v-if="contactModel.city" class="address-item">
                    <label>{{ $t('Contact.City') }}:</label> {{ contactModel.city}}
                </span>
                <span v-if="contactModel.neighbourhood" class="address-item">
                    <label>{{ $t('Contact.Neighbourhood') }}:</label> {{ contactModel.neighbourhood}} {{ $t('Contact.Neighbourhood') }}
                </span>
                <span v-if="contactModel.proximity" class="address-item">
                    <label>{{ $t('Contact.Proximity') }}:</label> {{ contactModel.proximity}} {{ $t('Contact.Proximity') }}
                </span>
                <span v-if="contactModel.district" class="address-item">
                    <label>{{ $t('Contact.District') }}:</label> {{ contactModel.district}} {{ $t('Contact.District') }}
                </span>
                <span v-if="contactModel.governorate" class="address-item">
                    <label>{{ $t('Contact.Governorate') }}:</label> {{ contactModel.governorate}}
                </span>
                <span v-if="contactModel.directory_country" class="address-item">
                    <label>{{ $t('Common.Country') }}:</label> {{ contactModel.directory_country.country}}
                </span>
                <span v-else-if="contactModel.country" class="address-item">
                    <label>{{ $t('Common.Country') }}:</label> {{ contactModel.country}}
                </span>
                <span v-if="contactModel.lat > 0 && contactModel.lng > 0" class="address-item">
                    <label>{{ $t('Contact.Coordinates') }}:</label> {{ contactModel.lat}}, {{ contactModel.lng}}
                </span>
                <span v-if="contactModel.pluscode" class="address-item">
                    <label>{{ $t('Contact.PlusCode') }}:</label> {{ contactModel.pluscode}}
                </span>
            </p>
        </div>
        <div class="directory-info" v-if="contactModel.email">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-envelope"></i>
            </span>
            <p class="pt-1">
                <a :href="'mailto:'+contactModel.email">{{contactModel.email}}</a>
            </p>
        </div>
        <div class="directory-info" v-if="contactModel.website">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-anchor"></i>
            </span>
            <p class="pt-1">
                <a :href="contactModel.website" target="_blank">{{contactModel.website}}</a>
            </p>
        </div>
        <div class="map-location directory-info" v-if="contactModel.lat*1 != 0">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class=" fa fa-map-marker"></i>
            </span>
            <p class="directory-info pt-1">
                <a v-b-modal="'myModalcontactFormMap'" 
                    @click="showMap(contactModel)">
                    {{ $t('Contact.ViewOnMap')}}
                </a>
            </p>
        </div>
        <div class="directory-info" v-if="contactModel.phones !== null && contactModel.phones.length > 0">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-phone"></i>
            </span>
            <p class="directory-info pt-1">
                {{contactModel.phones.map(a=>{
                    if(a.country_code != null && a.area_code != null)
                        return ('+'+a.country_code+' '+a.area_code+' '+a.phone);
                    return a.phone;
                }).join(", ")}}
            </p>
        </div>
        <div class="directory-info" v-if="workingHours !== null && workingHours.length > 0">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-clock-o"></i>
            </span>
            <p class="pt-1">
                <span class="address-item" v-for="(work, index) in workingHours" :key="index">
                    {{$t('Common.'+work.day.substring(0, 3))}} ({{work.from}} - {{work.to}})
                </span>
            </p>
        </div>
        <contact-trans :languageContents="languageContents" v-if="languageContents.length > 0"></contact-trans>
    </div>
</template>
<script>
import { EventBus } from './../../../eventbus/event-bus';
import contactTranslation from "./showContactTranslation";

export default {
    name:"contact-detail",
    components:{
        "contact-trans":contactTranslation
    },
    props: {
        contactModel:{
            type:Object,
            required:true
        }
    },
    data() {
        return {
            // mapModalData: {},
            workingHours:{},
            languageContents:[]
        }
    },
    mounted(){
        var theWorkingHours = this.contactModel.working_hours ;
        var order = { SUNDAY: 1, MONDAY: 2, TUESDAY: 3, WEDNESDAY: 4, THURSDAY: 5, FRIDAY: 6, SATURDAY: 7 };

        if(theWorkingHours !== null) {
            this.workingHours = theWorkingHours.sort(function(a, b) {
                return order[a.day] - order[b.day];
            });
        } else {
            this.workingHours = null;
        }

        this.theLanguages = JSON.parse(localStorage.getItem('languages'));
        this.langLocale = localStorage.getItem('lang_locale');

        for(var i=0; i < this.theLanguages.length; i++) {
            var theItem = this.theLanguages[i];
            if(theItem.is_default == 0) {
                var langContent = {};
                langContent.language_id = theItem.id;
                langContent.label = theItem.name;
                langContent.contact_label ="";
                langContent.address_line_one = "";
                langContent.address_line_two = "";
                langContent.landmark = "";
                langContent.metro = "";
                langContent.city = "";
                langContent.neighbourhood = "";
                langContent.proximity = "";
                langContent.building_name = "";
                langContent.governorate = "";
                langContent.district = "";

                this.languageContents.push(langContent);
            }
        }
        this.loadContactTranslation();
    },
    // filters: {
    //     capitalize: function (value) {
    //         if (!value) return ''
    //         value = value.toString()
    //         return value.charAt(0).toUpperCase() + value.slice(1)
    //     }
    // },
    methods: {
        // showMap: function (contactModel) {
        //     EventBus.$emit('selected-contact-model', {model:contactModel});
        // },
        loadContactTranslation:function() {
            let langFilter = this.theLanguages.filter((item) => {
                if(item.is_default == 1)
                    return item;
            });

            if(this.contactModel.translations.length > 0) {
                for(var i = 0; i < this.contactModel.translations.length; i++) {
                    let theItem = this.contactModel.translations[i];
                    for(var j = 0; j < this.languageContents.length; j++) {
                        if(langFilter.length > 0 && langFilter[0].id != this.languageContents[j].language_id && this.languageContents[j].language_id == theItem.language_id) {
                            this.languageContents[j].contact_label =theItem.contact_label;
                            this.languageContents[j].address_line_one = theItem.address_line_one;
                            this.languageContents[j].address_line_two = theItem.address_line_two;
                            this.languageContents[j].landmark = theItem.landmark;
                            this.languageContents[j].metro = theItem.metro;
                            this.languageContents[j].city = theItem.city;
                            this.languageContents[j].neighbourhood = theItem.neighbourhood;
                            this.languageContents[j].proximity = theItem.proximity;
                            this.languageContents[j].building_name = theItem.building_name;
                            this.languageContents[j].governorate = theItem.governorate;
                            this.languageContents[j].district = theItem.district;
                        }
                    }
                }
            }
        }
    }
}
</script>
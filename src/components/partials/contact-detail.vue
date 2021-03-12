<template>
    <div class="address">
        <h5 v-if="contactLabel">{{ contactLabel }}</h5>
        <div class="directory-info" v-if="addressLineOne != null || buildingName  != null || landmark != null || metro != null || contactModel.postal_code  != null || city != null || neighbourhood != null || proximity != null || district != null || governorate != null || contactModel.directory_country != null  || contactModel.country != null || contactModel.lat > 0  || contactModel.lng > 0 || contactModel.pluscode != null">
            <span class="d-inline-block align-top text-center pt-1 pl-1">
                <i class="fa fa-map-marker"></i>
            </span>
            <p class="pt-1">
                <label v-if="addressLineOne">{{ addressLineOne }} <span v-if="addressLineTwo">{{ addressLineTwo }} </span></label>
                <span v-if="buildingName" class="address-item">
                    <label>{{ $t('Contact.BuildingName') }}:</label> {{ buildingName }}
                </span>
                <span v-if="landmark" class="address-item">
                    <label>{{ $t('Contact.Landmark') }}:</label> {{ landmark }}
                </span>
                <span v-if="metro" class="address-item">
                    <label>{{ $t('Contact.Metro') }}:</label> {{ metro }}
                </span>
                <span v-if="contactModel.postal_code" class="address-item">
                    <label>{{ $t('Contact.Postal') }}: </label> {{ contactModel.postal_code}}
                </span>
                <span v-if="city" class="address-item">
                    <label>{{ $t('Contact.City') }}:</label> {{ city }}
                </span>
                <span v-if="neighbourhood" class="address-item">
                    <label>{{ $t('Contact.Neighbourhood') }}:</label> {{ neighbourhood}} {{ $t('Contact.Neighbourhood') }}
                </span>
                <span v-if="proximity" class="address-item">
                    <label>{{ $t('Contact.Proximity') }}:</label> {{ proximity}} {{ $t('Contact.Proximity') }}
                </span>
                <span v-if="district" class="address-item">
                    <label>{{ $t('Contact.District') }}:</label> {{ district}} {{ $t('Contact.District') }}
                </span>
                <span v-if="governorate" class="address-item">
                    <label>{{ $t('Contact.Governorate') }}:</label> {{ governorate}}
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
    </div>
</template>
<script>
import { EventBus } from './../../eventbus/event-bus';

export default {
    name:"contact-detail",
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
            contactLabel:"",
            addressLineOne:"",
            addressLineTwo:"",
            buildingName:"",
            proximity:"",
            district:"",
            neighbourhood:"",
            governorate:"",
            city:"",
            metro:"",
            landmark:""
        }
    },
    created(){
        EventBus.$on('locale', this.localeUpdated);
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

        this.contactLabel = this.contactModel.contact_label;
        this.addressLineOne = this.contactModel.address_line_one;
        this.addressLineTwo = this.contactModel.address_line_two;
        this.buildingName = this.contactModel.building_name;
        this.proximity = this.contactModel.proximity;
        this.district = this.contactModel.district;
        this.neighbourhood = this.contactModel.neighbourhood;
        this.governorate = this.contactModel.governorate;
        this.city = this.contactModel.city;
        this.metro = this.contactModel.metro;
        this.landmark = this.contactModel.landmark;

        let currentLocale = localStorage.getItem('locale');
        let theLanguages = JSON.parse(localStorage.getItem('languages'));

        let selectedLang = theLanguages.filter((item)=> {
            if(item.acronym ==  currentLocale) {
                return item;
            }
        });

        if(selectedLang !== null) {
            let langID = selectedLang[0].id;
            let langFound = false;
            let translations = this.contactModel.translations;

            if(translations.length > 0) {
                for(var i = 0; i < translations.length; i++) {
                    let theText = translations[i];
                    if(theText.language_id == langID) {
                        this.contactLabel = theText.contact_label;
                        this.addressLineOne = theText.address_line_one;
                        this.addressLineTwo = theText.address_line_two;
                        this.buildingName = theText.building_name;
                        this.proximity = theText.proximity;
                        this.district = theText.district;
                        this.neighbourhood = theText.neighbourhood;
                        this.governorate = theText.governorate;
                        this.city = theText.city;
                        this.metro = theText.metro;
                        this.landmark = theText.landmark;
                        langFound = true;
                        break;
                    }
                }
            }

            if(langFound == false) {
                let isDefault = this.checkDefaultLocale(currentLocale);

                if(isDefault == false) {
                    this.contactLabel = '';
                    this.addressLineOne = '';
                    this.addressLineTwo = '';
                    this.buildingName = '';
                    this.proximity = '';
                    this.district = '';
                    this.neighbourhood = '';
                    this.governorate = '';
                    this.city = '';
                    this.metro = '';
                    this.landmark = '';
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
        showMap: function (contactModel) {
            EventBus.$emit('selected-contact-model', {model:contactModel});
        },
        localeUpdated:function(event) {
            this.contactLabel = '';
            this.addressLineOne = '';
            this.addressLineTwo = '';
            this.buildingName = '';
            this.proximity = '';
            this.district = '';
            this.neighbourhood = '';
            this.governorate = '';
            this.city = '';
            this.metro = '';
            this.landmark = '';
            let theLanguages = JSON.parse(localStorage.getItem('languages'));

            let selectedLang = theLanguages.filter((item)=> {
                if(item.acronym ==  event) {
                    return item;
                }
            });

            if(selectedLang !== null) {
                let langID = selectedLang[0].id;
                let langFound = false;
                let translations = this.contactModel.translations;
                
                if(translations.length > 0) {
                    for(var i = 0; i < translations.length; i++) {
                        let theText = translations[i];
                        if(theText.language_id == langID) {
                            this.contactLabel = theText.contact_label;
                            this.addressLineOne = theText.address_line_one;
                            this.addressLineTwo = theText.address_line_two;
                            this.buildingName = theText.building_name;
                            this.proximity = theText.proximity;
                            this.district = theText.district;
                            this.neighbourhood = theText.neighbourhood;
                            this.governorate = theText.governorate;
                            this.city = theText.city;
                            this.metro = theText.metro;
                            this.landmark = theText.landmark;
                            langFound = true;
                            break;
                        }
                    }
                }

                if(langFound == false) {
                    let isDefault = this.checkDefaultLocale(event);

                    if(isDefault == false) {
                        this.contactLabel = '';
                        this.addressLineOne = '';
                        this.addressLineTwo = '';
                        this.buildingName = '';
                        this.proximity = '';
                        this.district = '';
                        this.neighbourhood = '';
                        this.governorate = '';
                        this.city = '';
                        this.metro = '';
                        this.landmark = '';
                    } else {
                        this.contactLabel = this.contactModel.contact_label;
                        this.addressLineOne = this.contactModel.address_line_one;
                        this.addressLineTwo = this.contactModel.address_line_two;
                        this.buildingName = this.contactModel.building_name;
                        this.proximity = this.contactModel.proximity;
                        this.district = this.contactModel.district;
                        this.neighbourhood = this.contactModel.neighbourhood;
                        this.governorate = this.contactModel.governorate;
                        this.city = this.contactModel.city;
                        this.metro = this.contactModel.metro;
                        this.landmark = this.contactModel.landmark;
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
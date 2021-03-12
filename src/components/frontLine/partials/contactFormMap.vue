<template>
    <b-card class="contact-form-map"
            header-bg-variant="primary"
            header-text-variant="white">

        <template slot="header">
            {{ $t('Map.LocationOnGoogleMaps') }}
            <!-- <button v-if="isModal" type="button" class="close" aria-label="Close" style="color: #fff" @click="closeMe">
                <span aria-hidden="true">&times;</span>
            </button> -->
        </template>

        <b-card-body class="contact-form-map-body">

            <div class="pre-map-box">

                <div class="location-name">
                    {{ address }}
                </div>

                <table class="table">
                    <tr class="location-field" v-if="latitude">
                        <td>{{ $t('Contact.Latitude') }}</td>
                        <td class="field-value">{{ latitude }}</td>
                    </tr>
                    <tr class="location-field" v-if="longitude">
                        <td>{{ $t('Contact.Longitude') }}</td>
                        <td class="field-value">{{ longitude }}</td>
                    </tr>
                    <tr class="location-field">
                        <td>{{ $t('Contact.Phone') }}</td>
                        <td class="field-value">
                            {{ phones }}
                        </td>
                    </tr>
                    <tr class="location-field">
                        <td>Hours</td>
                        <td class="field-value">
                            <div v-for="work in workingHours">
                                <span class="day float-left col-lg-4 col-md-4 pl-0">{{work.day}}</span>
                                <span class="time float-left col-lg-4 col-md-4">({{work.from}} - {{work.to}})</span>
                                <div class="clearfix"></div>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>

            <abstract-google-map :mapId="'contact_form_map_no_' + contactFormID"
                                 :locationAsString="address" :latitude="latitude" :longitude="longitude"
            ></abstract-google-map>

        </b-card-body>

    </b-card>
</template>

<script>
    import AbstractGoogleMap from "../../widgets/google_map/abstract-google-map.vue";
    // import AbstractGoogleMap from "../../widgets/google_map/abstract-google-map.vue";

    export default {
        name: "contact-form-map",
        props: {
            contactForm: {
                type: Object,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            isModal: {
                type: Boolean,
                default: false,
            },
            componentData: {
                type: Object,
                required: false
            }
        },
        data: function() {
            return {

            }
        },
        methods: {
            isDataInitiated() {
                return Object.keys(this.componentData).length == 0 ? false : true;
            },
            closeMe() {
                this.$emit("closeMe");
            },
            createAddress(contactForm){
                var theAddress = '';
                var arAddress = [];
                
                if(contactForm.address_line_one !== null) {
                    arAddress.push(contactForm.address_line_one);
                }
                if(contactForm.address_line_two !== null) {
                    arAddress.push(contactForm.address_line_two);
                }

                if(contactForm.building_name !== null) {
                    arAddress.push(contactForm.building_name);
                }
                if(contactForm.landmark !== null) {
                    arAddress.push(contactForm.landmark);
                }
                if(contactForm.metro !== null) {
                    arAddress.push(contactForm.metro);
                }
                if(contactForm.neighbourhood !== null) {
                    arAddress.push(contactForm.neighbourhood);
                }
                if(contactForm.city !== null) {
                    arAddress.push(contactForm.city);
                }
                if(contactForm.district !== null) {
                    arAddress.push(contactForm.district);
                }
                if(contactForm.country !== null) {
                    arAddress.push(contactForm.country);
                }
                theAddress = arAddress.join(', ');
                
                return theAddress;
            },
            getPhones:function(contactModel) {
                var phones = contactModel.phones;
                // console.log(typeof phones);
                if(phones !== null) {
                    return phones.map(a=>{
                        if(a.country_code != null && a.area_code != null)
                            return ('+'+a.country_code+' '+a.area_code+' '+a.phone);
                        return a.phone;
                    }).join(', ');
                }

                return '';
            },
            getWorkingHours:function(contactModel) {
                var theWorkingHours = contactModel.working_hours ;
                var order = { SUNDAY: 1, MONDAY: 2, TUESDAY: 3, WEDNESDAY: 4, THURSDAY: 5, FRIDAY: 6, SATURDAY: 7 };

                if(theWorkingHours !== null) {
                    return theWorkingHours.sort(function(a, b) {
                        return order[a.day] - order[b.day];
                    });
                } else {
                    return null;
                }
            }
        },
        components: {
            AbstractGoogleMap
        },
        computed: {
            locationName: function() {
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.componentData.name;
                }
                return this.name;
            },
            latitude: function() {
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.componentData.contactForm.lat!=null?this.componentData.contactForm.lat:"";
                }
                return this.contactForm.lat!=null?this.contactForm.lat:"";
            },
            longitude: function() {
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.componentData.contactForm.lng != null? this.componentData.contactForm.lng:"";
                }
                return this.contactForm.lng!=null?this.contactForm.lng:"";
            },
            address: function() {
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.createAddress(this.componentData.contactForm);
                }

                return this.createAddress(this.contactForm);

            },
            phones: function() {
                var thePhones = '';
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    thePhones = this.getPhones(this.componentData.contactForm);
                } else {
                    thePhones = this.getPhones(this.contactForm);
                }
                
                return thePhones;
            },
            workingHours: function() {
                if (this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.getWorkingHours(this.componentData.contactForm);
                }
                return this.getWorkingHours(this.contactForm);
            },
            contactFormID: function() {
                if(this.isModal) {
                    if (!this.isDataInitiated()) {
                        return "";
                    }
                    return this.componentData.contactForm.id;
                }
                return this.contactForm.id;
            }
        }
    }
</script>

<style type="text/css" lang="scss" scoped>
    .contact-form-map {

        color: black;
        margin-bottom: 0px;

        .pre-map-box {
            margin-bottom: 20px;
            .location-name {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .location-field {
                margin: 1px 1px;
            }
            .field-value {
                padding-left: 20px;
            }
        }

    }
</style>
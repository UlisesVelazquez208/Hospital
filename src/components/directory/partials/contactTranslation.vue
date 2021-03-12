<template>
    <div :id="contactIndex">
        <div v-for="(langItem, index) in languageContents" class="row form-group" :key="index">
            <div class="col-lg-12 col-md-12">
                <div class="row">
                    <div class="col-lg-12 col-md-12">
                        <h5>{{ langItem.label }}</h5>
                        <input type="hidden" :name="'language_id_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-sm-12">
                        <div class="row">
                            <label for="contact_label" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.ContactLabel')}}</label>
                            <div class="col-sm-12 col-lg-9">
                                <input type="text" :name="'contact_label_'+contactIndex+'_'+(index+1)" :id="'contact_label_'+contactIndex+'_'+(index+1)"  :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.ContactLabelPlaceholder')"
                                    class="input-field form-control contact_label"
                                    v-model="langItem.contact_label"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-sm-12">
                        <div class="row">
                            <label for="address_line_one" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.AddressLine1')}}</label>
                            <div class="col-sm-12 col-lg-9">
                                <input type="text" :name="'address_line_one_'+contactIndex+'_'+(index+1)" :id="'address_line_one_'+contactIndex+'_'+(index+1)"  :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.AddressLinePlaceholder')"
                                    class="input-field form-control address_line_one"
                                    v-model="langItem.address_line_one"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-sm-12">
                        <div class="row">
                            <label for="address_line_two" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.AddressLine2')}}</label>
                            <div class="col-sm-12 col-lg-9">
                                <input type="text" :name="'address_line_two_'+contactIndex+'_'+(index+1)" :id="'address_line_two_'+contactIndex+'_'+(index+1)"  :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.AddressLinePlaceholder')"
                                    class="input-field form-control address_line_two"
                                    v-model="langItem.address_line_two"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="building_name" class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.BuildingName')}}</label>
                            <div class="col-sm-12 col-lg-6">
                                <input type="text" :name="'building_name_'+contactIndex+'_'+(index+1)" :id="'building_name_'+contactIndex+'_'+(index+1)"  :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.BuildingNamePlaceholder')"
                                    class="input-field form-control building_name"
                                    v-model="langItem.building_name"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="landmark"
                                class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.Landmark')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <input type="text" name="landmark" :id="'landmark_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.LandmarkPlaceholder')"
                                    class="input-field form-control landmark"
                                    v-model="langItem.landmark"
                                >
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="metro" class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.Metro')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <!--@TODO V-model Override select value in directory type-->
                                <input type="text" name="metro" :id="'metro_'+(index+1)" :index="(index+1)"
                                    :placeholder="$t('Contact.MetroPlaceholder')"
                                    class="input-field form-control postal"
                                    v-model="langItem.metro"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="city" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.City')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <!--@TODO V-model Override select value in directory type-->
                                <input type="text" :name="'city_'+contactIndex+'_'+(index+1)" :id="'city_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.CityPlaceholder')"
                                    class="input-field form-control city"
                                    v-model="langItem.city"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="neighbourhood"
                                class="col-sm-12  col-lg-6 col-form-label text-right">{{$t('Contact.Neighbourhood')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <input type="text" :name="'neighbourhood_'+contactIndex+'_'+(index+1)" :id="'neighbourhood_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.NeighbourhoodPlaceholder')"
                                    class="input-field form-control neighbourhood"
                                    v-model="langItem.neighbourhood"
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="proximity" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.Proximity')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <!--@TODO V-model Override select value in directory type-->
                                <input type="text" :name="'proximity_'+contactIndex+'_'+(index+1)" :id="'proximity_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.ProximityPlaceholder')"
                                    class="input-field form-control proximity"
                                    v-model="langItem.proximity"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="district"
                                class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.District')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <input type="text" :name="'district_'+contactIndex+'_'+(index+1)" :id="'district_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.DistrictPlaceholder')"
                                    class="input-field form-control district"
                                    v-model="langItem.district"
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row form-group">
                    <div class="col-sm-6">
                        <div class="row">
                            <label for="governorate" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.Governorate')}}</label>
                            <div class="col-sm-12  col-lg-6">
                                <!--@TODO V-model Override select value in directory type-->
                                <input type="text" :name="'governorate_'+contactIndex+'_'+(index+1)" :id="'governorate_'+contactIndex+'_'+(index+1)" :index="contactIndex+'_'+(index+1)"
                                    :placeholder="$t('Contact.GovernoratePlaceholder')"
                                    class="input-field form-control governorate"
                                    v-model="langItem.governorate"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>
<script>
import inputText from "../../core/form/partials/input-text/input-text.vue";
export default {
    name:"contact-trans",
    components:{
        inputText
    },
    props:{
        languageContents:{
            type:Array,
            default: function() {
                return [];
            }
        },
        contactIndex:{
            type:Number
        }
    },
    created(){
        // let self = this;
        // this.$eventBus.$on('empty-translations', function () {
        //     // self.localPhones = [];
        //     // self.model.phone = '';
        //     // self.model.country_code = '';
        //     // self.model.area_code = '';
        // });
    },
    mounted(){
        // console.log(this.languageContents);
    },
    methods:{
        // updateModel:function(data) {
        //     if(data.index > 0) {
        //         this.languageContents[data.index-1][data.name] = data.value;
        //     }
        // }
    } 
}
</script>
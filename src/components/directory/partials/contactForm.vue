<template>
    <div>
        <div v-for="(contactForm, key) in localContactForms" class="contactinfo-container" :key="key" v-if="!contactForm.deleted">
            <div style="overflow: hidden;margin-bottom: 10px;">
                <div style="float:right;">
                    <button @click="removeContactForm(key)" type="button" class="btn btn-secondary -align-right">
                        {{ showDelete() ? 'x' : 'Reset'}}
                    </button>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-12 col-lg-12">
                    <div class="row">
                        <label for="contact_label" class="col-sm-12  col-lg-3 col-form-label">{{$t('Contact.ContactLabel')}}</label>
                        <div class="col-sm-6 col-lg-9">
                            <input type="text" name="contact_label" class="contact_label input-field form-control"
                                id="contact_label" :placeholder="$t('Contact.ContactLabelPlaceholder')"
                                required="false"
                                v-model="contactForm.contact_label"
                                @input="updateModel(key, 'contact_label',$event.target)"
                                @keyup="clearError('contact_label')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].contact_label }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <input-text name="address_line_one" :index="key" inputClass="address"
                         :inputId="'address' + key" placeholder="Contact.AddressLinePlaceholder"
                         inputLabel="Contact.AddressLine1" :required="false"
                         :value="contactForm.address_line_one"
                         :errors="errors[key] ? errors[key].address_line_one : ''" ></input-text>
            <input-text name="address_line_two" inputClass="address" :index="key"
                        :inputId="'address2'+key" placeholder="Contact.AddressLinePlaceholder"
                        inputLabel="Contact.AddressLine2"
                        :required="false"
                        :value="contactForm.address_line_two"
                        :errors="errors[key] ? errors[key].address_line_two : ''"
            />

            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="building_name" class="col-sm-12  col-lg-6 col-form-label">{{$t('Contact.BuildingName')}}</label>
                        <div class="col-sm-12 col-lg-6">
                            <input type="text" name="building_name" id="building_name"
                                   :placeholder="$t('Contact.BuildingNamePlaceholder')"
                                   class="input-field form-control building_name"
                                   v-model="contactForm.building_name"
                                   @input="updateModel(key, 'building_name',$event.target)"
                                   @keyup="clearError('building_name')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].building_name }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="landmark"
                               class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.Landmark')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="landmark" id="landmark"
                                   :placeholder="$t('Contact.LandmarkPlaceholder')"
                                   class="input-field form-control landmark"
                                   v-model="contactForm.landmark"
                                   @input="updateModel(key, 'landmark',$event.target)"
                                   @keyup="clearError('landmark')"

                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].landmark }}
                            </div>
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
                            <input type="text" name="metro" id="metro"
                                   :placeholder="$t('Contact.MetroPlaceholder')"
                                   class="input-field form-control metro"
                                   v-model="contactForm.metro"
                                   @input="updateModel(key, 'metro',$event.target)"
                                   @keyup="clearError('metro')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].metro }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="postal" class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.Postal')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="number" name="postal_code" id="postal"
                                   :placeholder="$t('Contact.PostalPlaceholder')"
                                   class="input-field form-control postal"
                                   v-model="contactForm.postal_code"
                                   @input="updateModel(key, 'postal_code',$event.target)"
                                   @keyup="clearError('postal_code')"
                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].postal_code }}
                            </div>
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
                            <input type="text" name="city" id="city"
                                   :placeholder="$t('Contact.CityPlaceholder')"
                                   class="input-field form-control city"
                                   v-model="contactForm.city"
                                   @input="updateModel(key, 'city',$event.target)"
                                   @keyup="clearError('city')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].city }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="neighbourhood"
                               class="col-sm-12  col-lg-6 col-form-label text-right">{{$t('Contact.Neighbourhood')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="neighbourhood" id="neighbourhood"
                                   :placeholder="$t('Contact.NeighbourhoodPlaceholder')"
                                   class="input-field form-control neighbourhood"
                                   v-model="contactForm.neighbourhood"
                                   @input="updateModel(key, 'neighbourhood',$event.target)"
                                   @keyup="clearError('neighbourhood')"

                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].district }}
                            </div>
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
                            <input type="text" name="proximity" id="proximity"
                                   :placeholder="$t('Contact.ProximityPlaceholder')"
                                   class="input-field form-control proximity"
                                   v-model="contactForm.proximity"
                                   @input="updateModel(key, 'proximity',$event.target)"
                                   @keyup="clearError('proximity')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].proximity }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="district"
                               class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.District')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="district" id="district"
                                   :placeholder="$t('Contact.DistrictPlaceholder')"
                                   class="input-field form-control district"
                                   v-model="contactForm.district"
                                   @input="updateModel(key, 'district',$event.target)"
                                   @keyup="clearError('district')"

                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].district }}
                            </div>
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
                            <input type="text" name="governorate" id="governorate"
                                   :placeholder="$t('Contact.GovernoratePlaceholder')"
                                   class="input-field form-control governorate"
                                   v-model="contactForm.governorate"
                                   @input="updateModel(key, 'governorate',$event.target)"
                                   @keyup="clearError('governorate')"
                            />
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].governorate }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="countryName" class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Common.Country') }}</label>
                        <div class="col-sm-12  col-lg-6">
                            <!-- <input-select name="countryName" inputClass="input-field form-control country"
                                        v-model="contactForm.countryName"
                                        inputId="countryName" :value="contactForm.countryName"
                                        :index="key"
                                        :selectOptions="contactForm.countryOptions" :multiple="false"
                                        @input="grabinput($event.target)"
                                        @keyup="clearError('country')"
                            ></input-select> -->
                            <tree-select
                                v-if="contactForm.directory_country"
                                valueFormat="object"
                                name="countryObj"
                                placeholder="Select.NothingSelected"
                                instanceId="countryObj"
                                :options="countryOptions"
                                :multiple="false"
                                :clearable="true"
                                :searchable="true"
                                :errors="errors[key] ? errors[key].country : ''"
                                :customInnerClass="'col-12'"
                                :value="countrySelected[key]"
                                :index="key"
                                valueConsistsOf="LEAF_PRIORITY"
                            >
                            </tree-select>
                            <tree-select
                                v-else
                                valueFormat="object"
                                name="countryObj"
                                placeholder="Select.NothingSelected"
                                instanceId="countryObj"
                                :options="countryOptions"
                                :multiple="false"
                                :clearable="true"
                                :searchable="true"
                                :errors="errors[key] ? errors[key].country : ''"
                                :customInnerClass="'col-12'"
                                :index="key"
                                valueConsistsOf="LEAF_PRIORITY"
                            >
                            </tree-select>
                            <!-- <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].country }}
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="lat" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.Latitude')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="lat" id="lat"
                                   :placeholder="$t('Contact.LatitudePlaceholder')"
                                   class="input-field form-control lat"
                                   v-model="contactForm.lat"
                                   @input="updateModel(key, 'lat',$event.target)"
                                   @keyup="clearError('lat')"
                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].lat }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="row">
                        <label for="lng" class="col-sm-12  col-lg-6 col-form-label text-right">{{ $t('Contact.Longitude')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="lng" id="lng"
                                   :placeholder="$t('Contact.LongitudePlaceholder')"
                                   class="input-field form-control lng"
                                   v-model="contactForm.lng"
                                   @input="updateModel(key, 'lng',$event.target)"
                                   @keyup="clearError('lng')"
                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].lng }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row form-group">
                <div class="col-sm-6">
                    <div class="row">
                        <label for="pluscode" class="col-sm-12  col-lg-6 col-form-label">{{ $t('Contact.PlusCode')}}</label>
                        <div class="col-sm-12  col-lg-6">
                            <input type="text" name="pluscode" id="pluscode"
                                   :placeholder="$t('Contact.PlusCodePlaceholder')"
                                   class="input-field form-control postal"
                                   v-model="contactForm.pluscode"
                                   @input="updateModel(key, 'pluscode',$event.target)"
                                   @keyup="clearError('pluscode')"
                            >
                            <div v-if="errors[key]" class="text-danger">
                                {{ errors[key].pluscode }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row form-group">
                <label for="email" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Contact.Email')}}</label>
                <div class="col-sm-12  col-lg-9">
                    <input type="text" name="email" id="email"
                            :placeholder="$t('Contact.EmailPlaceholder')"
                            class="input-field form-control email"
                            v-model="contactForm.email"
                            @input="updateModel(key, 'email',$event.target)"
                            @keyup="clearError('email')"
                    >
                    <div v-if="errors[key]" class="text-danger">
                        {{ errors[key].email }}
                    </div>
                </div>
            </div>
            <div class="row form-group">
                <label for="website" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Contact.Website')}}</label>
                <div class="col-sm-12  col-lg-9">
                    <input type="text" name="website" id="website"
                            :placeholder="$t('Contact.WebsitePlaceholder')"
                            class="input-field form-control website"
                            v-model="contactForm.website"
                            @input="updateModel(key, 'website',$event.target)"
                            @keyup="clearError('website')"
                    >
                    <div v-if="errors[key]" class="text-danger">
                        {{ errors[key].website }}
                    </div>
                </div>
            </div>

            <phone :phones="contactForm.phones ? contactForm.phones : []" :errors="errors[key] && errors[key].phones ? errors[key].phones : ''" :contact-form-index="key"/>

            <working-hour :working-hours="contactForm.working_hours ? contactForm.working_hours : []" :errors="errors[key] && errors[key].working_hours ? errors[key].working_hours : {}" :contact-form-index="key"/>

            <contact-trans :languageContents="contactForm.languageContents" :contactIndex="contactForm.id != null?contactForm.id:key"></contact-trans>
            <hr v-if="key < localContactForms.length - 1" />


        </div>
    </div>

</template>

<script>
    import {EventBus} from '../../../eventbus/event-bus.js'
    import inputText from "../../core/form/partials/input-text/input-text.vue"
    import googleMaps from '../../core/form/partials/google-maps/google-maps';
    import Phone from "./phone";
    import WorkingHour from "./workingHour";
    import directoryCountryService from '../../../helpers/directoryCountryService';
    import inputSelect from "./../../core/form/partials/input-select/input-select.vue";
    import treeSelect from '../../core/form/partials/tree-selectbox/tree-selectbox';
    import contactTranslation from "./contactTranslation";

    const directoryCountryServ = new directoryCountryService();

    export default {
        name: "contact-form",
        components: {
            WorkingHour,
            Phone,
            inputText,
            inputSelect,
            googleMaps,
            treeSelect,
            "contact-trans":contactTranslation
        },
        props: {
            contactForms: {
                type: Array,
                required: true,
            },
            errors: {
                default: {}
            }
        },
        data: function () {
            let contactForm =
                {
                    contact_label:"",
                    address_line_one: "",
                    address_line_two: "",
                    countryName: "",
                    countryObj: {},
                    governorate: "",
                    district: "",
                    postal_code: "",
                    email: "",
                    lat: 0,
                    lng: 0,
                    pluscode:"",
                    building_name:"",
                    landmark:"",
                    metro:"",
                    city:"",
                    neighbourhood:"",
                    proximity:"",
                    website:"",
                    phones: [],
                    countryOptions: [],
                    working_hours: [],
                    languageContents:[]
                };

            return {
                // languageContents:[],
                defaultContactForm: contactForm,
                countryOptions: [],
                countrySelected: this.contactForms ? this.contactForms.map((contact) => {
                    return {id: contact.directory_country ? contact.directory_country.id : '', label: contact.directory_country ? contact.directory_country.country : ''}
                }):'',
                localContactForms: this.contactForms
            };
        },
        created: function () {
            this.$eventBus.$on('update-input-field', this.updateModelData);
            this.$eventBus.$on('update-google-maps', this.updateModelData);

            let self = this;
            this.$eventBus.$on('empty-contact-form', function () {
                self.localContactForms = [{
                    contact_label:"",
                    address_line_one: "",
                    address_line_two: "",
                    countryName: "",
                    countryObj: {},
                    governorate: "",
                    district: "",
                    postal_code: "",
                    email: "",
                    is_default:0,
                    lat: 0,
                    lng: 0,
                    pluscode:"",
                    building_name:"",
                    landmark:"",
                    metro:"",
                    city:"",
                    neighbourhood:"",
                    proximity:"",
                    website:"",
                    phones: [],
                    countryOptions: [],
                    working_hours: [],
                    languageContents:[]
                }];
            });
        },
        mounted:function(){
            this.getCountryList();
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];
                if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
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

                    this.defaultContactForm.languageContents.push(langContent);
                }
            }
        },
        methods: {
            getCountryList() {
                directoryCountryServ.getDirectoryCountries().then((data) => {
                    this.countryOptions = data;
                });
            },
            getContactArrData: function () {
                let totalDeleted = 0, other = 0;

                for (let row of this.localContactForms) {

                    if (row.deleted) {
                        totalDeleted += 1;
                    } else {
                        other += 1;
                    }
                }

                return {
                    items: other,
                    deleted: totalDeleted
                };
            },
            showDelete: function () {
                let d = this.getContactArrData();

                return d.items > 1 ? true : false;
            },
            removeContactForm: function (index) {
                if (confirm(this.showDelete() ? 'Are you sure you want to delete this item?' : 'Are you sure you want to reset this item?')) {

                    if (this.localContactForms[index]) {

                        let deleted = this.localContactForms[index];

                        this.localContactForms.splice(index, 1);

                        if (!this.getContactArrData().items) {
                            let def = {
                                contact_label:"",
                                address_line_one: "",
                                address_line_two: "",
                                countryName: "",
                                countryObj: {},
                                governorate: "",
                                district: "",
                                postal_code: "",
                                email: "",
                                is_default:0,
                                lat: 0,
                                lng: 0,
                                pluscode:"",
                                building_name:"",
                                landmark:"",
                                metro:"",
                                city:"",
                                neighbourhood:"",
                                proximity:"",
                                website:"",
                                phones: [],
                                working_hours: [],
                                languageContents:[]
                            };

                            this.$eventBus.$emit('empty-phone', {});
                            this.$eventBus.$emit('empty-working-hours', {});
                            // this.$eventBus.$emit('empty-translations', {});

                            this.localContactForms.push(def);
                        }

                        if (deleted.id) {
                            this.localContactForms.push({
                                id: deleted.id,
                                deleted: true
                            });
                        }
                    }
                }
            },
            clearError: function (name) {
                EventBus.$emit('clear-input-field', {
                    name: name,
                });
            },
            pushData: function () {
                EventBus.$emit('add-to-parent', {
                    name: 'contact_forms',
                    value: this.localContactForms
                });
            },
            updateModel: function (index, key, data) {
                this.localContactForms[index][key] = data.value;
                this.pushData();
            },
            updateModelData: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }

                if (this.localContactForms && this.localContactForms[data.index]) {
                    this.localContactForms[data.index][data.name] = data.value;
                    if(data.name === "countryObj") {
                        this.pushData();
                    }
                }
            },
            isMyScope(data) {
                if (!data.hasOwnProperty("source_component")) {
                    return true;
                }

                if (data.source_component === "public") {
                    return true;
                }

                if (data.source_component === "contact-form") {
                    return true;
                }

                return false;
            },
        }

    }
</script>

<style scoped type="text/css" lang="scss">
    .postal, .country, .district, .governorate {
        height: 40px;
    }

    .contactinfo-container {
        margin-bottom: 20px;
    }

    hr {
        border-top: dashed #c0c0c0;
    }
    /* Customize the label (the container) */
    .isdefault-container {
        display: inline-block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 14px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
        width: 30%;
    }

    /* Hide the browser's default radio button */
    .isdefault-container input {
        position: absolute;
        opacity: 0;
    }

    /* Create a custom radio button */
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
        border-radius: 50%;
    }

    /* On mouse-over, add a grey background color */
    .isdefault-container:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the radio button is checked, add a blue background */
    .isdefault-container input:checked ~ .checkmark {
        background-color: #0072BC;
    }

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the indicator (dot/circle) when checked */
    .isdefault-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the indicator (dot/circle) */
    .isdefault-container .checkmark:after {
        left: 11px;
        top: 7px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }

</style>

<template>
    <!--<div class="component-container">-->

    <component-container :title="title" class="nationality-container">
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="onSubmit">
            <!--nationality content section here form-->
            <input-select name="continent" inputClass="continent" inputLabel="Nationality.Continent"
                          inputId="continent" :value="nationalityModel.continent"
                          :selectOptions="continentOptions"
                          :errors="errors.continent"
                          :change="getCountries"
            ></input-select>

            <input-select name="country" inputClass="country" inputLabel="Common.Country"
                          inputId="country" :value="nationalityModel.country"
                          :selectOptions="countrySelectedOptions"
                          :errors="errors.country"
            ></input-select>
            <input-text name="nationality" inputClass="nationality" inputId="nationality" :placeholder="$t('Nationality.NationalityPlaceholder')"
                    inputLabel="Common.Nationality" :required="false" :errors="errors.nationality"
                    :value="nationalityModel.nationality"></input-text>

            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link tag="a" to="/nationality/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{$t('Common.Cancel')}}
                    </router-link>
                    <loading-button :buttonName="$t(submitBtnLabel)"
                                    :isLoading="submitLoading"
                                    classNames="btn btn-submit"
                                    :isShifted="true"
                                    shiftSize="-350px">
                    </loading-button>
                </div>
            </div>
        </form>
    </component-container>

    <!--</div>-->
</template>
<script>
    import Vue from "vue";
    import componentContainer from '../pages/componentContainer.vue';
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import inputText from "../core/form/partials/input-text/input-text.vue";
    import inputSelect from "../core/form/partials/input-select/input-select.vue";
    import coreFormClass from "../core/form/script";
    import CountryOptions from "./../../helpers/countryList";
    import loadingButton from "../spinner/loading-button.vue";
    import LoadingSpinner from "../spinner/loading-spinner";

    let countryAPI = new API();
    let countries = new CountryOptions();

    export default {
        name: "create-nationality",
        props: {},
        components: {
            LoadingSpinner,
            componentContainer,
            inputSelect,
            inputText,
            loadingButton
        },
        data() {
            return {
                errors: [],
                status: true,
                title: 'Nationality.CreatePageTitle',
                continentOptions: [
                    {value: 'ASIA', text: 'Asia', selected: false},
                    {value: 'EUROPE', text: 'Europe', selected: false},
                    {value: 'CENTRAL AMERICA', text: 'Central America', selected: false},
                    {value: 'NORTH AMERICA', text: 'North America', selected: false},
                    {value: 'SOUTH AMERICA', text: 'South America', selected: false},
                    {value: 'AFRICA', text: 'Africa', selected: false},
                    {value: 'AUSTRALIA', text: 'Australia', selected: false}
                ],
                nationalityModel: {
                    continent: "",
                    country: "",
                    nationality:""
                },
                countrySelectedOptions: [],
                loading: false,
                submitBtnLabel: 'Common.Save',
                submitLoading: false,
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {

            this.getCountries();

            if (this.getId() && !this.isModal) {
                this.retriveUpdateData();
            }
        },
        // ===Computed properties for the component
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);
        },

        // ===Component methods
        methods: {

            getCountries() {

                let continent = this.nationalityModel && this.nationalityModel.continent ? this.nationalityModel.continent : this.continentOptions[0].value;

                const countriesList = countries.countries;

                let theCountries = [];

                for(let country of countriesList)
                {
                    if(country.continent === continent){
                        theCountries.push(country);
                    }
                }

                this.countrySelectedOptions = theCountries;
            },
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Nationality.NationalityCreated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/nationality/list")
                })
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Nationality.NationalityUpdated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/nationality/list")
                })
            },
            failure(error) {
                this.submitLoading = false;
                let errors = error.response.data.errors;

                let err, errs = [];

                for (err in errors) {
                    errs[err] = errors[err][0];
                }

                this.errors = errs;
            },
            updateModel: function (data) {
                this.nationalityModel[data.name] = data.value;
                switch (data.name) {
                    case'continent':

                        this.continentOptions = [
                            {value: 'ASIA', text: 'Asia', selected: data.value == 'ASIA' ? true : false},
                            {value: 'EUROPE', text: 'Europe', selected: data.value == 'EUROPE' ? true : false},
                            {
                                value: 'CENTRAL AMERICA',
                                text: 'Central America',
                                selected: data.value == 'CENTRAL AMERICA' ? true : false
                            },
                            {
                                value: 'NORTH AMERICA',
                                text: 'North America',
                                selected: data.value == 'NORTH AMERICA' ? true : false
                            },
                            {
                                value: 'SOUTH AMERICA',
                                text: 'South America',
                                selected: data.value == 'SOUTH AMERICA' ? true : false
                            },
                            {value: 'AFRICA', text: 'Africa', selected: data.value == 'AFRICA' ? true : false},
                            {value: 'AUSTRALIA', text: 'Australia', selected: data.value == 'AUSTRALIA' ? true : false}
                        ];

                        this.nationalityModel[data.name] = data.value;

                        break;
                    case 'country':
                        this.countrySelectedOptions = [];
                        countries.countries.forEach((country) => {
                            this.countrySelectedOptions.push({
                                value: country.value,
                                text: country.text,
                                selected: country.value === data.value
                            })
                        });
                        this.nationalityModel[data.name] = data.value;
                        break;
                    case 'nationality' :
                        this.nationalityModel[data.name] = data.value;
                    default:
                        let objKeys = Object.keys(this.nationalityModel);
                        if (objKeys.includes(data.name)) {
                            this.nationalityModel[data.name] = data.value;
                        }
                        break;
                }
            },
            onSubmit() {
                this.submitLoading = true;
                if (this.getId()) {
                    countryAPI.createEntity({name: 'api/nationality/' + this.getId()});
                    countryAPI.endpoints.create({
                        continent: this.nationalityModel.continent,
                        country: this.nationalityModel.country,
                        nationality: this.nationalityModel.nationality,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    countryAPI.createEntity({name: 'api/nationality'});
                    countryAPI.endpoints.create({
                        continent: this.nationalityModel.continent,
                        country: this.nationalityModel.country,
                        nationality: this.nationalityModel.nationality,
                    }).then(this.success).catch(this.failure)
                }

            },
            getSuccess({data}) {
                this.loading = false;
                let r, tmp = {};
                tmp = this.nationalityModel;
                for (r in data) {

                    switch (r) {
                        case'continent':
                            this.continentOptions = [
                                {value: 'ASIA', text: 'Asia', selected: data[r] == 'ASIA' ? true : false},
                                {value: 'EUROPE', text: 'Europe', selected: data[r] == 'EUROPE' ? true : false},
                                {
                                    value: 'CENTRAL AMERICA',
                                    text: 'Central America',
                                    selected: data[r] == 'CENTRAL AMERICA' ? true : false
                                },
                                {
                                    value: 'NORTH AMERICA',
                                    text: 'North America',
                                    selected: data[r] == 'NORTH AMERICA' ? true : false
                                },
                                {
                                    value: 'SOUTH AMERICA',
                                    text: 'South America',
                                    selected: data[r] == 'SOUTH AMERICA' ? true : false
                                },
                                {value: 'AFRICA', text: 'Africa', selected: data[r] == 'AFRICA' ? true : false},
                                {value: 'AUSTRALIA', text: 'Australia', selected: data[r] == 'AUSTRALIA' ? true : false}
                            ];
                            this.nationalityModel[r] = data[r];
                            break;

                        case 'country':
                            this.countrySelectedOptions = [];
                            countries.countries.forEach((country) => {
                                this.countrySelectedOptions.push({
                                    value: country.value,
                                    text: country.text,
                                    selected: country.value === data[r]
                                })
                            });
                            this.nationalityModel[r] = data[r];
                            break;
                        case 'nationality':
                            this.nationalityModel[r] = data[r];
                        default:
                            if (data[r]) {
                                this.nationalityModel[r] = data[r];
                            }
                            break;
                    }
                }

            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.title = 'Nationality.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "nationality";
            },
            clearError: function (data) {
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            retriveUpdateData() {
                this.title = 'Nationality.EditNationality';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getfailure);
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/nationality/' + this.getId();
                }
                return env.API_URL + '/api/nationality';
            },
        }

    }
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style scoped type="text/css" lang="scss">
    .btn {
        padding: 7px 74px;
    }

    .btn-submit {
        padding-left: 85px;
        padding-right: 85px;
        background-color: #0072BC;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
        margin-right: 15px;
    }

    .label {
        span {
            font-weight: bold;
            color: rgba(1, 0, 0, 0.65);
            font-size: 14px;
        }
    }
</style>

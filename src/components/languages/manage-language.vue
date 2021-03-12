<template>
    <!--<div class="component-container">-->

    <component-container :title="title" class="language-container">
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="onSubmit">
            <!--country content section here form-->
            <input-text name="name" inputClass="name" inputId="name" :placeholder="$t('Language.NamePlaceholder')"
                    inputLabel="Language.Name" :required="true" :errors="errors.name"
                    :value="languageModel.name"></input-text>
            <input-text name="acronym" inputClass="acronym" inputId="acronym" :placeholder="$t('Language.AcronymPlaceholder')"
                    inputLabel="Language.Acronym" :required="true" :errors="errors.acronym"
                    :value="languageModel.acronym"></input-text>

            <div class="form-group row">
                <label class="col-sm-12  col-lg-3 col-form-label">{{ $t('Language.IsDefault') }}</label>
                <div class="col-sm-12  col-lg-9">
                    <label class="status-container col-lg-3">{{ $t('Common.Yes') }}
                        <input type="radio" v-model="languageModel.is_default" name="is_default" value="1">
                        <span class="checkmark"></span>
                    </label>
                    <label class="status-container col-lg-3">{{ $t('Common.No') }}
                        <input type="radio" v-model="languageModel.is_default" name="IsDefault" value="0">
                        <span class="checkmark"></span>
                    </label>
                    <div v-if="errors.text_direction" class="text-danger">
                        {{ errors.text_direction }}
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <label class="col-sm-12  col-lg-3 col-form-label">{{ $t('Language.TextDirection') }}</label>
                <div class="col-sm-12  col-lg-9">
                    <label class="status-container col-lg-3">{{ $t('Language.RightToLeft') }}
                        <input type="radio" v-model="languageModel.text_direction" name="text_direction" value="rtl">
                        <span class="checkmark"></span>
                    </label>
                    <label class="status-container col-lg-3">{{ $t('Language.LeftToRight') }}
                        <input type="radio" v-model="languageModel.text_direction" name="text_direction" value="ltr">
                        <span class="checkmark"></span>
                    </label>
                    <div v-if="errors.text_direction" class="text-danger">
                        {{ errors.text_direction }}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link tag="a" to="/languages/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{ $t('Common.Cancel')}}
                    </router-link>
                    <loading-button :buttonName="$t(submitBtnLabel)"
                                    :isLoading="submitLoading"
                                    classNames="btn btn-submit btn-success"
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
    import Vue from "vue"
    import componentContainer from '../pages/componentContainer.vue'
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import inputText from "../core/form/partials/input-text/input-text.vue";
    import inputSelect from "../core/form/partials/input-select/input-select.vue";
    import coreFormClass from "../core/form/script";
    import loadingButton from "../spinner/loading-button.vue";
    import LoadingSpinner from "../spinner/loading-spinner";

    let languageApi = new API();

    export default {
        name: "create-country",
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
                title: 'Language.CreatePageTitle',
                languageModel: {
                    name: "",
                    acronym: "",
                    is_active:"1",
                    is_default:0, 
                    text_direction:"ltr"
                },
                loading: false,
                submitBtnLabel: 'Common.Save',
                submitLoading: false,
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-language-create-edit');
            // this.getCountries();

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

            // getCountries() {

            //     let continent = this.countryModel && this.countryModel.continent ? this.countryModel.continent : this.continentOptions[0].value;

            //     const countriesList = countries.countries;

            //     let theCountries = [];

            //     for(let country of countriesList)
            //     {
            //         if(country.continent === continent){
            //             theCountries.push(country);
            //         }
            //     }

            //     this.countrySelectedOptions = theCountries;
            // },
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Language.LanguageCreated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/languages/list")
                })
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Language.LanguageUpdated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/languages/list")
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
                this.languageModel[data.name] = data.value;
            },
            onSubmit() {
                this.submitLoading = true;
                if (this.getId()) {
                    languageApi.createEntity({name: 'api/language/' + this.getId()});
                    languageApi.endpoints.create({
                        name: this.languageModel.name,
                        acronym: this.languageModel.acronym,
                        is_active:this.languageModel.is_active,
                        is_default:this.languageModel.is_default,
                        text_direction:this.languageModel.text_direction,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    languageApi.createEntity({name: 'api/language'});
                    languageApi.endpoints.create({
                        name: this.languageModel.name,
                        acronym: this.languageModel.acronym,
                        is_default:this.languageModel.is_default,
                        is_active:this.languageModel.is_active,
                        text_direction:this.languageModel.text_direction
                    }).then(this.success).catch(this.failure)
                }

            },
            getSuccess({data}) {
                this.loading = false;
                let r, tmp = {};
                tmp = this.languageModel;
                this.languageModel = data;
            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.title = 'Language.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "language";
            },
            clearError: function (data) {
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            retriveUpdateData() {
                this.CreatePageTitle = 'Language.EditLanguage';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getfailure);
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/language/' + this.getId();
                }
                return env.API_URL + '/api/language';
            },
        }

    }
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style scoped type="text/css" lang="scss">
    .btn {
        font-size: 19px;
        padding: 5px 74px;
        color: red;
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
    /* Customize the label (the container) */
    .status-container {
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
    }

    /* Hide the browser's default radio button */
    .status-container input {
        position: absolute;
        opacity: 0;
    }
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
        width: 20px;
        background-color: #eee;
        border-radius: 50%;
    }

    /* On mouse-over, add a grey background color */
    .status-container:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the radio button is checked, add a blue background */
    .status-container input:checked ~ .checkmark {
        background-color: #0072BC;
    }

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the indicator (dot/circle) when checked */
    .status-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the indicator (dot/circle) */
    .status-container .checkmark:after {
        left: 8px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>

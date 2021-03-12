<template>
    <!--<div class="component-container">-->

    <component-container :title="title" class="country-container">
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="onSubmit">
            <!--country content section here form-->
            <input-text name="type_name" inputClass="type_name" inputId="type_name_0" placeholder="DirectoryType.TypePlaceholder"
                    inputLabel="DirectoryType.DirectoryType" :required="false" :errors="errors.type_name"
                    :value="directoryTypeModel.type_name"></input-text>

            <div v-for="(langItem, index) in languageContents" class="row" :key="index">
                <div class="col-lg-12">
                    <h5>{{ langItem.label }}</h5>
                    <input type="hidden" name="language_id" :index="(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                    <input-text name="type_name_0" inputClass="type_name"
                                :inputId="'type_name_'+(index+1)" 
                                :placeholder="$t('DirectoryType.TypePlaceholder')" 
                                :value="langItem.name"
                                v-model="langItem.name"
                                inputLabel="DirectoryType.DirectoryType" 
                                :required="false" 
                                :index="(index+1)" 
                                @input="updateModel(index+1, 'type_name', $event.target)"
                    ></input-text>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link tag="a" to="/country/list"
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
    import Vue from "vue"
    import componentContainer from '../pages/componentContainer.vue'
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import inputText from "../core/form/partials/input-text/input-text.vue";
    import coreFormClass from "../core/form/script";
    import loadingButton from "../spinner/loading-button.vue";
    import LoadingSpinner from "../spinner/loading-spinner";

    let directoryTypeAPI = new API();

    export default {
        name: "create-directory-type",
        props: {},
        components: {
            LoadingSpinner,
            componentContainer,
            inputText,
            loadingButton
        },
        data() {
            return {
                errors: [],
                status: true,
                title: 'DirectoryType.CreatePageTitle',
                directoryTypeModel: {
                    type_name: ""
                },
                loading: false,
                submitBtnLabel: 'Common.Save',
                submitLoading: false,
                languageContents:[],
                theLanguages:[],
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-directory-type-create-edit');

            if (this.getId() && !this.isModal) {
                this.retriveUpdateData();
            }
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];
                if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
                    var langContent = {};
                    langContent.language_id = theItem.id;
                    langContent.label = theItem.name;
                    langContent.name ="";

                    this.languageContents.push(langContent);
                }
            }
        },
        // ===Computed properties for the component
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);
        },

        // ===Component methods
        methods: {

            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: 'Directory Type content Created successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/directory-type/list")
                })
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: 'Directory Type content updated successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then( () => {
                    this.$router.replace("/directory-type/list")
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
                this.directoryTypeModel[data.name] = data.value;

                if(data.index > 0) {
                    this.languageContents[data.index-1]['name'] = data.value;
                }
            },
            onSubmit() {
                this.submitLoading = true;
                let langTranslations = [];

                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                })[0];

                for(var i = 0; i < this.languageContents.length; i++) {
                    var theItem = this.languageContents[i];
                    var langTrans = {};

                    if(theItem.language_id !== defaultLang.id) {
                        langTrans.language_id = theItem.language_id;
                        langTrans.name = theItem.name;

                        langTranslations.push(langTrans);
                    }
                }

                langTranslations.push({language_id:defaultLang.id, name:this.directoryTypeModel.type_name});

                if (this.getId()) {
                    directoryTypeAPI.createEntity({name: 'api/directory-type/' + this.getId()});
                    directoryTypeAPI.endpoints.create({
                        type_name: this.directoryTypeModel.type_name,
                        translations: langTranslations,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    directoryTypeAPI.createEntity({name: 'api/directory-type'});
                    directoryTypeAPI.endpoints.create({
                        type_name: this.directoryTypeModel.type_name,
                        translations: langTranslations
                    }).then(this.success).catch(this.failure)
                }

            },
            getSuccess({data}) {
                this.loading = false;
                let r, tmp = {};
                tmp = this.directoryTypeModel;
                for (r in data) {
                    if (data[r]) {
                        this.directoryTypeModel[r] = data[r];
                    }
                }
                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                });

                let translations = data.translations;
                for(var i = 0; i < translations.length; i++) {
                    let theItem = translations[i];

                    for(var j = 0; j < this.languageContents.length; j++) {
                        if(defaultLang.length > 0 && defaultLang[0].id != this.languageContents[j].language_id &&  this.languageContents[j].language_id == theItem.language_id) {
                            this.languageContents[j].name = theItem.name;
                            break;
                        }
                    }
                }
            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.title = 'DirectoryType.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "directory-type"
            },
            clearError: function (data) {
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            retriveUpdateData() {
                this.title = 'DirectoryType.UpdatePageTitle';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getfailure, '?with[]=translations');
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/directory-type/' + this.getId();
                }
                return env.API_URL + '/api/directory-type';
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
</style>

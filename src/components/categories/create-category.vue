<template>
    <!--<div class="component-container">-->

    <component-container :title="title" class="category-container">
        <!-- Add FAQ Main Details -->
        <loading-spinner v-if="loading" :isLoading="loading"></loading-spinner>
        <form v-else v-on:submit.prevent="onSubmit">
            <!--<white-container title="General Information">-->

            <input-text
                    name="name"
                    inputClass="service"
                    inputId="service_0"
                    :placeholder="$t('ServiceCategory.NamePlaceholder')"
                    :value="categoryModel.name"
                    inputLabel="ServiceCategory.ServiceCategory"
                    :required="false"
                    :errors="errors.name"
                    :index=0
            ></input-text>

            <input-text
                    name="sub_categoryText"
                    inputClass="subcategory"
                    :value="categoryModel.sub_categoryText"
                    inputId="Subcategory"
                    :placeholder="$t('ServiceCategory.SubCategoryPlaceholder')"
                    inputLabel="ServiceCategory.SubCategory"
                    :required="false"
                    :errors="errors.children"
                    :index=0
            ></input-text>

            <div class="form-group row">
                <label class="col-sm-12  col-lg-3 col-form-label">{{$t('ServiceCategory.CategoryIcon')}}</label>
                <div class="col-sm-2  col-lg-1 ">
                    <span  class="iconPicker__selectedIcon" v-bind:class="categoryModel.icon"></span>
                </div>
                <div class="col-sm-10  col-lg-8 ">
                    <icon-picker v-on:selectIcon="GetIcon"></icon-picker>
                </div>
            </div>

            <div v-for="(langItem, index) in languageContents" class="row">
                <div class="col-lg-12">
                    <h5>{{ langItem.label }}</h5>
                    <input type="hidden" name="language_id" :index="(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                    <input-text
                            name="name"
                            inputClass="service"
                            :inputId="'service_'+(index+1)"
                            :placeholder="$t('ServiceCategory.NamePlaceholder')"
                            :value="langItem.name"
                            inputLabel="ServiceCategory.ServiceCategory"
                            :required="false"
                            :index="(index+1)" 
                            v-model="langItem.name"
                            @input="updateModel(index+1, 'name', $event.target)"
                    ></input-text>

                    <input-text
                            name="sub_categoryText"
                            inputClass="subcategory"
                            :value="langItem.sub_categoryText"
                            :inputId="'Subcategory_'+(index+1)"
                            :placeholder="$t('ServiceCategory.SubCategoryPlaceholder')"
                            inputLabel="ServiceCategory.SubCategory"
                            :required="false"
                            :index="(index+1)" 
                            v-model="langItem.sub_categoryText"
                            @input="updateModel(index+1, 'sub_categoryText', $event.target)"
                    ></input-text>
                </div>
            </div>

            <!--</white-container>-->
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link tag="a" to="/categories/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{$t('Common.Cancel')}}
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
    import inputText from "../core/form/partials/input-text/input-text.vue"
    import API from "../APIs/AbstractAPIs";
    import {
        EventBus
    } from '../../eventbus/event-bus.js';
    import WhiteContainer from "../pages/whiteContainer.vue";
    import coreFormClass from "../core/form/script"
    import iconPicker from "../core/iconPicker/iconPicker.vue";
    import loadingButton from "../spinner/loading-button.vue";
    import LoadingSpinner from "../spinner/loading-spinner";


    let catAPI = new API();
    export default {
        // ===Component name
        name: "create-service-category",
        // ===Props passed to component
        props: {},
        // ===Components used by this component
        components: {
            LoadingSpinner,
            WhiteContainer,
            componentContainer,
            inputText,
            'icon-picker': iconPicker,
            loadingButton
        },
        // ===component Data properties
        data() {
            return {
                title: 'ServiceCategory.CreatePageTitle',
                errors: [],
                categoryModel: {
                    name: "",
                    children: [],
                    sub_categoryText: "",
                    icon: "fa-home",
                },
                oldModel:{
                    name:"",
                    sub_categoryText:""
                },
                languageContents:[],
                theLanguages:[],
                submitBtnLabel: "Common.Save",
                loading: false,
                submitLoading: false
            };
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            document.querySelector('body').setAttribute('id', 'page-categories-create-edit');
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
            this.langLocale = localStorage.getItem('lang_locale');

            for(var i=0; i < this.theLanguages.length; i++) {
                var theItem = this.theLanguages[i];

                if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
                    var langContent = {};
                    langContent.language_id = theItem.id;
                    langContent.label = theItem.name;
                    langContent.name ="";
                    langContent.sub_categoryText = "";

                    this.languageContents.push(langContent);
                }
            }

            if (this.getId()) {
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
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('ServiceCategory.CategoryCreated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    localStorage.removeItem('categories');
                    this.$store.state.categories = [];
                    this.$store.commit('categories');
                    this.$router.replace('/categories/list');
                })
            },
            clearError: function (data) {
                // if (this.errors[data.name]) {
                //     this.errors[data.name] = '';
                //     this.$forceUpdate();
                // }
                    this.$forceUpdate();
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('ServiceCategory.CategoryUpdated'),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    localStorage.removeItem('categories');
                    this.$store.state.categories = [];
                    this.$store.commit('categories');
                    this.$router.replace('/categories/list');
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
            GetIcon(selectedIcon) {
                this.categoryModel.icon = selectedIcon.className;
                // console.log(selectedIcon);
            },

            updateModel: function (data) {
                if(data.index > 0) {
                    this.languageContents[data.index-1][data.name] = data.value;
                } else {
                    this.categoryModel[data.name] = data.value;
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

                        var subCats = theItem.sub_categoryText.replace(/,(\s+)?$/, '');
                        var theSubCats = subCats.split(',');
                        var catChildren = [];
                        for(var j = 0; j < theSubCats.length; j++) {
                            catChildren.push(theSubCats[j]);
                        }
                        langTrans.children = catChildren;

                        langTranslations.push(langTrans);
                    }
                }

                subCats = this.categoryModel.sub_categoryText.replace(/,(\s+)?$/, '');
                theSubCats = subCats.split(',');
                langTranslations.push({language_id:defaultLang.id, name:this.categoryModel.name, children:theSubCats});

                if (this.getId()) {
                    this.reformatSubCategory('update');
                    catAPI.createEntity({
                        name: 'api/service-category/' + this.getId()
                    });
                    catAPI.endpoints.create({
                        name: this.categoryModel.name,
                        children: this.categoryModel.children,
                        icon: this.categoryModel.icon,
                        translations:langTranslations,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                } else {
                    this.reformatSubCategory('create');
                    catAPI.createEntity({
                        name: 'api/service-category'
                    });
                    catAPI.endpoints.create({
                        name: this.categoryModel.name,
                        children: this.categoryModel.children,
                        icon: this.categoryModel.icon,
                        translations:langTranslations,

                    }).then(this.success).catch(this.failure)
                }
            },
            reformatSubCategory: function (action) {

                let str = this.categoryModel.sub_categoryText.replace(/,(\s+)?$/, '');
                let arr = str.split(',');
                let len = arr.length;

                if (action === "create") {
                    this.categoryModel.children = [];
                    for (let i = 0; i < len; i++) {
                        this.categoryModel.children.push({
                            name: arr[i].trim(),
                        });
                    }
                }
                else if (action === 'update') {

                    let subcategories = [];

                    let validIds = this.categoryModel.children != null && this.categoryModel.children.length ? this.categoryModel.children.map((item) => item.id) : [];

                    for (let i = 0; i < len; i++) {
                        let subcat = { name: arr[i] };
                        let id = validIds.shift();
                        if (id !== undefined) {
                            subcat.id = id;
                        }
                        subcategories.push(subcat);
                    }

                    if(this.categoryModel.sub_categoryText.length == 0) {
                        let childrenList = this.categoryModel.children != null && this.categoryModel.children.length ? this.categoryModel.children.map((item) => item.id) : [];

                        subcategories = childrenList.map((item)=>{
                            return {'id':item, 'deleted':true};
                        });
                    } else if (validIds.length) {
                        subcategories = subcategories.concat(validIds.map((item) => {
                            return { "id": item, "deleted": true };
                        }));
                    }


                    this.categoryModel.children = subcategories;
                }
            },
            getsuccess({data}) {
                this.loading = false;

                this.categoryModel.name = data.name;
                this.categoryModel.icon = data.icon;
                this.categoryModel.children = data.children;
                this.categoryModel.sub_categoryText = data.children != null?data.children.map(function (n) {
                    return n.name;
                }).join():'';

                this.oldModel.name = this.categoryModel.name;
                this.oldModel.sub_categoryText = this.categoryModel.sub_categoryText;

                let categoryChildren = [];
                let defaultLang = this.theLanguages.filter((item)=>{
                    return (item.is_default == 1);
                })[0];

                for(var i = 0; i < this.theLanguages.length; i++) {
                    let languageItem = this.theLanguages[i];
                    let childCategories = data.children != null ? data.children.map((item) => {
                        let childTranslations = item.translations.length > 0? item.translations:[];

                        if(childTranslations.length > 0) {
                            let translatedText = childTranslations.filter((childItem) => {
                                if(childItem.language_id == languageItem.id) {
                                    return childItem.name;
                                }
                            });

                            if(translatedText) {
                                return translatedText[0].name;
                            }
                        }
                    }):[];

                    let childItem = {};
                    childItem.language_id = languageItem.id;
                    childItem.sub_categoryText = childCategories.join(' , ');

                    categoryChildren.push(childItem);
                }

                let categoryTranslations = data.translations;
                for(var i = 0; i < categoryTranslations.length; i++) {
                    let translationItem = categoryTranslations[i];
                    for(var j = 0; j < this.languageContents.length; j++) {
                        if(defaultLang.length > 0 && defaultLang.id != this.languageContents[j].language_id && this.languageContents[j].language_id == translationItem.language_id) {
                            this.languageContents[j].name = translationItem.name;
                        }
                    }

                    for(var j = 0; j < categoryChildren.length; j++) {
                        if(defaultLang.length > 0 && defaultLang.id != this.languageContents[j].language_id && categoryChildren[j].sub_categoryText != '' && this.languageContents[j].language_id == categoryChildren[j].language_id) {
                            this.languageContents[j].sub_categoryText = categoryChildren[j].sub_categoryText;
                        }
                    }

                }
            },
            getfailure(e) {
                console.log(e);
                this.$router.replace('/404');
            },
            getId() {
                if(this.$route.params.id)
                    this.title = 'ServiceCategory.UpdatePageTitle';
                return this.$route.params.id;
            },
            getModule() {
                return "service-category"
            },
            getQuery() {
                return "?with[]=children&with[]=translations&with[]=children.translations"
            },
            retriveUpdateData() {
                this.title = 'Edit Category';
                this.submitBtnLabel = 'Common.Update';
                this.loading = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getsuccess, this.getfailure, this.getQuery());
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/service-category/' + this.getId();
                }
                return env.API_URL + '/api/service-category';
            },
        },
    };
</script>


<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style lang="scss" scoped>
    .btn {
        font-size: 19px;
        padding: 5px 74px;
    }

    .btn-submit {
        background-color: #0072BC;
        padding-left: 85px;
        padding-right: 85px;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
        margin-right: 15px;
    }

    .iconPicker__selectedIcon {
        width: 40px;
        height: 40px;
        padding: 0px;
        margin: 0 12px 12px 0;
        font-size: 32px;
        color: #0072BC;
    }
</style>

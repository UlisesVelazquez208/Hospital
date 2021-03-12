<template>
    <!--<div class="component-container">-->

    <component-container :title="CreatePageTitle" class="media-container">

        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <!-- Add FAQ Main Details -->
        <form v-else v-on:submit.prevent="onSubmit">
            <!--media content section here form-->
            <input-text name="title" inputClass="media-title" :value="mediaModel.title"
                        inputId="title" placeholder="Media.TitlePlaceholder" :errors="errors.title"
                        inputLabel="Media.Title" :required="false"
                        :sourceComponent="getComponentName()"
            ></input-text>

            <div class="form-group row">
                <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Media.Description')}}</label>
                <div class="col-sm-12 col-lg-9">
                    <vue-editor v-model="mediaModel.description" name="description" :errors="errors.description" :value="mediaModel.description" :sourceComponent="getComponentName()"></vue-editor>
                    <div v-if="errors.description" class="text-danger">
                        {{errors.description}}
                    </div>
                </div>
            </div>


            <input-select name="language_id" inputClass="media-language" inputLabel="Language.Name"
                          inputId="mediaLanguage" :value="mediaModel.language_id+''" :errors="errors.language"
                          :selectOptions="availableLanguages"
                          :sourceComponent="getComponentName()"
            ></input-select>

            <input-select name="content_type" inputClass="media-type" inputLabel="Media.ContentType"
                          inputId="mediaType" :value="mediaModel.content_type" :errors="errors.content_type"
                          :selectOptions="mediaContentTypeOption"
                          :sourceComponent="getComponentName()"
            ></input-select>
            
            <input-text name="url" inputClass="media-url"
                        inputId="url" placeholder="Media.ContentUrlPlaceholder" :value="mediaModel.url"
                        :errors="errors.url"
                        inputLabel="Media.ContentUrl" :required="false" v-if="!dropzoneOptions.visible"
                        :sourceComponent="getComponentName()"
            ></input-text>

            <tree-select valueFormat="object" name="service_categories" placeholder="Select.NothingSelected" instanceId="service_categories"
                     :value="preSelectedServiceCategories" :errors="errors.service_categories"
                     :options="categoryOptions" :multiple="true" :clearable="true" :searchable="true" :flat="true"
                     inputLabel="Common.ServiceCategory" valueConsistsOf="ALL"></tree-select>

            <tree-select valueFormat="object" name="nationality" placeholder="Select.NothingSelected" instanceId="nationality" :value="preselectedNationalities" :options="nationalityOptions" :multiple="true" :clearable="true" :searchable="true" :errors="errors.nationality"
                        inputLabel="Common.Nationality" valueConsistsOf="LEAF_PRIORITY"></tree-select>

            <tree-select valueFormat="object" name="country" placeholder="Select.NothingSelected" instanceId="country"
                        :options="countryOptions" :multiple="true" :clearable="true" :searchable="true" :errors="errors.country" :value="preselectedCountries"
                        inputLabel="Common.Country" valueConsistsOf="LEAF_PRIORITY"></tree-select>

            <div class="img-container" v-if="dropzoneOptions.visible">
                <div class="row form-group">
                    <label class="col-sm-3 col-form-label">
                        Upload Image
                    </label>
                    <div class="col-sm-9">
                        <div class="form-group ">
                            <!--@TODO style image list-->
                            <!--<div class=""><img src="http://via.placeholder.com/350x150"></div>-->
                            <vue-dropzone ref="imgUploader" id="dropzone-media-content"
                                          :options="dropzoneOptions"
                                          @vdropzone-sending="sendingEvent"
                                          @vdropzone-complete="afterComplete"
                                          @vdropzone-error="dropzoneErrorEvent"
                                          @vdropzone-file-added="dropzoneAddFileEvent"
                                          autoProcessQueue  :useCustomSlot=true
                                          v-if="showDropfile"
                            >
                                <div class="dropzone-custom-content">
                                    <i class='fa fa-5x fa-files-o'></i>
                                    <h5 class="dropzone-custom-title">{{ $t('Common.DragFile') }}</h5>
                                </div>
                            </vue-dropzone>
                            <div v-if="dropzoneValidation.visible" class="text-danger">
                                {{dropzoneValidation.posterValid}}
                            </div>
                        </div>
                        <div v-if="errors.file" class="text-danger">
                            {{ errors.file }}
                        </div>
                    </div>

                </div>
            </div>
            <div class="img-placeholder" v-if="dropzoneOptions.visible && this.getId() && this.mediaModel.url">
                <div class="row form-group">
                    <label class="col-sm-3 col-form-label">
                        Uploaded Image
                    </label>
                    <div class="col-sm-9">
                        <div class="form-group">
                            <!--@TODO style image list-->
                            <img class="img-thumbnail img-fluid" :src="this.mediaModel.url"
                                style="width:250px;height:auto;"><br/><br/>
                            <button class="btn btn-secondary btn-danger btn-remove" type="button" @click="removeMediaItem()">Remove Media Item</button>
                        </div>
                    </div>
                    <div v-if="errors" class="text-danger">
                        {{errors.image}}
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3 mt-3">
                    <router-link v-if="!isModal" tag="a" to="/media/list"
                                 class="btn btn-cancel pull-left btn-lg ">{{$t('Common.Cancel')}}
                    </router-link>
                    <loading-button :buttonName="$t(SaveUpdateValue)"
                                    :isLoading="loading"
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
    import Vue from "vue";
    import componentContainer from '../pages/componentContainer.vue';
    import coreFormClass from "../core/form/script";
    import {EventBus} from '../../eventbus/event-bus.js';
    import API from "../APIs/AbstractAPIs";
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';
    import inputText from "../core/form/partials/input-text/input-text.vue";
    import inputTextarea from "../core/form/partials/input-textarea/input-textarea.vue";
    import inputSelect from "../core/form/partials/input-select/input-select.vue";
    import treeSelect from "../core/form/partials/tree-selectbox/tree-selectbox.vue";
    import loadingButton from "../spinner/loading-button.vue";
    import env from '../../Env';
    import LoadingSpinner from "../spinner/loading-spinner";
    import countriesService from "./../../helpers/countryService";
    import nationalityService from "./../../helpers/nationalityService";
    import categoriesService from "./../../helpers/categoryService";
    import { VueEditor } from "vue2-editor";

    let mediaAPI = new API();
    const countryserv = new countriesService();
    const nationalityserv = new nationalityService();
    const catserv = new categoriesService();


    export default {
        // ===Component name
        name: "create-media-content",
        // ===Props passed to component
        props: {
            isModal: {
                type: Boolean,
                default: false
            },
            // mediaModel:{
            //     type:Object,
            //     required:false
            // }
        },
        // ===Components used by this component
        components: {
            LoadingSpinner,
            componentContainer,
            vueDropzone: vue2Dropzone,
            inputText,
            inputTextarea,
            inputSelect,
            loadingButton,
            treeSelect,
            VueEditor
        },
        // ===component Data properties            EventBus.$on('clear-input-field', this.clearError);

        data: function () {
            return this.initialState();
        },
        // ===Code to be executed when Component is mounted
        mounted() {
            if (this.getId() && !this.isModal) {
                this.retriveUpdateData();
            }
        },

        // ===Component methods
        methods: {
            initialState() {
                return {
                    categoryOptions: [],
                    countryOptions: [],
                    nationalityOptions:[],
                    preSelectedCountries:[],
                    preSelectedNationalities:[],
                    preSelectedServiceCategories:[],
                    availableLanguages:[],
                    dropzoneValidation: {
                        visible: false,
                        posterValid: "there is no poster attached"
                    },
                    errors: [],
                    CreatePageTitle: "Media.CreatePageTitle",
                    SaveUpdateValue: 'Common.Save',
                    mediaContentTypeOption: [
                        {value: 'AUDIO', text: 'Audio', selected: false},
                        {value: 'VIDEO', text: 'Video', selected: false},
                        {value: 'POSTER', text: 'Poster', selected: false},
                        {value: 'PDF', text: 'Portable Document Format (PDF)', selected: false}
                    ],
                    allowedUploadTypes: [
                        'PDF',
                        'POSTER'
                    ],
                    ShowImagePlaceHolder: false,
                    mediaModel: {
                        url: "",
                        title: "",
                        description: "",
                        language_id:'',
                        content_type: "AUDIO",
                        nationality:[],
                        country:[],
                        service_categories:[]
                    },
                    dropzoneOptions: {
                        url: this.getAPIUrl(),
                        thumbnailWidth: 150,
                        maxFilesize: 5,
                        addRemoveLinks: true,
                        maxFiles: 1,
                        acceptedFiles: "image/*",
                        autoProcessQueue: false,
                        headers: {
                            "Authorization": localStorage.getItem('token_type') + " " + localStorage.getItem('access_token'),
                            'Cache-Control': null,
                            'X-Requested-With': null
                        },
                        visible: false
                    },
                    loading: false,
                    loadingSpinner: false,
                    showDropfile: true
                };
            },
            grabinput: function (data) {
                EventBus.$emit('update-input-field', {
                    name: data.target.name,
                    value: data.target.value
                });
            },
            removeMediaItem:function() {
                mediaAPI.createEntity({name: '/api/media/remove-media/' + this.getId()});
                mediaAPI.endpoints.get().then(this.unsetMedia).catch(this.failure);
            },
            unsetMedia:function({data}) {
                this.mediaModel.url = data.url;
            },
            preSelectedNationality: function () {
                let _countries  = this.mediaModel.nationalities ? this.mediaModel.nationalities.map(a => {return {id: a.id, label: a.nationality}} ) : [];
                this.preselectedNationalities = _countries;
            },

            preSelectedService: function () {
                let _categories = this.mediaModel.service_categories ? this.mediaModel.service_categories.map(a => { return {id: a.id, label: a.name} }) : [];
                this.preSelectedServiceCategories = _categories;
            },

            preSelectedCont: function () {
                let _countries  = this.mediaModel.countries ? this.mediaModel.countries.map(a => {return {id: a.id, label: a.country}} ) : [];
                this.preselectedCountries = _countries;
            },
            resetModel() {
                Object.assign(this.$data, this.initialState());
            },
            clearError: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            },
            success({data}) {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Media.ContentCreated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    if (this.isModal == false) {
                        this.$router.replace('/media/list/');
                    } else {
                        this.$emit('processDone');
                        this.resetModel();
                        location.reload();
                    }
                })
            },
            update() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.$parent.$t('Media.ContentUpdated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    this.$router.replace('/media/list/');
                })
            },
            failure(error) {
                let errors = error.response.data.errors;
                this.handleFailure(errors);
            },
            handleFailure(errors){
                this.loading = false;
                let err, errs = [];
                for (err in errors) {
                    errs[err] = errors[err][0];
                }

                this.errors = errs;
            },
            updateModel: function (data) {
                if (!this.isMyScope(data)) {
                    return;
                }

                switch (data.name) {
                    case 'content_type':
                        this.mediaContentTypeOption = [
                            {value: 'AUDIO', text: 'Audio', selected: data.value == 'AUDIO' ? true : false},
                            {value: 'VIDEO', text: 'Video', selected: data.value == 'VIDEO' ? true : false},
                            {value: 'POSTER', text: 'Poster', selected: data.value == 'POSTER' ? true : false},
                            {value: 'PDF', text: 'Portable Document Format (PDF)', selected: data.value == 'PDF' ? true : false}
                        ];
                        this.mediaModel[data.name] = data.value;
                        this.showDropfile = false;
                        this.errors.file = '';
                        setTimeout(() => {
                            this.showDropfile = true;
                        }, 100);
                        break;
                    default:
                        let objKeys = Object.keys(this.mediaModel);
                        if (objKeys.includes(data.name)) {
                            this.mediaModel[data.name] = data.value;
                        }
                        break;
                }
            },
            sendingEvent(file, xhr, formData) {
                const _nationalities =this.mediaModel.nationality.map((a) => a.id);
                const _countries = this.mediaModel.country.map((a) => a.id);
                const _service_categories = this.mediaModel.service_categories.map((a) => a.id);
                let i = 0;

                formData.append('title', this.mediaModel.title);
                formData.append('description', this.mediaModel.description);
                formData.append('language_id', this.mediaModel.language_id);

                for(i = 0; i < _nationalities.length; i++) {
                    formData.append('nationalities[]', _nationalities[i]);
                }
                for(i = 0; i < _countries.length; i++) {
                    formData.append('countries[]', _countries[i]);
                }

                for(i = 0; i < _service_categories.length; i++) {
                    formData.append('service_categories[]', _service_categories[i]);
                }

                // formData.append('nationalities', this.mediaModel.nationality);
                // formData.append('countries', this.mediaModel.country);
                formData.append('content_type', this.mediaModel.content_type);
                if (this.getId()) {
                    formData.append('_method', 'PATCH');
                }
            },
            dropzoneErrorEvent(file, message, xhr) {
                if(typeof message === 'object') {
                    if(message.errors && message.errors.file) {
                        document.getElementById('dropzone-media-content').querySelector('.dz-error-message span').textContent = message.errors.file[0];
                    } else {
                        document.getElementById('dropzone-media-content').querySelector('.dz-error-message').classList.add('d-none');
                    }
                } else {
                    let newMessage  = document.getElementById('dropzone-media-content').querySelector('.dz-error-message span').innerText;
                    newMessage = newMessage.replace(/MiB/g, 'MB');
                    document.getElementById('dropzone-media-content').querySelector('.dz-error-message span').textContent = newMessage;

                    if(newMessage.search('File is too big') !== -1){
                        let errorMessage = '';
                        if(this.mediaModel.content_type === "POSTER") {
                            errorMessage = 'The Image file may not be greater than 5MB.';
                        } else if(this.mediaModel.content_type === "PDF") {
                            errorMessage = 'The PDF file may not be greater than 20MB.';
                        }
                        this.handleFailure({file: [errorMessage]});
                    }
                }
            },
            dropzoneAddFileEvent(file) {
                this.handleFailure({file: ['']});
            },
            onSubmit() {
                let self = this;
                this.loading = true;
                let serviceCategories = this.mediaModel.service_categories.length > 0? this.mediaModel.service_categories.map((a)=> a.id):[];

                if (this.allowedUploadTypes.includes(this.mediaModel.content_type)) {
                    if ((this.getId()) && (this.$refs.imgUploader.getQueuedFiles().length === 0)) {
                        mediaAPI.createEntity({name: '/api/media/' + this.getId()});
                        mediaAPI.endpoints.create({
                            url: this.mediaModel.url,
                            title: this.mediaModel.title,
                            description: this.mediaModel.description,
                            content_type: this.mediaModel.content_type,
                            language_id:this.mediaModel.language_id,
                            nationalities: this.mediaModel.nationality.map((a) => a.id),
                            countries: this.mediaModel.country.map((a) => a.id),
                            service_categories: serviceCategories,
//                            @TODO file attribute is Required and how to send it
                            poster_update: true,
                            _method: "PATCH"
                        }).then(this.update).catch(this.failure)
                    }
                    else {
                        if (!(this.$refs.imgUploader.getQueuedFiles().length === 0)) {
                            this.$refs.imgUploader.processQueue();
                        }
                        else {
                            this.loading = false;
                        }
                    }
                }
                else {
                    if (this.getId()) {
                        mediaAPI.createEntity({name: 'api/media/' + this.getId()});
                        mediaAPI.endpoints.create({
                            title: this.mediaModel.title,
                            description: this.mediaModel.description,
                            language_id:this.mediaModel.language_id,
                            content_type: this.mediaModel.content_type,
                            nationalities: this.mediaModel.nationality.map((a) => a.id),
                            countries: this.mediaModel.country.map((a) => a.id),
                            service_categories: serviceCategories,
                            // service_categories: this.mediaModel.service_categories === null ? [] : this.mediaModel.service_categories.map((a) => a.id),
                            url: this.mediaModel.url,
                            _method: "PATCH"
                        }).then(this.update).catch(this.failure);
                    }
                    else {
                        mediaAPI.createEntity({name: 'api/media'});
                        mediaAPI.endpoints.create({
                            title: this.mediaModel.title,
                            description: this.mediaModel.description,
                            language_id:this.mediaModel.language_id,
                            content_type: this.mediaModel.content_type,
                            nationalities: this.mediaModel.nationality.map((a) => a.id),
                            countries: this.mediaModel.country.map((a) => a.id),
                            service_categories: serviceCategories,
                            // service_categories: this.mediaModel.service_categories === null ? [] : this.mediaModel.service_categories.map((a) => a.id),
                            url: this.mediaModel.url,
                        }).then(this.success).catch(this.failure);
                    }
                }
            },
            setVisiblity() {
                if (this.allowedUploadTypes.includes(this.mediaModel.content_type)) {
                    this.dropzoneOptions.visible = false;

                    let dropZoneOptions = this.dropzoneOptions;

                    if(this.mediaModel.content_type === 'POSTER'){
                        dropZoneOptions.acceptedFiles = 'image/*';
                        dropZoneOptions.maxFilesize = 5;
                    }else{
                        dropZoneOptions.acceptedFiles = '.pdf';
                        dropZoneOptions.maxFilesize = 20;
                    }

                    this.dropzoneOptions = dropZoneOptions;
                    this.dropzoneOptions.visible = true;
                    // setTimeout(function() {
                    //     this.dropzoneOptions = dropZoneOptions;
                    //     this.dropzoneOptions.visible = true;
                    // },500)
                } else {
                    this.dropzoneOptions.visible = false;
                }
            },
            setPlaceHolderVisibility() {
                if (this.mediaModel.content_type === "POSTER") {
                    this.ShowImagePlaceHolder = true;
                }

            },
            getsuccess({data}) {
                let r, tmp = {};

                tmp = this.mediaModel;

                this.loadingSpinner = false;

                for (r in data) {

                    switch (r) {
                        case 'content_type':
                            this.mediaContentTypeOption = [
                                {value: 'AUDIO', text: 'Audio', selected: data[r] == 'AUDIO' ? true : false},
                                {value: 'VIDEO', text: 'Video', selected: data[r] == 'VIDEO' ? true : false},
                                {value: 'POSTER', text: 'Poster', selected: data[r] == 'POSTER' ? true : false},
                                {value: 'PDF', text: 'Portable Document Format (PDF)', selected: data[r] == 'PDF' ? true : false},
                            ];
                            tmp[r] = data[r];
                            break;
                        default:
                            if (data[r]) {
                                this.mediaModel[r] = data[r];
                            }
                            break;
                    }
                }

                this.setVisiblity();
                this.setPlaceHolderVisibility();
                this.preSelectedCont();
                this.preSelectedService();
                this.preSelectedNationality();
                this.setAvailableLanguage();

            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                return this.$route.params.id;
            },
            getModule() {
                return "media";
            },
            retriveUpdateData() {
                this.CreatePageTitle = 'Media.EditMediaContent';
                this.SaveUpdateValue = 'Common.Update';
                this.loadingSpinner = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getsuccess, this.getfailure, '?with[]=language&with[]=nationalities&with[]=countries&with[]=serviceCategories');
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/media/' + this.getId();
                }
                return env.API_URL + '/api/media';
            },
            afterComplete(response) {
                if(response.status === 'error'){
                    if(response.xhr) {
                        return this.handleFailure(JSON.parse(response.xhr.response).errors);
                    }
                    return;
                }

                return this.afterCompleteSuccess();

            },
            afterCompleteSuccess(){
                let self = this;
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: 'Media content created successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(function () {
                    if (self.isModal == false) {
                        self.$router.replace('/media/list/');
                    } else {
                        self.$emit('processDone');
                        self.resetModel();
                        location.reload();
                    }
                })
            },
            isMyScope(data) {
                if (!data.hasOwnProperty("source_component")) {
                    return true;
                }

                if (data.source_component === "public") {
                    return true;
                }

                if (data.source_component === "create-media-content") {
                    return true;
                }

                return false;
            },
            getComponentName() {
                return "create-media-content";
            },
            setAvailableLanguage() {
                let availLanguages = JSON.parse(localStorage.getItem('languages'));
                let langList = [];
                let preSelectedLanguage = this.mediaModel.language_id != null? this.mediaModel.language_id :'';

                langList = availLanguages.map((item) => {
                    return {value:item.id, text: item.name, selected: preSelectedLanguage != null && preSelectedLanguage == item.id? true:false};
                });

                this.availableLanguages = langList;
            }
        },
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-input-field', this.setVisiblity);
            EventBus.$on('clear-input-field', this.clearError);

            countryserv.getCountries().then((data) => {
                this.countryOptions = data;
            });

            nationalityserv.getNationalities().then((data) => {
                this.nationalityOptions = data;
            });

            catserv.getAllCategories().then((data) => {
                this.categoryOptions = data;
            });

            this.preSelectedCont();
            this.preSelectedService();
            this.preSelectedNationality();
            this.setAvailableLanguage();
            // this.setVisiblity();
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

    .media-container {
        .upload-label {
            font-size: 14px;
            font-weight: bold;
            color: rgba(1, 0, 0, 0.65);
        }
    }

    .img-placeholder {
        margin: 10px 0;
    }
    .btn-remove {
        padding: 3px 10px;
        margin-top:10px;
        width: auto;
        border: none;
        font-size: 14px;
        background-color:#ff0000;
        color: #fff;
    }
    .btn-remove:hover{
        color:#f0f0f0;
        background-color:#b90c0c;
    }

</style>

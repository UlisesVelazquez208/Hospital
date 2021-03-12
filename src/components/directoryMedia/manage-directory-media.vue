<template>
    <component-container :title="CreatePageTitle" class="media-container">
        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>
        <form v-else v-on:submit.prevent="onSubmit">
            <input-text name="title" inputClass="media-title" :value="mediaModel.title"
                        inputId="title" placeholder="DirectoryMedia.TitlePlaceholder" :errors="errors.title"
                        inputLabel="DirectoryMedia.Title" :required="false"
                        :sourceComponent="getComponentName()"
            ></input-text>

            <div class="form-group row">
                <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{ $t('DirectoryMedia.Description')}}</label>
                <div class="col-sm-12 col-lg-9">
                    <vue-editor v-model="mediaModel.description" name="description" :errors="errors.description" :value="mediaModel.description" :sourceComponent="getComponentName()"></vue-editor>
                    <div v-if="errors.description" class="text-danger">
                        {{errors.description}}
                    </div>
                </div>
            </div>

            <div class="img-container" v-if="dropzoneOptions.visible">
                <div class="row form-group">
                    <label class="col-sm-3 col-form-label">
                        {{$t('DirectoryMedia.UploadMediaTitle')}}
                    </label>
                    <div class="col-sm-9">
                        <div class="form-group ">
                            <!--@TODO style image list-->
                            <!--<div class=""><img src="http://via.placeholder.com/350x150"></div>-->
                            <vue-dropzone
                                ref="imgUploader"
                                id="dropzone-directory-logo"
                                :options="dropzoneOptions"
                                @vdropzone-sending="sendingEvent"
                                @vdropzone-complete="afterComplete"
                                @vdropzone-error="dropzoneErrorEvent"
                                @vdropzone-file-added="dropzoneAddFileEvent"
                                autoProcessQueue  :useCustomSlot=true
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
                        {{$t('DirectoryMedia.UploadedMediaTitle')}}
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
                    <router-link v-if="!isModal" tag="a" to="/directory-media/list"
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
        name: "manage-directory-media-content",
        props: {
            isModal: {
                type: Boolean,
                default: false
            }
        },
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
        data: function () {
            return this.initialState();
        },
        created: function () {
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-input-field', this.setVisiblity);
            EventBus.$on('clear-input-field', this.clearError);
        },
        mounted() {
            if (this.getId() && !this.isModal) {
                this.retriveUpdateData();
            }
        },
        methods: {
            initialState() {
                return {
                    dropzoneValidation: {
                        visible: false,
                        posterValid: "There is no poster attached"
                    },
                    errors: [],
                    CreatePageTitle: "DirectoryMedia.CreatePageTitle",
                    SaveUpdateValue: 'Common.Save',
                    ShowImagePlaceHolder: true,
                    mediaModel: {
                        url: "",
                        title: "",
                        description: ""
                    },
                    dropzoneOptions: {
                        url: this.getAPIUrl(),
                        thumbnailWidth: 150,
                        maxFilesize: 2,
                        addRemoveLinks: true,
                        maxFiles: 1,
                        acceptedFiles: "image/*",
                        autoProcessQueue: false,
                        headers: {
                            "Authorization": localStorage.getItem('token_type') + " " + localStorage.getItem('access_token'),
                            'Cache-Control': null,
                            'X-Requested-With': null
                        },
                        visible: true
                    },
                    loading: false,
                    loadingSpinner: false,
                };
            },
            grabinput: function (data) {
                EventBus.$emit('update-input-field', {
                    name: data.target.name,
                    value: data.target.value
                });
            },
            removeMediaItem:function() {
                // mediaAPI.createEntity({name: '/api/directory-media/remove-media/' + this.getId()});
                // mediaAPI.endpoints.get().then(this.unsetMedia).catch(this.failure);
                this.unsetMedia();
            },
            unsetMedia:function() {
                this.mediaModel.url = '';
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
                    title: this.$parent.$t('DirectoryMedia.ContentCreated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    if (this.isModal == false) {
                        this.$router.replace('/directory-media/list/');
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
                    title: this.$parent.$t('DirectoryMedia.ContentUpdated'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    this.$router.replace('/directory-media/list/');
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

                let objKeys = Object.keys(this.mediaModel);
                if (objKeys.includes(data.name)) {
                    this.mediaModel[data.name] = data.value;
                }
            },
            sendingEvent(file, xhr, formData) {
                formData.append('title', this.mediaModel.title);
                formData.append('description', this.mediaModel.description);
                if (this.getId()) {
                    formData.append('_method', 'PATCH');
                }
            },
            dropzoneErrorEvent(file, message, xhr) {
                if(typeof message === 'object') {
                    if(message.errors && message.errors.file) {
                        document.getElementById('dropzone-directory-logo').querySelector('.dz-error-message span').textContent = message.errors.file[0];
                    } else {
                        document.getElementById('dropzone-directory-logo').querySelector('.dz-error-message').classList.add('d-none');
                    }
                } else {
                    let newMessage  = document.getElementById('dropzone-directory-logo').querySelector('.dz-error-message span').innerText;
                    newMessage = newMessage.replace(/MiB/g, 'MB');
                    document.getElementById('dropzone-directory-logo').querySelector('.dz-error-message span').textContent = newMessage;
                    if(newMessage.search('File is too big') !== -1) {
                        this.handleFailure({file: [`The Image file may not be greater than ${this.dropzoneOptions.maxFilesize}MB.`]});
                        this.$forceUpdate();
                    }
                }
            },
            dropzoneAddFileEvent(file) {
                this.handleFailure({file: ['']});
            },
            onSubmit() {
                this.loading = true;
                if (this.getId() && this.$refs.imgUploader.getQueuedFiles().length === 0) {
                    mediaAPI.createEntity({name: '/api/directory-media/' + this.getId()});
                    mediaAPI.endpoints.create({
                        title: this.mediaModel.title,
                        description: this.mediaModel.description,
                        url: this.mediaModel.url,
                        is_update: true,
                        _method: "PATCH"
                    }).then(this.update).catch(this.failure)
                }
                else {
                    if(this.$refs.imgUploader.getQueuedFiles().length !== 0) {
                        this.$refs.imgUploader.processQueue();
                    } else {
                        this.loading = false;
                    }
                }
            },
            setVisiblity() {
                this.dropzoneOptions.visible = false;

                let dropZoneOptions = this.dropzoneOptions;
                dropZoneOptions.acceptedFiles = 'image/*';

                this.dropzoneOptions = dropZoneOptions;
                this.dropzoneOptions.visible = true;
            },
            getsuccess({data}) {
                let r, tmp = {};

                tmp = this.mediaModel;

                this.loadingSpinner = false;

                for (r in data) {
                    if (data[r]) {
                        this.mediaModel[r] = data[r];
                    }
                }

                this.setVisiblity();

            },
            getfailure() {
                this.$router.replace('/404');
            },
            getId() {
                return this.$route.params.id;
            },
            getModule() {
                return "directory-media";
            },
            retriveUpdateData() {
                this.CreatePageTitle = 'DirectoryMedia.EditMediaContent';
                this.SaveUpdateValue = 'Common.Update';
                this.loadingSpinner = true;
                coreFormClass.getData(this.getId(), this.getModule(), this.getsuccess, this.getfailure, '');
            },
            getAPIUrl() {
                if (this.getId()) {
                    return env.API_URL + '/api/directory-media/' + this.getId();
                }
                return env.API_URL + '/api/directory-media';
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
                    title: 'Directory Logo content created successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(function () {
                    if (self.isModal == false) {
                        self.$router.replace('/directory-media/list/');
                    } else {
                        self.$emit('processDone');
                        self.resetModel();
                        location.reload();
                    }
                });
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
        }
    }
</script>

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

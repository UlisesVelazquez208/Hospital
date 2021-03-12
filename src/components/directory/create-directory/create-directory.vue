<template>
    <component-container :title="pageTitle" class="directory-container" :class="{ 'modal-component': isModal }">
        <notifications classes="custom-notification notification vue-notification" group="saveResponse"/>
        <loading-spinner v-if="loadFormContent" :is-loading="loadFormContent" />
        <form v-else v-on:submit.prevent>
            <white-container title="Directory.GeneralInformation">
                <div class="form-group row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <input-text name="name" inputClass="directory-name"
                                    inputId="name" placeholder="Directory.NamePlaceholder"
                                    inputLabel="Directory.Name"
                                    inputLabelClass="col-sm-12 col-lg-3 col-form-label"
                                    inputWrapClass="col-sm-12 col-lg-9"
                                    :required="true"
                                    :index=0
                                    :errors="errors.name"
                                    :value="directoryModel.name"
                                    :sourceComponent="getComponentName()"
                        ></input-text>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <input-text name="alternative_name" inputClass="alternativeName"
                                    inputId="alternative_name" placeholder="Directory.AlternativeNamePlaceholder"
                                    inputLabel="Directory.AlternativeName"
                                    inputLabelClass="col-sm-12 col-lg-3 col-form-label"
                                    inputWrapClass="col-sm-12 col-lg-9"
                                    :required="false"
                                    :index=0
                                    :errors="errors.alternativeName"
                                    :value="directoryModel.alternative_name"
                                    :sourceComponent="getComponentName()"
                        ></input-text>
                    </div>
                </div>
                <div class="form-group row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <input-text name="acronym" inputClass="directory-name"
                                    inputId="acronym" placeholder="Directory.AcronymPlaceholder"
                                    inputLabel="Directory.Acronym"
                                    inputLabelClass="col-sm-12 col-lg-3 col-form-label"
                                    inputWrapClass="col-sm-12 col-lg-9"
                                    :required="false"
                                    :index=0
                                    :errors="errors.acronym"
                                    :value="directoryModel.acronym"
                                    :sourceComponent="getComponentName()"
                        >
                        </input-text>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{$t('Directory.Description')}}</label>
                    <div class="col-sm-12 col-lg-9">
                        <vue-editor v-model="directoryModel.description" name="description"
                            :required="true"
                            :errors="errors.description"
                            :value="directoryModel.description"
                            :sourceComponent="getComponentName()"
                        >
                        </vue-editor>
                        <div v-if="errors.description" class="text-danger">
                            {{errors.description}}
                        </div>
                    </div>
                </div>
                <input-select :required="false" name="directory_type"
                              inputClass="directory-type" inputLabel="Directory.Type" inputId="directoryType"
                              :selectOptions="directoryTypeOptions"
                              :errors="errors.directory_type"
                              :sourceComponent="getComponentName()"
                ></input-select>
                <tree-select name="service_category"
                            valueFormat="object"
                            :multiple="true"
                            :options="service_category_options"
                            instanceId="service_category"
                            :clearable="true"
                            :searchable="true"
                            :flat="true"
                            inputLabel="Common.ServiceCategory"
                            placeholder="Select.NothingSelected"
                            :value="directoryModel.service_category"
                            :errors="errors.service_category"
                            valueConsistsOf="ALL"
                            :sourceComponent="getComponentName()"
                ></tree-select>
                <div class="toggle-btn-container">
                    <div class="row form-group">
                        <label class="col-sm-3 col-form-label">
                            {{ $t('Directory.Status') }}
                        </label>
                        <div class="col-sm-3">
                            <div class="toggle-btn">
                                <toggle-button v-model="directoryModel.status" :value="directoryModel.status"
                                               :labels="{checked: $t('Directory.Active'), unchecked: $t('Directory.Inactive')}"
                                               :width="80" :color="{checked: '#00d092', unchecked: '#dc6460'}"/>
                            </div>
                            <div v-if="errors" class="text-danger">
                                {{errors.status}}
                            </div>
                        </div>

                    </div>
                </div>

                <input-select
                    name="media_id"
                    inputClass="media-id"
                    inputLabel="Directory.Image"
                    inputId="directoryMedia"
                    :required="false"
                    :selectOptions="directoryMediaOptions"
                    :errors="errors.media_id"
                    :sourceComponent="getComponentName()"
                    :disabled="disableMediaIDSelect"
                ></input-select>

                <div class="row form-group">
                    <label class="col-form-label col-sm-3">
                        {{ $t('Directory.OrAttachImage')}}
                    </label>
                    <div class="col-sm-9">
                        <div class="form-group row">
                            <div class="col-sm-8">
                                <vue-dropzone ref="imgUploader" id="dropzone-directory"
                                              :options="dropzoneOptions"
                                              @vdropzone-sending="sendingEvent"
                                              @vdropzone-complete="queueComplete"
                                              @vdropzone-removed-file="fileDeleted"
                                              @vdropzone-error="dropzoneErrorEvent"
                                              @vdropzone-file-added="dropzoneAddFileEvent"
                                              autoProcessQueue :useCustomSlot=true
                                >
                                    <div class="dropzone-custom-content">
                                        <i class='fa fa-5x fa-files-o'></i>
                                        <h5 class="dropzone-custom-title">{{ $t('Common.DragFile') }}</h5>
                                    </div>
                                </vue-dropzone>
                                <div v-if="errors.file" class="text-danger">
                                    {{errors.file}}
                                </div>
                            </div>
                            <div class="col-sm-4 img-placeholder" v-if="this.directoryModel.image">
                                <div class="row ">
                                    <div class="col-sm-2">
                                        <div class="upload-label">
                                            <!--<span>Uploaded Image :</span>-->
                                        </div>
                                    </div>

                                    <div class="col-sm-10">
                                        <div class="form-group ">
                                            <!--@TODO style image list-->
                                            <div class="">
                                                <img
                                                    class="img-thumbnail float-left img-fluid"
                                                    :src="this.directoryModel.image"
                                                    style="width:auto;height:auto;max-height: 180px;"
                                                />
                                                <br/><br/>
                                                <button class="btn btn-directory btn-secondary btn-danger btn-remove" type="button" @click="removeImage()">Remove Picture</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="errors" class="text-danger">
                            {{errors.image}}
                        </div>
                    </div>
                </div>
            </white-container>

            <dir-translations :languageContents="languageContents" v-if="languageContents.length > 0"></dir-translations>

            <white-container title="Hashtag.Hashtag" sectionClass="hashtags-list" v-if="!isModal">
                <input-multi-select v-bind:value="value" name="hashtag-content" inputLabel="FAQ.HashtagTitle"
                                    inputId="hashtag-content" inputplaceholder="FAQ.HashtagTitlePlaceholder"
                                    :selectOptions="selectHashtags"
                >
                    <template slot="noResult">not found</template>
                </input-multi-select>

                <div class="selected-list-edit">
                    <div class="row">
                        <div class="col-sm-12 col-lg-9 offset-lg-3">
                            <ul>
                                <li v-for="(item, index) in value" :key="index" >
                                    <div class="">
                                        <div class="">
                                            <h4 class="directory-title">{{item.hashtag}}</h4>
                                        </div>
                                    </div>
                                    <span class="custom__remove " @click="removelink(index)">x</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- <div class="details"
                    v-if="!isModal && (!isUpdateMode() || (isUpdateMode()))"
                >
                    <div class="row">
                        <div class=" col-sm-12">
                            <h5 class="header">Can't find your hashtag in our database?</h5>
                            <component-as-modal showModalButton="Add new Hashtag"
                                                componentName="createHashTag"
                                                @processDone="onProcessDone">
                            </component-as-modal>
                        </div>
                    </div>
                </div> -->


            </white-container>

        <social-media :directoryModel="directoryModel" :errors="errors"></social-media>

        <white-container title="Contact.ContactInformation">
            <div class="mb-3">
                <button @click="addNewContactForm()" type="button" class="btn add-form btn-secondary pull-right">
                    + {{ $t('Contact.AddContactInformation')}}
                </button>
                <!--<hr/>-->
            </div>

            <contact-form :contact-forms="directoryModel.contact_forms" :errors="errors.contact_forms ? errors.contact_forms : {}" />

        </white-container>

            <div class="row">
                <div class="col-sm-6">
                    <router-link v-if="!isModal" tag="a" to="/directory/list"
                                    class="btn btn-cancel pull-right btn-lg">{{ $t('Common.Cancel')}}
                    </router-link>
                </div>
                <div class="col-sm-6">
                    <div class="form-group text-left">
                        <loading-button :buttonName="$t(submitBtnLabel)"
                                        v-on:click="onSaveDirectory()"
                                        :isLoading="loading"
                                        classNames="btn btn-submit"
                                        :isShifted="true"
                                        shiftSize="-250px">
                        </loading-button>
                    </div>
                </div>
            </div>
        </form>
    </component-container>
</template>
<script>
    // import Vue from "vue";
    import Directory from "./directory-script.js";

    export default Directory;
</script>
<!-- styles -->

<!-- adding scoped attribute will apply the css to this component only -->
<style type="text/css" lang="scss">
    .hashtags-list {
        .multiselect__option--highlight {
            background: #1E8FCD;
        }
        .multiselect__option--highlight:after {
            background: #1E8FCD;
            color: #fff
        }
        .multiselect__tags-wrap {
            display: none;
        }
        .details-link {
            background-color: #fff;
            border: 2px solid #1E8FCD;
            color: #1E8FCD;
            padding: 8px 35px;
            margin-top: 15px;
        }
        .selected-list-edit {
            ul {
                list-style: none;
                padding: 0;
                margin: 20px 0px;
            }
            li {
                display: inline;
                float: left;
                position: relative;

                .directory-title {
                    display: block;
                    padding: 10px;
                    /* border: 1px solid red; */
                    margin-right: 10px;
                    margin-bottom: 10px;
                    /*margin-left: 15px;*/
                    background-color: #E1EFF5;
                    border-radius: 4px;
                    color: #000;
                    font-weight: bold;
                    font-size: 14px;
                }


            }
            .custom__remove {
                position: absolute;
                top: -8px;
                right: 2px;
                background-color: #b4231e;
                border-radius: 50%;
                color: #fff;
                width: 15px;
                height: 15px;
                text-align: center;
                padding-top: 0px;
                /*z-index: 1;*/
                font-size: 10px;
                line-height: 13px;
                font-weight: 700;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    .btn-directory{
        font-size: 20px;
        padding: 10px 70px;
    }
    .btn-cancel{
        padding: 7px 70px;
    }

    .btn-submit {
        background-color: #0072BC;
    }

    .custom-notification {
        margin-top: 20% !important;
        margin-right: 7% !important;
    }

    .btn-cancel {
        background-color: #fff;
        border: 1px solid #0072BC;
        color: #0072BC;
    }

    .toggle-btn-container {
        margin: 7px 0;
    }

    .label {
        font-size: 14px;
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
    }

    .add-btn {
        background-color: #0C83C6;
        padding: 5px 5px;
        width: 100%;
        border: none;
    }
    .add-btn:hover {
        background-color: #0b5d8c;
    }

    .add-form {
        padding: 5px 15px;
        background-color: #0C83C6;
        position: absolute;
        width: auto;
        right: 15px;
        top: -45px;
        border: none;
        font-size: 15px;
    }

    .add-form:hover {
        background-color: #0b5d8c;
        border:none;
    }

    .phone-list, .working-hours-list {
        ul {
            list-style: none;
            padding: 0;
            margin: 20px 0px;
        }
        li {
            padding: 15px 15px;
            /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
            margin: 7px 0;

        }
        .custom__remove {
            color: #0C83C6;
            &:hover {
                cursor: pointer;

            }
        }

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

    .white-section.hashtags-list {
        .white-section_details {
            padding: 25px 0 35px;

        }
    }
</style>

<template>
    <component-container :title="getTitle()" class="user-container">

        <white-container title="User.GeneralInformation">

            <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

            <form v-else v-on:submit.prevent="">

                <!-- FIRST NAME -->
                <input-text inputId="user_first_name" inputClass="first-name"
                            inputLabel="User.FirstName" placeholder=""
                            name="user_first_name" :value="userModel.user_first_name" :errors="errors.first_name"
                            :required="false"
                >
                </input-text>

                <!-- LAST NAME -->
                <input-text inputId="user_last_name" inputClass="last-name"
                            inputLabel="User.LastName" placeholder=""
                            name="user_last_name" :value="userModel.user_last_name" :errors="errors.last_name"
                            :required="false"
                >
                </input-text>

                <!-- EMAIL -->
                <input-text inputId="user_email" inputClass="email"
                            inputLabel="User.Email" placeholder=""
                            name="user_email" :value="userModel.user_email" :errors="errors.email"
                            :required="false"
                >
                </input-text>

                <!-- PASSWORD -->
                <div v-if="(isProfileMode() || isUpdateMode()) && !editPassword" class="password-readonly-container">
                    <div class="row">
                        <label class="col-sm-12  col-lg-3 col-form-label">
                            <span>{{ $t('User.Password')}}</span>
                        </label>
                        <div class="col-sm-12  col-lg-9">
                            &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                            <span @click="editPassword = !editPassword" class="editPassword fa fa-pencil "></span>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <input-text type="password"
                                inputId="password" inputClass="password"
                                inputLabel="User.Password" placeholder=""
                                name="user_password" :value="userModel.user_password" :errors="errors.password"
                                :required="false"
                    >
                    </input-text>

                    <input-text type="password"
                                inputId="user_confirm_password" inputClass="confirm-password"
                                inputLabel="User.ConfirmPassword" placeholder=""
                                name="user_confirm_password" :value="userModel.user_confirm_password"
                                :errors="errors.password_confirmation"
                                :required="false"
                    >
                    </input-text>
                </div>
                <b-row>
                    <b-col cols="3">
                        <label for="user_type" class="col-form-label">{{ $t('User.SelectType') }}</label>
                    </b-col>
                    <b-col cols="7">
                        <!-- USER TYPE -->
                        <input-select v-if="!isProfileMode()"
                                      inputId="user_type" inputClass="user-type"
                                      inputLabel="" placeholder="Select User Type..."
                                      name="user_type" :selectOptions="userTypeSelectedOptions" :errors="errors.type"
                                      :required="false"
                        >
                        </input-select>
                        <div v-else>
                            <div class="row">
                                <div class="col-sm-12  col-lg-9">
                                    {{userModel.user_type}}
                                </div>
                            </div>
                            <div class="row" v-if="userModel.user_type === 'PARTNER' && userModel.directory != null">
                                <div class="col-sm-12  col-lg-9">
                                    {{userModel.directory.name}}
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col cols="2" v-if="userModel.user_type === 'PARTNER' && directorySelectedOptions.length">
                        <!-- Directory Types -->
                        <input-select v-if="!isProfileMode()"
                                      inputId="directory_id" inputClass="directory_id"
                                      inputLabel="" placeholder="Select User Directory..."
                                      name="directory_id" :selectOptions="directorySelectedOptions"
                                      :errors="errors.directory_id"
                                      :required="false"
                        >
                        </input-select>
                    </b-col>
                </b-row>
                <tree-select valueFormat="object" name="countries" placeholder="Select.NothingSelected" instanceId="countries" :value="preSelectedCountries"
                            :options="countryOptions" :multiple="true" :clearable="true" :searchable="true" :errors="errors.countries"
                            inputLabel="Common.Country" valueConsistsOf="LEAF_PRIORITY"></tree-select>

                <b-row>
                    <b-col cols="3">
                        <label for="language_id" class="col-form-label">{{ $t('User.Language') }}</label>
                    </b-col>
                    <b-col cols="7">
                        <!-- USER TYPE -->
                        <input-select
                                      inputId="language_id" inputClass="user-language"
                                      inputLabel="" placeholder="Select Language..."
                                      name="language_id" :selectOptions="languageSelectedOptions" :errors="errors.language_id"
                                      :required="false"
                        >
                        </input-select>
                    </b-col>
                </b-row>

                <template v-if="userModel.user_type === 'STAFF'">
                    <!-- USER GROUP -->
                    <input-multi-select v-if="!isProfileMode()"
                                        inputId="user_group_id"
                                        :value="userModel.user_groups"
                                        inputLabel="User.UnitGroup"
                                        inputplaceholder=""
                                        name="user_groups"
                                        :selectOptions="userGroupSelectedOptions"
                                        :errors="errors.groups"
                                        track-by="value" label="name"
                    >
                    </input-multi-select>
                    <div v-else>
                        <div class="row">
                            <label class="col-sm-12  col-lg-3 col-form-label">
                                <span>{{ $t('User.UnitGroup') }}</span>
                            </label>
                            <div class="col-sm-12  col-lg-9">
                                {{userModel.user_groups.map((group) => group.name).join(', ')}}
                            </div>
                        </div>
                    </div>
                </template>

                <!-- USER ROLE -->
                <input-multi-select v-if="!isProfileMode()"
                                    inputId="user_roles" :value="userModel.user_roles"
                                    inputLabel="User.Role" inputplaceholder=""
                                    name="user_roles" :selectOptions="userRoleSelectedOptions" :errors="errors.roles"
                                    track-by="value" label="name"
                >
                </input-multi-select>

                <div v-if="!isProfileMode()" class="toggle-btn-container">
                    <div class="row">
                        <label class="col-sm-12  col-lg-3 col-form-label">
                            <span>{{ $t('User.Status')}}</span>
                        </label>
                        <div class="col-sm-12  col-lg-9">
                            <div class="toggle-btn">
                                <toggle-button v-model="userModel.user_status" :sync="true"
                                               :labels="{checked: 'Active', unchecked: 'Inactive'}"
                                               :width="80" :color="{checked: '#00d092', unchecked: '#dc6460'}"/>
                            </div>
                            <div v-if="errors" class="text-danger">
                                {{errors.status}}
                            </div>
                        </div>

                    </div>
                </div>

                <div class="row user-avatar-container">
                    <label class="col-sm-12  col-lg-3 col-form-label">
                        <span>{{ $t('User.ProfilePicture') }}</span>
                    </label>
                    <div class="col-sm-12  col-lg-9">
                        <div class="form-group row">
                            <div class="col-sm-8">
                                <vue-dropzone ref="user_avatar"
                                              id="user_avatar"
                                              @vdropzone-sending="sendingEvent"
                                              @vdropzone-success="queueComplete"
                                              @vdropzone-removed-file="fileDeleted"
                                              @vdropzone-error="dropzoneErrorEvent"
                                              autoProcessQueue
                                              :options="dropzoneOptions"
                                ></vue-dropzone>
                            </div>
                            <div class="col-sm-4 img-placeholder"
                                 v-if="(this.isUpdateMode() || this.isProfileMode()) && userModel.user_avatar">
                                <div class="form-group ">
                                    <div class="">
                                        <img class="img-thumbnail float-left img-fluid"
                                             :src="this.userModel.user_avatar"
                                             style="width:auto;height:180px;">
                                    </div>
                                </div>
                            </div>
                            <div v-else class="col-sm-4 img-placeholder">
                                <div class="form-group ">
                                    <div class="">
                                        <img class="img-thumbnail float-left img-fluid rounded-circle"
                                             :src="require('img/authors/default_user.png')"
                                             style="width:auto;height:180px;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group text-right">
                                <loading-button v-on:click="onCancel"
                                                buttonName="Common.Cancel"
                                                :isLoading="false"
                                                classNames="btn faq-draft faq-submit btn-success"
                                >
                                </loading-button>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group text-left">
                                <loading-button v-on:click="onSubmit"
                                                :buttonName="isUpdateMode() || isProfileMode() ? $t('Common.Update') : $t('Common.Save')"
                                                :isLoading="isLoading"
                                                classNames="btn faq-submit btn-success"
                                >
                                </loading-button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        </white-container>

    </component-container>
</template>

<script>
    import componentContainer from '../pages/componentContainer.vue';
    import whiteContainer from '../pages/whiteContainer.vue';
    import inputText from "../../../src/components/core/form/partials/input-text/input-text.vue";
    import treeSelect from "./../core/form/partials/tree-selectbox/tree-selectbox.vue";
    import inputSelect from "../../../src/components/core/form/partials/input-select/input-select.vue";
    import vue2Dropzone from 'vue2-dropzone';
    import 'vue2-dropzone/dist/vue2Dropzone.min.css';
    import env from "../../../src/Env.js";
    import API from "../APIs/AbstractAPIs.js";
    import {EventBus} from '../../eventbus/event-bus.js';
    import loadingButton from "../spinner/loading-button.vue";
    import inputMultiSelect from "../core/form/partials/input-multiselect/input-multiselect.vue";
    import LoadingSpinner from "../../../src/components/spinner/loading-spinner.vue";
    import i18n from "./../../i18n";
    import countriesService from "./../../helpers/countryService";

    let contServ = new countriesService();

    export default {
        name: "manage-user",
        props: {},
        components: {
            componentContainer,
            whiteContainer,
            inputText,
            inputSelect,
            treeSelect,
            vueDropzone: vue2Dropzone,
            loadingButton,
            inputMultiSelect,
            LoadingSpinner
        },
        data() {
            return {
                loadingSpinner: true,
                userModel: {
                    user_first_name: null,
                    user_last_name: null,
                    user_email: null,
                    user_password: null,
                    user_confirm_password: null,
                    user_type: null,
                    directory_id: null,
                    language_id:null,
                    user_groups: [],
                    user_roles: [],
                    user_status: null,
                    user_avatar: null,
                    countries:[]
                },
                userTypeSelectedOptions: [
                    {text: "PARTNER", value: "PARTNER", selected: false},
                    {text: "STAFF", value: "STAFF", selected: false}
                ],
                directorySelectedOptions: [],
                userGroupSelectedOptions: [],
                userRoleSelectedOptions: [],
                languageSelectedOptions:[],
                errors: [],
                isLoading: false,
                dropzoneOptions: {
                    url: env.API_URL + '/api/media/upload-file',
                    acceptedFiles: "image/*",
                    maxFiles: "1",
                    maxFilesize: 5,
                    addRemoveLinks: true,
                    thumbnailWidth: 150,
                    dictDefaultMessage: "<i class='fa fa-5x fa-files-o'></i><h5>Drag files here or browse your computer</h5>",
                    autoProcessQueue: true,
                    headers: {
                        "Authorization": localStorage.getItem('token_type') + " " + localStorage.getItem('access_token'),
                        'Cache-Control': null,
                        'X-Requested-With': null
                    },
                },
                editPassword: false,
                countryOptions:[],
                preSelectedCountries:[]
            }
        },
        created: function () {
            // Listen to any input/change on the form fields
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-multi-select', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);

            contServ.getCountries().then((data) => {
                this.countryOptions = data;
            });

        },
        async mounted() {
            await this.getGroupsOptions();
            await this.getRolesOptions();

            if (this.isUpdateMode() || this.isProfileMode()) {
                await this.retrieveUserData();
                this.preSelectedCont();
            }
            await this.getDirectories();

            await this.getLanguages();

            this.loadingSpinner = false;
        },
        methods: {
            preSelectedCont: function () {
                let _countries  = this.userModel.countries ? this.userModel.countries.map(a => {return {id: a.id, label: a.country}} ) : [];
                this.preSelectedCountries = _countries;
            },
            async getDirectories() {
                if (this.directorySelectedOptions.length) {
                    return this.directorySelectedOptions;
                }
                let api = new API, self = this;
                api.createEntity({"name": "api/directory?paginate=0"});
                return api.endpoints.getAll().then(function ({data}) {
                    self.directorySelectedOptions = data.map(function (directory) {
                        return {
                            value: directory.id,
                            text: directory.name,
                            selected: self.userModel.directory_id === directory.id
                        };
                    });
                }).catch(function (e) {
                    console.log(e)
                });
            },
            async getLanguages() {
                if (this.languageSelectedOptions.length) {
                    return this.languageSelectedOptions;
                }
                let api = new API, self = this;
                api.createEntity({"name": "api/language?paginate=0"});
                return api.endpoints.getAll().then(function ({data}) {
                    self.languageSelectedOptions = data.map(function (directory) {
                        return {
                            value: directory.id,
                            text: directory.name,
                            selected: self.userModel.language_id === directory.id
                        };
                    });
                }).catch(function (e) {
                    console.log(e)
                });
            },
            /**
             * HTML Rendering Data
             */
            getTitle() {
                if (this.isUpdateMode()) {
                    return "User.UpdatePageTitle";
                } else if (this.isProfileMode()) {
                    return "User.ViewMyProfile";
                } else {
                    return "User.CreatePageTitle";
                }
            },
            getSuccessMessage() {
                if (this.isUpdateMode()) {
                    return this.$parent.$t("User.UserUpdated");
                } else if (this.isProfileMode()) {
                    return this.$parent.$t("Profile.ProfileUpdated");
                } else {
                    return this.$parent.$t("User.UserCreated");
                }
            },
            /**
             * Form Preparation Methods
             */
            async getGroupsOptions() {
                var api = new API;
                api.createEntity({"name": "api/group"});
                return api.endpoints
                    .get()
                    .then(({data}) => {
                        this.userGroupSelectedOptions = data.entities.map((entity) => {
                            return {name: entity.group_name, id: entity.id};
                        });
                    })
                    .catch(function () {
                    });
            },
            async getRolesOptions() {
                var api = new API;
                api.createEntity({"name": "api/role"});
                return api.endpoints
                    .get()
                    .then(({data}) => {
                        this.userRoleSelectedOptions = data.entities.map((entity) => {
                            return {name: entity.name, id: entity.id};
                        });
                    })
                    .catch(function () {
                    });
            },
            /**
             * Handle User Interactions with the form
             **/
            // Update User Model
            updateModel: function (data) {
                this.userModel[data.name] = data.value;
            },
            clearError: function (data) {
                let key = data.name.replace("user_", "");
                if (this.errors[key]) {
                    this.errors[key] = '';
                }
            },
            /**
             * Form Mode Methods
             **/
            getModuleName() {
                return "user";
            },
            isCreateMode() {
                return this.$route.path.search("create-user") !== -1;
            },
            isProfileMode() {
                return this.$route.path.search("user_profile") !== -1;
            },
            isUpdateMode() {
                return this.$route.path.search("update-user") !== -1;
            },
            getUserId() {
                if (this.isUpdateMode()) {
                    return this.$route.params.user_id;
                }
                if (this.isProfileMode()) {
                    return JSON.parse(localStorage.user).id;
                }
                return false;
            },
            retrieveUserData() {
                var api = new API;
                api.createEntity({"name": "api/user/" + this.getUserId() + "?with[]=groups&with[]=roles&with[]=directory&with[]=countries"});
                return api.endpoints.get().then(({data}) => {
                    this.userModel.user_first_name = data.first_name;
                    this.userModel.user_last_name = data.last_name;
                    this.userModel.user_email = data.email;
                    this.userModel.language_id = data.language_id;
                    this.userModel.countries = data.countries;

                    this.userModel.user_avatar = data.avatar;
                    this.userModel.user_status = data.status == "ACTIVE";

                    this.userModel.user_type = data.type;
                    this.userModel.directory_id = data.directory_id;
                    this.userModel.directory = data.directory;
                    this.userTypeSelectedOptions.find((item) => item.value === data.type).selected = true;

                    if (data.groups) {
                        this.userModel.user_groups = data.groups.map((group) => {
                            return {id: group.id, name: group.group_name}
                        });
                    }
                    if (data.roles) {
                        this.userModel.user_roles = data.roles.map((role) => {
                            return {id: role.id, name: role.name}
                        });
                    }
                }).catch((e) => {
                    console.log(e);
                    this.$router.replace('/404');
                });
            },
            /**
             * Form Submission/Cancellation Methods
             **/
            // Create User Form
            onSubmit: function () {

                this.isLoading = true;

                let path = this.isCreateMode() ? "api/user" : (this.isProfileMode() ? "api/me" : "api/user/" + this.getUserId());

                let requestBody = {
                    first_name: this.userModel.user_first_name,
                    last_name: this.userModel.user_last_name,
                    email: this.userModel.user_email,
                    avatar: this.userModel.user_avatar,
                    language_id: this.userModel.language_id,
                    countries: this.userModel.countries === null ? [] : this.userModel.countries.map((a) => a.id)
                };

                if (this.isProfileMode() == false) {
                    requestBody["type"] = this.userModel.user_type;
                    requestBody["directory_id"] = this.userModel.directory_id;
                    requestBody["status"] = this.userModel.user_status ? "ACTIVE" : "INACTIVE";
                    requestBody["groups"] = this.userModel.user_groups.length > 0 ? this.userModel.user_groups.map((item) => item.id) : [];
                    requestBody["roles"] = this.userModel.user_roles.length > 0 ? this.userModel.user_roles.map((item) => item.id) : [];
                }

                // ADD password only in creation mode or in update mode if the editPassword flag is set
                if (this.isCreateMode() == true || this.editPassword) {
                    requestBody["password"] = this.userModel.user_password;
                    requestBody["password_confirmation"] = this.userModel.user_confirm_password;
                }

                if (this.isUpdateMode() || this.isProfileMode()) {
                    requestBody["_method"] = "PATCH";
                }

                var api = new API;
                api.createEntity({"name": path});
                api.endpoints.create(requestBody).then(this.success).catch(this.failure);

            },
            // handle success creation
            success({data}) {
                this.isLoading = false;
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.getSuccessMessage(),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$acl.updateCurrentUser();
                    // set language preference
                    var theLanguage = localStorage.getItem('languages');
                    theLanguage = JSON.parse(theLanguage);

                    for(var i = 0; i < theLanguage.length; i++) {
                        let item = theLanguage[i];
                        if(item.id == this.userModel.language_id) {
                            localStorage.setItem('lang_locale', item.acronym);
                            localStorage.setItem('locale', item.acronym);
                            i18n.locale = item.acronym;
                            document.querySelector('html').setAttribute('dir', item.text_direction);
                            EventBus.$emit('locale', item.acronym);
                            break;
                        }
                    }

                    if (!this.isProfileMode()) {
                        this.$router.replace('/user/list');
                    }
                });
            },
            // handle failed creation
            failure(error) {
                this.isLoading = false;
                let errors = error.response.data.errors;
                let err, errs = [];
                for (err in errors) {
                    errs[err] = errors[err][0];
                }
                this.errors = errs;
                this.$forceUpdate();
                this.scrollToClass('.text-danger');
            },
            scrollToClass(className) {
                let el = this.$el.querySelector(className);
                let rect = el.getBoundingClientRect();
                window.scrollTo(rect.left, rect.top);
            },
            onCancel() {
                this.$router.replace('/user/list');
            },
            /**
             * Image Uploader Events Handling
             **/
            // Executed before the image is uploaded to the server
            sendingEvent(file, xhr, formData) {
                formData.append('title', file.name);
                formData.append('description', file.name);
                formData.append('content_type', 'POSTER');
                // this.loading = true;
            },
            dropzoneErrorEvent(file, message, xhr) {
                if(typeof message === 'object') {
                    if(message.errors && message.errors.file) {
                        document.getElementById('user_avatar').querySelector('.dz-error-message span').textContent = message.errors.file[0];
                    } else {
                        document.getElementById('user_avatar').querySelector('.dz-error-message').classList.add('d-none');
                    }
                } else {
                    let newMessage  = document.getElementById('user_avatar').querySelector('.dz-error-message span').innerText;
                    newMessage = newMessage.replace(/MiB/g, 'MB');
                    document.getElementById('user_avatar').querySelector('.dz-error-message span').textContent = newMessage;
                }
            },
            // Executed after the image is uploaded to the server
            queueComplete(file) {
                this.userModel.user_avatar = file.xhr.responseText;
                // this.userModel.user_avatar = JSON.parse(file.xhr.response).url;
                // this.imageUploading = true;
                // this.loading = false;
            },
            // Executed when the uploaded image is removed
            fileDeleted() {
                this.userModel.user_avatar = "";
                // this.imageUploading = false;
            }
        }
    };
</script>

<!-- styles -->
<style lang="scss" scoped>
    .white-section_details {
        padding: 25px 0 35px;

    }

    .img-thumbnail {
        border: none;
    }

    .password-readonly-container {
        margin-top: 15px;
        margin-bottom: 4px;

        .editPassword {
            position: relative;
            top: -1px;
            right: -4px;
            color: #565656;

            &:hover {
                cursor: pointer;
            }
        }
    }

    .faq-submit {
        font-size: 20px;
        padding: 10px 50px;
        background-color: #0072BC;
        border-color: #0072BC !important;
    }

    .faq-draft {
        font-size: 20px;
        padding: 10px 74px !important;
        background-color: #F9F9F9 !important;
        color: #0072BC !important;
        border-color: #0072BC !important;
    }

    .user-container {
        .footer {
            margin-top: 20px;
        }
        .toggle-btn-container, .user-avatar-container {
            margin-top: 10px;
        }
    }

</style>




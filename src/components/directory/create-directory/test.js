import componentContainer from './../../pages/componentContainer.vue';
import whiteContainer from "./../../pages/whiteContainer.vue";
import {EventBus} from './../../../eventbus/event-bus.js';
import API from "./../../APIs/AbstractAPIs";
import env from './../../../Env';
import inputText from "../../core/form/partials/input-text/input-text.vue";
import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue";
import inputSelect from "../../core/form/partials/input-select/input-select.vue";
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
import coreFormClass from "./../../core/form/script";
import VueTimepicker from 'vue2-timepicker';
import contactForm from './../partials/contactForm';
import treeSelect from "./../../core/form/partials/tree-selectbox/tree-selectbox.vue";
import categoriesService from "./../../../helpers/categoryService";
import loadingButton from "./../../spinner/loading-button.vue";
import LoadingSpinner from "./../../spinner/loading-spinner";
import { VueEditor } from "vue2-editor";
import typesService  from './../../../helpers/directoryTypeService';
import directoryMediaService  from './../../../helpers/directoryMediaService';
import CountryOptions from "./../../../helpers/countryList";
import CommentSection from "./../../faq/partials/comment-section.vue";
import inputMultiSelect from "./../../core/form/partials/input-multiselect/input-multiselect.vue";
import componentAsModal from './../../modal/component-as-modal.vue';
import addDirectorySocialMedia from './../partials/addDirectorySocialMedia';
import directoryTranslation from "./../partials/directoryTranslation";

const DIRECTORY_STATUS_ACTIVE = "ACTIVE";
const DIRECTORY_STATUS_INACTIVE = "INACTIVE";

const catserv = new categoriesService();
const directoryTypeServ = new typesService();
const directoryMediaServ = new directoryMediaService();
// const APIs = new API();
const countries = new CountryOptions();

var Directory = {
    // ===Component name
    name: "create-directory",
    // ===Props passed to component
    props: {
        isModal: {
            type: Boolean,
            default: false,
        }
    },
    // ===Components used by this component
    components: {
        componentContainer,
        whiteContainer,
        componentAsModal,
        vueDropzone: vue2Dropzone,
        LoadingSpinner,
        inputText,
        inputTextarea,
        inputSelect,
        VueTimepicker,
        contactForm,
        treeSelect,
        loadingButton,
        VueEditor,
        inputMultiSelect,
        CommentSection,
        "dir-translations":directoryTranslation,
        'social-media':addDirectorySocialMedia
    },
    // ===component Data properties
    data() {
        return this.initialState();
    },
    // ===Code to be executed when Component is mounted
    mounted() {
        // this.getCountries();
        if (this.getId() && !this.isModal) {
            this.retriveUpdateData();
        } else {
            this.getServiceCategory();
        }
        this.theLanguages = JSON.parse(localStorage.getItem('languages'));
        this.langLocale = localStorage.getItem('lang_locale');

        for(var i=0; i < this.theLanguages.length; i++) {
            var theItem = this.theLanguages[i];
            if(this.langLocale == theItem.acronym && theItem.is_default == 0) {
                var langContent = {};
                langContent.language_id = theItem.id;
                langContent.label = theItem.name;
                langContent.directory_name ="";
                langContent.directory_alternative_name = "";
                langContent.directory_acronym = "";
                langContent.description = "";

                this.languageContents.push(langContent);
            }
        }
    },
    created: function () {
        EventBus.$on('update-input-field', this.updateModel);
        EventBus.$on('add-to-parent', this.updateChildModel);
        EventBus.$on('clear-input-field', this.clearError);
        EventBus.$on('update-socialMediaLink', this.updateSocialLink);
        this.getDirectoryTypes();
        this.getDirectoryMedia();
        this.gethashtags();
        this.loadhashTags();
    },
    methods: {
        initialState() {
            let contactForm =
                {
                    address_line_one: "",
                    address_line_two: "",
                    country: "",
                    is_default:0,
                    lat:0,
                    lng:0,
                    pluscode:"",
                    governorate: "",
                    district: "",
                    postal_code: "",
                    email: "",
                    building_name:"",
                    landmark:"",
                    metro:"",
                    city:"",
                    neighbourhood:"",
                    proximity:"",
                    phones: [],
                    countryOptions:[],
                    working_hours: []
                };

            this.$eventBus.$emit('empty-contact-form', {});
            this.$eventBus.$emit('empty-phone', {});
            this.$eventBus.$emit('empty-working-hours', {});

            return {
                value: [],
                directoryTypeOptions:[],
                defaultContactForm: {
                    address_line_one: "",
                    address_line_two: "",
                    country: "",
                    is_default:0,
                    lat:0,
                    lng:0,
                    pluscode:"",
                    governorate: "",
                    district: "",
                    postal_code: "",
                    email: "",
                    building_name:"",
                    landmark:"",
                    metro:"",
                    city:"",
                    neighbourhood:"",
                    proximity:"",
                    website:"",
                    phones: [],
                    countryOptions:[],
                    working_hours: []
                },
                languageContents:[],
                theLanguages:[],
                submitBtnLabel: 'Common.Save',
                pageTitle: 'Directory.AddNewDirectory',
                imageUploading: false,
                loading: false,
                loadFormContent: false,
                service_category_options: [],
                selectHashtags:[],
                value:[],
                // directoryTypeSelectedOptions: [
                //     {value: 'SERVICE_PROVIDER', text: 'Service Provider', selected: false},
                //     {value: 'UNHCR_STAFF', text: 'Partners', selected: false}
                // ],
                errors: [],
                directoryModel: {
                    name: "",
                    alternative_name: '',
                    acronym: "",
                    description: "",
                    type_id: 0,
                    directory_type: Object,
                    service_category: [],
                    hashtags:[],
                    status: true,
                    media_id: null,
                    image: '',
                    directoryMediaLinks:[],
                    contact_forms: [contactForm]
                },
                mediaModel: {
                    url: "",
                    title: "",
                    description: "",
                    content_type: "",
                },
                dropzoneOptions: {
                    url: env.API_URL + '/api/directory-media',
                    thumbnailWidth: 150,
                    maxFilesize: 2,
                    addRemoveLinks: true,
                    // dictDefaultMessage: "<i class='fa fa-5x fa-files-o'></i><h5>"+"Common.DragFile"+"</h5>",
                    maxFiles: 1,
                    acceptedFiles: "image/*",
                    autoProcessQueue: true,
                    headers: {
                        "Authorization": localStorage.getItem('token_type') + " " + localStorage.getItem('access_token'),
                        'Cache-Control': null,
                        'X-Requested-With': null
                    },
                },
                directoryMediaOptions: [],
                disableMediaIDSelect: false,
                onSaved: false,
                canSubmit: true
            };

        },
        resetModel() {
            Object.assign(this.$data, this.initialState());
            this.getServiceCategory();
        },
        updateModel: async function (data) {
            if (!this.isMyScope(data)) {
                return;
            }
            switch (data.name) {
                case 'directory_type': 
                    this.directoryTypeOptions.map(function(theEle){
                        return {
                            value: theEle.value,
                            text: theEle.text,
                            selected: (data.value == theEle.value)
                        };
                    });
                    this.directoryModel[data.name] = data.value;
                    this.directoryModel['type_id'] = data.value;
                    break;
                case 'media_id':
                    this.directoryMediaOptions = await this.directoryMediaOptions.map(function(media){
                        return {
                            ...media,
                            selected: (data.value == media.value)
                        };
                    });
                    this.directoryModel[data.name] = data.value;
                    this.directoryModel.image = this.directoryMediaOptions.find((media) => media.selected).url;
                    this.canSubmit = true;
                    break;
                default:
                    let objKeys = Object.keys(this.directoryModel);
                    if (objKeys.includes(data.name)) {
                        this.directoryModel[data.name] = data.value;
                    }
                    break;
            }
        },
        updateSocialLink: function (data) {
            if (!this.isMyScope(data)) {
                return;
            }
            this.directoryModel.directoryMediaLinks = data;
        },
        loadhashTags: function() {
            this.value = this.directoryModel.hashtags === null ? [] : this.directoryModel.hashtags;
        },
        gethashtags: function () {
            this.$apis.createEntity({name: '/api/hashtag?paginate=0&sorting[hashtag]=asc'});
            this.$apis.endpoints.getAll().then(({data}) => {
                this.selectHashtags = data.map((a) => {
                    return {
                        name: a.hashtag,
                        hashtag:a.hashtag,
                        id :a.id
                    }
                });
            });
            EventBus.$on('update-multi-select', this.getvalues);
        },
        getvalues: function (data) {
            if (data.name === "hashtag-content") {
                this.value = data.value;
            }

        },
        removelink: function (index) {
            this.value.splice(index, 1);
        },
        onProcessDone: function () {
            this.gethashtags();
            this.loadhashTags();
        },
        isUpdateMode() {
            return this.$route.params.id == undefined ? false : true;
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
        scrollToClass(className) {
            let el = this.$el.querySelector(className)
            let rect = el.getBoundingClientRect()
            window.scrollTo(rect.left, rect.top)
        },
        updateChildModel: function (data) {
            if (!this.isMyScope(data)) {
                return;
            }
            switch (data.name) {
                case'phones':
                case 'working_hours':
                    this.directoryModel['contact_forms'][data.contact_form_index][data.name] = data.value;
                    break;
                default:
                    this.directoryModel[data.name] = data.value;
                    break;
            }
        },
        getServiceCategory(categories) {
            categories = categories || [];
            this.loadFormContent = true;
            let category, ids = [];
            for (category of categories) {
                ids.push({
                    id: category.id,
                    label: category.name
                });
            }

            catserv.getAllCategories().then((data) => {
                this.service_category_options = data
            });

            this.directoryModel.service_category = ids;

            this.loadFormContent = false;
        },
        getDirectoryTypes() {
            directoryTypeServ.getDirectoryTypes().then((data) => {
                this.directoryTypeOptions = data.map((a)=>{return {value:a.id, text:a.type_name, selected:false}});
            });
        },
        getDirectoryMedia() {
            directoryMediaServ.getDirectoryMedia().then((data) => {
                this.directoryMediaOptions = data.map((media) => ({value: media.id, text: media.title, url: media.url, selected: false}));
            });
        },
        sendingEvent(file, xhr, formData) {
            this.unsetImage();
            this.disableMediaIDSelect = true;
            const fileName = file.name;
            formData.append('title', fileName);
            formData.append('description', fileName);
            this.loading = true;
        },
        dropzoneErrorEvent(file, message, xhr) {
            if(typeof message === 'object') {
                if(message.errors && message.errors.file) {
                    document.getElementById('dropzone-directory').querySelector('.dz-error-message span').textContent = message.errors.file[0];
                } else {
                    document.getElementById('dropzone-directory').querySelector('.dz-error-message').classList.add('d-none');
                }
            } else {
                let newMessage  = document.getElementById('dropzone-directory').querySelector('.dz-error-message span').innerText;
                newMessage = newMessage.replace(/MiB/g, 'MB');
                document.getElementById('dropzone-directory').querySelector('.dz-error-message span').textContent = newMessage;
                if(newMessage.search('File is too big') !== -1) {
                    this.errors.file = 'The Image file may not be greater than 2MB.';
                    this.$forceUpdate();
                }
            }
            this.canSubmit = false;
        },
        dropzoneAddFileEvent(file) {
            this.errors.file = '';
            this.canSubmit = true;
        },
        removeImage:function() {
            let DirectoryAPIs = new API();
            DirectoryAPIs.createEntity({name: 'api/' + this.getModule()+'/remove-image/'+this.getId()});
            DirectoryAPIs.endpoints.get().then(this.unsetImage).catch(this.failure);
        },
        unsetImage:function() {
            this.directoryModel.media_id = null;
            this.directoryModel.image = '';
            let currentSelected = this.directoryMediaOptions.find((media) => media.selected);
            currentSelected ? currentSelected.selected = false : '';
            this.disableMediaIDSelect = false;
        },
        update() {
            let defaultLang = this.theLanguages.filter((item)=>{
                return (item.is_default == 1);
            })[0];

            let langTranslations = [];

            langTranslations = this.languageContents.map((item)=>{
                return {language_id:item.language_id, name:item.directory_name, acronym:item.directory_acronym, alternative_name:item.directory_alternative_name, description:item.description};
            });

            langTranslations.push({language_id:defaultLang.id, name:this.directoryModel.name, acronym:this.directoryModel.acronym, alternative_name:this.directoryModel.alternative_name, description:this.directoryModel.description});

            this.loading = true;
            let data = {
                id: this.getId(),
                name: this.directoryModel.name,
                alternative_name: this.directoryModel.alternative_name,
                acronym: this.directoryModel.acronym,
                description: this.directoryModel.description,
                type_id: this.directoryModel.type_id,
                hashtags: this.value === null ? [] : this.value.map((a) => a.id),
                directory_type: this.directoryModel.directory_type,
                service_category: this.directoryModel.service_category.map((a) => a.id),
                directoryMediaLinks:this.directoryModel.directoryMediaLinks,
                status: this.directoryModel.status ? DIRECTORY_STATUS_ACTIVE : DIRECTORY_STATUS_INACTIVE,
                media_id: this.directoryModel.media_id,
                translations: langTranslations,
                contact_forms: this.directoryModel.contact_forms.map((row) => {
                    if(row.countryObj !== undefined) {
                        row.country = row.countryObj.label;
                        row.country_id = row.countryObj.id;
                    }
                    return row;
                })
            };

            let DirectoryAPIs = new API();
            DirectoryAPIs.createEntity({name: 'api/' + this.getModule()});
            DirectoryAPIs.endpoints.update(data).then(this.success).catch(this.failure);
        },
        save() {
            let defaultLang = this.theLanguages.filter((item)=>{
                return (item.is_default == 1);
            })[0];

            let langTranslations = [];

            langTranslations = this.languageContents.map((item)=>{
                return {language_id:item.language_id, name:item.directory_name, acronym:item.directory_acronym, alternative_name:item.directory_alternative_name, description:item.description};
            });

            langTranslations.push({language_id:defaultLang.id, name:this.directoryModel.name, acronym:this.directoryModel.acronym, alternative_name:this.directoryModel.alternative_name, description:this.directoryModel.description});

            this.loading = true;
            let data = {
                name: this.directoryModel.name,
                acronym: this.directoryModel.acronym,
                alternative_name: this.directoryModel.alternative_name,
                description: this.directoryModel.description,
                type_id: this.directoryModel.type_id,
                hashtags: this.value === null ? [] : this.value.map((a) => a.id),
                directory_type: this.directoryModel.directory_type,
                service_category: this.directoryModel.service_category.map((a) => a.id),
                directoryMediaLinks:this.directoryModel.directoryMediaLinks,
                status: this.directoryModel.status ? DIRECTORY_STATUS_ACTIVE : DIRECTORY_STATUS_INACTIVE,
                media_id: this.directoryModel.media_id,
                translations: langTranslations,
                contact_forms: this.directoryModel.contact_forms.map((row) => {
                    if(row.countryObj !== undefined) {
                        row.country = row.countryObj.label;
                        row.country_id = row.countryObj.id;
                    }
                    return row;
                })
            };

            let DirectoryAPIs = new API();
            DirectoryAPIs.createEntity({name: 'api/' + this.getModule()});
            DirectoryAPIs.endpoints.create(data).then(this.success).catch(this.failure);
        },
        notifications(type) {
            let obj = {};

            type = type || 'save';

            obj = {
                save: {
                    group: 'saveResponse',
                    title: 'Success',
                    text: this.$parent.$t('Directory.DirectoryCreated')
                },
                update: {
                    group: 'saveResponse',
                    title: 'Updated',
                    text: this.$parent.$t('Directory.DirectoryUpdated')
                },
                error: {
                    group: 'saveResponse',
                    title: 'Error',
                    text: 'Something went wrong!'
                }
            };

            this.$notify(obj[type]);
        },
        success({data}) {
            this.loading = false;

            let method = 'save';
            var title = this.$parent.$t('Directory.DirectoryCreated');

            if (this.getId()) {
                method = 'update';
                title = this.$parent.$t('Directory.DirectoryUpdated')
            }

            this.$swal({
                toast: true,
                position: 'top-end',
                type: 'success',
                title: title,
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                if (!this.isModal) {
                    this.$router.replace('/directory/list');
                } else {
                    this.$emit('processDone');
                    this.resetModel();
                }
            })
        },
        addNewContactForm: function () {
            let newContactForm = {
                address_line_one: "",
                address_line_two: "",
                country: "",
                governorate: "",
                is_default:0,
                lat:'',
                lng:'',
                pluscode:"",
                district: "",
                postal_code: "",
                email: "",
                building_name:"",
                landmark:"",
                metro:"",
                city:"",
                neighbourhood:"",
                proximity:"",
                website:"",
                phones: [],
                countryOptions:[],
                working_hours: []
            };

            const countriesList = countries.countries;
            let theCountries = [];

            for(let country of countriesList)
            {
                theCountries.push(country);
            }
            newContactForm.countryOptions = theCountries;
            this.directoryModel.contact_forms.push(newContactForm);
        },
        removeContactForm: function (index) {
            if (this.directoryModel.contact_forms.length <= 1) {
                return;
            }

            this.directoryModel.contact_forms.splice(index, 1);
        },
        failure(error) {
            this.loading = false;

            this.errors = this.buildError(error.response.data.errors);

            this.scrollToClass('.text-danger');
        },
        buildError: function (errors) {
            let err, errs = [];
            for (err in errors) {
                let val = errors[err][Object.keys(errors[err])[0]];
                if (typeof val === 'object') {
                    val = errors[err];
                    for (let key in val) {
                        if (!errs[err]) {
                            errs[err] = [];
                        }

                        errs[err][key] = this.buildError(val[key]);
                    }
                } else {
                    errs[err] = val;
                }
            }
            console.log('errors', errs, errors);
            return errs;
        },
        getId() {
            return this.$route.params.id;
        },
        getModule() {
            return "directory";
        },
        onSaveDirectory() {
            this.onSaved = true;
            if(this.canSubmit) {
                if (this.getId()) {
                    this.update();
                } else {
                    this.save();
                }
            }
        },
        fileDeleted(file, error, xhr) {
            if(!this.onSaved) {
                directoryMediaServ.deleteDirectoryMedia(this.directoryModel.media_id).then((data) => {
                    if(data) {
                        this.directoryModel.media_id = null;
                        this.directoryModel.image = '';
                        this.imageUploading = false;
                        this.disableMediaIDSelect = false;
                    }
                });
            }
        },
        retriveUpdateData() {
            this.pageTitle = 'Directory.EditDirectory';
            this.submitBtnLabel = 'Common.Update';
            this.loadFormContent = true;
            coreFormClass.getData(this.getId(), this.getModule(), this.getSuccess, this.getFailure, '?with[]=serviceCategories&with[]=directoryType&with[]=directoryMedia&with[]=serviceCategories.children&with[]=contactForms&with[]=hashtags&with[]=directoryMediaLinks&with[]=contactForms.phones&with[]=contactForms.workingHours&with[]=contactForms.directoryCountry&with[]=translations');
        },
        getSuccess({data}) {
            let r, tmp = {};

            tmp = this.directoryModel;
            for (r in data) {
                switch (r) {
                    case 'directory_type':
                        if(data[r]) {
                            let theItem = this.directoryTypeOptions.find((item) => item.value === data.directory_type.id);
                            if(theItem !== undefined) {
                                this.directoryTypeOptions.find((item) => item.value === data.directory_type.id).selected = true;
                            }
                        }
                        tmp[r] = data[r];
                        break;
                    case 'directory_media':
                        if(data[r]) {
                            const mediaSelected = this.directoryMediaOptions.find((media) => media.value === data.directory_media.id);
                            if(mediaSelected) {
                                this.directoryMediaOptions.find((media) => media.value === data.directory_media.id).selected = true;
                                this.directoryModel.image = data.directory_media.url;
                            }
                        }
                        tmp[r] = data[r];
                        break;
                    case 'service_categories':
                        this.getServiceCategory(data[r]);
                        break;
                    case 'status':
                        this.directoryModel[r] = data[r] == DIRECTORY_STATUS_ACTIVE ? true : false;
                        break;
                    case 'contact_forms':
                        let contactForms = data[r].map(function (cForm) {
                            cForm.countryName = cForm.country;
                            cForm.countryOptions = [];
                            return cForm;
                        });
                        this.directoryModel[r] = contactForms;
                        break;
                    default:
                        if (data[r]) {
                            this.directoryModel[r] = data[r];
                        }
                        break;
                }
            }

            this.directoryModel = tmp;
            if(tmp.translations.length > 0) {
                let langFilter = this.theLanguages.filter((item) => {
                    if(item.is_default == 1)
                        return item;
                });

                for(var i = 0; i < tmp.translations.length; i++) {
                    let theItem = tmp.translations[i];

                    for(var j = 0; j < this.languageContents.length; j++) {
                        if(langFilter.length > 0 && langFilter[0].id != this.languageContents[j].language_id && this.languageContents[j].language_id == theItem.language_id) {
                            this.languageContents[j].directory_name = theItem.name;
                            this.languageContents[j].directory_alternative_name = theItem.alternative_name;
                            this.languageContents[j].directory_acronym = theItem.acronym;
                            this.languageContents[j].description = theItem.description;
                        }
                    }
                }
            }

            this.loadhashTags();
        },
        queueComplete(response) {
            if(response.xhr.response) {
                if(response.status === 'error') {
                    this.errors.file = JSON.parse(response.xhr.response).errors['file'][0];
                }
                else {
                    this.directoryModel.media_id = JSON.parse(response.xhr.response).id;
                }
            }
            this.imageUploading = true;
            this.loading = false;
        },
        getFailure(e) {
            console.log(e);
            // this.$router.push('/404');
        },
        isMyScope(data) {
            if (!data.hasOwnProperty("source_component")) {
                return true;
            }

            if (data.source_component === "public") {
                return true;
            }

            if (data.source_component === this.getComponentName()) {
                return true;
            }

            return false;
        },
        getComponentName() {
            return "create-directory";
        }
    }
};

export default Directory

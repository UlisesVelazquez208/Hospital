<template>
    <white-container title="FAQ.FAQDetail">
        <input-textarea name="question" inputClass="faq-question-field" inputId="question_0" placeholder="FAQ.QuestionPlaceholder"
                    inputLabel="FAQ.Question" :required="false" :errors="errors.question"
                    :value="faqModel.question" :index=0 :row="2"></input-textarea>

        <div class="form-group row">
            <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.Answer')}}</label>
            <div class="col-sm-12 col-lg-9">
                <vue-editor v-model="faqModel.answer" name="answer" :errors="errors.answer" :value="faqModel.answer" :index=0></vue-editor>
                <div v-if="errors.answer" class="text-danger">
                    {{errors.answer}}
                </div>
            </div>
        </div>

        <tree-select valueFormat="object" name="serviceCategories" placeholder="Select.NothingSelected" instanceId="serviceCategories"
                     :value="preSelectedServiceCategories" :errors="errors.service_categories"
                     :options="categoryOptions" :multiple="true" :clearable="true" :searchable="true" :flat="true"
                     inputLabel="Common.ServiceCategory" valueConsistsOf="ALL"></tree-select>

        <tree-select valueFormat="object" name="nationalities" placeholder="Select.NothingSelected" instanceId="nationalities" :value="preselectedNationalities"
                     :options="nationalityOptions" :multiple="true" :clearable="true" :searchable="true" :errors="errors.nationalities"
                     inputLabel="Common.Nationality" valueConsistsOf="LEAF_PRIORITY"></tree-select>

        <tree-select valueFormat="object" name="countries" placeholder="Select.NothingSelected" instanceId="countries" :value="preselectedCountries"
                     :options="countryOptions" :multiple="true" :clearable="true" :searchable="true" :errors="errors.countries"
                     inputLabel="Common.Country" valueConsistsOf="LEAF_PRIORITY"></tree-select>

        <div class="form-group row">
            <label class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.VisibleBy') }}</label>
            <div class="col-sm-12  col-lg-9">
                <label class="visible-container">{{ $t('FAQ.Staff') }} <small>{{ $t('FAQ.StaffVisible') }}</small>
                    <input type="radio" v-model="faqModel.visible" name="visible" value="UNHCR_STAFF"
                           @change="grabinput($event)">
                    <span class="checkmark"></span>
                </label>
                <label class="visible-container">{{ $t('FAQ.Partners') }} <small>{{ $t('FAQ.PartnersVisible') }}</small>
                    <input type="radio" v-model="faqModel.visible" name="visible" value="PARTNERS"
                           @change="grabinput($event)">
                    <span class="checkmark"></span>
                </label>
                <!-- <label class="container">UNHCR Staff and Service provider
                    <input type="radio" v-model="faqModel.visible" name="visible" value="UNHCR_STAFF_PARTNERS"
                           @change="grabinput($event)">
                    <span class="checkmark"></span>
                </label> -->
                <label class="visible-container">{{ $t('FAQ.Public') }} <small>{{ $t('FAQ.PublicVisible') }}</small>
                    <input type="radio" v-model="faqModel.visible" name="visible" value="PUBLIC"
                           @change="grabinput($event)">
                    <span class="checkmark"></span>
                </label>
                <div v-if="errors.visible" class="text-danger">
                    {{ errors.visible }}
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="faq_section_comment"
                         :comments="comments"
                         :addNew="false"
        ></comment-section>

    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue";
    import inputText from "../../core/form/partials/input-text/input-text.vue";
    import treeSelect from "../../core/form/partials/tree-selectbox/tree-selectbox.vue";
    import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue";
    import inputSelect from "../../core/form/partials/input-select/input-select.vue";
    import categoriesService from "../../../helpers/categoryService";
    import countriesService from "./../../../helpers/countryService";
    import nationalityService from "./../../../helpers/nationalityService";
    import {EventBus} from "../../../eventbus/event-bus";
    import CommentSection from "./comment-section.vue";
    import { VueEditor } from "vue2-editor";

    const catserv = new categoriesService();
    const countryserv = new countriesService();
    const nationalityserv = new nationalityService();

    export default {
        name: "add-faq",
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            serviceCategories:{
                type: Array,
                required: false
            },
            errors: {
                type: Array,
                required: false
            },
        },
        components: {
            CommentSection,
            whiteContainer,
            treeSelect,
            inputText,
            inputTextarea,
            inputSelect,
            VueEditor
        },
        data() {
            return {
                categoryOptions: [],
                countryOptions: [],
                nationalityOptions:[],
                visiblebyValue: "null",
                preselectedCountries: [],
                preSelectedServiceCategories: [],
                preSelectedNationalities:[]
                // content: faqModel.answer
            }
        },
        // ===Computed properties for the component
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'FAQ');
            }
        },
        // ===Component methods
        methods: {
            preSelectedNationality: function () {
                let _nationalities  = this.faqModel.nationalities ? this.faqModel.nationalities.map(a => {return {id: a.id, label: a.nationality}} ) : [];
                this.preselectedNationalities = _nationalities;
            },
            preSelectedCont: function () {
                let _countries  = this.faqModel.countries ? this.faqModel.countries.map(a => {return {id: a.id, label: a.country}} ) : [];
                this.preselectedCountries = _countries;
            },
            preSelectedService: function () {
                let _categories = this.serviceCategories ? this.serviceCategories.map(a => { return {id: a.id, label: a.name} }) : [];
                this.preSelectedServiceCategories = _categories;
            },
            grabinput: function (data) {
                EventBus.$emit('update-input-field', {
                    name: data.target.name,
                    value: data.target.value
                });
            },
            clearError: function (data) {
                if (this.errors[data.name]) {
                    this.errors[data.name] = '';
                    this.$forceUpdate();
                }
            }
        },
        created() {
            catserv.getAllCategories().then((data) => {
                this.categoryOptions = data;
            });
            countryserv.getCountries().then((data) => {
                this.countryOptions = data;
            });
            nationalityserv.getNationalities().then((data) => {
                this.nationalityOptions = data;
            });

            this.preSelectedService();

            this.preSelectedCont();

            this.preSelectedNationality();

            EventBus.$on('clear-input-field', this.clearError);
        },
        mounted() {
            this.faqModel.service_categories = this.serviceCategories;
        }
    };
</script>
<style lang="scss">
    .form-label {
        font-size: 14px;
    }

    /* Customize the label (the container) */
    .visible-container {
        display: block;
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
    .visible-container input {
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
        // border-radius: 50%;
    }

    /* On mouse-over, add a grey background color */
    .visible-container:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the radio button is checked, add a blue background */
    .visible-container input:checked ~ .checkmark {
        background-color: #0072BC;
    }

    /* Create the indicator (the dot/circle - hidden when not checked) */
    .checkmark:after {
        content: "";
        position: absolute;
        display: none;
    }

    /* Show the indicator (dot/circle) when checked */
    .visible-container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the indicator (dot/circle) */
    .visible-container .checkmark:after {
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

    .form-label {
        font-weight: bold;
        color: rgba(1, 0, 0, 0.65);
    }
    .faq-question-field {
        resize:none;
    }

</style>

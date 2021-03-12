<template>
    <white-container title="Common.Translations">
        <div v-for="(langItem, index) in languageContents" class="row" :key="index">
            <div class="col-lg-12">
                <h5>{{ langItem.label }}</h5>
                <input type="hidden" name="language_id" :index="(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                <input-text 
                        name="directory_name" inputClass="directory-name-field" :inputId="'name_'+(index+1)" 
                        :index="(index+1)" 
                        v-model="langItem.directory_name" 
                        placeholder="Directory.NamePlaceholder"
                        inputLabel="Directory.Name" 
                        :value="langItem.directory_name"></input-text>

                <input-text name="directory_alternative_name" inputClass="alternativeName"
                            :inputId="'alternative_name_'+(index+1)" placeholder="Directory.AlternativeNamePlaceholder"
                            inputLabel="Directory.AlternativeName"
                            inputLabelClass="col-sm-12 col-lg-3 col-form-label"
                            inputWrapClass="col-sm-12 col-lg-9"
                            :required="true"
                            :index="(index+1)" 
                            v-model="langItem.directory_alternative_name" 
                            :value="langItem.directory_alternative_name"
                ></input-text>
                <input-text name="directory_acronym" inputClass="directory-name"
                            :inputId="'acronym+'+(index+1)" placeholder="Directory.AcronymPlaceholder"
                            inputLabel="Directory.Acronym"
                            inputLabelClass="col-sm-12 col-lg-3 col-form-label"
                            inputWrapClass="col-sm-12 col-lg-9"
                            :required="false"
                            :index="(index+1)" 
                            v-model="langItem.directory_acronym" 
                            :value="langItem.directory_acronym"
            >
                </input-text>
                <div class="form-group row">
                    <label for="description" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Directory.Description')}}</label>
                    <div class="col-sm-12 col-lg-9">
                        <vue-editor v-model="langItem.description" name="description" :value="langItem.description" :index="(index+1)" :inputId="'description_'+(index+1)" ></vue-editor>
                    </div>
                </div>
            </div>
        </div>
    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue";
    import inputText from "../../core/form/partials/input-text/input-text.vue";
    import treeSelect from "../../core/form/partials/tree-selectbox/tree-selectbox.vue";
    import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue";
    import inputSelect from "../../core/form/partials/input-select/input-select.vue";
    import {EventBus} from "../../../eventbus/event-bus";
    import { VueEditor } from "vue2-editor";


    export default {
        name: "directory-translation",
        props: {
            languageContents:{
                type:Array,
                default: function() {
                    return [];
                }
            }
        },
        components: {
            whiteContainer,
            inputText,
            VueEditor
        },
        // data() {
        // },
        // ===Component methods
        methods: {
            updateModel:function(data) {
                console.log(data);
                if(data.index > 0) {
                    this.languageContents[data.index-1][data.name] = data.value;
                }
            }
        },
        created() {
            EventBus.$on('update-input-field', this.updateModel);
        },
        mounted() {
        }
    };
</script>

<template>
    <white-container title="Common.Translations">
        <div v-for="(langItem, index) in languageContents" class="row" :key="index">
            <div class="col-lg-12">
                <h5>{{ langItem.label }}</h5>
                <input type="hidden" name="language_id" :index="(index+1)" v-model="langItem.language_id" value="langItem.language_id"/>
                <input-textarea 
                        name="question_text" inputClass="faq-question-field" :inputId="'question_'+(index+1)" 
                        :index="(index+1)" 
                        :row="2"
                        v-model="langItem.question_text" 
                        placeholder="FAQ.QuestionPlaceholder"
                        inputLabel="FAQ.Question" 
                        @input="updateModel(index+1, 'question_name', $event.target)"
                        :value="langItem.question_text"></input-textarea>

                <div class="form-group row">
                    <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.Answer')}}</label>
                    <div class="col-sm-12 col-lg-9">
                        <vue-editor v-model="langItem.answer" name="answer" :value="langItem.answer" :index="(index+1)" :inputId="'answer_'+(index+1)" ></vue-editor>
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
    import CommentSection from "./comment-section.vue";
    import { VueEditor } from "vue2-editor";


    export default {
        name: "faq-translation",
        props: {
            languageContents:{
                type:Array,
                default: function() {
                    return [];
                }
            }
        },
        components: {
            CommentSection,
            whiteContainer,
            inputText,
            inputTextarea,
            VueEditor
        },
        // data() {
        // },
        // ===Component methods
        methods: {
            updateModel:function(data) {
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

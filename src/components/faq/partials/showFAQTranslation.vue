<template>
    <white-container title="Common.Translations">
        <div v-for="(langItem, index) in languageContents" class="row">
            <div class="col-lg-12">
                <h5>{{ langItem.label }}</h5>
                <div class="faq-question faq-data-item font-weight-bold">{{langItem.question_text}}</div>

                <div class="form-group row">
                    <label for="answer" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.Answer')}}</label>
                    <div class="col-sm-12 col-lg-9">
                    <div class="faq-answer faq-data-item" v-html="langItem.answer"></div>
                    </div>
                </div>
            </div>
        </div>
    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue";
    // import inputText from "../../core/form/partials/input-text/input-text.vue";
    // import treeSelect from "../../core/form/partials/tree-selectbox/tree-selectbox.vue";
    // import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue";
    // import inputSelect from "../../core/form/partials/input-select/input-select.vue";
    import {EventBus} from "../../../eventbus/event-bus";
    // import CommentSection from "./comment-section.vue";
    // import { VueEditor } from "vue2-editor";


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
            whiteContainer,
        },
        // data() {
        // },
        // ===Component methods
        methods: {
        },
        created() {
        },
        mounted() {
        }
    };
</script>

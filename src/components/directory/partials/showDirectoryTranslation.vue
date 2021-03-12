<template>
    <white-container title="Common.Translations">
        <div v-for="(langItem, index) in languageContents" class="row" :key="index">
            <div class="col-lg-12">
                <h5>{{ langItem.label }}</h5>
                <div class="form-group row">
                    <label for="answer" class="col-sm-4  col-lg-4 col-form-label">{{ $t('Directory.Name')}}</label>
                    <div class="col-sm-8 col-lg-8">
                        {{ langItem.directory_name}}
                    </div>
                </div>
                <div class="form-group row">
                    <label for="answer" class="col-sm-4  col-lg-4 col-form-label">{{ $t('Directory.AlternativeName')}}</label>
                    <div class="col-sm-8 col-lg-8">
                        {{ langItem.directory_alternative_name}}
                    </div>
                </div>
                <div class="form-group row">
                    <label for="answer" class="col-sm-4  col-lg-4 col-form-label">{{ $t('Directory.Acronym')}}</label>
                    <div class="col-sm-8 col-lg-8">
                        {{ langItem.directory_acronym}}
                    </div>
                </div>
                <div class="form-group row">
                    <label for="answer" class="col-sm-4  col-lg-4 col-form-label">{{ $t('Directory.Description')}}</label>
                    <div class="col-sm-8 col-lg-8">
                        <div class="faq-answer faq-data-item" v-html="langItem.description"></div>
                    </div>
                </div>
            </div>
        </div>
    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue";
    import {EventBus} from "../../../eventbus/event-bus";


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
            whiteContainer
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

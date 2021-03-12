<template>
    <white-container title="Hashtag.Hashtag" sectionClass="hashtags">
        <input-multi-select v-bind:value="value" name="hashtag-content" inputLabel="FAQ.HashtagTitle"
                            inputId="hashtag-content" inputplaceholder="FAQ.HashtagTitlePlaceholder"
                            :selectOptions="selectOptions"
        >
            <template slot="noResult">not found</template>
        </input-multi-select>

        <div class="selected-list">
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3">
                    <ul>
                        <li v-for="(item, index) in value" :key="index">
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

        <!-- Comment -->
        <comment-section name="hashtag_section_comment"
                         :comments="comments"
                         :addNew="false"
        ></comment-section>

        <div class="details"
             v-if="!isUpdateMode() || (isUpdateMode() && faqModel.comments == null)"
        >
            <div class="row">
                <div class=" col-sm-12">
                    <h5 class="header">{{ $t('FAQ.HashtagCantFind')}}</h5>
                    <!--<router-link tag="a" to="##" class="btn btn-primary details-link  pull-left btn-lg ">-->
                    <!--</router-link>-->
                    <component-as-modal showModalButton="FAQ.HashtagAddNew"
                                        componentName="createHashTag"
                                        @processDone="onProcessDone">
                    </component-as-modal>
                </div>
            </div>
        </div>


    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import componentAsModal from '../../modal/component-as-modal.vue'
    import inputMultiSelect from "../../core/form/partials/input-multiselect/input-multiselect.vue"
    import {EventBus} from '../../../eventbus/event-bus.js';
    import CommentSection from "./comment-section.vue"

    export default {
        name: "AddHashtag",
        components: {
            whiteContainer,
            componentAsModal,
            inputMultiSelect,
            CommentSection
        },
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            errors: {
                type: Array,
                required: false
            },
        },
        data() {
            return {
                selectOptions: [],
                value: []
            }
        },
        created: function () {
            this.gethashtags();
            this.loadhashTags();
        },
        methods: {
            loadhashTags: function() {
                this.value = this.faqModel.hashtags === null ? [] : this.faqModel.hashtags;
            },
            gethashtags: function () {
                this.$apis.createEntity({name: '/api/hashtag?paginate=0&sorting[hashtag]=asc'});
                this.$apis.endpoints.getAll().then(({data}) => {
                    this.selectOptions = data.map((a) => {
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
                    this.value = data.value
                }

            },
            removelink: function (index) {
                this.value.splice(index, 1);
            },
            onProcessDone: function () {
                this.gethashtags();
                this.loadhashTags();
            },
            getId() {
                return this.$route.params.id;
            },
            isUpdateMode() {
                return this.$route.params.id == undefined ? false : true;
            }
        },
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'HASHTAGS');
            }
        }
    };
</script>
<style type="text/css" lang="scss">
    .white-section.hashtags {
        .white-section_details {
            padding: 25px 0 35px;
        }
    }

    .hashtags {
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
        .details {
            margin-top: 100px;
        }
        .details-link {
            background-color: #fff;
            border: 2px solid #1E8FCD;
            color: #1E8FCD;
            padding: 8px 35px;
            margin-top: 15px;
        }
        .selected-list {
            ul {
                list-style: none;
                padding: 0;
                margin: 20px 0px;
            }
            li {
                display: inline;
                float: left;
                position: relative;
                min-height: auto;
                padding: 0;
                border: none;

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
                    font-weight: 400;
                    font-size: 14px;
                }

            }
            .custom__remove {
                position: absolute;
                top: -8px;
                right: 2px;
                background-color: #636363;
                border-radius: 50%;
                color: #fff;
                width: 15px;
                height: 15px;
                text-align: center;
                padding-top: 0px;
                /*z-index: 1;*/
                font-size: 10px;

                &:hover {
                    cursor: pointer;
                }
            }
        }
    }

</style>


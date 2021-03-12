<template>
    <white-container title="Directory.Directory" sectionClass="directory">
        <input-multi-select v-bind:value="value" inputLabel="FAQ.SearchDirectory"
                            inputId="directory-content" inputplaceholder="FAQ.DirectoryFindListing" name="directory-content"
                            :selectOptions="selectOptions">
        </input-multi-select>
        <div class="selected-list">
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3">
                    <ul>
                        <li v-for="(item, index) in value" :key="index">
                            <directory-item :directory="item" :dirContacts="selectedContacts(item.id)"></directory-item>
                            <span class="custom__remove " @click="removelink(index)">❌</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="directory_section_comment"
                         :comments="comments"
                         :addNew="false"
        ></comment-section>

        <div class="details"
             v-if="!isUpdateMode() || (isUpdateMode() && faqModel.comments == null)"
        >
            <div class="row">
                <div class=" col-sm-12">
                    <h5 class="header">{{ $t('FAQ.DirectoryCantFind')}}</h5>
                    <!--<router-link tag="a" to="##" class="btn btn-primary details-link  pull-left btn-lg ">-->
                    <!--</router-link>-->
                    <component-as-modal showModalButton="FAQ.DirectoryAddNewListing"
                                        componentName="createDirectory"
                                        @processDone="onProcessDone"
                    >
                    </component-as-modal>
                </div>
            </div>
        </div>

    </white-container>
</template>

<script>
    import Vue from "vue";
    import whiteContainer from "../../pages/whiteContainer.vue";
    import inputMultiSelect from "../../core/form/partials/input-multiselect/input-multiselect.vue"
    import {EventBus} from '../../../eventbus/event-bus.js';
    import componentAsModal from "../../modal/component-as-modal.vue";
    import CommentSection from "./comment-section.vue";
    import directory from "./directory.vue";

    export default {
        name: "directory",
        components: {
            componentAsModal,
            whiteContainer,
            inputMultiSelect,
            CommentSection,
            "directory-item": directory
        },

        // ===Props passed to component
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
        // ===component Data properties
        data() {
            return {
                value: [],
                selectOptions: []
            }
        },
        created: function () {
            this.getDirectories();
            this.loadDirectory();
        },
        // ===Computed properties for the component
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'DIRECTORY');
            },
        },
        // ===Component methods
        methods: {
            selectedContacts:function(directoryID) {
                let contacts = this.faqModel.contacts;
                let directoryContacts = [];

                if(contacts !== undefined) {
                    for(var i = 0; i < contacts.length; i++) {
                        if(contacts[i].directory_id = directoryID) {
                            directoryContacts.push(contacts[i].id);
                        }
                    }
                }
                return directoryContacts;
            },
            loadDirectory: function() {
                this.value = this.faqModel.directories === null ? [] : this.faqModel.directories;
            },
            getDirectories: function () {
                this.$apis.createEntity({
                    name: 'api/directory?paginate=0' +
                    '&with[]=contactForms' +
                    '&with[]=contactForms.phones' +
                    '&with[]=contactForms.workingHours' +
                    '&with[]=contactForms.directoryCountry' +
                    '&conditions[status:equal]=ACTIVE'+
                    '&sorting[name]=asc'
                });
                this.$apis.endpoints.getAll().then(({data}) => {
                    this.selectOptions = data.map((item)=>{
                        let theItem = item;
                        theItem.id = item.id;
                        if(item.contact_forms !== null) {
                            const directory_country = item.contact_forms[0].directory_country;
                            let theCountry = directory_country ? directory_country.country : item.contact_forms[0].country;
                            theItem.countryLabel = theCountry;
                            theItem.name = item.name+' ('+theCountry+')';
                        } else {
                            theItem.name = item.name;
                        }
                        return theItem;
                    });
                    // this.selectOptions = data;
                });
                EventBus.$on('update-multi-select', this.getvalues);
            },
            getvalues: function (data) {
                if (data.name === "directory-content") {
                    this.value = data.value;
                }
            },
            removelink: function (index) {
                this.value.splice(index, 1);
            },
            onProcessDone: function () {
                this.getDirectories();
                this.loadDirectory();
            },
            getId() {
                return this.$route.params.id;
            },
            isUpdateMode() {
                return this.$route.params.id == undefined ? false : true;
            },
        }
    };
</script>
<style type="text/css" lang="scss">
    .white-section.directory {
        .white-section_details {
            padding: 25px 0 35px;

        }
    }

    .directory {
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
                min-height: 150px;
                padding: 15px 15px;
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
                margin: 15px 0;
                position: relative;
                img {
                    max-height: 120px;
                }
                .directory-title {
                    font-weight: bold;
                    font-size: 15px;
                    margin-bottom: 20px;
                }
                .directory-info {
                    margin-bottom: 8px;
                    div {
                        display: inline-block;

                        padding-left: 25px;
                        /*display: none;*/
                        &:first-of-type {
                            padding-left: 0px;
                            display: inline-block;

                        }
                    }
                    span {
                        display: block;
                    }
                    p {
                        margin-bottom: 0;
                        display: inline-block !important;
                    }
                    i {
                        width: 15px;
                        vertical-align: top;
                    }
                    .timeFrom {
                        padding: 10px;
                    }
                    .day {
                        text-transform: lowercase;
                    }
                }

            }
            .phones span{
                display: inline-flex !important;
            }
            .custom__remove {
                padding-left: 1px;
                position: absolute;
                top: -8px;
                right: -9px;
                background-color: #636363;
                border-radius: 50%;
                color: #fff;
                width: 20px;
                height: 20px;
                text-align: center;
                padding-top: 1px;
                &:hover {
                    cursor: pointer;

                }
            }
        }
    }
</style>

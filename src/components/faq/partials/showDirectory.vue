<template>
    <white-container title="Directory.Directory" sectionClass="directory">
        <div class="selected-list">
            <div class="row">
                <div class="col-sm-12 col-lg-12">
                    <ul>
                        <li v-for="(directory, index) in faqModel.directories === null ? [] : faqModel.directories" :key="index">
                            <div class="row">
                                <div class="col-sm-1">
                                    <img v-if="directory.directory_media" class="rounded img-fluid float-md-right float-sm-left"
                                        :src="directory.directory_media.url"
                                    >
                                </div>
                                <div class="col-sm-9">
                                    <h4 class="directory-title">{{directory.name}} <span v-if="directory.acronym" class="acronym">({{directory.acronym}})</span><span v-if="directory.contact_forms.length > 0 && directory.contact_forms[0].country !== ''"> - {{directory.contact_forms[0].country}}</span></h4>
                                    <div class="directory-info" v-if="directory.service_categories">Service Categories: {{directory.service_categories.map(a=>a.name).join(', ')}}</div>
                                    <div
                                        class="addresses"
                                        v-if="faqModel.contacts"
                                        v-for="(contact, contactID) in directoryContacts(directory.id)"
                                        :key="contactID"
                                    >
                                        <contact-detail :contactModel="contact"></contact-detail>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="directory_section_comment" :showComment="showComment"
                     :comments="comments"
        ></comment-section>

        <component-as-modal buttonTag=""
                            showModalButton=""
                            componentName="contactFormMap"
                            :componentData="mapModalData">
        </component-as-modal>
    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import CommentSection from "./comment-section.vue";
    import contactDetail from './../../partials/contact-detail.vue';
    import ComponentAsModal from "./../../modal/component-as-modal";
    import { EventBus } from "./../../../eventbus/event-bus";

    export default {
        name: "directory",
        components: {
            whiteContainer,
            ComponentAsModal,
            CommentSection,
            'contact-detail':contactDetail
        },
        created: function() {
            EventBus.$on('selected-contact-model', this.setMapModalData);
        },
        // ===Props passed to component
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            showComment:{
                type:Boolean,
                default:true,
                required:false
            },
            showModal:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        // ===component Data properties
        data() {
            return {
                mapModalData:{}
            }
        },
        // ===Component methods
        methods: {
            setMapModalData:function(contactModel) {
                this.mapModalData = {
                    contactForm: contactModel.model,
                }
            },
            directoryContacts:function(directoryID) {
                let contacts = [];
                // console.log(this.faqModel.contacts);
                contacts = this.faqModel.contacts.filter((item)=>{
                    if(item.directory_id == directoryID) {
                        return item;
                    }
                });

                return contacts;
            }
        },
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'DIRECTORY');
            }
        }
    };
</script>
<style type="text/css" lang="scss">

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
            margin-left: 13px;
            > .row > .col-sm-12{
                padding: 0;
            }
            span.acronym {
                display: auto;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0 15px 20px 0;
            }
            li {
                min-height: 150px;
                padding: 15px 15px;
                border: 1px solid #ccc;
                -webkit-border-radius: 5px 5px;
                -moz-border-radius: 5px 5px;
                border-radius: 5px 5px;
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                /*box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);*/
                margin: 0 0 15px;
                position: relative;
                img {
                    max-height: 120px;
                }
                .directory-title {
                    font-weight: bold;
                    font-size: 15px;
                    margin-bottom: 20px;
                }
                .acronym{
                    display: inline-flex;
                }
                .address {
                    margin-bottom: 10px;
                    border-bottom:solid 1px #f0f0f0;
                }
                .directory-info {
                    margin-bottom: 8px;
                    div {
                        display: inline-block;

                        padding-left: 25px;
                        /*display: none;*/
                        &:first-of-type {
                            padding-left: 0;
                            display: inline-block;

                        }
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
        }
    }
</style>

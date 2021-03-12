<template>
    <div class="comment-component">

        <hr  v-if="addNew || (showOld && (mostRecentComment || oldComments.length > 0))">

        <div class="add-comment-component" v-if="addNew && showComment">
            <div class="row">
                <div class="col-9">
                    <input-textarea  placeholder=""
                                     :errors="errors.comments"
                                     :name="name"
                                     :inputClass="name + '_class'"
                                     :inputId="name + '_id'"
                                     inputLabel="Comment.Comment"
                                     :required="false"
                                     :row="4"
                                     no-resize
                                     error=""
                                     value=""
                    >
                    </input-textarea>
                </div>
            </div>
        </div>

        <div class="show-comment-component" v-if="showOld">

            <!-- Most Recent Comments -->
            <div class="row ">
                <div class="col-9">
                    <template v-if="mostRecentComment">
                        <div class="row single-comment">
                            <div class="col-3">
                                {{mostRecentComment.created_by.first_name + " " + mostRecentComment.created_by.last_name}}
                                <br>
                                <span class="comment-created-at">{{formatDate(mostRecentComment.created_at)}}</span>
                            </div>
                            <div class="col-9 comment-content">
                                {{mostRecentComment.comment}}
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Show More Button -->
            <div class="show-more" v-if="oldComments.length > 0">
                <a @click="showHistory = !showHistory">
                    View history
                    <i class="fa fa-angle-right toggle-icon" :class="{active: showHistory}"></i>
                </a>
            </div>

            <!-- Old Comments -->
            <div class="row" v-if="showHistory">
                <div class="col-9 old-comments">
                    <template v-for="comment in oldComments">
                        <div class="row single-comment">
                            <div class="col-3">
                                {{comment.created_by.first_name + " " + comment.created_by.last_name}}
                                <br>
                                <span class="comment-created-at">{{formatDate(comment.created_at)}}</span>
                            </div>
                            <div class="col-9 comment-content">
                                {{comment.comment}}
                            </div>
                        </div>
                    </template>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import Vue from "vue";
    import whiteContainer from "../../pages/whiteContainer.vue"
    import inputTextarea from "../../core/form/partials/input-textarea/input-textarea.vue"

    export default {
        name: "comment-section",
        props: {
            name: {
                type: String,
                required: true
            },
            comments: {
                type: Array,
                required: true
            },
            addNew: {
                type: Boolean,
                required: false,
                default: true
            },
            showOld: {
                type: Boolean,
                required: false,
                default: true
            },
            showComment:{
                type: Boolean,
                required: false,
                default: true
            }
        },
        components: {
            whiteContainer,
            inputTextarea
        },
        data() {
            return {
                errors: [],
                showHistory: false,
            }
        },
        // ===Code to be executed when Component is mounted
        created() {

        },
        // ===Component methods
        methods: {
            formatDate: function(dateString) {
                let date = new Date(dateString);
                return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getUTCFullYear();
            }
        },
        computed: {

            mostRecentComment: function() {
                if (this.comments == null)
                    return {};

                let comments = this.comments.slice(0);
                comments.reverse();
                return comments[0];
            },
            oldComments: function() {
                if (this.comments == null)
                    return [];

                let comments = this.comments.slice(0);
                comments.reverse();
                return comments.slice(1);
            }
        }
    };
</script>
<style scoped type="text/css" lang="scss">

    .comment-component {
        margin-top: 10px;
        /*margin-bottom: 10px;*/
        /*padding-left: 15px;*/
        /*padding-bottom: 20px;*/
    }
    .add-comment-component {
        padding-top: 10px;
        /*margin-top: 23px;*/
    }
    .show-comment-component {
        /*margin-top: 15px;*/
        /*margin-bottom: 15px;*/
        .single-comment {
            margin-top: 18px;
            .comment-content {
                font-size: 11px;
            }
            .comment-created-at {
                font-size: 11px;
            }
        }
        .show-more {
            margin-top: 15px;
            &:hover {
                cursor: pointer;
            }
        }

        .old-comments {
            margin-top: 15px;
            max-height: 150px;
            overflow-y: auto;
        }
    }

    .toggle-icon {
        font-size: 16px;
        margin-left: 5px;
        position: relative;
        top: 2px;
        &.active {
            transform: rotate(90deg);
            -webkit-transition: -webkit-transform .2s ease-in-out;
            -ms-transition: -ms-transform .2s ease-in-out;
            transition: transform .2s ease-in-out;
        }
    }



</style>

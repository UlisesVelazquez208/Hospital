<template>
    <white-container title="FAQ.SocialMedia" class="sociallinks-container">
        <div class="sociallinks-list ">
            <div class="row">
                <div class="col-sm-12 col-lg-9" style="margin-left: -22px">
                    <ul>
                        <li v-for="(item, index) in faqModel.social_media_links === null ? [] : faqModel.social_media_links">
                            <i class="fa fa-soundcloud" aria-hidden="true"></i>
                            <span>{{item.url}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Comment -->
        <comment-section name="social_media_link_section_comment" :showComment="showComment"
                     :comments="comments"
        ></comment-section>

    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import CommentSection from "./comment-section.vue";

    export default {
        // ===Component name
        name: "",
        // ===Props passed to component
        props: {
            faqModel: {
                type: Object
            },
            showComment:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        // ===Components used by this component
        components: {
            whiteContainer,
            CommentSection
        },
        // ===component Data properties
        data() {
            return {
            }
        },
        // ===Code to be executed when Component is mounted
        mounted() {

        },
        // ===Component methods
        methods: {

        },
        computed: {
            comments: function() {
                if (this.faqModel.comments == null)
                    return [];

                return this.faqModel.comments.filter(comment => comment.section == 'SOCIAL_MEDIA_LINKS');
            }
        }
    }
</script>
<style scoped type="text/css" lang="scss">
    .sociallinks-container {

        .sociallinks-list {
            ul {
                list-style: none;
            }
            li {
                margin: 7px 0;
            }
        }
    }

</style>

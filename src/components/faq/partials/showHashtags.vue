<template>
    <white-container title="Hashtag.Hashtag" sectionClass="hashtags">

        <div class="hashtag-details">
            <ul class="hashtags-list">
                <li v-for="(item) in faqModel.hashtags === null ? [] : faqModel.hashtags">
                    <a class="hashtag-link" @click.prevent="click" href="#">#{{item.hashtag}}</a>
                </li>
            </ul>
        </div>

        <!-- Comment -->
        <comment-section name="hashtag_section_comment" :showComment="showComment"
                     :comments="comments"
        ></comment-section>

    </white-container>
</template>

<script>
    import whiteContainer from "../../pages/whiteContainer.vue"
    import CommentSection from "./comment-section.vue";

    export default {
        name: "AddHashtag",
        components: {
            whiteContainer,
            CommentSection
        },
        props: {
            faqModel: {
                type: Object,
                required: false
            },
            showComment:{
                type:Boolean,
                default:true,
                required:false
            }
        },
        data(){
            return{
            }
        },
        methods: {
            getId() {
                return this.$route.params.id;
            },
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

    .hashtag-details {
        .hashtags-list {
            overflow: auto;
            padding: 3px 15px;
            margin: 0;

            li {
                display: inline;
                float: left;
            }
        }
        .hashtag-link {
            display: block;
            padding: 10px;
            margin-right: 5px;
            margin-bottom: 5px;
            background-color: #E1EFF5;
            border-radius: 4px;
            color: #000;
        }
    }

</style>


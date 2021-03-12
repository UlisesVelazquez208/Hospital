<template>
    <white-container title="FAQ.SocialMedia" class="sociallinks-container">
        <div class="sociallinks-form">
            <div class="row mb-2">
                <label for="social-website-link" class="col-sm-12  col-lg-3 col-form-label">{{ $t('Common.Website') }}</label>
                <div class=" col-sm-10  col-lg-7 col-xl-8">
                    <input v-model="websiteLink.url" type="text" name="name" class="form-control" id="website-link"
                            placeholder="https://example.com"
                            v-on:blur="addWebsiteLink"
                    >
                    <div v-if="invalidUrl.websiteLink" class="text-danger">
                        {{invalidUrl.invalidError}}
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <label for="social-facebook-link" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.FacebookMediaItemLink') }}</label>
                <div class=" col-sm-10  col-lg-7 col-xl-8">
                    <input v-model="facebookLink.url" type="text" name="name" class="form-control" id="social-facebook-link"
                            placeholder="https://facebook.com/"
                            pattern="https://facebook.com/.*"
                            v-on:blur="addFacebookLink"
                    >
                    <div v-if="invalidUrl.facebookLink" class="text-danger">
                        {{invalidUrl.invalidError}}
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <label for="social-instagram-link" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.InstagramMediaItemLink') }}</label>
                <div class=" col-sm-10  col-lg-7 col-xl-8">
                    <input v-model="instagramLink.url" type="text" name="name" class="form-control" id="social-instagram-link"
                            placeholder="https://instagram.com/"
                            pattern="https://instagram.com/.*"
                            v-on:blur="addInstagramLink"
                    >
                    <div v-if="invalidUrl.instagramLink" class="text-danger">
                        {{invalidUrl.invalidError}}
                    </div>
                </div>
            </div>
            <div class="row mb-2">
                <label for="social-twitter-link" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.TwitterMediaItemLink') }}</label>
                <div class=" col-sm-10  col-lg-7 col-xl-8">
                    <input v-model="twitterLink.url" type="text" name="name" class="form-control" id="social-twitter-link"
                            placeholder="https://twitter.com/"
                            pattern="https://twitter.com/.*"
                            v-on:blur="addTwitterLink"
                    >
                    <div v-if="invalidUrl.twitterLink" class="text-danger">
                        {{invalidUrl.invalidError}}
                    </div>
                </div>
            </div>

            <div class="row">
                <label for="socialLink" class="col-sm-12  col-lg-3 col-form-label">{{ $t('FAQ.SocialMediaItemLink') }}</label>
                <div class=" col-sm-10  col-lg-7 col-xl-8">
                    <input v-model="socialLink.value" type="text" name="name" class="form-control" id="socialLink"
                            placeholder="https://example.com"
                            pattern="https://.*"
                    >
                    <div v-if="invalidUrl.socialLink" class="text-danger">
                        {{invalidUrl.invalidError}}
                    </div>
                </div>
                <div class="col-sm-2 col-lg-2 col-xl-1">
                    <button @click="addLink()" type="button" class="btn add-btn btn-secondary">+
                    </button>
                </div>
            </div>
        </div>
        <div class="sociallinks-list ">
            <div class="row">
                <div class="col-sm-12 col-lg-9 offset-lg-3">
                    <ul>
                        <li v-for="(item, index) in socialMediaLinks" v-if="!item.deleted && item.type === 'other'" :key="index" >
                            <span>{{item.url}}</span>
                            <span
                                    class="custom__remove pull-right"
                                    @click="removeLink(index)">❌</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Comment -->
        <!-- <comment-section name="social_media_link_section_comment"
                         :comments="comments"
                         :addNew="false"
        ></comment-section> -->

    </white-container>
</template>

<script>
    import whiteContainer from "./../../pages/whiteContainer.vue"
    import {EventBus} from "./../../../eventbus/event-bus";
    // import CommentSection from "./comment-section.vue"

    export default {
        // ===Component name
        name: "",
        // ===Props passed to component
        props: {
            directoryModel: {
                type: Object,
                required: false
            },
            errors: {
                type: Array,
                required: false
            },
        },
        // ===Components used by this component
        components: {
            whiteContainer,
            // CommentSection
        },
        // ===component Data properties
        data() {
            return {
                socialMediaLinks: [],
                websiteLink: {url: ""},
                instagramLink: {url: ""},
                facebookLink: {url: ""},
                twitterLink: {url: ""},
                socialLink: {value: ""},
                invalidUrl: {
                    instagramLink: false,
                    facebookLink: false,
                    twitterLink: false,
                    socialLink: false,
                    invalidError: "Please enter a valid URL"
                },
                reg: {
                    websiteLink: '^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?',
                    instagramLink: '^((https:)+\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}(instagram.com/)+(\\?(.)*)?',
                    facebookLink: '^((https:)+\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}(facebook.com/)+(\\?(.)*)?',
                    twitterLink: '^((https:)+\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}(twitter.com/)+(\\?(.)*)?',
                    socialLink: '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?'
                },
                isUpdate: false,
            }
        },
        // ===Code to be executed when Component is mounted
        created() {
            this.loadLinks();
        },
        // ===Code to be executed when Component is mounted
        mounted() {

        },
        // ===Computed properties for the component
        computed: {
        },
        // ===Component methods
        methods: {
            loadLinks: function () {
                const mediaLinks = this.directoryModel.directory_media_links;
                if(mediaLinks && Array.isArray(mediaLinks) && mediaLinks.length > 0) {
                    this.isUpdate = true;
                    this.socialMediaLinks = mediaLinks;

                    const instagramLinkPosition = mediaLinks.findIndex((value) => value['type'] === 'instagram');

                    if(instagramLinkPosition >= 0) {
                        this.instagramLink = mediaLinks[instagramLinkPosition];
                    }

                    const facebookLinkPosition = mediaLinks.findIndex((value) => value['type'] === 'facebook');
                    if(facebookLinkPosition >= 0) {
                        this.facebookLink = mediaLinks[facebookLinkPosition];
                    }

                    const twitterLinkPosition = mediaLinks.findIndex((value) => value['type'] === 'twitter');
                    if(twitterLinkPosition >= 0) {
                        this.twitterLink = mediaLinks[twitterLinkPosition];
                    }

                    for(var i = 0; i < mediaLinks.length; i++) {
                        let theItem = mediaLinks[i];

                        if(theItem['type'] == 'website') {
                            this.websiteLink.url = theItem.url;
                            break;
                        }
                    }
                } else {
                    this.socialMediaLinks = [];
                }
            },
            addLink: function () {
                if (this.socialLink.value !== "" && (this.ValidURL(this.socialLink.value))) {
                    this.socialMediaLinks.push({url: this.socialLink.value, isShow: true, type: 'other'});
                    this.socialLink.value = "";
                    EventBus.$emit('update-socialMediaLink', this.socialMediaLinks);
                }
            },
            addWebsiteLink: function() {
                this.addSpecialSocialLink('website');
            },
            addInstagramLink: function() {
                this.addSpecialSocialLink('instagram');
            },
            addFacebookLink: function() {
                this.addSpecialSocialLink('facebook');
            },
            addTwitterLink: function() {
                this.addSpecialSocialLink('twitter');
            },
            addSpecialSocialLink: function(type) {
                const position = this.socialMediaLinks.findIndex((value) => value.type === type);
                const value = this[`${type}Link`].url;
                
                if (value !== "") {
                    if(this.ValidURL(value, `${type}Link`)) {
                        if(!this.isUpdate) {
                            this.socialMediaLinks.push({url: value, isShow: false, type: type});
                        } else {
                            if(position > -1) {
                                this.socialMediaLinks[position].url = value;
                            } else {
                                this.socialMediaLinks.push({url:value, isShow:false, type:type});
                            }
                        }
                    }
                } else {
                    if(position !== -1) {
                        this.socialMediaLinks[position].deleted = true;
                    }
                }

                if(position >= 0 && !this.isUpdate) {
                    this.socialMediaLinks.splice(position, 1);
                }

                EventBus.$emit('update-socialMediaLink', this.socialMediaLinks);
            },
            removeLink: function (index) {
                if (this.socialMediaLinks[index].id) {
                    this.socialMediaLinks[index].deleted = true;
                    this.$forceUpdate();
                } else {
                    this.socialMediaLinks.splice(index, 1);
                }
                EventBus.$emit('update-socialMediaLink', this.socialMediaLinks);
            },
            ValidURL: function (url, type='socialLink') {
                let pattern = new RegExp(this.reg[type]);

                if (pattern.test(url) === false) {
                    Object.assign(this.invalidUrl, {[type]: true});
                    return false;
                }

                Object.assign(this.invalidUrl, {[type]: false});

                return true;
            }
        }
    }
</script>
<style scoped type="text/css" lang="scss">
    .sociallinks-container {
        .sociallinks-form {
            .form-control {
                padding: 10px;
            }

        }
        .add-btn {
            background-color: #0C83C6;
            padding: 10px 15px;
            width: 100%;
            border: none;
        }
        .add-btn:hover {
            background-color: #0b5d8c;
        }
        .sociallinks-list {
            ul {
                list-style: none;
                padding: 0;
                margin: 20px 0px;
            }
            li {
                padding: 15px 15px;
                /*box-shadow: 1px 1px 1px 1px #bbbbbbf5;*/
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
                margin: 7px 0;

            }
            .custom__remove {
                color: #0C83C6;
                &:hover {
                    cursor: pointer;

                }
            }
        }
    }

</style>

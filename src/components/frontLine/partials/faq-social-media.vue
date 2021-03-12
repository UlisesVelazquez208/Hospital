<template>
    <div class="text-left p-4 widget_social_icons general-info-container ">
        <h5 class="section-title">{{ $t('FAQ.SocialMedia') }}</h5>
        <div class="sociallinks-details">
            <ul class="sociallink-list" v-if="faq.socialLinks && faq.socialLinks.length">
                <li v-if="getSpecialLink('facebook')">
                    <a :href="getSpecialLink('facebook').url" rel="noopener" class="social-link" target="_blank" >
                        <i class="fa fa-facebook-square" aria-hidden="true"></i>
                        <span>{{getSpecialLink('facebook').url}}</span>
                    </a>
                </li>
                <li v-if="getSpecialLink('instagram')">
                    <a :href="getSpecialLink('instagram').url" rel="noopener" class="social-link" target="_blank" >
                        <i class="fa fa-instagram" aria-hidden="true"></i>
                        <span>{{getSpecialLink('instagram').url}}</span>
                    </a>
                </li>
                <li v-if="getSpecialLink('twitter')">
                    <a :href="getSpecialLink('twitter').url" rel="noopener" class="social-link" target="_blank" >
                        <i class="fa fa-twitter-square" aria-hidden="true"></i>
                        <span>{{getSpecialLink('twitter').url}}</span>
                    </a>
                </li>
                <li v-for="(item, index) in getOtherLinks()" :key="index">
                    <a :href="item.url" rel="noopener" class="social-link" target="_blank"
                    >
                        <i class="fa fa-external-link" aria-hidden="true"></i>
                        <span>{{item.url}}</span>
                    </a>
                </li>
            </ul>
            <not-found v-else text="Common.NoSocialMedia" icon="fa-question-circle"></not-found>
        </div>
    </div>
</template>

<script>
    import NotFound from "./not-found";
    export default {
        name: "faq-social-media",
        components: {NotFound},
        props: {
            faq: {
                required: true,
                type: Object
            }
        },
        methods:{
            getSpecialLink: function(type) {
                const position = this.faq.socialLinks.findIndex((value) => value.type === type);
                return position >= 0 ? this.faq.socialLinks[position] : null;
            },
            getOtherLinks: function() {
                return this.faq.socialLinks.filter((value) => value.type === 'other');
            }
        }
    }
</script>

<style scoped>

</style>

<template>
    <!-- Social Media Links -->
    <white-container title="FAQ.SocialMedia" sectionClass="sociallinks-container">
        <div class="sociallinks-list ">
            <div class="row">
                <div class="col-sm-12 col-lg-9" style="margin-left: -22px">
                    <ul>
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
                            <a :href="item.url" rel="noopener" class="social-link" target="_blank" >
                                <i class="fa fa-external-link" aria-hidden="true"></i>
                                <span>{{item.url}}</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </white-container>
</template>
<script>
import whiteContainer from "./../pages/whiteContainer";

export default {
    props: ["directoryMediaLinks"],
    name: "directory-details",
    components: {
        whiteContainer,
    },
    methods:{
        getSpecialLink: function(type) {
            const position = this.directoryMediaLinks.findIndex((value) => value.type === type);
            return position >= 0 ? this.directoryMediaLinks[position] : null;
        },
        getOtherLinks: function() {
            return this.directoryMediaLinks.filter((value) => value.type === 'other');
        }
    }
}
</script>
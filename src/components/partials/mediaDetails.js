import LoadingSpinner from "./../spinner/loading-spinner";
import whiteContainer from "./../pages/whiteContainer.vue";
import {Carousel, Slide} from 'vue-carousel';

var mediaDetails = {
    props: ["singleMedia", "mediaBusy"],
    name: "media-details",
    components: {
        LoadingSpinner,
        whiteContainer,
        Slide,
        Carousel
    },
    data() {
        return {
            currentUrl:''
            // singlemedia: null,
            // mediaTab: false,
        }
    },
    computed: {
    },
    beforeUpdate() {
        $(document).ready(function () {
            $('.VueCarousel-inner').each(function (index, element) {
                $(element).find('VueCarousel-slide').slice(0, 4).addClass('VueCarousel-slide-active');
                $(element).attr("style", "transform: translate(0px, 0px); transition: transform 0.5s ease; visibility: visible;");
            });
        });
    },
    methods: {
        audioMedia() {
            return (this.singleMedia.content_type == 'AUDIO');
        },
        videoMedia() {
            return (this.singleMedia.content_type == "VIDEO");
        },
        posterMedia() {
            return this.singleMedia.content_type == 'POSTER';
        },
        pdfMedia() {
            return this.singleMedia.content_type == 'PDF';
        },
        getMeta: function (metas, key) {
            if (!metas) {
                return '';
            }

            for (let meta of metas) {
                if (meta.key === key) {
                    return meta.value;
                }
            }

            return '';
        },
        setCurrentUrl(url) {
            this.currentUrl = url;
        }
    },
    watch: {
    }
};


export default mediaDetails;
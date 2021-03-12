import LoadingSpinner from "./../spinner/loading-spinner";
import whiteContainer from "./../pages/whiteContainer.vue";
import contactDetail from "./../partials/contact-detail.vue";
import ComponentAsModal from "./../modal/component-as-modal";
import { EventBus } from './../../eventbus/event-bus.js';
import directoryMediaLinks from './directoryMediaLinks.vue';
import hashtags from './hashtags.vue';
import NotFound from "../frontLine/partials/not-found";
import directoryInfo from "./directoryInfo";

var directoryDetails = {
    props: ["singleDirectory", "directoryBusy"],
    name: "directory-details",
    components: {
        LoadingSpinner,
        whiteContainer,
        ComponentAsModal,
        "contact-detail":contactDetail,
        "directory-media-links":directoryMediaLinks,
        "hashtags":hashtags,
        "directory-info":directoryInfo,
        NotFound
    },
    data() {
        return {
            mapModalData:{},
        }
    },
    created: function() {
        EventBus.$on('selected-contact-model', this.setMapModalData);
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
        setMapModalData:function(contactModel) {
            this.mapModalData = {
                contactForm: contactModel.model,
                name: this.singleDirectory.name,
                id: this.singleDirectory.id
            }
        },
    },
    watch: {
    }
};


export default directoryDetails;
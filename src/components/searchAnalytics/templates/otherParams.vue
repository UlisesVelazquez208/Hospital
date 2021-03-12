<template>
    <p v-html="data.params_string"></p>
</template>
<script>
    import contextMenu from 'vue-context-menu'
    import coreFormClass from "../../core/form/script";
    import {EventBus} from '../../../eventbus/event-bus.js';

    export default {
        props: ['data', 'index'],
        name: 'other-params-search-analytics-component',
        components: {contextMenu},
        data: function() {
            return {
                canView: false
            }
        },
        mounted() {
            this.canView = this.$acl.currentUserCan('SHOW', 'CaptureSearch');
        }
    }
</script>

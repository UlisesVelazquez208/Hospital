<template>
    <div class="action-container">
        <a  v-if="canView"
            :href="'#/search-analytics/view/'+ data.id" class="btn btn-info btn-xs text-white">
            <span class="fa fa-eye"></span>
        </a>
    </div>
</template>
<script>
    import contextMenu from 'vue-context-menu'
    import coreFormClass from "../../core/form/script";
    import {EventBus} from '../../../eventbus/event-bus.js';

    export default {
        props: ['data', 'index'],
        name: 'action-search-analytics-component',
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

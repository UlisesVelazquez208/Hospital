<template>
    <!-- @TODO dots and manue design -->
    <div class="action-container">
        <a :href="'#/faq/view/'+ data.id" class="btn btn-info btn-xs text-white" target="_blank">
            <span class="fa fa-eye"></span>
        </a>
        <a @click.prevent="deleteRow(data.id)" href="#" class="btn btn-danger btn-xs text-white"><span
                class="fa fa-times"></span></a>
    </div>
</template>
<script>
    import contextMenu from 'vue-context-menu';
    // import coreFormClass from "./../../../core/form/script";
    import { EventBus } from './../../../eventbus/event-bus';

    export default {
        props: ['data', 'index'],
        name: 'linked-faqs-list-action',
        components: {contextMenu},
        methods: {
            deleteRow: function (id) {
                EventBus.$emit('unlink-faq', id);
            },
            failure() {
                // this.$router.replace('/404');
            },
            getModule() {
                return "faq-hashtag";
            },
            success() {
            },
            getComponentName() {
                return this.name;
            }
        },
        data: function() {
            return {
                // canUpdate: false,
                // canDelete: false
            }
        },
        mounted() {
            // this.canUpdate = this.$acl.currentUserCan('UPDATE', 'HashTag');
            // this.canDelete = this.$acl.currentUserCan('DELETE', 'HashTag');
        }
    }
</script>

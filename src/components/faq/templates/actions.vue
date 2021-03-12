<template>
    <!-- @TODO dots and manue design -->
    <div class="action-container">
        <a  v-if="canView"
            :href="'#/faq/view/'+ data.id" class="btn btn-info btn-xs btn-action text-white">
            <span class="fa fa-eye"></span>
        </a>
        <a v-if="canApprove"
           :href="'#/faq/approve-faq/'+ data.id" class="btn btn-warning btn-xs btn-action text-white"><span
                class="fa fa-thumbs-up"></span></a>
        <a v-if="canUpdate || ($acl.currentUserCan('UPDATE MINE', 'FAQ') && data.created_by_id == $acl.currenUserID())"
           :href="'#/faq/update-faq/'+ data.id" class="btn btn-primary btn-xs btn-action"><span
                class="fa fa-pencil"></span></a>
        <a v-if="canDelete || ($acl.currentUserCan('DELETE MINE', 'FAQ') && data.created_by_id == $acl.currenUserID())"
           @click.prevent="deleteRow(data.id)" href="#" class="btn btn-danger btn-xs btn-action text-white"><span
                class="fa fa-times"></span></a>
    </div>
</template>
<script>
    import contextMenu from 'vue-context-menu'
    import coreFormClass from "../../core/form/script";
    import {EventBus} from '../../../eventbus/event-bus.js';

    export default {
        props: ['data', 'index'],
        name: 'my-component',
        components: {contextMenu},
        data: function() {
            return {
                canUpdate: false,
                canDelete: false,
                canApprove: false,
                canView:false
            }
        },
        methods: {
            deleteRow: function (id) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Delete'
                }).then((result) => {
                    if (result.value) {
                        EventBus.$emit('showDatatableLoading');
                        coreFormClass.deleteItem(id, this.getModule(), this.success, this.failure);
                    }
                })
            },
            failure() {
                this.$router.replace('/404');
            },
            getModule() {
                return "faq"
            },
            success() {
                this.$swal({
                    toast:true,
                    position: 'top-end',
                    type: 'success',
                    title: ' Deleted!',
                    text: 'Your FAQ has been deleted',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    EventBus.$emit('hideDatatableLoading');
                    EventBus.$emit('refreshDataTable', { componentName: this.getComponentName() });
                });
            },
            getComponentName() {
                return "faq-list"
            }
        },
        mounted() {
            this.canUpdate = this.$acl.currentUserCan('UPDATE', 'FAQ');
            this.canDelete = this.$acl.currentUserCan('DELETE', 'FAQ');
            this.canApprove = this.$acl.currentUserCan('PUBLISH', 'FAQ');
            this.canView = this.$acl.currentUserCan('SHOW', 'FAQ');
        }
    }
</script>

<!-- styles -->

<style type="text/css" lang="scss">
    .btn-action {
        width: 21px;
    }
</style>
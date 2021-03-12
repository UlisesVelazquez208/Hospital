<template>
    <!-- @TODO dots and manue design -->
    <div class="action-container">
        <a v-if="canUpdate || data.created_by_id === undefined || ($acl.currentUserCan('UPDATE MINE', 'Nationality') && data.created_by_id == $acl.currenUserID())"
           :href="'#/nationality/update-nationality/'+ data.id" class="btn btn-primary btn-xs"><span
                class="fa fa-pencil"></span></a>
        <a v-if="canDelete || data.created_by_id === undefined || ($acl.currentUserCan('DELETE MINE', 'Nationality') && data.created_by_id == $acl.currenUserID())"
           @click.prevent="deleteRow(data.id)" href="#" class="btn btn-danger btn-xs text-white"><span
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
                return "nationality"
            },
            success() {
                this.$swal({
                    toast:true,
                    position: 'top-end',
                    type: 'success',
                    title: ' Deleted!',
                    text: 'Your Country has been deleted',
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    EventBus.$emit('hideDatatableLoading');
                    EventBus.$emit('refreshDataTable', { componentName: this.getComponentName() });
                });
            },
            getComponentName() {
                return "nationality-list";
            }
        },
        data: function() {
            return {
                canUpdate: false,
                canDelete: false
            }
        },
        mounted() {
            this.canUpdate = this.$acl.currentUserCan('UPDATE', 'Nationality');
            this.canDelete = this.$acl.currentUserCan('DELETE', 'Nationality');
        }
    }
</script>

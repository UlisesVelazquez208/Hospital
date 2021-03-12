<template>
    <div class="action-container">
        <a v-if="canUpdate || data.created_by_id === undefined || ($acl.currentUserCan('UPDATE MINE', 'DirectoryCountry') && data.created_by_id == $acl.currenUserID())"
            :href="`#/${getModule()}/update/${data.id}`"
            class="btn btn-primary btn-xs"
        >
            <span class="fa fa-pencil"></span>
        </a>
        <a v-if="canDelete || data.created_by_id === undefined || ($acl.currentUserCan('DELETE MINE', 'DirectoryCountry') && data.created_by_id == $acl.currenUserID())"
            @click.prevent="deleteRow(data.id)"
            href="#"
            class="btn btn-danger btn-xs text-white"
        >
            <span class="fa fa-times"></span>
        </a>
    </div>
</template>
<script>
    import contextMenu from 'vue-context-menu'
    import coreFormClass from "../../core/form/script";
    import {EventBus} from '../../../eventbus/event-bus.js';

    export default {
        props: ['data', 'index'],
        name: 'directory-country-action',
        components: {contextMenu},
        methods: {
            deleteRow: function (id) {
                this.$swal({
                    title: this.$t('DirectoryCountry.DeleteTitleModel'),
                    text: this.$t('DirectoryCountry.DeleteContentModel'),
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: this.$t('DirectoryCountry.DeleteButtonConfirmModel')
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
                return "directory-country"
            },
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: '',
                    text: this.$t('DirectoryCountry.DeleteContentToast'),
                    showConfirmButton: false,
                    timer: 1000
                }).then(() => {
                    EventBus.$emit('hideDatatableLoading');
                    EventBus.$emit('refreshDataTable', { componentName: this.getComponentName() });
                });
            },
            getComponentName() {
                return "directory-country-list";
            }
        },
        data: function() {
            return {
                canUpdate: false,
                canDelete: false
            }
        },
        mounted() {
            this.canUpdate = this.$acl.currentUserCan('UPDATE', 'DirectoryCountry');
            this.canDelete = this.$acl.currentUserCan('DELETE', 'DirectoryCountry');
        }
    }
</script>

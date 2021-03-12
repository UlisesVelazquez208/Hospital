<template>
    <div>
        <a @click.prevent="unlink(data)" href="#" class="btn btn-danger btn-xs text-white"><span title="Unlink"
                                                                                                 class="fa fa-chain-broken"></span></a>
    </div>
</template>
<script>
    import contextMenu from 'vue-context-menu'
    import coreFormClass from "../../core/form/script";

    export default {
        props: ['data', 'index'],
        name: 'my-component',
        components: {contextMenu},
        methods: {
            unlink: function (data) {
                this.$swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Remove'
                }).then((result) => {
                    if (result.value) {
                        // coreFormClass.deleteItem(id, this.getModule(), this.success, this.failure);
                        this.$apis.createEntity({name: 'api/' + this.getModule()});
                        this.$apis.endpoints.update({
                            name: data.name,
                            id: data.id,
                            faqs: [data.faq_id],
                            update_method: 'detach'
                        }).then(this.success).catch(this.failure);
                    }
                })
            },
            failure(e) {
                this.$swal({
                    title: 'Error?',
                    text: "It looks like that this item not exist any more Do you want to refresh the page!",
                    type: 'error',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Refresh'
                }).then(function (result) {
                    if (result.value) {
                        location.reload();
                    }
                });
            },
            getModule() {
                return "my-list"
            },
            success() {
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: ' Deleted!',
                    text: 'Your FAQ has been deleted',
                    showConfirmButton: false,
                    timer: 1500
                }).then(function () {
                    location.reload();
                });
            },
        },
    }
</script>

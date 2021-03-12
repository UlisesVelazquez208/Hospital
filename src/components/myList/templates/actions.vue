<template>
    <div class="action-container">
        <a :href="'#/my-list/linked-faqs/'+ data.id" class="btn btn-secondary btn-xs"><span
                class="fa fa-link"></span></a>
        <a :href="'#/my-list/update-mylist/'+ data.id" class="btn btn-primary btn-xs"><span
                class="fa fa-pencil"></span></a>
        <a @click.prevent="deleteRow(data.id)" href="#" class="btn btn-danger btn-xs text-white"><span
                class="fa fa-times"></span></a>
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
                        coreFormClass.deleteItem(id, this.getModule(), this.success, this.failure);
                    }
                })
            },
            failure() {
                this.$router.replace('/404');
            },
            getModule() {
                return "my-list"
            },
            success() {
                this.$swal({
                    toast:true,
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

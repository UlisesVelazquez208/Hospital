<template>
    <component-container :title="getTitle()" class="roles-container">

        <loading-spinner v-if="loadingSpinner" :is-loading="loadingSpinner"/>

        <form v-else v-on:submit.prevent="">

            <!-- Role Title -->
            <input-text inputId="role_name" inputClass="name"
                        inputLabel="UserRole.Name" placeholder=""
                        name="role_name" :value="roleModel.role_name" :errors="errors.name"
                        :required="false"
            >
            </input-text>

            <table class="permissions-table table table-striped">
                <thead class="table-header">
                    <tr>
                        <td align="center">{{ $t('UserRole.ResourceType')}}</td>
                        <td align="center">{{ $t('UserRole.Permissions')}}</td>
                        <td align="center">{{ $t('UserRole.Actions')}}</td>
                    </tr>
                </thead>
                <tbody>

                    <tr v-for="(resourcePermissions, resourceName) in validResources" :key="resourceName">
                        <td style="font-weight: bold">{{resourceName}}</td>
                        <td>
                            <div class="permission-container">
                                <input-checkbox v-for="permission in resourcePermissions" :key="permission.id"
                                                :input-label="permission.name"
                                                name="role_permissions"  :value="permission.id"
                                                :checked="roleModel.role_permissions.includes(permission.id)"
                                                class="select-input"
                                >
                                </input-checkbox>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-xs btn-link" @click="checkAll(resourcePermissions)"><i class="fa fa-check" aria-hidden="true"></i> {{ $t('Common.CheckAll') }}</button>
                            <button type="button" class="btn btn-xs btn-link" @click="unCheckAll(resourcePermissions)"><i class="fa fa-close" aria-hidden="true"></i> {{ $t('Common.UncheckAll') }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <span class="text-danger">{{errors.permissions}}</span>

            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group text-right">
                        <loading-button
                                buttonName="Common.Cancel"
                                @click="onCancel"
                                :isLoading="false"
                                classNames="btn cancel-button"
                        >
                        </loading-button>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group text-left">
                        <loading-button
                                buttonName="Common.Save"
                                :isLoading="isLoading"
                                @click="onSubmit"
                                classNames="btn btn-submit"
                        >
                        </loading-button>
                    </div>
                </div>
            </div>

        </form>

    </component-container>
</template>

<script>
    import componentContainer from '../pages/componentContainer.vue';
    import API from "../APIs/AbstractAPIs.js"
    import inputText from "../core/form/partials/input-text/input-text.vue"
    import loadingSpinner from "../spinner/loading-spinner.vue"
    import loadingButton from "../spinner/loading-button.vue"
    import inputCheckbox from "../core/form/partials/input-checkbox/input-checkbox.vue";
    import {EventBus} from '../../eventbus/event-bus.js'

    var api = new API;
    api.refreshAuthHeader();

    export default {
        name: "manage-role",
        props: {},
        data() {
            return {
                loadingSpinner: true,
                roleModel: {
                    role_name: "",
                    role_permissions: []
                },
                validResources: [],
                isLoading: false,
                errors: [],
            }
        },
        created() {
            // Listen to any input/change on the form fields
            EventBus.$on('update-input-field', this.updateModel);
            EventBus.$on('update-checkbox-field', this.updateModel);
            EventBus.$on('clear-input-field', this.clearError);
        },
        async mounted() {
            if (this.isUpdateMode()) {
                await this.retrieveRoleData();
            }

            await this.getAllPermissions();

            this.loadingSpinner = false;
        },
        methods: {
            /**
             * Html/Text Rendering
             */
            getTitle() {
                return this.isUpdateMode() ? "UserRole.UpdatePageTitle" : "UserRole.CreatePageTitle";
            },
            getSuccessMessage() {
                return this.isUpdateMode() ? this.$parent.$t("UserRole.RoleUpdated") : this.$parent.$t("UserRole.RoleCreated");
            },
            /**
             * Initializing Component Methods
             */
            async getAllPermissions() {
                api.createEntity({ "name": "api/permission" });
                return api.endpoints.get()
                    .then(({data}) => {
                        this.validResources = data;
                    })
                    .catch(() => {
                        this.$router.replace('/404');
                    });
            },
            /**
             * Form Model Methods
             */
            isCreateMode() {
                return this.$route.path.search("create-role")  !== -1;
            },
            isUpdateMode() {
                return this.$route.path.search("update-role")  !== -1;
            },
            getRoleId() {
                if (this.isUpdateMode()) {
                    return this.$route.params.role_id;
                }
                return false;
            },
            retrieveRoleData() {
                api.createEntity({ "name": "api/role/" + this.getRoleId() + "?with[]=permissions" });
                return api.endpoints.get().then(({data}) => {
                    this.roleModel.role_name = data.name;
                    this.roleModel.role_permissions = data.permissions ? data.permissions.map(item => item.id) : [];
                }).catch(() => {
                    this.$router.replace('/404');
                });
            },
            /**
             * Dealing with user interaction Methods
             */
            updateModel(data) {
                switch(data.name)
                {
                    case 'role_name':
                        this.roleModel.role_name = data.value;
                        break;
                    case 'role_permissions':
                        if(data.checked == true) {
                            this.roleModel.role_permissions.push(data.value);
                        } else {
                            this.roleModel.role_permissions = this.roleModel.role_permissions.filter(item => item !== data.value);
                        }
                        break;
                    default:
                        break;
                }
            },
            clearError: function (data) {
                let key = data.name.replace("role_", "");
                if (this.errors[key]) {
                    this.errors[key] = '';
                }
            },
            checkAll(entityPermissions) {
                entityPermissions = entityPermissions.map((item)=>item.id);
                for(var permissionId of entityPermissions) {
                    if (this.roleModel.role_permissions.includes(permissionId) === false) {
                        this.roleModel.role_permissions.push(permissionId);
                    }
                }
                this.$forceUpdate();
            },
            unCheckAll(entityPermissions) {
                entityPermissions = entityPermissions.map((item)=>item.id);
                for(var permissionId of entityPermissions) {
                    if (this.roleModel.role_permissions.includes(permissionId)) {
                        this.roleModel.role_permissions = this.roleModel.role_permissions.filter((item) => item !== permissionId);
                    }
                }
                this.$forceUpdate();
            },
            /**
             * Component Actions Methods
             */
            onSubmit() {
                this.isLoading = true;

                let path = this.isUpdateMode()  ? "api/role/" + this.getRoleId() : "api/role";

                let requestData = {
                    name: this.roleModel.role_name,
                    permissions: this.roleModel.role_permissions
                };

                if (this.isUpdateMode()) {
                    requestData["_method"] = "PATCH";
                }

                api.createEntity({ "name": path });
                api.endpoints.create(requestData).then(this.success).catch(this.failure);
            },
            onCancel() {
                this.$router.replace('/role/list');
            },
            success() {
                this.isLoading = false;
                this.$swal({
                    toast: true,
                    position: 'top-end',
                    type: 'success',
                    title: this.getSuccessMessage(),
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    this.$acl.updateCurrentUser();
                    this.$router.replace('/role/list');
                });
            },
            failure(error) {
                this.isLoading = false;
                let errors = error.response.data.errors;
                let err, errs = [];
                for (err in errors) {
                    errs[err] = errors[err][0];
                }
                this.errors = errs;
                this.$forceUpdate();
            },
            scrollToClass(className) {
                let el = this.$el.querySelector(className);
                let rect = el.getBoundingClientRect();
                window.scrollTo(rect.left, rect.top);
            },
        },
        components: {
            componentContainer,
            inputText,
            loadingSpinner,
            loadingButton,
            inputCheckbox
        }
    };
</script>

<!-- styles -->
<style lang="scss" scoped>
    .white-section_details {
        padding: 25px 0 35px;
    }
    .permissions-table {
        margin-top: 30px;
        font-size: 16px;
    }
    .table-header {
        background-color: #0082c9;
        color: white;
        font-size: 17px;
        font-weight: normal !important;
    }
    .select-input {
        display: inline-block;
        margin-left: 12px;
    }
    .cancel-button {
        color: #0072BC !important;
        background-color: white !important;
    }
</style>




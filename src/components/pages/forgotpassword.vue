<template>
    <div class="container-fluid ">
        <div class="row">
            <div class="col-sm-12 img_backgrond">
                <h2 class="text-center">
                    <img class="un-logo" src="~img/UN-LOGO/un-logo-hor.png" alt="Logo">
                </h2>
            </div>
        </div>
        <div class="row">
            <div class="offset-xl-4 col-xl-4 col-lg-4 offset-lg-4 offset-md-3 col-md-5 col-sm-7 offset-sm-3 col-xs-10 offset-xs-1 login-content">

                <div class="row" v-if="failure">
                    <div class="text-center">
                        <b-alert show variant="danger">The email you have entered doesn't exist!</b-alert>
                    </div>
                </div>

                <div class="row" v-if="success">
                    <div class="text-center">
                        <b-alert show variant="success">An email with verification url has been sent to your
                            email!
                        </b-alert>
                    </div>
                </div>

                <div class="row" v-if="!success && !failure">
                    <div class="col-sm-12">
                        <div class="text-center">
                            <h2 class="login-form-title">welcome!</h2>
                        </div>
                    </div>
                </div>

                <vue-form v-if="!success && !failure" :state="formstate" @submit.prevent="onSubmit">
                    <div class="col-lg-12">
                        <p class="user-message ">
                            Please enter the email you are registered with. An email message will be sent to the email
                            address with further instructions.</p>
                        <div class="form-group">
                            <validate tag="div">
                                <input v-model="model.email" name="email" type="email" required
                                       :placeholder="userIcon +'   ' + 'Email or Username'"
                                       style="font-family:Helvetica Neue, FontAwesome" class="form-control"/>
                                <field-messages name="email" show="$invalid && $submitted" class="text-danger">
                                    <div slot="required">Email is a required field</div>
                                    <div slot="email">Email is not valid</div>
                                </field-messages>
                            </validate>
                        </div>
                    </div>
                    <div class="col-12 mt-4">
                        <div class="form-group">
                            <loading-button buttonName="Send Confirmation Mail"
                                            classNames="btn btn-success"
                                            :isLoading="loading"></loading-button>
                        </div>
                    </div>
                </vue-form>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import VueForm from "vue-form";
    import options from "src/validations/validations.js";
    import API from "../APIs/AbstractAPIs";
    import LoadingButton from "../spinner/loading-button";

    Vue.use(VueForm, options);
    export default {
        name: "forgetpassword",
        components: {LoadingButton},
        data() {
            return {
                loading: false,
                userIcon: '\uf003',
                formstate: {},
                success: false,
                failure: false,
                model: {
                    email: ""
                }
            }
        },
        methods: {
            onSubmit() {
                if (this.formstate.$invalid) {
                    return;
                } else {
                    this.loading = true;
                    let ForgetApi = new API();
                    ForgetApi.createEntity({name: 'api/forgot-password'});
                    ForgetApi.endpoints
                        .forgetpassword({
                            email: this.model.email
                        })
                        .then(this.forgetSuccess)
                        .catch(this.forgetFailure)
                }
            },
            forgetSuccess: function ({data}) {
                this.loading = false;
                this.success = true;
                this.$forceUpdate();
            },
            forgetFailure: function (errors) {
                this.loading = false;
                this.failure = true;
                this.$forceUpdate();
            }
        },
        mounted: function () {

        },
        destroyed: function () {

        }
    }
</script>
<style scoped type="text/css" lang="scss">
    .login-content {
        padding: 20px 70px;
        background-color: #fff;
        margin-top: 7%;
        margin-bottom: 7%;
        box-shadow: 0 0 8px rgba(24, 24, 24, 0.459);
        background-size: 100% 100%;
        border-radius: 4px;
        margin-top: -80px;
        .form-control {
            box-shadow: none;
            &::placeholder {
                color: #c1c1c1;
            }
        }
        .login-form-title {
            margin-top: 10px;
            color: #0683c8;
            font-weight: bold;
            text-transform: capitalize;
        }
        .input-label {
            font-weight: bold;
        }
        .btn-success {
            background-color: #0683c8;
            width: 100%;
            padding: 15px 0;
            border-radius: 40px;
        }
        .forget-password {
            color: #6b6b6b;
            font-weight: bold;
            font-size: 14px;
        }
    }

    .img_backgrond {
        background-color: #0683c8;
        background-size: 100% 55%;
        background-repeat: no-repeat;
        width: 100%;
        padding: 120px 15px;
        .un-logo {
            width: 250px;
        }
    }

    label {
        font-size: 14px !important;
    }

    ::-webkit-input-placeholder {
        font-size: 14px;
    }
</style>

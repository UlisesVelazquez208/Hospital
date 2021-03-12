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
                <div class="row">
                    <div class="col-sm-12">
                        <div class="text-center">
                            <h2 class="login-form-title">welcome!</h2>
                        </div>
                    </div>
                </div>
                <vue-form :state="formstate" @submit.prevent="onSubmit">
                    <div class="col-md-12">
                        <p class="user-message"> * The Password is case sensitive.</p>
                        <div class="form-group">
                            <validate tag="div">
                                <input v-model="model.email" name="email" type="email" required class="form-control"
                                       :placeholder="userIcon +'   ' + 'Email or Username'"
                                       style="font-family:Helvetica Neue, FontAwesome"/>

                                <field-messages name="email" show="$invalid && $submitted" class="text-danger">
                                    <div slot="required">Email is a required field</div>
                                    <div slot="email">Email is not valid</div>
                                </field-messages>
                            </validate>
                        </div>
                        <div class="form-group">
                            <validate tag="div">
                                <input v-model="model.password" name="password" type="password" required
                                       :placeholder="passIcon +'   ' + 'Password'"
                                       style="font-family:Helvetica Neue, FontAwesome" class="form-control" minlength="8"
                                       maxlength="10"/>
                                <field-messages name="password" show="$invalid && $submitted" class="text-danger">
                                    <div slot="required">Password is required</div>
                                    <div slot="minlength">Password should be atleast 8 characters long</div>
                                    <div slot="maxlength">Password should be atmost 8 characters long</div>
                                </field-messages>
                            </validate>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group">
                            <validate tag="div">
                                <input v-model="model.password_confirmation" name="repeatpassword" type="password"
                                       required
                                       placeholder="Confirm Password" class="form-control"
                                       :sameas="model.password">
                                <field-messages name="repeatpassword" show="$invalid && $submitted"
                                                class="text-danger">
                                    <div slot="required">Password confirmation is required</div>
                                    <div slot="sameas">Password and confirm password don't match</div>
                                </field-messages>
                            </validate>
                        </div>
                    </div>
                    <div class="col-12 mt-4">
                        <div class="form-group">
                            <loading-button buttonName="Reset Password"
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
    import env from "../../Env"
    import LoadingButton from "../spinner/loading-button";
    import Acl from "../Acl/Acl" ;

    let LoginApi = new API();
    LoginApi.createEntity({name: 'oauth/token'});

    Vue.use(VueForm, options);
    export default {
        name: "resetpassword",
        components: {LoadingButton},
        data() {
            return {
                loading: false,
                userIcon: '\uf003',
                passIcon:'\uf023',
                formstate: {},
                model: {
                    password: "",
                    password_confirmation: "",
                    email: "",
                    resetToken: ""
                }
            }
        },
        methods: {
            getResetToken: function () {
                this.model.resetToken = this.$route.params.token;
            },
            onSubmit: function () {
                if (this.formstate.$invalid) {
                    return;
                } else {
                    this.loading = true;
                    this.getResetToken();
                    let ResetPasswordApi = new API();
                    ResetPasswordApi.createEntity({name: '/api/reset-password'});
                    console.log(this.model.resetToken);
                    ResetPasswordApi.endpoints.resetpassword({
                        email: this.model.email,
                        password: this.model.password,
                        password_confirmation: this.model.password_confirmation,
                        token: this.model.resetToken
                    }).then(

                        LoginApi.endpoints.auth({
                            username: this.model.email, password: this.model.password,
                            client_secret: env.client_secret, grant_type: env.grant_type, client_id: env.client_id
                        }).then((data) => this.loginSuccessful(data))

                    )

                }
            },
            loginSuccessful(req) {

                if (!req.data.access_token) {
                    this.loginFailed();
                    return
                }

                let currentUserAPI = new API();
                currentUserAPI.createEntity({name: 'api/me'});
                currentUserAPI.endpoints.get({
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': req.data.token_type + ' ' + req.data.access_token
                    }
                }).then((response)=> {

                    if (response.data.status === "INACTIVE") {
                        throw 'your account is inactive, contact your admin';
                    }

                    localStorage.setItem('token_type', req.data.token_type);
                    localStorage.setItem('access_token', req.data.access_token);
                    localStorage.setItem('refresh_token', req.data.refresh_token);

                    this.$store.commit('addToken', req.data);

                    this.$apis.refreshAuthHeader();

                    let user = {
                        name: "",
                        picture: require("img/authors/default_user.png"),
                        job: "",
                        token_type: req.data.token_type,
                        access_token: req.data.access_token,
                        refresh_token: req.data.refresh_token,
                    };

                    user.id = response.data.id;
                    user.name = response.data.first_name + " " + response.data.last_name;
                    user.permissions = response.data.permissions
                    user.picture = response.data.avatar ? response.data.avatar : require("img/authors/default_user.png");

                    localStorage.setItem('user', JSON.stringify(user));
                    this.$store.commit('user', user);

                    this.error = false;

                    let dashboadRoute = Acl.currentUserCan('TOP_VIEWED', 'FAQ') ? 'home' : (Acl.currentUserCan('VISIBILITY_PERCENTAGE', 'FAQ') ? 'dashboard' : 'me' );

                    this.$router.replace(this.$route.query.redirect || dashboadRoute);

                }).catch((e) => {
                    console.log(e);
                    this.loginFailed('Your account is inactive, Contact your admin');
                })

            },
            loginFailed() {
                this.loading = false;
                this.error = 'Login failed!';
                localStorage.removeItem('access_token');
            }
        },
        mounted: function () {

        },
        destroyed: function () {

        },
        created: function () {


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
        .form-control{
            box-shadow: none;
            &::placeholder{
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

    .user-message {
        padding: 15px 0;
        font-size: 14px;
        color: #777;
    }
</style>

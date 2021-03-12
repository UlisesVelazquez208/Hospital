<template>
    <div class="container-fluid ">
        <div class="row">
            <div class="col-sm-12 img_backgrond">
                <h2 class="text-center title">
                    KNOWLEDGEBASE<br/>
                    <small>For Refugees</small>
                </h2>
            </div>
        </div>
        <div class="row">
            <div class="login-content">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="text-center">
                            <h2 class="login-form-title">Welcome!</h2>
                        </div>
                    </div>
                </div>
                <vue-form :state="formstate" @submit.prevent="onSubmit">
                    <div class="row">
                        <div class="col-sm-12 mt-3 ">
                            <div class="form-group">
                                <validate tag="div">
                                    <label class="input-label" for="email">User Name</label>
                                    <input v-model="model.email" name="email" id="email" type="email" required autofocus @input="invalidCred=''"
                                           class="form-control"  :placeholder="userIcon +'   ' + 'Email or Username'"
                                           style="font-family:Helvetica Neue, FontAwesome"/>
                                    <field-messages name="email" show="$invalid && $submitted" class="text-danger">
                                        <div slot="required" class="login-error-message">Email is a required field</div>
                                        <div slot="email" class="login-error-message">Email is not valid</div>
                                    </field-messages>
                                </validate>
                            </div>
                        </div>
                        <div class="col-sm-12">
                            <div class="form-group">
                                <validate tag="div">
                                    <label class="input-label" for="password"> Password</label>
                                    <input v-model="model.password" name="password" id="password" type="password" @input="invalidCred=''"
                                           required :placeholder="passIcon +'   ' + 'Password'"
                                           style="font-family:Helvetica Neue, FontAwesome"
                                           class="form-control"
                                    />
                                </validate>
                            </div>
                        </div>
                        <div class="col-lg-12 col-md-12 text-center btn-container margin-top-15">
                            <div class="form-group">
                                <div v-if="invalidCred" class="text-danger login-error-message">{{invalidCred}}</div>
                                <loading-button buttonName="Common.Login"
                                                classNames="btn btn-success"
                                                :isLoading="loading"></loading-button>
                            </div>
                        </div>
                        <br>
                        <div class="col-sm-12 text-center">
                            <div class="form-group">
                                <p>
                                    <router-link tag="a" to="/forgotpassword" class="forget-password">
                                        Forgot Your Username or Password ?
                                    </router-link>
                                </p>
                                <!-- <router-link tag="a" to="/register" class="btn btn-primary btn-block ">New User? Sign Up Now
                                </router-link> -->
                            </div>
                        </div>
                    </div>
                </vue-form>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from "vue";
    import VueForm from "vue-form";
    import options from "../../validations/validations.js";
    import env from  '../../Env';
    import API from "../APIs/AbstractAPIs" ;
    import Acl from "../Acl/Acl" ;
    import loadingButton from "../spinner/loading-button";
    import languageService from "./../../helpers/languageService";
    import i18n from "./../../i18n";
    import {EventBus} from "./../../eventbus/event-bus.js";

    let langService = new languageService();

    Vue.use(VueForm, options);

    export default {
        name: "login2",
        data() {
            return {
                userIcon: '\uf003',
                passIcon:'\uf023',
                formstate: {},
                model: {
                    email: "",
                    password: ""
                },
                invalidCred: "",
                loading: false,
                languages: {}
            };
        },
        components: {
            loadingButton
        },
        methods: {
            onSubmit() {
                if (this.formstate.$invalid) {
                    return;
                } else {
                    this.loading = true;
                    let LoginApi = new API();
                    LoginApi.createEntity({name: 'oauth/token'});
                    LoginApi.endpoints
                        .auth({
                            username: this.model.email, password: this.model.password,
                            client_secret: env.client_secret, grant_type: env.grant_type, client_id: env.client_id
                        })
                        .then((data) => this.loginSuccessful(data))
                        .catch((error) => this.loginFailed("Your username or password isn\'t correct"));
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

                    langService.getLanguages().then(function(data) {
                        var languagesList = data.map((item) =>{
                            return {id:item.id, name:item.name, acronym:item.acronym, text_direction:item.text_direction, is_default:item.is_default};
                        });

                        EventBus.$emit('set-languages', languagesList);
                        localStorage.setItem('languages', JSON.stringify(languagesList));

                        data.filter((item)=>{
                            if(item.id == user.language_id) {
                                localStorage.setItem('lang_locale', item.acronym);
                                localStorage.setItem('locale', item.acronym);
                                i18n.locale = item.acronym;
                                document.querySelector('html').setAttribute('dir', item.text_direction);
                            }
                        });  
                    });

                    this.$store.commit('addToken', req.data);

                    this.$apis.refreshAuthHeader();

                    let user = {
                        name: "",
                        picture: require("img/authors/default_user.png"),
                        job: "",
                        token_type: req.data.token_type,
                        access_token: req.data.access_token,
                        refresh_token: req.data.refresh_token,
                        language_id:req.data.language_id
                    };

                    user.id = response.data.id;
                    user.name = response.data.first_name + " " + response.data.last_name;
                    user.permissions = response.data.permissions;
                    user.picture = response.data.avatar ? response.data.avatar : require("img/authors/default_user.png");
                    user.language_id = response.data.language_id;
                    if(response.data.countries) {
                        user.countries = response.data.countries;
                    }

                    localStorage.setItem('user', JSON.stringify(user));
                    this.$store.commit('user', user);

                    this.error = false;

                    let dashboadRoute = Acl.currentUserCan('TOP_VIEWED', 'FAQ') ? 'home' : (Acl.currentUserCan('VISIBILITY_PERCENTAGE', 'FAQ') ? 'home' : 'me' );

                    this.$router.replace(this.$route.query.redirect || dashboadRoute);

                }).catch((e) => {
                    console.log(e);
                    this.loginFailed('Your account is inactive, Contact your admin');
                })

            },
            loginFailed(errorMessage) {
                this.loading = false;
                this.invalidCred = errorMessage;
                localStorage.removeItem('access_token');
            }
        },
        mounted: function () {
        },
        destroyed: function () {
        }
    };
</script>
<style scoped type="text/css" lang="scss">

    .login-content {
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        padding: 20px 120px;
        background-color: #fff;

        margin-top: -80px;
        margin-bottom: 7%;
        max-width: 530px;

        box-shadow: 0 0 5px rgba(24, 24, 24, 0.4);
        background-size: 100% 100%;
        border-radius: 4px;

        .login-form-title {
            margin-top: 10px;
            color: #0683c8;
            font-weight: bold;
            text-transform: capitalize;
            font-weight: bold;
        }
        .input-label {
            color: #4a4a4a;
        }
        .btn-success {
            background-color: #0683c8;
            width: 100%;
            padding: 14px 0;
            border-radius: 40px;
            font-size:16px;
            border: 0;
        }
        .forget-password {
            color: #4a4a4a;
            font-size: 14px;
        }
        .form-control{
            box-shadow:  none;
            &::placeholder{
                color: #c1c1c1;
            }
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
    .margin-top-15{
        margin-top: 15px;
    }
    label {
        font-size: 14px !important;
        margin-bottom: 3px;
        color:#6b6b6b
    }

    ::-webkit-input-placeholder {
        font-size: 14px;
    }
    .login-error-message {
        margin-bottom: 5px;
        font-size: 13px;
        margin-top:5px;
    }
    h2.title {
        color: #ffff;
        font-weight: bold;
    }
    h2.title small {
        letter-spacing: 5px;
    }

</style>

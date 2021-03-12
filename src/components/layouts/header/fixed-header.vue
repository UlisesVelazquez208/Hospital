<template>
    <header class="header fixed-top">
        <nav>
            <div class="float-left">
                <a href="javascript:void(0)" class="sidebar-toggle" @click="toggle_menu">
                    <i class="fa fa-bars"></i>
                </a>
            </div>

            <router-link to="/dashboard" class="logo">
                <!-- <img src="~img/UN-LOGO/un-logo-hor.png" alt="logo"/> -->
                <h3 class="title text-center">KNOWLEDGEBASE<br/>
                    <small>For Refugees</small>
                </h3>
            </router-link>

            <div class="navbar-right">

                <!--drop downs-->
                <div>
                    <b-dropdown class="user user-menu bell_bg user_btn" right link>
                        <span slot="text">
                            <img :src="this.$store.state.user.picture" class="rounded-circle" alt="User Image">
                            <!-- User name-->
                            <p class="user_name_max">{{ $t('Welcome')}} {{this.$store.state.user.name}}</p>
                        </span>
                        <b-dropdown-item exact class="dropdown_content">
                            <router-link to="/user_profile" exact class="drpodowtext">
                                <i class="fa fa-user-o"></i> Profile
                            </router-link>
                        </b-dropdown-item>
                        <b-dropdown-item v-if="$acl.currentUserCan('ADD_TO_MY_LIST', 'FAQ')" exact class="dropdown_content">
                            <router-link to="/my-list/list" exact class="drpodowtext">
                                <i class="fa fa-list-ol"></i> My Lists
                            </router-link>
                        </b-dropdown-item>
                        <b-dropdown-item  v-for="(langItem, index) in theLanguages" :key="'langItem-'+index" exact class="dropdown_content">
                            <a @click="toggleLocale(langItem.acronym)" exact class="drpodowtext">
                                <i class="fa fa-list-ol"></i> {{ langItem.name}}
                            </a>
                        </b-dropdown-item>
                        <!-- <b-dropdown-item  exact class="dropdown_content">
                            <a @click="toggleLocale('en')" exact class="drpodowtext">
                                <i class="fa fa-list-ol"></i> English
                            </a>
                        </b-dropdown-item>
                        <b-dropdown-item  exact class="dropdown_content">
                            <a @click="toggleLocale('ar')" exact class="drpodowtext">
                                <i class="fa fa-list-ol"></i> عربى
                            </a>
                        </b-dropdown-item> -->
                        <b-dropdown-item exact class="dropdown_content">
                            <router-link to="#" exact class="drpodowtext" v-on:click.native='logoutapi'>
                                <i class="fa fa-sign-out"></i> Logout
                            </router-link>
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
            </div>
        </nav>
    </header>
</template>
<script>
    import screenfull from "screenfull";
    import API from "../../APIs/AbstractAPIs";
    import i18n from "./../../../i18n";
    import {EventBus} from "./../../../eventbus/event-bus.js";

    export default {
        name: "vueadmin_header",
        data(){
            return {
                theLanguages:[]
            }
        },
        methods: {
            toggle_menu() {
                this.$store.commit("left_menu", "toggle");
            },
            fullscreen() {
                if (screenfull.enabled) {
                    screenfull.toggle();
                }
            },
            clearToken() {
                localStorage.removeItem('token_type');
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                localStorage.removeItem('categories');
                localStorage.removeItem('nationalities');
                this.$store.commit('logout');
                this.$router.push({'path': '/login'});
            },
            logoutapi() {
                let LogoutApi = new API();
                LogoutApi.createEntity({name: 'api/logout'});
                this.clearToken()
                LogoutApi.endpoints.logout();
            },
            toggleLocale(locale) {
                localStorage.setItem('locale', locale);
                i18n.locale = locale;

                let selectedLanguage = this.theLanguages.filter((item) => {
                    if(item.acronym == locale) {
                        return item;
                    }
                });

                document.querySelector('html').setAttribute('dir', selectedLanguage[0].text_direction);

                EventBus.$emit('locale', locale);
            },
            setLanguage(event) {
                this.theLanguages = event;
            }
        },
        mounted() {
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
        },
        created() {
            EventBus.$on('set-languages', this.setLanguage);
            this.theLanguages = JSON.parse(localStorage.getItem('languages'));
        }
    }
</script>
<style lang="scss" scoped>
    @import "../css/customvariables";

    .header {
        z-index: 1030;

        nav {
            margin-bottom: 0;
            height: 80px;
            background: $header_color;
            background-size: 100% 100%;
            box-shadow: 0px 1px 2px 1px rgba(64, 64, 64, 0.6509803921568628);

        }
        .navbar-right {
            float: right;
            margin-right: 15px;
        }
        .logo {
            display: block;
            float: left;
            height: 80px;
            line-height: 71px;
            padding: 3px 10px;
            text-align: center;
            width: 170px;
            background: $header_color;
            img {
                width: 125px;
            }
        }
        .navbar-right {
            .dropdown-item {
                padding: 0;
                width: 100%;
                outline: none;
            }
            div.dropdown {
                > a {
                    color: $zoom_color;
                }
                .dropdown-menu > button {
                    padding: 10px 15px;
                }
                &.notifications-menu {
                    height: 50px;
                    .noti-icon {
                        font-size: 18px;
                    }
                }
                > a > i {
                    font-size: 23px;
                }
                > a {
                    display: block;
                    padding: 12px;
                }
                &:hover > a {
                    background-color: #ededed;
                    color: #fff;
                }
                > a.padding-user {
                    padding-top: 8px;
                    padding-bottom: 6px;
                }
            }
        }
        nav .sidebar-toggle {
            float: left;
            color: $toggle_color;
            font-size: 19px;
            padding-top: 25px;
        }
    }

    .b-dropdown.dropdown.show {
        .user_name_max {
            color: #000;

        }
    }

    .b-dropdown.dropdown {
        .user_name_max {
            color: #fff;

        }
    }

    .user.user-menu {
        &:hover {
            .user_name_max {
                color: #000;
            }
        }
    }

    .user_name_max {
        display: inline-block;
        max-width: 180px;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
        margin: 0 0 -10px;
        font-size: 18px;

    }

    .noti_msg {
        font-size: 16px;
        padding: 10px;
        border: 1px solid #4f90c1;
        border-radius: 50px;
        margin-top: 10px;
    }

    .user.user-menu > button img {
        width: 62px;
        height: 62px;
    }

    /**** END HEADER RIGHT SIDE DROPDOWNS ****/

    @media screen and (max-width: 767px) {
        .dropdown.open .dropdown-menu {
            position: absolute;
        }
        .navbar-right > li > a {
            padding: 10px 12px;
        }
    }

    /* Fix menu positions on xs screens to appear correctly and fully */

    @media (max-width: 560px) {
        body .header .logo,
        body .header nav {
            width: 100%;
        }
        body .header nav .sidebar-toggle {
            padding-left: 15px;
        }
        nav {
            height: 100px !important;
        }
    }

    .notifications_badge_top {
        margin-top: -28px;
        margin-left: 10px;
        position: absolute;
        span {
            top: 1px;
            left: 2px;
            border-radius: 50%;
        }
    }

    .notifications-menu .dropdown-item {
        width: 100%;
        display: block;
    }

    .dropdown-footer {
        padding: 10px !important;
    }
</style>
<style type="text/css" lang="scss">
    @import "../css/customvariables";

    .wrapper {
        margin-top: 80px;
        @media screen and (max-width: 560px) {
            margin-top: 100px;
        }
    }

    .sidebar-toggle {
        margin-left: 10px;
        margin-right: 0;
    }

    html[dir='rtl'] .sidebar-toggle {
        margin-left: 0;
        margin-right: 10px;
    }

    .bell_bg {
        button.btn-secondary {
            background-color: transparent;
            border: none;
            border-radius: 0;
            box-shadow: none !important;
            &:hover {
                background-color: #ededed !important;
            }
            &:active {
                color: $toggle_color !important;
            }
        }
        //.btn-secondary:active
        &.show button {
            background-color: $bell-active !important;
        }
        &.user_btn .dropdown-toggle {
            padding:9px 9px;
        }
    }

    .tabs_cont,
    .event_date {
        background-color: #fff !important;
    }
    h3.title {
        color: #fff;
        font-size:17px;
        margin-top: 14px;
    }
</style>

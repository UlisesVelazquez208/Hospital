<template>
    <div v-bar> <!-- el1 -->
        <div> <!-- el2 -->
            <aside class="left-aside sidebar-offcanvas">
                <!-- sidebar: style can be found in sidebar-->
                <section class="sidebar">
                    <div
                            id="menu"
                            role="navigation"
                    >
                        <vmenu>

                            <li v-if="!this.$store.state.categories.length" class="divider mt-3 ">
                                <loading-spinner :is-loading="!this.$store.state.categories.length"></loading-spinner>
                            </li>

                            <vmenu-item link="/home" v-if="this.$acl.currentUserCan('RECENT', 'ServiceCategory') || this.$acl.currentUserCan('TRENDING', 'FAQ') || this.$acl.currentUserCan('TRENDING', 'FAQ')" icon="fa fa-home">{{ $t('Home') }}</vmenu-item>

                            <template v-else v-for="item in this.$store.state.categories" v-if="checkPermissions(item)">

                                    <vsub-menu
                                            v-if="item.child"
                                            :title="menuTitle(item.name)"
                                            :icon="item.icon"
                                    >
                                        <vmenu-item
                                                v-for="child in item.child"
                                                :link="child.link"
                                                :icon="child.icon"
                                                :key="child.name + '_' +Math.random()"
                                                v-if="checkPermissions(child)"
                                        >{{menuTitle(child.name)}}
                                        </vmenu-item>
                                    </vsub-menu>
                                    
                                    <vmenu-item
                                            v-if="item.link"
                                            :link="item.link"
                                            :icon="item.icon"
                                            :name="item.name"
                                            :cssClass="item.css"
                                    >{{ menuTitle(item.name)}}
                                    </vmenu-item>

                            </template>
                            <vmenu-item link="/dashboard" v-if="this.$acl.currentUserCan('TRENDING', 'HashTag')" icon="fa fa-pie-chart">{{ $t('Menu.Dashboard') }}</vmenu-item>
                            <vmenu-item external_target="_blank" v-if="this.$acl.currentUserCan('GOOGLE_ANALYTICS', 'User')" link="https://analytics.google.com/analytics/web/" icon="fa fa-line-chart">
                                    {{ $t('Menu.GoogleAnalytics') }}
                            </vmenu-item>

                        </vmenu>

                        <!-- / .navigation -->
                    </div>
                    <!-- menu -->
                </section>
                <!-- /.sidebar -->
            </aside>
        </div>
        <!-- dragger will be automatically added here -->
    </div>
    <!-- Left side column. contains the logo and sidebar -->

</template>
<script>
    import {
        vmenu,
        vmenuItem,
        vsubMenu
    } from "./menu";
    import Vue from "vue";
    import Vuebar from 'vuebar';
    import LoadingSpinner from "../../../spinner/loading-spinner";
    import {EventBus} from './../../../../eventbus/event-bus.js';
    import i18n from "./../../../../i18n/index.js";

    Vue.use(Vuebar);

    export default {
        name: "left-side",
        components: {
            LoadingSpinner,
            vmenu,
            vsubMenu,
            vmenuItem,
        },
        data:function() {
            return {
                theLanguage:'',
                localeMessages:{}
            };
        },
        created: function() {
            this.theLanguage = localStorage.getItem('locale');
            this.localeMessages = JSON.parse(localStorage.getItem(this.theLanguage));

            EventBus.$on('locale', this.updateLocaleMessages)
        },
        methods: {
            checkPermissions(item) {
                return this.$acl.canViewMenu(item);
            },
            menuTitle:function(text) {
                if(this.localeMessages !== null && typeof this.localeMessages[text] !== 'undefined') {
                    return this.localeMessages[text];
                }
                var theText = this.$t(text);
                return theText;
            },
            updateLocaleMessages:function(locale) {
                this.localeMessages = JSON.parse(localStorage.getItem(locale));
            }
        }
    };
</script>


<style lang="scss" scoped>
    @import "../../css/customvariables";

    .left-aside {
        width: $left_menu_width;
        background: $leftmenu_color;
        background-repeat: repeat-y;
    }

    .navigation {
        padding: 0;
    }

    .divider {
        margin-top: 10px;
        list-style-type: none;
        border-bottom: 1px solid #555252;
        padding-bottom: 6px;
    }

    .divider span {
        font-size: 15px;
        font-weight: 700;
        color: $divider-leftheader;
        margin: 20px 20px -15px 20px;
    }

    .sidebar {
        display: block;
        font-size: 14px;
        letter-spacing: 1px;
    }

    .content {
        display: block;
        width: auto;
        overflow-x: hidden;
        padding: 0 15px;
    }

    .badge-success {
        background-color: #22d69d;
    }

    .badge {
        padding: 0.6em 0.7em;
        border-radius: 0.75rem;
    }

    .nav_profile {
        border-bottom: 1px solid #eee;
    }

    .vb > .vb-dragger {
        z-index: 5;
        width: 12px;
        right: 0;
    }

    .vb > .vb-dragger > .vb-dragger-styler {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: rotate3d(0, 0, 0, 0);
        transform: rotate3d(0, 0, 0, 0);
        -webkit-transition: background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
        transition: background-color 100ms ease-out,
        margin 100ms ease-out,
        height 100ms ease-out;
        background-color: rgba(48, 121, 244, .1);
        margin: 5px 5px 5px 0;
        border-radius: 20px;
        height: calc(100% - 10px);
        display: block;
    }

    .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244, .3);
    }

    .vb > .vb-dragger:hover > .vb-dragger-styler {
        background-color: rgba(48, 121, 244, .5);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244, .5);
        margin: 0px;
        height: 100%;
    }

    .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
        background-color: rgba(48, 121, 244, .5);
    }
</style>

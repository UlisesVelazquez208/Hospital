<template>
    <div class="submenu collapse-item" :class="{ 'active': isActived }">
        <div class="submenu-header touchable" role="tab" :aria-expanded="selected ? 'true' : 'false'" @click="toggle">

            <i class="leftmenu_icon" :class="icon"></i>

            <span class="submenu-header-title">{{ title }}</span>
            <!-- <span class="submenu_icon float-right"><i class="fa fa-angle-right"></i></span> -->
        </div>
        <transition name="collapsed-fade" :css="false" @before-appear="before" @appear="enter" @appear-cancel="cancel" @before-enter="before" @enter="enter" @enter-cancel="cancel" @leave="leave" @leave-cancel="cancel">
            <div class="submenu-content" v-show="isActived">
                <div class="submenu-content-box" ref="box">
                    <slot></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import anime from 'animejs'
export default {
    props: {
        selected: Boolean,
        icon: String,
        title: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            isActived: this.selected
        }
    },
    computed: {
        index() {
            return this.$parent.$collapseItems.indexOf(this)
        }
    },
    created() {
        this._isCollapseItem = true
    },
    mounted() {
        function activate(self) {
            if (self.$refs.box) {
                self.isActived = self.$refs.box.querySelectorAll("a.active").length >= 1 ? true : false;
            }
        }
        //change when route changes
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == "routeChange" && mutation.payload == "end") {
                setTimeout(() => {
                    activate(this);
                }, 0);
            }
        });
        activate(this);
    },
    methods: {
        toggle() {
            this.$parent.$emit('closeall', this.index);
            this.isActived = !this.isActived;
        },
        cancel() {
            this.anime.pause()
        },
        before(targets) {
            targets.removeAttribute('style')
        },
        enter(targets, done) {
            const height = targets.scrollHeight
            targets.style.height = 0
            targets.style.opacity = 0
            anime({
                targets: targets,
                duration: 377,
                easing: 'easeOutExpo',
                opacity: [0, 1],
                height: height,
                complete() {
                    targets.removeAttribute('style')
                    done()
                }
            });
        },
        leave(targets, complete) {
            anime({
                targets: targets,
                duration: 377,
                easing: 'easeOutExpo',
                opacity: [1, 0],
                height: 0
            });
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../css/customvariables";
.submenu-header-title {
    text-overflow: ellipsis;
    overflow: hidden;
    // white-space: nowrap;
    /*font-weight: bold;*/

}

.submenu.collapse-item .submenu-header::after {
    content:'\F105';
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    right: 1rem;
    margin-top: 5px;
    font-weight: bold;
}
.submenu.collapse-item.active .submenu-header::after {
    content:'\F107';
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    right: 1rem;
    margin-top: 5px;
    font-weight: bold;
}
.collapse-item {
    .submenu-header {
        /*font-weight: bold;*/
        cursor: pointer;
        color: $menu_color;
        padding: 17px 17px 11px 25px;
        display: flex;
        align-items: flex-end;

        &:hover {
            color: $menu_hover_color;
        }
        .submenu-header-title {
            vertical-align: text-bottom;

        }
        .active {
            .submenu-header-title {
                /*font-weight: bold;*/

            }
        }
    }

    .submenu-content {
        line-height: 24px;
        background-color: $submenu_color;
        overflow-y: hidden;
        position: relative;
        /*font-weight: bold;*/
    }

    .submenu-content-box{
        margin-top: 5px;
    }

    .submenu-content-box:active{
        color: #000;
    }

    .submenu_icon {
        transition: all 0.3s;
        font-size: 18px;
        margin-top: -2px;
        margin-right: 10px;
        color:$menu_active;
    }

    &.active {
        >.submenu-header {
            background-color:  $menu_active;
            color:$menu_active_color;
            > .submenu_icon {
                transform: rotate(90deg);
            }
            i {
                color: $menu_active_color;
            }
        }
        >.submenu-content {
            background-color: #E1E1E1;
        }
    }
}

.leftmenu_icon {
    margin-right: 20px;
    line-height: 1;
    height: 21px;
    width: 23px;
    text-align: center;
    font-size: 16px;
    color:$menu_color;

}

.leftmenu_icon:hover .submenu-header-title ,.leftmenu_icon:hover .submenu_icon{
    padding-left: 50px;
}

</style>

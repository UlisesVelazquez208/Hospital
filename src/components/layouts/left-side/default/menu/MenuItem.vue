<template>
    <div :class="cssClass" @click="changeMenuItem1" >

        <router-link v-if="link && !external_target" :to="link" exact class="menu-item">
            <i class="leftmenu_icon" :class="icon" ></i>
            <span class="name"><slot></slot></span>
        </router-link>

        <a v-if="link && external_target" :href="link" class="menu-item" :target="external_target">
            <i class="leftmenu_icon" :class="icon" ></i>
            <span class="name"><slot></slot></span>
        </a>


    </div>
</template>
<script>
import {EventBus} from "./../../../../../eventbus/event-bus";

export default {
    props: {
        link:{
            type:String,
            required:true
        },
        icon:{
            type:String,
            required:false
        },
        external_target:{
            type:String,
            required:false
        },
        cssClass:{
            type:String,
            required:false,
            default:'listbrdr'
        }
    },
    // ["link", "icon", 'external_target', 'name', 'cssClass'],
    // mounted(){
    //     this.cssClass='listbrdr';
    // },
    methods: {
        changeMenuItem1: function() {
            EventBus.$emit('change-menu-item');
        },
    }
}
</script>
<style scoped lang="scss">
@import "../../../css/customvariables";
a {
    color: $menu_color;
    position: relative;
    display: flex;
    align-items: flex-end;
    line-height: 21px;
    padding: 17px 17px 11px 25px;
    &:hover {
        color: $menu_hover_color;
    }
    &.active {
        color: $menu_active_color;
        background-color: $menu_active;
        i {
            color: $active_icon;
        }
    }
}

  /*.submenu-content-box .listbrdr::after{
      content: "";
     display: block;
     position: absolute;
     width: 11px;
     left: 25px;
     margin-top: -21px;
     border-top: 2px solid #888585;
     }*/

.submenu-content-box .listbrdr:active{
    color: #000;
}
.submenu-content {
    a {
        padding: 11px 20px 10px 45px;
        position: relative;
    }
    .leftmenu_icon {
        font-size: 14px;
        color:inherit;

    }
}

.name {
    vertical-align: text-bottom;
}

.collapse-item .card-content .card-content-box div a {
    padding-left: 43px;

}

.leftmenu_icon {
    margin-right: 20px;
    line-height: 1;
    height: 21px;
    width: 23px;
    text-align: center;
    font-size: 16px;
    color:$menu_color;
    background-size:16px;
}
</style>

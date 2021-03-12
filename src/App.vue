<template>
    <div id="app">
        <router-view :key="$route.fullPath"></router-view>
    </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from 'bootstrap-vue';
import ToggleButton from 'vue-js-toggle-button';
import Notifications from 'vue-notification';

Vue.use(ToggleButton);
Vue.use(BootstrapVue);
Vue.use(Notifications);

export default {
    name: 'app'
}
</script>
<style lang="scss" src="assets/sass/bootstrap/bootstrap.scss"></style>
<style src="font-awesome/css/font-awesome.css"></style>
<style src="bootstrap-vue/dist/bootstrap-vue.css"></style>

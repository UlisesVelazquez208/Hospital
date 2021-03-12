<template>
    <div>
        <button type="submit"
               :class="classNames"
               :value="buttonName"
               :disabled="isLoading"
                @click="clicked"
        >
            <ClipLoader :loading="isLoading"
                        :color="loaderColor"
                        :size="loaderSize"
            >
            </ClipLoader>
            <span v-if="!isLoading">{{$t(buttonName)}}</span>
        </button>
    </div>
</template>

<script>
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

    export default {
        name: "loading-button",
        props: {
            buttonName: {
                type: String,
                required: true
            },
            classNames: {
                type: String,
                required: false
            },
            isLoading: {
                type: Boolean,
                required: true
            },
            isShifted: {
                type: Boolean,
                required: false,
                default: false
            },
            shiftSize: {
                type: String,
                required: false
            }
        },
        data: function() {
            return {
                loaderColor: "white",
                loaderSize: "20px"
            };
        },
        methods: {
            clicked: function() {
                this.$emit('click');
            }
        },
        components: {
            'ClipLoader': ClipLoader
        },
        computed: {
            loaderStyle: function() {
                return this.isShifted ? "position: relative; left: " + this.shiftSize : "";
            }
        },
    }

</script>
<style scoped type="text/css" lang="scss">

    .btn {
        font-size: 16px;
        padding: 7px 74px;
    }
    .btn-submit {
        padding-left: 85px;
        padding-right: 85px;
        background-color: #0072BC;
        color: #fff;
    }
    .login-content {
        .btn-success {
            background-color: #0683c8;
            width: 100%;
            padding: 15px 0;
            border-radius: 40px;
            font-weight: bold;
            font-size:18px;
            border: none
        }
    }

    .directory-container {
        .btn {
            padding: 7px 70px;
        }
    }

    .faq-submit {
        font-size: 20px;
        padding: 10px 50px;
        background-color: #0072BC;
    }
    .add-to-mylist{
        padding: 7px 30px;
    }
    .btn-success:hover, .btn-success:active {
        color: #fff !important;
        background-color: #0c6aa2 !important;
        border-color: #0b4c73 !important;
        box-shadow: none !important;
        cursor: pointer;
    }
</style>

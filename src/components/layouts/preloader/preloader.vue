<template>
    <div class="lds-ellipsis">
        <section>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </section>
    </div>
</template>
<style scoped lang="scss">
    .lds-ellipsis {
        display: inline-block;
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        background: #ffffffc4;
        top: 0;
        bottom: 0;
    }

    .lds-ellipsis div {
        position: absolute;
        top: 0;
        // margin-top: 20%;
        margin-left: 56%;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: #0682c9;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
        html[dir='rtl'] &{
            margin-left: 44%;
        }
    }

    .lds-ellipsis div:nth-child(1) {
        left: 6px;
        animation: lds-ellipsis1 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(2) {
        left: 6px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(3) {
        left: 26px;
        animation: lds-ellipsis2 0.6s infinite;
    }

    .lds-ellipsis div:nth-child(4) {
        left: 45px;
        animation: lds-ellipsis3 0.6s infinite;
    }

    .lds-ellipsis section {
        position: fixed;
        top: 50%;
        width: 100%;
        height: 11px;
        transform: translateY(-50%);
    }

    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }

    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(19px, 0);
        }
    }

</style>

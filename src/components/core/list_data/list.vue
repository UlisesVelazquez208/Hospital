<template>
    <v-client-table ref="table" :data="tableData" url="#" :columns="columns" :options="options" :dateColumns="dateColumns" :id="id">
        <template v-if="loading" slot="afterBody">
            <div class="overlay-loader"></div>
            <loading-spinner class="clip-loader" v-if="loading" :is-loading="loading"/>
        </template>
    </v-client-table>
</template>


<script>
    import dataList from "./script"

    export default dataList;
</script>
<style type="text/css" lang="scss">
    .VuePagination {
        nav {
            margin: auto;
        }
        .page-item.active .page-link {
            z-index: 2;
            color: #fff;
            background-color: #0c83c6;
            border-color: #0c83c6;
        }
    }

    .btn-primary {
        background-color: #0c83c6;
        border-color: #0c83c6;
    }

    thead {
        border-top: 2px;
        border-top-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .VueTables__filters-row {
        /*color: #fff;*/
        background-color: #fff;
    }

    .VueTables__sortable, .VueTables__table tr:nth-child(1) th {
        color: #fff;
        background-color: #0c83c6;
    }

    .table-striped tbody tr:nth-of-type(odd) {
        background-color: #EBF2F5;
    }
    .table{
        td{
            border:none;
        }
        th{
            border: none;
        }
    }

    table {
        width: 100%;
        position: relative;
    }

    .overlay-loader {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: white;
        opacity: 0.8;
        /*filter: blur(5px);*/
    }

    .clip-loader {
        position: absolute;
        left: 50%;
        right: 50%;
        bottom: 60%;
        top: 40%;
    }
</style>    


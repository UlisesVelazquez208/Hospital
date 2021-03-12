import Vue from "vue";
import componentContainer from "../../pages/componentContainer.vue";
import {ClientTable, Event} from "vue-tables-2";
import LoadingSpinner from "../../../components/spinner/loading-spinner";
import {EventBus} from "../../../eventbus/event-bus";

Vue.use(ClientTable, {}, false);


var dataList = {
    // ===Component name
    name: "data-list",
    // ===Props passed to component
    props: {
        columns: {
            type: Array,
            default: [],
            required: true,
        },
        headings: {
            type: Object,
        },
        title: {
            type: String,
        },
        // btnLabel: {
        //     type: String,
        // },
        // btnRoute: {
        //     type: String,
        // },
        id: {
            type: String,
            default: '',
            required:false
        },
        filters: {
            type: Array,
            default: function () {
                return []
            },
            required: false,
        },
        sorting: {
            type: Array,
            default: function () {
                return []
            },
            required: false,
        },
        listColumns: {
            type: Object,
        },
        dateColumns: {
            type: Array,
            default: function () {
                return []
            },
        },
        templates: {
            type: Object,
            default: {},
            required:false
        },
        tableData:{
            type:Array,
            default:function() {
                return [];
            },
            required:true
        },
        // requestFunction: {
        //     type: Function,
        //     default: function () {
        //         return []
        //     },
        //     required: true
        // },
        // responseAdapter: {
        //     type: Function,
        //     default: function () {
        //         return {}
        //     },
        //     required: true
        // },
        componentName: {
            type: String,
            required: false,
            default: "public"
        }
    },
    // ===Components used by this component
    components: {
        componentContainer,
        LoadingSpinner
    },
    // ===component Data properties
    data() {
        return {
            // tableData: [],
            loading: false,
            options: {
                // dateColumns: this.dateColumns,
                // filterByColumn: true,
                filterable: this.filters,
                sortable:this.sorting,
                templates: this.templates,
                id:this.id,
                // requestFunction: (data) => {
                //     return this.tableData;
                // },
                // responseAdapter: this.responseAdapter,
                listColumns: this.listColumns,
                data:this.tableData,
                headings: this.headings,
                debounce: 300,
                sortIcon: {
                    base: "fa",
                    up: "fa fa-angle-up",
                    down: "fa fa-angle-down",
                    is: "fa-sort"
                },
                texts: {
                    loading: 'Loading...'
                },
                // see the options API
                skin: "table-hover table-striped table table-bordered",
                perPage: 20,
                perPageValues:[20, 50, 100],
                // footerHeadings: true,
                highlightMatches: true,
                pagination: {
                    chunk: 3,
                    //set dropdown to true to get dropdown instead of pagenation
                    dropdown: false
                }
            }
        };
    },
    // ===Code to be executed when Component is mounted
    mounted() {

        Event.$on('vue-tables.loading', () => {
            this.loading = true;
        });

        Event.$on('vue-tables.loaded', () => {
            this.loading = false;
        });

        EventBus.$on('refreshDataTable', (e) => {
            if (this.componentName === "public")
                return;

            if (this.componentName === e.componentName && this.$refs.table) {
                this.$refs.table.refresh();
            }
        })

        EventBus.$on('showDatatableLoading', (e) => this.loading = true)
        EventBus.$on('hideDatatableLoading', (e) => this.loading = false)
    },
    created() {

    },
    // ===Computed properties for the component
    computed: {},
    // ===Component methods
    methods: {
        refreshTable:function() {
            this.$refs.table.refresh();
            // this.$refs.table.reload();
        }
    },

};
export default dataList;

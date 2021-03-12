// import Multiselect from 'vue-multiselect';
//
// var inputHashtag = {
//     // ===Component name
//     name: "input-hashtag",
//     // ===Props passed to component
//     props: {
//         name: {
//             type: String,
//             required: true,
//         },
//         inputId: {
//             type: String,
//             required: true,
//         },
//         inputLabel:{
//             type: String,
//             required:true
//         },
//         selectOptions: {
//             type: Array,
//             required: true,
//         },
//         inputClass: {
//             type: String,
//             required: false,
//         },
//         errors:{}
//
//     },
//     // ===Components used by this component
//     components: {
//         Multiselect
//     },
//     // ===component Data properties
//     data() {
//         return {
//             value: null,
//             options:this.selectOptions,
//             tag_value: [{
//                 name: 'Javascript',
//                 code: 'js'
//             }],
//         }
//     },
//     // ===Code to be executed when Component is mounted
//     mounted() {
//
//     },
//     // ===Computed properties for the component
//     computed: {},
//     // ===Component methods
//     methods: {
//         grabinput (value) {
//             EventBus.$emit('update-multi-select', {
//                 name: this.name,
//                 value: this.value
//             });
//         },
//         // addTag (newTag) {
//         //     const tag = {
//         //         name: newTag,
//         //         code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
//         //     };
//         //     this.options.push(tag);
//         //     this.value.push(tag);
//         // }
//
//     }
// }
// export default inputHashtag;

<template>
    <white-container title="Hashtags" sectionClass="hashtags">

        <div class="hashtag-details">
            <ul class="hashtags-list">
                <li v-for="(item) in hashtags === null ? [] : hashtags">
                    <a class="hashtag-link" @click.prevent="click" href="#">#{{item.hashtag}}</a>
                </li>
            </ul>
        </div>

    </white-container>
</template>
<script>
import whiteContainer from "./../pages/whiteContainer";

export default {
    props: ["hashtags"],
    name: "hashtags",
    components: {
        whiteContainer,
    },
    methods:{
        
    }    
}
</script>
<template>
    <section class="news">
        <div v-for="(item, index) in news" :key="index" class="news__item">
            <div class="content">
                <div class="title">{{ item.title }}</div>
                <div class="category">{{ item.category }}</div>
            </div>
            <div class="image">
                <img :src="'/public/c-' + item.category + '.svg'" />
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        computed: {
            news() {
                return this.$store.getters.getNews;
            }
        },
    }
</script>

<style lang="scss">
    .news {
        &__item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 0 0 10px;
            border: 1px #eee solid;
            box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);
            padding: 20px;
            border-radius: 3px;
            background: #ffffff;

            .image {
                width: 40px;

                img {
                    height: 20px;
                }
            }

            .content {
                padding: 0 20px 0 0;
            }

            .category {
                text-transform: capitalize;
                font-size: 18px;
            }

            .title {
                font-size: 21px;
                margin: 0 0 5px;
            }
        }
    }
</style>

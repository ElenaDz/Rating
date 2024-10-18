class RatingStore
{
    // fixme имя константы должна быть большими буквами написана ok
    // fixme имя vote не подходящее для ключа, в хранилище реального сайта будет множество ключей и тебе нужно дать хорошее уникальное
    //  имя Во-первых в должно начинаться с имени библиотеки rating_ это нужно чтобы все ключи были рядом в списке так как сортировка
    //  по алфавиту Во-вторых у тебя там храниться объект RatingStoreData было бы не плохо чтобы имя совпадало например его можно назвать
    //  rating_store_data Да слово store выглядит лишним, но плюсов больше, полное совпадение имени это важно ok
    static KEY_LOCAL_STORE = 'rating_store_data';

    /**
     * @returns {[RatingStoreData]}
     */
    static getRating()
    {
        return JSON.parse(
            localStorage.getItem(RatingStore.KEY_LOCAL_STORE)
        );
    }

    static setRating(rating_data, id_rating, stars)
    {
        let list_ratings = [];

        rating_data.forEach((/** Rating */rating) =>
        {
            if (rating.id === id_rating){
                rating = this.getMapRating(stars, rating.id)
            } else if (!id_rating){
                rating = this.getMapRating(0, rating.id)
            }

            list_ratings.push(rating);
        });

        localStorage.setItem(
            RatingStore.KEY_LOCAL_STORE,
            JSON.stringify(list_ratings)
        );
    }

    /**
     * @returns {RatingStoreData}
     */
    static getMapRating(stars = 0, id_rating )
    {
        let rating_store_data = new RatingStoreData();

        rating_store_data.stars = stars;
        rating_store_data.id_rating = id_rating;

        return rating_store_data;
    }
}
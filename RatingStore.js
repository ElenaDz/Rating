class RatingStore
{
    static key_local_store = 'vote';

    /**
     * @returns {[RatingStoreData]}
     */
    static getRating()
    {
        return JSON.parse(localStorage.getItem(RatingStore.key_local_store));
    }

    static setRating(rating_data, id_rating, stars)
    {
        let list_ratings = [];

        rating_data.forEach((/** Rating */rating) =>
        {
            if (rating.id_rating === id_rating){
                rating = this.getMapRating(stars, rating.id_rating)
            } else if (!id_rating){
                rating = this.getMapRating(0, rating.id_rating)
            }

            list_ratings.push(rating);
        });

        localStorage.setItem(
            RatingStore.key_local_store,
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
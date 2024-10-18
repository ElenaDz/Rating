class RatingStore
{
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
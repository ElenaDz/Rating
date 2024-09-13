class RatingStore
{
    static EVENT_UPDATE = 'RatingStore.EVENT_UPDATE';

    static keyLocalStore = 'vote';

    static getRating()
    {
        return JSON.parse(localStorage.getItem(RatingStore.keyLocalStore)) || [this.getMapRating()];
    }

    static setRating(stars, flag, rating = 0, count_votes = 0)
    {
        let list_rating_store_array = [];

        let rating_store_array = this.getMapRating(stars, rating, count_votes, flag);

        list_rating_store_array.push(rating_store_array);
        localStorage.setItem(
            RatingStore.keyLocalStore,
            JSON.stringify(list_rating_store_array)
        );

        $('body').trigger(RatingStore.EVENT_UPDATE);
    }

    static getMapRating(stars = null, rating = 0, count_votes = 0, flag = false) {
        return {'stars': stars, 'rating': rating, 'count_votes': count_votes, 'flag': flag}
    }


}
class RatingStore
{
    static EVENT_UPDATE = 'RatingStore.EVENT_UPDATE';

    static key_local_store = 'vote';

    /**
     * @returns {RatingStoreData}
     */
    static getRating()
    {
        return JSON.parse(localStorage.getItem(RatingStore.key_local_store)) || [this.getMapRating()];
    }

    static setRating(stars, has_your_voice, rating = 0, count_votes = 0)
    {
        localStorage.setItem(
            RatingStore.key_local_store,
            JSON.stringify(this.getMapRating(stars, rating, count_votes, has_your_voice))
        );

        $('body').trigger(RatingStore.EVENT_UPDATE);
    }

    /**
     * @returns {RatingStoreData}
     */
    static getMapRating(stars = 0, rating = 0, count_votes = 0, has_your_voice = false)
    {
        // fixme создай объект RatingStoreData с помощью new и заполни его свойства, сейчас ты все еще создаешь объект на основе
        //  анонимного класса
        return {
                stars: stars,
                rating: rating,
                count_votes: count_votes,
                has_your_voice: has_your_voice
        }
    }
}
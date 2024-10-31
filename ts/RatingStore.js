class RatingStore {
    static getRatingsMy() {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || {};
    }
    static setRatingsMy(ratings_my) {
        localStorage.setItem(RatingStore.KEY_LOCAL_STORE, JSON.stringify(ratings_my));
    }
    static getRatingMy(rating_id) {
        let ratings_my = RatingStore.getRatingsMy();
        return ratings_my[RatingStore.getKeyRatingMy(rating_id)];
    }
    static setRatingMy(rating_id, rating_my) {
        let ratings_my = this.getRatingsMy();
        // @ts-ignore
        ratings_my[RatingStore.getKeyRatingMy(rating_id)] = rating_my;
        this.setRatingsMy(ratings_my);
    }
    static getKeyRatingMy(rating_id) {
        return RatingStore.PREFIX_ID + rating_id;
    }
}
RatingStore.KEY_LOCAL_STORE = 'rating_store_ratings_my';
RatingStore.PREFIX_ID = 'id_';

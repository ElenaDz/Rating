class RatingStore {
    static getItems() {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || {};
    }
    static setItems(items) {
        localStorage.setItem(RatingStore.KEY_LOCAL_STORE, JSON.stringify(items));
    }
    static getRatingMeForRatingId(rating_id) {
        let items = RatingStore.getItems();
        return items[RatingStore.PREFIX_ID + rating_id];
    }
    static setRatingMeForRatingId(rating_id, rating_my) {
        let items = this.getItems();
        // @ts-ignore
        items[RatingStore.PREFIX_ID + rating_id] = rating_my;
        this.setItems(items);
    }
}
RatingStore.KEY_LOCAL_STORE = 'rating_store_data';
RatingStore.PREFIX_ID = 'id_';

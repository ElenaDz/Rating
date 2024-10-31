class RatingStore {
    // fixme items у нас больше нет поэтому придется избавиться от этого слова Остались rating_my во множественном числе ratings_my
    static getItems() {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || {};
    }
    static setItems(items) {
        localStorage.setItem(RatingStore.KEY_LOCAL_STORE, JSON.stringify(items));
    }
    // fixme ForRatingId можно убрать так как других вариантов получения просто нет
    static getRatingMeForRatingId(rating_id) {
        let items = RatingStore.getItems();
        // fixme формирование имени свойства дублируется нужно вынести в функцию чтобы не было дублирования
        return items[RatingStore.PREFIX_ID + rating_id];
    }
    static setRatingMeForRatingId(rating_id, rating_my) {
        let items = this.getItems();
        // @ts-ignore
        items[RatingStore.PREFIX_ID + rating_id] = rating_my;
        this.setItems(items);
    }
}
// fixme rating_store_data больше не соответствует действительности теперь это rating_store_ratings_my
RatingStore.KEY_LOCAL_STORE = 'rating_store_data';
RatingStore.PREFIX_ID = 'id_';

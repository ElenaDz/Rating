
class RatingStore
{
    static KEY_LOCAL_STORE = 'rating_store_data';

    private static getItems():[]
    {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || [];
    }

    private static setItems(items)
    {
        localStorage.setItem(
            RatingStore.KEY_LOCAL_STORE,
            JSON.stringify(items)
        );
    }

    public static getRatingMeForRatingId(rating_id: string)
    {
        let items= RatingStore.getItems();

        return items[rating_id];
    }

    public static setRatingMeForRatingId(rating_id, rating_my)
    {
        let items = this.getItems();

        // @ts-ignore
        items[rating_id]= rating_my

        this.setItems(items);
    }
}
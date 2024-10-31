
class RatingStore
{
    private static KEY_LOCAL_STORE = 'rating_store_ratings_my';
    private static PREFIX_ID = 'id_';

    private static getRatingsMy(): {}
    {
        return JSON.parse(localStorage.getItem(RatingStore.KEY_LOCAL_STORE)) || {};
    }

    private static setRatingsMy(ratings_my)
    {
        localStorage.setItem(
            RatingStore.KEY_LOCAL_STORE,
            JSON.stringify(ratings_my)
        );
    }

    public static getRatingMy(rating_id: string)
    {
        let ratings_my= RatingStore.getRatingsMy();

        return ratings_my[RatingStore.getKeyRatingMy(rating_id)];
    }

    public static setRatingMy(rating_id, rating_my)
    {
         let ratings_my = this.getRatingsMy();

        // @ts-ignore
        ratings_my[RatingStore.getKeyRatingMy(rating_id)] = rating_my;

        this.setRatingsMy(ratings_my);
    }

    private static getKeyRatingMy(rating_id)
    {
        return RatingStore.PREFIX_ID + rating_id;
    }
}
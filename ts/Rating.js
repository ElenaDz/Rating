///<reference path="../_ide/jquery.d.ts"/>
class Rating {
    constructor($context) {
        this.$context = $context;
        new RatingText(this);
        $('body').trigger(Rating.EVENT_INIT, this);
    }
    get id() {
        return;
    }
    get rating() {
        return;
    }
    get count_votes() {
        return;
    }
    get rating_my() {
        return;
    }
    set rating_my(rating) {
    }
}
Rating.EVENT_INIT = 'Rating.EVENT_INIT';
let rating = new Rating($());

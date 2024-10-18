class RatingText {
    constructor(rating) {
        this.Rating = rating;
        $('body').on(Rating.EVENT_INIT, (e, rating) => {
            this.update();
        });
    }
    update() {
        this.updateRating(this.Rating.rating, this.Rating.count_votes, this.Rating.rating_my);
    }
    updateRating(rating, count_vote, rating_my) {
    }
}

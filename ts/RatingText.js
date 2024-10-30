class RatingText {
    constructor(rating) {
        this.Rating = rating;
        this.$context = this.Rating.$context.find('.text');
        $('body').on(Rating.EVENT_INIT + ' ' + Rating.EVENT_SELECT, () => {
            this.update();
            if (this.Rating.rating)
                this.showText();
        });
    }
    update() {
        this.updateRating(this.Rating.rating, this.Rating.count_votes, this.Rating.rating_my);
    }
    updateRating(rating, count_votes, rating_my) {
        this.$context.find('.rating_all').text(rating);
        this.$context.find('.count_votes').
            html(count_votes + ' ' +
            '<span>' + RatingText.declofNum(count_votes, ['человек', 'человека', 'человек']) + '</span>');
        this.$context.find('.rating_my').text(rating_my);
    }
    // fixme подумать и переименовать ok
    showText() {
        this.$context.removeClass('hide');
    }
    static declofNum(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
}

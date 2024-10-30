class RatingText {
    constructor(rating) {
        this.Rating = rating;
        this.$context = this.Rating.$context.find('.text');
        $('body').on(Rating.EVENT_INIT + ' ' + Rating.EVENT_SELECT, () => {
            this.update();
            if (this.Rating.rating)
                this.show();
            if (this.Rating.rating_my > 0)
                this.showRatingMy();
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
    show() {
        this.$context.removeClass('hide');
    }
    showRatingMy() {
        this.$context.find('.inner_rating_my').removeClass('hide');
    }
    // @link https://ru.stackoverflow.com/questions/89458/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D1%8F-%D0%B4%D0%BB%D1%8F-%D0%BE%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%BE%D0%BA%D0%BE%D0%BD%D1%87%D0%B0%D0%BD%D0%B8%D1%8F-%D1%81%D0%BB%D0%BE%D0%B2%D0%B0-%D0%BF%D0%BE-%D1%87%D0%B8%D1%81%D0%BB%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%BC%D1%83-1-%D0%B3%D0%BE%D0%B4-2-%D0%B3%D0%BE%D0%B4%D0%B0-5-%D0%BB%D0%B5%D1%82
    static declofNum(number, titles) {
        let cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }
}

class Rating {
    constructor($context) {
        this.$context = $context;
        this.rating_base = parseFloat(this.$context.data('rating_all') || 0);
        new RatingText(this);
        // @ts-ignore
        if (this.$context[0].Rating)
            return;
        // @ts-ignore
        this.$context[0].Rating = this;
        this.initRating();
    }
    initRating() {
        this.$bar = this.$context.find('select[name="rating"]').first();
        if (this.rating_my > 0) {
            this.showTextRatingMy();
        }
        this.setBar(this.rating_displayed);
        this.configureRatingWidget(this.rating_displayed);
        $('body').trigger(Rating.EVENT_INIT);
    }
    configureRatingWidget(rating_displayed) {
        this.$bar.barrating('show', {
            theme: 'css-stars',
            initialRating: rating_displayed,
            onSelect: ((value, text, event) => {
                if (typeof (event) === 'undefined')
                    return;
                // Исправление бага повторного нажатия на одну звезду
                if (!value) {
                    this.setBar(this.rating_displayed);
                    this.rating_my = this.rating_displayed;
                }
                else {
                    this.rating_my = value;
                }
                this.showTextRatingMy();
                this.$context.trigger(Rating.EVENT_SELECT);
            })
        });
    }
    setBar(initial_rating) {
        this.$bar.barrating('set', initial_rating);
    }
    showTextRatingMy() {
        this.$context.find('.inner_rating_my').removeClass('hide');
    }
    get rating_displayed() {
        return this.rating_my || this.rating || 0;
    }
    get id() {
        return this.$context.attr('id');
    }
    get rating() {
        let rating = this.rating_my > 0
            ? (((this.rating_base * (this.count_votes - 1)) + this.rating_my) / this.count_votes)
            : this.rating_base;
        return parseFloat(rating.toFixed(1));
    }
    get count_votes() {
        let count_votes = parseInt(this.$context.data('count_votes') || 0);
        // fixme повторяющийся код вынеси в переменную ok
        return !this.rating_my
            ? count_votes
            : count_votes + 1;
    }
    // fixme сократи метод до одной строки, смотри ниже подробнее ok
    get rating_my() {
        return parseInt(RatingStore.getRatingMeForId(this.id));
    }
    // fixme Rating не должен так много знать про RatingStore, все что он должен у долен уметь это дергать один
    //  метод "сохрани мою оценку для такого то id" setRatingMeForId(id, rating_my), полностью переписать этот метод
    //  сократив его до одной строки вызова этого метода ok
    set rating_my(rating_my) {
        RatingStore.setRatingMeForId(this.id, rating_my);
    }
    static create($context = $('.b_rating')) {
        let $ratings = $context;
        /** @type {Rating[]} */
        let ratings = [];
        $ratings.each((index, element) => {
            let rating = $(element);
            ratings.push(new Rating(rating));
        });
        return ratings;
    }
}
Rating.EVENT_INIT = 'Rating.EVENT_INIT';
Rating.EVENT_SELECT = 'Rating.EVENT_SELECT';

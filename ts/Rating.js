class Rating {
    constructor($context) {
        this.$context = $context;
        this.rating_base = this.rating_all;
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
            this.$context.find('.inner_your_voice').removeClass('hide');
        }
        this.updateRating();
        if (!this.rating_my) {
            this.rating_my = 0;
            this.configureRatingWidget(0);
            $('body').trigger(Rating.EVENT_INIT);
            return;
        }
        let initial_rating = this.rating_my || this.rating_all;
        this.$bar.barrating('set', initial_rating);
        this.configureRatingWidget(initial_rating);
        $('body').trigger(Rating.EVENT_INIT);
    }
    configureRatingWidget(initial_rating) {
        this.$bar.barrating('show', {
            theme: 'css-stars',
            initialRating: parseFloat(initial_rating) || this.rating_all,
            onSelect: (value, text, event) => {
                this.onRatingSelect(value, event);
            }
        });
    }
    onRatingSelect(selected_star, event) {
        if (typeof (event) === 'undefined')
            return;
        if (!selected_star) {
            this.$bar.barrating('set', this.rating_my || Math.floor(this.rating_all));
            this.rating_my = this.rating_my || Math.floor(this.rating_all);
        }
        else {
            this.rating_my = selected_star;
        }
        this.$context.find('.inner_your_voice').removeClass('hide');
        this.updateRating();
        this.$context.trigger(Rating.EVENT_SELECT);
    }
    updateRating() {
        this.rating_all = parseFloat(this.calculate(this.rating_my).toFixed(1));
    }
    calculate(rating_my) {
        return rating_my > 0
            ? (((this.rating_base * (this.count_votes - 1)) + parseInt(rating_my)) / this.count_votes)
            : this.rating_all;
    }
    get id() {
        return this.$context.attr('id');
    }
    get rating_all() {
        return parseFloat(this.$context.data('rating_all') || 0);
    }
    get count_votes() {
        // fixme повторяющийся код вынеси в переменную
        return !this.rating_my
            ? parseInt(this.$context.data('count_votes') || 0)
            : parseInt((this.$context.data('count_votes') || 0) + 1);
    }
    // fixme сократи метод до одной строки, смотри ниже подробнее
    get rating_my() {
        let rating_my;
        let rating_data = RatingStore.getRating();
        rating_data.forEach((/** RatingStoreData */ rating_store) => {
            if (rating_store.id_rating === this.id) {
                rating_my = rating_store.stars;
            }
        });
        return rating_my;
    }
    // fixme Rating не должен так много знать про RatingStore, все что он должен у долен уметь это дергать один
    //  метод "сохрани мою оценку для такого то id" setRatingMeForId(id, rating_my), полностью переписать этот метод
    //  сократив его до одной строки вызова этого метода
    set rating_my(rating_my) {
        let rating_data = RatingStore.getRating();
        if (!RatingStore.hesRatingStore(this.id)) {
            rating_data.push(RatingStore.getMapRating(rating_my, this.id));
            RatingStore.setRating(rating_data, this.id, rating_my);
        }
        else {
            rating_data.forEach((/** RatingStoreData */ rating_store) => {
                if (rating_store.id_rating === this.id) {
                    rating_store.stars = rating_my;
                }
            });
            RatingStore.setRating(rating_data, this.id, rating_my);
            this.$context.data('rating_my', rating_my);
        }
    }
    set rating_all(rating) {
        this.$context.data('rating_all', rating);
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
// fixme удалить - не используется
Rating.EVENT_RE_SELECT = 'Rating.EVENT_RE_SELECT';

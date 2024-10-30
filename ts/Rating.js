class Rating {
    constructor($context) {
        this.$context = $context;
        // fixme удали и избавься от этой костанты, ты сохраняешь данные во втором месте, а данные нужно хранить
        //  в одном месте, в данном случае в Html (исправила, если я правильно поняла)
        // fixme это должно быть ниже, сейчас не защищено от повторного вызова ok
        // @ts-ignore
        if (this.$context[0].Rating)
            return;
        // @ts-ignore
        this.$context[0].Rating = this;
        new RatingText(this);
        this.$bar = this.$context.find('select[name="rating"]').first();
        // fixme мне кажется эти две строки нужно поменять местами ok
        this.showBar();
        this.updateBar();
        $('body').trigger(Rating.EVENT_INIT);
    }
    // fixme отказываемся от этого метода, перенеси код в конструктор ok
    // fixme переименовать метод в showBar ok
    // fixme отказываемся от передачи аргумента в функцию, пускай сам обращается в нужному свойству ok
    showBar() {
        this.$bar.barrating('show', {
            theme: 'css-stars',
            initialRating: this.rating_displayed,
            onSelect: ((value, text, event) => {
                if (typeof (event) === 'undefined')
                    return;
                // Исправление бага повторного нажатия на одну звезду
                if (!value) {
                    this.rating_my = Math.floor(this.rating_displayed);
                    this.updateBar();
                }
                else {
                    this.rating_my = value;
                }
                this.$context.trigger(Rating.EVENT_SELECT);
            })
        });
    }
    // fixme переименовываем метод в updateBar ok
    // fixme отказываемся от передачи аргумента в функцию, пускай сам обращается в нужному свойству ok
    updateBar() {
        this.$bar.barrating('set', this.rating_displayed);
    }
    get rating() {
        let rating = this.rating_my > 0
            ? (((this.rating_base * (this.count_votes - 1)) + this.rating_my) / this.count_votes)
            : this.rating_base;
        return parseFloat(rating.toFixed(1));
    }
    get rating_base() {
        return parseFloat(this.$context.data('rating_all') || 0);
    }
    // fixme перенеси ниже к свойству rating, все похожие свойства должны быть рядом ok
    get rating_displayed() {
        return this.rating_my || this.rating || 0;
    }
    // fixme перенеси выше к свойству rating, все похожие свойства должны быть рядом ok
    get rating_my() {
        return parseInt(RatingStore.getRatingMeForId(this.id));
    }
    set rating_my(rating_my) {
        RatingStore.setRatingMeForId(this.id, rating_my);
    }
    get count_votes() {
        let count_votes = parseInt(this.$context.data('count_votes') || 0);
        return !this.rating_my
            ? count_votes
            : count_votes + 1;
    }
    get id() {
        return this.$context.attr('id');
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

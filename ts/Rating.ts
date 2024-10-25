
class Rating
{
	static readonly EVENT_INIT = 'Rating.EVENT_INIT';
	static readonly EVENT_SELECT = 'Rating.EVENT_SELECT';
	static readonly EVENT_RE_SELECT = 'Rating.EVENT_RE_SELECT';

	public $context: JQuery;
	private $bar_rating: JQuery;
	private readonly base_all_rating: number;

	constructor($context:JQuery) {
		this.$context = $context;

		this.base_all_rating = this.all_rating;

		new RatingText(this);

		// Не знаю как испровить ошибку. Но всё работает
		if (this.$context[0].Rating) return;

		this.$context[0].Rating = this;

		this.initRating();
	}

	private initRating() {

		this.$bar_rating = this.$context.find('select[name="rating"]').first();

		let rating_data = RatingStore.getRating();

		if (!RatingStore.hesRatingStore(this.id)) {
			this.rating_my = 0;
		}

		if (this.rating_my > 0) {
			this.$context.find('.inner_your_voice').removeClass('hide');
		}

		this.updateRating();

		if (!rating_data) {
			this.configureRatingWidget( 0);
			return;
		}

		let initial_rating = this.rating_my ||  this.all_rating;

		this.$bar_rating.barrating('set', initial_rating);

		this.configureRatingWidget( initial_rating);

		$('body').trigger(Rating.EVENT_INIT);
	}

	private configureRatingWidget(initialRating)
	{
		this.$bar_rating.barrating('show', {
			theme: 'css-stars',
			initialRating: parseFloat(initialRating) || this.all_rating,
			onSelect: (value, text, event) => {
				this.onRatingSelect(value, event);
			}
		});
	}

	private onRatingSelect(selected_star, event)
	{
		if (typeof (event) === 'undefined') return;

		if (!selected_star) {
			this.$bar_rating.barrating('set', this.rating_my || Math.floor(this.all_rating));

			this.rating_my = this.rating_my || Math.floor(this.all_rating);

		} else {
			this.rating_my = selected_star;
		}

		this.$context.find('.inner_your_voice').removeClass('hide');

		this.updateRating();

		this.$context.trigger(Rating.EVENT_SELECT);
	}

	private updateRating()
	{
		this.all_rating = parseFloat(this.calculate(this.rating_my).toFixed(1));
	}

	private calculate(rating_my)
	{
		return rating_my > 0
			? (((this.base_all_rating * (this.count_votes - 1) ) + parseInt(rating_my) )/ this.count_votes )
			: this.all_rating;
	}

	private get id(): string
	{
		return this.$context.attr('id');
	}

	public get all_rating():number
	{
		return parseFloat(this.$context.data('all_rating') || 0);
	}

	public get count_votes():number
	{
		return  !this.rating_my
		? parseInt(this.$context.data('count_votes') || 0)
		: parseInt((this.$context.data('count_votes') || 0) + 1);
	}

	public get rating_my(): number
	{
		let rating_my;

		let rating_data = RatingStore.getRating();

		rating_data.forEach((/** RatingStoreData */ rating_store) =>
		{
			if (rating_store.id_rating === this.id) {
				rating_my = rating_store.stars;
			}
		})

		return rating_my;
	}

	private set rating_my(rating_my: number)
	{
		let rating_data = RatingStore.getRating();

		if (!RatingStore.hesRatingStore(this.id)) {
			rating_data.push(RatingStore.getMapRating(rating_my, this.id));

			RatingStore.setRating(rating_data, this.id, rating_my);
		} else {
			rating_data.forEach((/** RatingStoreData */ rating_store) =>
			{
				if (rating_store.id_rating === this.id) {
					rating_store.stars = rating_my;
				}
			})

			RatingStore.setRating(rating_data, this.id, rating_my);

			this.$context.data('rating_my', rating_my);
		}
	}

	private set all_rating(rating: number)
	{
		this.$context.data('all_rating', rating);
	}

	static create($context = $('.b_rating'))
	{
		let $ratings = $context;
		/** @type {Rating[]} */
		let ratings = [];
		$ratings.each((index, element) => {
			let rating = $(element);
			ratings.push(new Rating(rating));
		})
		return ratings;
	}
}





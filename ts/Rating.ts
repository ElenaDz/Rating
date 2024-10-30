
class Rating
{
	static readonly EVENT_INIT = 'Rating.EVENT_INIT';
	static readonly EVENT_SELECT = 'Rating.EVENT_SELECT';
	// fixme удалить - не используется ok

	public $context: JQuery;
	private $bar: JQuery;
	private readonly rating_base: number;

	constructor($context:JQuery)
	{
		this.$context = $context;

		this.rating_base = parseFloat(this.$context.data('rating_all') || 0);

		new RatingText(this);

		// @ts-ignore
		if (this.$context[0].Rating) return;

		// @ts-ignore
		this.$context[0].Rating = this;

		this.initRating();
	}

	private initRating()
	{
		this.$bar = this.$context.find('select[name="rating"]').first();

		if (this.rating_my > 0) {
			this.showTextRatingMy();
		}

		this.setBar(this.rating_displayed)

		this.configureRatingWidget(this.rating_displayed);

		$('body').trigger(Rating.EVENT_INIT);
	}


	private configureRatingWidget(rating_displayed)
	{
		this.$bar.barrating('show', {
			theme: 'css-stars',
			initialRating: rating_displayed,
			onSelect: ((value, text, event) =>
			{
				if (typeof (event) === 'undefined') return;

				// Исправление бага повторного нажатия на одну звезду
				if (!value) {
					this.setBar(this.rating_displayed);

					this.rating_my = this.rating_displayed;

				} else {
					this.rating_my = value;
				}

				this.showTextRatingMy();

				this.$context.trigger(Rating.EVENT_SELECT);
			})
		})
	}

	private setBar(initial_rating)
	{
		this.$bar.barrating('set', initial_rating);
	}

	private showTextRatingMy()
	{
		this.$context.find('.inner_rating_my').removeClass('hide');
	}

	private get rating_displayed():number
	{
		return this.rating_my ||  this.rating  || 0;
	}

	private get id(): string
	{
		return this.$context.attr('id');
	}

	public get rating():number
	{
		let rating = this.rating_my > 0
			? (((this.rating_base * (this.count_votes - 1) ) + this.rating_my )/ this.count_votes )
			: this.rating_base;

		return parseFloat(rating.toFixed(1));
	}

	public get count_votes():number
	{
		let count_votes = parseInt(this.$context.data('count_votes') || 0)
		// fixme повторяющийся код вынеси в переменную ok
		return  ! this.rating_my
			? count_votes
			: count_votes + 1;
	}

	// fixme сократи метод до одной строки, смотри ниже подробнее ok
	public get rating_my(): number
	{
		return parseInt(RatingStore.getRatingMeForId(this.id));
	}

	// fixme Rating не должен так много знать про RatingStore, все что он должен у долен уметь это дергать один
	//  метод "сохрани мою оценку для такого то id" setRatingMeForId(id, rating_my), полностью переписать этот метод
	//  сократив его до одной строки вызова этого метода ok
	private set rating_my(rating_my: number)
	{
		RatingStore.setRatingMeForId(this.id, rating_my);
	}

	public static create($context = $('.b_rating'))
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





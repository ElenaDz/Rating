class RatingText
{
	private $context: JQuery;
	private Rating:Rating;

	constructor(rating:Rating) {
		this.Rating = rating;

		this.$context = this.Rating.$context.find('.text');

		$('body').on(Rating.EVENT_INIT +' '+ Rating.EVENT_SELECT, () =>
		{
			this.update();

			if (this.Rating.rating_all) this.showRatingText();
		});
	}

	private update()
	{
		this.updateRating(
			this.Rating.rating_all,
			this.Rating.count_votes,
			this.Rating.rating_my
		);
	}

	private updateRating(rating_all, count_vote, rating_my)
	{
		this.rating_all = rating_all;
		this.count_votes = count_vote;
		this.rating_my = rating_my;
	}

	// fixme подумать и переименовать
	private showRatingText()
	{
		this.$context.removeClass('hide');
	}

	// fixme избавиться
	private set rating_all(rating_all: number)
	{
		this.$context.find('.rating_all').text(rating_all);
	}

	// fixme избавиться
	private set count_votes(count_votes)
	{
		this.$context.find('.count_votes').
			html(
				count_votes+' '+
				'<span>' + RatingText.declofNum(count_votes, ['человек', 'человека', 'человек']) + '</span>'
			);
	}

	// fixme избавиться
	private set rating_my(rating_my: number)
	{
		this.$context.find('.your_voice').text(rating_my);
	}


	private static declofNum(number, titles) {
		let cases = [2, 0, 1, 1, 1, 2];
		return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
	}
}
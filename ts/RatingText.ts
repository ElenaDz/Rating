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
			this.showRatingText();
		});
	}

	private update()
	{
		this.updateRating(
			this.Rating.all_rating,
			this.Rating.count_votes,
			this.Rating.rating_my
		);
	}

	private updateRating(rating, count_vote, rating_my)
	{
		this.rating = rating;
		this.countVotes = count_vote;
		this.rating_my = rating_my;
	}

	private showRatingText()
	{
		this.$context.removeClass('hide');
	}

	private set rating(rating)
	{
		this.$context.find('.rating_all').text(rating);
	}

	private set countVotes(count_votes)
	{
		this.$context.find('.count_votes').
		html(
			count_votes + ' ' + '<span>' + this.declofNum(count_votes, ['человек', 'человека', 'человек']) + '</span>'
		);
	}

	private set rating_my(rating_my)
	{
		this.$context.find('.your_voice').text(rating_my);
	}

	private declofNum(number, titles) {
		let cases = [2, 0, 1, 1, 1, 2];
		return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
	}

}
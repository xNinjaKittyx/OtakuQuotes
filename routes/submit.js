var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.locals.title = 'AnimeQuotes';
    res.render('submit');
});

router.post('/', function(req, res, next) {
    res.locals.title = 'AnimeQuotes';

    //Check that the name field is not empty
    req.checkBody('name', 'Anime name required').notEmpty();

    //Trim and escape the name field.
    req.sanitize('name').escape();
    req.sanitize('name').trim();

    //Run the validators
    var errors = req.validationErrors();

    //Create a genre object with escaped and trimmed data.
    var genre = new Genre(
        { name: req.body.name }
    );

    if (errors) {
        //If there are errors render the form again, passing the previously entered values and errors
        res.render('quote_form', { title: 'Create Genre', anime: anime, errors: errors});
        return;
    }
    else {
        // Data from form is valid.
        //Check if Genre with same name already exists
        Genre.findOne({ 'name': req.body.name })
            .exec( function(err, found_genre) {
                console.log('found_genre: ' + found_genre);
                if (err) { return next(err); }

                if (found_genre) {
                    //Genre exists, redirect to its detail page
                    res.redirect(found_genre.url);
                }
                else {

                    genre.save(function (err) {
                        if (err) { return next(err); }
                        //Genre saved. Redirect to genre detail page
                        res.redirect(genre.url);
                    });

                }

            });
    }
});

module.exports = router;

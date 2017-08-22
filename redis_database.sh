redis-cli hmset pending:1 id 1 anime "Steins;Gate" char "Rintarou Okabe" quote "El Psy Congroo" episode 1 submitter "Dan"
redis-cli hmset pending:2 id 2 anime "Steins;Gate" char "Rintarou Okabe" quote "El Psy Congroo" episode 1 submitter "Dan"
redis-cli hmset quote:1 id 1 anime "Fate/Stay Night" char "Emiya Shirou" quote "People die when they are killed."
redis-cli hmset quote:2 id 2 anime "Fate/Stay Night" char "Emiya Shirou" quote "People die when they are killed."
redis-cli set quotecount 2
redis-cli set submitted_quotes 2
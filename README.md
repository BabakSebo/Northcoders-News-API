# Northcoders News API

# Clone Repo

Once forked, clone the repo.

# .env test & development

We'll have two databases in this project. One for real looking dev data and another for simpler test data.

As env files are ignored (see .gitignore), you will need to create two .env files.
One for your test environment: .env.test add `PGDATABASE = nc_news_test`.
One for your development environment: .env.development add `PGDATABASE = nc_news`.

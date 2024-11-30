# Northcoders News API

This is an API for the Northcoders News application, which provides news articles, comments, and user information. The API allows users to interact with the data by performing CRUD operations on articles, comments, and users.

## Hosted Version

You can access the hosted version of the API [here](https://nc-news-be-project-k6p0.onrender.com).

## Getting Started

### Prerequisites

- Node.js (minimum version: 14.0.0)
- PostgreSQL (minimum version: 12.0)

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/geekyMicky/nc-news-be-project
    cd nc-news-be-project
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Set up the local database:
    ```sh
    npm run setup-dbs
    ```

4. Seed the local database:
    ```sh
    npm run seed
    ```

5. Create the `.env` files:
    - `.env.development`: `PGDATABASE=nc_news`
    - `.env.test`: `PGDATABASE=nc_news_test`

### Running Tests

To run the tests, use the following command:
    ```
    npm test
    ```

## API Endpoints

For detailed information about the available endpoints, refer to the `endpoints.json` file.

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)

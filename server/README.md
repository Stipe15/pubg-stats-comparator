# PUBG Stats API Server

This server provides a REST API to fetch player statistics from the official PUBG API. It acts as a secure proxy, keeping your API key safe.

## Setup

1.  **Install Dependencies:**
    Navigate to the `server` directory and run:
    ```bash
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the `server` directory by copying the example:
    ```
    cp .env.example .env
    ```
    Open the `.env` file and add your PUBG API key:
    ```
    PUBG_API_KEY="YOUR_PUBG_API_KEY_HERE"
    ```
    You can obtain an API key from the [PUBG Developer Portal](https://developer.pubg.com/).

## Running the Server

-   **Development Mode:**
    To run the server with automatic restarts on file changes (requires `nodemon`):
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    ```bash
    npm run start
    ```

The server will run on `http://localhost:5000` by default.

## API Endpoints

### `GET /api/players`

Fetches detailed statistics for one or more players.

-   **Query Parameters:**
    -   `playerNames` (required): A comma-separated string of player account names.
-   **Example Request:**
    ```
    http://localhost:5000/api/players?playerNames=TGLTN,shroud
    ```
-   **Success Response (200):**
    Returns a JSON array of player objects with their latest ranked season stats.
-   **Error Response (400/500):**
    Returns a JSON object with an error message.

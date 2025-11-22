# PUBG Stats Comparator

A project by [@Stipe15](https://github.com/Stipe15) that lets you compare player statistics from PLAYERUNKNOWN’S BATTLEGROUNDS (PUBG). This is a client-only application that fetches data directly from the PUBG API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration for GitHub Pages](#configuration-for-github-pages)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Compare two (or more) PUBG players side by side.
- Show key performance metrics (kills, win rate, damage, etc.).
- Simple, responsive UI for quick comparisons.
- Client-side fetching of stats from the PUBG API.
- Modular design so you can extend it (e.g., add more metrics).

---

## Tech Stack
- **Frontend**: React, Material-UI, Recharts
- External dependencies: Access to the PUBG stats API.

---

## Getting Started

### Prerequisites
- Node.js installed (v12+ recommended)
- A PUBG API key. You can get one from the [PUBG Developer Portal](https://developer.pubg.com/).

### Installation
```bash
# Clone the repo
git clone https://github.com/Stipe15/pubg-stats-comparator.git
cd pubg-stats-comparator/client

# Install dependencies
npm install
```

### Running locally
To run the application locally, you need to create a `.env` file in the `client` directory with your PUBG API key:
```
REACT_APP_PUBG_API_KEY=your_api_key_here
```

Then, you can start the development server:
```bash
# In the client directory
npm start
```

Then open your browser and navigate to `http://localhost:3000`.

---

## Configuration for GitHub Pages

To deploy this application to GitHub Pages, you need to set your PUBG API key as a secret in your GitHub repository.

1.  Go to your repository's **Settings** tab.
2.  In the left sidebar, click on **Secrets and variables** > **Actions**.
3.  Click on **New repository secret**.
4.  Name the secret `REACT_APP_PUBG_API_KEY`.
5.  Paste your PUBG API key into the value field.
6.  Click **Add secret**.

The application is now configured to use this key when deployed to GitHub Pages.

---

## Usage
1. Launch the app.
2. Enter the first player’s ID or name.
3. Enter the second (or more) player’s ID or name.
4. Submit and view the comparison results: kills, win rate, damage, etc.

---

## Project Structure
```
pubg-stats-comparator/
├── client/         # Frontend UI code
│   ├── src/
│   └── package.json
└── README.md       # (you’re reading it!)
```

---

## Contributing
Contributions are welcome! Here’s how you can help:
- Bug reports or feature requests — open an issue.
- Improvements to UI/UX — create a pull request with enhancements in `client`.
- Extend metrics — modify the client-side logic.
- Improve documentation, add tests, refine code style.

Please follow the repository’s contribution guidelines (if present) and adhere to coding style and commit conventions.

---

## License
```
MIT License
```

---

## Contact
If you have questions or suggestions, feel free to open an issue or reach out to the maintainer @Stipe15 via GitHub.

---

**Happy comparing — may your stats speak for themselves! 🚀**


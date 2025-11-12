# PUBG Stats Comparator

A project by [@Stipe15](https://github.com/Stipe15) that lets you compare player statistics from PLAYERUNKNOWN’S BATTLEGROUNDS (PUBG).  
It consists of a client side (frontend) and a server side (backend) to fetch, process and show comparative stats for players.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech‑stack)  
- [Getting Started](#getting‑started)  
- [Configuration](#configuration)  
- [Usage](#usage)  
- [Project Structure](#project‑structure)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features  
- Compare two (or more) PUBG players side by side.  
- Show key performance metrics (kills, win rate, damage, etc).  
- Simple, responsive UI for quick comparisons.  
- Backend API to fetch stats and serve data to the frontend.  
- Modular design so you can extend it (e.g., add more metrics or support other regions/queues).

---

## Tech Stack  
- **Frontend**: HTML, CSS, JavaScript (client folder)  
- **Backend**: Node.js (server folder)  
- You may use additional libraries/frameworks depending on your chosen setup (check `package.json` in each folder).  
- External dependencies: Access to a PUBG stats API (or scraper) for getting player data.

---

## Getting Started  

### Prerequisites  
- Node.js installed (v12+ recommended)  
- Access (or key) to a PUBG stats API (or a method to fetch public stats)  
- Basic familiarity with running npm/yarn commands  

### Installation  
```bash
# Clone the repo
git clone https://github.com/Stipe15/pubg-stats-comparator.git
cd pubg-stats-comparator

# Install dependencies for server
cd server
npm install

# Install dependencies for client
cd ../client
npm install
```

### Running locally  
```bash
# In one terminal: start the backend
cd server
npm start

# In another terminal: start the frontend
cd client
npm start
```

Then open your browser and navigate to the frontend (e.g., `http://localhost:3000` or whatever port the client uses).  
You should be able to enter player names/IDs and compare them.

---

## Configuration  
- In the `server` folder, you may need to set environment variables (e.g., API key, region, endpoints).  
- In the `client` folder, check configuration (e.g., the backend URL) to match your local server setup.  
- If you support multiple regions (EU, NA, AS…), configure accordingly.

---

## Usage  
1. Launch the app.  
2. Enter first player’s ID or name.  
3. Enter second (or more) player’s ID or name.  
4. Choose region/queue if applicable.  
5. Submit and view the comparison results: kills, win rate, damage, maybe averages per match, etc.  
6. Use the UI to switch views or add more players (if supported).

---

## Project Structure  
```
pubg‑stats‑comparator/
├── client/         # Frontend UI code
│   ├── src/
│   └── package.json
├── server/         # Backend API code
│   ├── src/
│   └── package.json
└── README.md       # (you’re reading it!)
```

You may find modules inside `server/src` that handle fetching from PUBG API, caching results, providing endpoints for the frontend.

---

## Contributing  
Contributions are welcome! Here’s how you can help:  
- Bug reports or feature requests — open an issue.  
- Improvements to UI/UX — create a pull request with enhancements in `client`.  
- Extend metrics or support for other platforms/regions — modify `server` logic.  
- Improve documentation, add tests, refine code style.

Please follow the repository’s contribution guidelines (if present) and adhere to coding style and commit conventions.

---

## License  
Specify the license under which you’re releasing the project (e.g., MIT).  
```
MIT License
© [Year] [Your Name/Organization]
```

---

## Contact  
If you have questions or suggestions, feel free to open an issue or reach out to the maintainer @Stipe15 via GitHub.

---

**Happy comparing — may your stats speak for themselves! 🚀**

---  

*This README.md is a template. You may want to add more details such as screenshots, live demo link, detailed API specification (endpoints, request/response formats), known limitations, roadmap, and acknowledgements.*

# Cookie Words

Cookie Words is a wallet-connected, cookie-themed word puzzle game built for the
Cookie Chain community. Players solve secret words, build streaks, earn XP,
spend crumbs for hints, and compete on a wallet-based leaderboard.

- **Live application:** <https://cookie-words.vercel.app/>
- **Cookie Chain:** <https://www.cookiechain.wtf>
- **Cookie Chain documentation:** <https://docs.cookiechain.wtf>
- **Cookie Chain RPC:** <https://rpc.cookiescan.io>
- **Cookie Chain X:** <https://x.com/TheCookieChain>
- **Cookie Chain Telegram:** <https://t.me/TheCookieNetChain>

## What the game does

Cookie Words combines a familiar Wordle-style word game with Cookie Chain
wallet connectivity and player progression.

Each round:

1. The server selects a word appropriate for the selected difficulty.
2. The player has up to six attempts to solve it.
3. The board reports whether guessed letters are correct, present in another
   position, or absent.
4. A timer tracks the round.
5. The result is submitted to the player's profile.

Winning awards XP, increments wins, updates the best time when applicable, and
updates the daily streak. Losing still awards a smaller amount of XP.

## Features

### Wallet sign-in

The game uses the Solana wallet adapter and currently configures Nightly as the
wallet adapter. A player:

1. Connects a wallet.
2. Requests a one-time authentication challenge.
3. Signs the challenge message in the wallet.
4. Sends the signature to the server for Ed25519 verification.
5. Receives a secure, HTTP-only session cookie.

The session lasts for seven days. The wallet address is the player's identity
for game progress, seen-word tracking, market actions, and leaderboard data.

### Difficulty modes

The lobby offers three modes:

- **Easy:** common baking and food-related words.
- **Medium:** the broader application dictionary.
- **Hard:** rare and longer vocabulary.

The current implementation uses five-letter words from the bundled dictionary.
Words already seen by a wallet are avoided until that mode's available list has
been exhausted, at which point the seen-word list wraps around.

### Gameplay

- Six rows are available for each round.
- Type letters with the on-screen keyboard or a physical keyboard.
- Use **Backspace** to remove the most recent letter.
- Press **Enter** to submit a complete guess.
- Tile states are displayed as `correct`, `present`, or `absent`.
- The board and keyboard include animated feedback.
- A timer runs while the round is active.
- The game can be played in fullscreen mode.

### Hints and crumbs

Players start with a crumb balance. During a round:

- **Clue Crumb:** spends one crumb to reveal the word clue.
- **Letter Crumb:** reveals an unrevealed letter.
- Letter hints use escalating costs of 1, 2, 4, and so on.

The client prevents a hint from being used when the player does not have
enough crumbs, and the server performs an atomic balance check before deducting
crumbs.

### Crumb Market

The Market displays crumbs, XP, and the wallet's native Cookie Chain balance.
The implemented exchanges are:

- **1 crumb for 50 XP**
- **100 XP for a balance-qualified 1 $COOK action**
- **Combo:** 100 XP and 3 crumbs for a balance-qualified 3 $COOK action

The server checks the wallet's native balance through the configured Cookie
Chain RPC. The current implementation records the in-game reward but does not
construct or submit a native-token transfer transaction from the player's
wallet. Treat the $COOK options as balance-gated game mechanics unless an
on-chain transfer program is added.

### Progression and leaderboard

The player profile stores:

- Wallet address
- XP
- Crumbs
- Current streak
- Last played time
- Total wins
- Best time
- Creation time

The leaderboard ranks players by total wins and then best time. It displays a
shortened wallet address, wins, streak, XP, and best time.

### Round results

At the end of a round, the result modal can show:

- The solved word
- Number of attempts
- Elapsed time
- Streak
- XP earned
- Current rank
- The word clue
- A star rating

Players can copy a short result summary to the clipboard, start another round,
return to the lobby, or open the leaderboard.

## Cookie Chain integration

Cookie Words uses Cookie Chain as its configured Solana-compatible network:

- The frontend wallet provider connects to `NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL`.
- Nightly is configured through `@solana/wallet-adapter-nightly`.
- Native balance checks use `Connection.getBalance` from `@solana/web3.js`.
- The Market uses the native balance check to gate $COOK-related rewards.

The default RPC endpoint is:

```text
https://rpc.cookiescan.io
```

If users need to move supported assets from another network, direct them to the
official Cookie Chain Bridge and verify the current bridge link through the
official Cookie Chain documentation before they approve a transaction.

## Technology stack

- Next.js 15 App Router
- React 19
- TypeScript
- Tailwind CSS and custom CSS
- Framer Motion
- Solana Web3.js
- Solana Wallet Adapter
- Nightly Wallet Adapter
- MongoDB with Mongoose
- JWT session cookies
- TweetNaCl and Base58 signature verification
- Zod for validation dependencies

## Project structure

```text
.
├── public/
│   ├── cookie_hero.png
│   ├── crumbs.gif
│   ├── happycookie.png
│   └── sadcookie.png
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── game/
│   │   │   ├── market/
│   │   │   └── leaderboard/
│   │   ├── leaderboard/page.tsx
│   │   ├── play/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── game/
│   │   ├── landing/
│   │   ├── leaderboard/
│   │   ├── market/
│   │   └── wallet/
│   ├── hooks/
│   │   ├── useGameState.ts
│   │   └── useTimer.ts
│   ├── lib/
│   │   ├── db/
│   │   ├── words/
│   │   ├── scoring.ts
│   │   └── session.ts
│   ├── models/
│   │   ├── Player.ts
│   │   └── SeenWord.ts
│   └── styles/
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

## Requirements

Install the following before running the project:

- Node.js 18.18 or newer
- npm
- MongoDB, either locally or through a hosted MongoDB provider
- A Nightly wallet for interactive testing
- Cookie Chain RPC access for balance checks

## Running locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Copy `.env.example` to `.env.local`.

On macOS/Linux:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 3. Configure environment variables

```dotenv
MONGODB_URI=mongodb://localhost:27017/cookie-words
JWT_SECRET=replace-this-with-a-long-random-secret
NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL=https://rpc.cookiescan.io
NEXT_PUBLIC_TREASURY_ADDRESS=
```

#### Environment variable reference

| Variable | Required | Description |
|---|---:|---|
| `MONGODB_URI` | Yes | MongoDB connection string used by player and seen-word storage. |
| `JWT_SECRET` | Yes | Secret used to sign seven-day session cookies. Use a strong production secret. |
| `NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL` | No | Cookie Chain RPC endpoint. Defaults to `https://rpc.cookiescan.io`. |
| `NEXT_PUBLIC_TREASURY_ADDRESS` | No | Reserved configuration for a future real on-chain treasury transfer flow. |

### 4. Start MongoDB

For a local MongoDB installation, start the MongoDB service and ensure the
database host and port match `MONGODB_URI`.

No migration command is required. Mongoose creates the `Player` and `SeenWord`
collections and indexes when the application first uses them.

### 5. Start the development server

```bash
npm run dev
```

Open <http://localhost:3000>.

On first use, connect Nightly, sign the authentication challenge, select a
mode, and click **Play Now**.

## Available npm scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Create and validate the production build. |
| `npm run start` | Start the compiled production server. |
| `npm run lint` | Run the configured Next.js lint command. |

The repository also contains lightweight test files under `src/__tests__`.
The standalone JavaScript runner can be invoked with:

```bash
node src/__tests__/run-tests.js
```

The TypeScript test files are Jest-style test specifications. If you add a
test runner, configure it for TypeScript before running those files directly.

## API reference

All protected endpoints require the `cookie_words_session` HTTP-only session
cookie created after wallet authentication.

### `GET /api/auth/nonce?address=<wallet-address>`

Creates a signature challenge containing the wallet address, a random nonce,
and a timestamp.

Response:

```json
{
  "nonce": "random-hex-value",
  "message": "Sign in to Cookie Words..."
}
```

### `POST /api/auth/verify`

Verifies the Base58-encoded Ed25519 signature and creates or loads the player.

Request body:

```json
{
  "address": "wallet-public-key",
  "signature": "base58-signature",
  "message": "challenge-message"
}
```

### `GET /api/game/new-word?mode=easy|medium|hard`

Returns an unseen word and its hint for the authenticated wallet.

```json
{
  "word": "CRUMB",
  "hint": {
    "clue": "..."
  }
}
```

### `POST /api/game/submit-result`

Records the result, updates XP and streak values, records the seen word, and
returns updated player data.

Request body:

```json
{
  "word": "CRUMB",
  "won": true,
  "attempts": 3,
  "elapsedSeconds": 42
}
```

Scoring rules:

- A win awards 20 XP.
- A loss awards 5 XP.
- A first win starts a one-day streak.
- A win on the next UTC day increments the streak.
- Playing again on the same UTC day does not double-count the streak.
- Missing one or more UTC days resets the streak to 1 on the next win.

### `GET /api/leaderboard`

Returns leaderboard entries sorted by wins and best time.

### `GET /api/market/balance`

Returns the authenticated player's crumbs and XP, plus the native balance
reported by Cookie Chain RPC.

### `POST /api/market/buy-crumbs`

Supports the following request types:

```json
{ "type": "crumb_xp" }
{ "type": "xp_cook" }
{ "type": "combo" }
{ "type": "consume_crumb", "cost": 1 }
```

The server validates the session and applies the relevant game balance update.
`consume_crumb` uses an atomic MongoDB update to prevent spending more crumbs
than the player owns.

## Data model

### `Player`

Stores the wallet address, XP, crumbs, streak information, wins, best time,
and creation date. The wallet address is unique and indexed.

### `SeenWord`

Stores a wallet address and word pair so a player does not immediately receive
the same word again. The pair has a unique compound index.

## Security notes

- Never commit `.env.local` or production secrets.
- Replace the development JWT fallback with a strong `JWT_SECRET`.
- Use HTTPS in production.
- Wallet signatures are verified server-side with TweetNaCl.
- Session cookies are HTTP-only, `SameSite=Strict`, and secure in production.
- Keep the RPC endpoint and any treasury configuration restricted to trusted
  values in deployment settings.
- Review the on-chain transaction behavior before presenting a balance check as
  a token transfer.

## Deployment

The app can be deployed to Vercel or another Next.js-compatible platform.

Typical production flow:

```bash
npm install
npm run build
npm run start
```

For Vercel:

1. Import the repository.
2. Configure `MONGODB_URI`, `JWT_SECRET`, and the Cookie Chain RPC variable.
3. Deploy the project using the Next.js preset.
4. Confirm the production domain can reach MongoDB and the Cookie Chain RPC.
5. Test wallet connection, signature authentication, a complete round, the
   leaderboard, and Market balance loading.

## Troubleshooting

### Wallet connection does not appear

Install or enable Nightly, reload the page, and confirm the browser has not
blocked wallet extension access.

### Authentication fails

Confirm the wallet address and signature are generated from the same challenge
message. Check the browser console and server logs for the failing API route.

### `401 Unauthorized`

The session cookie is missing or expired. Disconnect and reconnect the wallet,
then sign a new challenge.

### MongoDB connection errors

Check `MONGODB_URI`, ensure MongoDB is running, and verify that the deployment
environment can reach the database.

### Native balance is incorrect

Check `NEXT_PUBLIC_COOKIE_CHAIN_RPC_URL`, confirm the wallet is on Cookie Chain,
and inspect the RPC response. The application has a development/offline
fallback for balance display, so verify the RPC is reachable before relying on
the displayed value.

### A word repeats

Seen words are tracked per wallet and mode word pools wrap around after the
available words have been exhausted. Clearing a player's `SeenWord` records
will also reset that player's seen-word history.

## Project status and scope

Cookie Words is a game-first Cookie Chain cApp. It currently demonstrates:

- Nightly wallet connectivity
- Wallet signature authentication
- Cookie Chain RPC connectivity
- Native balance reads
- Persistent player progression
- Word-game interaction and feedback
- In-game resource mechanics
- Leaderboard analytics

The Market's $COOK options currently use native balance checks and update
internal game balances. They are not a replacement for a trustless token
transfer or swap program. A future on-chain version can add an explicit
transaction-building and confirmation flow using a treasury or deployed
program address.

## License

No license file is currently included. Add a license before distributing the
project outside its intended submission or development context.

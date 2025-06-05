# Waves.FM <img src="https://wallpaper.bossdaily.dev/api/favicon?c1=%23e4a853&c2=%23f45d87&c3=%2342d9e8&c4=%237b2fd1&c5=%23ff9b4a" width="36" height="36" />

[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.0-orange?style=flat-square)](https://kit.svelte.dev/)
[![Svelte](https://img.shields.io/badge/Svelte-5.0-red?style=flat-square)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

Generate beautiful animated wave visualizations from your Last.fm scrobbles in real-time. This can be used as a dynamic wallpaper or a visualizer for your music player.

![Example Visualization](/public/examples/example4.png)
![Example Visualization](/public/examples/example2.png)

## ✨ Features

- 🎵 Real-time Last.fm scrobble visualization
- 🌈 Dynamic color gradients based on album artwork
- 🎨 Two visualization modes:
  - Standard waves with dynamic colors
  - Optimized performance mode for smoother animations
- 🌗 Adaptive favicon that matches your current track
- 📱 Fully responsive design
- 🚀 Built with SvelteKit 2 and Svelte 5

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- A Last.fm API key ([Get one here](https://www.last.fm/api/account/create))
- A Last.fm account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/waves-fm.git
cd waves-fm
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
LASTFM_API_KEY="your_lastfm_api_key"
LASTFM_USERNAME="your_lastfm_username"
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see your visualization!

## 🎨 Usage

1. Visit the homepage
2. Enter your Last.fm API key and username
3. Toggle the "Use Optimized Version" switch if you want better performance
4. Click "View Visualizer" to see your current track visualization

Note, you can just go to `/optimized-waves` or `/waves` to see the visualizer directly using the api key added to the `env`.

## 🛠️ Technologies

- [SvelteKit](https://kit.svelte.dev/)
- [Svelte 5](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Neat](https://github.com/firecmsco/neat) (for the waves)
- [Last.fm API](https://www.last.fm/api)
- [Bits UI](https://github.com/huntabyte/bits-ui)
- [ColorThief](https://lokeshdhakar.com/projects/color-thief/)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LASTFM_API_KEY` | Your Last.fm API key | Yes |
| `LASTFM_USERNAME` | Default Last.fm username | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Last.fm for their excellent API
- The SvelteKit team for the amazing framework
- All contributors and users of this project

---

Made with ❤️ using SvelteKit and the Last.FM API 

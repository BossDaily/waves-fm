# Waves.FM 🌊

[![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=flat-square)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

Generate beautiful animated wave visualizations from your Last.fm scrobbles in real-time.

![Example Visualization](/public/examples/example1.png)
![Example Visualization](/public/examples/example2.png)

## ✨ Features

- 🎵 Real-time Last.fm scrobble visualization
- 🌈 Dynamic color gradients based on album artwork
- 🎨 Two visualization modes:
  - Standard waves with dynamic colors
  - Optimized performance mode for smoother animations
- 🌗 Adaptive favicon that matches your current track
- 📱 Fully responsive design
- 🚀 Built with Next.js 15 and TypeScript

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
NEXT_PUBLIC_LASTFM="your_lastfm_api_key"
NEXT_PUBLIC_LASTFM_USERS="your_lastfm_username"
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see your visualization!

## 🎨 Usage

1. Visit the homepage
2. Enter your Last.fm API key and username
3. Toggle the "Use Optimized Version" switch if you want better performance
4. Click "View Visualizer" to see your current track visualization

## 🛠️ Technologies

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Last.fm API](https://www.last.fm/api)
- [Node Vibrant](https://github.com/Vibrant-Colors/node-vibrant)
- [React Hook Form](https://react-hook-form.com/)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_LASTFM` | Your Last.fm API key | Yes |
| `NEXT_PUBLIC_LASTFM_USERS` | Default Last.fm username(s) | No |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Last.fm for their excellent API
- The Next.js team for the amazing framework
- All contributors and users of this project

---

Made with ❤️ using Next.js and Last.FM API 

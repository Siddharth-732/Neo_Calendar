
**Neo Calendar** is a premium, physically-inspired digital desk calendar built with **Next.js**, **Tailwind CSS 4**, and **Lucide React**. It combines modern anime-inspired aesthetics with the tactile feel of a traditional desk calendar, featuring realistic 3D page-flip animations and unique monthly themes.

---

## Key Features

- **Realistic 3D Page Flip**: Navigate through months with seamless forward and backward 3D animations that mimic the peeling of physical paper.
- **Dynamic Monthly Themes**: Every month features a unique curated color palette, motivational quotes, and high-quality anime-inspired landscape art.
- **Integrated Notes System**: Jot down your monthly goals or switch to specific daily notes with a simple click.
- **Physical Desk Aesthetics**: A detailed "Spiral Ring" bar, stacked page layers, and glassmorphic panels provide a premium, grounded experience.
- **Responsive Design**: optimized for a landscape "desk" view while maintaining elegance on smaller screens.

---

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: CSS 3D Transforms & Transitions
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) (Headings) & [Inter](https://fonts.google.com/specimen/Inter) (Body)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Utilities**: [date-fns](https://date-fns.org/)

---

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Siddharth-732/Neo_Calendar.git
   cd Neo_Calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Design Philosophy

Neo Calendar was designed with **physicality** and **emotional resonance** in mind. 

- **Physicality**: Most digital calendars are flat grids. Neo Calendar uses a landscape "horizontal" layout common in desk calendars, adding rings and depth to make the user feel like they are interacting with a real object on their table.
- **Aesthetic**: Borrowing from Lo-Fi and Anime background styles, the UI aims to be a peaceful companion to your productivity journey rather than just a utility.

---

## Project Structure

```text
├── app/
│   ├── layout.tsx     # Root layout with font and metadata
│   ├── page.tsx       # Core Calendar logic and 3D animations
│   └── globals.css    # Comprehensive design system and CSS animations
├── public/            # Theme images and assets
├── package.json       # Project dependencies
└── tailwind.config.ts # Styling configuration
```

---

## License

This project is licensed under the MIT License.

---

*Crafted with care for a more beautiful productivity experience.*

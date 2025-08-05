# 🛒 Walmart Product Scraper

This project automatically scrapes product data from [Walmart.com](https://www.walmart.com) using Puppeteer, and saves it in two formats:

- **`walmart-data.json`** – latest scraped data (overwritten every run)
- **`walmart-data.csv`** – log of all scraped data (appended on every run)

It is integrated with GitHub Actions to run every **Friday at 9:00 AM** and commit the updated data files to the repository.

---

## 📦 Features

- Scrapes product data like **title**, **price**, and **product link**.
- Supports **multiple Walmart product URLs**.
- Saves scraped data in both `.json` and `.csv`.
- Automatically runs weekly via **GitHub Actions** (`cron job`).
- Bypasses bot detection using `puppeteer-extra-plugin-stealth`.

---

## 🔧 Tech Stack

- **Node.js**
- **Puppeteer** & `puppeteer-extra` (with stealth plugin)
- **node-cron** (optional for local scheduled jobs)
- **GitHub Actions** for cloud automation

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/muh-atta/WalMart-Products-Details.git
cd WalMart-Products-Details

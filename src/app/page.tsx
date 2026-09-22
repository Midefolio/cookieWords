"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import styles from "@/components/landing/LandingPage.module.css";

const marketItems = [
  {
    icon: "🍪",
    title: "Crumbs",
    description: "Keep your streak alive with a little extra help.",
    detail: "40 XP each",
  },
  {
    icon: "💡",
    title: "Hints",
    description: "Unlock clever clues when the word gets tricky.",
    detail: "Spend in game",
  },
  {
    icon: "⭐",
    title: "XP boosts",
    description: "Trade $COOK for more chances to climb the board.",
    detail: "100 XP",
  },
];

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let locked = false;
    let touchStartY = 0;
    const move = (direction: number) => {
      if (locked) return;
      setActiveSection((current) => Math.max(0, Math.min(3, current + direction)));
      locked = true;
      window.setTimeout(() => {
        locked = false;
      }, 700);
    };
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 10) return;
      event.preventDefault();
      move(event.deltaY > 0 ? 1 : -1);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        move(1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        move(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        setActiveSection(0);
      } else if (event.key === "End") {
        event.preventDefault();
        setActiveSection(3);
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (event: TouchEvent) => {
      const distance = touchStartY - (event.changedTouches[0]?.clientY ?? touchStartY);
      if (Math.abs(distance) > 45) move(distance > 0 ? 1 : -1);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <main className={styles.landing}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link className={styles.wordmark} href="/" aria-label="Cookie Words home">
          <span className={styles.wordmarkCookie}>COO</span>
          <span className={styles.wordmarkDot}>·</span>
          <span className={styles.wordmarkWords}>W</span>
          <span className={styles.wordmarkCookie}>RDS</span>
        </Link>
        <div className={styles.navLinks}>
          <a href="#how-it-works" onClick={() => setActiveSection(1)}>How it works</a>
          <a href="#market" onClick={() => setActiveSection(2)}>Market</a>
          <a href="https://x.com/cookiechain" target="_blank" rel="noreferrer">
            Community <span aria-hidden="true">↗</span>
          </a>
        </div>
        <ConnectWalletButton className={styles.wallet} />
      </nav>

      <div className={styles.slides} style={{ transform: `translateY(-${activeSection * 100}%)` }}>
      <section className={`${styles.section} ${styles.hero} ${activeSection === 0 ? styles.active : ""}`} data-slide="0" aria-labelledby="hero-title">
        <div className={styles.heroPattern} aria-hidden="true" />
        <div className={styles.heroCopy}>
          <h1 id="hero-title">
            Words are
            <br />
            <em>better</em>
            <br />
            with crumbs.
          </h1>
          <p className={styles.heroText}>
            Guess the word. Stack your streak. Take the glory.
            <br className={styles.desktopBreak} /> Cookie Words is a cozy little game with a very big leaderboard.
          </p>
          <div className={styles.heroActions}>
            <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/play">
              Play now <span aria-hidden="true">→</span>
            </Link>
            <a className={styles.textLink} href="#how-it-works">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          {/* <div className={styles.heroMeta}>
            <span><i className={styles.statusDot} /> Free to play</span>
            <span>⌁ Daily puzzle</span>
            <span>✦ On Cookie Chain</span>
          </div> */}
        </div>
        <div className={styles.heroArt} aria-label="A cookie ready to play">
          <div className={styles.sticker}>Baked<br />fresh daily</div>
          <div className={styles.heroImageFrame}>
            <Image
              src="/cookie_hero.png"
              alt="A freshly baked chocolate chip cookie"
              fill
              priority
              unoptimized
              sizes="(max-width: 700px) 80vw, 45vw"
              className={styles.heroImage}
            />
          </div>
          <div className={styles.heroCaption}><span>01</span> THE DAILY BAKE <span>🍪</span></div>
        </div>
        <span className={styles.scrollHint}>Scroll to nibble <span aria-hidden="true">↓</span></span>
      </section>

      <section className={`${styles.section} ${styles.how} ${activeSection === 1 ? styles.active : ""}`} data-slide="1" id="how-it-works" aria-labelledby="how-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Simple recipe</p>
          <h2 id="how-title">Three bites<br /><em>to victory.</em></h2>
          <p>Everything you need to make your daily word habit a little more delicious.</p>
        </div>
        <div className={styles.steps}>
          <article className={`${styles.stepCard} ${styles.stepOne}`}>
            <span className={styles.cardNumber}>01</span>
            <div className={styles.stepIcon}>🔤</div>
            <h3>Guess a word</h3>
            <p>Six tries. One secret word. Every day brings a new bake.</p>
            <span className={styles.cardArrow}>↗</span>
          </article>
          <article className={`${styles.stepCard} ${styles.stepTwo}`}>
            <span className={styles.cardNumber}>02</span>
            <div className={styles.stepIcon}>🔥</div>
            <h3>Build your streak</h3>
            <p>Come back daily, keep your flame lit, and earn XP as you go.</p>
            <span className={styles.cardArrow}>↗</span>
          </article>
          <article className={`${styles.stepCard} ${styles.stepThree}`}>
            <span className={styles.cardNumber}>03</span>
            <div className={styles.stepIcon}>🏆</div>
            <h3>Own the board</h3>
            <p>Share your score, chase the leaderboard, and become a legend.</p>
            <span className={styles.cardArrow}>↗</span>
          </article>
        </div>
      </section>

      <section className={`${styles.section} ${styles.market} ${activeSection === 2 ? styles.active : ""}`} data-slide="2" id="market" aria-labelledby="market-title">
        <div className={styles.marketImage}>
          <Image
            src="/crumbs.gif"
            alt="A cookie and a warm drink for a relaxing break"
            fill
            unoptimized
            sizes="(max-width: 700px) 100vw, 42vw"
            className={styles.relaxImage}
          />
          <div className={styles.imageStamp}>TAKE<br />A BREAK</div>
        </div>
        <div className={styles.marketCopy}>
          <p className={styles.eyebrow}>The crumb market</p>
          <h2 id="market-title">A little help<br /><em>never hurt.</em></h2>
          <p className={styles.marketLead}>Your streak is yours. Your strategy is yours. Spend your crumbs when you need a nudge — never when you don’t.</p>
          <div className={styles.marketGrid}>
            {marketItems.map((item) => (
              <Link className={styles.marketCard} href="/play" key={item.title}>
                <span className={styles.marketIcon}>{item.icon}</span>
                <span className={styles.marketCardText}>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                  <b>{item.detail} <span aria-hidden="true">↗</span></b>
                </span>
              </Link>
            ))}
          </div>
          <Link className={`${styles.button} ${styles.buttonDark}`} href="/play">Open the market <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className={`${styles.section} ${styles.final} ${activeSection === 3 ? styles.active : ""}`} data-slide="3" aria-labelledby="final-title">
        <div className={styles.finalPattern} aria-hidden="true" />
        <div className={styles.finalContent}>
          <p className={styles.eyebrow}>Your next daily ritual</p>
          <h2 id="final-title">Ready to get<br /><em>baked?</em></h2>
          <p>One puzzle. Six guesses. Infinite bragging rights.</p>
          <Link className={`${styles.button} ${styles.buttonPrimary}`} href="/play">Start playing <span aria-hidden="true">→</span></Link>
        </div>
        <div className={styles.footerLine}>
          <span>© 2025 Cookie Words</span>
          <span>Made with <span aria-hidden="true">🍪</span> on Cookie Chain</span>
          <a href="https://x.com/cookiechain" target="_blank" rel="noreferrer">Join the community ↗</a>
        </div>
      </section>
      </div>
    </main>
  );
}

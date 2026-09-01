import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { portfolio } from "../data/portfolio";

const GAME_DURATION = 20;
const HITS_TO_WIN = 12;
const TARGET_SIZE = 58;

function makeTarget() {
  return {
    x: 8 + Math.random() * 84,
    y: 10 + Math.random() * 78,
    size: TARGET_SIZE * (0.78 + Math.random() * 0.4),
  };
}

export default function GameSection() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(makeTarget);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    if (!running || won || lost) return undefined;

    const timer = window.setInterval(() => {
      setTime((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRunning(false);
          setLost(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [running, won, lost]);

  const start = () => {
    setRunning(true);
    setTime(GAME_DURATION);
    setScore(0);
    setTarget(makeTarget());
    setWon(false);
    setLost(false);
  };

  const hit = () => {
    if (!running) return;

    setScore((current) => {
      const next = current + 1;
      if (next >= HITS_TO_WIN) {
        setRunning(false);
        setWon(true);
      }
      return next;
    });

    setTarget(makeTarget());
  };

  return (
    <section className="game-section" id="game">
      <div className="section-heading-v5">
        <div>
          <p className="section-kicker">05 / Bonus round</p>
          <h2>Catch the <em>packets.</em></h2>
        </div>
        <p>A small playable detour. Start the stream, catch 12 packets, and unlock the contact ticket.</p>
      </div>

      <div className="game-panel">
        <div className="game-topbar">
          <div><span>TIME</span><strong>{time}s</strong></div>
          <div><span>SCORE</span><strong>{String(score).padStart(2, "0")} / {HITS_TO_WIN}</strong></div>
          <button onClick={start}>{running ? "RESTART" : "START"}</button>
        </div>

        <div className="game-arena">
          <div className="game-grid" />

          {running && (
            <button
              className="packet"
              onClick={hit}
              aria-label="Catch packet"
              style={{ left: `${target.x}%`, top: `${target.y}%`, width: target.size, height: target.size }}
            >
              +
            </button>
          )}

          {!running && !won && !lost && (
            <div className="game-state">
              <strong>READY?</strong>
              <span>Catch every packet before the clock hits zero.</span>
              <button onClick={start}>START RUN</button>
            </div>
          )}

          {lost && (
            <div className="game-state">
              <strong>TIMEOUT</strong>
              <span>{score} packets secured.</span>
              <button onClick={start}>RUN AGAIN</button>
            </div>
          )}

          {won && (
            <div className="game-state is-success">
              <strong>ACCESS GRANTED</strong>
              <span>Packet stream secured. Ticket unlocked.</span>
            </div>
          )}
        </div>

        {won && (
          <div className="meeting-ticket">
            <span>TICKET / 001</span>
            <h3>Congratulations.</h3>
            <p>You get a ticket to meet Saeid Kabak.</p>
            <div>
              <a href={`mailto:${portfolio.email}`}>Email <ExternalLink size={14} /></a>
              <a href={portfolio.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={14} /></a>
              <a href={portfolio.github} target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

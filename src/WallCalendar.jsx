"use client";

import { useState } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const DAYS_HEADER = ["MON","TUE","WED","THU","FRI","SAT","SUN"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year, month) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

function buildGrid(year, month) {
  const total = getDaysInMonth(year, month);
  const startOffset = getFirstDayOfWeek(year, month);
  const grid = [];
  let day = 1;

  const prevTotal = getDaysInMonth(year, month - 1);
  for (let i = startOffset - 1; i >= 0; i--) {
    grid.push({ day: prevTotal - i, current: false });
  }

  while (day <= total) {
    grid.push({ day: day++, current: true });
  }

  let next = 1;
  while (grid.length % 7 !== 0) {
    grid.push({ day: next++, current: false });
  }

  return grid;
}

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const grid = buildGrid(year, month);
  const weeks = [];
  for (let i = 0; i < grid.length; i += 7) weeks.push(grid.slice(i, i + 7));

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          min-height: 100vh;
          background: #e8eaed;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Barlow', sans-serif;
        }

        .page-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 40px 20px;
          background: #dde0e5;
        }

        /* ── Calendar card ─────────────────────────────────────── */
        .calendar {
          width: 380px;
          background: #fff;
          border-radius: 4px;
          box-shadow:
            0 2px 6px rgba(0,0,0,.12),
            0 8px 28px rgba(0,0,0,.18),
            0 20px 60px rgba(0,0,0,.10);
          overflow: hidden;
          position: relative;
        }

        /* ── Spiral binding ─────────────────────────────────────── */
        .binding {
          position: absolute;
          top: -14px;
          left: 0; right: 0;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          z-index: 10;
        }
        .coil {
          width: 16px;
          height: 22px;
          border: 2.5px solid #8a8e94;
          border-radius: 50%;
          background: linear-gradient(135deg, #c8ccd2 0%, #9da1a7 100%);
        }

        /* ── Photo section ──────────────────────────────────────── */
        .photo-area {
          position: relative;
          height: 210px;
          overflow: hidden;
          background: linear-gradient(160deg, #b0bec5 0%, #78909c 50%, #546e7a 100%);
        }
        .photo-area img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        /* Blue chevron overlay at bottom */
        .photo-chevron {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          pointer-events: none;
        }

        /* ── Month/year badge ───────────────────────────────────── */
        .month-badge {
          position: absolute;
          right: 20px;
          bottom: 8px;
          text-align: right;
          line-height: 1;
        }
        .month-badge .yr {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 300;
          color: #fff;
          letter-spacing: 3px;
          display: block;
          margin-bottom: 2px;
        }
        .month-badge .mn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          letter-spacing: 2px;
          display: block;
          text-transform: uppercase;
        }

        /* ── Nav arrows ─────────────────────────────────────────── */
        .nav-arrows {
          position: absolute;
          right: 20px;
          top: 16px;
          display: flex;
          gap: 6px;
          z-index: 5;
        }
        .nav-btn {
          width: 24px; height: 24px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,.25);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s;
          backdrop-filter: blur(4px);
        }
        .nav-btn:hover { background: rgba(255,255,255,.45); }

        /* ── Body ───────────────────────────────────────────────── */
        .cal-body {
          padding: 14px 18px 20px;
          background: #fff;
        }

        /* ── Notes ──────────────────────────────────────────────── */
        .notes-section {
          margin-bottom: 12px;
        }
        .notes-label {
          font-size: 9px;
          font-weight: 500;
          color: #9e9e9e;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .notes-lines {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .notes-line {
          height: 1px;
          background: #e0e0e0;
          width: 100%;
        }

        /* ── Grid ───────────────────────────────────────────────── */
        .cal-grid {
          width: 100%;
          border-collapse: collapse;
        }
        .cal-grid th {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #bdbdbd;
          text-align: center;
          padding: 0 0 6px;
        }
        .cal-grid td {
          text-align: center;
          padding: 3px 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #424242;
          cursor: default;
          position: relative;
        }
        .cal-grid td.other-month {
          color: #d0d0d0;
        }
        .cal-grid td.weekend {
          color: #1976d2;
          font-weight: 700;
        }
        .cal-grid td.other-month.weekend {
          color: #90caf9;
        }
        .cal-grid td.today .day-num {
          background: #1565c0;
          color: #fff;
          border-radius: 50%;
          width: 22px; height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Placeholder photo gradient ─────────────────────────── */
        .photo-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(160deg,
            #b0bec5 0%,
            #78909c 40%,
            #546e7a 70%,
            #37474f 100%
          );
          display: flex; align-items: center; justify-content: center;
        }
        .photo-placeholder svg {
          opacity: .15;
        }
      `}</style>

      <div className="page-wrap">
        <div className="calendar">
          <div className="binding">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="coil" />
            ))}
          </div>

          <div className="photo-area">
            <div className="photo-placeholder">
              <svg width="280" height="140" viewBox="0 0 280 140" fill="none">
                <polygon points="60,140 160,20 260,140" fill="#fff" />
                <polygon points="0,140 90,50 180,140" fill="#fff" opacity=".6" />
              </svg>
            </div>

            <div className="nav-arrows">
              <button className="nav-btn" onClick={prev}>‹</button>
              <button className="nav-btn" onClick={next}>›</button>
            </div>

            <svg
              className="photo-chevron"
              viewBox="0 0 380 60"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon points="0,60 0,30 120,60" fill="#1565c0" />
              <polygon points="0,60 0,30 120,60 80,60" fill="#1976d2" />
              <polygon points="380,60 380,10 220,60" fill="#1565c0" />
              <polygon points="380,60 380,10 220,60 280,60" fill="#1976d2" />
              <rect x="0" y="52" width="380" height="8" fill="#1565c0" />
            </svg>

            <div className="month-badge">
              <span className="yr">{year}</span>
              <span className="mn">{MONTHS[month]}</span>
            </div>
          </div>

          <div className="cal-body">
            <div className="notes-section">
              <p className="notes-label">Notes</p>
              <div className="notes-lines">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="notes-line" />
                ))}
              </div>
            </div>

            <table className="cal-grid">
              <thead>
                <tr>
                  {DAYS_HEADER.map(d => <th key={d}>{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((cell, di) => {
                      const isWeekend = di >= 5; 
                      const isToday =
                        cell.current &&
                        cell.day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                      let cls = "";
                      if (!cell.current) cls += " other-month";
                      if (isWeekend) cls += " weekend";
                      if (isToday) cls += " today";

                      return (
                        <td key={di} className={cls.trim()}>
                          <span className="day-num">{cell.day}</span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

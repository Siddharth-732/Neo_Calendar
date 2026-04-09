'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';

const THEMES = [
  { month: 'January',  accent: '#0e7490', image: '/april.jpg', quote: '"Snow is the silent companion of the determined soul."' },
  { month: 'February', accent: '#be185d', image: '/may.jpg',   quote: '"In the garden of friendship, the plum blossom blooms first."' },
  { month: 'March',    accent: '#15803d', image: '/june.jpg',  quote: '"Spring awakens the fire that burns within the heart."' },
  { month: 'April',    accent: '#0f9d8e', image: '/april.jpg', quote: '"If you were told to believe, you shouldn\'t have to think of anything else!"' },
  { month: 'May',      accent: '#dc2626', image: '/may.jpg',   quote: '"You are so lucky to have such an easy head to say that this is easy."' },
  { month: 'June',     accent: '#d97706', image: '/june.jpg',  quote: '"Even if you stop in your tracks and cower, you\'re not stopping the flow of time."' },
  { month: 'July',     accent: '#ea580c', image: '/april.jpg', quote: '"The heat of battle is nothing compared to the warmth of a steady spirit."' },
  { month: 'August',   accent: '#ca8a04', image: '/may.jpg',   quote: '"Let your conviction be your shield under the summer sun."' },
  { month: 'September',accent: '#7c3aed', image: '/june.jpg',  quote: '"The harvest of strength begins with the seeds of discipline."' },
  { month: 'October',  accent: '#b45309', image: '/april.jpg', quote: '"As leaves fall, the true character of the branch is revealed."' },
  { month: 'November', accent: '#475569', image: '/may.jpg',   quote: '"The cold wind only strengthens the flame that refuses to die."' },
  { month: 'December', accent: '#1d4ed8', image: '/june.jpg',  quote: '"The end of the journey is just the bridge to the next beginning."' },
];

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type FlipState = 'idle' | 'flipping-forward' | 'flipping-backward';

// ─── Static calendar snapshot (non-interactive, used as the page underneath) ───
function CalendarSnapshot({ date }: { date: Date }) {
  const monthIdx = date.getMonth();
  const year = date.getFullYear();
  const theme = THEMES[monthIdx];

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const days: { num: number | null; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) days.push({ num: null, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ num: i, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) days.push({ num: null, isCurrentMonth: false });
    return days;
  }, [monthIdx, year]);

  return (
    <>
      {/* Hero */}
      <div className="calendar-hero">
        <div className="hero-gradient" />
        <Image
          src={theme.image}
          alt={theme.month}
          fill
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="object-cover"
          style={{ objectPosition: 'center 20%' }}
        />
        <div className="hero-overlay">
          <h1 className="hero-month" style={{ color: theme.accent, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
            {theme.month}
          </h1>
          <span className="hero-year">{year}</span>
        </div>
      </div>

      {/* Bottom */}
      <div className="calendar-bottom">
        {/* Notes col */}
        <div className="calendar-notes-col">
          <div className="notes-panel">
            <div className="notes-panel-header">
              <div className="notes-panel-title">
                <span className="notes-pin" style={{ background: theme.accent }} />
                <span style={{ color: theme.accent }}>{theme.month} Notes</span>
              </div>
            </div>
            <div className="notes-body" style={{ borderColor: `${theme.accent}35` }}>
              <div className="notes-placeholder-lines">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="notes-line" style={{ background: `${theme.accent}20` }} />
                ))}
              </div>
            </div>
          </div>
          <div className="quote-section">
            <p style={{ borderColor: theme.accent }}>{theme.quote}</p>
          </div>
        </div>

        {/* Grid col */}
        <div className="calendar-grid-col">
          <div className="month-year-header">
            <div className="flex flex-col">
              <span className="grid-month-label" style={{ color: theme.accent }}>{theme.month}</span>
              <span className="year-num">{year}</span>
            </div>
          </div>
          <div className="days-grid">
            {WEEK_DAYS.map(day => (
              <div key={day} className="day-label" style={{ color: day === 'SUN' ? theme.accent : '#666' }}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const isSun = i % 7 === 0;
              const todayObj = new Date();
              const isToday = day.num === todayObj.getDate()
                && monthIdx === todayObj.getMonth()
                && year === todayObj.getFullYear();
              return (
                <div
                  key={day.num ? `b-${day.num}-${monthIdx}` : `b-empty-${i}`}
                  className={`day-num ${!day.isCurrentMonth ? 'muted' : ''}`}
                  style={{
                    color: isToday ? 'white' : (isSun ? theme.accent : (day.isCurrentMonth ? '#333' : '#ccc')),
                    background: isToday ? `${theme.accent}80` : 'transparent',
                    fontWeight: isToday ? '700' : '400',
                    opacity: day.isCurrentMonth ? 1 : 0.3,
                  }}
                >
                  {day.num}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main calendar page ────────────────────────────────────────────────────────
export default function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [displayDate, setDisplayDate] = useState(today);
  const [backdropDate, setBackdropDate] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [flipState, setFlipState] = useState<FlipState>('idle');
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const monthIdx = displayDate.getMonth();
  const year = displayDate.getFullYear();
  const theme = THEMES[monthIdx];

  const noteKey = useMemo(() => {
    if (selectedDate === null) return `memo-${year}-${monthIdx}`;
    return `note-${year}-${monthIdx}-${selectedDate}`;
  }, [year, monthIdx, selectedDate]);

  const activeNote = notes[noteKey] || '';
  const handleNoteChange = (val: string) => setNotes(prev => ({ ...prev, [noteKey]: val }));

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const days: { num: number | null; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) days.push({ num: null, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ num: i, isCurrentMonth: true });
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++) days.push({ num: null, isCurrentMonth: false });
    return days;
  }, [monthIdx, year]);

  const changeMonth = useCallback((offset: number) => {
    if (flipState !== 'idle') return;
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);

    if (offset > 0) {
      // ── FORWARD: top page lifts once (0→90deg) and disappears ──
      // Backdrop (next month) is already visible beneath.
      setBackdropDate(nextDate);
      setFlipState('flipping-forward');

      // After animation finishes (~420ms): swap content + clear in one batch.
      // Element is edge-on (invisible) at 90deg so the snap back to 0deg is seamless.
      flipTimer.current = setTimeout(() => {
        setDisplayDate(nextDate);
        setCurrentDate(nextDate);
        setSelectedDate(null);
        setBackdropDate(null);
        setFlipState('idle');
      }, 430);

    } else {
      // ── BACKWARD: prev month page sweeps over current month ──
      // 1. Keep current month as backdrop (stays visible while prev month sweeps in)
      setBackdropDate(currentDate);
      // 2. Immediately update active page to prev month (it starts hidden at -90deg)
      setDisplayDate(nextDate);
      setCurrentDate(nextDate);
      setSelectedDate(null);

      // 3. One frame later — add animation class (page sweeps from behind over the backdrop)
      flipTimer.current = setTimeout(() => {
        setFlipState('flipping-backward');
      }, 16);

      // 4. After full animation, clear backdrop
      flipTimer.current = setTimeout(() => {
        setBackdropDate(null);
        setFlipState('idle');
      }, 16 + 700);
    }
  }, [flipState, currentDate]);

  const rings = Array.from({ length: 42 }).map((_, i) => i);
  const flipClass = flipState === 'flipping-forward' ? 'flip-forward'
    : flipState === 'flipping-backward' ? 'flip-backward' : '';

  return (
    <main className="calendar-container">
      <div className="calendar-card">

        {/* ── Rings Bar ── */}
        <div className="rings-bar" style={{ backgroundImage: `url(${theme.image})` }}>
          <div className="rings-bar-overlay" />
          <div className="spiral">
            {rings.map((i) => <div key={i} className="spiral-ring" />)}
          </div>
        </div>

        {/* ── Flip Stage ── */}
        <div className={`flip-stage${flipState === 'flipping-backward' ? ' going-backward' : ''}`}>

          {/* Backdrop: pre-rendered destination/origin page, always sits below */}
          {backdropDate && (
            <div className="page-backdrop">
              <CalendarSnapshot date={backdropDate} />
            </div>
          )}

          {/* Active page: the one that animates */}
          <div className={`calendar-main ${flipClass}`}>

            {/* Hero Image */}
            <div className="calendar-hero">
              <div className="hero-gradient" />
              <Image
                src={theme.image}
                alt={theme.month}
                fill
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
                priority
              />
              <div className="hero-overlay">
                <h1
                  className="hero-month"
                  style={{ color: theme.accent, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
                >
                  {theme.month}
                </h1>
                <span className="hero-year">{year}</span>
              </div>
            </div>

            {/* Bottom: Notes + Grid */}
            <div className="calendar-bottom">

              {/* Notes Column */}
              <div className="calendar-notes-col">
                <div className="notes-panel">
                  <div className="notes-panel-header">
                    <div className="notes-panel-title">
                      <span className="notes-pin" style={{ background: theme.accent }} />
                      <span style={{ color: theme.accent }}>
                        {selectedDate ? `${theme.month} ${selectedDate} — Note` : `${theme.month} Notes`}
                      </span>
                    </div>
                    <div className="notes-panel-actions">
                      {selectedDate && (
                        <button
                          onClick={() => setSelectedDate(null)}
                          className="notes-back-btn"
                          style={{ color: theme.accent, borderColor: `${theme.accent}50` }}
                        >
                          ← Month
                        </button>
                      )}
                      <span className="notes-char-count">{activeNote.length}/500</span>
                    </div>
                  </div>
                  <div className="notes-body" style={{ borderColor: `${theme.accent}35` }}>
                    <textarea
                      id="monthly-notes-textarea"
                      className="notes-input"
                      placeholder={
                        selectedDate
                          ? `Quick note for ${theme.month} ${selectedDate}…`
                          : `Jot down goals, reminders, or anything important for ${theme.month}…`
                      }
                      value={activeNote}
                      maxLength={500}
                      onChange={(e) => handleNoteChange(e.target.value)}
                    />
                    {!activeNote && (
                      <div className="notes-placeholder-lines">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="notes-line" style={{ background: `${theme.accent}25` }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="quote-section">
                  <p style={{ borderColor: theme.accent }}>{theme.quote}</p>
                </div>
              </div>

              {/* Calendar Grid Column */}
              <div className="calendar-grid-col">
                <div className="month-year-header">
                  <div className="flex flex-col">
                    <span className="grid-month-label" style={{ color: theme.accent }}>{theme.month}</span>
                    <span className="year-num">{year}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => changeMonth(-1)} className="nav-arrow" disabled={flipState !== 'idle'}>&larr;</button>
                    <button onClick={() => changeMonth(1)} className="nav-arrow" disabled={flipState !== 'idle'}>&rarr;</button>
                  </div>
                </div>

                <div className="days-grid">
                  {WEEK_DAYS.map(day => (
                    <div key={day} className="day-label" style={{ color: day === 'SUN' ? theme.accent : '#666' }}>
                      {day}
                    </div>
                  ))}
                  {calendarDays.map((day, i) => {
                    const isSun = i % 7 === 0;
                    const todayObj = new Date();
                    const isToday = day.num === todayObj.getDate()
                      && monthIdx === todayObj.getMonth()
                      && year === todayObj.getFullYear();
                    const isSelected = selectedDate === day.num && day.isCurrentMonth;
                    return (
                      <div
                        key={day.num ? `${day.num}-${monthIdx}` : `empty-${i}`}
                        className={`day-num ${!day.isCurrentMonth ? 'muted' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => day.num && setSelectedDate(day.num === selectedDate ? null : day.num)}
                        style={{
                          color: isSelected ? 'white' : (isToday ? 'white' : (isSun ? theme.accent : (day.isCurrentMonth ? '#333' : '#ccc'))),
                          background: isSelected ? theme.accent : (isToday ? `${theme.accent}80` : 'transparent'),
                          cursor: day.num ? 'pointer' : 'default',
                          fontWeight: (isToday || isSelected) ? '700' : '400',
                          opacity: day.isCurrentMonth ? 1 : 0.3,
                          boxShadow: isSelected ? `0 4px 12px ${theme.accent}40` : 'none',
                        }}
                      >
                        {day.num}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Stacked Pages Effect */}
        <div className="pages-stack">
          <div className="page-layer page-layer-3" />
          <div className="page-layer page-layer-2" />
          <div className="page-layer page-layer-1" />
        </div>

      </div>
    </main>
  );
}

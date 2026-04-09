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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}
function daysBetween(a: Date, b: Date) {
  return Math.round(Math.abs(b.getTime() - a.getTime()) / 86_400_000);
}
function fmtDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Static snapshot (backdrop during flip) ───────────────────────────────────
function CalendarSnapshot({ date }: { date: Date }) {
  const monthIdx = date.getMonth();
  const year = date.getFullYear();
  const theme = THEMES[monthIdx];

  const calendarDays = useMemo(() => {
    const firstDay    = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const days: { num: number | null; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < firstDay; i++)     days.push({ num: null, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ num: i,    isCurrentMonth: true  });
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++)    days.push({ num: null, isCurrentMonth: false });
    return days;
  }, [monthIdx, year]);

  return (
    <>
      <div className="calendar-hero">
        <div className="hero-gradient" />
        <Image src={theme.image} alt={theme.month} fill
          sizes="(max-width: 1100px) 100vw, 1100px"
          className="object-cover" style={{ objectPosition: 'center 20%' }} />
        <div className="hero-overlay">
          <h1 className="hero-month" style={{ color: theme.accent, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
            {theme.month}
          </h1>
          <span className="hero-year">{year}</span>
        </div>
      </div>
      <div className="calendar-bottom">
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
        <div className="calendar-grid-col">
          <div className="month-year-header">
            <div className="flex flex-col">
              <span className="grid-month-label" style={{ color: theme.accent }}>{theme.month}</span>
              <span className="year-num">{year}</span>
            </div>
          </div>
          <div className="days-grid">
            {WEEK_DAYS.map(d => (
              <div key={d} className="day-label" style={{ color: d === 'SUN' ? theme.accent : '#666' }}>{d}</div>
            ))}
            {calendarDays.map((day, i) => {
              const isSun    = i % 7 === 0;
              const todayObj = new Date();
              const isToday  = !!day.num && day.isCurrentMonth &&
                day.num === todayObj.getDate() &&
                monthIdx === todayObj.getMonth() &&
                year     === todayObj.getFullYear();
              return (
                <div
                  key={day.num ? `b-${day.num}-${monthIdx}` : `b-empty-${i}`}
                  className={`day-num range-cell ${!day.isCurrentMonth ? 'muted' : ''}`}
                  style={{ opacity: day.isCurrentMonth ? 1 : 0.3 }}
                >
                  <span className="day-circle" style={{ background: isToday ? `${theme.accent}90` : 'transparent' }} />
                  <span className="day-text" style={{
                    color: isToday ? '#fff' : isSun ? theme.accent : day.isCurrentMonth ? '#333' : '#ccc',
                    fontWeight: isToday ? '700' : '400',
                  }}>
                    {day.num}
                  </span>
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
  const [currentDate,  setCurrentDate]  = useState(today);
  const [displayDate,  setDisplayDate]  = useState(today);
  const [backdropDate, setBackdropDate] = useState<Date | null>(null);
  const [notes,        setNotes]        = useState<Record<string, string>>({});
  const [flipState,    setFlipState]    = useState<FlipState>('idle');
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Range selection state ──────────────────────────────────────────────────
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [rangeEnd,   setRangeEnd]   = useState<Date | null>(null);
  const [hoverDate,  setHoverDate]  = useState<Date | null>(null);

  const monthIdx = displayDate.getMonth();
  const year     = displayDate.getFullYear();
  const theme    = THEMES[monthIdx];

  // Note key: uses rangeStart day if it's visible in this month
  const noteKey = useMemo(() => {
    if (rangeStart &&
        rangeStart.getMonth()    === monthIdx &&
        rangeStart.getFullYear() === year)
      return `note-${year}-${monthIdx}-${rangeStart.getDate()}`;
    return `memo-${year}-${monthIdx}`;
  }, [year, monthIdx, rangeStart]);

  const activeNote      = notes[noteKey] || '';
  const handleNoteChange = (val: string) => setNotes(prev => ({ ...prev, [noteKey]: val }));

  const calendarDays = useMemo(() => {
    const firstDay    = new Date(year, monthIdx, 1).getDay();
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const days: { num: number | null; isCurrentMonth: boolean }[] = [];
    for (let i = 0; i < firstDay; i++)     days.push({ num: null, isCurrentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) days.push({ num: i,    isCurrentMonth: true  });
    const remaining = 42 - days.length;
    for (let i = 0; i < remaining; i++)    days.push({ num: null, isCurrentMonth: false });
    return days;
  }, [monthIdx, year]);

  // ── Click: 3-state cycle (start → end → reset) ────────────────────────────
  const handleDayClick = useCallback((num: number | null) => {
    if (!num) return;
    const clicked = new Date(year, monthIdx, num);

    if (!rangeStart || rangeEnd) {
      // Fresh start
      setRangeStart(clicked);
      setRangeEnd(null);
      setHoverDate(null);
    } else {
      // Complete range
      if (sameDay(clicked, rangeStart)) {
        setRangeStart(null);
        return;
      }
      if (clicked < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(clicked);
      } else {
        setRangeEnd(clicked);
      }
      setHoverDate(null);
    }
  }, [year, monthIdx, rangeStart, rangeEnd]);

  // Effective end used for hover preview
  const effectiveEnd = rangeEnd ?? hoverDate;

  // Notes panel title
  const rangeLabel = useMemo(() => {
    if (rangeStart && rangeEnd) {
      const n = daysBetween(rangeStart, rangeEnd);
      return `${fmtDate(rangeStart)} → ${fmtDate(rangeEnd)} (${n} day${n !== 1 ? 's' : ''})`;
    }
    if (rangeStart) return `${fmtDate(rangeStart)} — pick end date`;
    return `${theme.month} Notes`;
  }, [rangeStart, rangeEnd, theme.month]);

  // ── Month change with flip animation ──────────────────────────────────────
  const changeMonth = useCallback((offset: number) => {
    if (flipState !== 'idle') return;
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);

    if (offset > 0) {
      setBackdropDate(nextDate);
      setFlipState('flipping-forward');
      flipTimer.current = setTimeout(() => {
        setDisplayDate(nextDate);
        setCurrentDate(nextDate);
        setBackdropDate(null);
        setFlipState('idle');
      }, 430);
    } else {
      setBackdropDate(currentDate);
      setDisplayDate(nextDate);
      setCurrentDate(nextDate);
      flipTimer.current = setTimeout(() => setFlipState('flipping-backward'), 16);
      flipTimer.current = setTimeout(() => {
        setBackdropDate(null);
        setFlipState('idle');
      }, 716);
    }
  }, [flipState, currentDate]);

  const rings    = Array.from({ length: 42 }).map((_, i) => i);
  const flipClass = flipState === 'flipping-forward'  ? 'flip-forward'
    : flipState === 'flipping-backward' ? 'flip-backward' : '';

  return (
    <main className="calendar-container">
      <div className="calendar-card">

        {/* Rings Bar */}
        <div className="rings-bar" style={{ backgroundImage: `url(${theme.image})` }}>
          <div className="rings-bar-overlay" />
          <div className="spiral">
            {rings.map(i => <div key={i} className="spiral-ring" />)}
          </div>
        </div>

        {/* Flip Stage */}
        <div className={`flip-stage${flipState === 'flipping-backward' ? ' going-backward' : ''}`}>

          {backdropDate && (
            <div className="page-backdrop">
              <CalendarSnapshot date={backdropDate} />
            </div>
          )}

          <div className={`calendar-main ${flipClass}`}>

            {/* Hero */}
            <div className="calendar-hero">
              <div className="hero-gradient" />
              <Image
                src={theme.image} alt={theme.month} fill priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className="object-cover"
                style={{ objectPosition: 'center 20%' }}
              />
              <div className="hero-overlay">
                <h1 className="hero-month"
                  style={{ color: theme.accent, textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}>
                  {theme.month}
                </h1>
                <span className="hero-year">{year}</span>
              </div>
            </div>

            {/* Bottom: Notes + Grid */}
            <div className="calendar-bottom">

              {/* ── Notes Column ── */}
              <div className="calendar-notes-col">
                <div className="notes-panel">
                  <div className="notes-panel-header">
                    <div className="notes-panel-title">
                      <span className="notes-pin" style={{ background: theme.accent }} />
                      <span style={{ color: theme.accent, fontSize: '0.76rem', fontWeight: 600 }}>
                        {rangeLabel}
                      </span>
                    </div>
                    <div className="notes-panel-actions">
                      {(rangeStart || rangeEnd) && (
                        <button
                          className="notes-back-btn"
                          style={{ color: theme.accent, borderColor: `${theme.accent}50` }}
                          onClick={() => { setRangeStart(null); setRangeEnd(null); setHoverDate(null); }}
                        >
                          ✕ Clear
                        </button>
                      )}
                      <span className="notes-char-count">{activeNote.length}/500</span>
                    </div>
                  </div>
                  <div className="notes-body" style={{ borderColor: `${theme.accent}35` }}>
                    <textarea
                      id="monthly-notes-textarea"
                      className="notes-input"
                      value={activeNote}
                      maxLength={500}
                      onChange={e => handleNoteChange(e.target.value)}
                      placeholder={
                        rangeStart && rangeEnd
                          ? `Notes for ${fmtDate(rangeStart)} – ${fmtDate(rangeEnd)}…`
                          : rangeStart
                            ? `Notes for ${fmtDate(rangeStart)}…`
                            : `Jot down goals or reminders for ${theme.month}…`
                      }
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

              {/* ── Calendar Grid ── */}
              <div className="calendar-grid-col">
                <div className="month-year-header">
                  <div className="flex flex-col">
                    <span className="grid-month-label" style={{ color: theme.accent }}>{theme.month}</span>
                    <span className="year-num">{year}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="nav-arrow" disabled={flipState !== 'idle'} onClick={() => changeMonth(-1)}>&larr;</button>
                    <button className="nav-arrow" disabled={flipState !== 'idle'} onClick={() => changeMonth(1)}>&rarr;</button>
                  </div>
                </div>

                <div className="days-grid">
                  {/* Week day headers */}
                  {WEEK_DAYS.map(d => (
                    <div key={d} className="day-label"
                      style={{ color: d === 'SUN' ? theme.accent : '#666' }}>
                      {d}
                    </div>
                  ))}

                  {/* Day cells */}
                  {calendarDays.map((day, i) => {
                    if (!day.num) return <div key={`empty-${i}`} className="day-num range-cell muted" />;

                    const cellDate = new Date(year, monthIdx, day.num);
                    const isToday  = sameDay(cellDate, new Date());
                    const isSun    = i % 7 === 0;

                    // Range membership
                    const isStart = !!rangeStart && sameDay(cellDate, rangeStart);
                    const isEnd   = !!rangeEnd   && sameDay(cellDate, rangeEnd);

                    const [lo, hi] = (rangeStart && effectiveEnd)
                      ? rangeStart <= effectiveEnd
                        ? [rangeStart, effectiveEnd]
                        : [effectiveEnd, rangeStart]
                      : [null, null];

                    const isInRange      = !!(lo && hi && cellDate > lo && cellDate < hi);
                    const isHoverEnd     = !!(rangeStart && !rangeEnd && hoverDate && sameDay(cellDate, hoverDate));
                    const isHoverInRange = !!(rangeStart && !rangeEnd && lo && hi && cellDate > lo && cellDate < hi);

                    // Strip CSS class
                    const stripClass = isStart       ? 'strip-right'
                      : isEnd         ? 'strip-left'
                      : isInRange     ? 'strip-full'
                      : isHoverInRange ? 'strip-hover'
                      : isHoverEnd    ? 'strip-hover-end'
                      : '';

                    // Circle color
                    const circleColor = (isStart || isEnd) ? theme.accent
                      : isHoverEnd ? `${theme.accent}70`
                      : isToday    ? `${theme.accent}95`
                      : 'transparent';

                    // Text color
                    const textColor = (isStart || isEnd || isHoverEnd || isToday)
                      ? '#fff'
                      : isSun ? theme.accent
                      : day.isCurrentMonth ? '#333' : '#bbb';

                    return (
                      <div
                        key={`${day.num}-${monthIdx}`}
                        className={`day-num range-cell ${!day.isCurrentMonth ? 'muted' : ''} ${stripClass}`}
                        style={{ opacity: day.isCurrentMonth ? 1 : 0.35, cursor: 'pointer' }}
                        onClick={() => handleDayClick(day.num)}
                        onMouseEnter={() => { if (rangeStart && !rangeEnd) setHoverDate(cellDate); }}
                        onMouseLeave={() => { if (rangeStart && !rangeEnd) setHoverDate(null); }}
                      >
                        {/* Coloured strip background */}
                        <span className="range-strip" style={{
                          background: (isHoverInRange || isHoverEnd)
                            ? `${theme.accent}15`
                            : (isInRange || isStart || isEnd)
                              ? `${theme.accent}20`
                              : 'transparent',
                        }} />
                        {/* Selection circle */}
                        <span className="day-circle" style={{
                          background: circleColor,
                          boxShadow: (isStart || isEnd) ? `0 2px 10px ${theme.accent}55` : 'none',
                        }} />
                        {/* Number */}
                        <span className="day-text" style={{
                          color: textColor,
                          fontWeight: (isStart || isEnd || isToday) ? '700' : '400',
                        }}>
                          {day.num}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Stacked Pages */}
        <div className="pages-stack">
          <div className="page-layer page-layer-3" />
          <div className="page-layer page-layer-2" />
          <div className="page-layer page-layer-1" />
        </div>

      </div>
    </main>
  );
}

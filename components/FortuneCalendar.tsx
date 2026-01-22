"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getCalendarGrid,
  getMonthName,
  getWeekDayNames,
  getScoreColorClass,
  type CalendarDay,
} from "@/lib/daily-fortune";
import { FortuneScore } from "./FortuneScore";
import { useLocale } from "@/lib/locale-context";
import { languages } from "@/lib/i18n-config";

// ============================================================================
// Types
// ============================================================================

interface FortuneCalendarProps {
  className?: string;
  initialYear?: number;
  initialMonth?: number;
  locale?: string;
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Calendar navigation header
 */
function CalendarHeader({
  year,
  month,
  locale,
  onPrevMonth,
  onNextMonth,
  onToday,
}: {
  year: number;
  month: number;
  locale: string;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}) {
  const { t } = useLocale();
  const monthName = getMonthName(year, month, locale);

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {t("calendarPage.headerTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("calendarPage.headerSubtitle")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
        >
          {t("calendarPage.todayButton")}
        </button>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-background rounded-md transition-colors"
            aria-label={t("calendarPage.prevMonthAria")}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 min-w-[140px] text-center font-medium">
            {monthName} {year}
          </span>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-background rounded-md transition-colors"
            aria-label={t("calendarPage.nextMonthAria")}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Week day header row
 */
function WeekDayHeader({ locale }: { locale: string }) {
  const dayNames = getWeekDayNames(locale, "short");

  return (
    <div className="grid grid-cols-7 gap-1 mb-2">
      {dayNames.map((day, i) => (
        <div
          key={i}
          className="text-center text-xs font-medium text-muted-foreground py-2"
        >
          {day}
        </div>
      ))}
    </div>
  );
}

/**
 * Score indicator dot
 */
function ScoreIndicator({ score }: { score: number }) {
  const colorClass = getScoreColorClass(score);

  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            i < Math.ceil(score / 2)
              ? colorClass.replace("text-", "bg-")
              : "bg-muted",
          )}
        />
      ))}
    </div>
  );
}

/**
 * Calendar day cell
 */
function DayCell({
  day,
  onClick,
  isSelected,
}: {
  day: CalendarDay;
  onClick: (day: CalendarDay) => void;
  isSelected: boolean;
}) {
  const hasHighScore = day.fortune && day.fortune.scores.overall >= 8;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(day)}
      className={cn(
        "relative p-2 min-h-[70px] md:min-h-[80px] rounded-lg border transition-all text-left flex flex-col",
        day.isCurrentMonth
          ? "bg-card hover:bg-muted/50 border-border"
          : "bg-muted/30 hover:bg-muted/50 border-transparent",
        day.isToday && "ring-2 ring-amber-500 ring-offset-2",
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
        day.isPast && day.isCurrentMonth && "opacity-75",
      )}
    >
      {/* Day number */}
      <span
        className={cn(
          "text-sm font-medium",
          day.isCurrentMonth ? "text-foreground" : "text-muted-foreground",
          day.isToday && "text-amber-600 font-bold",
        )}
      >
        {day.day}
      </span>

      {/* Fortune score indicator */}
      {day.fortune && day.isCurrentMonth && (
        <ScoreIndicator score={day.fortune.scores.overall} />
      )}

      {/* Special indicators */}
      {day.isCurrentMonth && (
        <div className="absolute top-1 right-1 flex gap-0.5">
          {hasHighScore && <Sparkles className="w-3 h-3 text-yellow-500" />}
          {day.isToday && (
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          )}
        </div>
      )}
    </motion.button>
  );
}

/**
 * Fortune detail modal/panel
 */
function FortuneDetail({
  day,
  onClose,
}: {
  day: CalendarDay;
  onClose: () => void;
}) {
  const { t, locale } = useLocale();
  if (!day.fortune) return null;

  const fortune = day.fortune;
  const dateObj = new Date(day.date);
  const formattedDate = dateObj.toLocaleDateString(
    languages[locale].hreflang,
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">
                  {day.isToday
                    ? t("dailyFortune.title")
                    : t("dailyFortune.fortuneLabel")}
                </h3>
                <p className="text-sm text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Fortune Scores */}
          <FortuneScore
            scores={fortune.scores}
            showDetails={true}
            animated={true}
          />

          {/* Fortune Message */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <p className="text-lg font-serif text-amber-900 dark:text-amber-100 leading-relaxed text-center">
              &ldquo;{fortune.fortune.message}&rdquo;
            </p>

            {/* Lucky Numbers */}
            {fortune.fortune.luckyNumbers && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-xs text-amber-700 dark:text-amber-300">
                  {t("dailyFortune.luckyNumbers")}:
                </span>
                <div className="flex gap-1">
                  {fortune.fortune.luckyNumbers.map((num, i) => (
                    <span
                      key={i}
                      className="w-6 h-6 flex items-center justify-center text-xs font-bold bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Lucky Color & Direction */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                {t("dailyFortune.luckyColor")}
              </p>
              <p className="text-sm font-medium">{fortune.luckyColor}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">
                {t("dailyFortune.luckyDirection")}
              </p>
              <p className="text-sm font-medium">{fortune.luckyDirection}</p>
            </div>
          </div>

          {/* Advice */}
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/50">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
              {t("dailyFortune.advice")}
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {fortune.advice}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Legend for calendar colors
 */
function CalendarLegend() {
  const { t } = useLocale();
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <span>{t("calendarPage.scoreLabels.excellent")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span>{t("calendarPage.scoreLabels.good")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span>{t("calendarPage.scoreLabels.fair")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span>{t("calendarPage.scoreLabels.challenging")}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
        <span>{t("calendarPage.scoreLabels.today")}</span>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * Fortune Calendar Component
 *
 * Displays a monthly calendar view with daily fortune scores.
 * Click on any day to see the detailed fortune for that date.
 */
export function FortuneCalendar({
  className,
  initialYear,
  initialMonth,
  locale: localeOverride,
}: FortuneCalendarProps) {
  const { locale } = useLocale();
  const dateLocale = localeOverride || languages[locale].hreflang;
  const now = new Date();
  const [year, setYear] = useState(initialYear ?? now.getFullYear());
  const [month, setMonth] = useState(initialMonth ?? now.getMonth());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  // Generate calendar grid
  const calendarGrid = useMemo(
    () => getCalendarGrid(year, month, true, locale),
    [year, month, locale],
  );

  // Navigation handlers
  const handlePrevMonth = useCallback(() => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  }, [month]);

  const handleNextMonth = useCallback(() => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  }, [month]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }, []);

  const handleDayClick = useCallback((day: CalendarDay) => {
    setSelectedDay(day);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedDay(null);
  }, []);

  return (
    <div
      className={cn(
        "bg-card rounded-2xl border shadow-sm p-4 md:p-6",
        className,
      )}
    >
      {/* Header */}
      <CalendarHeader
        year={year}
        month={month}
        locale={dateLocale}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Week day header */}
      <WeekDayHeader locale={dateLocale} />

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarGrid.flat().map((day, index) => (
          <DayCell
            key={`${day.date}-${index}`}
            day={day}
            onClick={handleDayClick}
            isSelected={selectedDay?.date === day.date}
          />
        ))}
      </div>

      {/* Legend */}
      <CalendarLegend />

      {/* Fortune detail modal */}
      <AnimatePresence>
        {selectedDay && (
          <FortuneDetail day={selectedDay} onClose={handleCloseDetail} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default FortuneCalendar;

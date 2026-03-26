import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import '../styles/calendar.css';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar({ tasks }) {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(null);

    const currentMonth = viewDate.getMonth();
    const currentYear = viewDate.getFullYear();

    // Calendar logic
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const prevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
        setSelectedDay(null);
    };

    const nextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedDay(null);
    };

    const goToToday = () => {
        const newToday = new Date(today.getFullYear(), today.getMonth(), 1);
        setViewDate(newToday);
        setSelectedDay(today.getDate());
    };

    // Filter tasks for the current visible month
    const monthTasks = useMemo(() => {
        return tasks.filter(task => {
            if (!task.deadline) return false;
            const d = new Date(task.deadline);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
    }, [tasks, currentMonth, currentYear]);

    // Get tasks for a specific day
    const getTasksForDay = (day) => {
        return monthTasks.filter(task => {
            const d = new Date(task.deadline);
            return d.getDate() === day;
        });
    };

    const calendarGrid = [];
    // Add padding for start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarGrid.push(<div key={`pad-${i}`} className="calendar-day-empty"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayTasks = getTasksForDay(day);
        const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
        const isSelected = selectedDay === day;

        calendarGrid.push(
            <div 
                key={day} 
                className={`calendar-day-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDay(day)}
            >
                <span className="day-number">{day}</span>
                <div className="day-indicators">
                    {dayTasks.slice(0, 3).map((task, idx) => (
                        <div 
                            key={idx} 
                            className={`task-dot ${task.priority?.toLowerCase() || 'low'}`}
                            title={task.taskName}
                        ></div>
                    ))}
                    {dayTasks.length > 3 && <span className="more-indicator">+{dayTasks.length - 3}</span>}
                </div>
            </div>
        );
    }

    const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : [];

    return (
        <div className="calendar-container modern-card">
            <div className="calendar-main">
                <div className="calendar-header-nav">
                    <div className="current-month-info">
                        <h2>{MONTHS[currentMonth]} {currentYear}</h2>
                    </div>
                    <div className="nav-controls">
                        <button className="nav-btn today-btn" onClick={goToToday}>Today</button>
                        <button className="nav-btn" onClick={prevMonth}><ChevronLeft size={20} /></button>
                        <button className="nav-btn" onClick={nextMonth}><ChevronRight size={20} /></button>
                    </div>
                </div>

                <div className="calendar-weekdays">
                    {DAYS_OF_WEEK.map(day => <div key={day} className="weekday">{day}</div>)}
                </div>

                <div className="calendar-grid">
                    {calendarGrid}
                </div>
            </div>

            <div className="calendar-side-panel">
                <div className="side-panel-header">
                    <h3>{selectedDay ? `${MONTHS[currentMonth]} ${selectedDay}, ${currentYear}` : "Select a Day"}</h3>
                    <p>{selectedDayTasks.length} {selectedDayTasks.length === 1 ? 'Task' : 'Tasks'} scheduled</p>
                </div>

                <div className="side-panel-content">
                    {selectedDayTasks.length === 0 ? (
                        <div className="empty-side-state">
                            <CalendarIcon size={40} className="empty-icon" />
                            <p>{selectedDay ? "No tasks for this day" : "Click any date to see tasks"}</p>
                        </div>
                    ) : (
                        <div className="day-task-list">
                            {selectedDayTasks.map((task, index) => (
                                <div key={index} className={`mini-task-card priority-${task.priority?.toLowerCase() || 'low'}`}>
                                    <div className="task-header">
                                        <h4>{task.taskName}</h4>
                                        <span className={`priority-badge ${task.priority?.toLowerCase() || 'low'}`}>
                                            {task.priority || 'Low'}
                                        </span>
                                    </div>
                                    <p className="task-detail">{task.detail || "No details provided"}</p>
                                    <div className="task-meta">
                                        <Clock size={12} />
                                        <span>{task.deadline}</span>
                                        <AlertCircle size={12} style={{ marginLeft: '10px' }} />
                                        <span>{task.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

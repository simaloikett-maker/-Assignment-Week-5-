import { useState } from 'react';

const spaces = ['Study Room A', 'Study Room B', 'Community Hall', 'Quiet Study Area'];

export default function BookingForm() {
  const [booking, setBooking] = useState({
    space: '',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [saved, setSaved] = useState(false);

  function updateField(event) {
    setBooking((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSaved(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form className="form-card booking-form" onSubmit={handleSubmit}>
      <label className="form-field">
        <span>Space</span>
        <select name="space" value={booking.space} onChange={updateField} required>
          <option value="">Choose a space</option>
          {spaces.map((space) => <option key={space} value={space}>{space}</option>)}
        </select>
      </label>
      <label className="form-field">
        <span>Date</span>
        <input name="date" type="date" value={booking.date} onChange={updateField} required />
      </label>
      <div className="form-row">
        <label className="form-field">
          <span>Start time</span>
          <input name="startTime" type="time" value={booking.startTime} onChange={updateField} required />
        </label>
        <label className="form-field">
          <span>End time</span>
          <input
            name="endTime"
            type="time"
            value={booking.endTime}
            onChange={updateField}
            min={booking.startTime || undefined}
            required
          />
        </label>
      </div>
      <button className="button-primary form-submit" type="submit">Review booking <span aria-hidden="true">→</span></button>
      {saved && <p className="form-success" role="status">Your booking details are ready. They are saved in this form only.</p>}
    </form>
  );
}

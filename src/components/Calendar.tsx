import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  time: string;
  country: string;
  event: string;
  actual: string;
  previous: string;
  consensus: string;
  forecast: string;
}

const Calendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://api.tradingeconomics.com/calendar', {
          params: {
            // Add your TradingEconomics API key here
            key: 'YOUR_TRADINGECONOMICS_API_KEY',
            country: 'all',
            // Add any other necessary parameters
          },
        });

        setEvents(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        setError('Error fetching calendar events. Please try again later.');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-xl mb-4">Economic Calendar</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Time</th>
              <th className="py-2 px-4 border-b border-gray-700">Country</th>
              <th className="py-2 px-4 border-b border-gray-700">Event</th>
              <th className="py-2 px-4 border-b border-gray-700">Actual</th>
              <th className="py-2 px-4 border-b border-gray-700">Previous</th>
              <th className="py-2 px-4 border-b border-gray-700">Consensus</th>
              <th className="py-2 px-4 border-b border-gray-700">Forecast</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-gray-800">
                <td className="py-2 px-4 border-b border-gray-700">{event.time}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.country}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.event}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.actual}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.previous}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.consensus}</td>
                <td className="py-2 px-4 border-b border-gray-700">{event.forecast}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Calendar;

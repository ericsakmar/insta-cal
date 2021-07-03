import { useState } from "react";
import { add, format } from "date-fns";
import "./App.css";

const fetchInfo = async (url) => {
  const res = await fetch(
    `/.netlify/functions/parseEvent?url=${encodeURIComponent(url)}`
  );

  const json = await res.json();

  return json;
};

const formatDate = (d) => format(d, "yyyyMMdd'T'HHmmss");

const buildDateParam = (rawDate) => {
  var start = new Date(rawDate);
  var end = add(start, { hours: 3 });
  return `${formatDate(start)}/${formatDate(end)}`;
};

// https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/master/services/google.md
const getGoogleCalendarLink = (
  { description, date: rawDate, location },
  url
) => {
  var searchParams = new URLSearchParams();
  searchParams.set("action", "TEMPLATE");
  searchParams.set("trp", "true");

  searchParams.set("text", description);
  searchParams.set("details", `${description}\n\n${url}`);

  if (rawDate) {
    searchParams.set("dates", buildDateParam(rawDate));
  }

  if (location) {
    searchParams.set("location", location);
  }

  return `https://calendar.google.com/calendar/render?${searchParams.toString()}`;
};

function App() {
  const [url, setUrl] = useState("");
  const [eventData, setEventData] = useState();

  const handleGetInfo = async () => {
    const eventData = await fetchInfo(url);
    setEventData(eventData);
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleGetInfo}>Get Event Info</button>
      </div>

      {eventData !== undefined ? (
        <div>
          <p>{eventData.description}</p>
          <p>{eventData.date}</p>
          <a href={getGoogleCalendarLink(eventData, url)}>
            add to google calendar
          </a>
        </div>
      ) : undefined}
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { add, format } from "date-fns";
import "./App.css";

const fetchInfo = async (url) => {
  const res = await fetch(
    `/.netlify/functions/parseEvent?url=${encodeURIComponent(url)}`
  );

  const json = await res.json();

  return json;
};

const formatDateForGoogleCalendar = (d) => format(d, "yyyyMMdd'T'HHmmss");

const buildDateParam = (rawDate) => {
  var start = new Date(rawDate);
  var end = add(start, { hours: 3 });
  return `${formatDateForGoogleCalendar(start)}/${formatDateForGoogleCalendar(
    end
  )}`;
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

const formatDateForDisplay = (raw) => format(new Date(raw), "EEEE, LLLL do");

const getEventUrl = () => {
  const { search } = window.location;

  if (search === undefined) {
    return undefined;
  }

  const parsedParams = new URLSearchParams(search);
  return parsedParams.get("url");
};

function App() {
  const eventUrl = getEventUrl();
  const [url, setUrl] = useState(eventUrl ? eventUrl : "");
  const [eventData, setEventData] = useState();

  const handleGetInfo = async () => {
    const params = new URLSearchParams();
    params.set("url", url);
    document.location.search = params;
  };

  useEffect(() => {
    const getEventData = async () => {
      const eventData = await fetchInfo(eventUrl);
      setEventData(eventData);
    };

    if (eventUrl) {
      getEventData();
    }
  }, [eventUrl]);

  return (
    <div className="app">
      <div className="form">
        <input
          type="text"
          value={url}
          placeholder="url"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleGetInfo}>Get Event Info</button>
      </div>

      {eventData !== undefined ? (
        <div>
          <p>{formatDateForDisplay(eventData.date)}</p>
          <p>{eventData.description}</p>
          <a href={getGoogleCalendarLink(eventData, url)}>
            add to google calendar
          </a>
        </div>
      ) : undefined}
    </div>
  );
}

export default App;

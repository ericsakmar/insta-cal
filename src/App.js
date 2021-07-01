import { useEffect, useState } from "react";
import "./App.css";

// http://localhost:8888/.netlify/functions/parseEvent?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FCQlKElOFl0X%2F
const fetchInfo = async (url) => {
  const res = await fetch(
    `/.netlify/functions/parseEvent?url=${encodeURIComponent(url)}`
  );

  const json = await res.json();

  return json;
};

const getGoogleCalendarLink = ({ description, date, location }) => {
  // `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${The%20Big%20Show}&dates=20211001T230000Z/20211001T240000Z&details=Describe%20your%20event.%20Blah%20blah%20blah.&location=Spirit&trp=true`;

  var searchParams = new URLSearchParams();
  searchParams.set("text", description);
  searchParams.set("dates", date);
  searchParams.set("details", description);
  searchParams.set("location", location);

  console.log(searchParams.toString());
};

function App() {
  const [url, setUrl] = useState("");
  const [eventData, setEventData] = useState();

  const handleGetInfo = async () => {
    const eventData = await fetchInfo(url);
    setEventData(eventData);
  };

  console.log(eventData);

  return (
    <div className="App">
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <button onClick={handleGetInfo}>Get Event Info</button>
    </div>
  );
}

export default App;

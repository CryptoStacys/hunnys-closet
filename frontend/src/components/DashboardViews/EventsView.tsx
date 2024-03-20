import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Event from "../Card/Events";

const EventsView = () => {
  const [user] = useAtom(userAtom);
  const [eventsData, setEventsData] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/12SonTp6LmKNGVquHpJF2oiAlZa_WozbHkGP6WT-B72k/values/A2:E370?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        setEventsData(response.data.values);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, []);

  return (
    <div className="px-8 mx-auto max-w-7xl mt-[-80px]">
      {eventsData.map((item, index) => (
        <>
        <div key={index}>
          <div className="date text-center leading-8 xs:text-xl sm:text-3xl">
            {item[4]}
          </div>
          <Event
            headerTitle={item[2]}
            event={
              <>
                <a href={item[1]}>
                  <img src={item[0]} alt="Events" className="w-full" />
                </a>
                <p className="font-poppins text-xl text-center mt-8 mx-8">
                  {item[3]}
                </p>
              </>
            }
          />
          </div>
        </>
      ))}
    </div>
  );
};
////// Date <div className="date w-2/5 text-center leading-8 text-sm">{item[4]}</div>}
export default EventsView;

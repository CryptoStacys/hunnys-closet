import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Card from '../Card/Card';

const EventsView = () => {
  const [user] = useAtom(userAtom);
  const [eventsData, setEventsData] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchEventsData = async () => {
      try {
        const url = "https://sheets.googleapis.com/v4/spreadsheets/12SonTp6LmKNGVquHpJF2oiAlZa_WozbHkGP6WT-B72k/values/A2:E370?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        setEventsData(response.data.values);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchEventsData();
  }, []);

  return (
    <div className="news-view p-4 max-w-5xl mx-auto my-8">
      {eventsData.map((item, index) => (
        <Card
          key={index}
          headerTitle={item[2]} 
          leftBlockContent={<div className="date w-2/5 text-center leading-8 text-sm">{item[4]}</div>} // Date
          middleBlockContent={""} // Headline repeated (or you can leave it empty/adjust according to your design)
          rightBlockContent={<div></div>} // Empty or any other content you wish to display
          footer={
            <>
              <a href={item[1]}>
                <img src={item[0]} alt="News" className="w-full" />
              </a>
              <p className="font-poppins text-xl text-center mt-8">{item[3]}</p>
            </>
          }
        />
      ))}
    </div>
  );
};

export default EventsView;

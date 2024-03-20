import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import Event from "../Card/Events";

const NewsView = () => {
  const [user] = useAtom(userAtom);
  const [newsData, setNewsData] = useState<Array<any>>([]);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const url =
          "https://sheets.googleapis.com/v4/spreadsheets/17qLvWaFJBEb7RBgmXgvBd3uX_yeKbzL2NUid47DfyT0/values/A2:E370?key=AIzaSyAjknT53sMDEOdJ3YtCmjgP3VeSTvSGB3U";
        const response = await axios.get(url);
        setNewsData(response.data.values);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchNewsData();
  }, []);

  return (
    <div className="px-8 mx-auto max-w-7xl mt-[-80px]">
      {newsData.map((item, index) => (
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
                  <img src={item[0]} alt="News" className="w-full" />
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

export default NewsView;

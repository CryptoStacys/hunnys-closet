// /components/Card/Event.tsx
import React from 'react';
import Image from 'next/image';

type EventProps = {
  headerTitle: string;
  event: React.ReactNode;
};

{/* 
HOW TO REUSE EASILY ON OTHER PAGES:
<Event
        headerTitle="HEADER TITLE"
        event={<></>}
      />
*/}

const Event: React.FC<EventProps> = ({ headerTitle, event }) => {
  return (
    <div className="bg-white pb-4 shadow-lg max-w-5xl mx-auto rounded-b-3xl">
      <div className="event-header justify-center bg-profile-header p-4 rounded-t-lg">
        <h1 className="text-2xl font-bold text-white font-poppins">{headerTitle}</h1>
      </div>
      <div className="flex flex-col justify-center">{event}</div>
    </div>
  );
};

export default Event;

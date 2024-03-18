import React from "react";

export default function SecondaryButton(props: {
  onClick?: React.MouseEventHandler;
  title?: string;  // Add a title prop
  children?: React.ReactNode;
  disableBtn?: boolean;
  className?: string;
}) {
  return (
    <div className="flex">
      {props.disableBtn ? (
        <div
          title={props.title} // Add title attribute here
          className="select-none bg-[#ddd] flex justify-center items-center text-center px-4 py-1 text-[#777] font-bold rounded-full hover:cursor-pointer"
        >
          {props.children}
        </div>
      ) : (
        <div
          onClick={props.onClick}
          title={props.title} // Add title attribute here
          className="select-none hover:bg-[#ddd] btn flex justify-center items-center text-center px-4 py-1 text-[#777] hover:text-[#666] font-bold rounded-full hover:cursor-pointer"
        >
          {props.children}
        </div>
      )}
    </div>  
  );
}

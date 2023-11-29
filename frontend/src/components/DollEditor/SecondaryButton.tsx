import React from "react";

export default function SecondaryButton(props: {
  onClick?: React.MouseEventHandler;
  text?: string;
  children?: React.ReactNode;
  disableBtn?: boolean;
}) {
  return (
    <div className="flex">
      <div className="flex">
        {props.disableBtn && (
          <div
          className="select-none bg-[#ddd] flex justify-center items-center text-center px-4 py-1 text-[#777] font-bold rounded-full hover:cursor-pointer"
        >
          {props.children}
          	</div>
        )}

      </div>
      <div className="flex">
        {!props.disableBtn && (
          <div
          onClick={props.onClick}
          
          className="select-none hover:bg-[#ddd] btn flex justify-center items-center text-center px-4 py-1 text-[#777] hover:text-[#666] font-bold rounded-full hover:cursor-pointer"
        >
          {props.children}
          	</div>
        )}

      </div>

    </div>  
  );
}

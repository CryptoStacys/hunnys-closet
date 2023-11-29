import { MouseEventHandler } from "react";
import Icon from "../Icon/Icon";

export default function BackButton(props: { onClick: MouseEventHandler<HTMLDivElement>; text?: string }) {
  return (
    <div
      onClick={props.onClick}
      className="hover:bg-[#ddd] btn grid grid-cols-[30px_1fr] text-center pl-0 pr-4 py-1 font-bold rounded-full hover:cursor-pointer"
    >
      <div className="flex justify-center items-center">
        <Icon type="prev" className="h-[15px] w-[15px]" />
      </div>
      <div className="text-[#777] flex justify-center items-center pl-0">{props.text}</div>
    </div>
  );
}

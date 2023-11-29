import { hunnysColors } from "../../data/config";

type ApplyButtonProps = {
  onClick: any;
  text?: string;
  disableBtn?: boolean;
};

export default function ApplyButton(props: ApplyButtonProps) {
  return (
    
    <div>
    <div>
      {props.disableBtn && (
       <div
       className="select-none relative flex justify-center items-center text-center px-5 py-1 text-[#777] font-bold rounded-full hover:cursor-pointer"
       style={{ background: hunnysColors.gray }}
     >
       <div className="flex justify-center items-center">
         <svg
           xmlns="http://www.w3.org/2000/svg"
           className="w-[15px]"
           viewBox="0 0 103.476 77.163"
         >
           <path
             d="M35.145,80.225,1.515,46.6a5.174,5.174,0,0,1,0-7.317l7.317-7.317a5.174,5.174,0,0,1,7.317,0L38.8,54.616,87.327,6.093a5.174,5.174,0,0,1,7.317,0l7.317,7.317a5.174,5.174,0,0,1,0,7.317l-59.5,59.5A5.174,5.174,0,0,1,35.145,80.225Z"
             transform="translate(0 -4.577)"
           />
         </svg>
       </div>
       <div className="ml-2">{props.text}</div>
     </div>
      )}

    </div>
    <div>
      {!props.disableBtn && (
        <div
        onClick={props.onClick}
        className="select-none relative hover:text-white hover:fill-white  fill-[#a26106] btn flex justify-center items-center text-center px-5 py-1 text-[#a26106] font-bold rounded-full hover:cursor-pointer"
        style={{ background: hunnysColors.yellow }}
      >
        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-[15px]"
            viewBox="0 0 103.476 77.163"
          >
            <path
              d="M35.145,80.225,1.515,46.6a5.174,5.174,0,0,1,0-7.317l7.317-7.317a5.174,5.174,0,0,1,7.317,0L38.8,54.616,87.327,6.093a5.174,5.174,0,0,1,7.317,0l7.317,7.317a5.174,5.174,0,0,1,0,7.317l-59.5,59.5A5.174,5.174,0,0,1,35.145,80.225Z"
              transform="translate(0 -4.577)"
            />
          </svg>
        </div>
        <div className="ml-2">{props.text}</div>
      </div>
      )}

    </div>

  </div>  
  );
}

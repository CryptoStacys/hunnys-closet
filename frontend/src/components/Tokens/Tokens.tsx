import Help from "../Help/Help";
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";

import Image from "next/image";

export default function Tokens() {
  const [user] = useAtom(userAtom);

  function getTokens() {
    if (!user) return [];
    return user.tokens;
  }
  return (
    <div className="flex-center my-4 mx-auto">
      {/* <div className="relative mx-6 p-6 w-full max-w-[1160px] bg-white rounded-3xl shadow-md "> */}
      <div className="relative mx-6 p-6 w-full max-w-[1250px] bg-white rounded-3xl shadow-md ">
        <Help
          {...{
            title: "Customizing your dolls",
            body: "Here goes some text to explain things",
          }}
          className="absolute top-3 right-3"
        />

        <div className="">
          <div className="text-lg font-bold">Hunnys OG</div>
          {getTokens().length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {getTokens()
                .sort((a: any, b: any) => a.token_id - b.token_id)
                .map((token: any, i: number) => {
                  return (
                    <div key={i} className="relative rounded-lg  overflow-hidden shadow-md bg-[#fff]">
                      <div className="absolute top-[14px] left-0 bg-[#fff] leading-4 py-[5px] pl-3 pr-3 shadow-md rounded-r-2xl flex-center">
                        {token.token_id}
                      </div>
                      <div className="w-full text-center py-[4px] ml-1 inline-block">{`Hunnys ${token.token_id}`}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

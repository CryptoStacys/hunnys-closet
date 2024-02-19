import { useQuery } from "react-query";
import Image from "next/image";

export default function Example() {
  const { isLoading, error, data }: any = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      fetch(
        "https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/verifyCloset?wallet=0xa7758394D8f7fD23b0d9F13E02427B514687394B"
      ).then((res) => res.json()),
  });

  if (isLoading) return <>Loading...</>;

  if (error) return <>An error has occurred: {error.message}</>;
  // console.log("data: ", data);
  return (
    <div className="flex-center my-4 mx-auto">
      {/* <div className="mx-6 p-6 max-w-[1160px] bg-white rounded-3xl shadow-md "> */}
      <div className="mx-6 p-6 max-w-[1250px] bg-white rounded-3xl shadow-md ">
        {/* <h1>clones length {data.clones.length}</h1> */}
        {data.collections.collections.map((x: any, index: number) => {
          return (
            <div key={index} className="">
              <div className="text-lg font-bold">{x.name}</div>
              {x.tokenData.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {x.tokenData
                    .sort((a: any, b: any) => a.token_id - b.token_id)
                    .map((y: any, i: number) => {
                      return (
                        <div
                          key={i}
                          className="relative rounded-lg  overflow-hidden shadow-md bg-[#fff]"
                        >
                          <div className="absolute top-[14px] left-0 bg-[#fff] leading-4 py-[5px] pl-3 pr-3 shadow-md rounded-r-2xl flex-center">
                            {y.token_id}
                          </div>
                          <img
                            className=""
                            src={JSON.parse(y.metadata).image}
                            alt={JSON.parse(y.metadata).name}
                          />
                          <div className="w-full text-center py-[4px] ml-1 inline-block">
                            {JSON.parse(y.metadata).name}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

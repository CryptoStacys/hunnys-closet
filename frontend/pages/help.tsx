type Props = {
    number: string;
    title: string;
    children?: React.ReactNode;
  };
  
  function Step({ number, title, children }: Props) {
    return (
      <div className="grid grid-cols-[150px_7fr] mb-[15px] bg-white shadow-md rounded-lg">
        <div
          className="bg-[#700cf5] rounded-l-md flex items-center justify-center text-[7rem] text-center leading-[7rem] text-[#ffd54b] py-[20px]"
          style={{
            fontFamily: "impact",
            textShadow: "1px 1px 0px #ca0, 2px 2px 0px #ca0, 3px 3px 0px #ca0",
            boxShadow: "0 0  20px inset rgba(0,0,0,.3)",
          }}
        >
          {number}
        </div>
        <div className="w-full h-full py-[20px] pl-[30px] pr-[30px]">
          <div className="text-xl font-bold my-1 border-b-[3px]">{title}</div>
          {children}
        </div>
      </div>
    );
  }
  
  export default function Help() {
    return (
      <div className="w-max-full box-border">
        <div className="font-title mx-auto w-full text-center text-[6rem] leading-[8rem]">Help</div>
        <div className="mx-auto max-w-[650px] px-6">
          {/* step 1 */}
          <Step number="1" title="Step 1 - Mint your doll">
            <div>You can claim a free doll if you own a Hunny from the genesis 10k collection (link here)</div>
          </Step>
          <Step number="2" title="Step 2 - Check your inventory">
            <div>Claim your doll if you own a 10kimage here</div>
          </Step>
          <Step number="3" title="Step 3 - Dress them up">
            <div>Claim your doll if you own a 10kimage here</div>
          </Step>
          <Step number="4" title="Step 4 - Show off">
            <div>
              Lorem Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit animi perspiciatis totam
              tenetur nostrum tempore
            </div>
          </Step>
          <div className="font-title mx-auto w-full text-center text-[6rem] leading-[8rem]">FAQ</div>
          <div>Can I trade / sell my doll?</div>
          Yes you can, but remember, the recipient will only receive the doll, not the equipped items.
          <div>If I trade my 10k hunny away, what happens to my doll?</div>
          <div>
            The items belonging to the 10k hunny token will be unequipped from your doll since you don&apos;t have ownership of
            those items.
          </div>
        </div>
      </div>
    );
  }
  
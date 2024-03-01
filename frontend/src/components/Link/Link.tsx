import { useAtom } from "jotai";
import { modalAtom, savedAtom } from "../../data/store";
// import { localStorageToken } from "../../data/config";
import SecondaryButton from "../DollEditor/SecondaryButton";
import ApplyButton from "../DollEditor/ApplyButton";

export default function Link({ className, to, children }: { className?: string; to: string; children?: any }) {
  const [modal, modalSet] = useAtom(modalAtom);
  const [saved, savedSet] = useAtom(savedAtom);

  // prevent full page reload
  const onClick = (event: any) => {
    // if ctrl or meta key are held on click, allow default behavior of opening link in new tab
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    // prevent full page reload
    event.preventDefault();

    savedCheck();
  };

  function changeURL() {
    // update url
    window.history.pushState({}, "", to);

    // communicate to Routes that URL has changed
    const navEvent = new PopStateEvent("popstate");
    window.dispatchEvent(navEvent);
  }

  // Display unsavedChanges modal before changing page
  function savedCheck() {
    console.log("Checking saved state before navigation:", saved);
    if (!saved) {
      modalSet({
        active: true,
        title: "Unsaved changes",
        body: (
          <>
            <div className="mb-3 px-2">
              You haven&apos;t saved the current setup of your Dolly yet,
              <br /> do you still want to proceed?
            </div>
            <div className="grid grid-cols-2">
              <SecondaryButton onClick={() => modalSet({ active: false, title: "", body: <></> })}>
                No, take me back
              </SecondaryButton>
              <ApplyButton
                onClick={() => {
                  modalSet({ active: false, title: "", body: <></> });
                  savedSet(true);
                  changeURL();
                }}
                text="Yes, I'm sure"
              />
            </div>
          </>
        ),
      });
    } else {
      changeURL();
    }
  }

  return (
    <a className={className} href={to} onClick={onClick}>
      {children}
    </a>
  );
}
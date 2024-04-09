//src/components/Link/Link.tsx

import { useAtom } from "jotai";
import { userAtom, modalAtom, savedAtom } from "../../data/store";
import { useRouter } from 'next/router';
import SecondaryButton from "../DollEditor/SecondaryButton";
import ApplyButton from "../DollEditor/ApplyButton";
import { trackLinkClick } from '../../utils/tracking';
import { User } from "../../data/global";

interface LinkProps {
  className?: string;
  to?: string;
  children?: React.ReactNode;
  onClick?: () => void; // Add an optional onClick prop
  trackId?: string;
}

export default function Link({ className, to, children, onClick, trackId}: LinkProps) {
  const [user] = useAtom(userAtom);
  const [modal, modalSet] = useAtom(modalAtom);
  const [saved, savedSet] = useAtom(savedAtom);
  const router = useRouter();

  // prevent full page reload
  const handleClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // if ctrl or meta key are held on click, allow default behavior of opening link in new tab
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault(); // Prevent full page reload

    if (trackId && user) {
      await trackLinkClick(trackId, user, to); // Note: `to` is now passed for URL tracking
    }


    if (onClick) {
      onClick(); // Call the passed onClick handler if any
    }

    savedCheck();
  };

const changeURL = () => {
    if (to?.startsWith("/#") && router.pathname !== '/') {
      // If intending to navigate to a hash while on /dollys, adjust to navigate to / with the hash
      const newPath = `/${to}`;
      router.push(newPath);
      console.log("Click A from Link")
    } else {
      // Normal navigation or hash navigation while on /
      window.history.pushState({}, "", to);
      const navEvent = new PopStateEvent("popstate");
      window.dispatchEvent(navEvent);
      console.log("Click B from Link")
    }
  };

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
    <a className={className} href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
import { User } from "../data/global";

// src/utils/tracking.ts
export const trackLinkClick = async (trackId: string, user: User, url?: string) => {
    // Implementation details might include sending this data to your backend
    console.log("Tracking link click for ID:", trackId);
    // Example POST request (adjust URL and body as necessary for your backend)
    const response = await fetch(`https://closetservices.hunnysnft.com/wp-json/hunnys-closet/v1/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        action: "trackLinkClick",
        wallet: user.address, // Assuming 'user' is your current user object
        url: url,
        trackId: trackId,
        }),
    });
  
    if (!response.ok) {
      console.error('Failed to track click for ID:', trackId);
    }
  };
  
import React from "react";

const testimonials = [
  {
    name: "Bri (MermaidPower)",
    testimonial: "I think I got my money’s worth in the first week of being in Bunny Club! It’s seriously so great & I love that you take ideas from us too! Thanks for making us feel so super special 💜💜",
    image: "/assets/BriMermaid.png", // Example image path
  },
  {
    name: "Jake Balch",
    testimonial: "I love it. Super fun. I also feel its a great community bridge. Using the closet to cosplay vixens has been a cool experience",
    image: "/assets/JakeBalch.png", // Example image path
  },
  {
    name: "Ghostcam",
    testimonial: "I subscribed immediately, for the longest term available, it's been a no brainer and I can only recommend joining. What you'll get is so worth it, moneywise, but the club, the experience together and the direct influence on the route is priceless.",
    image: "/assets/GhostCam.png", // Example image path
  },
  {
    name: "SkuzzRat",
    testimonial: "I love it!! I’m in for the year bc I need EVERYTHING - kid in a candy shop😭😂💕 I don’t have to think about missing out, plus BC community is so fun & I’m excited to draw items from everyone’s suggestions!",
    image: "/assets/SkuzzRat.png", // Example image path
  },
  {
    name: "Shakespeare",
    testimonial: "Love the Bunny Club. The amount of bonus items every month is great! So much creativity. Even more, the community is what really makes it amazing. Helping each other collect, sharing design ideas, opportunities for special customized items, and getting alpha early is awesome!",
    image: "/assets/Shakespeare.png", // Example image path
  },
  {
    name: "SunnyDayz",
    testimonial: "Just got dropped this Cozy cabin pack!! Pays to be in @HunnysNFT Bunny club. NFT subscription with utility!",
    image: "/assets/SunnyDayz.png", // Example image path
  },
];

const Testimonials = () => {
  return (
    <div className="my-12 space-y-4 mx-8">
      {testimonials.map(({ name, testimonial, image }, index) => (
        <div key={index} className="border rounded-xl bg-white hover:shadow-lg transition-transform duration-500 hover:scale-105 m-4 overflow-hidden flex flex-col items-center p-4">
          <img src={image} alt={name} className="w-24 h-24 rounded-full object-cover mb-4" />
          <blockquote className="italic text-center">&quot;{testimonial}&quot;</blockquote>
          <p className="font-bold mt-2">- {name}</p>
        </div>
      ))}
    </div>
  );
};

export default Testimonials;

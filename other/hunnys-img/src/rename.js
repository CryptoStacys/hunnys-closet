import jimp from "jimp";
import fs from "fs";
import path from "path";

const folder = `src/img/${process.argv[2]}`;

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

fs.readdirSync(folder).map((subfolder, i) => {
  fs.readdirSync(path.join(folder, subfolder)).map((file) => {
    let newName = file;
    const words = [
      "atlas",
      "puppy",
      "plushie",
      "crazy",
      "club",
      "heart",
      "cute",
      "skull",
      "bear",
      "eyes",
      "snake",
      "chibi",
      "bangs",
      "baby",
      "makeup",
      "back",
      "collar",
      "shirt",
      "mohawk",
      "space",
      "diamond",
      "lightning",
      "geisha",
      "bun",
      "left",
      "right",
      "with",
      "layer",
      "borg",
      "messy",
      "buzz",
      "cut",
      "fangirl",
      "facepaint",
      "flower",
      "silly",
      "frog",
      "kitty",
      "whiskers",
      "bob",
      "front",
      "rainbow",
      "kawaii",
      "spade",
      "star",
      "swirly",
      "cheeks",
      "with",
      "winged",
      "comms",
      "device",
      "sailor",
      "scout",
      "pigtails",
      "uptight",
      "cowboy",
      "bunny",
      "ears",
      "hat_", // CowboyHat but not THatGirlPixie
      "triangle",
      "top_", // SailorScoutTop, but not OcTopus
      "head",
      "blush",
      "formal",
      "preppy",
      "straight",
      "l.png",
      "c1.png",
      "c2.png",
      "c3.png",
    ];
    newName = newName.replace(" (1)", "");
    newName = newName.replace("THat", "That");
    newName = newName.replace("OcTopus", "Octopus");
    newName = newName.replace("AiEyes", "AIEyes");
    newName = newName.replace("aIEyes", "AIEyes");
    newName = newName.replace("ai_", "AI_");
    newName = newName.replace("TrackSuit", "Tracksuit");
    newName = newName.replace("aiEyes", "AIEyes");

    words.forEach((word) => {
      newName = newName.replace(word, capitalize(word));
    });
    if (file !== newName) {
      fs.renameSync(
        path.join(folder, subfolder, file),
        path.join(folder, subfolder, newName)
      );
      console.log("Renamed", file, "to", newName);
    }
  });
});

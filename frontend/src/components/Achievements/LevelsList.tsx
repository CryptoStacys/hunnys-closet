// LevelsList.tsx

import React, { useState } from 'react';
import { Levels, User } from "../../data/global";
import Level from '../Card/Levels';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";

  const levelsData: Levels[] = [
    {
        id: '0',
        levelsName: 'Start Your Adventure',
        title: 'Fresh Cupcake',
        description: 'Hello, Cupcake! Welcome to the heart of the Bunny Kingdom, my lovely castle and home!\n\nI’m so happy you’re here, I REALLY need help. I found this magical chest near the forest’s edge…. But nothing will open it, believe me, I’ve tried!\n\n',
        levelsReward1: 'ButterPuff',
        },
    {
        id: '1',
        levelsName: 'Bunny Queen Mikas Castle',
        title: 'Bunny Queens Helper',
        description: 'My bunny senses are telling me that we need a dash of magic from across each corner of our beautiful lands.\n\nTake this Bunny Backpack and BunComms Device, cutie! It has everything you need for your big adventure and will allow us to stay in touch. With a sprinkle in your step - go explore Bunny Kingdom, gathering items to help us open this chest! As thanks for helping, we can share whatever is inside! I bet it’s something truly amazing…',
        levelsReward1: 'Bunny Ears Backpack',
        },
    {
        id: '2',
        levelsName: 'Bunny Town Market',
        title: 'Bunny Bargainer',
        description: 'Watch your step, this place may looks small but is bustling with delight wall to wall, Here you’ll be whisked away by the sights scents and sounds. Every item here has a story to be found! Find yourself some of the freshest treats to keep you on your Bunny feet!',
        levelsReward1: 'Picnic Basket full of Bunny Goodies',
        },
    {
        id: '3',
        levelsName: 'The Nut Bar',
        title: 'Squirrel Whisperer',
        description: 'Welcome to the Nut Bar, where it’s all it’s cracked up to be! Who wouldn’t want to be a squirrel living in these trees! Spoiled rotten and adorably round, the food here is easy to be found, now take a seat and make some fluffy lil friends you’ll need one for your next part of your quest but there’s only one squirrel worthy - they say he’s the best! A secret agent squirrel to help along your way, hope there’s nuts in that basket of treats because he will expect to be paid.',
        levelsReward1: 'Secret Agent Squirrel Pal',
        },
    {
        id: '4',
        levelsName: 'Mr Moars Hut',
        title: 'Moar Collector',
        description: 'What’s that you say, you want something more? You’re on the right track with Mr. Moar! Visiting his hut, there’s plenty to explore- he’s quite a character and loves to hoard! along the path of rainbow carrots there is a tiny hut -the  roof is soooo decorative, like nothing you’ve ever seen, a collection of all sorts of curiosities!. Mr. Moar! roams the Bunny Kingdom, glooping and glopping, humming his gloopy tune, leaving behind a scent of BBQ, you’ll need Mr.. Moar by your side as you go, leave an offering for or his hut and I’m sure he will say in his noodley voice “ letsssss goooo”',
        levelsReward1: 'Mr. Moar Frame',
        },
    {
        id: '5',
        levelsName: 'Hupe Scouts HQ',
        title: 'So Hupe!',
        description: 'Feeling creative? You better be, open the doors, Hupe Scouts has that creativity! Upon waking in a floating olden heart glows,some even say it’s name is Leo, changing colors as he shows you the way making sure that you feel like a Hupe Scout everyday. Hupe Scouts will give you a badge to thank you for signing our message board - you can come back anytime now but hurry and get your bunny butt on your way you can’t just draw that chest open, it doesn’t quite work that way.',
        levelsReward1: 'Hupe Scouts Heart Headband',
        levelsReward2: 'Hupe Scouts Badge'
        },
    {
        id: '6',
        levelsName: 'Dreamsicle Pond',
        title: 'Delicious Dreamer',
        description: 'Get immersed in the colors and tastes of dreamsicle pond, there’s rainbow candy cane stumps and cotton candy leaves with magic beyond! But the wait, look closely and the sweetest things you’ll see are the magical mer-bunnies! You’ll find them living deep in the waters of the pond, sing them a sweet song to see if they have something for your quest, we heard there is something magical about the dreamsicle pond water that Mika likes best!',
        levelsReward1: 'Bottle of Dreamsicle Water',
        levelsReward2: 'Dreamsicle Dye'
        },
    {
        id: '7',
        levelsName: 'Palmers Potato Farm',
        title: 'Tater Tot',
        description: 'Oh baby, hold onto your tots! This farm is far from ordinary, you’ll hear that a lot so kick through the dirt and open the creaky gate to be greeted by a dirty little toad- Hornsworth’s his name. He grumbly hops toward Palmer the potato farmer for you to meet and she shares with you the droolworthy delights of this here farm. There’s baked potato bushes, and tater tot vines, french fries poking up from the ground, it smells so fine! Palmer suggests you take this magic bag of potatoes and some extra clothes and sends you off back to the Bunny Hop road.',
        levelsReward1: 'Farmer Gear Outfit',
        levelsReward2: 'Bag of Magic Potatoes'
        },
    {
        id: '8',
        levelsName: 'Curious Carrot Forest',
        title: 'Forest Friend',
        description: 'Crunch crunch, with each step of your foot as you walk though the forest to explore carrots of all shapes and sizes  grown along the forest floor, they peek through cloudy bushes and smell so sweet. Stop here for a night of pure bliss, this forest is a place on every bunny’s wish! Take a break and relax as a sparkly mist sweeps the air while curious bunny’s peer from behind the trees as you empty the contents of your Bunny Back pack to seet up a cozy camp. The fire crackles as it hits the mist with a delightful sound roasting carrots so peacefully, making this a night you’ll never forget. Take with you this experience along your way, hop hop cute Bunny there’s more adventure that awaits!',
        levelsReward1: 'Roasting Carrots Over A Fire Background',
        },
    {
        id: '9',
        levelsName: 'Dreamland',
        title: 'Dreamer',
        description: 'This place is a dream and you won’t want to wake up from. But you do and the first thing you see is a snoozle in your face, sorry, not sorry - we never said they carry themselves with much grace. While they flop around with magic bags of dust, to ensure you pleasant dreams, because baby it’s a must!! The ground you stand on swirls in shades of pink and purple light, as the sky fills with whirling clouds and constellations that shift and change with every passing sight you quickly fall back into dreamland and all it’s meant to be- it might be the best place in bunny kingdom to truly catch some Zzz’s. If you’re lucky enough as you leave this place a snoozle might hitch a ride to help along yout way word also has it they give the gift of the dreamiest PJ’s',
        levelsReward1: 'Snoozle',
        levelsReward2: 'Dreamy Dreamland Pajamas'
        },
    {
        id: '10',
        levelsName: 'Horned Swamp',
        title: 'Horny',
        description: 'The heavy air wraps you tightly as you wander ever so lightly towards the center of the murky swamp. Bubbles of gloop circle you - this is not the place you want to be! Sitting on a log in your outfit of color harmony - you stick out like a sore carrot and this is something a baby hornsworh can’t resist, one appears near you and gives you a tiny fist- you bump it and he, croaks with glee about you “visiting the swamp during camouflage fleek week”. Who knew these lil toads had a fashion sense at all, you’ll just have to trust him or in the swamp you’ll fall. He gifts you a camo lewk that even you can’t resist, and how cute is this pocket - a baby hornsworh perfect fit he’s going with with you on your journey to see queen Mika and her face that people say looks like a resting “bunny” 😆',
        levelsReward1: 'Swampy Camo Outfit',
        levelsReward2: 'Baby Hornsworth'
        },
    // Add more levels here
  ];

  
  const LevelsList = () => {
    const [user] = useAtom(userAtom);
    const [currentLevelId, setCurrentLevelId] = useState(user?.level.toString() || "0");
  
    const incrementLevel = () => {
      const newLevelId = Math.min(parseInt(currentLevelId) + 1, user?.level || 0).toString();
      setCurrentLevelId(newLevelId);
    };
  
    const decrementLevel = () => {
      const newLevelId = Math.max(0, parseInt(currentLevelId) - 1).toString();
      setCurrentLevelId(newLevelId);
    };
  
    const currentLevel = levelsData.find(level => level.id === currentLevelId);
  
    return (
      <div className="levels-list">
        {currentLevel && <Level levels={currentLevel} />}
        <h1 className="luckiest flex justify-center m-auto text-2xl">
              Your Journey
            </h1>
        <div className="navigation-buttons flex justify-around">
          <button 
            className={`bg-[#6510F2] rounded-xl luckiest text-white text-2xl p-4 ${currentLevelId === "0" ? "opacity-0" : "hover:bg-[#5500E0]"}`} 
            onClick={decrementLevel} 
            disabled={currentLevelId === "0"}
          >
            Level {parseInt(currentLevelId) - 1}
          </button>
          <button 
            className={`bg-[#6510F2] rounded-xl luckiest text-white text-2xl p-4 ${parseInt(currentLevelId) >= (user?.level || 0) ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5500E0]"}`} 
            onClick={incrementLevel} 
            disabled={parseInt(currentLevelId) >= (user?.level || 0)}
          >
            Level {parseInt(currentLevelId) + 1}
          </button>
        </div>
      </div>
    );
  };
  
  export default LevelsList;
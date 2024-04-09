// LevelsList.tsx

import React, { useState, useEffect } from 'react';
import { Levels, User } from "../../data/global";
import Level from '../Card/Levels';
import { useAtom } from "jotai";
import { userAtom } from "../../data/store";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper';
import { Lazy, Navigation, Pagination, Controller } from 'swiper/modules';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import Swiper core and required modules
import SwiperCore from 'swiper';
// Install Swiper modules
SwiperCore.use([Pagination, Controller]);


  const levelsData: Levels[] = [
    {
        id: '0',
        levelsName: 'Start Your Adventure',
        title: 'Fresh Cupcake',
        description: 'Hi there, dear friend, I\'m ButterPuff, oh so fluff, In the land of magic, where I\'m the softest puff. With a wiggle and a giggle, I find spells so sweet. The cuddliest, wuddliest guide you\'ll ever meet!\n\nI see you\’re new and might need a hand. New places can be scary, But don\’t you worry! Just follow my fluffy butt, you\’ll land on your feet in a hurry. Queen Mika\'s invite, with love she sends, to meet at her castle, where the rainbow bends. Let\’s go on an adventure, you and me, to meet the Queen - We\’ll end up who knows where, as happy as can be!\n\n',
        levelsReward1: 'ButterPuff',
        freeClaimTokenId: 68,
        },
    {
        id: '1',
        levelsName: 'Level 1:\n\nBunny Queen Mika\'s Castle',
        title: 'Bunny Queen\'s Helper',
        description: 'Hellloo cupcake! Welcome to the heart of the Bunny Kingdom! Behold this magical chest before our eyes, nothing will open it, believe me, I’ve tried! My Bunny senses tingle that a dash of magic is required from across the land. Take this Bunny Backpack, with a sprinkle in your step - go explore Bunny Kingdom, gathering items to help me open this chest!',
        levelsReward1: 'BunComms Device',
        levelsReward2: 'BunVenture Backpack',
        freeClaimTokenId: 69,
        },
    {
        id: '2',
        levelsName: 'Level 2:\n\nBunny Town Market',
        title: 'Bunny Bargainer',
        description: 'Watch your step, this place may look small but it’s bustling with delight wall to wall, Here you’ll be whisked away by the sights, scents and sounds. Every item here has a story to be found! Goods from every corner of the bunny lands, traded here in friendly hands. Find yourself some of the freshest treats to keep you on your Bunny feet!',
        levelsReward1: 'Bunny Babe Basket',
        levelsReward2: 'Picnic Day',
        freeClaimTokenId: 70,
        },
    {
        id: '3',
        levelsName: 'Level 3:\n\nThe Nut Bar',
        title: 'Squirrel Whisperer',
        description: 'Welcome to the Nut Bar, where it’s all it’s cracked up to be! Who wouldn’t want to be a squirrel living in these trees! Spoiled rotten and adorably round, the food here is easy to be found, now take a seat and make some fluffy lil friends you’ll need one for your next part of your quest but there’s only one squirrel worthy - they say he’s the best! A secret agent squirrel to help along your way, hope there’s nuts in that basket because he will expect to be paid.',
        levelsReward1: 'Secret Agent S',
        levelsReward2: 'Secret Agent Shades',
        freeClaimTokenId: 71,
        },
    {
        id: '4',
        levelsName: 'Level 4:\n\nMr. Moar\'s Hut',
        title: 'Moar Collector',
        description: 'What’s that you say, you want something more? You’re on the right track with Mr. Moar! Visiting his hut, there’s plenty to explore- he’s quite a character and loves to hoard! along the path of rainbow carrots there is a tiny hut -the  roof is soooo decorative, like nothing you’ve ever seen, a collection of all sorts of curiosities!. Mr. Moar! roams the Bunny Kingdom, glooping and glopping, humming his gloopy tune, leaving behind a scent of BBQ, you’ll need Mr.. Moar by your side as you go, leave an offering for or his hut and I’m sure he will say in his noodley voice “Let\'sssss goooo!”',
        levelsReward1: 'Silly Mr. Moar',
        levelsReward2: 'Gloopy Mr. Moar',
        freeClaimTokenId: 72,
        },
    {
        id: '5',
        levelsName: 'Level 5:\n\nHupe Scouts HQ',
        title: 'So Hupe!',
        description: 'Feeling creative? You better be, open the doors of Hupe Scouts HQ with glee! In the heart of the land, where courage stands tall, the noble Hupe Scouts answer the call. With every task completed, a badge proudly earned, helping the kingdom, at every turn. They roam the realm, lending hands so kind, In every new deed, a new friend they find. Protectors of all, with joy and with laughter, The Hupe Scouts make every bunny’s heart flutter.',
        levelsReward1: 'Hupe Scouts Heart Headband',
        levelsReward2: 'Hupe Scouts Badge',
        levelsReward3: 'Hupe Scouts Background',
        freeClaimTokenId: 73,
        },
    {
        id: '6',
        levelsName: 'Level 6:\n\nDreamsicle Pond',
        title: 'Delicious Dreamer',
        description: 'Dip your feet in colors of dreamsicle pond, there’s tasty rainbow stumps and cotton candy leaves with magic beyond! But the wait, look closely and the sweetest things you’ll see are the magical mer-bunnies, swimming with glee! You’ll find them living deep in the waters of the pond, sing them a sweet song to see if they have something for your quest, we heard there is something magical about the dreamsicle pond water that Mika likes best!',
        levelsReward1: 'Delicious Dreamwater',
        levelsReward2: 'Dreamsicle',
        freeClaimTokenId: 74,
        },
    {
        id: '7',
        levelsName: 'Level 7:\n\nPalmers Potato Farm',
        title: 'Tater Tot',
        description: 'Oh baby, hold onto your tots! This farm is far from ordinary, you’ll hear that a lot - so kick through the dirt and open the creaky gate to be greeted by a dirty little toad- Hornsworth’s his name. He grumbly hops toward Palmer the potato farmer for you to meet and she shares with you the droolworthy delights of this here farm. There’s baked potato bushes, and tater tot vines, french fries poking up from the ground, it smells so fine! Palmer suggests you take this magic fork and with some extra clothes, she sends you off back to bunny hop along the road.',
        levelsReward1: 'Honest Work Overalls',
        levelsReward2: 'Tater Tot Tiller',
        freeClaimTokenId: 75,
        },
    {
        id: '8',
        levelsName: 'Level 8:\n\nCurious Carrot Forest',
        title: 'Forest Friend',
        description: 'Crunch crunch, with each step of your foot as you walk though the forest to explore carrots of all shapes and sizes  grown along the forest floor, they peek through cloudy bushes and smell so sweet. Watch out! In the shadows, not far away, The apple eater lurks, or so they say. Ferocious in rumor, but don\'t you fret, Queen Mika knows, he\'s a gentle giant, no threat.\n\nStop here for a night of pure bliss, this forest is a place on every bunny’s wish! Take a break and relax as a sparkly mist sweeps the air while curious bunny’s peer from behind the trees as you empty the contents of your Bunny Backpack to set up a cozy camp. The fire crackles as it hits the mist with a delightful sound roasting carrots so peacefully, making this a night you’ll never forget. Take with you this experience along your way, hop hop cute Bunny there’s more adventure that awaits!',
        levelsReward1: 'Best Buns Camp Out',
        levelsReward2: 'Curious Carrot Munch',
        freeClaimTokenId: 76,
        },
    {
        id: '9',
        levelsName: 'Level 9:\n\nDreamland',
        title: 'Dreamer',
        description: 'This place is a dream and you won’t want to wake up from. But you do and the first thing you see is a snoozle in your face, sorry, not sorry - we never said they carry themselves with much grace. While they flop around with magic bags of dust, to ensure you pleasant dreams, because baby it’s a must!! The ground you stand on swirls in shades of pink and purple light, as the sky fills with whirling clouds and constellations that shift and change with every passing sight you quickly fall back into dreamland and all it’s meant to be- it might be the best place in bunny kingdom to truly catch some Zzz’s. If you’re lucky enough as you leave this place a snoozle might hitch a ride to help along your way word also has it they give the gift of the dreamiest PJ’s.',
        levelsReward1: 'Silky Dreams PJs',
        freeClaimTokenId: 77,
        },
    {
        id: '10',
        levelsName: 'Level 10:\n\nHorned Swamp',
        title: 'Horny',
        description: 'The heavy air wraps you tightly as you wander ever so lightly towards the center of the murky swamp. Bubbles of gloop circle you - this is not the place you want to be! Sitting on a log in your outfit of color harmony - you stick out like a sore carrot and this is something a baby hornsworh can’t resist, one appears near you and gives you a tiny fist- you bump it and he, croaks with glee about you “visiting the swamp during camouflage fleek week”. Who knew these lil toads had a fashion sense at all, you’ll just have to trust him or in the swamp you’ll fall. He gifts you a camo lewk that even you can’t resist, and how cute is this pocket - a baby hornsworh perfect fit he’s going with with you on your journey to see queen Mika and her face that people say looks like a resting “bunny” 😆',
        levelsReward1: 'Swampstress',
        levelsReward2: 'Baby Hornsworth',
        freeClaimTokenId: 78,
        },
    // Add more levels here
  ];

  
  const LevelsList = () => {
    const [user] = useAtom(userAtom);
    const userLevelIndex = user ? parseInt(user.level, 10) : 0;

    const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null);
  
    const checkSlideChange = () => {
      if (swiperInstance && user) {
        const currentIndex = swiperInstance.activeIndex;
        const maxIndex = user.level; // Assuming 'level' is 0 indexed
        if (currentIndex > maxIndex) {
          swiperInstance.slideTo(maxIndex);
        }
      }
    };

    useEffect(() => {
      if (swiperInstance) {
        // Listen to slide change events
        swiperInstance.on('slideChange', checkSlideChange);
        
        // Clean up event listener
        return () => {
          swiperInstance.off('slideChange', checkSlideChange);
        };
      }
    }, [swiperInstance, user?.level]);

    useEffect(() => {
      if (swiperInstance) {
          // Prevent dragging beyond the current level by disabling touch movement if it's not within allowed levels.
          swiperInstance.allowTouchMove = userLevelIndex >= swiperInstance.activeIndex;
          
          // Update Swiper instance to apply the changes.
          swiperInstance.update();
      }
  }, [swiperInstance, userLevelIndex]);

    return (
      <div className="levels-list">
      <Swiper
        onSwiper={setSwiperInstance}
        initialSlide={userLevelIndex}
        allowTouchMove={false}
        allowSlideNext={userLevelIndex >= (user?.level || 0)}
        pagination={{
          clickable: true,
          // Dynamically render pagination bullets only for accessible levels
          renderBullet: (index, className) => {
              return index <= userLevelIndex ? `<span class="${className}"></span>` : '';
          }
      }}

        spaceBetween={10}
        modules={[Pagination, Controller]}
        className='mySwiper'
      >
        {levelsData.slice(0, user?.level + 1).map((level, index) => (
          <SwiperSlide key={index}>
            <div className="level-container">
              <Level levels={level} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      </div>
    );
  };
  
  export default LevelsList;
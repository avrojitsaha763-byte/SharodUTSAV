from fastapi import APIRouter

router = APIRouter(prefix="/api/heritage", tags=["Heritage & Cultural Assets"])

RADIO_CHANNELS = [
    {
        "frequency": 93.6,
        "name": "Akashvani Kolkata (Calcutta-A)",
        "show": "Mahisasuramardini (মহিষাসুরমর্দিনী)",
        "artist": "Birendra Krishna Bhadra & Pankaj Mullick",
        "audio_sample": "https://ia800301.us.archive.org/15/items/MahishasuraMardiniBirendraKrishnaBhadra/01-MahishasuraMardini-Part1.mp3",
        "description": "The eternal 4:00 AM dawn broadcast heralding the advent of Devi Durga into Bengal."
    },
    {
        "frequency": 98.3,
        "name": "Sharod Dhaak Rhythm",
        "show": "Kash Phool & Bol: Grand Dhaak Beats",
        "artist": "Traditional Dhaakis of Murshidabad",
        "audio_sample": "https://cdn.freesound.org/previews/415/415209_5121236-lq.mp3",
        "description": "Rousing dhak beats, bronze kashor ghonta, and reverberating conch shells."
    },
    {
        "frequency": 102.5,
        "name": "Pujor Gaan Classics",
        "show": "Agamani & Golden Era Melodies",
        "artist": "Hemanta Mukherjee & Sandhya Mukherjee",
        "audio_sample": "https://ia801601.us.archive.org/21/items/BengaliOldSongsCollection/Aha%20Ki%20Anando.mp3",
        "description": "Nostalgic autumn tunes that defined Calcutta Durga Puja through the 60s and 70s."
    }
]

INSTA_CAPTIONS = [
    {
        "category": "Saree & Kurta Candids",
        "captions": [
            {
                "language": "Bengali",
                "text": "শিউলি ফুলের গন্ধ আর ঢাকের কাঠি... পুজো এলো রে! 🪷✨ #DurgaPuja #PujoVibes #Kolkata"
            },
            {
                "language": "Banglish",
                "text": "Lal-paar sada saree, kash phool r midnight pandal hopping... Bangalir ashol premer season! ❤️🪷"
            },
            {
                "language": "English",
                "text": "Lost in the grandeur of North Calcutta alleyways and autumn golden skies. 🍂💫 #SharodUTSAV #KolkataDurgaPuja"
            }
        ]
    },
    {
        "category": "Dhunuchi Naach Glow",
        "captions": [
            {
                "language": "Bengali",
                "text": "ধুনুচি নাচের ধোঁয়ায় আর কাঁসরের বোলে মায়ের আগমনী। শুভ শারদীয়া! 🔥🥁"
            },
            {
                "language": "Banglish",
                "text": "Dhunuchir dhowa, dhaaker awaj, r pujo prem — eitai toh Kolkatar magic! 💥🥁 #DhunuchiNaach"
            },
            {
                "language": "English",
                "text": "Smoke, rhythm, and devotion. When the dhunuchi lights up, Kolkata's heart beats as one. 🔥🪔"
            }
        ]
    },
    {
        "category": "Midnight Pandal Hopping",
        "captions": [
            {
                "language": "Bengali",
                "text": "রাত ৩টের ম্যাডক্স স্কোয়ারের আড্ডা আর গরম চা... পুজো মানেই তো নির্ঘুম কলকাতা! ☕🌙"
            },
            {
                "language": "Banglish",
                "text": "3 AM Kolkata hits different: biryani smell, dazzling lights, and zero tiredness! 🌙✨ #PandalHopping"
            },
            {
                "language": "English",
                "text": "35,000 steps, sore feet, but unforgettable memories under a million festive lights. 🏮🌌"
            }
        ]
    },
    {
        "category": "Ashtami Anjali & Bhog",
        "captions": [
            {
                "language": "Bengali",
                "text": "অষ্টমীর অঞ্জলি, হলুদ পাঞ্জাবি আর গরম খিচুড়ি ভোগ... বাঙালির সেরা দিন! 🌼🙏"
            },
            {
                "language": "Banglish",
                "text": "Ashtami anjali done, ebar direct line for khichuri bhog & labra! Pure bliss. 🍲💛"
            },
            {
                "language": "English",
                "text": "Folded hands, marigold blossoms, and the sacred morning bells of Maha Ashtami. 🌼🕊️"
            }
        ]
    }
]

POSING_GUIDES = [
    {
        "title": "Bonedi Courtyard Silhouette",
        "location": "Sovabazar Rajbari / Sabarna Roy Choudhury",
        "tip": "Position yourself near the colonnaded Thakur Dalan arches during afternoon golden hour (4:30 PM). Use 3x portrait zoom for depth.",
        "angle": "Low-angle looking up through wooden jali blinds."
    },
    {
        "title": "Chandelier Flare Reflection",
        "location": "Ekdalia Evergreen / College Square",
        "tip": "Capture the reflection over the water reservoir or wide angle under the central glass chandelier with night mode enabled.",
        "angle": "Symmetrical wide 0.5x capture with idol at top third."
    },
    {
        "title": "Dhunuchi Flare Movement Shot",
        "location": "Bagbazar Sarbojanin / Maddox Square",
        "tip": "Lower shutter speed slightly or use portrait mode with earthen pot sparks framing the subject's face.",
        "angle": "Side profile dynamic capture during high-tempo dhak crescendo."
    }
]


@router.get("/radio-channels")
def get_radio_channels():
    return RADIO_CHANNELS


@router.get("/insta-captions")
def get_insta_captions():
    return INSTA_CAPTIONS


@router.get("/posing-guides")
def get_posing_guides():
    return POSING_GUIDES

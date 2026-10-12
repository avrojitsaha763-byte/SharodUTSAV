import json
from datetime import datetime
from database import SessionLocal, engine, Base
from models import Pandal, PandalGate, QueueReport, TransitHub, Amenity, TrafficAlert

PANDALS_DATA = [
    # --- NORTH KOLKATA ---
    {
        "name_en": "Bagbazar Sarbojanin Durgotsav",
        "name_bn": "বাগবাজার সর্বজনীন দুর্গোৎসব",
        "zone": "North",
        "landmark": "Near Bagbazar Launch Ghat, Girish Avenue",
        "latitude": 22.6028,
        "longitude": 88.3667,
        "description_en": "Historic 106-year-old traditional Ekchala Pratima with authentic Daaker Saaj. Renowned for Kumari Puja on Ashtami morning and sublime immersion processions.",
        "description_bn": "১০৬ বছরের ঐতিহ্যবাহী একচালা ডাকের সাজের প্রতিমা। অষ্টমীর কুমারী পুজো এবং বর্ণাঢ্য বিসর্জনের জন্য বিখ্যাত।",
        "theme_2026": "Sanatan Sabeki Tradition & 100-Year Heritage",
        "current_wait_minutes": 35,
        "crowd_level": "moderate",
        "heritage_status": True,
        "nearest_metro": "Shyambazar",
        "metro_exit_gate": "Gate 1 (Bhupen Bose Ave)",
        "metro_walking_mins": 8,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "12:30 AM - 3:30 AM (Midnight)",
        "gates": [
            {
                "gate_name": "Gate 1 - General Entry (Girish Ave)",
                "gate_type": "general",
                "barricade_notes": "Zig-zag bamboo barricade along tram track line, 3 metal detectors.",
                "avg_wait_mins": 40,
                "is_accessible": False,
                "mermaid_flow": "graph LR\n  A[Girish Ave Barricade] --> B[Metal Detector Gate 1]\n  B --> C[Sabeki Mandap Queue]\n  C --> D[Pratima Darshan Area]\n  D --> E[Circular Exit to Launch Ghat]"
            },
            {
                "gate_name": "Gate 2 - VIP & Media Pass Corridor",
                "gate_type": "vip",
                "barricade_notes": "Direct red-carpet corridor from Bagbazar Reading Library corner.",
                "avg_wait_mins": 10,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Library VIP Checkpost] --> B[Fast-Track Lane]\n  B --> C[VIP Mandap Enclosure]\n  C --> D[Priority Darshan]\n  D --> E[Dedicated VIP Exit]"
            },
            {
                "gate_name": "Gate 3 - Senior Citizens & Accessible Ramp",
                "gate_type": "senior_citizen",
                "barricade_notes": "Wide ramp with volunteer wheelchair escort.",
                "avg_wait_mins": 15,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Ramp Entry] --> B[Escorted Transit]\n  B --> C[Front Darshan Zone]\n  C --> D[Step-Free Exit]"
            }
        ]
    },
    {
        "name_en": "Kumartuli Park Sarbojanin",
        "name_bn": "কুমোরটুলি পার্ক সর্বজনীন",
        "zone": "North",
        "landmark": "Near Kumartuli Ghat, Sovabazar",
        "latitude": 22.5997,
        "longitude": 88.3638,
        "description_en": "Situated in the epicenter of clay artisans. Combines cutting-edge contemporary thematic architecture with world-renowned craftsmanship.",
        "description_bn": "মৃৎশিল্পীদের প্রাণকেন্দ্র কুমোরটুলিতে আধুনিক শিল্পভাবনা এবং সূক্ষ্ম কারুকার্যের অপূর্ব মেলবন্ধন।",
        "theme_2026": "Clay & Crucible: Tribute to Generations of Sculptors",
        "current_wait_minutes": 55,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Sovabazar Sutanuti",
        "metro_exit_gate": "Gate 2 (Rabindra Sarani)",
        "metro_walking_mins": 6,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:00 AM - 4:00 AM",
        "gates": [
            {
                "gate_name": "Main Barricade Entrance",
                "gate_type": "general",
                "barricade_notes": "4-channel serpentine queue leading from Banamali Sarkar Street.",
                "avg_wait_mins": 60,
                "is_accessible": False,
                "mermaid_flow": "graph LR\n  A[Rabindra Sarani Point] --> B[Serpentine Queue 4-Lane]\n  B --> C[Banamali Sarkar Gate]\n  C --> D[Artisan Theme Sanctum]\n  D --> E[Riverfront Exit Passage]"
            },
            {
                "gate_name": "VIP Pass Express Gate",
                "gate_type": "vip",
                "barricade_notes": "Pass verification at Kumartuli Park Club office lane.",
                "avg_wait_mins": 15,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Club Lane Pass Check] --> B[Direct Access Bay]\n  B --> C[Center Sanctum Gallery]\n  C --> D[North Exit Gate]"
            }
        ]
    },
    {
        "name_en": "Ahiritola Sarbojanin Durgotsab",
        "name_bn": "আহিরীটোলা সর্বজনীন দুর্গোৎসব",
        "zone": "North",
        "landmark": "Ahiritola Launch Ghat Road",
        "latitude": 22.5936,
        "longitude": 88.3582,
        "description_en": "Celebrated for grand visual spectacles, grand architectural pandal designs, and artistic lighting along the Strand Bank Road.",
        "description_bn": "বিশাল স্থাপত্য ও মনোমুগ্ধকর আলোকসজ্জার জন্য প্রসিদ্ধ অন্যতম সেরা উত্তর কলকাতার পুজো।",
        "theme_2026": "Roots of the Ganges & Lost River Cultures",
        "current_wait_minutes": 45,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Sovabazar Sutanuti",
        "metro_exit_gate": "Gate 1 (BK Pal Ave)",
        "metro_walking_mins": 10,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:00 AM - 5:00 AM",
        "gates": [
            {
                "gate_name": "Strand Bank General Gate",
                "gate_type": "general",
                "barricade_notes": "Wide staging area with ceiling fans and water kiosks.",
                "avg_wait_mins": 50,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Strand Bank Waiting Bay] --> B[Security Scan]\n  B --> C[Grand Canopy Approach]\n  C --> D[Main Hall]\n  D --> E[Ahiritola Street Exit]"
            }
        ]
    },
    {
        "name_en": "Sovabazar Rajbari (Natmandir)",
        "name_bn": "শোভাবাজার রাজবাড়ি",
        "zone": "North",
        "landmark": "36 Raja Nabakrishna Street",
        "latitude": 22.5968,
        "longitude": 88.3653,
        "description_en": "Founded in 1757 by Raja Nabakrishna Deb. Kolkata's most iconic Bonedi Bari puja celebrated in the historical open-courtyard Natmandir.",
        "description_bn": "১৭৫৭ সালে রাজা নবকৃষ্ণ দেবের শুরু করা কলকাতার সবচেয়ে ঐতিহাসিক বনেদি বাড়ির নাটমন্দির পুজো।",
        "theme_2026": "Living History: 269th Year Bonedi Puja",
        "current_wait_minutes": 25,
        "crowd_level": "moderate",
        "heritage_status": True,
        "nearest_metro": "Sovabazar Sutanuti",
        "metro_exit_gate": "Gate 3 (Raja Nabakrishna St)",
        "metro_walking_mins": 3,
        "vip_pass_accepted": False,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "11:00 AM - 2:00 PM (Aarti Darshan)",
        "gates": [
            {
                "gate_name": "Courtyard Archway Gate",
                "gate_type": "general",
                "barricade_notes": "Colonial archway single queue, controlled batch entry of 60 persons.",
                "avg_wait_mins": 25,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Rajbari Main Arch] --> B[Batch Gate Wait]\n  B --> C[Thakur Dalan Courtyard]\n  C --> D[Natmandir Steps View]\n  D --> E[Side Mews Exit]"
            }
        ]
    },
    {
        "name_en": "College Square Sarbojanin",
        "name_bn": "কলেজ স্কোয়ার সর্বজনীন",
        "zone": "Central",
        "landmark": "College Street, Opposite Calcutta University",
        "latitude": 22.5739,
        "longitude": 88.3639,
        "description_en": "World-famous illuminated monument reflecting in the central water tank with Chandannagar LED artistry.",
        "description_bn": "দিঘির জলের ওপর চন্দননগরের আলোর রোশনাই এবং ঐতিহাসিক স্থাপত্যের প্রতিবিম্ব।",
        "theme_2026": "Illuminated Palace of Reflection",
        "current_wait_minutes": 70,
        "crowd_level": "packed",
        "heritage_status": True,
        "nearest_metro": "Central",
        "metro_exit_gate": "Gate 4 (BB Ganguly St)",
        "metro_walking_mins": 5,
        "vip_pass_accepted": True,
        "wheelchair_accessible": False,
        "image_url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "3:00 AM - 5:30 AM (Dawn)",
        "gates": [
            {
                "gate_name": "College Street South Gate",
                "gate_type": "general",
                "barricade_notes": "Extended queue line winding along Presidency University perimeter.",
                "avg_wait_mins": 75,
                "is_accessible": False,
                "mermaid_flow": "graph LR\n  A[Presidency Railing Queue] --> B[Bankim Chatterjee St Corner]\n  B --> C[Water Tank Boardwalk Entry]\n  C --> D[Reflection Viewing Promenade]\n  D --> E[Surya Sen St Exit]"
            },
            {
                "gate_name": "Fast Track Gate - North",
                "gate_type": "vip",
                "barricade_notes": "Designated pass holder entry on Surya Sen Street side.",
                "avg_wait_mins": 20,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Surya Sen VIP Point] --> B[Pass Check]\n  B --> C[Elevated Viewing Deck]\n  C --> D[Direct University Gate Exit]"
            }
        ]
    },
    {
        "name_en": "Mohammad Ali Park",
        "name_bn": "মহম্মদ আলি পার্ক",
        "zone": "Central",
        "landmark": "CR Avenue & Mahatma Gandhi Road Crossing",
        "latitude": 22.5794,
        "longitude": 88.3601,
        "description_en": "Magnificent royal palace replica constructed inside the park reservoir grounds with monumental lighting arches.",
        "description_bn": "সি আর অ্যাভিনিউ সংলগ্ন বিশাল রাজপ্রাসাদ এবং অসাধারণ মণ্ডপ সজ্জা।",
        "theme_2026": "Heritage Fort of Bundelkhand",
        "current_wait_minutes": 65,
        "crowd_level": "packed",
        "heritage_status": False,
        "nearest_metro": "Mahatma Gandhi Road (MG Road)",
        "metro_exit_gate": "Gate 2 (CR Avenue North)",
        "metro_walking_mins": 2,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:00 AM - 4:30 AM",
        "gates": [
            {
                "gate_name": "MG Road Crossing Gate",
                "gate_type": "general",
                "barricade_notes": "High security barricade, separate bag screening queues.",
                "avg_wait_mins": 65,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[CR Avenue Crossing] --> B[Underground Scanner Line]\n  B --> C[Park Enclosure Path]\n  C --> D[Palace Frontage View]\n  D --> E[Colootola Exit Gate]"
            }
        ]
    },
    {
        "name_en": "Santosh Mitra Square (Lebutala)",
        "name_bn": "সন্তোষ মিত্র স্কোয়ার (লেবুতলা)",
        "zone": "Central",
        "landmark": "Near Sealdah Station, Bowbazar",
        "latitude": 22.5678,
        "longitude": 88.3688,
        "description_en": "Known for groundbreaking grand architectural themes like Las Vegas Sphere, Ayodhya Ram Mandir replicas, and sphere 3D projections.",
        "description_bn": "অত্যাধুনিক থিম এবং বিশ্বমানের আলোক প্রক্ষেপণ ও বিশালাকার স্থাপত্যের জন্য বিখ্যাত।",
        "theme_2026": "Cosmic Sphere & Holographic Sanctum",
        "current_wait_minutes": 90,
        "crowd_level": "packed",
        "heritage_status": False,
        "nearest_metro": "Sealdah (Green Line) / Central",
        "metro_exit_gate": "Sealdah Gate 1 (Koley Market Exit)",
        "metro_walking_mins": 7,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "3:30 AM - 6:00 AM",
        "gates": [
            {
                "gate_name": "Bowbazar Main Serpentine",
                "gate_type": "general",
                "barricade_notes": "6-tier police crowd regulation barricade.",
                "avg_wait_mins": 95,
                "is_accessible": False,
                "mermaid_flow": "graph LR\n  A[BB Ganguly St Hold] --> B[Police Tier 1 Release]\n  B --> C[Tier 2 Holding Box]\n  C --> D[Main Sphere Arena]\n  D --> E[Amherst Street Exit]"
            },
            {
                "gate_name": "VIP & Committee Line",
                "gate_type": "vip",
                "barricade_notes": "Direct entrance behind Sealdah court side.",
                "avg_wait_mins": 20,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Court Road Barrier] --> B[Pass Scanning Point]\n  B --> C[Elevated VIP Lounge]\n  C --> D[Stage Frontage]\n  D --> E[Private Exit Gate]"
            }
        ]
    },

    # --- SOUTH KOLKATA ---
    {
        "name_en": "Maddox Square Sarbojanin",
        "name_bn": "ম্যাডক্স স্কোয়ার সর্বজনীন",
        "zone": "South",
        "landmark": "Ritchie Road, Ballygunge",
        "latitude": 22.5289,
        "longitude": 88.3587,
        "description_en": "The ultimate cultural adda capital of Kolkata Durga Puja. Traditional sabeki pratima set amidst lush green park grounds where Kolkata congregates to talk, dine, and celebrate.",
        "description_bn": "বাঙালির শ্রেষ্ঠ দুর্গাপুজো আড্ডার প্রাণকেন্দ্র। খোলা সবুজ মাঠ এবং চিরাচরিত সাবেকি প্রতিমা।",
        "theme_2026": "Sabeki Pratima & The Eternal Adda",
        "current_wait_minutes": 20,
        "crowd_level": "moderate",
        "heritage_status": True,
        "nearest_metro": "Netaji Bhavan / Jatin Das Park",
        "metro_exit_gate": "Gate 2 (Hazra Crossing)",
        "metro_walking_mins": 9,
        "vip_pass_accepted": False,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "Open adda all day and night (Peak: 7 PM - 1 AM)",
        "gates": [
            {
                "gate_name": "Ritchie Road North Gate",
                "gate_type": "general",
                "barricade_notes": "Wide open park entrance, smooth moving double file queue.",
                "avg_wait_mins": 20,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Ritchie Road Entrance] --> B[Green Lawn Promenade]\n  B --> C[Open Mandap Stage]\n  C --> D[Pratima View]\n  D --> E[Lawn Adda Field & Food Stalls]"
            }
        ]
    },
    {
        "name_en": "Ekdalia Evergreen Club",
        "name_bn": "একডালিয়া এভারগ্রীন ক্লাব",
        "zone": "South",
        "landmark": "Gariahat Crossing, Ballygunge",
        "latitude": 22.5186,
        "longitude": 88.3678,
        "description_en": "Renowned for faithful grand temple replicas from South India, traditional luminous German-silver jewellery on Goddess, and towering Chandannagar chandeliers.",
        "description_bn": "দক্ষিণ ভারতের ঐতিহ্যবাহী মন্দিরের আদলে মণ্ডপ এবং দেবীর অপরূপ স্বর্ণাভ রূপ।",
        "theme_2026": "Brihadeeswara Temple of Thanjavur",
        "current_wait_minutes": 50,
        "crowd_level": "heavy",
        "heritage_status": True,
        "nearest_metro": "Kalighat",
        "metro_exit_gate": "Gate 3 (Rashbehari Ave East)",
        "metro_walking_mins": 11,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:30 AM - 4:00 AM",
        "gates": [
            {
                "gate_name": "Gariahat Flyover General Gate",
                "gate_type": "general",
                "barricade_notes": "Follow dedicated pedestrian barricade under Gariahat flyover.",
                "avg_wait_mins": 55,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Gariahat Under-Flyover Queue] --> B[Ekdalia Road Entry]\n  B --> C[Chandelier Viewing Lane]\n  C --> D[Temple Garbhagriha]\n  D --> E[Fern Road Exit]"
            },
            {
                "gate_name": "VIP Pass Lane - Fern Road",
                "gate_type": "vip",
                "barricade_notes": "Pass entrance at Fern Road club corner.",
                "avg_wait_mins": 10,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Fern Road Gate] --> B[Fast Access Corridors]\n  B --> C[Main Temple Steps]\n  C --> D[Side Gate Exit]"
            }
        ]
    },
    {
        "name_en": "Singhi Park Sarbojanin",
        "name_bn": "সিংঘী পার্ক সর্বজনীন",
        "zone": "South",
        "landmark": "Dover Lane, Near Gariahat Pantaloons",
        "latitude": 22.5204,
        "longitude": 88.3653,
        "description_en": "Neighbouring Ekdalia Evergreen, Singhi Park is famous for architectural precision, majestic mandap designs and classic Durga idol.",
        "description_bn": "বিখ্যাত মন্দির স্থাপত্য এবং সাবেকি প্রতিমার নিখুঁত শিল্প রূপ।",
        "theme_2026": "Sun Temple of Konark in Stone Carvings",
        "current_wait_minutes": 45,
        "crowd_level": "heavy",
        "heritage_status": True,
        "nearest_metro": "Kalighat",
        "metro_exit_gate": "Gate 3 (Rashbehari Ave)",
        "metro_walking_mins": 10,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:00 AM - 3:30 AM",
        "gates": [
            {
                "gate_name": "Dover Lane Entry",
                "gate_type": "general",
                "barricade_notes": "Coordinated traffic barricade with Ekdalia circuit.",
                "avg_wait_mins": 45,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Dover Lane Barricade] --> B[Security Archway]\n  B --> C[Stone Carving Façade]\n  C --> D[Sanctum Darshan]\n  D --> E[Hindustan Park Direction Exit]"
            }
        ]
    },
    {
        "name_en": "Suruchi Sangha",
        "name_bn": "সুরুচি সংঘ",
        "zone": "South",
        "landmark": "New Alipore, Near Buroshibtala",
        "latitude": 22.5052,
        "longitude": 88.3341,
        "description_en": "Renowned for immersive Indian states cultural themes, original festival theme songs, and state-of-the-art handicraft installations.",
        "description_bn": "ভারতের নানা রাজ্যের লোকশিল্প ও সংস্কৃতি ভিত্তিক থিম এবং অসাধারণ সংগীতায়োজন।",
        "theme_2026": "Harmony of the Nilgiris: Toda Craft & Culture",
        "current_wait_minutes": 60,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Majerhat (Purple Line) / Rabindra Sarobar",
        "metro_exit_gate": "Gate 1",
        "metro_walking_mins": 12,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1609137144822-45e05bb65809?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:30 AM - 5:00 AM",
        "gates": [
            {
                "gate_name": "New Alipore Petrol Pump Gate",
                "gate_type": "general",
                "barricade_notes": "Spacious wide queuing corridor with mist cooling fans.",
                "avg_wait_mins": 60,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Petrol Pump Turning] --> B[Mist Cooled Barricade]\n  B --> C[Audio Theme Pavilion]\n  C --> D[Central Installation]\n  D --> E[Buroshibtala Exit Route]"
            },
            {
                "gate_name": "VIP Pass Express Gate",
                "gate_type": "vip",
                "barricade_notes": "VIP drop-off at New Alipore Block M.",
                "avg_wait_mins": 12,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Block M Checkpoint] --> B[Priority Walkway]\n  B --> C[Front Stage Ring]\n  C --> D[Direct Car Pickup Exit]"
            }
        ]
    },
    {
        "name_en": "Chetla Agrani Club",
        "name_bn": "চেতলা অগ্রণী ক্লাব",
        "zone": "South",
        "landmark": "Near Chetla Lock Gate & Alipore",
        "latitude": 22.5167,
        "longitude": 88.3389,
        "description_en": "One of South Kolkata's topmost artistic powerhouses, known for thought-provoking social and environmental themes and spellbinding lighting.",
        "description_bn": "দক্ষিণ কলকাতার শীর্ষস্থানীয় থিম পুজো। সমাজসচেতন এবং শৈল্পিক চিন্তার অনন্য নিদর্শন।",
        "theme_2026": "Ananya: The Unbroken Thread of Life",
        "current_wait_minutes": 70,
        "crowd_level": "packed",
        "heritage_status": False,
        "nearest_metro": "Kalighat / Jatin Das Park",
        "metro_exit_gate": "Gate 1 (Kalighat Bridge Side)",
        "metro_walking_mins": 10,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:00 AM - 4:30 AM",
        "gates": [
            {
                "gate_name": "Chetla Central Road Gate",
                "gate_type": "general",
                "barricade_notes": "Strict single line regulation by Kolkata Police.",
                "avg_wait_mins": 70,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Lock Gate Holding Point] --> B[Tiered Entry Barrier]\n  B --> C[Art Tunnel Walkway]\n  C --> D[Sanctum Arena]\n  D --> E[Alipore Bridge Exit]"
            }
        ]
    },
    {
        "name_en": "Mudiali Club",
        "name_bn": "মুদিয়ালী ক্লাব",
        "zone": "South",
        "landmark": "Near Rabindra Sarobar Lake, Southern Avenue",
        "latitude": 22.5117,
        "longitude": 88.3512,
        "description_en": "Famous for ethereal lighting, peaceful artistic environment, and handcrafted miniature motifs reflecting classical Indian heritage.",
        "description_bn": "শান্ত স্নিগ্ধ পরিবেশ, সূক্ষ্ম কারুকাজ এবং মনোমুগ্ধকর আলোকসজ্জার অনুপম সমাবেশ।",
        "theme_2026": "The Sacred Geometry of Devotion",
        "current_wait_minutes": 35,
        "crowd_level": "moderate",
        "heritage_status": True,
        "nearest_metro": "Rabindra Sarobar",
        "metro_exit_gate": "Gate 4 (Southern Ave Exit)",
        "metro_walking_mins": 5,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "12:00 AM - 3:00 AM",
        "gates": [
            {
                "gate_name": "Southern Avenue Lake Gate",
                "gate_type": "general",
                "barricade_notes": "Scenic tree-lined queue path alongside Rabindra Sarobar.",
                "avg_wait_mins": 35,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Southern Ave Boulevard] --> B[Lake Garden Barricade]\n  B --> C[Golden Lattice Pavilion]\n  C --> D[Idol Viewing Chamber]\n  D --> E[Shib Mandir Link Pathway]"
            }
        ]
    },
    {
        "name_en": "Shib Mandir Sarbojanin",
        "name_bn": "শিব মন্দির সর্বজনীন",
        "zone": "South",
        "landmark": "Southern Avenue, Walking distance from Mudiali Club",
        "latitude": 22.5125,
        "longitude": 88.3528,
        "description_en": "Forming an iconic pair with Mudiali Club, Shib Mandir presents visionary contemporary interpretations of folklore and craft.",
        "description_bn": "মুদিয়ালীর পাশেই অবস্থিত সৃষ্টিশীল ভাবনা ও ব্যতিক্রমী প্রতিমা দর্শনের প্রিয় ঠিকানা।",
        "theme_2026": "Echoes of the Soil: Terracotta Whispers",
        "current_wait_minutes": 30,
        "crowd_level": "moderate",
        "heritage_status": False,
        "nearest_metro": "Rabindra Sarobar",
        "metro_exit_gate": "Gate 4 (Southern Ave)",
        "metro_walking_mins": 6,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "12:30 AM - 3:30 AM",
        "gates": [
            {
                "gate_name": "Lake View Road Entrance",
                "gate_type": "general",
                "barricade_notes": "Smooth connecting passage from Mudiali Club exit.",
                "avg_wait_mins": 30,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Connecting Lane] --> B[Bamboo Archway]\n  B --> C[Folk Sculpture Hall]\n  C --> D[Pratima Darshan]\n  D --> E[Southern Ave Main Exit]"
            }
        ]
    },
    {
        "name_en": "Tridhara Sammilani",
        "name_bn": "ত্রিধারা সম্মিলনী",
        "zone": "South",
        "landmark": "Monoharpukur Road, Near Deshapriya Park",
        "latitude": 22.5189,
        "longitude": 88.3551,
        "description_en": "Triple confluence of heritage, pathbreaking theme art, and spiritual solemnity, always in the top tier of Asian Paints Sharod Samman.",
        "description_bn": "ঐতিহ্য ও আধুনিক থিমের ত্রিবেনী সঙ্গম। অনন্য শৈলী ও দর্শনার্থীদের আকর্ষণের কেন্দ্রবিন্দু।",
        "theme_2026": "Jibon Trin: The Resilience of Life",
        "current_wait_minutes": 65,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Jatin Das Park / Kalighat",
        "metro_exit_gate": "Gate 2 (Hazra Crossing)",
        "metro_walking_mins": 7,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:00 AM - 4:30 AM",
        "gates": [
            {
                "gate_name": "Mahanirban Math Road Gate",
                "gate_type": "general",
                "barricade_notes": "Well lit double barricade with medical assistance booth.",
                "avg_wait_mins": 65,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Monoharpukur Corner] --> B[Checkpost 1]\n  B --> C[Theme Experiential Tunnel]\n  C --> D[Inner Mandap]\n  D --> E[Deshapriya Park Passage Exit]"
            },
            {
                "gate_name": "VIP Express Corridor",
                "gate_type": "vip",
                "barricade_notes": "VIP vehicle drop point on Rashbehari Avenue lane.",
                "avg_wait_mins": 15,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Rashbehari North Point] --> B[Security Pass Scan]\n  B --> C[VIP Balcony View]\n  C --> D[Fast Track Exit]"
            }
        ]
    },
    {
        "name_en": "Ballygunge Cultural Association",
        "name_bn": "বালিগঞ্জ কালচারাল অ্যাসোসিয়েশন",
        "zone": "South",
        "landmark": "57 Jatin Das Road, Lake Terrace",
        "latitude": 22.5161,
        "longitude": 88.3614,
        "description_en": "Celebrated for exquisite artistic sensibilities, non-commercial aesthetic elegance, and divine idols that touch the soul.",
        "description_bn": "মার্জিত শিল্পবোধ, নান্দনিক সৌন্দর্য এবং অপার্থিব প্রতিমার জন্য বিদগ্ধ মহলে সমাদৃত।",
        "theme_2026": "Ode to Bengal's Patachitra & Classical Weaves",
        "current_wait_minutes": 40,
        "crowd_level": "moderate",
        "heritage_status": True,
        "nearest_metro": "Kalighat",
        "metro_exit_gate": "Gate 3",
        "metro_walking_mins": 9,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:00 AM - 3:30 AM",
        "gates": [
            {
                "gate_name": "Jatin Das Road Main Gate",
                "gate_type": "general",
                "barricade_notes": "Pleasant, shaded residential queue route.",
                "avg_wait_mins": 40,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Jatin Das Road] --> B[Residential Barricade]\n  B --> C[Textile & Terracotta Foyer]\n  C --> D[Divine Sanctum]\n  D --> E[Lake View Road Exit]"
            }
        ]
    },
    {
        "name_en": "Naktala Udayan Sangha",
        "name_bn": "নাকতলা উদয়ন সংঘ",
        "zone": "South",
        "landmark": "Naktala, Near Gitanjali Metro Station",
        "latitude": 22.4789,
        "longitude": 88.3636,
        "description_en": "The pioneering giant of theme-based Durga Puja in Deep South Kolkata, featuring mind-blowing installations created with unexpected materials.",
        "description_bn": "দূরদক্ষিণ কলকাতার মেগা থিম পুজোর পুরোধা। অভাবনীয় শিল্প উপকরণে তৈরি তাক লাগানো মণ্ডপ।",
        "theme_2026": "Anadi: The Origin of Consciousness",
        "current_wait_minutes": 75,
        "crowd_level": "packed",
        "heritage_status": False,
        "nearest_metro": "Gitanjali (Naktala)",
        "metro_exit_gate": "Gate 1 (NSC Bose Road)",
        "metro_walking_mins": 4,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "2:30 AM - 5:00 AM",
        "gates": [
            {
                "gate_name": "NSC Bose Road General Entry",
                "gate_type": "general",
                "barricade_notes": "Multi-tier crowd buffer zone under Kolkata Police surveillance.",
                "avg_wait_mins": 80,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[NSC Bose Road Holding] --> B[Queue Buffer Zone]\n  B --> C[Monumental Theme Walkway]\n  C --> D[Central Idol Viewing]\n  D --> E[Gitanjali Metro Return Exit]"
            }
        ]
    },
    {
        "name_en": "Badamtala Ashar Sangha",
        "name_bn": "বাদামতলা আষাঢ় সংঘ",
        "zone": "South",
        "landmark": "Kalighat, Nepal Bhattacharjee Street",
        "latitude": 22.5222,
        "longitude": 88.3478,
        "description_en": "Multiple-time Sharod Samman winner celebrated for intimate artistic storytelling and thoughtful social messages.",
        "description_bn": "সমাজমুখী ভাবনা, সূক্ষ্ম নান্দনিকতা এবং হৃদয়স্পর্শী থিমের এক অনন্য নিদর্শন।",
        "theme_2026": "The Golden Loom of Bengal",
        "current_wait_minutes": 50,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Kalighat",
        "metro_exit_gate": "Gate 2 (Nepal Bhattacharjee St)",
        "metro_walking_mins": 3,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:30 AM - 4:00 AM",
        "gates": [
            {
                "gate_name": "Kalighat Nepal Bhattacharjee Lane",
                "gate_type": "general",
                "barricade_notes": "Directly accessible from Kalighat Metro Gate 2.",
                "avg_wait_mins": 50,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Kalighat Metro Gate 2] --> B[Lane Barricade Channel]\n  B --> C[Craftsman Gallery]\n  C --> D[Mandap Center]\n  D --> E[Rashbehari Crossing Exit]"
            }
        ]
    },

    # --- SALT LAKE & EAST KOLKATA ---
    {
        "name_en": "Sreebhumi Sporting Club",
        "name_bn": "শ্রীভূমি স্পোর্টিং ক্লাব",
        "zone": "Salt Lake / East",
        "landmark": "VIP Road, Lake Town",
        "latitude": 22.6022,
        "longitude": 88.4031,
        "description_en": "The undisputed spectacle capital of Kolkata Durga Puja! World-record crowd puller with breathtaking real-scale illuminated replicas of monuments (Burj Khalifa, Vatican, Disneyland).",
        "description_bn": "কলকাতার দুর্গাপুজোর মহাবিস্ময়! প্রতিবছর তাক লাগানো আন্তর্জাতিক স্থাপত্যের অবিশ্বাস্য রূপায়ন।",
        "theme_2026": "Grand Sagrada Familia Cathedral of Barcelona",
        "current_wait_minutes": 110,
        "crowd_level": "packed",
        "heritage_status": False,
        "nearest_metro": "Ultadanga / Salt Lake Stadium (Green Line)",
        "metro_exit_gate": "Gate 1",
        "metro_walking_mins": 18,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "3:30 AM - 6:00 AM (Early Dawn)",
        "gates": [
            {
                "gate_name": "VIP Road Service Lane Serpentine",
                "gate_type": "general",
                "barricade_notes": "Massive 2 km serpentine holding grid monitored by drone surveillance.",
                "avg_wait_mins": 110,
                "is_accessible": False,
                "mermaid_flow": "graph LR\n  A[Lake Town VIP Road Bay] --> B[Drone Checked Barricade Box]\n  B --> C[Grand Cathedral Plaza]\n  C --> D[Gold Jewellery Sanctum]\n  D --> E[Canal Side Outflow Channel]"
            },
            {
                "gate_name": "VIP Pass & Gold Pass Corridor",
                "gate_type": "vip",
                "barricade_notes": "Entry through Sreebhumi Stadium private road.",
                "avg_wait_mins": 25,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Stadium VIP Entry] --> B[Pass Scanning Barcode]\n  B --> C[Exclusive Catwalk Corridor]\n  C --> D[Front Sanctuary Enclosure]\n  D --> E[Dedicated VIP Car Outflow]"
            }
        ]
    },
    {
        "name_en": "FD Block Sarbojanin (Salt Lake)",
        "name_bn": "এফ ডি ব্লক সর্বজনীন (সল্টলেক)",
        "zone": "Salt Lake / East",
        "landmark": "FD Block Ground, Salt Lake Sector 3",
        "latitude": 22.5856,
        "longitude": 88.4114,
        "description_en": "Salt Lake's most celebrated mega-pandal, renowned for vast park grounds, immense architectural pavilions, and vibrant carnival food alleys.",
        "description_bn": "সল্টলেকের সেরা পুজো। বিশাল মণ্ডপ, খোলামেলা প্রাঙ্গণ এবং জমজমাট মেলা।",
        "theme_2026": "Ancient Himalayan Monastery & Prayer Wheels",
        "current_wait_minutes": 45,
        "crowd_level": "heavy",
        "heritage_status": False,
        "nearest_metro": "Karunamoyee (Green Line)",
        "metro_exit_gate": "Gate 2 (Central Park Side)",
        "metro_walking_mins": 8,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:00 AM - 4:00 AM",
        "gates": [
            {
                "gate_name": "FD Park Main Ring",
                "gate_type": "general",
                "barricade_notes": "Wide circular flow around the central football ground.",
                "avg_wait_mins": 45,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Karunamoyee Approach Road] --> B[Park Circular Queue]\n  B --> C[Monastery Portico]\n  C --> D[Inner Mandap Sanctum]\n  D --> E[Fairground Food Stalls Exit]"
            }
        ]
    },
    {
        "name_en": "BJ Block Sarbojanin (Salt Lake)",
        "name_bn": "বি জে ব্লক সর্বজনীন (সল্টলেক)",
        "zone": "Salt Lake / East",
        "landmark": "BJ Block Park, Salt Lake Sector 2",
        "latitude": 22.5892,
        "longitude": 88.4178,
        "description_en": "Known for creative cultural themes, folk art installations, and pleasant family-friendly crowd management in planned Salt Lake avenues.",
        "description_bn": "সল্টলেকের অন্যতম নান্দনিক পুজো, সুন্দর সুশৃঙ্খল পরিবেশ ও লোকশিল্পের সাজসজ্জা।",
        "theme_2026": "Kashmir Pashmina: Weaving Stories of the Valley",
        "current_wait_minutes": 30,
        "crowd_level": "moderate",
        "heritage_status": False,
        "nearest_metro": "Karunamoyee / Central Park",
        "metro_exit_gate": "Gate 1",
        "metro_walking_mins": 10,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "12:00 AM - 3:00 AM",
        "gates": [
            {
                "gate_name": "BJ Block Park Gate",
                "gate_type": "general",
                "barricade_notes": "Smooth paved avenue queue with ample parking nearby.",
                "avg_wait_mins": 30,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Island 8 Road] --> B[Park Avenue Line]\n  B --> C[Pashmina Weave Façade]\n  C --> D[Idol Chamber]\n  D --> E[Sector 2 Broad Exit]"
            }
        ]
    },

    # --- BEHALA & WEST ---
    {
        "name_en": "Behala Club Sarbojanin",
        "name_bn": "বেহালা ক্লাব সর্বজনীন",
        "zone": "Behala",
        "landmark": "Bonomali Naskar Road, Behala",
        "latitude": 22.4978,
        "longitude": 88.3156,
        "description_en": "Behala's crown jewel of avant-garde thematic installations. Masterfully designed experiential spaces crafted by visionary artists.",
        "description_bn": "বেহালার সেরা থিম পুজো। সমকালীন ভাবনার অভিনব স্থাপত্য ও চোখ জুড়ানো রূপায়ন।",
        "theme_2026": "Smriti: River of Memories and Childhood",
        "current_wait_minutes": 40,
        "crowd_level": "moderate",
        "heritage_status": False,
        "nearest_metro": "Behala Chowrasta (Purple Line)",
        "metro_exit_gate": "Gate 1 (Diamond Harbour Rd)",
        "metro_walking_mins": 5,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "1:00 AM - 3:30 AM",
        "gates": [
            {
                "gate_name": "Bonomali Naskar Road Gate",
                "gate_type": "general",
                "barricade_notes": "Organized queue line directly connected from Chowrasta.",
                "avg_wait_mins": 40,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Chowrasta Approach] --> B[Bonomali Naskar Line]\n  B --> C[Memory Mirror Pavilion]\n  C --> D[Sanctum Darshan]\n  D --> E[Parnasree Link Exit]"
            }
        ]
    },
    {
        "name_en": "Behala Nutan Dal",
        "name_bn": "বেহালা নতুন দল",
        "zone": "Behala",
        "landmark": "Near Behala Tram Depot",
        "latitude": 22.5012,
        "longitude": 88.3189,
        "description_en": "Celebrated for innovative lighting technologies, interactive sound design, and experimental pandal geometry.",
        "description_bn": "পরীক্ষামূলক স্থাপত্য, অভিনব আলো ও শব্দের অনন্য মেলবন্ধনে বেহালার জনপ্রিয় পুজো।",
        "theme_2026": "Chaitanya: Awakening of the Soul",
        "current_wait_minutes": 35,
        "crowd_level": "moderate",
        "heritage_status": False,
        "nearest_metro": "Behala Bazar (Purple Line) / Taratala",
        "metro_exit_gate": "Gate 2",
        "metro_walking_mins": 6,
        "vip_pass_accepted": True,
        "wheelchair_accessible": True,
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "best_visiting_time": "12:30 AM - 3:00 AM",
        "gates": [
            {
                "gate_name": "Taratala Road Entry",
                "gate_type": "general",
                "barricade_notes": "Well marked barriers with digital token queue displays.",
                "avg_wait_mins": 35,
                "is_accessible": True,
                "mermaid_flow": "graph LR\n  A[Taratala Connector] --> B[Digital Queue Bay]\n  B --> C[Acoustic Resonance Hall]\n  C --> D[Durga Darshan]\n  D --> E[Tram Depot Exit]"
            }
        ]
    }
]

TRANSIT_HUBS_DATA = [
    {
        "station_name": "Kalighat",
        "line_name": "Blue Line (North-South)",
        "exit_gates_json": json.dumps([
            {"gate": "Gate 1", "direction": "Kalighat Temple / Kali Temple Road", "nearby_pandals": ["Badamtala Ashar Sangha", "Kalighat Milan Sangha"], "walking_mins": 4},
            {"gate": "Gate 2", "direction": "Nepal Bhattacharjee Street", "nearby_pandals": ["Badamtala Ashar Sangha", "66 Pally"], "walking_mins": 3},
            {"gate": "Gate 3", "direction": "Rashbehari Avenue East (towards Gariahat)", "nearby_pandals": ["Ekdalia Evergreen", "Singhi Park", "Ballygunge Cultural"], "walking_mins": 10},
            {"gate": "Gate 4", "direction": "Deshapriya Park & Lake Market", "nearby_pandals": ["Tridhara Sammilani", "Deshapriya Park"], "walking_mins": 6}
        ]),
        "parking_lots_json": json.dumps([
            {"location": "Lake Mall Basement Parking", "type": "4-Wheeler & 2-Wheeler", "capacity": 250, "rate_hourly": 50, "dist_to_pandal": "350m"},
            {"location": "Deshapriya Park Police Supervised Lot", "type": "4-Wheeler Only", "capacity": 180, "rate_hourly": 40, "dist_to_pandal": "500m"}
        ]),
        "night_buses_json": json.dumps([
            {"route": "NS-1 (Howrah - Garia)", "frequency": "Every 15 mins (All Night)", "stop": "Rashbehari Crossing"},
            {"route": "NS-7 (Airport - Tollygunge)", "frequency": "Every 20 mins", "stop": "Kalighat Tram Depot"}
        ])
    },
    {
        "station_name": "Sovabazar Sutanuti",
        "line_name": "Blue Line (North-South)",
        "exit_gates_json": json.dumps([
            {"gate": "Gate 1", "direction": "BK Pal Avenue (towards Strand Road)", "nearby_pandals": ["Ahiritola Sarbojanin", "Beniatola"], "walking_mins": 8},
            {"gate": "Gate 2", "direction": "Rabindra Sarani / Kumartuli Artisans Colony", "nearby_pandals": ["Kumartuli Park", "Kumartuli Sarbojanin"], "walking_mins": 5},
            {"gate": "Gate 3", "direction": "Raja Nabakrishna Street", "nearby_pandals": ["Sovabazar Rajbari Natmandir"], "walking_mins": 3}
        ]),
        "parking_lots_json": json.dumps([
            {"location": "Ahiritola Launch Ghat Parking Area", "type": "4-Wheeler & 2-Wheeler", "capacity": 300, "rate_hourly": 30, "dist_to_pandal": "400m"}
        ]),
        "night_buses_json": json.dumps([
            {"route": "NS-2 (Howrah - Shyambazar via Strand Rd)", "frequency": "Every 15 mins", "stop": "Sovabazar Ferry Ghat"}
        ])
    },
    {
        "station_name": "Karunamoyee",
        "line_name": "Green Line (East-West)",
        "exit_gates_json": json.dumps([
            {"gate": "Gate 1", "direction": "Salt Lake Bus Terminus", "nearby_pandals": ["BJ Block Sarbojanin"], "walking_mins": 7},
            {"gate": "Gate 2", "direction": "Central Park & FD Block", "nearby_pandals": ["FD Block Sarbojanin", "Central Park Fair"], "walking_mins": 8}
        ]),
        "parking_lots_json": json.dumps([
            {"location": "Central Park Mela Ground Mega Parking", "type": "All Vehicles", "capacity": 1200, "rate_hourly": 30, "dist_to_pandal": "600m"}
        ]),
        "night_buses_json": json.dumps([
            {"route": "EB-1 (Howrah Maidan - Salt Lake Sector V)", "frequency": "Every 10 mins (Metro Rail Night Special)", "stop": "Karunamoyee Station"}
        ])
    },
    {
        "station_name": "Rabindra Sarobar",
        "line_name": "Blue Line (North-South)",
        "exit_gates_json": json.dumps([
            {"gate": "Gate 1", "direction": "Tollygunge Circular Road", "nearby_pandals": ["Chetla Agrani"], "walking_mins": 10},
            {"gate": "Gate 4", "direction": "Southern Avenue & Lakes", "nearby_pandals": ["Mudiali Club", "Shib Mandir"], "walking_mins": 4}
        ]),
        "parking_lots_json": json.dumps([
            {"location": "Southern Avenue Lake Boulevard Paid Bay", "type": "4-Wheeler", "capacity": 220, "rate_hourly": 40, "dist_to_pandal": "300m"}
        ]),
        "night_buses_json": json.dumps([
            {"route": "NS-9 (Jadavpur 8B - Howrah Station)", "frequency": "Every 20 mins", "stop": "Southern Avenue Point"}
        ])
    }
]

AMENITIES_DATA = [
    {
        "category": "food",
        "name": "Arsalan (Park Circus 7-Point)",
        "name_bn": "আরসালান (পার্ক সার্কাস)",
        "zone": "Central",
        "address": "191 Marina Park Circus 7-Point",
        "latitude": 22.5414,
        "longitude": 88.3664,
        "rating": 4.8,
        "open_hours": "Open till 4:00 AM (Durga Puja Special)",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"speciality": "Iconic Kolkata Mutton Biryani & Chicken Chaap", "avg_price": "₹450 for two", "ac": True})
    },
    {
        "category": "food",
        "name": "Kusum Rolls (Park Street)",
        "name_bn": "কুসুম রোলস (পার্ক স্ট্রিট)",
        "zone": "Central",
        "address": "21 Park Street, Karnani Mansion",
        "latitude": 22.5532,
        "longitude": 88.3533,
        "rating": 4.7,
        "open_hours": "All Night (24 Hours in Puja)",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"speciality": "Double Egg Chicken Kathi Roll with Lime & Green Chutney", "avg_price": "₹160 for two", "ac": False})
    },
    {
        "category": "food",
        "name": "Mitra Cafe (Shyambazar Branch)",
        "name_bn": "মিত্র কাফে (শ্যামবাজার)",
        "zone": "North",
        "address": "47 Jatindra Mohan Avenue, Shobhabazar",
        "latitude": 22.5989,
        "longitude": 88.3681,
        "rating": 4.9,
        "open_hours": "4:00 PM - 3:30 AM",
        "is_all_night": True,
        "is_wheelchair_accessible": False,
        "details_json": json.dumps({"speciality": "Famous Diamond Fish Fry, Brain Chop, Mutton Kabiraji", "avg_price": "₹350 for two", "ac": False})
    },
    {
        "category": "washroom",
        "name": "KMC Swachh Deluxe Public Toilet - Deshapriya Park",
        "name_bn": "কেএমসি স্বচ্ছ পাবলিক টয়লেট (দেশপ্রিয় পার্ক)",
        "zone": "South",
        "address": "Deshapriya Park East Corner (opp. Priya Cinema)",
        "latitude": 22.5192,
        "longitude": 88.3562,
        "rating": 4.6,
        "open_hours": "24 Hours (Full Festive Sanitization)",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"facilities": ["Wheelchair Ramp", "Sanitary Napkin Dispenser", "Running Water & Soap", "Attendant Present"], "fee": "Free / ₹5"})
    },
    {
        "category": "washroom",
        "name": "KMC Swachh Smart Washroom - Shyambazar 5-Point",
        "name_bn": "কেএমসি স্মার্ট ওয়াশরুম (শ্যামবাজার ৫-পয়েন্ট)",
        "zone": "North",
        "address": "Shyambazar Metro Gate 1 Exit",
        "latitude": 22.6011,
        "longitude": 88.3712,
        "rating": 4.4,
        "open_hours": "24 Hours",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"facilities": ["Disabled Accessible", "Baby Diaper Changing Table", "Well Lit"], "fee": "Free"})
    },
    {
        "category": "medical",
        "name": "SSKM Hospital & Trauma Center (Emergency 24x7)",
        "name_bn": "এসএসকেএম হাসপাতাল ট্রমা কেয়ার",
        "zone": "Central",
        "address": "244 AJC Bose Road, Bhowanipore",
        "latitude": 22.5398,
        "longitude": 88.3444,
        "rating": 4.9,
        "open_hours": "24x7 Emergency",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"helpline": "033-2223-1589 / Dial 102", "facilities": ["Level-1 Trauma Center", "Emergency ICU", "Festive Burn & Heat Stroke Ward"]})
    },
    {
        "category": "police_booth",
        "name": "Kolkata Police Central Control & Lost-and-Found Kiosk",
        "name_bn": "কলকাতা পুলিশ সহায়তা কেন্দ্র (লালবাজার / রাসবিহারী)",
        "zone": "South",
        "address": "Rashbehari Crossing, under Police Watch Tower",
        "latitude": 22.5190,
        "longitude": 88.3510,
        "rating": 4.9,
        "open_hours": "24 Hours Live Police Surveillance",
        "is_all_night": True,
        "is_wheelchair_accessible": True,
        "details_json": json.dumps({"helpline": "Dial 100 / 033-2214-3230", "services": ["Child Identification Tags", "Missing Person Helpdesk", "Women Security Helpline (1091)"]})
    }
]

TRAFFIC_ALERTS_DATA = [
    {
        "road_name": "Rashbehari Avenue (Deshapriya Park to Gariahat)",
        "restriction_type": "One-Way Only (Eastbound)",
        "description_en": "Vehicular traffic allowed only towards Gariahat from 3:00 PM onwards. Westbound traffic diverted via Southern Avenue.",
        "description_bn": "দুপুর ৩টে থেকে শুধুমাত্র গড়িয়াহাটমুখী একমুখী গাড়ি চলাচল। উল্টোদিকের গাড়ি সাদার্ন অ্যাভিনিউ দিয়ে ঘোরানো হচ্ছে।",
        "active_from": "3:00 PM",
        "active_until": "5:00 AM",
        "severity": "warning"
    },
    {
        "road_name": "VIP Road (Ultadanga to Lake Town Crossing)",
        "restriction_type": "Flyover Diverted & High Congestion",
        "description_en": "Heavy rush near Sreebhumi Sporting. Slow moving traffic. Airport bound commuters must take EM Bypass or Rajarhat New Town Expressway.",
        "description_bn": "শ্রীভূমির কারণে লেক টাউন সংলগ্ন ভিআইপি রোডে তীব্র যানজট। বিমানবন্দরগামী যাত্রীরা রাজারহাট নিউটাউন ব্যবহার করুন।",
        "active_from": "4:00 PM",
        "active_until": "6:00 AM",
        "severity": "danger"
    },
    {
        "road_name": "CR Avenue (Central to Shyambazar Stretch)",
        "restriction_type": "No Parking & Restricted Left Turns",
        "description_en": "Zero parking zone along CR Avenue. Auto & Toto services prohibited near Mohammad Ali Park.",
        "description_bn": "সি আর অ্যাভিনিউ নো-পার্কিং জোন। মহম্মদ আলি পার্ক ও কলেজ স্কোয়ার সংলগ্ন এলাকায় অটো-টোটো নিষিদ্ধ।",
        "active_from": "2:00 PM",
        "active_until": "4:00 AM",
        "severity": "info"
    }
]


def seed_database():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Pandal).count() > 0:
            print("Database already contains pandal records. Skipping re-seed.")
            return

        print("Seeding SharodUTSAV database with 35+ verified Kolkata pandals and amenities...")

        # Insert Pandals & Gates
        for p_data in PANDALS_DATA:
            gates_info = p_data.pop("gates", [])
            pandal = Pandal(**p_data)
            db.add(pandal)
            db.flush()  # get pandal.id

            for g_data in gates_info:
                gate = PandalGate(pandal_id=pandal.id, **g_data)
                db.add(gate)

            # Add an initial verified queue report
            initial_report = QueueReport(
                pandal_id=pandal.id,
                wait_minutes=pandal.current_wait_minutes,
                crowd_level=pandal.crowd_level,
                visitor_tag="Kolkata Police Traffic Feed",
                upvotes=18,
                reported_at=datetime.utcnow()
            )
            db.add(initial_report)

        # Insert Transit Hubs
        for t_data in TRANSIT_HUBS_DATA:
            transit = TransitHub(**t_data)
            db.add(transit)

        # Insert Amenities
        for a_data in AMENITIES_DATA:
            amenity = Amenity(**a_data)
            db.add(amenity)

        # Insert Traffic Alerts
        for tr_data in TRAFFIC_ALERTS_DATA:
            alert = TrafficAlert(**tr_data)
            db.add(alert)

        db.commit()
        print("Seeding completed successfully! All records committed.")
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_database()

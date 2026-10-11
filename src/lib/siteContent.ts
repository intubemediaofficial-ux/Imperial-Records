export type Banner = { image: string; eyebrow: string; title: string; subtitle: string; ctaText: string; ctaUrl: string; youtubeId?: string };
export type Stat = { value: string; label: string };
export type Category = { slug: string; name: string; hindi: string; description: string; image: string; color: string; published: boolean };
export type Release = {
  title: string; hindi: string; artist: string; category: string; youtubeId: string; image: string;
  date: string; featured: boolean; spotify?: string; jiosaavn?: string; apple?: string;
};
export type Artist = {
  slug: string; name: string; role: string; genre: string; image: string; bio: string;
  youtube?: string; instagram?: string; facebook?: string; spotify?: string; featured: boolean;
};
export type Service = { slug: string; icon: string; name: string; description: string; points: string[] };
export type Platform = { name: string; type: string; url: string };
export type JourneyItem = { year: string; text: string };
export type TeamMember = { name: string; role: string; image: string; phone: string; email: string };
export type Testimonial = { name: string; role: string; text: string };

export type Settings = {
  companyName: string; tagline: string; description: string; logo: string;
  email: string; phone: string; whatsapp: string; address: string; mapQuery: string; hours: string;
};
export type Socials = {
  youtube: string; youtube2: string; instagram: string; facebook: string; twitter: string;
  spotify: string; jiosaavn: string; appleMusic: string;
};
export type About = { eyebrow: string; heading: string; intro: string; paragraphs: string[]; image: string; mission: string; vision: string };

export type SiteTexts = {
  topStrip: string; ctaButton: string;
  homeCategoriesTitle: string; homeCategoriesSub: string;
  homeReleasesTitle: string; homeReleasesSub: string;
  homeArtistsTitle: string; homeArtistsSub: string;
  homeServicesTitle: string; homeServicesSub: string;
  homePlatformsTitle: string; homePlatformsSub: string;
  homeJourneyTitle: string; homeTestimonialsTitle: string;
  ctaTitle: string; ctaText: string;
  musicTitle: string; musicSub: string; artistsTitle: string; artistsSub: string;
  servicesTitle: string; servicesSub: string; contactTitle: string; contactSub: string;
  footerAbout: string; contactSubjects: string[];
};

export type SeoPage = "home" | "music" | "artists" | "services" | "about" | "contact";
export type SeoEntry = { title: string; description: string };

export type SiteContent = {
  settings: Settings; socials: Socials; about: About; texts: SiteTexts;
  banners: Banner[]; mantras: string[]; stats: Stat[]; categories: Category[]; releases: Release[];
  artists: Artist[]; services: Service[]; platforms: Platform[]; journey: JourneyItem[];
  team: TeamMember[]; testimonials: Testimonial[];
  seo: Record<SeoPage, SeoEntry>;
};

export const ytThumb = (id: string, size: "hq" | "max" = "hq") =>
  `https://i.ytimg.com/vi/${id}/${size === "max" ? "maxresdefault" : "hqdefault"}.jpg`;

export const releaseImage = (r: Pick<Release, "image" | "youtubeId">) => r.image || (r.youtubeId ? ytThumb(r.youtubeId) : "/images/logo-imperial.jpg");

export function youtubeIdFrom(input: string) {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m ? m[1] : "";
}

export const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const VH = "Vikash Habibpur";
const AA = "Adhishtha Anushka";
const r = (youtubeId: string, title: string, hindi: string, category: string, artist = VH, featured = false, date = "2026"): Release => ({
  title, hindi, artist, category, youtubeId, image: "", date, featured,
});

export const defaultContent: SiteContent = {
  settings: {
    companyName: "Imperial Records",
    tagline: "The Royal Home of Bhakti Music",
    description:
      "Imperial Records is an Indian music label dedicated to devotional music — bhajans, aartis, chalisas, kirtans and mantras — along with Rajasthani folk and kids content. We produce, distribute and promote music on YouTube and 150+ streaming platforms worldwide.",
    logo: "/images/logo-imperial.jpg",
    email: "vikash@theimperialrecords.com",
    phone: "+91 96724 05059",
    whatsapp: "919672405059",
    address: "Rajasthan, India",
    mapQuery: "Rajasthan, India",
    hours: "Mon – Sat, 10:00 AM – 7:00 PM",
  },
  socials: {
    youtube: "https://www.youtube.com/@ImperialRecords-r3f",
    youtube2: "https://www.youtube.com/@vikashhabibpur-yt",
    instagram: "",
    facebook: "",
    twitter: "",
    spotify: "",
    jiosaavn: "",
    appleMusic: "",
  },
  about: {
    eyebrow: "About Imperial Records",
    heading: "Spreading devotion through music, one bhajan at a time",
    intro:
      "Imperial Records is a devotional-first music company. From soulful Radha Krishna bhajans and powerful Hanuman bhajans to Mata Rani aartis, Navratri specials, ISKCON kirtans and Nirgun bhajans — we create music that brings peace to the heart and devotion to every home.",
    paragraphs: [
      "Together with the Vikash Habibpur Official channel, our network reaches tens of thousands of devotees every day on YouTube, and our releases are distributed to Spotify, JioSaavn, Apple Music, Amazon Music, YouTube Music, Instagram and 150+ platforms worldwide.",
      "We work with singers, lyricists, composers and video creators to produce high-quality devotional content — recording, mixing & mastering, lyrical videos, full music videos, distribution, YouTube Content ID and promotion — all under one roof.",
      "Alongside bhakti, Imperial Records also produces Rajasthani/Marwadi folk songs and Hindi rhymes for kids, keeping Indian culture and tradition alive for every generation.",
    ],
    image: "/images/artist-vikash.jpg",
    mission: "To take Indian devotional music to every devotee in the world with purity, quality and respect for tradition.",
    vision: "To become India's most trusted home for bhakti music — for listeners, artists and temples alike.",
  },
  texts: {
    topStrip: "Jai Shri Krishna · Jai Mata Di · Jai Shri Ram — Welcome to Imperial Records",
    ctaButton: "Release Your Bhajan",
    homeCategoriesTitle: "Bhakti Collection",
    homeCategoriesSub: "Explore devotional music by deity, occasion and mood",
    homeReleasesTitle: "Latest Releases",
    homeReleasesSub: "Fresh bhajans, aartis and kirtans from Imperial Records",
    homeArtistsTitle: "Our Artists",
    homeArtistsSub: "The voices behind our devotional music",
    homeServicesTitle: "What We Do",
    homeServicesSub: "Complete music company services for devotional & folk artists",
    homePlatformsTitle: "Available Everywhere",
    homePlatformsSub: "Our music reaches devotees on 150+ audio, video and social platforms",
    homeJourneyTitle: "Our Journey",
    homeTestimonialsTitle: "What Artists Say",
    ctaTitle: "Have a bhajan to share with the world?",
    ctaText: "Record, release and promote your devotional song with Imperial Records — distribution on 150+ platforms, YouTube Content ID and complete promotion.",
    musicTitle: "Bhakti Music Catalogue",
    musicSub: "Bhajan, aarti, chalisa, kirtan, mantra and more — listen free on YouTube",
    artistsTitle: "Imperial Artists",
    artistsSub: "Singers and creators who bring devotion to life",
    servicesTitle: "Our Services",
    servicesSub: "Everything a devotional & folk artist needs — production, distribution, management and promotion",
    contactTitle: "Contact Imperial Records",
    contactSub: "Song release, artist management, bhajan sandhya booking or any enquiry — we reply within 24 hours",
    footerAbout: "The royal home of bhakti music. Bhajan, aarti, chalisa, kirtan, mantra, Rajasthani folk and kids content — produced, distributed and promoted worldwide.",
    contactSubjects: [
      "Song Release / Distribution",
      "Artist Management",
      "Music Production / Recording",
      "YouTube Channel / Content ID",
      "Bhajan Sandhya / Jagran Booking",
      "Licensing / Copyright",
      "Other",
    ],
  },
  banners: [
    { image: ytThumb("U8mQO-aNVqU", "max"), eyebrow: "Radha Krishna Bhajan", title: "Teri Murli Ki Dhun", subtitle: "Most loved Radha Krishna bhajan — sung by Vikash Habibpur", ctaText: "Watch Now", ctaUrl: "", youtubeId: "U8mQO-aNVqU" },
    { image: ytThumb("tP2j6q1iTes", "max"), eyebrow: "Shri Hanuman Bhajan", title: "Hey Mahaveer Karo Kalyan", subtitle: "A powerful Hanuman bhajan for strength, peace and protection", ctaText: "Watch Now", ctaUrl: "", youtubeId: "tP2j6q1iTes" },
    { image: ytThumb("XiB0Z3FqQW0", "max"), eyebrow: "Mata Rani Bhajan", title: "He Jag Janani He Jagdamba", subtitle: "Navratri special Devi bhajan — Jai Mata Di", ctaText: "Watch Now", ctaUrl: "", youtubeId: "XiB0Z3FqQW0" },
    { image: ytThumb("vjHWHogQ15w", "max"), eyebrow: "ISKCON Kirtan", title: "Hare Krishna Mahamantra", subtitle: "Deep meditation & inner peace — the soulful mahamantra", ctaText: "Watch Now", ctaUrl: "", youtubeId: "vjHWHogQ15w" },
  ],
  mantras: ["ॐ नमः शिवाय", "जय श्री राम", "राधे राधे", "जय माता दी", "हरे कृष्ण हरे राम", "जय बजरंग बली", "जय श्री श्याम", "जय जगन्नाथ", "ॐ गं गणपतये नमः"],
  stats: [
    { value: "70K+", label: "YouTube Subscribers" },
    { value: "200+", label: "Devotional Releases" },
    { value: "150+", label: "Streaming Platforms" },
    { value: "13", label: "Music Categories" },
  ],
  categories: [
    { slug: "krishna-bhajan", name: "Radha Krishna Bhajan", hindi: "राधा कृष्ण भजन", description: "Soulful bhajans of Shri Radha Krishna, Vrindavan and Barsana.", image: ytThumb("mrgdY_3p1Z8"), color: "#1e6fd9", published: true },
    { slug: "hanuman-bhajan", name: "Hanuman Bhajan", hindi: "हनुमान भजन", description: "Bhajans of Bajrang Bali for strength, courage and protection.", image: ytThumb("rco46meZbz0"), color: "#e8590c", published: true },
    { slug: "mata-rani", name: "Mata Rani Bhajan", hindi: "माता रानी भजन", description: "Durga, Ambe and Jagdamba bhajans — Jai Mata Di.", image: ytThumb("umR9_RRFcnA"), color: "#d6336c", published: true },
    { slug: "aarti-chalisa", name: "Aarti & Chalisa", hindi: "आरती व चालीसा", description: "Daily aartis and chalisas for puja at home and temple.", image: ytThumb("Id7HykaAGNQ"), color: "#f59f00", published: true },
    { slug: "kirtan-mahamantra", name: "Kirtan & Mahamantra", hindi: "कीर्तन व महामंत्र", description: "Hare Krishna mahamantra, ISKCON kirtan and naam jap.", image: ytThumb("vjHWHogQ15w"), color: "#7048e8", published: true },
    { slug: "khatu-shyam", name: "Khatu Shyam Bhajan", hindi: "खाटू श्याम भजन", description: "Bhajans of Baba Shyam — Haare ka Sahara.", image: ytThumb("nmbTdZunqAg"), color: "#0ca678", published: true },
    { slug: "jagannath-bhajan", name: "Jagannath Bhajan", hindi: "जगन्नाथ भजन", description: "Bhajans of Mahaprabhu Jagannath, Puri.", image: ytThumb("hCgN-y4StFA"), color: "#c92a2a", published: true },
    { slug: "shiv-bhajan", name: "Shiv Bhajan", hindi: "शिव भजन", description: "Mahadev bhajans, stutis and mantras — Har Har Mahadev.", image: ytThumb("zwP7bN7t61w"), color: "#364fc7", published: true },
    { slug: "ram-bhajan", name: "Shri Ram Bhajan", hindi: "श्री राम भजन", description: "Bhajans of Maryada Purushottam Shri Ram.", image: ytThumb("zh4om8ctZFY"), color: "#e67700", published: true },
    { slug: "nirgun-bhajan", name: "Nirgun Bhajan", hindi: "निर्गुण भजन", description: "Philosophical bhajans of life, soul and truth.", image: ytThumb("MiNJZDs2k8M"), color: "#5c940d", published: true },
    { slug: "festival-special", name: "Festival Specials", hindi: "त्योहार विशेष", description: "Navratri, Janmashtami and festival specials.", image: ytThumb("hPAkB2vNQDw"), color: "#ae3ec9", published: true },
    { slug: "rajasthani-folk", name: "Rajasthani Folk", hindi: "राजस्थानी लोकगीत", description: "New Rajasthani & Marwadi trending songs.", image: ytThumb("KBOf3Tiu49o"), color: "#d9480f", published: true },
    { slug: "kids-rhymes", name: "Kids Rhymes", hindi: "बाल गीत", description: "Hindi rhymes and balgeet for children.", image: ytThumb("eMy_1rtMekg"), color: "#1098ad", published: true },
  ],
  releases: [
    r("U8mQO-aNVqU", "Teri Murli Ki Dhun", "तेरी मुरली की धुन सुनने मैं बरसाने से आयी", "krishna-bhajan", VH, true),
    r("tP2j6q1iTes", "Hey Mahaveer Karo Kalyan", "हे महावीर करो कल्याण", "hanuman-bhajan", VH, true),
    r("XiB0Z3FqQW0", "He Jag Janani He Jagdamba", "हे जग जननी हे जगदंबा", "mata-rani", VH, true),
    r("hCgN-y4StFA", "Tu Na Sambhale To Hamein Kaun Sambhale", "तू ना संभाले तो हमें कौन संभाले", "jagannath-bhajan", VH, true),
    r("vjHWHogQ15w", "Best Of ISKCON Kirtan – Hare Krishna Hare Rama", "हरे कृष्ण हरे राम महामंत्र", "kirtan-mahamantra", VH, true),
    r("MiNJZDs2k8M", "Manush Janam Anmol Re", "मनुष जन्म अनमोल रे माटी में ना रोल रे", "nirgun-bhajan", "Imperial Records", true),
    r("F0dXnDgkQG8", "Durga Chalisa", "दुर्गा चालीसा – नमो नमो दुर्गे सुख करनी", "aarti-chalisa", VH, true),
    r("nmbTdZunqAg", "Maine Mohan Ko Bulaya Hai", "मैंने मोहन को बुलाया है ओ आता होगा", "khatu-shyam", VH, true),
    r("Dk3T7Fkc8mE", "Maa Shailputri Ki Aarti", "ॐ जय शैलपुत्री माता", "aarti-chalisa"),
    r("rco46meZbz0", "Hey Dukhbhanjan Maruti Nandan", "हे दुखभंजन मारुति नंदन", "hanuman-bhajan"),
    r("U3p21Q1nzwY", "Bhor Bhai Din Chad Gaya Meri Ambe", "भोर भई दिन चढ़ गया मेरी अम्बे", "mata-rani"),
    r("H144EWF-r1s", "Man Shant Karne Wali Dhun – Hanuman Ji", "मन शांत करने वाली धुन", "hanuman-bhajan"),
    r("hPAkB2vNQDw", "Navratri Special Top 10 Mata Bhajan", "नवरात्रि स्पेशल माता भजन", "festival-special"),
    r("umR9_RRFcnA", "Jara Phool Bichha Do Aangan Mein", "जरा फूल बिछा दो आंगन में मेरी मईया आने वाली है", "mata-rani"),
    r("mrgdY_3p1Z8", "Radha Ki Tamanna Hai", "राधा की तमन्ना है कि कान्हा मुझे मिल जाए", "krishna-bhajan"),
    r("Id7HykaAGNQ", "Sampurna Aarti Sangrah", "सम्पूर्ण आरती संग्रह – ॐ जय अम्बे गौरी", "aarti-chalisa"),
    r("HEaBCLdXetM", "Govind Bolo Hari Gopal Bolo", "गोविंद बोलो हरी गोपाल बोलो", "krishna-bhajan"),
    r("_LBpzz3pSds", "Hamaro Dhan Radha Shri Radha", "हमारो धन राधा श्री राधा", "kirtan-mahamantra"),
    r("5SMotXgpQgw", "Ambe Tu Hai Jagdambe Kali", "अम्बे तू है जगदम्बे काली", "aarti-chalisa"),
    r("nkYTd4uI-zY", "Kali Kamli Wala Mera Yaar Hai", "काली कमली वाला मेरा यार है", "krishna-bhajan", AA),
    r("aID-SComYuo", "Shyama Aan Baso Vrindavan Mein", "श्यामा आन बसो वृंदावन में", "krishna-bhajan"),
    r("IUojZjz8PqA", "Hey Nath Narayan Vasudeva", "हे नाथ नारायण वासुदेवा", "krishna-bhajan"),
    r("g2WqT8yju1M", "Teri Galiyon Ka Hu Aashik", "तेरी गलियों का हूं आशिक तु एक नगीना है", "krishna-bhajan", AA),
    r("ABpBjwVikLk", "Guru Ji Ko Aadesh, Guru Ji Ko Pranam", "गुरु जी को आदेश, गुरु जी को प्रणाम", "hanuman-bhajan"),
    r("RE3x1aomJx4", "Shri Krishna Govind Hare Murari", "श्री कृष्णा गोविन्द हरे मुरारी", "krishna-bhajan"),
    r("GAZbFjZRTgI", "Tum Na Sunoge To Kaun Sunega", "साथ हमारे कौन चलेगा", "khatu-shyam", AA),
    r("zh4om8ctZFY", "Wo To Ram Naam Matwala", "वो तो राम नाम मतवाला – माँ अंजनी का लाला", "ram-bhajan"),
    r("0C-WPQqD0bo", "Jagannath Chaka Nayana", "जगन्नाथ चक्का नैन नीलाचल वाले", "jagannath-bhajan"),
    r("Y8uKqbdEU9k", "Mathura Mein Janme Kanhaiya", "मथुरा में जन्मे कन्हैया, गोकुल में बधाईया", "festival-special"),
    r("vSNxLTQBe_E", "Janmashtami Special – Shri Krishna Govind", "जन्माष्टमी स्पेशल – श्री कृष्णा गोविन्द हरे मुरारी", "festival-special"),
    r("zP6-pZ7ryOI", "Darash Dedo Raghunandan", "दरश देदो रघुनंदन", "ram-bhajan"),
    r("zwP7bN7t61w", "Karpur Gauram Karunavtaram", "कर्पूरगौरं करुणावतारं", "shiv-bhajan"),
    r("AvGbwJXHhr8", "Ashutosh Shashank Shekhar", "आशुतोष शशांक शेखर", "shiv-bhajan"),
    r("WLv4r_coUjg", "Maine Tere Hi Bharose Hanuman", "मैंने तेरे ही भरोसे हनुमान", "hanuman-bhajan"),
    r("EusbKN8gALo", "Jai Jai Radha Raman Hari Bol", "जय जय राधा रमण हरि बोल", "kirtan-mahamantra"),
    r("PTauGhx3LYY", "Kate Lagai Vo Der Bhavani", "कटे लगाई वो देर भवानी", "mata-rani", "Imperial Records"),
    r("KBOf3Tiu49o", "Le Le Majo Le Le Biyan", "लेले मजो लेले ब्यान", "rajasthani-folk", "Gyan Singh Rawat"),
    r("tobjm2VCBs8", "Chora Me Thara Look Pe Margi", "छोरा मे थारा लूक पे मरगी", "rajasthani-folk", "Imperial Records"),
    r("lwftx2QQuU0", "Mari Annu Dhoko Degi Re", "मारी अनु धोको देगी रे", "rajasthani-folk", "Imperial Records"),
    r("-RZpGz8CV18", "U Mat Bole Re Januda", "यू मत बोले रे जानू डा मारी छाती धड़के", "rajasthani-folk", "Imperial Records"),
    r("eMy_1rtMekg", "Ek Mota Hathi", "एक मोटा हाथी घूमने चला", "kids-rhymes", "Imperial Records"),
    r("DFDolhW2Fvo", "Lakdi Ki Kathi", "लकड़ी की काठी, काठी का घोड़ा", "kids-rhymes", "Imperial Records"),
    r("0EeQwzntioo", "Aaha Tamatar Bade Mazedar", "आहा टमाटर बड़े मज़ेदार", "kids-rhymes", "Imperial Records"),
    r("KmCCV2eaygg", "Nani Teri Morni", "नानी तेरी मोरनी को मोर ले गए", "kids-rhymes", "Imperial Records"),
    r("VAs5O9rnuh8", "Titli Udi", "तितली उड़ी बस में चढ़ी", "kids-rhymes", "Imperial Records"),
    r("GVHPILUqYuQ", "Upar Pankha Chalta Hai", "ऊपर पंखा चलता है", "kids-rhymes", "Imperial Records"),
  ],
  artists: [
    {
      slug: "vikash-habibpur", name: "Vikash Habibpur", role: "Singer & Founder", genre: "Bhajan · Kirtan · Aarti",
      image: "/images/artist-vikash.jpg",
      bio: "Vikash Habibpur is a devotional singer whose Radha Krishna, Hanuman, Mata Rani and Jagannath bhajans are loved by devotees across India. His channel Vikash Habibpur Official is a divine platform celebrating the power of devotion through soul-stirring bhakti music.",
      youtube: "https://www.youtube.com/@vikashhabibpur-yt", featured: true,
    },
    {
      slug: "adhishtha-anushka", name: "Adhishtha Anushka", role: "Bhajan Singers", genre: "Krishna & Khatu Shyam Bhajan",
      image: ytThumb("nkYTd4uI-zY"),
      bio: "Adhishtha Anushka are young bhajan singers known for heartfelt renditions like Kali Kamli Wala Mera Yaar Hai, Teri Galiyon Ka Hu Aashik and Tum Na Sunoge To Kaun Sunega.",
      featured: true,
    },
    {
      slug: "gyan-singh-rawat", name: "Gyan Singh Rawat", role: "Folk Singer", genre: "Rajasthani Folk",
      image: ytThumb("KBOf3Tiu49o"),
      bio: "Gyan Singh Rawat sings new-age Rajasthani folk and DJ songs like Le Le Majo Le Le Biyan for Imperial Records.",
      featured: true,
    },
  ],
  services: [
    { slug: "distribution", icon: "Globe", name: "Music Distribution", description: "Release your bhajan or song on Spotify, JioSaavn, Apple Music, Amazon, YouTube Music, Instagram and 150+ platforms.", points: ["150+ stores worldwide", "ISRC & UPC codes", "Caller tune (CRBT) on Jio, Airtel, Vi", "Monthly royalty reports"] },
    { slug: "production", icon: "Mic2", name: "Music Production", description: "Studio recording, composition, lyrics, mixing and mastering for devotional and folk songs.", points: ["Bhajan & aarti composition", "Professional recording", "Mixing & mastering", "Lyrics writing (Hindi / Rajasthani)"] },
    { slug: "video", icon: "Clapperboard", name: "Video Production", description: "Lyrical videos, devotional animation and full music video shoots that look divine.", points: ["Lyrical & bhakti animation videos", "Music video shoot & edit", "Thumbnails & posters", "Shorts & Reels"] },
    { slug: "youtube", icon: "MonitorPlay", name: "YouTube & Content ID", description: "Channel management, SEO, Content ID protection and monetisation for artists and labels.", points: ["Channel growth & SEO", "Content ID & copyright claims", "Monetisation support", "Playlist & premiere strategy"] },
    { slug: "artist-management", icon: "Users", name: "Artist Management", description: "End-to-end management and promotion for devotional and folk singers.", points: ["Career planning", "Brand collaborations", "Social media promotion", "PR & interviews"] },
    { slug: "events", icon: "Flame", name: "Bhajan Sandhya & Jagran", description: "Book our artists for bhajan sandhya, jagran, kirtan, temple and festival events.", points: ["Bhajan sandhya & jagran", "Navratri & Janmashtami events", "Temple programmes", "Corporate & family functions"] },
    { slug: "licensing", icon: "ShieldCheck", name: "Licensing & Copyright", description: "Music licensing for films, TV, temples, apps and brands with full copyright support.", points: ["Sync licensing", "Copyright registration", "Takedown & dispute handling", "Catalogue acquisition"] },
    { slug: "marketing", icon: "Megaphone", name: "Digital Marketing", description: "Targeted promotion of releases on YouTube, Instagram, Facebook and streaming playlists.", points: ["YouTube & Meta ads", "Playlist pitching", "Influencer reels", "Release campaigns"] },
  ],
  platforms: [
    { name: "YouTube", type: "Video", url: "https://www.youtube.com/@ImperialRecords-r3f" },
    { name: "YouTube Music", type: "Audio", url: "https://music.youtube.com" },
    { name: "Spotify", type: "Audio", url: "https://open.spotify.com" },
    { name: "JioSaavn", type: "Audio", url: "https://www.jiosaavn.com" },
    { name: "Apple Music", type: "Audio", url: "https://music.apple.com" },
    { name: "Amazon Music", type: "Audio", url: "https://music.amazon.in" },
    { name: "Gaana", type: "Audio", url: "https://gaana.com" },
    { name: "Wynk Music", type: "Audio", url: "https://wynk.in" },
    { name: "Hungama", type: "Audio", url: "https://www.hungama.com" },
    { name: "iTunes", type: "Audio", url: "https://www.apple.com/itunes" },
    { name: "Deezer", type: "Audio", url: "https://www.deezer.com" },
    { name: "Tidal", type: "Audio", url: "https://tidal.com" },
    { name: "Shazam", type: "Audio", url: "https://www.shazam.com" },
    { name: "Boomplay", type: "Audio", url: "https://www.boomplay.com" },
    { name: "Instagram", type: "Social", url: "https://www.instagram.com" },
    { name: "Facebook", type: "Social", url: "https://www.facebook.com" },
    { name: "Snapchat", type: "Social", url: "https://www.snapchat.com" },
    { name: "Moj", type: "Social", url: "https://mojapp.in" },
    { name: "Josh", type: "Social", url: "https://myjosh.in" },
    { name: "ShareChat", type: "Social", url: "https://sharechat.com" },
    { name: "Jio CallerTune", type: "CRBT", url: "https://www.jio.com" },
    { name: "Airtel Hellotunes", type: "CRBT", url: "https://www.airtel.in" },
    { name: "Vi CallerTunes", type: "CRBT", url: "https://www.myvi.in" },
  ],
  journey: [
    { year: "Start", text: "Vikash Habibpur begins sharing devotional bhajans on YouTube." },
    { year: "Growth", text: "Vikash Habibpur Official crosses 50,000+ devotees with Radha Krishna, Hanuman and Mata Rani bhajans." },
    { year: "Label", text: "Imperial Records launched as a full music company — bhakti, Rajasthani folk and kids content." },
    { year: "Today", text: "200+ releases, 70K+ subscribers and distribution on 150+ platforms worldwide." },
  ],
  team: [
    { name: "Vikash Habibpur", role: "Founder", image: "/images/artist-vikash.jpg", phone: "+91 96724 05059", email: "vikash@theimperialrecords.com" },
  ],
  testimonials: [
    { name: "Bhajan Singer", role: "Imperial Records Artist", text: "Imperial Records ne mera bhajan record se lekar Spotify aur YouTube tak sab sambhala. Bahut professional team hai." },
    { name: "Devotee", role: "YouTube Listener", text: "Har subah Imperial Records ke bhajan se din shuru hota hai. Man ko bahut shanti milti hai. Jai Shri Krishna!" },
    { name: "Temple Committee", role: "Bhajan Sandhya Organiser", text: "Navratri jagran ke liye artist booking smooth rahi — samay par, sundar programme." },
  ],
  seo: {
    home: { title: "Imperial Records | Bhajan, Aarti, Kirtan & Devotional Music Company", description: "Imperial Records — devotional music company for Radha Krishna, Hanuman, Mata Rani, Khatu Shyam & Jagannath bhajans, aarti, chalisa, kirtan, Rajasthani folk and kids rhymes. Release your bhajan on 150+ platforms." },
    music: { title: "Bhakti Music Catalogue – Bhajan, Aarti, Chalisa, Kirtan", description: "Listen to the latest bhajans, aartis, chalisas, kirtans and mantras from Imperial Records — Radha Krishna, Hanuman, Mata Rani, Shiv, Ram, Khatu Shyam and more." },
    artists: { title: "Artists", description: "Meet Imperial Records artists — devotional bhajan singers and Rajasthani folk singers including Vikash Habibpur." },
    services: { title: "Music Distribution, Production & Artist Management Services", description: "Bhajan distribution on 150+ platforms, music & video production, YouTube Content ID, artist management, bhajan sandhya booking and licensing by Imperial Records." },
    about: { title: "About Us", description: "Imperial Records is a devotional-first Indian music label producing and distributing bhajans, aartis, kirtans and folk songs worldwide." },
    contact: { title: "Contact Us", description: "Contact Imperial Records for song release, distribution, artist management and bhajan sandhya booking. Email vikash@theimperialrecords.com or call +91 96724 05059." },
  },
};

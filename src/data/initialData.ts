import { BlogPost, Category, GalleryItem, BlogComment } from '../types';

export const SITE_INFO = {
  title: "Doctor Baba Mukisa - Traditional Herbalist & Spiritual Guidance",
  tagline: "African Traditional Herbalist & Spiritual Consultation Practitioner",
  phone: "+256761359634",
  whatsapp: "256761359634",
  email: "help@doctorbabamukisa.com",
  address: "Plot 24 Buganda Street, Kampala, Uganda",
  templeLocation: "Kampala Temple, Uganda (Origin: Digo Land, Coastal Kenya)",
  aboutShort: "Doctor Baba Mukisa is an African traditional herbalist and spiritual practitioner, sharing ancestral guidance and cultural herbal knowledge passed down through generations from the Digo land in coastal Kenya.",
  disclaimerShort: "Spiritual guidance, cultural herbal consultations, and traditional reflections are offered for personal guidance, spiritual comfort, and cultural enrichment only.",
  disclaimerFull: `Spiritual guidance, traditional herbal consultations, and cultural reflections provided by Doctor Baba Mukisa are for personal spiritual guidance and cultural enrichment only. Content on this website—including readings, traditional herbal knowledge, and meditation guidance—is not intended as a substitute for certified medical, financial, or legal advice.

Users engaging with our consultations acknowledge that the application of any advice is strictly at their own personal discretion and responsibility. Doctor Baba Mukisa does not make guaranteed claims regarding specific personal, financial, legal, or health outcomes, as results vary based on individual belief, personal effort, and external circumstances.

Our platform respects African traditional heritage and cultural spiritual practices. We prioritize privacy and encourage visitors to maintain personal confidentiality during interactions.`
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Relationship Reconciliation",
    slug: "relationship-reconciliation-guidance",
    description: "Traditional spiritual reflection and herbal consultation aimed at fostering harmony, emotional peace, relationship reconciliation, and mutual respect.",
    views: 3420,
    featured_image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-2",
    name: "Financial & Enterprise Well-Being",
    slug: "financial-and-wealth-recovery",
    description: "Traditional herbal infusions, personal focus, and spiritual guidance to promote clarity, confidence, and enterprise diligence.",
    views: 2890,
    featured_image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-3",
    name: "Legal Stress & Conflict Mediation",
    slug: "court-cases-and-legal-help",
    description: "Spiritual meditation, mental clarity rituals, and stress-relief guidance for individuals navigating difficult disputes or litigation.",
    views: 1940,
    featured_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-4",
    name: "Spiritual Protection & Cleansing",
    slug: "spiritual-protection-and-cleansing",
    description: "Traditional herbal washes and ancestral meditation practices designed to clear negative energy and promote peace of mind.",
    views: 2510,
    featured_image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-5",
    name: "Traditional Keepsakes & Cultural Amulets",
    slug: "traditional-artifacts-and-blessings",
    description: "Traditional consecrated keepsakes crafted to encourage personal focus, self-assurance, and spiritual presence.",
    views: 3100,
    featured_image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-6",
    name: "Property & Family Peace Rituals",
    slug: "property-and-land-rituals",
    description: "Spiritual mediation and boundary blessings to promote peaceful family dialogue and estate stability.",
    views: 1680,
    featured_image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-7",
    name: "Marriage & Family Harmony",
    slug: "marriage-and-family-harmony",
    description: "Traditional marriage reconciliation consultations to resolve disputes, increase trust, and foster mutual understanding.",
    views: 4120,
    featured_image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-8",
    name: "Prosperity & Enterprise Alignment",
    slug: "prosperity-and-enterprise-alignment",
    description: "Authentic traditional rituals and spiritual alignment to foster career clarity, business confidence, and financial diligence through ancestral wisdom.",
    views: 3890,
    featured_image: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-9",
    name: "Traditional Shielding & Protection",
    slug: "traditional-shielding-and-protection",
    description: "Ancient African traditions for spiritual shielding, aura purification, and personal safety against negative vibrations and fatigue.",
    views: 2760,
    featured_image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cat-10",
    name: "Inclusive Relationship Guidance",
    slug: "inclusive-relationship-guidance",
    description: "Specialized relationship consultations to foster deep connection, emotional security, and lasting commitment in partnerships.",
    views: 2140,
    featured_image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Iris, UK",
    text: "Doctor Baba Mukisa's relationship guidance brought remarkable clarity. My partner and I reconciled our differences after months of separation. His ancestral wisdom is genuine and compassionate.",
    service: "Relationship Reconciliation"
  },
  {
    id: 2,
    name: "Marcus, Thailand",
    text: "The prosperity alignment consultations helped me overcome mental blockages and focus on new business opportunities. Doctor Baba Mukisa provides profound spiritual guidance.",
    service: "Prosperity Alignment"
  },
  {
    id: 3,
    name: "Grace A., Kenya",
    text: "Helped bring harmony back into our marriage during a difficult period. The spiritual mediation softened communication and brought peace back to our family.",
    service: "Marriage Harmony"
  },
  {
    id: 4,
    name: "Samuel M., Uganda",
    text: "The aura protection rituals gave me the composure and calm confidence to navigate workplace challenges and earn my promotion. Highly respected practitioner.",
    service: "Spiritual Protection"
  },
  {
    id: 5,
    name: "Chloe R., Canada",
    text: "I was curious about distance meditation, and the aura cleansing completely shifted my energy. I feel lighter, more centered, and optimistic about my path.",
    service: "Aura Cleansing"
  },
  {
    id: 6,
    name: "Ahmed H., Dubai",
    text: "My business was going through immense stress. After the traditional enterprise blessing ritual and focused meditation, we experienced renewed client trust and growth.",
    service: "Business Blessing"
  },
  {
    id: 7,
    name: "David L., USA",
    text: "The guidance rituals helped me stay grounded during a very difficult property dispute. We reached a favorable settlement with clarity and patience.",
    service: "Dispute Mediation"
  },
  {
    id: 8,
    name: "Sarah W., Australia",
    text: "Our family experienced renewed unity and calm following ancestral blessings and guidance sessions. I am deeply thankful for the spiritual support.",
    service: "Family Well-Being"
  },
  {
    id: 9,
    name: "John K., South Africa",
    text: "The relationship guidance helped me and my partner build mutual trust and open communication. The spiritual connection we share is stronger than ever.",
    service: "Relationship Guidance"
  },
  {
    id: 10,
    name: "Elena V., Russia",
    text: "I had been feeling burdened by heavy stress and persistent negativity. The traditional herbal cleansing brought deep mental tranquility and renewed energy.",
    service: "Spiritual Cleansing"
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    name: "Traditional Relationship Guidance & Spiritual Reflection",
    slug: "traditional-relationship-guidance-and-spiritual-reflection",
    author: "Doctor Baba Mukisa",
    views: 2450,
    mini_description: "Explore how ancestral wisdom, herbal reflection, and focused spiritual meditation help nurture emotional peace and relationship reconciliation.",
    description: "Relationship challenges can leave you feeling drained and uncertain. Across Africa, ancestral spiritual practitioners have shared traditional reflection practices designed to foster forgiveness, clear emotional distance, and rebuild trust.",
    content_sections: [
      {
        heading: "Understanding Emotional Distance in Relationships",
        body: "Relationships encounter difficulties due to stress, misunderstandings, or emotional fatigue. Doctor Baba Mukisa offers spiritual consultation and traditional guidance to help individuals reflect on underlying challenges and cultivate positive energy."
      },
      {
        heading: "Traditional Meditation & Digo Herbal Wisdom",
        body: "From his Kampala Temple, Doctor Baba Mukisa shares traditional Digo herbal practices and guided meditation. These traditional practices support internal peace and mindful communication."
      },
      {
        heading: "Reflections on Personal Growth",
        body: "Sarah K. shares: 'Doctor Baba Mukisa offered valuable spiritual guidance and meditation during a stressful time in my relationship. The perspective helped us communicate with empathy and understanding.'"
      },
      {
        heading: "Requesting a Confidential Consultation",
        body: "For personal guidance or consultation, reach out directly to Doctor Baba Mukisa via WhatsApp at +256761359634 or phone call +256761359634."
      }
    ],
    post_date: "2026-07-15",
    feature_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    category_slug: "relationship-reconciliation-guidance",
    category_name: "Relationship Reconciliation"
  },
  {
    id: "blog-2",
    name: "How Traditional Herbal Cleansing Supports Inner Balance & Peace of Mind",
    slug: "how-traditional-herbal-cleansing-restores-spiritual-balance",
    author: "Doctor Baba Mukisa",
    views: 1980,
    mini_description: "Clear feelings of mental heaviness and spiritual fatigue with authentic ancestral herbal cleanses prepared by Doctor Baba Mukisa.",
    description: "When experiencing persistent stress or feelings of stagnation, traditional herbal cleansing offers a soothing ritual to refresh your outlook and promote spiritual clarity.",
    content_sections: [
      {
        heading: "Signs You May Benefit from a Herbal Cleansing Ritual",
        body: "Persistent fatigue, unmanaged stress, or feelings of negativity can cloud your daily focus. Traditional herbal baths provide a serene space for personal renewal and spiritual grounding."
      },
      {
        heading: "Sacred Digo Herbs & Natural Herbal Washes",
        body: "Doctor Baba Mukisa prepares custom herbal washes using organic roots and bark sourced from coastal Digo heritage. These herbal preparations are crafted to support physical freshness and spiritual calmness."
      },
      {
        heading: "Maintaining Positivity & Emotional Renewal",
        body: "Following a traditional cleanse, individuals often experience enhanced focus and a sense of renewed peace, helping them approach daily life with clarity."
      },
      {
        heading: "Book Your Consultation Session",
        body: "Contact Doctor Baba Mukisa on WhatsApp or Call +256761359634 to learn more about traditional herbal cleansing consultations."
      }
    ],
    post_date: "2026-07-20",
    feature_image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    category_slug: "spiritual-protection-and-cleansing",
    category_name: "Spiritual Protection & Cleansing"
  },
  {
    id: "blog-3",
    name: "Enterprise Guidance, Mindful Planning & Traditional Herbal Practices",
    slug: "unlocking-business-prosperity-and-career-clarity",
    author: "Doctor Baba Mukisa",
    views: 2850,
    mini_description: "Enhance focus, customer rapport, and business confidence using time-honored traditional herbal consultations and focus keepsakes.",
    description: "In commerce and daily business, maintaining mental clarity and confidence is key. Traditional African herbal consultations offer guidance to help entrepreneurs approach challenges with renewed vigor.",
    content_sections: [
      {
        heading: "Fostering Positive Commercial Atmosphere",
        body: "Creating a welcoming environment and clear focus can significantly improve business relationships. Traditional reflection practices help align your mindset with constructive action."
      },
      {
        heading: "Traditional Keepsakes & Mindful Focus",
        body: "Doctor Baba Mukisa crafts customized keepsakes that serve as personal symbols of determination, calm decision-making, and professional magnetism."
      },
      {
        heading: "Personal Growth Perspective",
        body: "John B. shares: 'Doctor Baba Mukisa provided traditional guidance and an encouraging perspective that restored my confidence in managing my enterprise during tough economic times.'"
      },
      {
        heading: "Get Personal Consultation Today",
        body: "Speak with Doctor Baba Mukisa directly via WhatsApp at +256761359634 or call +256761359634 for personal spiritual consultation."
      }
    ],
    post_date: "2026-07-28",
    feature_image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    category_slug: "financial-and-wealth-recovery",
    category_name: "Financial & Enterprise Well-Being"
  },
  {
    id: "blog-4",
    name: "Spiritual Reflection & Peace of Mind for Households",
    slug: "spiritual-shielding-and-aura-cleansing",
    author: "Doctor Baba Mukisa",
    views: 1620,
    mini_description: "Promote harmony, family peace, and emotional comfort within your home through traditional spiritual practices.",
    description: "Family life thrives when supported by mutual understanding, calm communication, and spiritual peace. Traditional home blessings encourage a serene atmosphere for all family members.",
    content_sections: [
      {
        heading: "Encouraging Harmony at Home",
        body: "Stress and external pressures can occasionally affect domestic tranquility. Traditional herbal cleanses and family reflections support emotional stability."
      },
      {
        heading: "Ancestral Blessing Rituals",
        body: "Doctor Baba Mukisa uses traditional Digo herbal elements to encourage feelings of safety and unity across the household."
      },
      {
        heading: "Nurturing Future Generations",
        body: "Creating a calm and supportive home environment fosters emotional well-being and confidence for children and youth."
      },
      {
        heading: "Schedule a Household Blessing Consultation",
        body: "Contact Doctor Baba Mukisa on WhatsApp +256761359634 or phone +256761359634 to discuss traditional home guidance."
      }
    ],
    post_date: "2026-08-01",
    feature_image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    category_slug: "spiritual-protection-and-cleansing",
    category_name: "Spiritual Protection & Cleansing"
  },
  {
    id: "blog-5",
    name: "Spiritual Reflection & Stress Relief During Legal Challenges",
    slug: "clarity-and-fairness-in-dispute-resolution",
    author: "Doctor Baba Mukisa",
    views: 1840,
    mini_description: "Maintain composure, mental clarity, and peace of mind during legal processes through guided meditation.",
    description: "Navigating legal disputes can cause significant mental strain. Doctor Baba Mukisa provides calming spiritual meditation and mindfulness to help clients maintain focus and emotional resilience.",
    content_sections: [
      {
        heading: "Maintaining Mental Calm in High-Stress Situations",
        body: "Clear thinking and emotional balance are vital during challenging proceedings. Guided meditation supports mental clarity and stress reduction."
      },
      {
        heading: "Complementing Professional Legal Counsel",
        body: "While legal representatives handle court proceedings, spiritual meditation helps clients manage anxiety and maintain emotional strength."
      },
      {
        heading: "Personal Reflection Story",
        body: "David M. shares: 'During a lengthy property dispute, Doctor Baba Mukisa provided calming meditation techniques that kept me focused and grounded throughout the process.'"
      },
      {
        heading: "Seek Personal Guidance",
        body: "Reach out to Doctor Baba Mukisa on WhatsApp at +256761359634 or call +256761359634 for confidential spiritual meditation."
      }
    ],
    post_date: "2026-08-04",
    feature_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    category_slug: "court-cases-and-legal-help",
    category_name: "Legal Stress & Conflict Mediation"
  },
  {
    id: "blog-6",
    name: "Traditional Wisdom for Estate Harmony & Family Resolution",
    slug: "securing-land-protecting-property-and-resolving-estate-wrangles",
    author: "Doctor Baba Mukisa",
    views: 1530,
    mini_description: "Promote constructive family dialogue and estate stability through traditional mediation principles.",
    description: "Land and property are significant assets that require respectful stewardship. Traditional mediation encourages fair dialogue and mutual understanding among family members.",
    content_sections: [
      {
        heading: "Traditional Principles of Estate Harmony",
        body: "African cultural traditions emphasize unity and respectful negotiation during family property discussions."
      },
      {
        heading: "Fostering Peaceful Family Dialogue",
        body: "Spiritual reflection sessions help ease tensions and encourage fair agreements regarding family estates."
      },
      {
        heading: "Safeguarding Peace and Stewardship",
        body: "Applying traditional principles helps family members preserve ancestral property with unity and respect."
      },
      {
        heading: "Consult Doctor Baba Mukisa",
        body: "Contact Doctor Baba Mukisa on WhatsApp at +256761359634 or phone call +256761359634 for traditional property guidance."
      }
    ],
    post_date: "2026-08-06",
    feature_image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    category_slug: "property-and-land-rituals",
    category_name: "Property & Family Peace Rituals"
  },
  {
    id: "blog-7",
    name: "Traditional Spiritual Shielding & Cultural Aura Cleansing",
    slug: "traditional-spiritual-shielding-and-aura-defense",
    author: "Doctor Baba Mukisa",
    views: 3120,
    mini_description: "Learn how authentic ancestral African wisdom and herbal reflection help safeguard your peace of mind and personal vitality.",
    description: "Spiritual well-being is vital for emotional balance. Doctor Baba Mukisa explores traditional Digo spiritual shielding techniques and herbal reflection practices.",
    content_sections: [
      {
        heading: "Identifying Spiritual Fatigue",
        body: "Persistent stress, recurring feelings of heaviness, and unexplained fatigue often suggest a need for personal spiritual grounding and mindfulness."
      },
      {
        heading: "Traditional Cleansing Washes & Natural Herbs",
        body: "Using sacred herbs from the East African coast, Doctor Baba Mukisa crafts traditional herbal washes that support emotional resilience and a positive atmosphere."
      },
      {
        heading: "Daily Mindfulness & Positive Affirmation",
        body: "Consistency is key to spiritual balance. Practicing simple daily reflections and affirmations helps maintain personal calm throughout the day."
      },
      {
        heading: "Start Your Reflection Journey",
        body: "Cultivate inner balance today by consulting Doctor Baba Mukisa via WhatsApp +256761359634 for personalized spiritual guidance."
      }
    ],
    post_date: "2026-08-10",
    feature_image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?auto=format&fit=crop&w=800&q=80",
    category_slug: "spiritual-protection-and-cleansing",
    category_name: "Spiritual Protection & Cleansing"
  },
  {
    id: "blog-8",
    name: "Ancestral Family Blessings & Generational Harmony",
    slug: "ancestral-family-blessings-and-generational-harmony",
    author: "Doctor Baba Mukisa",
    views: 4560,
    mini_description: "Discover how traditional ancestral reflections and family blessings foster generational peace, unity, and mutual understanding.",
    description: "Family unity is a sacred foundation. Traditional African cultural blessings and mindful guidance help families establish enduring bonds and positive generational harmony.",
    content_sections: [
      {
        heading: "Fostering Family Unity",
        body: "Deepening family connections often begins with spiritual reflection and mutual respect. Traditional guidance helps families navigate generational transitions with compassion."
      },
      {
        heading: "Honoring Ancestral Heritage",
        body: "In Digo tradition, family unity is nurtured by honoring cultural values and seeking blessings for future generations, ensuring children grow in an atmosphere of support."
      },
      {
        heading: "Nurturing Home Atmosphere",
        body: "Traditional herbal cleanses and family prayers help maintain a calm, welcoming home environment that encourages peaceful dialogue."
      },
      {
        heading: "Schedule a Family Consultation",
        body: "Contact Doctor Baba Mukisa on WhatsApp +256761359634 for a confidential family guidance and ancestral blessing session."
      }
    ],
    post_date: "2026-08-12",
    feature_image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
    category_slug: "property-and-land-rituals",
    category_name: "Property & Family Peace Rituals"
  },
  {
    id: "blog-9",
    name: "Spiritual Cleansing: Releasing Negative Energy & Restoring Vitality",
    slug: "spiritual-cleansing-releasing-negativity-and-restoring-vitality",
    author: "Doctor Baba Mukisa",
    views: 5200,
    mini_description: "A comprehensive guide to clearing emotional burdens, releasing stagnant energy, and restoring positive life momentum.",
    description: "Feelings of continuous misfortune or mental fog can disrupt daily life. Reclaiming your peace of mind is facilitated through mindful traditional cleansing and spiritual reflection.",
    content_sections: [
      {
        heading: "Recognizing Emotional & Energetic Heaviness",
        body: "When persistent obstacles and fatigue undermine your daily enthusiasm, traditional spiritual cleansing provides a structured pathway to reset and regain composure."
      },
      {
        heading: "The Traditional Herbal Cleansing Process",
        body: "Doctor Baba Mukisa conducts traditional cleansing rituals utilizing natural herbal extracts, steam baths, and ancestral meditation to help release lingering burdens."
      },
      {
        heading: "Restoring Personal Momentum",
        body: "By realigning your spiritual focus and clearing emotional clutter, you can cultivate positive relationships, career clarity, and deep personal contentment."
      },
      {
        heading: "Request a Cleansing Consultation",
        body: "If you are seeking spiritual renewal and peace of mind, reach out to Doctor Baba Mukisa on WhatsApp +256761359634 for a personal assessment."
      }
    ],
    post_date: "2026-08-14",
    feature_image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80",
    category_slug: "spiritual-protection-and-cleansing",
    category_name: "Spiritual Protection & Cleansing"
  },
  {
    id: "blog-10",
    name: "Marriage Harmony: Nurturing Long-Term Commitment & Mutual Trust",
    slug: "marriage-harmony-commitment-and-trust",
    author: "Doctor Baba Mukisa",
    views: 6100,
    mini_description: "Cultivate lasting partnership fidelity and emotional intimacy through traditional spiritual reflection and marriage guidance.",
    description: "A fulfilling marriage requires dedication, open dialogue, and spiritual alignment. Traditional marital consultations offer valuable insights for couples seeking lasting harmony.",
    content_sections: [
      {
        heading: "Deepening Emotional Connection",
        body: "Marital harmony flourishes when partners share mutual empathy and respect. Traditional consultations encourage couples to reconnect emotionally and spiritually."
      },
      {
        heading: "Overcoming External Stresses",
        body: "Financial pressures, family expectations, and work demands can place strain on relationships. Traditional mediation helps couples stand united against outside stressors."
      },
      {
        heading: "Renewing Mutual Affection",
        body: "Through guided reflection and sacred herbal aromas, couples can cultivate a renewed appreciation for one another and celebrate their shared journey."
      },
      {
        heading: "Secure Your Partnership Consultation",
        body: "Invest in the strength of your relationship. Book a marriage harmony consultation with Doctor Baba Mukisa via WhatsApp +256761359634 today."
      }
    ],
    post_date: "2026-08-16",
    feature_image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    category_slug: "marriage-and-family-harmony",
    category_name: "Marriage & Family Harmony"
  },
  {
    id: "blog-11",
    name: "Mindfulness, Inner Peace & Emotional Grounding in Traditional Practice",
    slug: "mindfulness-inner-peace-and-emotional-grounding",
    author: "Doctor Baba Mukisa",
    views: 3800,
    mini_description: "Explore how traditional Digo mindfulness practices and herbal teas support relaxation, emotional balance, and everyday calm.",
    description: "In the fast-paced modern world, finding moments of serenity is essential. Doctor Baba Mukisa provides a sanctuary for traditional reflection and mindfulness practice.",
    content_sections: [
      {
        heading: "The Value of Traditional Grounding",
        body: "Taking time for quiet contemplation and ancestral connection helps ease daily tensions and restores a sense of inner purpose and clarity."
      },
      {
        heading: "Natural Herbal Teas & Aromatic Blends",
        body: "We prepare soothing herbal infusions designed to promote relaxation and complement daily meditation practices for healthy, balanced living."
      },
      {
        heading: "Reconnecting with Inner Balance",
        body: "Through personalized guidance, individuals learn traditional techniques to maintain composure, improve daily focus, and cultivate an optimistic outlook."
      },
      {
        heading: "Begin Your Mindfulness Journey",
        body: "Experience the benefits of traditional mindfulness. Contact Doctor Baba Mukisa for a private consultation via WhatsApp +256761359634."
      }
    ],
    post_date: "2026-08-17",
    feature_image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    category_slug: "spiritual-protection-and-cleansing",
    category_name: "Mindfulness & Emotional Balance"
  }
];

export const INITIAL_COMMENTS: BlogComment[] = [
  {
    id: "comment-1",
    blog_id: "blog-1",
    author_name: "Sarah K., Nairobi",
    comment_date: "2026-07-18",
    description: "Doctor Baba Mukisa's spiritual consultation gave me peace of mind when my marriage was on the verge of breakdown. Highly recommended!"
  },
  {
    id: "comment-2",
    blog_id: "blog-1",
    author_name: "David M., Kampala",
    comment_date: "2026-07-22",
    description: "The remote meditation and guidance worked wonders. Thank you Doctor Baba Mukisa for your help."
  },
  {
    id: "comment-3",
    blog_id: "blog-3",
    author_name: "John B., Mombasa",
    comment_date: "2026-08-02",
    description: "My business saw a significant turnaround after seeking Doctor Baba Mukisa's financial blessing rituals."
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "g1", title: "Sacred Temple Shrine", image: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80", category: "Temple" },
  { id: "g2", title: "Traditional Herbal Herbs & Oils", image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80", category: "Herbs" },
  { id: "g3", title: "Spiritual Meditation Space", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", category: "Temple" },
  { id: "g4", title: "Protection Charms & Amulets", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80", category: "Charms" },
  { id: "g5", title: "Ancestral Ceremony Ritual", image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80", category: "Ceremonies" },
  { id: "g6", title: "Healing Herbs Preparation", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", category: "Herbs" }
];

export const INITIAL_SUBSCRIBERS = [
  { id: "sub-1", email: "james.k@example.com", subscribed_date: "2026-08-01", status: "Active" as const, source: "Footer Form" },
  { id: "sub-2", email: "mercy.w@example.com", subscribed_date: "2026-08-03", status: "Active" as const, source: "Home Section" },
  { id: "sub-3", email: "david.o@example.com", subscribed_date: "2026-08-05", status: "Active" as const, source: "Footer Form" }
];

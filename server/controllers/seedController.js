const User = require('../models/User');
const PriestProfile = require('../models/PriestProfile');
const Ritual = require('../models/Ritual');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const ritualsData = [
  {
    name: 'Satyanarayan Katha & Puja',
    slug: 'satyanarayan-katha',
    category: 'Pujas & Katha',
    shortDescription: 'Sacred worship of Lord Vishnu for domestic prosperity, family peace, and gratitude.',
    detailedSignificance: 'Sri Satyanarayan Puja is dedicated to Lord Vishnu and is performed on Purnima, Sankranti, or auspicious family milestones to remove hardships and invoke divine grace.',
    benefits: ['Family peace and harmony', 'Removal of obstacles in endeavors', 'Spiritual tranquility and divine blessing'],
    approxDurationMinutes: 120,
    suggestedDakshana: 2100,
    iconName: 'Sparkles',
    samagriList: [
      { name: 'Pure Cow Ghee', quantity: '250g', providedBy: 'pandit' },
      { name: 'Wheat Flour & Sugar (Panjiri)', quantity: '500g', providedBy: 'devotee' },
      { name: 'Fresh Fruits (Pancha Phala)', quantity: '5 types', providedBy: 'devotee' },
      { name: 'Tulsi Leaves & Fresh Flowers', quantity: '1 basket', providedBy: 'devotee' },
      { name: 'Betel Leaves (Paan) & Supari', quantity: '11 pcs', providedBy: 'pandit' },
      { name: 'Roli, Akshat, Chandan, Janeu', quantity: 'Standard Set', providedBy: 'pandit' },
      { name: 'Brass Kalash & Coconut', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Havan Samagri & Samidha Sticks', quantity: '500g', providedBy: 'pandit' },
    ],
    vidhiSteps: [
      'Deepa Prajvalan & Shankhanaad',
      'Swasti Vachan & Sankalpa',
      'Gauri Ganesh Pujan & Varun Kalash Sthapana',
      'Panchamrit Snan of Shaligram / Lord Satyanarayan',
      'Recitation of 5 Chapters of Satyanarayan Katha in Sanskrit & Hindi',
      'Laghu Havan & Purnahuti',
      'Maha Aarti, Prasad Bhog & Shanti Path',
    ],
    isPopular: true,
  },
  {
    name: 'Griha Pravesh & Vastu Shanti',
    slug: 'griha-pravesh-vastu-shanti',
    category: 'Pujas & Katha',
    shortDescription: 'Auspicious housewarming ceremony purifying new home and removing Vastu doshas.',
    detailedSignificance: 'Griha Pravesh sanctifies a new dwelling with positive cosmic vibrations, invoking Lord Ganesha, Goddess Lakshmi, and Vastu Purusha for health and prosperity.',
    benefits: ['Neutralizes Vastu imperfections', 'Brings peace, health and wealth', 'Purifies premises with sacred mantras'],
    approxDurationMinutes: 180,
    suggestedDakshana: 5100,
    iconName: 'Home',
    samagriList: [
      { name: 'Vastu Yantra & Copper Plate', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Gangajal, Gomutra, Rose Water', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Navgraha Samidha & Wood', quantity: '1 kg', providedBy: 'pandit' },
      { name: 'Pure Cow Milk & Vessel for Boiling', quantity: '1 Litre', providedBy: 'devotee' },
      { name: 'Mango Leaves & Toran', quantity: '1 garland', providedBy: 'devotee' },
      { name: 'Dry Fruits & Sweets for Bhog', quantity: '500g', providedBy: 'devotee' },
      { name: 'Coconuts (Shriphal)', quantity: '5 pcs', providedBy: 'pandit' },
    ],
    vidhiSteps: [
      'Dwar Puja & Threshold Sanctification',
      'Entry with Auspicious Kalash on Head',
      'Milk Boiling Ritual (Doodh Ubalna)',
      'Ganesh Puja & Navgraha Sthapana',
      'Vastu Purusha Pujan & Dikpal Pujan',
      'Vastu Shanti Havan with special ghee oblations',
      'Shanti Abhisheka & Sacred Ashirwad',
    ],
    isPopular: true,
  },
  {
    name: 'Rudrabhishek Puja & Shiv Aradhana',
    slug: 'rudrabhishek-puja',
    category: 'Pujas & Katha',
    shortDescription: 'Sacred abhishek of Shiva Linga with 11 Vedic dravyas for health and liberation.',
    detailedSignificance: 'Rudrabhishek is an ancient Vedic ritual with recitation of Sri Rudram and Chamakam from Yajurveda, known to destroy negative energies and bestow profound mental peace.',
    benefits: ['Relief from chronic ailments & distress', 'Planetary afflictions pacification', 'Spiritual enlightenment and grace'],
    approxDurationMinutes: 150,
    suggestedDakshana: 3500,
    iconName: 'Flame',
    samagriList: [
      { name: 'Shivling Jaladhari & Brass Vessel', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Panchamrit (Milk, Curd, Ghee, Honey, Sugar)', quantity: '1 Litre', providedBy: 'devotee' },
      { name: 'Belpatra (Bilva Leaves)', quantity: '108 pcs', providedBy: 'devotee' },
      { name: 'Dhatura, Bhaang, Aak Flowers', quantity: '1 basket', providedBy: 'devotee' },
      { name: 'Bhasma / Vibhuti, Sandalwood Paste', quantity: '1 pack', providedBy: 'pandit' },
      { name: 'Sugarcane Juice / Coconut Water', quantity: '500ml', providedBy: 'devotee' },
    ],
    vidhiSteps: [
      'Sankalpa and Nyasa Vidhi',
      'Panchamrit Mahasnan of Shiva Linga',
      'Recitation of Namakam and Chamakam stotras',
      'Offering of 108 Belpatras with Mahamrityunjaya Mantra',
      'Dhoop, Deep, and Shiv Aarti',
      'Charanamrit and Bilva Prasad distribution',
    ],
    isPopular: true,
  },
  {
    name: 'Maha Mrityunjaya Jaap & Havan',
    slug: 'maha-mrityunjaya-havan',
    category: 'Havans & Yagya',
    shortDescription: 'Powerful Vedic Havan dedicated to Lord Shiva for longevity, recovery, and protection.',
    detailedSignificance: 'The Maha Mrityunjaya mantra from the Rigveda is revered as the ultimate protective chant that shields from untimely dangers and restores vibrant vitality.',
    benefits: ['Protection against accidents and illness', 'Conquers fear and anxiety', 'Recharges physical and mental energy'],
    approxDurationMinutes: 210,
    suggestedDakshana: 7100,
    iconName: 'Shield',
    samagriList: [
      { name: 'Havan Kund & Copper Ladle (Sruva)', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Special Ayur Havan Herbs (Giloy, Guggal, Jatamansi)', quantity: '1 kg', providedBy: 'pandit' },
      { name: 'Pure Desi Cow Ghee', quantity: '1 kg', providedBy: 'devotee' },
      { name: 'Dry Coconuts (Gola)', quantity: '3 pcs', providedBy: 'pandit' },
      { name: 'Yellow Mustard Seeds (Sarson)', quantity: '100g', providedBy: 'pandit' },
    ],
    vidhiSteps: [
      'Sankalpa for health and longevity',
      'Agni Sthapana & Pavamana Suktam',
      '1008 or 108 Ahutis with Maha Mrityunjaya Mantra',
      'Mrityu Nashak Stotra & Shiva Kavacham',
      'Purnahuti with whole coconut & silk cloth',
      'Raksha Sutra tying and Bhasma Tilak',
    ],
    isPopular: true,
  },
  {
    name: 'Navgraha Shanti Puja & Havan',
    slug: 'navgraha-shanti-puja',
    category: 'Shanti & Astrological',
    shortDescription: 'Propitiation of the nine astrological planetary deities for career, health, and peace.',
    detailedSignificance: 'Balances planetary influences (Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani, Rahu, Ketu) according to the devotee’s birth chart and Kundali.',
    benefits: ['Reduces Shani Sade Sati / Rahu impacts', 'Career stability and business growth', 'Relief from unforeseen delays'],
    approxDurationMinutes: 150,
    suggestedDakshana: 4100,
    iconName: 'Sun',
    samagriList: [
      { name: '9 Types of Grains (Navadhanya)', quantity: '9 packs', providedBy: 'pandit' },
      { name: '9 Coloured Cloths for Planets', quantity: '9 pcs', providedBy: 'pandit' },
      { name: 'Navgraha Samidha Sticks (Arka, Palasa, Khadira)', quantity: '1 set', providedBy: 'pandit' },
      { name: 'Pure Ghee & Havan Samagri', quantity: '500g', providedBy: 'pandit' },
    ],
    vidhiSteps: [
      'Sankalpa with Kundali planetary details',
      'Navgraha Mandala creation with rice & colors',
      'Individual deity Avahana and Beeja Mantra chanting',
      'Special Ahutis for each of the 9 Grahas',
      'Navgraha Stotra chanting & Aarti',
      'Dakshana & Annadaana Sankalpa',
    ],
    isPopular: false,
  },
  {
    name: 'Vedic Vivah Sanskar (Wedding Ceremony)',
    slug: 'vedic-vivah-sanskar',
    category: 'Sanskars & Vivah',
    shortDescription: 'Complete traditional 7-Pheras Vedic marriage ceremony following Sanatana Vidhi.',
    detailedSignificance: 'Sacred union binding two souls in the presence of Agni Deva, with Kanyadaan, Saptapadi, Sindoor Daan, and Mangalsutra Dharana.',
    benefits: ['Traditional Vedic authenticity', 'Blessings of ancestors and deities', 'Harmonious and sacred lifelong bond'],
    approxDurationMinutes: 240,
    suggestedDakshana: 11000,
    iconName: 'Heart',
    samagriList: [
      { name: 'Vivah Havan Kund, Samidha & Ghee', quantity: 'Full Setup', providedBy: 'pandit' },
      { name: 'Laja (Puffed Rice) for Laja Homa', quantity: '500g', providedBy: 'devotee' },
      { name: 'Garlands, Mangalsutra & Sindoor', quantity: '1 set', providedBy: 'devotee' },
      { name: 'Granthi Bandhan Cloth & Betel nuts', quantity: '1 set', providedBy: 'pandit' },
    ],
    vidhiSteps: [
      'Var Pooja & Madhuparka',
      'Kanyadaan & Hasta Melap',
      'Pradakshina (4 Pheras) around Sacred Fire',
      'Saptapadi (Seven Vows of Marriage)',
      'Sindoor Daan & Mangalsutra Vidhi',
      'Dhruva & Arundhati Darshan',
      'Ashirwad by Acharya & Elders',
    ],
    isPopular: true,
  },
];

/**
 * @desc    Seed initial database with verified pandits, rituals, and sample devotee
 * @route   POST /api/seed
 * @access  Public
 */
exports.seedDatabase = async (req, res) => {
  try {
    // Clear old data
    await User.deleteMany({});
    await PriestProfile.deleteMany({});
    await Ritual.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('🧹 [Seed] Existing collections cleared');

    // 1. Seed Rituals
    const createdRituals = await Ritual.insertMany(ritualsData);
    console.log(`🌸 [Seed] ${createdRituals.length} Vedic Rituals created`);

    // 2. Create Sample Devotee User
    const devoteeUser = await User.create({
      name: 'Rahul Sharma',
      email: 'devotee@panditji.com',
      password: 'password123',
      phone: '+91 98765 43210',
      role: 'devotee',
      gotra: 'Kashyap',
      address: {
        city: 'Delhi NCR',
        state: 'Delhi',
        fullAddress: 'Flat 402, Shanti Heights, Sector 62, Noida',
        pinCode: '201301',
      },
    });

    // 3. Create Sample Priests
    const priestsData = [
      {
        userData: {
          name: 'Acharya Vidyadhar Shastri',
          email: 'priest@panditji.com',
          password: 'password123',
          phone: '+91 98112 34567',
          role: 'priest',
          gotra: 'Bharadwaja',
          address: { city: 'Delhi NCR', state: 'Delhi' },
        },
        profileData: {
          title: 'Acharya',
          vedicLineage: 'Shukla Yajurveda Tradition (Madhyandina Shakha)',
          education: 'Acharya in Karmakanda, Sampurnanand Sanskrit Vishwavidyalaya, Varanasi',
          experienceYears: 18,
          languages: ['Sanskrit', 'Hindi', 'Gujarati'],
          specializations: ['Griha Pravesh', 'Satyanarayan Katha', 'Vivah Sanskar', 'Vastu Shanti'],
          bio: 'Gold Medalist Acharya with 18+ years of expertise in authentic Sanskrit stotra pronunciation, Vedic Havan vidhi, and auspicious Griha Pravesh rituals.',
          city: 'Delhi NCR',
          serviceRadiusKm: 35,
          rating: 4.9,
          reviewCount: 38,
          baseDakshana: 3100,
          isVerified: true,
          isAvailable: true,
        },
      },
      {
        userData: {
          name: 'Pandit Ramakant Tripathi',
          email: 'ramakant.sharma@panditji.com',
          password: 'password123',
          phone: '+91 94150 11223',
          role: 'priest',
          gotra: 'Vashishta',
          address: { city: 'Varanasi', state: 'Uttar Pradesh' },
        },
        profileData: {
          title: 'Pandit',
          vedicLineage: 'Rigveda Samhita Recitation Lineage',
          education: 'Shastri Degree, Banaras Hindu University (BHU), Varanasi',
          experienceYears: 24,
          languages: ['Sanskrit', 'Hindi', 'Bhojpuri', 'English'],
          specializations: ['Rudrabhishek Puja', 'Maha Mrityunjaya Havan', 'Navgraha Shanti', 'Kashi Yatra Puja'],
          bio: 'Born in the sacred ghats of Kashi, specializing in powerful Rudrabhishek chanting with 11 Vedic dravyas, Maha Mrityunjaya Jaap, and Graha Dosha remedies.',
          city: 'Varanasi',
          serviceRadiusKm: 50,
          rating: 5.0,
          reviewCount: 64,
          baseDakshana: 3500,
          isVerified: true,
          isAvailable: true,
        },
      },
      {
        userData: {
          name: 'Shastri Mukund Joshi',
          email: 'mukund.joshi@panditji.com',
          password: 'password123',
          phone: '+91 98220 99887',
          role: 'priest',
          gotra: 'Garg',
          address: { city: 'Mumbai', state: 'Maharashtra' },
        },
        profileData: {
          title: 'Shastri',
          vedicLineage: 'Krishna Yajurveda Tradition',
          education: 'Veda Vibhushan, Maharishi Ved Vigyan Sansthan',
          experienceYears: 14,
          languages: ['Hindi', 'Marathi', 'Sanskrit', 'English'],
          specializations: ['Ganesh Puja', 'Satyanarayan Katha', 'Vastu Shanti', 'Lakshmi Kubera Puja'],
          bio: 'Senior priest in Mumbai region assisting devotees with punctual, peaceful, and soulful rituals with step-by-step Hindi/Marathi explanation of each mantra.',
          city: 'Mumbai',
          serviceRadiusKm: 30,
          rating: 4.8,
          reviewCount: 29,
          baseDakshana: 2500,
          isVerified: true,
          isAvailable: true,
        },
      },
      {
        userData: {
          name: 'Acharya Devavrat Shukla',
          email: 'devavrat.shukla@panditji.com',
          password: 'password123',
          phone: '+91 97234 55667',
          role: 'priest',
          gotra: 'Shandilya',
          address: { city: 'Bengaluru', state: 'Karnataka' },
        },
        profileData: {
          title: 'Acharya',
          vedicLineage: 'Samaveda Sangeet & Stotra Tradition',
          education: 'Vyakarana & Jyotish Acharya, Tirupati Sanskrit Vidyapeetha',
          experienceYears: 12,
          languages: ['Sanskrit', 'Hindi', 'Gujarati', 'Kannada', 'English'],
          specializations: ['Vedic Vivah Sanskar', 'Griha Pravesh', 'Kundali Matching', 'Maha Mrityunjaya Havan'],
          bio: 'Modern yet deeply traditional Acharya in Bengaluru facilitating rituals for nuclear families, tech professionals, and community temples with deep warmth and devotion.',
          city: 'Bengaluru',
          serviceRadiusKm: 40,
          rating: 4.9,
          reviewCount: 22,
          baseDakshana: 4100,
          isVerified: true,
          isAvailable: true,
        },
      },
    ];

    const createdPriestProfiles = [];

    for (const p of priestsData) {
      const user = await User.create(p.userData);
      
      // Associate rituals
      const ritualsOffered = createdRituals.map((r) => ({
        ritualId: r._id,
        ritualName: r.name,
        dakshana: r.suggestedDakshana,
        durationMinutes: r.approxDurationMinutes,
        samagriIncluded: true,
      }));

      const profile = await PriestProfile.create({
        ...p.profileData,
        user: user._id,
        ritualsOffered,
      });

      createdPriestProfiles.push(profile);
    }

    console.log(`🪔 [Seed] ${createdPriestProfiles.length} Verified Priest profiles created`);

    // 4. Create Sample Past Booking
    const sampleBooking = await Booking.create({
      bookingNumber: 'PANDIT-2026-7821',
      user: devoteeUser._id,
      priest: createdPriestProfiles[0]._id,
      ritual: createdRituals[0]._id,
      ritualName: createdRituals[0].name,
      bookingDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      timeSlot: '09:00 AM - 12:00 PM (Shubh Abhijit)',
      devoteeName: 'Rahul Sharma',
      devoteePhone: '+91 98765 43210',
      gotra: 'Kashyap',
      familyMembers: 'Rahul, Priya Sharma, Ananya',
      address: {
        fullAddress: 'Flat 402, Shanti Heights, Sector 62',
        city: 'Delhi NCR',
        landmark: 'Near Fortis Hospital',
        pinCode: '201301',
      },
      samagriOption: 'by_pandit',
      dakshanaAmount: 2100,
      samagriCost: 1100,
      totalAmount: 3200,
      status: 'confirmed',
      paymentStatus: 'dakshana_on_ritual',
      specialInstructions: 'Please bring copper havan kund and pure cow ghee.',
    });

    // 5. Create Sample Verified Reviews
    await Review.create([
      {
        priest: createdPriestProfiles[0]._id,
        user: devoteeUser._id,
        booking: sampleBooking._id,
        devoteeName: 'Rahul Sharma',
        ritualName: 'Satyanarayan Katha & Puja',
        rating: 5,
        comment: 'Acharya Vidyadhar Ji conducted the Satyanarayan Katha with immense devotion and patience. Explained every shloka in Hindi. Entire family was blessed!',
        isVerified: true,
      },
      {
        priest: createdPriestProfiles[0]._id,
        user: devoteeUser._id,
        devoteeName: 'Meenakshi Iyer',
        ritualName: 'Griha Pravesh & Vastu Shanti',
        rating: 5,
        comment: 'Punctual, brought all the pure samagri, and the Vastu Shanti Havan created such positive energy in our new flat in Noida.',
        isVerified: true,
      },
      {
        priest: createdPriestProfiles[1]._id,
        user: devoteeUser._id,
        devoteeName: 'Sanjay Mishra',
        ritualName: 'Rudrabhishek Puja',
        rating: 5,
        comment: 'Pandit Ramakant Tripathi Ji from Kashi has incredible Vedic chanting. The Rudrabhishek was divine.',
        isVerified: true,
      },
    ]);

    console.log('✅ [Seed] Database seeded with rich authentic data');

    res.json({
      success: true,
      message: 'Database seeded successfully with authentic Vedic rituals, verified pandits, and test credentials!',
      data: {
        ritualsCount: createdRituals.length,
        priestsCount: createdPriestProfiles.length,
        demoAccounts: [
          { role: 'Devotee (User)', email: 'devotee@panditji.com', password: 'password123' },
          { role: 'Acharya (Priest)', email: 'priest@panditji.com', password: 'password123' },
        ],
      },
    });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error seeding database',
    });
  }
};

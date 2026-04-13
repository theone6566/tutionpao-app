// Mock data for TutionPao platform

export const tutors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    profilePic: null,
    initials: "RK",
    rating: 4.9,
    totalReviews: 127,
    experience: 12,
    qualifications: [{ degree: "Ph.D", subject: "Mathematics", university: "IIT Delhi" }],
    subjects: ["Mathematics", "Physics"],
    specialization: ["IIT JEE", "CBSE"],
    city: "Delhi",
    area: "Laxmi Nagar",
    isOnline: true,
    isVerified: true,
    pricing: {
      bySubject: [
        { subject: "Mathematics", pricePerHour: 500, pricePerMonth: 8000 },
        { subject: "Physics", pricePerHour: 450, pricePerMonth: 7500 }
      ],
      iitCoaching: { pricePerHour: 800, pricePerMonth: 15000, discount: 10 }
    },
    subscription: { plan: "premium" },
    bio: "IIT Delhi alumnus with 12+ years of experience in teaching Mathematics and Physics for IIT JEE preparation. Over 200 students placed in IITs."
  },
  {
    id: 2,
    name: "Priya Sharma",
    profilePic: null,
    initials: "PS",
    rating: 4.8,
    totalReviews: 95,
    experience: 8,
    qualifications: [{ degree: "M.Sc", subject: "Chemistry", university: "BHU" }],
    subjects: ["Chemistry", "Biology"],
    specialization: ["NEET", "AIMS"],
    city: "Ghaziabad",
    area: "Vaishali",
    isOnline: true,
    isVerified: true,
    pricing: {
      bySubject: [
        { subject: "Chemistry", pricePerHour: 400, pricePerMonth: 6500 },
        { subject: "Biology", pricePerHour: 400, pricePerMonth: 6500 }
      ],
      aimsCoaching: { pricePerHour: 600, pricePerMonth: 12000, discount: 15 }
    },
    subscription: { plan: "professional" },
    bio: "Passionate NEET mentor with 8 years experience. Specializing in Organic Chemistry and Biology with a proven track record of AIMS selections."
  },
  {
    id: 3,
    name: "Amit Verma",
    profilePic: null,
    initials: "AV",
    rating: 4.7,
    totalReviews: 68,
    experience: 6,
    qualifications: [{ degree: "M.Tech", subject: "Computer Science", university: "NIT Allahabad" }],
    subjects: ["Mathematics", "Computer Science"],
    specialization: ["IIT JEE", "NIT"],
    city: "Noida",
    area: "Sector 62",
    isOnline: false,
    isVerified: true,
    pricing: {
      bySubject: [
        { subject: "Mathematics", pricePerHour: 350, pricePerMonth: 5500 },
        { subject: "Computer Science", pricePerHour: 400, pricePerMonth: 6000 }
      ],
      iitCoaching: { pricePerHour: 600, pricePerMonth: 11000, discount: 5 }
    },
    subscription: { plan: "professional" },
    bio: "NIT graduate specializing in competitive math and programming. Focus on building strong fundamentals for JEE Advanced."
  },
  {
    id: 4,
    name: "Dr. Sunita Patel",
    profilePic: null,
    initials: "SP",
    rating: 4.9,
    totalReviews: 156,
    experience: 15,
    qualifications: [{ degree: "Ph.D", subject: "Physics", university: "IISc Bangalore" }],
    subjects: ["Physics"],
    specialization: ["IIT JEE", "NEET"],
    city: "Ghaziabad",
    area: "Indirapuram",
    isOnline: true,
    isVerified: true,
    pricing: {
      bySubject: [
        { subject: "Physics", pricePerHour: 600, pricePerMonth: 10000 }
      ],
      iitCoaching: { pricePerHour: 900, pricePerMonth: 18000, discount: 12 }
    },
    subscription: { plan: "premium" },
    bio: "IISc Bangalore alumna. 15+ years teaching Physics for IIT JEE and NEET. Known for conceptual clarity and problem-solving techniques."
  },
  {
    id: 5,
    name: "Vikash Singh",
    profilePic: null,
    initials: "VS",
    rating: 4.6,
    totalReviews: 42,
    experience: 4,
    qualifications: [{ degree: "B.Tech", subject: "English Literature", university: "Delhi University" }],
    subjects: ["English", "Hindi"],
    specialization: ["CBSE", "ICSE"],
    city: "Delhi",
    area: "Dwarka",
    isOnline: true,
    isVerified: false,
    pricing: {
      bySubject: [
        { subject: "English", pricePerHour: 250, pricePerMonth: 4000 },
        { subject: "Hindi", pricePerHour: 200, pricePerMonth: 3500 }
      ]
    },
    subscription: { plan: "basic" },
    bio: "Young and energetic English teacher focusing on CBSE and ICSE boards. Making language learning fun and interactive."
  },
  {
    id: 6,
    name: "Neha Gupta",
    profilePic: null,
    initials: "NG",
    rating: 4.8,
    totalReviews: 89,
    experience: 10,
    qualifications: [{ degree: "M.Sc", subject: "Biology", university: "AIIMS Delhi" }],
    subjects: ["Biology", "Chemistry"],
    specialization: ["NEET", "AIMS"],
    city: "Ghaziabad",
    area: "Raj Nagar Extension",
    isOnline: false,
    isVerified: true,
    pricing: {
      bySubject: [
        { subject: "Biology", pricePerHour: 500, pricePerMonth: 8000 },
        { subject: "Chemistry", pricePerHour: 450, pricePerMonth: 7000 }
      ],
      aimsCoaching: { pricePerHour: 700, pricePerMonth: 14000, discount: 10 }
    },
    subscription: { plan: "premium" },
    bio: "AIIMS graduate with 10 years of dedicated NEET coaching. Specializing in NCERT-based conceptual learning for Biology and Chemistry."
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Arun Mehta",
    role: "IIT JEE 2025 — AIR 342",
    text: "Found the best Physics teacher through TutionPao. Dr. Sunita ma'am's classes transformed my preparation completely. Highly recommended!",
    rating: 5,
    initials: "AM"
  },
  {
    id: 2,
    name: "Sneha Reddy",
    role: "NEET 2025 — 680/720",
    text: "TutionPao helped me find a Chemistry teacher within 2km of my home. The transparent pricing and verified profiles gave my parents full confidence.",
    rating: 5,
    initials: "SR"
  },
  {
    id: 3,
    name: "Rohit Mishra",
    role: "Parent, Class 10 Student",
    text: "As a parent, I wanted verified tutors near our locality. TutionPao made it incredibly easy to compare prices, read reviews, and book trial sessions.",
    rating: 5,
    initials: "RM"
  },
  {
    id: 4,
    name: "Dr. Kavita Joshi",
    role: "Teacher — 200+ Students",
    text: "TutionPao's subscription plans are very affordable. The platform brings students directly to me. I've grown my student base by 3x in just 6 months!",
    rating: 5,
    initials: "KJ"
  }
];

export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 499,
    period: "month",
    description: "Get started with essential features",
    features: [
      { text: "Profile Listing", included: true },
      { text: "5 km Search Radius", included: true },
      { text: "5 Student Messages / month", included: true },
      { text: "Basic Analytics", included: true },
      { text: "Custom Pricing", included: true },
      { text: "Video Consultation", included: false },
      { text: "Premium Badge", included: false },
      { text: "Featured Listing", included: false },
      { text: "Dedicated Support", included: false }
    ],
    popular: false
  },
  {
    id: "professional",
    name: "Professional",
    price: 999,
    period: "month",
    description: "Grow your student base faster",
    features: [
      { text: "Profile Listing", included: true },
      { text: "15 km Search Radius", included: true },
      { text: "Unlimited Student Messages", included: true },
      { text: "Detailed Analytics", included: true },
      { text: "Custom Pricing", included: true },
      { text: "Video Consultation", included: true },
      { text: "Premium Badge", included: true },
      { text: "Featured Listing", included: false },
      { text: "Dedicated Support", included: false }
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 1999,
    period: "month",
    description: "Maximum visibility & all features",
    features: [
      { text: "Profile Listing", included: true },
      { text: "Unlimited Search Radius", included: true },
      { text: "Unlimited Student Messages", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Custom Pricing", included: true },
      { text: "Video Consultation", included: true },
      { text: "Premium Badge", included: true },
      { text: "Featured Listing", included: true },
      { text: "Dedicated Support", included: true }
    ],
    popular: false
  }
];

export const stats = [
  { value: "10,000+", label: "Active Students" },
  { value: "2,500+", label: "Verified Tutors" },
  { value: "50+", label: "Cities" },
  { value: "4.8★", label: "Average Rating" }
];

export const subjects = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "English", "Hindi", "Computer Science", "Economics",
  "Accountancy", "Business Studies", "History", "Geography"
];

export const specializations = [
  "IIT JEE", "NEET", "AIMS", "CBSE", "ICSE", "State Board", "NIT"
];

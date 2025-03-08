
// // Generate random date within the last 30 days
// function getRandomDate() {
//   const now = new Date()
//   const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
//   return new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())).toISOString()
// }

// // Generate random phone number
// function getRandomPhone() {
//   return `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`
// }

// // Generate random rating between 1 and 5
// function getRandomRating() {
//   return Math.floor(Math.random() * 5) + 1
// }

// // Asset categories with their questions
// const categories = [
//   {
//     name: "Public Toilet",
//     questions: [
//       {
//         eng: "Is the toilet clean?",
//         tamil: "கழிப்பறை சுத்தமாக உள்ளதா?",
//       },
//       {
//         eng: "Is water available?",
//         tamil: "தண்ணீர் கிடைக்கிறதா?",
//       },
//       {
//         eng: "Are the lights working?",
//         tamil: "விளக்குகள் வேலை செய்கின்றனவா?",
//       },
//     ],
//   },
//   {
//     name: "Park",
//     questions: [
//       {
//         eng: "Is the park well maintained?",
//         tamil: "பூங்கா நன்றாக பராமரிக்கப்படுகிறதா?",
//       },
//       {
//         eng: "Are the play areas safe for children?",
//         tamil: "விளையாட்டு பகுதிகள் குழந்தைகளுக்கு பாதுகாப்பானதா?",
//       },
//       {
//         eng: "Is the park clean?",
//         tamil: "பூங்கா சுத்தமாக உள்ளதா?",
//       },
//     ],
//   },
//   {
//     name: "Bus Stop",
//     questions: [
//       {
//         eng: "Is the bus stop clean?",
//         tamil: "பஸ் நிறுத்தம் சுத்தமாக உள்ளதா?",
//       },
//       {
//         eng: "Is the shelter adequate?",
//         tamil: "தங்குமிடம் போதுமானதாக உள்ளதா?",
//       },
//       {
//         eng: "Is the bus schedule displayed?",
//         tamil: "பஸ் அட்டவணை காட்டப்படுகிறதா?",
//       },
//     ],
//   },
//   {
//     name: "Government Office",
//     questions: [
//       {
//         eng: "Was the service prompt?",
//         tamil: "சேவை விரைவாக இருந்ததா?",
//       },
//       {
//         eng: "Were the staff helpful?",
//         tamil: "ஊழியர்கள் உதவியாக இருந்தார்களா?",
//       },
//       {
//         eng: "Was the office clean and organized?",
//         tamil: "அலுவலகம் சுத்தமாகவும் ஒழுங்காகவும் இருந்ததா?",
//       },
//     ],
//   },
// ]

// // Assets for each category
// const assets = [
//   {
//     category: "Public Toilet",
//     items: [
//       { name: "Central Bus Stand Toilet", code: "PT001", address: "Central Bus Stand, Main Road" },
//       { name: "Railway Station Toilet", code: "PT002", address: "Railway Station, Station Road" },
//       { name: "Beach Road Toilet", code: "PT003", address: "Beach Road, Near Park" },
//     ],
//   },
//   {
//     category: "Park",
//     items: [
//       { name: "Children's Park", code: "PK001", address: "Park Street, City Center" },
//       { name: "Gandhi Park", code: "PK002", address: "MG Road, Near Library" },
//       { name: "Riverside Park", code: "PK003", address: "River View Road, East End" },
//     ],
//   },
//   {
//     category: "Bus Stop",
//     items: [
//       { name: "Main Road Bus Stop", code: "BS001", address: "Main Road, City Center" },
//       { name: "Hospital Bus Stop", code: "BS002", address: "Hospital Road, Medical District" },
//       { name: "College Bus Stop", code: "BS003", address: "College Road, Education Zone" },
//     ],
//   },
//   {
//     category: "Government Office",
//     items: [
//       { name: "Municipal Corporation", code: "GO001", address: "Civil Lines, Administrative Area" },
//       { name: "Revenue Office", code: "GO002", address: "Government Complex, City Center" },
//       { name: "Public Works Department", code: "GO003", address: "PWD Road, Industrial Area" },
//     ],
//   },
// ]

// // User names
// const userNames = [
//   "Rajesh Kumar",
//   "Priya Singh",
//   "Amit Patel",
//   "Sunita Sharma",
//   "Vijay Mehta",
//   "Ananya Gupta",
//   "Deepak Verma",
//   "Kavita Reddy",
//   "Suresh Nair",
//   "Meena Iyer",
//   "Ravi Krishnan",
//   "Lakshmi Venkat",
//   "Sanjay Joshi",
//   "Neha Malhotra",
//   "Prakash Rao",
//   "Divya Menon",
// ]

// // Feedback comments
// const positiveFeedback = [
//   "Very clean and well maintained.",
//   "Excellent service, very satisfied.",
//   "Much better than expected.",
//   "Staff were very helpful and courteous.",
//   "Great improvement from my last visit.",
//   "Very impressed with the facilities.",
//   "Clean and hygienic, good job!",
//   "Prompt service, no waiting time.",
// ]

// const negativeFeedback = [
//   "Needs better maintenance.",
//   "Not clean enough.",
//   "Staff were not helpful.",
//   "Long waiting time, needs improvement.",
//   "Facilities are inadequate.",
//   "Poor lighting and ventilation.",
//   "Water supply was insufficient.",
//   "Needs more regular cleaning.",
// ]

// // Generate dummy data based on the MySQL view structure
// export function getFeedbackData(){
//   const data = []

//   // Generate 50 random feedback entries
//   for (let i = 1; i <= 50; i++) {
//     // Randomly select a category
//     const categoryIndex = Math.floor(Math.random() * categories.length)
//     const category = categories[categoryIndex]

//     // Randomly select an asset from the category
//     const assetList = assets.find((a) => a.category === category.name)?.items || []
//     const asset = assetList[Math.floor(Math.random() * assetList.length)]

//     // Randomly select a question from the category
//     const questionIndex = Math.floor(Math.random() * category.questions.length)
//     const question = category.questions[questionIndex]

//     // Randomly determine if feedback is positive or negative
//     const isPositive = Math.random() > 0.4 // 60% positive, 40% negative
//     const response = isPositive ? "Yes" : "No"
//     const feedback = isPositive
//       ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)]
//       : negativeFeedback[Math.floor(Math.random() * negativeFeedback.length)]

//     data.push({
//       feedback_id: `FB${i.toString().padStart(4, "0")}`,
//       feedback_date: getRandomDate(),
//       user_name: userNames[Math.floor(Math.random() * userNames.length)],
//       user_mobile: getRandomPhone(),
//       user_rating: getRandomRating(),
//       user_feedback: feedback,
//       asset_name: asset.name,
//       asset_code: asset.code,
//       asset_address: asset.address,
//       category_name: category.name,
//       category_eng_question: category.questions[0].eng,
//       category_tamil_question: category.questions[0].tamil,
//       parameter_eng_question: question.eng,
//       parameter_tamil_question: question.tamil,
//       user_response: response,
//     })
//   }

//   return data
// }


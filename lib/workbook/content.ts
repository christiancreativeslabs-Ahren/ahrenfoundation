export type ScriptureDefinition = {
  text: string;
  reference: string;
};

// export type WorkbookModuleDefinition = {
//   moduleKey: string;
//   moduleNumber: number;
//   weekNumber: number;
//   sendOffsetDays: number;
//   sendDayLabel: "Monday" | "Friday";
//   title: string;
//   subtitle?: string;
//   subject: string;
//   previewText: string;
//   openingCopy: string[];
//   scriptures: ScriptureDefinition[];
//   reflection: string;
//   focus: string;
//   action: string;
//   questions: string[];
// };

export type WorkbookModuleDefinition = {
  moduleKey: string;
  moduleNumber: number;
  weekNumber: number;
  sendOffsetDays: number;
  sendDayLabel: "Monday" | "Friday";
  title: string;
  subtitle?: string;
  subject: string;
  previewText: string;
  openingCopy: string[];
  scriptures: ScriptureDefinition[];
  reflection: string;
  focus: string;
  action: string;
  questions: string[];

  // New rich content fields
  bodySections?: BodySection[];
  thisWeeksActions?: {
    intro: string;
    items: string[];
  };
  prayer?: {
    title?: string;
    text: string;
  };
  finalWord?: {
    title?: string;
    text: string;
  };
  closing?: {
    title?: string;
    text: string;
    signature?: string;
  };
};

export type BodySection = {
  heading?: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string;
  table?: {
    headers: string[];
    rows: string[][];
  };
};

export type WorkbookProgramDefinition = {
  slug: string;
  name: string;
  summary: string;
  startsAfterDays: number;
  modules: WorkbookModuleDefinition[];
};

// export const AHREN_WORKBOOK_PROGRAM: WorkbookProgramDefinition = {
//   slug: "christian-creativity-masterclass",
//   name: "Ahren Christian Creativity Masterclass",
//   summary:
//     "A flexible Workbook journey for Christian creatives to discover identity, partner with the Holy Spirit, build character, and align their skills with God's purpose.",
//   startsAfterDays: 7,
//   modules: [
//     // {
//     //   moduleKey: "module-1",
//     //   moduleNumber: 1,
//     //   weekNumber: 1,
//     //   sendOffsetDays: 0,
//     //   sendDayLabel: "Monday",
//     //   title: "You Were Created to Create",
//     //   subtitle: "Your Creative Identity",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 1: You Were Created to Create",
//     //   previewText:
//     //     "Your first Ahren module: discover your creative identity in God.",
//     //   openingCopy: [
//     //     "Welcome to the Ahren Foundation Christian Creativity Masterclass Program!",
//     //     "We are delighted to welcome you to this journey. Over the next 6 weeks, we will walk together - discovering your creativity, building practical skills, and uncovering the Kingdom purpose God has placed inside you.",
//     //     "You are not here by accident. God has something beautiful to build through you.",
//     //     "Now, let's begin.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "In the beginning God created the heaven and the earth.",
//     //       reference: "Genesis 1:1 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "You are made in the image of the Creator. Creativity is not a hobby - it is your nature. Your skills are not an accident; they are an assignment.",
//     //   focus:
//     //     "Discovering your creative identity and understanding that your skills are not an accident.",
//     //   action:
//     //     "Notice something creative you do each day - even small things like solving a problem, writing a kind message, or planning something new. Write it down.",
//     //   questions: [
//     //     "What is one thing you have created - anything at all (code, design, meal, story, solution, a plan, a kind word)?",
//     //     "How did you feel when you made it?",
//     //     "What does it mean to you that you are made in the image of the Creator?",
//     //     "Have you ever believed the lie that you are not creative? What changed that belief?",
//     //     'Complete this sentence: "I am creative because God is creative. Today I will..."',
//     //   ],
//     // },
//     {
//       moduleKey: "module-1",
//       moduleNumber: 1,
//       weekNumber: 1,
//       sendOffsetDays: 0,
//       sendDayLabel: "Monday",
//       title: "You Were Created to Create",
//       subtitle: "Your Creative Identity",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 1: You Were Created to Create",
//       previewText:
//         "Your first Ahren module: discover your creative identity in God.",
//       openingCopy: [
//         "Welcome to Ahren Foundation Christian Creativity Masterclass Program!",
//         "Hello Dear Creative.",
//         "I am so honoured that you have said yes to this journey. Over the next 6 weeks, we will walk together – discovering your creativity, learning practical skills, and uncovering the Kingdom purpose God has placed inside you.",
//         "You are not here by accident. God has something beautiful to build through you.",
//         "Now, let's begin. Let's start at the very beginning – not of this course, but of the Bible.",
//       ],
//       scriptures: [
//         {
//           text: "In the beginning God created the heaven and the earth.",
//           reference: "Genesis 1:1 (KJV)",
//         },
//         {
//           text: "So God created man in his own image, in the image of God created he him; male and female created he them.",
//           reference: "Genesis 1:27 (KJV)",
//         },
//         {
//           text: "And God saw every thing that he had made, and, behold, it was very good.",
//           reference: "Genesis 1:31 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "Let Me Take You Back to the Very First Week of History",
//           paragraphs: [
//             "Imagine: there is nothing. No light. No sound. No earth. No sky. Just God – Father, Son, and Holy Spirit – in perfect love and community.",
//             "Then God speaks. “Let there be light.” And light appears.",
//             "He doesn't struggle. He doesn't try hard. He simply creates. Out of nothing, He makes everything. He separates waters from sky. He calls dry ground to appear. He fills the earth with grass, herbs, fruit trees, each seed carrying the power to reproduce. He puts the sun, moon, and stars in the sky – not for function only, but for beauty. He fills the oceans with creatures and the skies with birds.",
//             "After each day, He looks at what He has made and says, “It is good.”",
//             "But then comes the sixth day. God creates something different. He forms a man – not by speaking, but by shaping dust with His hands. He breathes His own breath into the man. And then He creates a woman from the man's rib – intimate, intentional, personal.",
//             "And here is the most amazing part: God says, “Let us make man in our image.”",
//             "Not after His image. Not like His image. In His image. The same way a child carries the likeness of their parent, you carry the likeness of God.",
//             "Do you know what that means? God is a Creator. Therefore, you are a creator.",
//             "Not because you say so. Not because you took a class. But because the Creator of the universe looked at you and said, “Let them be like Me.”",
//             "You were created to create.",
//           ],
//         },
//         {
//           heading: "Think about it",
//           bullets: [
//             "When you write a line of code that solves a problem, you are creating.",
//             "When you design a logo that communicates a message, you are creating.",
//             "When you write a story that makes someone feel understood, you are creating.",
//             "When you cook a meal from scratch, you are creating.",
//             "When you find a way to fix something broken, you are creating.",
//             "When you sing a song that lifts someone's spirit, you are creating.",
//           ],
//           closing:
//             "You do not have to be a painter or a musician to be creative. You just have to make something that was not there before.",
//         },
//         {
//           heading: "Lies the World Tells You About Creativity",
//           table: {
//             headers: ["Lie", "Truth"],
//             rows: [
//               [
//                 "“You're not creative.”",
//                 "You are made in the image of the Creator.",
//               ],
//               [
//                 "“Only artists are creative.”",
//                 "Engineers, coders, teachers, parents, and problem-solvers are creative.",
//               ],
//               [
//                 "“Creativity is just for fun.”",
//                 "Creativity is also how you glorify God and serve others.",
//               ],
//               [
//                 "“You need a special talent.”",
//                 "Creativity is an innate muscle. Use it, and it grows.",
//               ],
//               [
//                 "“Copying is bad.”",
//                 "Imitation is how we learn. Your unique voice makes it original.",
//               ],
//             ],
//           },
//         },
//         {
//           heading: "Why This Matters for Your Life",
//           paragraphs: [
//             "If you believe you are not creative, you will never try. You will wait for someone else to solve problems. You will only keep consuming instead of producing. You will hide your gift.",
//             "But if you believe you were made to create, everything changes.",
//           ],
//           bullets: [
//             "You will see problems as opportunities.",
//             "You will stop waiting for permission.",
//             "You will start building – even if it's small.",
//             "You will discover that making something is one of the most joyful, God-honouring things you can do.",
//           ],
//         },
//       ],
//       reflection:
//         "You are made in the image of the Creator. Creativity is not a hobby – it is your nature. Your skills are not an accident; they are an assignment. God is a Creator. Therefore, you are a creator. You were created to create.",
//       focus:
//         "Discovering your creative identity and understanding that you were made in the image of the Creator to create.",
//       thisWeeksActions: {
//         intro:
//           "Pick at least 5 of the 7 actions below to complete this week. You don't have to do them in order – just make sure you are practicing and reflecting.",
//         items: [
//           "Read Genesis 1 slowly. Notice how God creates with joy, not pressure. Let that sink in.",
//           "Name one thing you created today – even a text message that helped someone, a meal you prepared, or a problem you solved. Write it down.",
//           "Say out loud three times: “I am creative because God is creative.” Speak it until you believe it.",
//           "Ask a friend: “What is one creative thing you've seen me do?” Write down their answer.",
//           "Thank God for your creativity. Write a short prayer of thanks – just a few sentences from your heart.",
//           "Create something small this week – a sketch, a note, a plan, a simple design, a line of code, a recipe. Anything that did not exist before you made it.",
//           "Rest one day this weekend. Let the truth sink in: You are a creator.",
//         ],
//       },
//       action:
//         "Pick at least 5 of the 7 Creative Growth Actions this week. Notice something creative you do each day – even small things like solving a problem, writing a kind message, or planning something new. Write it down. Create something small that did not exist before you made it.",
//       questions: [
//         "What is one thing you have created – anything at all (code, design, meal, story, solution, a plan, a kind word)?",
//         "How did you feel when you made it?",
//         "What does it mean to you that you are made in the image of the Creator?",
//         "Have you ever believed the lie that you are not creative? What changed that belief?",
//         'Complete this sentence: "I am creative because God is creative. Today I will..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Dear Father God, thank You for making me in Your image. I confess that I sometimes believe lies about my creativity. I have compared myself to others. I have hidden my ideas. But Your Word says I am made like You – a creator. Help me this week to see the creativity already inside me. Give me courage to start making something – even something small. Let my creation glorify you. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for This Week",
//         text: "You are not too young. You are not too old. You are not too ordinary. You are not too late. You are exactly where you need to be — and the God who spoke light into darkness lives in you. And he is still creating. Through you. So this week, don't wait for permission. Don't wait for the perfect time. Just begin. Start small. Start messy. Just start. Now go create something.",
//       },
//       closing: {
//         title: "See You Next Week",
//         text: "That's it for today. Take your time with the assignments, and don't rush. The goal is not perfection — it's presence. This Friday, we will dig deeper into what creativity really is and how you can become more creative — even if you've always thought you weren't the “creative type.” I'll be right here waiting for you. Keep creating.",
//         signature: "— Your Ahren Mentor",
//       },
//     },
//     {
//       moduleKey: "module-2",
//       moduleNumber: 2,
//       weekNumber: 1,
//       sendOffsetDays: 4, // Friday of Week 1
//       sendDayLabel: "Friday",
//       title: "What You Need to Know About Creativity",
//       subtitle: "And How to Become More Creative",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 1: What You Need to Know About Creativity",
//       previewText:
//         "Creativity is a muscle. Discover how God taught Bezalel — and how He can grow creativity in you.",
//       openingCopy: [
//         "Hello and Welcome Back Creative!",
//         "Earlier this Monday, we discovered that you were created to create — because you are made in the image of the Creator. But maybe you still have questions: “If I'm supposed to be creative, why don't I feel creative?” “How do I actually become more creative?” “Is creativity something you learn, or is it just for special people?”",
//         "Those are great questions. And this week, we are going to answer them. Let's dive in.",
//       ],
//       scriptures: [
//         {
//           text: "And Moses said unto the children of Israel, See, the LORD hath called by name Bezalel… and he hath filled him with the spirit of God, in wisdom, in understanding, and in knowledge, and in all manner of workmanship.",
//           reference: "Exodus 35:30–31 (KJV)",
//         },
//         {
//           text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
//           reference: "Proverbs 4:7 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "Bezalel — The Man God Taught to Create",
//           paragraphs: [
//             "Let me introduce you to a man named Bezalel.",
//             "His name means “in the shadow of God.” And he appears in the book of Exodus at a very important moment. God is about to build the Tabernacle – a portable place of worship for the nation of Israel. It needed to be beautiful: gold, silver, intricate fabrics, carvings, and artistic designs.",
//             "So God chooses Bezalel.",
//             "But here is the key: God doesn't just assign him the work. God fills him with His Spirit, wisdom, understanding, and knowledge – in all manner of workmanship.",
//             "That means Bezalel was not born knowing how to do all this. God taught him. God equipped him. Creativity was not a natural gift for Bezalel alone – it was something God gave and grew in him.",
//             "And here is the beautiful part: God also gives Bezalel a helper, Oholiab, and teaches both of them to teach others (Exodus 35:34).",
//             "So here is the pattern:",
//           ],
//           bullets: [
//             "God calls you.",
//             "God equips you.",
//             "God teaches you.",
//             "Then you teach others.",
//           ],
//           closing:
//             "Creativity is not magic. It is not reserved for a select few. It is a gift that God grows in you as you walk with Him and practice. Creativity is a muscle. You grow it by using it. You were not born knowing how to write code, design a logo, compose a song, or build a business. You learned. And you can keep learning. The same is true for creativity. The more you practice, the more you try, fail, adjust, and try again – the more creative you become.",
//         },
//         {
//           heading: "Practical Steps to Become More Creative",
//           paragraphs: [
//             "Pick at least 3 of the following 7 steps to practice this week.",
//           ],
//           bullets: [
//             "Consume widely — read books, watch videos, listen to podcasts, explore within and outside your field. The best creators borrow from many places.",
//             "Keep a creative journal — every day, write one idea, one sketch, or one question. It doesn't have to be perfect. Just show up.",
//             "Practice constraints — limit yourself to build creativity. Example: “Design a logo using only two colours.” Constraints force you to think differently.",
//             "Ask “What if?” — take an existing solution and ask: “What if I changed this one thing?” Play with possibilities.",
//             "Solve small problems — look around your home, church, workplace, or school. What is one small problem you could solve with your skills? Do it.",
//             "Collaborate — work with someone else. Different perspectives spark new ideas.",
//             "Pray for ideas — invite the Holy Spirit into your creative process daily. He is your ultimate creative partner.",
//           ],
//         },
//       ],
//       reflection:
//         "Creativity is a muscle. You grow it by using it. God taught Bezalel — He can teach you too. You were not born knowing how to create. You learned. And you can keep learning.",
//       focus:
//         "Understanding that creativity is a skill God grows in you, and learning practical ways to become more creative.",
//       thisWeeksActions: {
//         intro: "Pick at least 4 of the 6 actions below to complete this week.",
//         items: [
//           "Identify one myth you have believed about creativity. Write down the truth that replaces it.",
//           "Read Exodus 35:30–35 slowly. Notice that God taught Bezalel. He can teach you too.",
//           "Pick one practical step from the list above. Do it every day this week. Write down what you did.",
//           "Ask someone older or wiser in your field: “How did you grow your creativity?” Write their answer.",
//           "Spend 30 minutes learning something new – a tool, a technique, a skill – that you have never tried before.",
//           "Create something small every day for 3 days (even just 5 minutes per day). It can be a sketch, a line of code, a plan, a melody, or a solution to a tiny problem.",
//         ],
//       },
//       action:
//         "Pick at least 4 of the 6 Creative Growth Actions this week. Practice one practical step daily and create something small for 3 days.",
//       questions: [
//         "What myth about creativity have you believed in the past?",
//         "What truth from Bezalel’s story speaks most to you right now?",
//         "Which practical step will you practice this week?",
//         "What is one small thing you will create in the next 3 days?",
//         'Complete this sentence: "Creativity is a muscle. This week I will grow it by..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Lord, I thank You that You are still teaching me. I am not stuck. I am not too old or too slow. You taught Bezalel, and You can teach me. Open my eyes to see the creativity You have already placed inside me. Help me to practice, to fail without fear, and to grow. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for This Week",
//         text: "Creativity is not a special gene reserved for the lucky few. It is a gift God gives, a skill God grows, and a habit you build. You don't have to be perfect. You just have to start. So this week, stop waiting. Stop comparing. Stop listening to the lie that you are not creative. You are creative because God is creative. And He is still teaching you.",
//       },
//       closing: {
//         title: "See You Next Week",
//         text: "That's it for Week 1. Take your time with the assignments. The goal is not perfection — it's practice. Next week, we will explore the Holy Spirit as your creative partner — how He gives ideas, solves problems, and unlocks creativity you didn't know you had. Until then, keep creating. Keep practicing. Keep praying more in the Spirit. I'll be right here waiting for you.",
//         signature: "— Your Ahren Mentor",
//       },
//     },
//     // {
//     //   moduleKey: "module-2",
//     //   moduleNumber: 2,
//     //   weekNumber: 1,
//     //   sendOffsetDays: 4,
//     //   sendDayLabel: "Friday",
//     //   title: "What You Need to Know About Creativity",
//     //   subtitle: "How to Become More Creative",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 1: What You Need to Know About Creativity",
//     //   previewText:
//     //     "Creativity is a muscle. This module helps you begin practicing it.",
//     //   openingCopy: [
//     //     "Welcome to the second module of Week 1!",
//     //     'Last time, we discovered that you were created to create. Now we ask the practical question: "How do I actually become more creative?"',
//     //     "The answer is simpler than you think: creativity is a muscle - you grow it by using it.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "See, the LORD hath called by name Bezalel... and he hath filled him with the spirit of God, in wisdom, and in understanding, and in knowledge, and in all manner of workmanship.",
//     //       reference: "Exodus 35:30-31 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "Bezalel was not born a master craftsman. God taught him. Creativity is not magic; it is a skill you can grow through curiosity, practice, and perseverance. The lies you have believed about creativity - that you either have it or you don't - are simply not true.",
//     //   focus:
//     //     "Understanding what creativity really is and learning practical steps to grow it.",
//     //   action:
//     //     "Choose one small creative habit to practice every day this week, such as sketching, writing, coding, or designing. Do it for at least 15 minutes each day.",
//     //   questions: [
//     //     "Which myth about creativity have you believed most? Write the truth that replaces it.",
//     //     'Choose one practical step to become more creative, such as keeping a creative journal, practicing constraints, or asking "What if?". What step did you choose and why?',
//     //     "What did you learn from the story of Bezalel about how God teaches creativity?",
//     //     "What is one thing you can do this week to start practicing creativity daily?",
//     //     'Complete this sentence: "I used to think creativity was... Now I know it is..."',
//     //   ],
//     // },
//     {
//       moduleKey: "module-3",
//       moduleNumber: 3,
//       weekNumber: 2,
//       sendOffsetDays: 7, // Monday of Week 2
//       sendDayLabel: "Monday",
//       title: "The Holy Spirit",
//       subtitle: "Your Creativity Partner",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 2: The Holy Spirit — Your Creativity Partner",
//       previewText:
//         "You don't have to create alone. Meet the Holy Spirit as your daily creative partner.",
//       openingCopy: [
//         "Hello and Welcome Back Creative!",
//         "Last Friday, we learned that creativity is not magic — it is a muscle you can grow. You discovered practical steps to become more creative, and you started practicing.",
//         "But here is the best news: you don't have to do this alone.",
//         "There is a Person — the Holy Spirit — who wants to be your creative partner. He is the one who gave Bezalel wisdom, understanding, and knowledge. He is the one who inspired the writers of the Bible. He is the one who gives you ideas, solves your problems, and opens doors you could never open on your own. He already lives in you as a child of God.",
//         "This week, you are going to know him as your daily creative companion. Let's dive in.",
//       ],
//       scriptures: [
//         {
//           text: "Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.",
//           reference: "1 John 4:4 (KJV)",
//         },
//         {
//           text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
//           reference: "John 14:26 (KJV)",
//         },
//         {
//           text: "For who hath known the mind of the Lord, that he may instruct him? But we have the mind of Christ.",
//           reference: "1 Corinthians 2:16 (KJV)",
//         },
//         {
//           text: "But ye shall receive power, after that the Holy Ghost is come upon you.",
//           reference: "Acts 1:8 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "Bezalel — Filled with the Spirit",
//           paragraphs: [
//             "Do you remember Bezalel from last week? God chose him to build the Tabernacle — a beautiful, intricate, creative project.",
//             "But here is what makes Bezalel special:",
//             "“And he hath filled him with the spirit of God, in wisdom, in understanding, and in knowledge, and in all manner of workmanship.” — Exodus 35:31 (KJV)",
//             "God didn't just give Bezalel a list of instructions. He filled him with the Holy Spirit — and that Spirit gave him wisdom, understanding, and knowledge. That means:",
//           ],
//           bullets: [
//             "Wisdom — to know what to do",
//             "Understanding — to know why it matters",
//             "Knowledge — to know how to do it",
//           ],
//           closing:
//             "Bezalel didn't have a degree in architecture or design. He had the Holy Spirit. And that was enough. The Holy Spirit is your creative partner. He is not just for prayer meetings, Sunday services, or “spiritual” moments. He is for your weekly work sessions. He is for your design projects. He is for your business ideas. He is for your writing, your music, your content, your videos, your problem-solving and more.",
//         },
//         {
//           heading: "Fellowship Through God's Word (The Bible)",
//           paragraphs: [
//             "The Bible contains God's word. It is God's living voice to you. As you consistently read, study and meditate on God's word, you hear God speak to you. The Holy Spirit uses the Word to:",
//           ],
//           bullets: [
//             "Renew your mind — Romans 12:2 – “Be ye transformed by the renewing of your mind.”",
//             "Reveal God's nature — As you read, you learn who God is and how He works.",
//             "Guide your steps — Psalm 119:105 – “Thy word is a lamp unto my feet, and a light unto my path.”",
//             "Inspire creativity — The stories, principles, and promises in the Scriptures are raw material for creative ideas.",
//           ],
//         },
//         {
//           heading: "Fellowship Through Prayer",
//           paragraphs: [
//             "Prayer is a two-way conversation. When you pray, you talk to God. And when you listen, He speaks to you. Through prayer, especially praying in the Spirit, the Holy Spirit:",
//           ],
//           bullets: [
//             "Aligns your heart with God's will",
//             "Reveals hidden things – ideas, solutions, and strategies",
//             "Strengthens your spirit – you become more sensitive to His leading",
//             "Breaks creative blocks – many breakthroughs come while praying",
//           ],
//           closing:
//             "When you spend time with God's Word and pray consistently, you are cultivating intimacy with the Holy Spirit. And from that intimacy, creativity flows naturally. You begin to think God's thoughts, see problems from His perspective, and receive solutions that you could never come up with on your own. “If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you.” — John 15:7 (KJV). Abiding means staying connected — through reading, praying, listening, and obeying. When you abide, creativity flows.",
//         },
//         {
//           heading: "Lies the World Tells You About the Holy Spirit",
//           table: {
//             headers: ["Lie", "Truth"],
//             rows: [
//               [
//                 "“The Holy Spirit is just for pastors and missionaries.”",
//                 "He lives in every believer, and He wants to work through your daily life.",
//               ],
//               [
//                 "“The Holy Spirit only speaks about spiritual things.”",
//                 "He cares about your work, your skills, your projects — because they are His too.",
//               ],
//               [
//                 "“I don't need the Holy Spirit for creative work.”",
//                 "Without Him, you rely on your own strength. With Him, you tap into divine wisdom.",
//               ],
//               [
//                 "“I can't hear Him.”",
//                 "He speaks through peace, impressions, Scripture, and wise counsel. Practice listening.",
//               ],
//             ],
//           },
//         },
//         {
//           heading: "How the Holy Spirit Helps Your Creativity",
//           table: {
//             headers: ["What He Does", "What That Means for You"],
//             rows: [
//               [
//                 "Teaches you all things",
//                 "He teaches you how to code, design, write, or solve problems in ways you didn't know.",
//               ],
//               [
//                 "Brings things to your remembrance",
//                 "He reminds you of that tutorial, that verse, that idea you had before.",
//               ],
//               [
//                 "Guides you into truth",
//                 "He shows you what is true — including the truth that you are creative, capable, and called.",
//               ],
//               [
//                 "Gives you power",
//                 "You are not working in your own strength. You have supernatural enablement.",
//               ],
//               [
//                 "Gives you the mind of Christ",
//                 "You can see problems from God's perspective — and find solutions you wouldn't see alone.",
//               ],
//             ],
//           },
//         },
//       ],
//       reflection:
//         "The Holy Spirit is your creative partner. He is not just for prayer meetings — He is for your weekly work sessions, design projects, business ideas, writing, music, content, videos, and problem-solving. When you abide in Him, creativity flows.",
//       focus:
//         "Knowing the Holy Spirit as your daily creative companion and learning to partner with Him in your work.",
//       thisWeeksActions: {
//         intro: "Pick at least 4 of the 6 actions below to complete this week.",
//         items: [
//           "Before you start any creative task this week, pause and pray: “Holy Spirit, help me.” Do this at least 5 times this week.",
//           "Read John 14–16 meditatively. Notice what Jesus says about the Holy Spirit. Write down one promise that stands out to you.",
//           "Ask the Holy Spirit for one idea this week. Write down what comes to mind — even if it seems small.",
//           "Journal about your work — ask yourself: “Am I relying on my own strength, or am I inviting the Holy Spirit into my work?”",
//           "Ask a friend: “When have you experienced the Holy Spirit's help in your creative work?” Write their answer.",
//           "For one day, pray before every task — even small ones. Notice if you feel calmer, clearer, or more confident.",
//         ],
//       },
//       action:
//         "Pick at least 4 of the 6 Creative Growth Actions this week. Practice inviting the Holy Spirit before your creative tasks.",
//       questions: [
//         "How have you typically related to the Holy Spirit in your creative work so far?",
//         "Which truth about the Holy Spirit stands out to you the most this week?",
//         "What is one practical way you will invite the Holy Spirit into your work this week?",
//         "Have you ever experienced a creative breakthrough after praying? What happened?",
//         'Complete this sentence: "The Holy Spirit is my creative partner. This week I will..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Holy Spirit, welcome into my work. I confess that I have often tried to do things in my own strength. I sometimes forget that You are always with me — not just in church, but in my daily tasks. Today, I invite You into my creativity. Teach me. Guide me. Give me ideas I could never have on my own. I trust You to help me build what will last for eternity. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for Today",
//         text: "The Holy Spirit is a Person — and He is with you right now. He doesn't just want to help you pray. He wants to help you create. He wants to help you solve problems. He wants to give you ideas that will impact lives for Jesus Christ. So this week, don't work alone. Don't struggle with your own strength. Don't settle for what you can do on your own. Partner with the Holy Spirit.",
//       },
//       closing: {
//         title: "See You on Friday",
//         text: "That's it for today. Take your time with the assignments. Practice inviting the Holy Spirit before every task — even the small ones. Next week, we will explore praying in tongues and fellowshipping with God as fuel for divine creativity — how this spiritual exercise can release ideas, break stagnation, and build your creative capacity. Until then, keep creating — but don't create alone. I'll be right here waiting for you.",
//         signature: "— Your Ahren Mentor",
//       },
//     },
//     // {
//     //   moduleKey: "module-3",
//     //   moduleNumber: 3,
//     //   weekNumber: 2,
//     //   sendOffsetDays: 7,
//     //   sendDayLabel: "Monday",
//     //   title: "The Holy Spirit",
//     //   subtitle: "Your Creativity Partner",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 2: The Holy Spirit - Your Creativity Partner",
//     //   previewText:
//     //     "You do not have to create alone. The Holy Spirit is your creative partner.",
//     //   openingCopy: [
//     //     "Welcome to Week 2!",
//     //     "Last week, we discovered that you were created to create - that creativity is your nature because you are made in the image of the Creator. This week, we go deeper into the source of all creativity: the Holy Spirit.",
//     //     "You don't have to figure it out alone. The Holy Spirit is not just for prayer meetings or Sunday services. He is your idea generator, problem solver, and creative coach. Before you open your laptop, open your heart to Him.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
//     //       reference: "John 14:26 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "The Holy Spirit is with you - not just in church, but in your daily work. He teaches you, guides you, and gives you ideas you could never have on your own. Partnering with Him is the key to unlocking divine creativity. As you fellowship with God through His Word and prayer, you cultivate intimacy with the Holy Spirit, and from that intimacy, creativity flows naturally.",
//     //   focus:
//     //     "Learning to invite the Holy Spirit into your creative work and daily tasks.",
//     //   action:
//     //     'Before you start any creative task this week, pause and pray: "Holy Spirit, help me." Notice what changes - even in small ways.',
//     //   questions: [
//     //     "Before this week, what did you think about the Holy Spirit in relation to creativity? Has that changed?",
//     //     'What did you experience when you started taking a moment to pray "Holy Spirit, help me" before working?',
//     //     "How does the Holy Spirit teach, guide, and give you ideas for your creative work?",
//     //     "What is one promise from John 14-16 that encouraged you most about the Holy Spirit?",
//     //     'Complete this sentence: "Holy Spirit, I need You in my coding, design, writing, or creativity because..."',
//     //   ],
//     // },
//     {
//       moduleKey: "module-4",
//       moduleNumber: 4,
//       weekNumber: 2,
//       sendOffsetDays: 11, // Friday of Week 2
//       sendDayLabel: "Friday",
//       title: "Praying in Tongues & Fellowshipping With God",
//       subtitle: "Fuel for Divine Creativity",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 2: Praying in Tongues & Fellowshipping With God",
//       previewText:
//         "Discover how praying in tongues and fellowshipping with God becomes fuel for divine creativity.",
//       openingCopy: [
//         "Hello and Welcome Back Creative!",
//         "On Monday, we discovered that the Holy Spirit is your creative partner — and that you don't have to create alone.",
//         "But here is the question many young believers ask: “How do I actually partner with the Holy Spirit in my daily life and creative work?” One powerful answer is found in a gift that God has given to every believer who asks: praying in tongues.",
//         "This week, we are going to explore how praying in tongues and fellowshipping with God can become fuel for your creativity — breaking mental blocks, releasing divine ideas, and building your capacity to create. Let's dive in.",
//       ],
//       scriptures: [
//         {
//           text: "He that speaketh in an unknown tongue edifieth himself.",
//           reference: "1 Corinthians 14:4 (KJV)",
//         },
//         {
//           text: "But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost.",
//           reference: "Jude 1:20 (KJV)",
//         },
//         {
//           text: "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.",
//           reference: "Romans 8:26 (KJV)",
//         },
//         {
//           text: "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me.",
//           reference: "John 15:4 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "The Early Church — Praying in the Spirit",
//           paragraphs: [
//             "Turn with me to the book of Acts.",
//             "The disciples were hiding in an upper room — afraid, confused, and unsure of their next step. But then the Holy Spirit came upon them, and they began to speak in other tongues (Acts 2:4). That was just the beginning.",
//             "From that moment on, we see the disciples:",
//           ],
//           bullets: [
//             "Preaching with boldness",
//             "Healing the sick",
//             "Writing epistles that would become Scripture",
//             "Planting churches across the known world",
//             "Building communities that turned the world upside down",
//           ],
//           closing:
//             "How did they do it? They were ordinary men and women — fishermen, tax collectors, tentmakers. But they were filled with the Spirit and praying in the Spirit. Paul says that praying in tongues edifies (builds up) the believer. It builds up your spirit. When your spirit is built up, your creative capacity grows. Think of it this way: your spirit is the engine of your creativity. When your spirit is weak, your creativity stalls. When your spirit is strengthened, your creativity flows. Praying in tongues is fuel for divine creativity.",
//         },
//         {
//           heading: "When you pray in tongues",
//           bullets: [
//             "Your spirit is strengthened",
//             "Your mind is cleared",
//             "Your creativity is unlocked",
//             "Your soul is refreshed",
//             "Your faith is built up",
//           ],
//           closing:
//             "Many believers testify that after praying in tongues for 15–20 minutes, fresh ideas come. Solutions appear. Blocks break. Creativity flows. That is because you are not just speaking words — you are allowing the Holy Spirit to pray through you, bypassing your intellectual limitations and speaking God's perfect will.",
//         },
//         {
//           heading: "How Praying in Tongues Fuels Creativity",
//           table: {
//             headers: ["How It Helps", "Explanation"],
//             rows: [
//               [
//                 "Edifies your spirit",
//                 "Your human spirit is strengthened, making you more sensitive to divine ideas.",
//               ],
//               [
//                 "Bypasses mental blocks",
//                 "When you don't know how to solve a problem, the Spirit prays through you, releasing breakthrough.",
//               ],
//               [
//                 "Releases divine wisdom",
//                 "1 Corinthians 2:10 — the Spirit searches all things, even the deep things of God.",
//               ],
//               [
//                 "Breaks creative stagnation",
//                 "Many testify that fresh ideas and solutions come while or after praying in tongues.",
//               ],
//               [
//                 "Increases your capacity",
//                 "You become a larger vessel — able to carry more of God's creativity and purpose.",
//               ],
//               [
//                 "Quietens the noise",
//                 "Praying in tongues often stills anxiety, fear, and overthinking, allowing you to hear God's voice clearly.",
//               ],
//             ],
//           },
//         },
//         {
//           heading: "Practical Ways to Fellowship with God Regularly",
//           table: {
//             headers: ["Activity", "Frequency", "Creative Benefit"],
//             rows: [
//               [
//                 "Praying in tongues",
//                 "Daily (start with 15–30 minutes)",
//                 "Builds spiritual sensitivity and releases ideas",
//               ],
//               [
//                 "Worship (singing or listening)",
//                 "Daily",
//                 "Opens your heart to receive from God",
//               ],
//               [
//                 "Scripture meditation",
//                 "Daily",
//                 "God's words become raw materials for creative solutions (Joshua 1:8)",
//               ],
//               [
//                 "Quiet listening",
//                 "After prayer — sit in silence",
//                 "Learn to recognise His “still small voice” (1 Kings 19:12)",
//               ],
//               [
//                 "Journaling what you hear",
//                 "Every time",
//                 "Capture divine ideas before you forget",
//               ],
//               [
//                 "Fellowship with other believers",
//                 "Weekly",
//                 "Encouragement, accountability, and fresh perspectives",
//               ],
//             ],
//           },
//         },
//         {
//           heading: "Lies the World Tells You About Praying in Tongues",
//           table: {
//             headers: ["Lie", "Truth"],
//             rows: [
//               [
//                 "“Speaking in tongues is not for today.”",
//                 "It is a gift for every believer (Acts 2:39).",
//               ],
//               [
//                 "“It's just emotional noise.”",
//                 "It is a Spirit-given language that builds your spirit and releases divine creativity.",
//               ],
//               [
//                 "“Only pastors or missionaries should pray in tongues.”",
//                 "Every believer can and should — it builds you up (1 Corinthians 14:4).",
//               ],
//               [
//                 "“It's not practical for daily life.”",
//                 "It is one of the most practical tools you have for clarity, peace, and creative breakthrough.",
//               ],
//             ],
//           },
//         },
//       ],
//       reflection:
//         "Praying in tongues is fuel for divine creativity. It builds up your spirit, clears your mind, unlocks creativity, and releases divine wisdom. Your spirit is the engine of your creativity — when it is strengthened, creativity flows.",
//       focus:
//         "Learning to use praying in tongues and consistent fellowship with God as practical fuel for creativity and breakthrough.",
//       thisWeeksActions: {
//         intro: "Pick at least 4 of the 6 actions below to complete this week.",
//         items: [
//           "Set aside 15–30 minutes each day to pray in tongues. Do this for at least 5 days this week.",
//           "After praying, sit in silence for 2–3 minutes. Write down any thought, impression, or idea that comes — even if it seems random or small.",
//           "Read Romans 8:26–27 and 1 Corinthians 14:1–5 slowly. Notice how Paul connects praying in the Spirit with edification (building up).",
//           "Ask a mature believer you respect: “How has praying in tongues helped your creativity or work?” Write down their answer.",
//           "Before any creative task this week, pray in tongues for 5 minutes first. Notice if anything feels different — clearer, calmer, or more focused.",
//           "Journal for one day: “What did I experience when I prayed in tongues today?”",
//         ],
//       },
//       action:
//         "Pick at least 4 of the 6 Creative Growth Actions this week. Practice praying in tongues daily and notice the difference in your creativity.",
//       questions: [
//         "What has been your experience (or hesitation) with praying in tongues so far?",
//         "Which benefit of praying in tongues stands out to you the most?",
//         "How can you practically build a daily rhythm of fellowship with God this week?",
//         "What creative blocks are you currently facing that you want the Holy Spirit to help with?",
//         'Complete this sentence: "Praying in tongues is fuel for my creativity. This week I will..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Holy Spirit, I want to know You more. I want to partner with You — not just in my spiritual life, but in my daily work. Teach me to pray in tongues more consistently. Let that prayer become the furnace where creative ideas are forged. I want to partner with You so that my creativity flows from Your heart, not just my mind. Build my spirit. Open my ears. Release Your ideas through me. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for This Week",
//         text: "Praying in tongues is not mysterious or strange — it is practical. It builds you up. It clears your mind. It releases divine wisdom. You don't have to understand every word you pray — because it is not about your understanding. It is about your spirit connecting with God's Spirit. And from that connection, creativity flows. So this week, don't just work hard. Pray hard. And see what God does through your hands.",
//       },
//       closing: {
//         title: "See You Next Week",
//         text: "That's it for Week 2. Take your time with the assignments. The goal is not performance — it is connection with God. Next week, we will explore developing godly character — why your talent opens doors, but your character keeps them open. Until then, keep praying in the Spirit — and keep creating. I'll be right here waiting for you.",
//         signature: "— Your Ahren Mentor",
//       },
//     },

//     // {
//     //   moduleKey: "module-4",
//     //   moduleNumber: 4,
//     //   weekNumber: 2,
//     //   sendOffsetDays: 11,
//     //   sendDayLabel: "Friday",
//     //   title: "Praying in Tongues and Fellowshipping with God",
//     //   subtitle: "Fuel for Divine Creativity",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 2: Praying in Tongues and Fellowshipping with God",
//     //   previewText:
//     //     "Build a consistent prayer and fellowship life that fuels creativity.",
//     //   openingCopy: [
//     //     "Welcome to the second module of Week 2!",
//     //     "Last time, we learned that the Holy Spirit is your creative partner. But how do you actually partner with Him in a practical, daily way? This module answers that question.",
//     //     "Praying in tongues is not just a spiritual exercise - it is a direct line to divine creativity. When you pray in the Spirit, your spirit is built up, and the Holy Spirit bypasses your intellectual limitations to pray God's perfect will.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "He that speaketh in an unknown tongue edifieth himself.",
//     //       reference: "1 Corinthians 14:4 (KJV)",
//     //     },
//     //     {
//     //       text: "But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost.",
//     //       reference: "Jude 1:20 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "Praying in tongues edifies your spirit and releases divine creativity. Regular fellowship with God - prayer, His Word, and worship - keeps your creative well full. Many breakthrough ideas come while praying in the Spirit.",
//     //   focus:
//     //     "Building a consistent prayer and fellowship life to fuel your creativity.",
//     //   action:
//     //     "Set aside 15-30 minutes each day to pray in tongues. After praying, sit in silence for 2-3 minutes and write down any thoughts or impressions that come.",
//     //   questions: [
//     //     "What did you experience when you prayed in tongues this week - even if nothing dramatic happened?",
//     //     "Did any new idea, solution, or clarity come to you during or after praying in tongues?",
//     //     "How does praying in tongues build up your spirit and release divine creativity?",
//     //     "What practical steps can you take to fellowship with God more consistently through His Word and prayer?",
//     //     'Complete this sentence: "Praying in tongues is fuel for my creativity because..."',
//     //   ],
//     // },

//     {
//       moduleKey: "module-5",
//       moduleNumber: 5,
//       weekNumber: 3,
//       sendOffsetDays: 14, // Monday of Week 3
//       sendDayLabel: "Monday",
//       title: "Developing Your Faith in God & Your Character as a Person",
//       subtitle: "The Foundation",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 3: Developing Your Faith & Character",
//       previewText:
//         "Your talent opens doors. Your faith and character keep them open. Build the foundation every creator needs.",
//       openingCopy: [
//         "Hello and Welcome Back Creative!",
//         "Over the last two weeks, we've discovered something powerful:",
//       ],
//       scriptures: [
//         {
//           text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
//           reference: "Hebrews 11:1 (KJV)",
//         },
//         {
//           text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
//           reference: "Hebrews 11:6 (KJV)",
//         },
//         {
//           text: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
//           reference: "Proverbs 22:1 (KJV)",
//         },
//         {
//           text: "He that is faithful in that which is least is faithful also in much: and he that is unjust in the least is unjust also in much.",
//           reference: "Luke 16:10 (KJV)",
//         },
//         {
//           text: "And beside this, giving all diligence, add to your faith virtue; and to virtue knowledge.",
//           reference: "2 Peter 1:5 (KJV)",
//         },
//         {
//           text: "Let no man despise thy youth, but be thou an example of the believers, in word, in manner of living, in charity, in spirit, in faith, in purity.",
//           reference: "1 Timothy 4:12 (KJV)",
//         },
//         {
//           text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.",
//           reference: "Galatians 5:22–23 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "",
//           bullets: [
//             "You are a creator, made in God's image.",
//             "Creativity is a muscle you can grow.",
//             "The Holy Spirit is your creative partner.",
//             "Praying in tongues fuels divine creativity.",
//           ],
//           closing:
//             "But here is an important question: “If I have all this — creativity, the Holy Spirit, and spiritual gifts — what could stop me from fulfilling my purpose?” The answer, sadly, is often faith and character. Your talent can open doors. But your faith and character determine whether you stay in the room — or get thrown out. This week, we are going to build the foundation that every creator needs: faith in God and godly character. Let's dive in.",
//         },
//         {
//           heading: "Samson — Great Talent",
//           paragraphs: [
//             "Let me introduce you to Samson.",
//             "Samson had everything a person could want, talent-wise. He was:",
//           ],
//           bullets: [
//             "Set apart from birth (a Nazarite)",
//             "Filled with supernatural strength",
//             "Raised by godly parents",
//             "Chosen by God to deliver Israel from the Philistines",
//           ],
//           closing:
//             "He performed incredible feats: killing a lion with his bare hands, defeating a thousand men with a donkey's jawbone, and carrying off the city gates of Gaza. But Samson had two fatal flaws: he lacked consistent discipline and he could not control himself. He didn't trust God to guide his decisions. He relied on his own strength. He gave in to his desires. He broke his vows. He compromised with the enemy. He ended up betrayed, blinded, and broken — all because his faith and character did not keep up with his talent. His story is a warning: talent without faith and character leads to destruction. What you build with your gift can be torn down by your flaws. Your talent will open doors. Your faith and character will keep them open.",
//         },
//         {
//           heading: "Faith in God",
//           bullets: [
//             "Believing Him — trusting that He is who He says He is",
//             "Trusting His promises — holding onto His Word even when you don't see the outcome",
//             "Depending on Him — not relying only on your own strength",
//             "Walking with Him — daily relationship, not just Sunday religion",
//             "Obedience — doing what He says, even when it doesn't make sense",
//           ],
//         },
//         {
//           heading: "Character as a Person",
//           bullets: [
//             "Integrity — doing the right thing even when no one is watching",
//             "Reliability — keeping your word and showing up on time",
//             "Honesty — telling the truth even when it costs you",
//             "Humility — not thinking you are better than others",
//             "Self-control — managing your appetites, emotions, and tongue",
//             "Faithfulness — staying committed even when it is hard",
//           ],
//           closing:
//             "Faith in God is your foundation. Character is what you build on it. Without faith, you have no anchor. Without character, you have no credibility.",
//         },
//         {
//           heading: "Lies the World Tells You About Faith & Character",
//           table: {
//             headers: ["Lie", "Truth"],
//             rows: [
//               [
//                 "“Faith is just for Sunday.”",
//                 "Faith is for every day — for your work, your relationships, and your creativity.",
//               ],
//               [
//                 "“I can do it on my own.”",
//                 "Without faith in God, you will eventually burn out or fall.",
//               ],
//               [
//                 "“No one will find out.”",
//                 "God sees everything. And even if no one else finds out, you will know — and it will shape you.",
//               ],
//               [
//                 "“Just this once won't hurt.”",
//                 "One compromise leads to another. Small choices shape your character.",
//               ],
//               [
//                 "“I can be successful without faith and character.”",
//                 "You can gain the world, but you will lose yourself.",
//               ],
//               [
//                 "“Faith and character are for old people.”",
//                 "They are built in your youth. Every choice matters.",
//               ],
//             ],
//           },
//         },
//         {
//           heading:
//             "Why Your Faith in God & Your Character Matters for Your Creativity",
//           table: {
//             headers: ["Area", "Why It Matters"],
//             rows: [
//               [
//                 "Your reputation",
//                 "People won't trust your work if they can't trust your word or your walk with God.",
//               ],
//               [
//                 "Your relationships",
//                 "Creativity thrives in safe, honest relationships. Faith and character build trust.",
//               ],
//               [
//                 "Your spiritual sensitivity",
//                 "Sin and unbelief dull your hearing. Faith and character keep your heart tender to the Holy Spirit.",
//               ],
//               [
//                 "Your longevity",
//                 "Talent fades. Faith in God and Godly character last. They carry you through dry seasons.",
//               ],
//               [
//                 "Your witness",
//                 "Your faith-walk and Godly character reveals Jesus Christ more than your talent or skills ever will.",
//               ],
//               [
//                 "Your creativity flow",
//                 "When you trust God, you are less anxious — and creativity flows better.",
//               ],
//             ],
//           },
//         },
//       ],
//       reflection:
//         "Your talent will open doors. Your faith and character will keep them open. Faith in God is your foundation. Character is what you build on it. Without faith, you have no anchor. Without character, you have no credibility.",
//       focus:
//         "Building the foundation of faith in God and godly character so that your creativity can last and bring lasting impact.",
//       thisWeeksActions: {
//         intro: "Pick at least 5 of the 7 actions below to complete this week.",
//         items: [
//           "Read Judges 13–16 and Hebrews 11 slowly. Notice how Samson's choices led to his downfall — and how faith sustained others.",
//           "Read Hebrews 11:1–6 every morning this week. Let it sink in: “Without faith it is impossible to please Him.”",
//           "Identify one area where you struggle with faith (e.g., trusting God with your future, believing He cares about your work, relying on your own strength). Write down one step you will take to grow.",
//           "Identify one area where you struggle with character (e.g., honesty, punctuality, self-control, keeping promises). Write down one step you will take to grow.",
//           "Keep one promise this week — even if it costs you something. At the end of the week, write down how it felt.",
//           "Ask a trusted friend: “What is one area of faith or character I need to work on?” Write down their answer without getting defensive.",
//           "Journal: “What small compromises am I making that could lead to big problems?”",
//         ],
//       },
//       action:
//         "Pick at least 5 of the 7 Creative Growth Actions this week. Focus on growing in one area of faith and one area of character.",
//       questions: [
//         "Where has talent opened doors for you, but character (or lack of it) affected the outcome?",
//         "What area of faith do you most need to grow in right now?",
//         "What area of character do you most need to grow in right now?",
//         "What small compromise are you currently making that could lead to bigger problems later?",
//         'Complete this sentence: "My talent opens doors. My faith and character will keep them open. This week I will..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Lord Jesus Christ, I confess that I have sometimes valued my talent and skills more than my faith and character. I sometimes focus on what I can build, not on who I am becoming. Please forgive me Lord. Help me to trust You more — even when I don't understand. Help me to always be honest, reliable, and humble — even when no one is watching. I want to be a person of strong faith in you and integrity. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for Today",
//         text: "Samson had strength, but no self-control. He had a calling, but no discipline. Do not be like Samson. Your creativity is a gift. But without faith in God and Godly character, it will eventually fail you. Build them now — while you are young, while it is easier, and while you still have time. Faith in God anchors you. Godly Character keeps you. And together, they carry you into your purpose.",
//       },
//       closing: {
//         title: "See You on Friday",
//         text: "That's it for today. Take your time with the assignments. The goal is not perfection — it is growth. Next week, we will explore building a creativity lifestyle through daily habits — how small, consistent actions create a life of creative impact. Until then, build your faith. Build your character. They matter more than you know. I'll be right here waiting for you.",
//         signature: "— Your Ahren Mentor",
//       },
//     },

//     // {
//     //   moduleKey: "module-5",
//     //   moduleNumber: 5,
//     //   weekNumber: 3,
//     //   sendOffsetDays: 14,
//     //   sendDayLabel: "Monday",
//     //   title: "Developing Your Faith in God and Your Character",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 3: Developing Your Faith in God and Your Character",
//     //   previewText:
//     //     "Talent can open doors, but faith and character keep them open.",
//     //   openingCopy: [
//     //     "Welcome to Week 3!",
//     //     "Over the past two weeks, we have discovered your creative identity and learned to partner with the Holy Spirit. This week, we turn to a foundational truth: your talent will open doors, but your faith and character will keep them open.",
//     //     "Your creativity is a gift. But without faith and character, it will eventually fail you. Faith anchors you. Character keeps you. And together, they carry you into your purpose.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
//     //       reference: "Hebrews 11:6 (KJV)",
//     //     },
//     //     {
//     //       text: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
//     //       reference: "Proverbs 22:1 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "Samson had incredible talent - but his character could not keep up with his gift. He ended up broken and alone. Your talent will open doors, but your faith and character will keep them open. Build them now - while you are young, while it is easier, and while you still have time.",
//     //   focus: "Building faith and character that outlast your talent.",
//     //   action:
//     //     "Identify one area where you struggle with faith or character. Write down one small step you will take this week to grow in that area.",
//     //   questions: [
//     //     "What is one area where you struggle with faith - even in small ways?",
//     //     "What is one area where you struggle with character - even in small ways?",
//     //     "How does Samson's story challenge you about the importance of character?",
//     //     "What is one specific action you will take this week to grow in faith or character?",
//     //     'Complete this sentence: "Faith and character are the foundation of my creativity because..."',
//     //   ],
//     // },

//     {
//       moduleKey: "module-6",
//       moduleNumber: 6,
//       weekNumber: 3,
//       sendOffsetDays: 18, // Friday of Week 3
//       sendDayLabel: "Friday",
//       title: "Building a Creativity Lifestyle",
//       subtitle: "Daily Habits & Personal Development",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 3: Building a Creativity Lifestyle",
//       previewText:
//         "Creativity is not a one-time event. It is a lifestyle. Build it through daily habits and intentional personal development.",
//       openingCopy: [
//         "Hello and Welcome Back Creative!",
//         "Over the last few weeks, we have laid a strong foundation:",
//       ],
//       scriptures: [
//         {
//           text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
//           reference: "Colossians 3:23 (KJV)",
//         },
//         {
//           text: "The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want.",
//           reference: "Proverbs 21:5 (KJV)",
//         },
//         {
//           text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
//           reference: "Galatians 6:9 (KJV)",
//         },
//         {
//           text: "I will bless the LORD at all times: his praise shall continually be in my mouth.",
//           reference: "Psalm 34:1 (KJV)",
//         },
//         {
//           text: "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ.",
//           reference: "2 Peter 3:18 (KJV)",
//         },
//         {
//           text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.",
//           reference: "Proverbs 27:17 (KJV)",
//         },
//       ],
//       bodySections: [
//         {
//           heading: "",
//           bullets: [
//             "You were created to create.",
//             "Creativity is a skill you can grow.",
//             "The Holy Spirit is your creative partner.",
//             "Praying in tongues fuels divine creativity.",
//             "Faith in God and godly character are your foundation.",
//           ],
//           closing:
//             "Now comes the question: “How do I actually live this out — day by day?” This week, we are going to talk about building a creativity lifestyle through daily habits and personal development. Not a one-time event. Not a project you start and abandon. A lifestyle — a way of living that makes creativity a natural part of who you are, while continuously growing as a person. Let's dive in.",
//         },
//         {
//           heading: "Daniel — A Daily Man Who Grew Continually",
//           paragraphs: [
//             "Let me introduce you to Daniel.",
//             "Daniel was a young man living in a foreign land — far from home, surrounded by people who did not believe in his God. He could have given up. He could have compromised. He could have stayed the same person he was when he arrived.",
//             "But Daniel had a daily lifestyle — and a commitment to personal growth.",
//             "Three times a day, he knelt and prayed — even when it was illegal (Daniel 6:10). He didn't pray only when he felt like it. He didn't pray only when he was in trouble. He prayed daily.",
//             "But Daniel also grew. He learned the language and literature of Babylon (Daniel 1:4). He developed wisdom and understanding that exceeded his peers. He stayed humble, sought God, and kept growing — even after he became a ruler in the kingdom.",
//             "And here is the result: God gave him wisdom, favour, and influence in a kingdom that tried to kill him. Daniel's daily habits and commitment to personal growth carried him through decades of service, from a young exile to an old statesman.",
//             "The same is true for you. Your creativity is not built in one big moment. It is built in the daily moments. And your person is not shaped by one grand decision — it is shaped by the daily choices you make to grow.",
//             "Creativity is not a one-time event. It is a lifestyle. And personal development is the fuel that keeps it growing.",
//             "Think about it:",
//           ],
//           bullets: [
//             "A musician doesn't become a musician by performing once. They practice consistently and continually learn new techniques.",
//             "A fullstack developer doesn't become a developer by building one project. They write code consistently and continually learn new languages or techniques.",
//             "A writer doesn't become an author by writing one chapter. They write consistently and continually study to improve their craft.",
//             "A designer doesn't become a designer by creating one logo. They design consistently and continually expand their knowledge to improve in their skills.",
//           ],
//           closing:
//             "Your creativity grows through daily habits. And your person grows through intentional personal development — reading, learning, seeking feedback, and becoming more like Jesus Christ. The secret is not trying harder. The secret is showing up consistently and choosing to grow up spiritually and in every aspect of your life — even when you don't feel spiritual or creative, even when you're tired, even when it feels pointless.",
//         },
//         {
//           heading:
//             "Lies the World Tells You About Habits & Personal Development",
//           table: {
//             headers: ["Lie", "Truth"],
//             rows: [
//               [
//                 "“I need to feel inspired to create.”",
//                 "Inspiration is a by-product of action. Show up, and inspiration often follows.",
//               ],
//               [
//                 "“One day I'll have time to grow.”",
//                 "Time is never found — it is made. You have to protect it.",
//               ],
//               [
//                 "“It doesn't matter if I skip one day.”",
//                 "One day becomes two. Two becomes a week. Consistency is everything.",
//               ],
//               [
//                 "“I'm not disciplined enough.”",
//                 "Discipline is a muscle. You grow it by using it — starting small.",
//               ],
//               [
//                 "“My work has to be perfect.”",
//                 "Perfect is the enemy of done. Done is better than perfect.",
//               ],
//               [
//                 "“I don't need to learn new things.”",
//                 "Growth is the sign of life. Without growth, you stagnate.",
//               ],
//               [
//                 "“Personal development is just for some other professionals.”",
//                 "It is for every believer — you are called to grow in every area of life.",
//               ],
//             ],
//           },
//         },
//         {
//           heading:
//             "Simple Daily Habits That Build Your Creativity & Personal Development",
//           paragraphs: [
//             "Here are 9 daily habits that can transform your creative life and your person. Pick at least 4 to practice this week.",
//           ],
//           table: {
//             headers: ["Habit", "Why It Works"],
//             rows: [
//               [
//                 "Pray first",
//                 "Before you create, invite the Holy Spirit into your work. This sets the tone for your whole day.",
//               ],
//               [
//                 "Create for 15 minutes",
//                 "Even 15 minutes a day adds up. Write a paragraph, sketch a design, write a line of code, plan your project.",
//               ],
//               [
//                 "Consume something new",
//                 "Read an article, watch a tutorial, listen to a podcast. Feed your mind with new ideas.",
//               ],
//               [
//                 "Journal one idea",
//                 "Write down one idea every day if possible — even if it seems silly. This trains your brain to generate ideas.",
//               ],
//               [
//                 "Read a book chapter weekly",
//                 "Read something that helps you grow — in faith, skill, or character.",
//               ],
//               [
//                 "Review your progress",
//                 "Look back at your week. What worked? What didn't? Adjust and keep going.",
//               ],
//               [
//                 "Rest intentionally",
//                 "Creativity requires rest. Take a Sabbath — a real break — every week.",
//               ],
//               [
//                 "Pray in tongues",
//                 "Spend 15–30 minutes daily praying in the Spirit. This builds your spirit and releases creative breakthroughs.",
//               ],
//               [
//                 "Ask for feedback",
//                 "Ask someone you trust: “What could I improve?” Feedback is the shortcut to growth.",
//               ],
//             ],
//           },
//         },
//         {
//           heading: "How Personal Development Fuels Your Creativity",
//           table: {
//             headers: ["Area of Growth", "How It Helps Your Creativity"],
//             rows: [
//               [
//                 "Spiritual growth",
//                 "You hear God more clearly — and He is the source of all good divine ideas.",
//               ],
//               [
//                 "Skill growth",
//                 "You can build better, bolder, faster, and more creatively.",
//               ],
//               [
//                 "Character growth",
//                 "Your reputation opens doors — and keeps them open.",
//               ],
//               [
//                 "Relational growth",
//                 "You learn from others, and others learn from you.",
//               ],
//               [
//                 "Emotional growth",
//                 "You handle failure, criticism, and setbacks with grace.",
//               ],
//               [
//                 "Physical growth",
//                 "You have energy, focus, and stamina to keep creating.",
//               ],
//             ],
//           },
//         },
//       ],
//       reflection:
//         "Creativity is not a one-time event. It is a lifestyle. Personal development is the fuel that keeps it growing. The secret is not trying harder — it is showing up consistently and choosing to grow, even when you don't feel like it.",
//       focus:
//         "Building a sustainable creativity lifestyle through consistent daily habits and intentional personal development.",
//       thisWeeksActions: {
//         intro: "Pick at least 5 of the 8 actions below to complete this week.",
//         items: [
//           "Choose one daily creative habit (like writing, sketching, coding, designing or any other creative habit of your choice) — and practice it every day for at least 15 minutes.",
//           "Set a specific time for your daily creative habit — e.g., 8 AM, right after breakfast, or before bed. Write it down.",
//           "Track your habit — put a “✔” in your calendar every day you practice. This helps you see your consistency.",
//           "Read one chapter of a book that helps you grow — in faith, skill, or character. Write down one thing you learned.",
//           "Ask someone for feedback on something you created. Write down what they said — even if it's hard to hear.",
//           "Pray in tongues for at least 10 minutes every day this week. Notice if anything feels different — calmer, clearer, or more focused.",
//           "Rest intentionally for one full day this weekend. No work. No screen time if possible. Let your mind rest.",
//           "Journal: “What is one area of my life I need to grow in — and what can I do about it this week?”",
//         ],
//       },
//       action:
//         "Pick at least 5 of the 8 Creative Growth Actions this week. Choose one daily creative habit and practice it consistently for at least 15 minutes a day.",
//       questions: [
//         "What daily creative habit will you commit to this week?",
//         "What time of day will you protect for that habit?",
//         "Which area of personal development (spiritual, skill, character, relational, emotional, or physical) do you most need to grow in right now?",
//         "What usually stops you from being consistent — and how will you overcome it this week?",
//         'Complete this sentence: "Creativity is a lifestyle. This week I will show up by..."',
//       ],
//       prayer: {
//         title: "A Prayer for Your Week",
//         text: "Lord, I want to build a creative life — not just a creative moment. Help me to show up every day, even when I don't feel motivated. Help me to see that small actions, repeated over time, create something lasting. And help me to keep growing — in my faith, my skills, my character, and my relationships. Give me the discipline to practice, the wisdom to learn, and the grace to keep going even when it feels hard. In Jesus' name, Amen.",
//       },
//       finalWord: {
//         title: "A Final Word for This Week",
//         text: "Creativity is not built in a day. It is built daily. It is built in the 15 minutes you set aside to practice. It is built in the prayer you pray before you start. It is built in the small steps you take — even when no one is watching. And personal development is not a luxury. It is a necessity. Do not despise small beginnings. Do not wait for the “perfect time.” There is no perfect time. There is only now. Show up today. Show up tomorrow. And that lifestyle will impact many lives and glorify Jesus Christ.",
//       },
//       closing: {
//         title: "See You Next Week",
//         text: "That's it for Week 3. Take your time with the assignments. The goal is not perfection — it is consistency and growth. Next week, we will explore developing your creativity personality — how your unique traits shape the way you create, and how to own your creative style. Until then, stay consistent. Keep growing. And keep creating. I'll be right here waiting for you.",
//         signature: "— Your Ahren Mentor",
//       },
//     },

//     // {
//     //   moduleKey: "module-6",
//     //   moduleNumber: 6,
//     //   weekNumber: 3,
//     //   sendOffsetDays: 18,
//     //   sendDayLabel: "Friday",
//     //   title: "Building a Creativity Lifestyle",
//     //   subtitle: "Daily Habits and Personal Development",
//     //   subject:
//     //     "Ahren Christian Creativity Masterclass - Week 3: Building a Creativity Lifestyle - Daily Habits and Personal Development",
//     //   previewText:
//     //     "Creativity is built through small consistent actions repeated over time.",
//     //   openingCopy: [
//     //     "Welcome to the second module of Week 3!",
//     //     'Now that we have established the importance of faith and character, we turn to a practical question: "How do I actually live this out - day by day?"',
//     //     "Creativity is not a one-time event. It is a lifestyle. Small, consistent actions, repeated over time, create a creative life. Personal development is not a luxury - it is the fuel that keeps your creativity growing.",
//     //   ],
//     //   scriptures: [
//     //     {
//     //       text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
//     //       reference: "Colossians 3:23 (KJV)",
//     //     },
//     //   ],
//     //   reflection:
//     //     "Daniel had an excellent spirit - not occasionally, but daily. He prayed three times a day, even when it was illegal. His daily habits carried him through decades of service. The same is true for you. Creativity is not built in one big moment. It is built in the daily moments.",
//     //   focus:
//     //     "Building daily creative habits and committing to personal development.",
//     //   action:
//     //     "Choose one small creative or tech habit to practice every day this week, minimum 15 minutes per day. Track your consistency and notice what changes.",
//     //   questions: [
//     //     "Which daily creative habit did you choose to practice this week?",
//     //     "How many days did you practice it out of 7? What helped or hindered you?",
//     //     "What did you learn about yourself through this habit?",
//     //     "How does personal development fuel your creativity?",
//     //     'Complete this sentence: "Creativity is not a one-time event. It is a..."',
//     //   ],
//     // },

//     {
//       moduleKey: "module-7",
//       moduleNumber: 7,
//       weekNumber: 4,
//       sendOffsetDays: 21,
//       sendDayLabel: "Monday",
//       title: "Developing Your Creativity Personality",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 4: Developing Your Creativity Personality",
//       previewText: "Own the unique way God designed you to create.",
//       openingCopy: [
//         "Welcome to Week 4!",
//         'You are now halfway through the program. Over the last few weeks, you have discovered your creative identity, learned to partner with the Holy Spirit, and begun building faith and character. This week, we turn to a beautiful question: "How do I create in a way that is true to who I am?"',
//         "Your creativity personality is as unique as your fingerprint. You don't have to create like anyone else. Your unique personality - curious, detailed, wild, calm, structured, spontaneous - shapes how you create. Own it.",
//       ],
//       scriptures: [
//         {
//           text: "Having then gifts differing according to the grace that is given to us.",
//           reference: "Romans 12:6 (KJV)",
//         },
//       ],
//       reflection:
//         "The body of Christ has many parts, and each part is different. Your creative personality is unique and needed. You don't have to be a copy - you are an original. Your quirks, your preferences, your unique way of seeing the world - they all matter.",
//       focus: "Discovering and owning your unique creative personality.",
//       action:
//         'Describe your creative personality in three words. Ask a friend: "What is unique about how I create?" Write down their answer.',
//       questions: [
//         'Describe your creative personality in three words, such as "messy, bold, curious" or "quiet, precise, thoughtful".',
//         "What did your friends or family say about how you create?",
//         "Have you ever felt pressured to create like someone else? How did that feel?",
//         "What is one thing you learned about yourself this week?",
//         'Complete this sentence: "God made my creative personality [your 3 words]. I will stop comparing because..."',
//       ],
//     },
//     {
//       moduleKey: "module-8",
//       moduleNumber: 8,
//       weekNumber: 4,
//       sendOffsetDays: 25,
//       sendDayLabel: "Friday",
//       title: "Leadership and Being Led by the Spirit",
//       subtitle: "Lead Yourself, Follow the Spirit",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 4: Leadership and Being Led by the Spirit",
//       previewText:
//         "Leadership begins with you, and self-leadership begins with following the Spirit.",
//       openingCopy: [
//         "Welcome to the second module of Week 4!",
//         "You have come so far. This week, we explore two deeply connected things: leadership and being led by the Spirit.",
//         'You might think, "I am not a leader. I do not have a title." But leadership begins with you. Before you can lead others, you must learn to lead yourself. And the best way to lead yourself is to let the Holy Spirit lead you.',
//       ],
//       scriptures: [
//         {
//           text: "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.",
//           reference: "1 Timothy 4:12 (KJV)",
//         },
//         {
//           text: "For as many as are led by the Spirit of God, they are the sons of God.",
//           reference: "Romans 8:14 (KJV)",
//         },
//       ],
//       reflection:
//         "Joseph led himself well before he ever led anyone else. Everywhere he went - as a slave, as a prisoner, as a ruler - he managed his time, kept his word, controlled his tongue, and took responsibility. Leadership begins with you. And you cannot lead yourself well without being led by the Spirit.",
//       focus: "Learning to lead yourself and be led by the Spirit.",
//       action:
//         'Set one small rule for yourself this week, such as "No phone for the first hour after waking." Track your consistency and notice what changes.',
//       questions: [
//         "What is one area where you struggle with self-leadership, such as phone addiction, procrastination, or poor time management?",
//         "What small rule did you set for yourself this week? Did you keep it?",
//         "What did you learn from Joseph's story about leading yourself and being led by the Spirit?",
//         "What did you hear from the Spirit this week - even if it was small?",
//         'Complete this sentence: "I am learning to lead myself because..."',
//       ],
//     },
//     {
//       moduleKey: "module-9",
//       moduleNumber: 9,
//       weekNumber: 5,
//       sendOffsetDays: 28,
//       sendDayLabel: "Monday",
//       title: "Using Modern Technology Tools for Kingdom Purposes",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 5: Using Modern Technology Tools for Kingdom Purposes",
//       previewText:
//         "Use modern technology as a tool for Kingdom impact, not as an idol.",
//       openingCopy: [
//         "Welcome to Week 5!",
//         'You have come so far. This week, we explore a practical but powerful question: "How do I use modern technology tools - AI, design, social media - without losing my soul?"',
//         "Technology is neutral. In your hands, with the Holy Spirit, it becomes a tool for Kingdom impact. You don't have to fear it. You also don't have to worship it. You can use it - as a tool - to build the Kingdom.",
//       ],
//       scriptures: [
//         {
//           text: "Wisdom is the principal thing; therefore get wisdom.",
//           reference: "Proverbs 4:7 (KJV)",
//         },
//       ],
//       reflection:
//         "The sons of Issachar understood their times and knew what to do. You live in a time of extraordinary tools. You have access to AI, design, social media, coding platforms, and more. These tools can be used to build the Kingdom - or to waste your life. The difference is you and the Spirit.",
//       focus: "Learning to use modern technology tools for Kingdom impact.",
//       action:
//         "Pick one modern tool you have never used, such as AI, design, no-code, or video. Spend 1 hour learning it. Build a tiny project.",
//       questions: [
//         "Which new tool did you pick to learn or improve this week?",
//         "What did you build, even if it was small?",
//         "How could you use this tool for Kingdom purposes - to serve someone, build something, or reveal Jesus?",
//         "What boundary did you set around technology this week - and did you keep it?",
//         'Complete this sentence: "Technology is neutral. In my hands, with the Holy Spirit, it becomes..."',
//       ],
//     },
//     {
//       moduleKey: "module-10",
//       moduleNumber: 10,
//       weekNumber: 5,
//       sendOffsetDays: 32,
//       sendDayLabel: "Friday",
//       title: "Understanding God's Purpose for Your Life",
//       subtitle:
//         "Aligning Your Skills, Creativity, and All You Are with His Plan",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 5: Understanding God's Purpose for Your Life",
//       previewText:
//         "Purpose becomes clearer as you walk with God and serve with your gifts.",
//       openingCopy: [
//         "Welcome to the second module of Week 5!",
//         'Now that we have explored tools and technology, we turn to a deeper question: "How do I know what God\'s plan for my life is? How do I align my skills, creativity, and everything I am with His purpose?"',
//         "God's purpose for your life is not a mystery you have to solve - it is a relationship you walk in. As you walk with Him faithfully and serve with your gifts, purpose becomes clearer.",
//       ],
//       scriptures: [
//         {
//           text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
//           reference: "Jeremiah 29:11 (KJV)",
//         },
//         {
//           text: "The steps of a good man are ordered by the LORD: and he delighteth in his way.",
//           reference: "Psalm 37:23 (KJV)",
//         },
//       ],
//       reflection:
//         "God's purpose for your life becomes clearer as you walk faithfully with Him, serve with your gifts, and step out in faith. He puts desires in your heart. He opens and closes doors. He gives you supernatural wisdom - just like He gave Daniel.",
//       focus:
//         "Aligning your skills, creativity, and all you are with God's purpose.",
//       action:
//         'Ask God: "What is the next step You want me to take?" Write down what comes to mind - even if it seems small.',
//       questions: [
//         "What desires has God placed in your heart recently - even small ones?",
//         "Where are you currently walking by faith, trusting God step by step?",
//         "What did you learn from Abraham's story about walking into purpose one step at a time?",
//         "What is one small step of obedience you can take this week?",
//         'Complete this sentence: "God\'s purpose for my life becomes clearer as I..."',
//       ],
//     },
//     {
//       moduleKey: "module-11",
//       moduleNumber: 11,
//       weekNumber: 6,
//       sendOffsetDays: 35,
//       sendDayLabel: "Monday",
//       title: "Real-Life Examples",
//       subtitle: "Christians Using Tech and Creativity for Global Impact",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 6: Real-Life Examples - Christians Using Tech and Creativity for Global Impact",
//       previewText:
//         "Learn from examples of Christians using creativity and tools for global impact.",
//       openingCopy: [
//         "Welcome to Week 6 - your final week!",
//         'This week, we bring everything together. You have learned who you are, how to partner with the Holy Spirit, how to build character, and how to use tools for the Kingdom. Now we ask: "What is all this creativity for?"',
//         "Your skills are not just for you. They are for the house of God - starting with your local church, and extending to other ministries and God-given projects.",
//       ],
//       scriptures: [
//         {
//           text: "The harvest truly is plenteous, but the labourers are few.",
//           reference: "Matthew 9:37 (KJV)",
//         },
//         {
//           text: "For we are his workmanship, created in Christ Jesus unto good works.",
//           reference: "Ephesians 2:10 (KJV)",
//         },
//       ],
//       reflection:
//         "The early church turned the world upside down with no technology. They had the Holy Spirit and a willingness to use whatever they had. Now imagine what you can do with the tools at your disposal - when you are filled with the same Spirit and willing to use your skills for His glory.",
//       focus:
//         "Learning from real-life examples of Christians using tech and creativity for global impact.",
//       action:
//         "Pick one example from the list in your module and research their journey. Write down two things you can apply to your own creative journey.",
//       questions: [
//         "Which example from the list inspired you most? Why?",
//         "What did they start with - and what did their journey look like?",
//         "What problem did they solve?",
//         "What is stopping you from taking your next step?",
//         'Complete this sentence: "One day, I want my creativity to impact others by..."',
//       ],
//     },
//     {
//       moduleKey: "module-12",
//       moduleNumber: 12,
//       weekNumber: 6,
//       sendOffsetDays: 39,
//       sendDayLabel: "Friday",
//       title: "Commissioned to Create",
//       subtitle:
//         "Position Yourself, Solve Problems, Build Wealth, Reveal Jesus Boldly",
//       subject:
//         "Ahren Christian Creativity Masterclass - Week 6: Commissioned to Create - Position, Solve, Build, Reveal",
//       previewText:
//         "Your final module: position yourself, solve problems, build, and reveal Jesus boldly.",
//       openingCopy: [
//         "Welcome to your final module!",
//         "You have completed the journey. But this is not the end - it is the beginning.",
//         "This final module is about commissioning. God wants you to position yourself, solve problems, build wealth, and reveal Jesus boldly without compromise. Your creativity is not meant to be hidden. It is meant to shine.",
//       ],
//       scriptures: [
//         {
//           text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
//           reference: "Matthew 5:16 (KJV)",
//         },
//         {
//           text: "A man's gift maketh room for him, and bringeth him before great men.",
//           reference: "Proverbs 18:16 (KJV)",
//         },
//       ],
//       reflection:
//         "Daniel solved problems, built wealth and influence, and revealed God boldly - without compromise. He positioned himself, served with excellence, and never hid his faith. You can do the same. Your success becomes a platform for the gospel.",
//       focus:
//         "Commissioning - positioning yourself, solving problems, building wealth, and revealing Jesus boldly.",
//       action:
//         "Write down one next step you will take to launch or advance your Kingdom project. Commit to it.",
//       questions: [
//         "Name your Kingdom Project - what you want to build for God's glory. If there is no name yet, describe it in 2-3 sentences.",
//         "What problem does it solve? Who will it help?",
//         "How can you position yourself - online, in your church, in your industry, or in your community - so that people see your creativity and the God behind it?",
//         "How will you reveal Jesus boldly through this project - without compromising your faith?",
//         "What is the very next concrete step you will take to move this project forward? Be specific.",
//       ],
//     },
//   ],
// };

export const AHREN_WORKBOOK_PROGRAM: WorkbookProgramDefinition = {
  slug: "christian-creativity-masterclass",
  name: "Ahren Christian Creativity Masterclass",
  summary:
    "A flexible Workbook journey for Christian creatives to discover identity, partner with the Holy Spirit, build character, and align their skills with God's purpose.",
  startsAfterDays: 7,
  modules: [
    {
      moduleKey: "module-1",
      moduleNumber: 1,
      weekNumber: 1,
      sendOffsetDays: 0,
      sendDayLabel: "Monday",
      title: "You Were Created to Create",
      subtitle: "Your Creative Identity",
      subject:
        "Ahren Christian Creativity Masterclass - Week 1: You Were Created to Create",
      previewText:
        "Your first Ahren module: discover your creative identity in God.",
      openingCopy: [
        "Welcome to Ahren Foundation Christian Creativity Masterclass Program!",
        "Hello Dear Creative.",
        "I am so honoured that you have said yes to this journey. Over the next 6 weeks, we will walk together – discovering your creativity, learning practical skills, and uncovering the Kingdom purpose God has placed inside you.",
        "You are not here by accident. God has something beautiful to build through you.",
        "Now, let's begin. Let's start at the very beginning – not of this course, but of the Bible.",
      ],
      scriptures: [
        {
          text: "In the beginning God created the heaven and the earth.",
          reference: "Genesis 1:1 (KJV)",
        },
        {
          text: "So God created man in his own image, in the image of God created he him; male and female created he them.",
          reference: "Genesis 1:27 (KJV)",
        },
        {
          text: "And God saw every thing that he had made, and, behold, it was very good.",
          reference: "Genesis 1:31 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "Let Me Take You Back to the Very First Week of History",
          paragraphs: [
            "Imagine: there is nothing. No light. No sound. No earth. No sky. Just God – Father, Son, and Holy Spirit – in perfect love and community.",
            "Then God speaks. “Let there be light.” And light appears.",
            "He doesn't struggle. He doesn't try hard. He simply creates. Out of nothing, He makes everything. He separates waters from sky. He calls dry ground to appear. He fills the earth with grass, herbs, fruit trees, each seed carrying the power to reproduce. He puts the sun, moon, and stars in the sky – not for function only, but for beauty. He fills the oceans with creatures and the skies with birds.",
            "After each day, He looks at what He has made and says, “It is good.”",
            "But then comes the sixth day. God creates something different. He forms a man – not by speaking, but by shaping dust with His hands. He breathes His own breath into the man. And then He creates a woman from the man's rib – intimate, intentional, personal.",
            "And here is the most amazing part: God says, “Let us make man in our image.”",
            "Not after His image. Not like His image. In His image. The same way a child carries the likeness of their parent, you carry the likeness of God.",
            "Do you know what that means? God is a Creator. Therefore, you are a creator.",
            "Not because you say so. Not because you took a class. But because the Creator of the universe looked at you and said, “Let them be like Me.”",
            "You were created to create.",
          ],
        },
        {
          heading: "Think about it",
          bullets: [
            "When you write a line of code that solves a problem, you are creating.",
            "When you design a logo that communicates a message, you are creating.",
            "When you write a story that makes someone feel understood, you are creating.",
            "When you cook a meal from scratch, you are creating.",
            "When you find a way to fix something broken, you are creating.",
            "When you sing a song that lifts someone's spirit, you are creating.",
          ],
          closing:
            "You do not have to be a painter or a musician to be creative. You just have to make something that was not there before.",
        },
        {
          heading: "Lies the World Tells You About Creativity",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“You're not creative.”",
                "You are made in the image of the Creator.",
              ],
              [
                "“Only artists are creative.”",
                "Engineers, coders, teachers, parents, and problem-solvers are creative.",
              ],
              [
                "“Creativity is just for fun.”",
                "Creativity is also how you glorify God and serve others.",
              ],
              [
                "“You need a special talent.”",
                "Creativity is an innate muscle. Use it, and it grows.",
              ],
              [
                "“Copying is bad.”",
                "Imitation is how we learn. Your unique voice makes it original.",
              ],
            ],
          },
        },
        {
          heading: "Why This Matters for Your Life",
          paragraphs: [
            "If you believe you are not creative, you will never try. You will wait for someone else to solve problems. You will only keep consuming instead of producing. You will hide your gift.",
            "But if you believe you were made to create, everything changes.",
          ],
          bullets: [
            "You will see problems as opportunities.",
            "You will stop waiting for permission.",
            "You will start building – even if it's small.",
            "You will discover that making something is one of the most joyful, God-honouring things you can do.",
          ],
        },
      ],
      reflection:
        "You are made in the image of the Creator. Creativity is not a hobby – it is your nature. Your skills are not an accident; they are an assignment. God is a Creator. Therefore, you are a creator. You were created to create.",
      focus:
        "Discovering your creative identity and understanding that you were made in the image of the Creator to create.",
      thisWeeksActions: {
        intro:
          "Pick at least 5 of the 7 actions below to complete this week. You don't have to do them in order – just make sure you are practicing and reflecting.",
        items: [
          "Read Genesis 1 slowly. Notice how God creates with joy, not pressure. Let that sink in.",
          "Name one thing you created today – even a text message that helped someone, a meal you prepared, or a problem you solved. Write it down.",
          "Say out loud three times: “I am creative because God is creative.” Speak it until you believe it.",
          "Ask a friend: “What is one creative thing you've seen me do?” Write down their answer.",
          "Thank God for your creativity. Write a short prayer of thanks – just a few sentences from your heart.",
          "Create something small this week – a sketch, a note, a plan, a simple design, a line of code, a recipe. Anything that did not exist before you made it.",
          "Rest one day this weekend. Let the truth sink in: You are a creator.",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Notice something creative you do each day – even small things like solving a problem, writing a kind message, or planning something new. Write it down. Create something small that did not exist before you made it.",
      questions: [
        "What is one thing you have created – anything at all (code, design, meal, story, solution, a plan, a kind word)?",
        "How did you feel when you made it?",
        "What does it mean to you that you are made in the image of the Creator?",
        "Have you ever believed the lie that you are not creative? What changed that belief?",
        'Complete this sentence: "I am creative because God is creative. Today I will..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Dear Father God, thank You for making me in Your image. I confess that I sometimes believe lies about my creativity. I have compared myself to others. I have hidden my ideas. But Your Word says I am made like You – a creator. Help me this week to see the creativity already inside me. Give me courage to start making something – even something small. Let my creation glorify you. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "You are not too young. You are not too old. You are not too ordinary. You are not too late. You are exactly where you need to be — and the God who spoke light into darkness lives in you. And he is still creating. Through you. So this week, don't wait for permission. Don't wait for the perfect time. Just begin. Start small. Start messy. Just start. Now go create something.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for today. Take your time with the assignments, and don't rush. The goal is not perfection — it's presence. This Friday, we will dig deeper into what creativity really is and how you can become more creative — even if you've always thought you weren't the “creative type.” I'll be right here waiting for you. Keep creating.",
        signature: "— Your Ahren Mentor",
      },
    },
    {
      moduleKey: "module-2",
      moduleNumber: 2,
      weekNumber: 1,
      sendOffsetDays: 4, // Friday of Week 1
      sendDayLabel: "Friday",
      title: "What You Need to Know About Creativity",
      subtitle: "And How to Become More Creative",
      subject:
        "Ahren Christian Creativity Masterclass - Week 1: What You Need to Know About Creativity",
      previewText:
        "Creativity is a muscle. Discover how God taught Bezalel — and how He can grow creativity in you.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Earlier this Monday, we discovered that you were created to create — because you are made in the image of the Creator. But maybe you still have questions: “If I'm supposed to be creative, why don't I feel creative?” “How do I actually become more creative?” “Is creativity something you learn, or is it just for special people?”",
        "Those are great questions. And this week, we are going to answer them. Let's dive in.",
      ],
      scriptures: [
        {
          text: "And Moses said unto the children of Israel, See, the LORD hath called by name Bezalel… and he hath filled him with the spirit of God, in wisdom, in understanding, and in knowledge, and in all manner of workmanship.",
          reference: "Exodus 35:30–31 (KJV)",
        },
        {
          text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
          reference: "Proverbs 4:7 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "Bezalel — The Man God Taught to Create",
          paragraphs: [
            "Let me introduce you to a man named Bezalel.",
            "His name means “in the shadow of God.” And he appears in the book of Exodus at a very important moment. God is about to build the Tabernacle – a portable place of worship for the nation of Israel. It needed to be beautiful: gold, silver, intricate fabrics, carvings, and artistic designs.",
            "So God chooses Bezalel.",
            "But here is the key: God doesn't just assign him the work. God fills him with His Spirit, wisdom, understanding, and knowledge – in all manner of workmanship.",
            "That means Bezalel was not born knowing how to do all this. God taught him. God equipped him. Creativity was not a natural gift for Bezalel alone – it was something God gave and grew in him.",
            "And here is the beautiful part: God also gives Bezalel a helper, Oholiab, and teaches both of them to teach others (Exodus 35:34).",
            "So here is the pattern:",
          ],
          bullets: [
            "God calls you.",
            "God equips you.",
            "God teaches you.",
            "Then you teach others.",
          ],
          closing:
            "Creativity is not magic. It is not reserved for a select few. It is a gift that God grows in you as you walk with Him and practice. Creativity is a muscle. You grow it by using it. You were not born knowing how to write code, design a logo, compose a song, or build a business. You learned. And you can keep learning. The same is true for creativity. The more you practice, the more you try, fail, adjust, and try again – the more creative you become.",
        },
        {
          heading: "Practical Steps to Become More Creative",
          paragraphs: [
            "Pick at least 3 of the following 7 steps to practice this week.",
          ],
          bullets: [
            "Consume widely — read books, watch videos, listen to podcasts, explore within and outside your field. The best creators borrow from many places.",
            "Keep a creative journal — every day, write one idea, one sketch, or one question. It doesn't have to be perfect. Just show up.",
            "Practice constraints — limit yourself to build creativity. Example: “Design a logo using only two colours.” Constraints force you to think differently.",
            "Ask “What if?” — take an existing solution and ask: “What if I changed this one thing?” Play with possibilities.",
            "Solve small problems — look around your home, church, workplace, or school. What is one small problem you could solve with your skills? Do it.",
            "Collaborate — work with someone else. Different perspectives spark new ideas.",
            "Pray for ideas — invite the Holy Spirit into your creative process daily. He is your ultimate creative partner.",
          ],
        },
      ],
      reflection:
        "Creativity is a muscle. You grow it by using it. God taught Bezalel — He can teach you too. You were not born knowing how to create. You learned. And you can keep learning.",
      focus:
        "Understanding that creativity is a skill God grows in you, and learning practical ways to become more creative.",
      thisWeeksActions: {
        intro: "Pick at least 4 of the 6 actions below to complete this week.",
        items: [
          "Identify one myth you have believed about creativity. Write down the truth that replaces it.",
          "Read Exodus 35:30–35 slowly. Notice that God taught Bezalel. He can teach you too.",
          "Pick one practical step from the list above. Do it every day this week. Write down what you did.",
          "Ask someone older or wiser in your field: “How did you grow your creativity?” Write their answer.",
          "Spend 30 minutes learning something new – a tool, a technique, a skill – that you have never tried before.",
          "Create something small every day for 3 days (even just 5 minutes per day). It can be a sketch, a line of code, a plan, a melody, or a solution to a tiny problem.",
        ],
      },
      action:
        "Pick at least 4 of the 6 Creative Growth Actions this week. Practice one practical step daily and create something small for 3 days.",
      questions: [
        "What myth about creativity have you believed in the past?",
        "What truth from Bezalel’s story speaks most to you right now?",
        "Which practical step will you practice this week?",
        "What is one small thing you will create in the next 3 days?",
        'Complete this sentence: "Creativity is a muscle. This week I will grow it by..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord, I thank You that You are still teaching me. I am not stuck. I am not too old or too slow. You taught Bezalel, and You can teach me. Open my eyes to see the creativity You have already placed inside me. Help me to practice, to fail without fear, and to grow. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "Creativity is not a special gene reserved for the lucky few. It is a gift God gives, a skill God grows, and a habit you build. You don't have to be perfect. You just have to start. So this week, stop waiting. Stop comparing. Stop listening to the lie that you are not creative. You are creative because God is creative. And He is still teaching you.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for Week 1. Take your time with the assignments. The goal is not perfection — it's practice. Next week, we will explore the Holy Spirit as your creative partner — how He gives ideas, solves problems, and unlocks creativity you didn't know you had. Until then, keep creating. Keep practicing. Keep praying more in the Spirit. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },
    {
      moduleKey: "module-3",
      moduleNumber: 3,
      weekNumber: 2,
      sendOffsetDays: 6, // Monday of Week 2
      sendDayLabel: "Monday",
      title: "The Holy Spirit",
      subtitle: "Your Creativity Partner",
      subject:
        "Ahren Christian Creativity Masterclass - Week 2: The Holy Spirit — Your Creativity Partner",
      previewText:
        "You don't have to create alone. Meet the Holy Spirit as your daily creative partner.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Last Friday, we learned that creativity is not magic — it is a muscle you can grow. You discovered practical steps to become more creative, and you started practicing.",
        "But here is the best news: you don't have to do this alone.",
        "There is a Person — the Holy Spirit — who wants to be your creative partner. He is the one who gave Bezalel wisdom, understanding, and knowledge. He is the one who inspired the writers of the Bible. He is the one who gives you ideas, solves your problems, and opens doors you could never open on your own. He already lives in you as a child of God.",
        "This week, you are going to know him as your daily creative companion. Let's dive in.",
      ],
      scriptures: [
        {
          text: "Ye are of God, little children, and have overcome them: because greater is he that is in you, than he that is in the world.",
          reference: "1 John 4:4 (KJV)",
        },
        {
          text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
          reference: "John 14:26 (KJV)",
        },
        {
          text: "For who hath known the mind of the Lord, that he may instruct him? But we have the mind of Christ.",
          reference: "1 Corinthians 2:16 (KJV)",
        },
        {
          text: "But ye shall receive power, after that the Holy Ghost is come upon you.",
          reference: "Acts 1:8 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "Bezalel — Filled with the Spirit",
          paragraphs: [
            "Do you remember Bezalel from last week? God chose him to build the Tabernacle — a beautiful, intricate, creative project.",
            "But here is what makes Bezalel special:",
            "“And he hath filled him with the spirit of God, in wisdom, in understanding, and in knowledge, and in all manner of workmanship.” — Exodus 35:31 (KJV)",
            "God didn't just give Bezalel a list of instructions. He filled him with the Holy Spirit — and that Spirit gave him wisdom, understanding, and knowledge. That means:",
          ],
          bullets: [
            "Wisdom — to know what to do",
            "Understanding — to know why it matters",
            "Knowledge — to know how to do it",
          ],
          closing:
            "Bezalel didn't have a degree in architecture or design. He had the Holy Spirit. And that was enough. The Holy Spirit is your creative partner. He is not just for prayer meetings, Sunday services, or “spiritual” moments. He is for your weekly work sessions. He is for your design projects. He is for your business ideas. He is for your writing, your music, your content, your videos, your problem-solving and more.",
        },
        {
          heading: "Fellowship Through God's Word (The Bible)",
          paragraphs: [
            "The Bible contains God's word. It is God's living voice to you. As you consistently read, study and meditate on God's word, you hear God speak to you. The Holy Spirit uses the Word to:",
          ],
          bullets: [
            "Renew your mind — Romans 12:2 – “Be ye transformed by the renewing of your mind.”",
            "Reveal God's nature — As you read, you learn who God is and how He works.",
            "Guide your steps — Psalm 119:105 – “Thy word is a lamp unto my feet, and a light unto my path.”",
            "Inspire creativity — The stories, principles, and promises in the Scriptures are raw material for creative ideas.",
          ],
        },
        {
          heading: "Fellowship Through Prayer",
          paragraphs: [
            "Prayer is a two-way conversation. When you pray, you talk to God. And when you listen, He speaks to you. Through prayer, especially praying in the Spirit, the Holy Spirit:",
          ],
          bullets: [
            "Aligns your heart with God's will",
            "Reveals hidden things – ideas, solutions, and strategies",
            "Strengthens your spirit – you become more sensitive to His leading",
            "Breaks creative blocks – many breakthroughs come while praying",
          ],
          closing:
            "When you spend time with God's Word and pray consistently, you are cultivating intimacy with the Holy Spirit. And from that intimacy, creativity flows naturally. You begin to think God's thoughts, see problems from His perspective, and receive solutions that you could never come up with on your own. “If ye abide in me, and my words abide in you, ye shall ask what ye will, and it shall be done unto you.” — John 15:7 (KJV). Abiding means staying connected — through reading, praying, listening, and obeying. When you abide, creativity flows.",
        },
        {
          heading: "Lies the World Tells You About the Holy Spirit",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“The Holy Spirit is just for pastors and missionaries.”",
                "He lives in every believer, and He wants to work through your daily life.",
              ],
              [
                "“The Holy Spirit only speaks about spiritual things.”",
                "He cares about your work, your skills, your projects — because they are His too.",
              ],
              [
                "“I don't need the Holy Spirit for creative work.”",
                "Without Him, you rely on your own strength. With Him, you tap into divine wisdom.",
              ],
              [
                "“I can't hear Him.”",
                "He speaks through peace, impressions, Scripture, and wise counsel. Practice listening.",
              ],
            ],
          },
        },
        {
          heading: "How the Holy Spirit Helps Your Creativity",
          table: {
            headers: ["What He Does", "What That Means for You"],
            rows: [
              [
                "Teaches you all things",
                "He teaches you how to code, design, write, or solve problems in ways you didn't know.",
              ],
              [
                "Brings things to your remembrance",
                "He reminds you of that tutorial, that verse, that idea you had before.",
              ],
              [
                "Guides you into truth",
                "He shows you what is true — including the truth that you are creative, capable, and called.",
              ],
              [
                "Gives you power",
                "You are not working in your own strength. You have supernatural enablement.",
              ],
              [
                "Gives you the mind of Christ",
                "You can see problems from God's perspective — and find solutions you wouldn't see alone.",
              ],
            ],
          },
        },
      ],
      reflection:
        "The Holy Spirit is your creative partner. He is not just for prayer meetings — He is for your weekly work sessions, design projects, business ideas, writing, music, content, videos, and problem-solving. When you abide in Him, creativity flows.",
      focus:
        "Knowing the Holy Spirit as your daily creative companion and learning to partner with Him in your work.",
      thisWeeksActions: {
        intro: "Pick at least 4 of the 6 actions below to complete this week.",
        items: [
          "Before you start any creative task this week, pause and pray: “Holy Spirit, help me.” Do this at least 5 times this week.",
          "Read John 14–16 meditatively. Notice what Jesus says about the Holy Spirit. Write down one promise that stands out to you.",
          "Ask the Holy Spirit for one idea this week. Write down what comes to mind — even if it seems small.",
          "Journal about your work — ask yourself: “Am I relying on my own strength, or am I inviting the Holy Spirit into my work?”",
          "Ask a friend: “When have you experienced the Holy Spirit's help in your creative work?” Write their answer.",
          "For one day, pray before every task — even small ones. Notice if you feel calmer, clearer, or more confident.",
        ],
      },
      action:
        "Pick at least 4 of the 6 Creative Growth Actions this week. Practice inviting the Holy Spirit before your creative tasks.",
      questions: [
        "How have you typically related to the Holy Spirit in your creative work so far?",
        "Which truth about the Holy Spirit stands out to you the most this week?",
        "What is one practical way you will invite the Holy Spirit into your work this week?",
        "Have you ever experienced a creative breakthrough after praying? What happened?",
        'Complete this sentence: "The Holy Spirit is my creative partner. This week I will..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Holy Spirit, welcome into my work. I confess that I have often tried to do things in my own strength. I sometimes forget that You are always with me — not just in church, but in my daily tasks. Today, I invite You into my creativity. Teach me. Guide me. Give me ideas I could never have on my own. I trust You to help me build what will last for eternity. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for Today",
        text: "The Holy Spirit is a Person — and He is with you right now. He doesn't just want to help you pray. He wants to help you create. He wants to help you solve problems. He wants to give you ideas that will impact lives for Jesus Christ. So this week, don't work alone. Don't struggle with your own strength. Don't settle for what you can do on your own. Partner with the Holy Spirit.",
      },
      closing: {
        title: "See You on Friday",
        text: "That's it for today. Take your time with the assignments. Practice inviting the Holy Spirit before every task — even the small ones. Next week, we will explore praying in tongues and fellowshipping with God as fuel for divine creativity — how this spiritual exercise can release ideas, break stagnation, and build your creative capacity. Until then, keep creating — but don't create alone. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },
    {
      moduleKey: "module-4",
      moduleNumber: 4,
      weekNumber: 2,
      sendOffsetDays: 11, // Friday of Week 2
      sendDayLabel: "Friday",
      title: "Praying in Tongues & Fellowshipping With God",
      subtitle: "Fuel for Divine Creativity",
      subject:
        "Ahren Christian Creativity Masterclass - Week 2: Praying in Tongues & Fellowshipping With God",
      previewText:
        "Discover how praying in tongues and fellowshipping with God becomes fuel for divine creativity.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "On Monday, we discovered that the Holy Spirit is your creative partner — and that you don't have to create alone.",
        "But here is the question many young believers ask: “How do I actually partner with the Holy Spirit in my daily life and creative work?” One powerful answer is found in a gift that God has given to every believer who asks: praying in tongues.",
        "This week, we are going to explore how praying in tongues and fellowshipping with God can become fuel for your creativity — breaking mental blocks, releasing divine ideas, and building your capacity to create. Let's dive in.",
      ],
      scriptures: [
        {
          text: "He that speaketh in an unknown tongue edifieth himself.",
          reference: "1 Corinthians 14:4 (KJV)",
        },
        {
          text: "But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost.",
          reference: "Jude 1:20 (KJV)",
        },
        {
          text: "Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.",
          reference: "Romans 8:26 (KJV)",
        },
        {
          text: "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me.",
          reference: "John 15:4 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "The Early Church — Praying in the Spirit",
          paragraphs: [
            "Turn with me to the book of Acts.",
            "The disciples were hiding in an upper room — afraid, confused, and unsure of their next step. But then the Holy Spirit came upon them, and they began to speak in other tongues (Acts 2:4). That was just the beginning.",
            "From that moment on, we see the disciples:",
          ],
          bullets: [
            "Preaching with boldness",
            "Healing the sick",
            "Writing epistles that would become Scripture",
            "Planting churches across the known world",
            "Building communities that turned the world upside down",
          ],
          closing:
            "How did they do it? They were ordinary men and women — fishermen, tax collectors, tentmakers. But they were filled with the Spirit and praying in the Spirit. Paul says that praying in tongues edifies (builds up) the believer. It builds up your spirit. When your spirit is built up, your creative capacity grows. Think of it this way: your spirit is the engine of your creativity. When your spirit is weak, your creativity stalls. When your spirit is strengthened, your creativity flows. Praying in tongues is fuel for divine creativity.",
        },
        {
          heading: "When you pray in tongues",
          bullets: [
            "Your spirit is strengthened",
            "Your mind is cleared",
            "Your creativity is unlocked",
            "Your soul is refreshed",
            "Your faith is built up",
          ],
          closing:
            "Many believers testify that after praying in tongues for 15–20 minutes, fresh ideas come. Solutions appear. Blocks break. Creativity flows. That is because you are not just speaking words — you are allowing the Holy Spirit to pray through you, bypassing your intellectual limitations and speaking God's perfect will.",
        },
        {
          heading: "How Praying in Tongues Fuels Creativity",
          table: {
            headers: ["How It Helps", "Explanation"],
            rows: [
              [
                "Edifies your spirit",
                "Your human spirit is strengthened, making you more sensitive to divine ideas.",
              ],
              [
                "Bypasses mental blocks",
                "When you don't know how to solve a problem, the Spirit prays through you, releasing breakthrough.",
              ],
              [
                "Releases divine wisdom",
                "1 Corinthians 2:10 — the Spirit searches all things, even the deep things of God.",
              ],
              [
                "Breaks creative stagnation",
                "Many testify that fresh ideas and solutions come while or after praying in tongues.",
              ],
              [
                "Increases your capacity",
                "You become a larger vessel — able to carry more of God's creativity and purpose.",
              ],
              [
                "Quietens the noise",
                "Praying in tongues often stills anxiety, fear, and overthinking, allowing you to hear God's voice clearly.",
              ],
            ],
          },
        },
        {
          heading: "Practical Ways to Fellowship with God Regularly",
          table: {
            headers: ["Activity", "Frequency", "Creative Benefit"],
            rows: [
              [
                "Praying in tongues",
                "Daily (start with 15–30 minutes)",
                "Builds spiritual sensitivity and releases ideas",
              ],
              [
                "Worship (singing or listening)",
                "Daily",
                "Opens your heart to receive from God",
              ],
              [
                "Scripture meditation",
                "Daily",
                "God's words become raw materials for creative solutions (Joshua 1:8)",
              ],
              [
                "Quiet listening",
                "After prayer — sit in silence",
                "Learn to recognise His “still small voice” (1 Kings 19:12)",
              ],
              [
                "Journaling what you hear",
                "Every time",
                "Capture divine ideas before you forget",
              ],
              [
                "Fellowship with other believers",
                "Weekly",
                "Encouragement, accountability, and fresh perspectives",
              ],
            ],
          },
        },
        {
          heading: "Lies the World Tells You About Praying in Tongues",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“Speaking in tongues is not for today.”",
                "It is a gift for every believer (Acts 2:39).",
              ],
              [
                "“It's just emotional noise.”",
                "It is a Spirit-given language that builds your spirit and releases divine creativity.",
              ],
              [
                "“Only pastors or missionaries should pray in tongues.”",
                "Every believer can and should — it builds you up (1 Corinthians 14:4).",
              ],
              [
                "“It's not practical for daily life.”",
                "It is one of the most practical tools you have for clarity, peace, and creative breakthrough.",
              ],
            ],
          },
        },
      ],
      reflection:
        "Praying in tongues is fuel for divine creativity. It builds up your spirit, clears your mind, unlocks creativity, and releases divine wisdom. Your spirit is the engine of your creativity — when it is strengthened, creativity flows.",
      focus:
        "Learning to use praying in tongues and consistent fellowship with God as practical fuel for creativity and breakthrough.",
      thisWeeksActions: {
        intro: "Pick at least 4 of the 6 actions below to complete this week.",
        items: [
          "Set aside 15–30 minutes each day to pray in tongues. Do this for at least 5 days this week.",
          "After praying, sit in silence for 2–3 minutes. Write down any thought, impression, or idea that comes — even if it seems random or small.",
          "Read Romans 8:26–27 and 1 Corinthians 14:1–5 slowly. Notice how Paul connects praying in the Spirit with edification (building up).",
          "Ask a mature believer you respect: “How has praying in tongues helped your creativity or work?” Write down their answer.",
          "Before any creative task this week, pray in tongues for 5 minutes first. Notice if anything feels different — clearer, calmer, or more focused.",
          "Journal for one day: “What did I experience when I prayed in tongues today?”",
        ],
      },
      action:
        "Pick at least 4 of the 6 Creative Growth Actions this week. Practice praying in tongues daily and notice the difference in your creativity.",
      questions: [
        "What has been your experience (or hesitation) with praying in tongues so far?",
        "Which benefit of praying in tongues stands out to you the most?",
        "How can you practically build a daily rhythm of fellowship with God this week?",
        "What creative blocks are you currently facing that you want the Holy Spirit to help with?",
        'Complete this sentence: "Praying in tongues is fuel for my creativity. This week I will..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Holy Spirit, I want to know You more. I want to partner with You — not just in my spiritual life, but in my daily work. Teach me to pray in tongues more consistently. Let that prayer become the furnace where creative ideas are forged. I want to partner with You so that my creativity flows from Your heart, not just my mind. Build my spirit. Open my ears. Release Your ideas through me. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "Praying in tongues is not mysterious or strange — it is practical. It builds you up. It clears your mind. It releases divine wisdom. You don't have to understand every word you pray — because it is not about your understanding. It is about your spirit connecting with God's Spirit. And from that connection, creativity flows. So this week, don't just work hard. Pray hard. And see what God does through your hands.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for Week 2. Take your time with the assignments. The goal is not performance — it is connection with God. Next week, we will explore developing godly character — why your talent opens doors, but your character keeps them open. Until then, keep praying in the Spirit — and keep creating. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },
    {
      moduleKey: "module-5",
      moduleNumber: 5,
      weekNumber: 3,
      sendOffsetDays: 14, // Monday of Week 3
      sendDayLabel: "Monday",
      title: "Developing Your Faith in God & Your Character as a Person",
      subtitle: "The Foundation",
      subject:
        "Ahren Christian Creativity Masterclass - Week 3: Developing Your Faith & Character",
      previewText:
        "Your talent opens doors. Your faith and character keep them open. Build the foundation every creator needs.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last two weeks, we've discovered something powerful:",
      ],
      scriptures: [
        {
          text: "Now faith is the substance of things hoped for, the evidence of things not seen.",
          reference: "Hebrews 11:1 (KJV)",
        },
        {
          text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
          reference: "Hebrews 11:6 (KJV)",
        },
        {
          text: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
          reference: "Proverbs 22:1 (KJV)",
        },
        {
          text: "He that is faithful in that which is least is faithful also in much: and he that is unjust in the least is unjust also in much.",
          reference: "Luke 16:10 (KJV)",
        },
        {
          text: "And beside this, giving all diligence, add to your faith virtue; and to virtue knowledge.",
          reference: "2 Peter 1:5 (KJV)",
        },
        {
          text: "Let no man despise thy youth, but be thou an example of the believers, in word, in manner of living, in charity, in spirit, in faith, in purity.",
          reference: "1 Timothy 4:12 (KJV)",
        },
        {
          text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance: against such there is no law.",
          reference: "Galatians 5:22–23 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You are a creator, made in God's image.",
            "Creativity is a muscle you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
          ],
          closing:
            "But here is an important question: “If I have all this — creativity, the Holy Spirit, and spiritual gifts — what could stop me from fulfilling my purpose?” The answer, sadly, is often faith and character. Your talent can open doors. But your faith and character determine whether you stay in the room — or get thrown out. This week, we are going to build the foundation that every creator needs: faith in God and godly character. Let's dive in.",
        },
        {
          heading: "Samson — Great Talent",
          paragraphs: [
            "Let me introduce you to Samson.",
            "Samson had everything a person could want, talent-wise. He was:",
          ],
          bullets: [
            "Set apart from birth (a Nazarite)",
            "Filled with supernatural strength",
            "Raised by godly parents",
            "Chosen by God to deliver Israel from the Philistines",
          ],
          closing:
            "He performed incredible feats: killing a lion with his bare hands, defeating a thousand men with a donkey's jawbone, and carrying off the city gates of Gaza. But Samson had two fatal flaws: he lacked consistent discipline and he could not control himself. He didn't trust God to guide his decisions. He relied on his own strength. He gave in to his desires. He broke his vows. He compromised with the enemy. He ended up betrayed, blinded, and broken — all because his faith and character did not keep up with his talent. His story is a warning: talent without faith and character leads to destruction. What you build with your gift can be torn down by your flaws. Your talent will open doors. Your faith and character will keep them open.",
        },
        {
          heading: "Faith in God",
          bullets: [
            "Believing Him — trusting that He is who He says He is",
            "Trusting His promises — holding onto His Word even when you don't see the outcome",
            "Depending on Him — not relying only on your own strength",
            "Walking with Him — daily relationship, not just Sunday religion",
            "Obedience — doing what He says, even when it doesn't make sense",
          ],
        },
        {
          heading: "Character as a Person",
          bullets: [
            "Integrity — doing the right thing even when no one is watching",
            "Reliability — keeping your word and showing up on time",
            "Honesty — telling the truth even when it costs you",
            "Humility — not thinking you are better than others",
            "Self-control — managing your appetites, emotions, and tongue",
            "Faithfulness — staying committed even when it is hard",
          ],
          closing:
            "Faith in God is your foundation. Character is what you build on it. Without faith, you have no anchor. Without character, you have no credibility.",
        },
        {
          heading: "Lies the World Tells You About Faith & Character",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“Faith is just for Sunday.”",
                "Faith is for every day — for your work, your relationships, and your creativity.",
              ],
              [
                "“I can do it on my own.”",
                "Without faith in God, you will eventually burn out or fall.",
              ],
              [
                "“No one will find out.”",
                "God sees everything. And even if no one else finds out, you will know — and it will shape you.",
              ],
              [
                "“Just this once won't hurt.”",
                "One compromise leads to another. Small choices shape your character.",
              ],
              [
                "“I can be successful without faith and character.”",
                "You can gain the world, but you will lose yourself.",
              ],
              [
                "“Faith and character are for old people.”",
                "They are built in your youth. Every choice matters.",
              ],
            ],
          },
        },
        {
          heading:
            "Why Your Faith in God & Your Character Matters for Your Creativity",
          table: {
            headers: ["Area", "Why It Matters"],
            rows: [
              [
                "Your reputation",
                "People won't trust your work if they can't trust your word or your walk with God.",
              ],
              [
                "Your relationships",
                "Creativity thrives in safe, honest relationships. Faith and character build trust.",
              ],
              [
                "Your spiritual sensitivity",
                "Sin and unbelief dull your hearing. Faith and character keep your heart tender to the Holy Spirit.",
              ],
              [
                "Your longevity",
                "Talent fades. Faith in God and Godly character last. They carry you through dry seasons.",
              ],
              [
                "Your witness",
                "Your faith-walk and Godly character reveals Jesus Christ more than your talent or skills ever will.",
              ],
              [
                "Your creativity flow",
                "When you trust God, you are less anxious — and creativity flows better.",
              ],
            ],
          },
        },
      ],
      reflection:
        "Your talent will open doors. Your faith and character will keep them open. Faith in God is your foundation. Character is what you build on it. Without faith, you have no anchor. Without character, you have no credibility.",
      focus:
        "Building the foundation of faith in God and godly character so that your creativity can last and bring lasting impact.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 7 actions below to complete this week.",
        items: [
          "Read Judges 13–16 and Hebrews 11 slowly. Notice how Samson's choices led to his downfall — and how faith sustained others.",
          "Read Hebrews 11:1–6 every morning this week. Let it sink in: “Without faith it is impossible to please Him.”",
          "Identify one area where you struggle with faith (e.g., trusting God with your future, believing He cares about your work, relying on your own strength). Write down one step you will take to grow.",
          "Identify one area where you struggle with character (e.g., honesty, punctuality, self-control, keeping promises). Write down one step you will take to grow.",
          "Keep one promise this week — even if it costs you something. At the end of the week, write down how it felt.",
          "Ask a trusted friend: “What is one area of faith or character I need to work on?” Write down their answer without getting defensive.",
          "Journal: “What small compromises am I making that could lead to big problems?”",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Focus on growing in one area of faith and one area of character.",
      questions: [
        "Where has talent opened doors for you, but character (or lack of it) affected the outcome?",
        "What area of faith do you most need to grow in right now?",
        "What area of character do you most need to grow in right now?",
        "What small compromise are you currently making that could lead to bigger problems later?",
        'Complete this sentence: "My talent opens doors. My faith and character will keep them open. This week I will..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord Jesus Christ, I confess that I have sometimes valued my talent and skills more than my faith and character. I sometimes focus on what I can build, not on who I am becoming. Please forgive me Lord. Help me to trust You more — even when I don't understand. Help me to always be honest, reliable, and humble — even when no one is watching. I want to be a person of strong faith in you and integrity. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for Today",
        text: "Samson had strength, but no self-control. He had a calling, but no discipline. Do not be like Samson. Your creativity is a gift. But without faith in God and Godly character, it will eventually fail you. Build them now — while you are young, while it is easier, and while you still have time. Faith in God anchors you. Godly Character keeps you. And together, they carry you into your purpose.",
      },
      closing: {
        title: "See You on Friday",
        text: "That's it for today. Take your time with the assignments. The goal is not perfection — it is growth. Next week, we will explore building a creativity lifestyle through daily habits — how small, consistent actions create a life of creative impact. Until then, build your faith. Build your character. They matter more than you know. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },
    {
      moduleKey: "module-6",
      moduleNumber: 6,
      weekNumber: 3,
      sendOffsetDays: 18, // Friday of Week 3
      sendDayLabel: "Friday",
      title: "Building a Creativity Lifestyle",
      subtitle: "Daily Habits & Personal Development",
      subject:
        "Ahren Christian Creativity Masterclass - Week 3: Building a Creativity Lifestyle",
      previewText:
        "Creativity is not a one-time event. It is a lifestyle. Build it through daily habits and intentional personal development.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last few weeks, we have laid a strong foundation:",
      ],
      scriptures: [
        {
          text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
          reference: "Colossians 3:23 (KJV)",
        },
        {
          text: "The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want.",
          reference: "Proverbs 21:5 (KJV)",
        },
        {
          text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.",
          reference: "Galatians 6:9 (KJV)",
        },
        {
          text: "I will bless the LORD at all times: his praise shall continually be in my mouth.",
          reference: "Psalm 34:1 (KJV)",
        },
        {
          text: "But grow in grace, and in the knowledge of our Lord and Saviour Jesus Christ.",
          reference: "2 Peter 3:18 (KJV)",
        },
        {
          text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.",
          reference: "Proverbs 27:17 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You were created to create.",
            "Creativity is a skill you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
            "Faith in God and godly character are your foundation.",
          ],
          closing:
            "Now comes the question: “How do I actually live this out — day by day?” This week, we are going to talk about building a creativity lifestyle through daily habits and personal development. Not a one-time event. Not a project you start and abandon. A lifestyle — a way of living that makes creativity a natural part of who you are, while continuously growing as a person. Let's dive in.",
        },
        {
          heading: "Daniel — A Daily Man Who Grew Continually",
          paragraphs: [
            "Let me introduce you to Daniel.",
            "Daniel was a young man living in a foreign land — far from home, surrounded by people who did not believe in his God. He could have given up. He could have compromised. He could have stayed the same person he was when he arrived.",
            "But Daniel had a daily lifestyle — and a commitment to personal growth.",
            "Three times a day, he knelt and prayed — even when it was illegal (Daniel 6:10). He didn't pray only when he felt like it. He didn't pray only when he was in trouble. He prayed daily.",
            "But Daniel also grew. He learned the language and literature of Babylon (Daniel 1:4). He developed wisdom and understanding that exceeded his peers. He stayed humble, sought God, and kept growing — even after he became a ruler in the kingdom.",
            "And here is the result: God gave him wisdom, favour, and influence in a kingdom that tried to kill him. Daniel's daily habits and commitment to personal growth carried him through decades of service, from a young exile to an old statesman.",
            "The same is true for you. Your creativity is not built in one big moment. It is built in the daily moments. And your person is not shaped by one grand decision — it is shaped by the daily choices you make to grow.",
            "Creativity is not a one-time event. It is a lifestyle. And personal development is the fuel that keeps it growing.",
            "Think about it:",
          ],
          bullets: [
            "A musician doesn't become a musician by performing once. They practice consistently and continually learn new techniques.",
            "A fullstack developer doesn't become a developer by building one project. They write code consistently and continually learn new languages or techniques.",
            "A writer doesn't become an author by writing one chapter. They write consistently and continually study to improve their craft.",
            "A designer doesn't become a designer by creating one logo. They design consistently and continually expand their knowledge to improve in their skills.",
          ],
          closing:
            "Your creativity grows through daily habits. And your person grows through intentional personal development — reading, learning, seeking feedback, and becoming more like Jesus Christ. The secret is not trying harder. The secret is showing up consistently and choosing to grow up spiritually and in every aspect of your life — even when you don't feel spiritual or creative, even when you're tired, even when it feels pointless.",
        },
        {
          heading:
            "Lies the World Tells You About Habits & Personal Development",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“I need to feel inspired to create.”",
                "Inspiration is a by-product of action. Show up, and inspiration often follows.",
              ],
              [
                "“One day I'll have time to grow.”",
                "Time is never found — it is made. You have to protect it.",
              ],
              [
                "“It doesn't matter if I skip one day.”",
                "One day becomes two. Two becomes a week. Consistency is everything.",
              ],
              [
                "“I'm not disciplined enough.”",
                "Discipline is a muscle. You grow it by using it — starting small.",
              ],
              [
                "“My work has to be perfect.”",
                "Perfect is the enemy of done. Done is better than perfect.",
              ],
              [
                "“I don't need to learn new things.”",
                "Growth is the sign of life. Without growth, you stagnate.",
              ],
              [
                "“Personal development is just for some other professionals.”",
                "It is for every believer — you are called to grow in every area of life.",
              ],
            ],
          },
        },
        {
          heading:
            "Simple Daily Habits That Build Your Creativity & Personal Development",
          paragraphs: [
            "Here are 9 daily habits that can transform your creative life and your person. Pick at least 4 to practice this week.",
          ],
          table: {
            headers: ["Habit", "Why It Works"],
            rows: [
              [
                "Pray first",
                "Before you create, invite the Holy Spirit into your work. This sets the tone for your whole day.",
              ],
              [
                "Create for 15 minutes",
                "Even 15 minutes a day adds up. Write a paragraph, sketch a design, write a line of code, plan your project.",
              ],
              [
                "Consume something new",
                "Read an article, watch a tutorial, listen to a podcast. Feed your mind with new ideas.",
              ],
              [
                "Journal one idea",
                "Write down one idea every day if possible — even if it seems silly. This trains your brain to generate ideas.",
              ],
              [
                "Read a book chapter weekly",
                "Read something that helps you grow — in faith, skill, or character.",
              ],
              [
                "Review your progress",
                "Look back at your week. What worked? What didn't? Adjust and keep going.",
              ],
              [
                "Rest intentionally",
                "Creativity requires rest. Take a Sabbath — a real break — every week.",
              ],
              [
                "Pray in tongues",
                "Spend 15–30 minutes daily praying in the Spirit. This builds your spirit and releases creative breakthroughs.",
              ],
              [
                "Ask for feedback",
                "Ask someone you trust: “What could I improve?” Feedback is the shortcut to growth.",
              ],
            ],
          },
        },
        {
          heading: "How Personal Development Fuels Your Creativity",
          table: {
            headers: ["Area of Growth", "How It Helps Your Creativity"],
            rows: [
              [
                "Spiritual growth",
                "You hear God more clearly — and He is the source of all good divine ideas.",
              ],
              [
                "Skill growth",
                "You can build better, bolder, faster, and more creatively.",
              ],
              [
                "Character growth",
                "Your reputation opens doors — and keeps them open.",
              ],
              [
                "Relational growth",
                "You learn from others, and others learn from you.",
              ],
              [
                "Emotional growth",
                "You handle failure, criticism, and setbacks with grace.",
              ],
              [
                "Physical growth",
                "You have energy, focus, and stamina to keep creating.",
              ],
            ],
          },
        },
      ],
      reflection:
        "Creativity is not a one-time event. It is a lifestyle. Personal development is the fuel that keeps it growing. The secret is not trying harder — it is showing up consistently and choosing to grow, even when you don't feel like it.",
      focus:
        "Building a sustainable creativity lifestyle through consistent daily habits and intentional personal development.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 8 actions below to complete this week.",
        items: [
          "Choose one daily creative habit (like writing, sketching, coding, designing or any other creative habit of your choice) — and practice it every day for at least 15 minutes.",
          "Set a specific time for your daily creative habit — e.g., 8 AM, right after breakfast, or before bed. Write it down.",
          "Track your habit — put a “✔” in your calendar every day you practice. This helps you see your consistency.",
          "Read one chapter of a book that helps you grow — in faith, skill, or character. Write down one thing you learned.",
          "Ask someone for feedback on something you created. Write down what they said — even if it's hard to hear.",
          "Pray in tongues for at least 10 minutes every day this week. Notice if anything feels different — calmer, clearer, or more focused.",
          "Rest intentionally for one full day this weekend. No work. No screen time if possible. Let your mind rest.",
          "Journal: “What is one area of my life I need to grow in — and what can I do about it this week?”",
        ],
      },
      action:
        "Pick at least 5 of the 8 Creative Growth Actions this week. Choose one daily creative habit and practice it consistently for at least 15 minutes a day.",
      questions: [
        "What daily creative habit will you commit to this week?",
        "What time of day will you protect for that habit?",
        "Which area of personal development (spiritual, skill, character, relational, emotional, or physical) do you most need to grow in right now?",
        "What usually stops you from being consistent — and how will you overcome it this week?",
        'Complete this sentence: "Creativity is a lifestyle. This week I will show up by..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord, I want to build a creative life — not just a creative moment. Help me to show up every day, even when I don't feel motivated. Help me to see that small actions, repeated over time, create something lasting. And help me to keep growing — in my faith, my skills, my character, and my relationships. Give me the discipline to practice, the wisdom to learn, and the grace to keep going even when it feels hard. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "Creativity is not built in a day. It is built daily. It is built in the 15 minutes you set aside to practice. It is built in the prayer you pray before you start. It is built in the small steps you take — even when no one is watching. And personal development is not a luxury. It is a necessity. Do not despise small beginnings. Do not wait for the “perfect time.” There is no perfect time. There is only now. Show up today. Show up tomorrow. And that lifestyle will impact many lives and glorify Jesus Christ.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for Week 3. Take your time with the assignments. The goal is not perfection — it is consistency and growth. Next week, we will explore developing your creativity personality — how your unique traits shape the way you create, and how to own your creative style. Until then, stay consistent. Keep growing. And keep creating. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-7",
      moduleNumber: 7,
      weekNumber: 4,
      sendOffsetDays: 21, // Monday of Week 4
      sendDayLabel: "Monday",
      title: "Developing Your Creativity Personality",
      subtitle: "Own the Unique Way God Made You to Create",
      subject:
        "Ahren Christian Creativity Masterclass - Week 4: Developing Your Creativity Personality",
      previewText:
        "Your creativity is as unique as your fingerprint. Discover and own the way God made you to create.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last few weeks, we have built a strong foundation:",
      ],
      scriptures: [
        {
          text: "Having then gifts differing according to the grace that is given to us, whether prophecy, let us prophesy according to the proportion of faith…",
          reference: "Romans 12:6 (KJV)",
        },
        {
          text: "For as we have many members in one body, and all members have not the same office: so we, being many, are one body in Christ, and every one members one of another.",
          reference: "Romans 12:4–5 (KJV)",
        },
        {
          text: "I will praise thee; for I am fearfully and wonderfully made: marvellous are thy works; and that my soul knoweth right well.",
          reference: "Psalm 139:14 (KJV)",
        },
        {
          text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
          reference: "Ephesians 2:10 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You were created to create.",
            "Creativity is a skill you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
            "Faith in God and godly character anchor you.",
            "Daily habits and personal development build your creative life.",
          ],
          closing:
            "Now comes a beautiful question: “How do I create in a way that is true to who I am?” This week, we are going to explore your creativity personality — the unique way God made you to create. You don't have to copy anyone else. You don't have to fit into a box. Your creativity is as unique as your fingerprint. Let's dive in.",
        },
        {
          heading: "The Body of Christ — Many Parts, One Purpose",
          paragraphs: [
            "Paul uses a powerful picture to describe how God's family works: the body. He says:",
            "“For the body is not one member, but many. If the foot shall say, Because I am not the hand, I am not of the body; is it therefore not of the body?” — 1 Corinthians 12:14–15 (KJV)",
            "Every part of the body has a different function. The eye sees. The ear hears. The hand holds. The foot walks. Each part is different — but each part is essential.",
            "The same is true for your creativity. You don't have to create like anyone else. You don't have to have the same style, the same methods, or the same results.",
            "God made you with a unique personality — and that personality shapes how you create. Some people create with precision. Others create with spontaneity. Some are loud. Others are quiet. Some are fast. Others are slow and careful.",
            "Every personality type has a place in God's creative family. Your uniqueness is not a flaw — it is a feature.",
            "Your creativity personality is as unique as your fingerprint. Own it. Don't compare it.",
            "You don't have to create like anyone else. Your personality — curious, detailed, wild, calm, structured, spontaneous — shapes how you create. And that is exactly how God designed it.",
            "When you try to copy someone else, you dishonour your own design. But when you create from who you are, your work carries something that no one else can replicate: you.",
          ],
        },
        {
          heading: "Lies the World Tells You About Your Creative Personality",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“You should create like that famous person.”",
                "You were not made to be a copy. You were made to be an original.",
              ],
              [
                "“Your personality is too much.”",
                "Your intensity, your calm, your quirks — God put them there for a reason.",
              ],
              [
                "“You need to change to be accepted.”",
                "Your uniqueness is your offering to the world.",
              ],
              [
                "“Only loud people are creative.”",
                "Quiet, thoughtful people create powerful things too.",
              ],
              [
                "“Your style isn't good enough.”",
                "Your style is still growing. Be patient with it.",
              ],
            ],
          },
        },
        {
          heading: "Discovering Your Creative Personality",
          paragraphs: [
            "Take a moment to think about how you naturally create. Ask yourself these questions:",
          ],
          bullets: [
            "Do I create best in the morning, afternoon, or night?",
            "Do I prefer quiet or background noise?",
            "Do I like planning, or do I fly by the seat of my pants?",
            "Do I need a clear deadline, or do I work best without pressure?",
            "Do I create in long bursts, or in short, frequent sessions?",
            "Do I share my work early, or wait until it's finished?",
          ],
          closing:
            "There is no right answer to any of these. The goal is self-awareness. When you know how you create, you can create more effectively.",
        },
      ],
      reflection:
        "Your creativity personality is as unique as your fingerprint. Own it. Don't compare it. When you create from who you are in Christ, your work carries something that no one else can replicate: you.",
      focus:
        "Discovering and embracing your unique creative personality so you can create in a way that is true to how God made you.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 7 actions below to complete this week.",
        items: [
          "Journal about your creative habits: When do you work best? Where? What conditions help you create?",
          "Take a short personality test (e.g., a creative style quiz) — and write down what you learn about yourself.",
          "Ask 2–3 friends or family members: “What is unique about how I create?” Write down their answers.",
          "Create something that feels “true to you” — don't try to make it look like anyone else's work. Just be yourself.",
          "Read Psalm 139 slowly. Let it sink in that you are fearfully and wonderfully made.",
          "Write a short description of your creative personality in 3–4 sentences.",
          "Pray and ask God: “How do You see my creativity? What is Your purpose for the way You made me?”",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Focus on discovering and owning your unique creative personality.",
      questions: [
        "When and where do you create best?",
        "What is one unique thing about how you create that you have often tried to hide or change?",
        "How has comparing yourself to others affected your creativity?",
        "What would it look like to create more “true to you” this week?",
        'Complete this sentence: "My creativity is unique because God made me... This week I will own it by..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Father God, thank You that You didn't make me like everyone else. You created me with a unique personality, and that personality shapes how I create. Help me to stop comparing myself to others. Help me to embrace the way You made me — even the parts that feel awkward or different. Teach me to create from who I am in you, not from who I think I should be. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "The world wants you to be a copy. But God made you to be original. You don't have to create like your mentor, your friend, or your favourite influencer. You just have to create as yourself in Christ. So this week, stop comparing. Stop imitating. Start creating from the person God made you to be. Your work may or may not look like anyone else's — and that is exactly the point.",
      },
      closing: {
        title: "See You on Friday",
        text: "That's it for today. Take your time with the assignments. The goal is not perfection — it is self-acceptance. Next week, we will explore leadership skills — starting with learning to lead yourself before you lead others. Until then, own your personality. Embrace your uniqueness. And keep creating. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-8",
      moduleNumber: 8,
      weekNumber: 4,
      sendOffsetDays: 25, // Friday of Week 4
      sendDayLabel: "Friday",
      title: "Leadership & Being Led by the Spirit",
      subtitle: "Lead Yourself, Follow the Spirit",
      subject:
        "Ahren Christian Creativity Masterclass - Week 4: Leadership & Being Led by the Spirit",
      previewText:
        "Leadership begins with you. Learn to lead yourself by being led by the Holy Spirit.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last few weeks, we have journeyed together through powerful truths:",
      ],
      scriptures: [
        {
          text: "Let no man despise thy youth; but be thou an example of the believers, in word, in conversation, in charity, in spirit, in faith, in purity.",
          reference: "1 Timothy 4:12 (KJV)",
        },
        {
          text: "For as many as are led by the Spirit of God, they are the sons of God.",
          reference: "Romans 8:14 (KJV)",
        },
        {
          text: "He that is faithful in that which is least is faithful also in much: and he that is unjust in the least is unjust also in much.",
          reference: "Luke 16:10 (KJV)",
        },
        {
          text: "I can do all things through Christ which strengtheneth me.",
          reference: "Philippians 4:13 (KJV)",
        },
        {
          text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
          reference: "Colossians 3:23 (KJV)",
        },
        {
          text: "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.",
          reference: "Galatians 5:22–23 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You were created to create.",
            "Creativity is a skill you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
            "Faith in God and godly character are your foundation.",
            "Daily habits and personal development build your creative life.",
            "Your creativity personality is unique — and you should own it.",
          ],
          closing:
            "Now, we are going to talk about two things that are deeply connected: leadership and being led by the Spirit. You might think, “I'm not a leader. I don't have a title. I'm just a young person trying to figure things out.” The truth is that leadership begins with you. Before you can lead others, you must learn to lead yourself. And the best way to lead yourself is to let the Holy Spirit lead you. Let's dive in.",
        },
        {
          heading: "Joseph — A Leader Led by the Spirit",
          paragraphs: [
            "Let me introduce you to Joseph.",
            "Joseph was a young man with a big dream. But his journey to leadership didn't start in a palace — it started in a pit. Then a slave market. Then a prison.",
            "Everywhere Joseph went, he led himself first. But he didn't do it in his own strength. He did it because the Spirit of God was with him.",
            "In Potiphar's house (Genesis 39), he served with excellence — even as a slave. He didn't complain. He didn't cut corners. He led himself — because God was with him.",
            "In prison (Genesis 39:21–23), he worked hard and earned the trust of the keeper. He didn't give up. He didn't become bitter. He led himself — because God was with him.",
            "When he finally stood before Pharaoh, he was ready — because he had learned to lead himself by following God's Spirit.",
            "“The LORD was with Joseph, and he was a prosperous man.” — Genesis 39:2 (KJV)",
            "Not because Joseph was perfect, but because he walked with God and let the Spirit lead him. And here is the result: Joseph became the second most powerful man in Egypt. But his promotion didn't come because he sought a title. It came because he was faithful in small things, led himself well, and followed the Spirit of God long before anyone gave him a position.",
            "The same is true for you. If you cannot lead yourself, you cannot lead others. And the only way to truly lead yourself is to be led by the Spirit.",
            "Leadership begins with you. But you can't lead yourself well without being led by the Spirit.",
          ],
        },
        {
          heading: "Self-Leadership Means",
          bullets: [
            "Managing your time — showing up when you say you will",
            "Keeping your word — doing what you promised, even when it costs you",
            "Controlling your mouth — speaking life, not gossip or complaints",
            "Managing your emotions — not exploding when things go wrong",
            "Taking responsibility — not blaming others when you make a mistake",
            "Staying disciplined — doing what needs to be done, even when you don't feel like it",
            "Choosing growth — reading, learning, asking for feedback, and getting better",
          ],
        },
        {
          heading: "Being Led by the Spirit Means",
          bullets: [
            "Listening to His promptings — that still, small voice",
            "Obeying even when it doesn't make sense — like Joseph did",
            "Staying sensitive — not hardening your heart",
            "Depending on Him — knowing you cannot do it alone",
            "Letting the Holy Spirit produce His fruit in you — love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, and self-control",
          ],
          closing:
            "When you lead yourself AND let the Holy Spirit lead you, you become unstoppable — because you are not working in your own strength, but in partnership with God.",
        },
        {
          heading: "Lies the World Tells You About Leadership & Being Led",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“I'm too young to lead.”",
                "You are never too young to lead yourself — and to be led by the Spirit (1 Timothy 4:12).",
              ],
              [
                "“I need a title first.”",
                "Leadership is influence, not a position. You can lead from anywhere when the Spirit guides you.",
              ],
              [
                "“Leadership is about being bossy.”",
                "True leadership is serving, following, and listening to the Holy Spirit.",
              ],
              [
                "“I'll lead when I'm ready.”",
                "You become ready by starting — and by letting the Holy Spirit lead your steps.",
              ],
              [
                "“I don't need the Holy Spirit to lead myself.”",
                "Without Him, you rely on your own strength. With Him, you have divine wisdom, insights, concepts, ideas, peace, and guidance.",
              ],
              [
                "“The Spirit only speaks to pastors.”",
                "The Holy Spirit leads every child of God — including you (Romans 8:14).",
              ],
            ],
          },
        },
        {
          heading:
            "Why Being Led by the Spirit Matters for Your Leadership & Creativity",
          table: {
            headers: ["Area", "Why Being Led by the Spirit Matters"],
            rows: [
              [
                "Direction",
                "The Holy Spirit guides you to the right knowledge to acquire, skills to learn, courses to study, projects, people, and opportunities to connect with.",
              ],
              [
                "Decision-making",
                "The Holy Spirit gives wisdom when you don't know what to do.",
              ],
              [
                "Character",
                "The Holy Spirit produces fruit in you — love, joy, peace, patience — that makes you a trustworthy leader (Galatians 5:22–23).",
              ],
              [
                "Sensitivity",
                "The Holy Spirit alerts you to danger, to opportunities, and to the needs of others.",
              ],
              [
                "Creativity",
                "The Holy Spirit gives ideas you could never have on your own.",
              ],
              [
                "Humility",
                "The Holy Spirit reminds you that you are not self-made and not self-sufficient — you are a product of God's grace.",
              ],
            ],
          },
        },
      ],
      reflection:
        "Leadership begins with you. Before you can lead others, you must learn to lead yourself. And the best way to lead yourself is to let the Holy Spirit lead you. Joseph became a leader by leading himself — faithfully, day after day, even when no one was watching.",
      focus:
        "Learning to lead yourself well by depending on the Holy Spirit, so that your influence and creativity flow from partnership with God rather than self-effort.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 8 actions below to complete this week.",
        items: [
          "Identify one area where you struggle with self-leadership (e.g., procrastination, phone addiction, poor time management, loose tongue, emotional reactions). Write it down.",
          "Set one small rule for yourself this week to help you grow in that area.",
          "Track your rule for 5 days. Did you keep it? Write down what helped or hindered you.",
          "Read the story of Joseph in Genesis 37, 39, 40, 41. Notice how he led himself AND how the Spirit of God was with him. Write down one lesson.",
          "Memorise Romans 8:14. Repeat it every morning this week.",
          "Ask a trusted friend: “How well do I lead myself? And do you see the Spirit leading me?” Write down their answer — and don't get defensive.",
          "Journal: “What is the Holy Spirit saying to me today? What is He prompting me to do?” Do this for 5 days.",
          "Practice listening: After you pray, sit in silence for 2–3 minutes. Stay sensitive to Him all day. Write down any thought, impression, or nudge you receive.",
        ],
      },
      action:
        "Pick at least 5 of the 8 Creative Growth Actions this week. Focus on one area of self-leadership and practice listening to the Holy Spirit daily.",
      questions: [
        "In what area of self-leadership do you currently struggle the most?",
        "How have you typically tried to lead yourself — in your own strength or by the Spirit?",
        "What is one prompting from the Holy Spirit you sense right now?",
        "How does Joseph’s story challenge or encourage you?",
        'Complete this sentence: "Leadership begins with me. This week I will lead myself by letting the Spirit..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord Jesus Christ, I confess that I have sometimes tried to lead myself in my own strength — and I have failed. I have been sloppy with my time, my words, and my commitments. I have blamed others when things went wrong. Please forgive me. Today, I choose to lead myself — not in my own strength, but by letting Your Holy Spirit lead me always. Help me to hear Your voice clearly, to obey Your promptings, and to walk in step with You. Produce Your fruit in me. I don't want to be a leader without You. I want to be a leader who follows You. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "Leadership doesn't start with a title. It starts with you. Before you lead a team, lead your time. Before you lead a project, lead your focus. Before you lead an organization, lead your character. Before you influence others, influence yourself. But you cannot do it alone. You need the Holy Spirit. Joseph became a leader by leading himself — faithfully, day after day, even when no one was watching. The same Spirit is with you and lives in you. Let Him lead you — and you will lead yourself well.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for this week. Take your time with the assignments. The goal is not perfection — it is learning to depend on the Holy Spirit. Next week, we will explore using modern technology tools for the Kingdom — how to learn new tools in our generation, use them creatively, and stay up-to-date without losing your soul to worldliness. Until then, lead yourself well — and let the Holy Spirit lead you. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-9",
      moduleNumber: 9,
      weekNumber: 5,
      sendOffsetDays: 28, // Monday of Week 5
      sendDayLabel: "Monday",
      title: "Using Modern Technology Tools for the Kingdom Purposes",
      subtitle: "Tools, Not Masters",
      subject:
        "Ahren Christian Creativity Masterclass - Week 5: Using Modern Technology Tools for the Kingdom",
      previewText:
        "Technology is neutral. In your hands, with the Holy Spirit, it becomes a tool for Kingdom impact.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last few weeks, we have built a strong foundation:",
      ],
      scriptures: [
        {
          text: "Wisdom is the principal thing; therefore get wisdom: and with all thy getting get understanding.",
          reference: "Proverbs 4:7 (KJV)",
        },
        {
          text: "And of the children of Issachar, which were men that had understanding of the times, to know what Israel ought to do…",
          reference: "1 Chronicles 12:32 (KJV)",
        },
        {
          text: "Whatsoever thy hand findeth to do, do it with thy might…",
          reference: "Ecclesiastes 9:10 (KJV)",
        },
        {
          text: "But they that wait upon the LORD shall renew their strength…",
          reference: "Isaiah 40:31 (KJV)",
        },
        {
          text: "Let no corrupt communication proceed out of your mouth, but that which is good to the use of edifying…",
          reference: "Ephesians 4:29 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You were created to create.",
            "Creativity is a skill you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
            "Faith in God and godly character anchor you.",
            "Daily habits and personal development build your creative life.",
            "Your creativity personality is unique — own it.",
            "Leadership begins with you — and you lead yourself best when you are led by the Spirit.",
          ],
          closing:
            "Now we come to a practical but powerful question: “What about the tools? How do I use modern technology — AI, design software, social media, coding tools etc — for the Kingdom Purposes?” This week, we are going to explore how to use today's technology tools without losing your soul to worldliness. You don't have to fear technology. But you also don't have to worship it. You can use it — as a tool — to serve the purposes of God's Kingdom. Let's dive in.",
        },
        {
          heading: "The Sons of Issachar — Understanding the Times",
          paragraphs: [
            "Let me introduce you to a group of people you may not have heard of: the sons of Issachar.",
            "The Bible says they were men who “had understanding of the times, to know what Israel ought to do” (1 Chronicles 12:32).",
            "They understood their generation. They knew what was happening around them. They didn't hide from the world — they engaged with it, under the guidance of God, and they knew what to do.",
            "In the same way, you and I live in a time of rapid technological change. We have tools that previous generations could never have imagined: artificial intelligence, design software, social media, coding platforms, video tools, and more.",
            "The sons of Issachar didn't reject their times — they understood them. And they used that understanding to serve God's purposes. You can do the same. You don't have to reject technology. You don't have to be afraid of it. You just need to understand it, use it wisely, and keep Jesus Christ at the centre.",
            "Technology is neutral. In your hands, with the Holy Spirit, it becomes a tool for Kingdom impact.",
            "Think about it:",
          ],
          bullets: [
            "AI can help you write, design, code, and create faster — but it cannot love people. Only you can.",
            "Social media can reach millions — but it cannot replace prayer, presence, and personal discipleship.",
            "Design tools can make beautiful visuals — but they cannot produce the fruit of the Spirit in your heart.",
          ],
          closing:
            "Technology is not good or evil in itself. It is a tool. It can be used for selfish ambition or for Kingdom purposes. The difference is you and the Holy Spirit. When you use technology with the Holy Spirit's guidance, it becomes a weapon for good. When you use it without the guidance of the Holy Spirit, it becomes a distraction — or worse.",
        },
        {
          heading: "Lies the World Tells You About Technology",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“Technology is evil.”",
                "Technology is neutral. Your heart determines how you use it.",
              ],
              [
                "“You need to keep up with every new tool.”",
                "You don't need to master everything — just the tools that are relevant to your skills, talents, & creativity.",
              ],
              [
                "“Technology will replace human creativity.”",
                "Technology can assist, but it cannot replace the human spirit, imagination, or the Holy Spirit.",
              ],
              [
                "“Social media is a waste of time.”",
                "It can be — or it can be a platform for the gospel. The difference is your intention.",
              ],
              [
                "“You have to be online 24/7 to be relevant.”",
                "Rest is holy. You are not a machine. Jesus Christ withdrew from the crowds. You should too.",
              ],
            ],
          },
        },
        {
          heading:
            "Practical Guidance: Using Modern Tools to Serve God's Purpose",
          table: {
            headers: [
              "Tool Type",
              "How to Use for the Kingdom",
              "What to Avoid",
            ],
            rows: [
              [
                "AI (ChatGPT, Claude, etc.)",
                "Brainstorm ideas, write drafts, summarize content, generate code",
                "Don't let AI replace your own thinking or prayer life.",
              ],
              [
                "Design Tools (Canva, Figma)",
                "Create visuals for church, ministry, or gospel content",
                "Don't let design become an idol. Keep the message clear.",
              ],
              [
                "Social Media (Instagram, X, LinkedIn)",
                "Share testimonies, encourage others, promote Kingdom projects",
                "Don't compare yourself to others. Pray before posting.",
              ],
              [
                "Coding / Development (VS Code, GitHub)",
                "Build apps, websites, tools for ministry, missions, and discipleship",
                "Don't neglect relationships for code.",
              ],
              [
                "Video / Audio (CapCut, Riverside)",
                "Create gospel content, record sermons, share testimonies",
                "Don't chase views instead of souls.",
              ],
              [
                "Productivity Tools (Notion, Trello)",
                "Plan projects, organize ideas, collaborate with others",
                "Don't let planning replace action.",
              ],
            ],
          },
        },
      ],
      reflection:
        "Technology is neutral. In your hands, with the Holy Spirit, it becomes a tool for Kingdom impact. The sons of Issachar understood their times and knew what to do. You can do the same — understand the tools of your generation, use them wisely, and keep Jesus Christ at the centre.",
      focus:
        "Learning to use modern technology tools wisely for Kingdom purposes without losing your soul to worldliness or distraction.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 7 actions below to complete this week.",
        items: [
          "Improve on an existing tool you are familiar with or pick one new tool you have never used.",
          "Dedicate at least 30 mins – 1 hour to start learning it. Build a tiny project — a design, a simple automation, a short video, a plan, or a landing page.",
          "Read 1 Chronicles 12:32 slowly. Ask yourself: “What do I need to understand about this time and these tools?”",
          "Journal: “How can I use this tool to serve someone, serve my church, volunteer somewhere, build something, or reveal Jesus?”",
          "Ask a friend: “What tools have helped you grow in your creativity and Kingdom impact?” Write down their answers.",
          "Set a boundary: Decide how much time you will spend on technology each day — and stick to it.",
          "Take one intentional break from technology — even if it's just 30 minutes. Use that time to pray, read God's word, a book or be with people.",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Learn or improve one tool and use it intentionally for Kingdom impact.",
      questions: [
        "Which modern tool are you most familiar with, and how have you used it so far?",
        "What is one tool you feel prompted to learn or improve this week?",
        "How can you use technology to serve someone or reveal Jesus this week?",
        "What boundary do you need to set around technology use?",
        'Complete this sentence: "Technology is a tool. This week I will use it for the Kingdom by..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord, I thank You that You have placed me in this generation — a generation with wonderful tools. Help me to use technology wisely. Let me not be consumed by it, but let me master it as a tool for Your Kingdom purposes on earth. Give me wisdom to know which tools to learn, and the discipline to put them down when I need to. Help me to use every tool to create value, reveal Jesus Christ and serve others. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "The sons of Issachar understood their times — and they knew what to do. You live in a time of extraordinary tools. These tools can be used to build value and serve Kingdom purposes — or to waste your life. The difference is not the tool. It is you and the Holy Spirit. So this week, improve on an existing skill, learn something new. Build something small. Use it to serve someone, serve in your church or volunteer. And keep your eyes on Jesus Christ.",
      },
      closing: {
        title: "See You on Friday",
        text: "That's it for today. Take your time with the assignments. The goal is not to become a master overnight — it is to start learning and using. Next week, we will explore aligning your skills with God's purpose — including serving your local church. Until then, keep learning — and keep building for the Kingdom. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-10",
      moduleNumber: 10,
      weekNumber: 5,
      sendOffsetDays: 32, // Friday of Week 5
      sendDayLabel: "Friday",
      title: "Understanding God's Purpose for Your Life",
      subtitle: "Aligning Your Skills, Creativity & All You Are With His Plan",
      subject:
        "Ahren Christian Creativity Masterclass - Week 5: Understanding God's Purpose for Your Life",
      previewText:
        "God's purpose is not a mystery you solve — it is a relationship you walk in. Discover how purpose becomes clearer step by step.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Over the last several weeks, we have journeyed through these wonderful truths rooted in God's word:",
      ],
      scriptures: [
        {
          text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
          reference: "Jeremiah 29:11 (KJV)",
        },
        {
          text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.",
          reference: "Proverbs 3:5–6 (KJV)",
        },
        {
          text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
          reference: "Ephesians 2:10 (KJV)",
        },
        {
          text: "The steps of a good man are ordered by the LORD: and he delighteth in his way.",
          reference: "Psalm 37:23 (KJV)",
        },
        {
          text: "For it is God which worketh in you both to will and to do of his good pleasure.",
          reference: "Philippians 2:13 (KJV)",
        },
        {
          text: "For the earnest expectation of the creature waiteth for the manifestation of the sons of God.",
          reference: "Romans 8:19 (KJV)",
        },
        {
          text: "Who will have all men to be saved, and to come unto the knowledge of the truth.",
          reference: "1 Timothy 2:4 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "",
          bullets: [
            "You were created to create.",
            "Creativity is a skill you can grow.",
            "The Holy Spirit is your creative partner.",
            "Praying in tongues fuels divine creativity.",
            "Faith in God and godly character anchor you.",
            "Daily habits and personal development build your creative life.",
            "Your creativity personality is unique — own it.",
            "Leadership begins with you — and you lead yourself best when you are led by the Spirit.",
            "Technology is a tool — and you can use it for the Kingdom.",
          ],
          closing:
            "Now we come to a deeper question: “How do I know what God's plan for my life is? How do I align my skills, creativity, and everything I am with His purpose?” This week, we are going to talk about understanding God's purpose for your life — and how it is not something you figure out overnight, but something that becomes clearer as you walk faithfully with Him. Let's dive in.",
        },
        {
          heading: "Abraham — Walking Into Purpose One Step at a Time",
          paragraphs: [
            "Let me introduce you to Abraham.",
            "God called Abraham when he was seventy-five years old. He said: “Get thee out of thy country, and from thy kindred, and from thy father's house, unto a land that I will shew thee” (Genesis 12:1).",
            "You'll notice that God didn't give Abraham all the details. He simply said, “Go. I will show you.” Abraham obeyed. He took one step. And as he walked, God gave more direction. Step by step. Year by year. His purpose became clearer — not because he sat and waited, but because he walked and obeyed.",
            "The same is true for you. God's purpose for your life is not something you figure out all at once. It becomes clearer as you walk faithfully with Him, serve faithfully with your gifts & skills and step out in faith as He leads you.",
            "And here is one of the most powerful ways your purpose becomes clear: as you serve. When you serve in your local church, volunteer with other ministries or para-church platforms, or step into God-given projects, you discover what you are wired for. Service is not just an expression of purpose — it is a pathway to discovering it.",
            "Walking in God's purpose for your life is not a single moment of revelation — it is a journey of daily obedience to God in everything He leads you to do.",
            "Beloved Creative, God is already carrying out His plans and purposes on earth — He just wants to use you in it. Remember, the Bible says in 1 Corinthians 3:9, “For we are labourers together with God: ye are God's husbandry, ye are God's building.” And Jesus Christ has also commanded us in Mark 16:15-16, “Go ye into all the world, and preach the gospel to every creature.”",
            "In 1 Timothy 2:4, the Bible says that God wants all men to be saved. His heart is for every person to come to the knowledge of the Gospel truth. There are people all around you who are waiting to hear about Jesus Christ, waiting to be touched by His love, waiting for solutions to problems that only God can solve through His people.",
            "And here is another truth, creation itself is waiting for you.",
            "“For the earnest expectation of the creature waiteth for the manifestation of the sons of God.” — Romans 8:19",
            "All of creation — people, situations, systems — is waiting for the sons and daughters of God to step into their purpose. The world is waiting for creative solutions. It is waiting for wisdom, innovation, insights, and God-inspired ideas. It is waiting for you to show up and reveal Jesus Christ through your skills and creativity.",
          ],
        },
        {
          heading: "How Purpose Becomes Clearer",
          table: {
            headers: ["Step", "What Happens"],
            rows: [
              [
                "Walk faithfully with God daily",
                "You spend time in prayer, His Word, and fellowship. You get to know His voice.",
              ],
              [
                "Serve faithfully with your gifts",
                "You use what you have — even if it seems small. You bless others with your skills.",
              ],
              [
                "God places desires in your heart",
                "As you walk with Him, He gives you desires that align with His will (Psalm 37:4).",
              ],
              [
                "You step out in faith",
                "You act on what He puts in your heart — even if you don't see the whole picture yet.",
              ],
              [
                "Purpose becomes clearer",
                "As you obey, God reveals more. Step by step, year by year.",
              ],
            ],
          },
          closing:
            "“Delight thyself also in the LORD; and he shall give thee the desires of thine heart.” — Psalm 37:4. This does not mean you get whatever you want. It means that as you walk with God, He changes your desires to match His will. You begin to want what He wants.",
        },
        {
          heading: "The Daniel Principle: Supernatural Abilities for a Purpose",
          paragraphs: [
            "God puts creative solutions in the hearts of His children so that Jesus can be revealed and glorified. He gives supernatural abilities, wisdom, insights, concepts, and ideas to excel in life — just like Daniel.",
            "“And the king communed with them; and among them all was found none like Daniel, Hananiah, Mishael, and Azariah… in all matters of wisdom and understanding, that the king enquired of them, he found them ten times better than all the magicians and astrologers that were in all his realm.” — Daniel 1:19–20",
            "Daniel excelled because God gave him wisdom and understanding. He didn't just have natural talent — he had supernatural enablement.",
            "As you walk with God faithfully and obediently, all these things begin to find expression through you:",
          ],
          bullets: [
            "Supernatural abilities – gifts, talents and skills that are beyond your natural capacity",
            "Wisdom – knowing what to do, how to do it, when to do it, and even who to do it with",
            "Insights – seeing solutions others cannot see",
            "Concepts and ideas – creativity that flows from the Holy Spirit",
            "Excellence – doing things excellently in ways that bring glory to God",
          ],
          closing:
            "God also teaches you from the inside, by His Holy Spirit. He leads you on the kind of natural knowledge He wants you to acquire — skills to learn, courses to study, career paths to pursue, businesses to start and so on. And He teaches you how to do it excellently. “It is God which worketh in you both to will and to do of his good pleasure.” — Philippians 2:13. God not only gives you the desire to do His will — He also gives you the power to carry it out. He works in you from the inside, shaping your desires and empowering your actions.",
        },
        {
          heading: "Lies the World Tells You About Purpose",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“You need to figure out your purpose right now.”",
                "Purpose is revealed over time, as you walk with God.",
              ],
              [
                "“If you don't know your purpose, you're behind.”",
                "You are exactly where God wants you. He leads step by step.",
              ],
              [
                "“Purpose is about doing something great.”",
                "Purpose is about obeying God — even in small things.",
              ],
              [
                "“You need to hear God's voice loudly.”",
                "God primarily speaks to your heart, through peace, desires, dreams, and open (or closed) doors.",
              ],
              [
                "“Once you find your purpose, it never changes.”",
                "Purpose grows. Seasons change. God leads you step by step.",
              ],
              [
                "“Your skills are just for making money.”",
                "Your skills are also tools to reveal Jesus Christ and bless lives.",
              ],
            ],
          },
        },
      ],
      reflection:
        "God's purpose for your life is not a mystery you have to solve. It is a relationship you walk in. As you walk with Him faithfully, serve with your gifts, and obey Him step by step, purpose becomes clearer. He gives you supernatural abilities, wisdom, and insights — just like He gave Daniel.",
      focus:
        "Understanding that purpose is revealed progressively through faithful walking with God, serving with your gifts, and stepping out in obedience.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 7 actions below to complete this week.",
        items: [
          "Read Genesis 12:1–9 — Notice how God gave Abraham direction step by step.",
          "Read Daniel 1:1–20 — Notice how God gave Daniel wisdom and understanding.",
          "Read Philippians 2:13 — Thank God that He is working in you both to will and to do.",
          "Journal: “What desires has God placed in my heart — even small ones?”",
          "Journal: “Where am I afraid to take a step of faith?”",
          "Reflect: “What am I doing right now that I know God is leading me to do?”",
          "Ask God: “What is the next step You want me to take?”",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Focus on walking faithfully and taking the next step God is showing you.",
      questions: [
        "What desires has God placed in your heart recently — even small ones?",
        "Where are you currently afraid to take a step of faith?",
        "What are you already doing that you sense God is leading you in?",
        "How does Abraham’s or Daniel’s story encourage you about purpose?",
        'Complete this sentence: "Purpose becomes clearer as I walk with God. This week my next step is..."',
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Father God, I thank You that You have a plan for my life — a plan for peace and not for evil, a future and a hope. Help me not to be anxious about figuring it all out. Teach me to walk with You day by day, step by step. I thank You that You are working in me both to will and to do of Your good pleasure. Shape my desires. I ask for supernatural wisdom, insights, and creative solutions — like You gave Daniel — so that I can bless lives and glorify Jesus Christ through my skills, creativity and everything I do. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "God's purpose for your life is not a mystery you have to solve. It is a relationship you walk in. As you walk with Him faithfully, serve with your gifts, and obey Him step by step, purpose becomes clearer. He gives you supernatural abilities, wisdom, and insights — just like He gave Daniel. You don't need to have it all figured out today. Just take the next step. Your steps are ordered. Your purpose is unfolding. Walk faithfully, serve joyfully, and trust Him with the rest.",
      },
      closing: {
        title: "See You Next Week",
        text: "That's it for Week 5. Take your time with the assignments. The goal is not to have everything figured out — it is to take one step of faith. Next week, we will explore real-life examples of Christians using tech and creativity for global impact — and be inspired by what God is doing through ordinary people. Until then, walk faithfully. Serve faithfully. And trust God with your purpose. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-11",
      moduleNumber: 11,
      weekNumber: 6,
      sendOffsetDays: 35, // Monday of Week 6
      sendDayLabel: "Monday",
      title: "Real-Life Examples",
      subtitle: "Christians Using Tech & Creativity for Global Impact",
      subject:
        "Ahren Christian Creativity Masterclass - Week 6: Real-Life Examples of Kingdom Impact",
      previewText:
        "Ordinary Christians are using tech and creativity to impact the world for Jesus. Be inspired — and start building.",
      openingCopy: [
        "Hello and Welcome Back Creative!",
        "Last week, we talked about aligning your skills with God's purpose — serving your local church and volunteering with other ministries and God-given projects.",
        "But maybe you still wonder: “Is this really possible? Can my ordinary skills really make a difference for the Kingdom?”",
        "The answer is a resounding yes.",
        "This week, we are going to look at real-life examples of ordinary Christians who are using their tech skills, creativity, and gifts to impact the world for Jesus Christ. Their stories will inspire you — and show you what is possible when you partner with the Holy Spirit. Let's dive in.",
      ],
      scriptures: [
        {
          text: "And of the children of Issachar, which were men that had understanding of the times, to know what Israel ought to do…",
          reference: "1 Chronicles 12:32 (KJV)",
        },
        {
          text: "The harvest truly is plenteous, but the labourers are few.",
          reference: "Matthew 9:37 (KJV)",
        },
        {
          text: "And he said unto them, Go ye into all the world, and preach the gospel to every creature.",
          reference: "Mark 16:15 (KJV)",
        },
        {
          text: "I can do all things through Christ which strengtheneth me.",
          reference: "Philippians 4:13 (KJV)",
        },
        {
          text: "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
          reference: "Ephesians 2:10 (KJV)",
        },
      ],
      bodySections: [
        {
          heading: "The Early Church — Ordinary People, Extraordinary Impact",
          paragraphs: [
            "Let's travel together to the book of Acts — the story of the early church.",
            "Jesus had just ascended to heaven. His disciples — a small group of ordinary men and women — were left with a massive assignment: “Go into all the world and preach the gospel to every creature” (Mark 16:15).",
            "They were not wealthy. They had no social media, no YouTube, no apps, no printing press. But they had the Holy Spirit.",
            "On the day of Pentecost, the Holy Spirit filled them. Suddenly, these ordinary fishermen, tax collectors, and tentmakers began to speak in other tongues, preach boldly, and heal the sick. The Bible says that within a short time, they “turned the world upside down” (Acts 17:6).",
            "How did they do it?",
          ],
          bullets: [
            "They were filled with the Holy Spirit.",
            "They used their gifts — Peter preached, Paul wrote, Luke documented, Priscilla and Aquila taught, Stephen served.",
            "They collaborated — they didn't do it alone. They worked together in teams.",
            "They stayed focused on the mission — revealing Jesus and growing His Kingdom.",
          ],
          closing:
            "Today, the same Holy Spirit that filled the early church resides within you as a believer. The same mission remains: “Go into all the world.” And you have tools — technology, creativity, skills — that Paul, Peter, and Priscilla could never have imagined. Our generation has the potential to spread the gospel faster and further than any generation before us. If they could turn the world upside down with no technology, imagine what you can do with the tools at your disposal — when you are filled with the same Spirit. You are not the first to ask, “Can my skills really be used for God's Kingdom?” Around the world, believers are building apps, engineering solutions, designing media, and creating content that is impacting millions for Jesus Christ.",
        },
        {
          heading:
            "Real-Life Examples of Christians Impacting the World for Jesus",
          table: {
            headers: [
              "Name / Organisation",
              "What They Do",
              "Skills Used",
              "Impact",
            ],
            rows: [
              [
                "Hallow (Alex Jones)",
                "Audio-guided prayer and meditation app",
                "App development, audio production",
                "Millions of users deepening their prayer life",
              ],
              [
                "Bible Chat (Romanian startup)",
                "AI-powered Christian app for Bible understanding",
                "AI technology, software engineering",
                "The world's top Christian AI app",
              ],
              [
                "FaithTech (James Kelly)",
                "Global movement uniting Christian technologists in 56+ cities",
                "Community building, event organising",
                "Equipping thousands of tech professionals",
              ],
              [
                "Pray.com (Ryan Beck)",
                "Faith-based platform with AI-generated Bible videos",
                "AI, video production, software development",
                "Over 25 million users",
              ],
              [
                "Water Mission",
                "Engineering sustainable safe water solutions",
                "Engineering, project management, logistics",
                "Saving lives through clean water in Jesus' name",
              ],
              [
                "Glorify",
                "Daily devotional app; launching a Christian smart ring",
                "Hardware engineering, app development",
                "Expanding faith tech into wearable devices",
              ],
              [
                "The Edify Hub (Tonye Kehinde Amabibi)",
                "Faith-based education & humanitarian outreach platform",
                "Platform development, educational design",
                "Reached nearly 2,000 learners globally",
              ],
              [
                "VerseTap (Pastor Simeon Taiwo)",
                "AI-powered note-taking app for believers (Nigeria)",
                "AI technology, software development",
                "Bridging tech infrastructure with active ministry",
              ],
              [
                "Vivadios (Minseok Lee)",
                "Conversational AI for the Christian faith experience",
                "AI, software engineering, content personalisation",
                "Making Bible content more accessible",
              ],
              [
                "Limoblaze",
                "UK-based Nigerian Afro-gospel musician",
                "Music production, songwriting, visual storytelling",
                "Bringing the gospel closer through contemporary music",
              ],
              [
                "My Faith Assistant (Michael Youssef)",
                "Faith-based chatbot for scriptural guidance",
                "AI chatbot development, theological content",
                "Instant biblical guidance and pastoral connection",
              ],
              [
                "MAF Technologies (Sanjaya Rasanjana)",
                "Missionary tech training in Papua New Guinea",
                "Technical training, solar energy, logistics",
                "Empowering local ministries with sustainable tech",
              ],
              [
                "Gloo (Patrick Gelsinger)",
                "Faith-tech stack for mission-driven organisations",
                "Tech infrastructure, platform development",
                "Powering the faith and flourishing ecosystem",
              ],
              [
                "Jerry Eze",
                "Raising innovators and entrepreneurs; seed funding",
                "Leadership, mentoring, resource allocation",
                "Addressing poverty, healthcare, and education in Africa",
              ],
            ],
          },
        },
        {
          heading: "What You Can Learn From These Examples",
          table: {
            headers: ["Lesson", "Why It Matters"],
            rows: [
              [
                "Start where you are",
                "You don't need a million users or a global platform to begin. Faithfulness in small things leads to greater influence.",
              ],
              [
                "Combine skills with faith",
                "Your skills are not “secular” or “sacred” — they are all tools for the Kingdom when surrendered to the Holy Spirit.",
              ],
              [
                "Solve real problems",
                "The world has real problems. Your creativity is a gift to help solve them.",
              ],
              [
                "Technology is a tool, not a master",
                "You can embrace modern tools without compromising your faith or worship.",
              ],
              [
                "One person can spark a movement",
                "Do not despise small beginnings. Your project could be the next tool that reaches millions.",
              ],
              [
                "Collaboration multiplies impact",
                "You don't have to build alone. God places people around you to help.",
              ],
              [
                "Service leads to influence",
                "Influence follows faithful service.",
              ],
            ],
          },
        },
      ],
      reflection:
        "You are not the first. And you are not alone. Ordinary people filled with the Holy Spirit turned the world upside down. With the tools available today and the same Spirit, you can impact lives for Jesus Christ. Don't despise small beginnings. Just start.",
      focus:
        "Being inspired by real-life examples of Christians using tech and creativity for global Kingdom impact, and taking personal action.",
      thisWeeksActions: {
        intro: "Pick at least 5 of the 7 actions below to complete this week.",
        items: [
          "Pick one example from the list above that inspires you most.",
          "Research it further – visit their website, read an interview, or watch a video about their work.",
          "Write down two things you learn that you could apply to your own creative journey.",
          "Answer this question: “If they could build what they built, what is stopping me from taking my next step?”",
          "Complete this sentence: “One day, I want my creativity to impact others by…”",
          "Ask a friend: “What example inspires you and why?” Share your answers with each other.",
          "Pray and ask God: “What is the first small step I can take toward building something that impacts others?”",
        ],
      },
      action:
        "Pick at least 5 of the 7 Creative Growth Actions this week. Choose one inspiring example, research it, and identify your next small step.",
      questions: [
        "Which example from the list most inspires you, and why?",
        "What is one thing you can apply from their story to your own journey?",
        "What is currently stopping you from taking your next creative step for the Kingdom?",
        "Complete this sentence: “One day, I want my creativity to impact others by…”",
        "What is the first small step God is prompting you to take?",
      ],
      prayer: {
        title: "A Prayer for Your Week",
        text: "Lord Jesus Christ, thank You for these brothers and sisters who have gone before me in using their skills and creativity for Your glory. Let their example encourage me, not discourage me. Show me that You are raising a generation of creators — and I am part of it. Give me the courage to start small, the strength to keep going, and the humility to serve. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for This Week",
        text: "You are not the first. And you are not alone. The early church turned the world upside down — with no technology, no apps, no social media. They had the Holy Spirit and a willingness to use whatever they had. Now imagine what you can do with the tools at your disposal — when you are filled with the same Spirit and willing to use your skills for His glory. So don't compare yourself. Don't despise small beginnings. Just start. Your project could be the next tool that reaches millions for Jesus Christ.",
      },
      closing: {
        title: "See You on Friday",
        text: "That's it for today. Take your time with the assignments. The goal is not just to be inspired — it is to take action. This Friday, being the final week, we will explore commissioning — how to position yourself, solve problems, build wealth, and reveal Jesus boldly without compromise. Until then, be inspired — and start building. I'll be right here waiting for you.",
        signature: "— Your Ahren Mentor",
      },
    },

    {
      moduleKey: "module-12",
      moduleNumber: 12,
      weekNumber: 6,
      sendOffsetDays: 39, // Friday of Week 6
      sendDayLabel: "Friday",
      title: "Commissioned to Create",
      subtitle:
        "Position Yourself, Solve Problems, Build Wealth, Reveal Jesus Boldly",
      subject:
        "Ahren Christian Creativity Masterclass - Week 6: Commissioned to Create",
      previewText:
        "You have made it. Now go — position yourself, solve problems, build wealth, and reveal Jesus boldly without compromise.",
      openingCopy: [
        "Welcome to Your Final Week Creative!",
        "You have made it.",
        "Over the last eleven weeks, we have journeyed together through life-transforming truths rooted in God's word — and now we come to the final week. This is not the end — it is the beginning.",
        "This week, we are going to talk about commissioning — how to position yourself in the world, solve problems, build wealth, and reveal Jesus boldly without compromise. Let's dive in.",
      ],
      scriptures: [
        {
          text: "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.",
          reference: "Matthew 5:16 (KJV)",
        },
        {
          text: "A man's gift maketh room for him, and bringeth him before great men.",
          reference: "Proverbs 18:16 (KJV)",
        },
        {
          text: "Now at the end of the days that the king had said he should bring them in… the king communed with them; and among them all was found none like Daniel, Hananiah, Mishael, and Azariah: therefore stood they before the king.",
          reference: "Daniel 1:18–19 (KJV)",
        },
        {
          text: "But Daniel purposed in his heart that he would not defile himself with the portion of the king's meat, nor with the wine which he drank.",
          reference: "Daniel 1:8 (KJV)",
        },
        {
          text: "I am not ashamed of the gospel of Christ: for it is the power of God unto salvation to every one that believeth.",
          reference: "Romans 1:16 (KJV)",
        },
      ],
      bodySections: [
        {
          heading:
            "Daniel — Positioned, Problem-Solver, Wealth-Builder, Bold Witness",
          paragraphs: [
            "Let's turn to the book of Daniel.",
            "Daniel was a young man, taken captive from his homeland and brought to Babylon — a foreign land with foreign gods, foreign food, and foreign ways. He could have faded into obscurity. He could have compromised to survive.",
            "But Daniel did something different.",
          ],
          bullets: [
            "He positioned himself. He excelled in his studies and served with excellence (Daniel 1:17–20).",
            "He solved problems. He interpreted dreams that no one else could (Daniel 2, 4, 5).",
            "He built wealth and influence. He rose to become governor and ruler over Babylon (Daniel 2:48).",
            "He revealed Jesus boldly. He never hid his faith — even when it cost him (Daniel 6).",
            "He never compromised. He prayed with his windows open, even when it was illegal (Daniel 6:10).",
          ],
          closing:
            "Daniel's gift made room for him. He became one of the most powerful men in the empire — but he never lost his witness. He did not separate his faith from his work. His work was his platform. His excellence opened doors. His boldness revealed God. And you can do the same. Your creativity is not meant to be hidden. God wants you to manifest it — to solve real problems, create value, build wealth, and reveal Jesus Christ boldly without compromise.",
        },
        {
          heading: "You can",
          bullets: [
            "Solve problems — become a creator who makes life better for others.",
            "Build wealth — create value that also funds Kingdom work and blesses others.",
            "Reveal Jesus Christ — let your work point people to Him.",
            "Never compromise — you can succeed without selling out.",
          ],
        },
        {
          heading: "Lies the World Tells You About Success & Faith",
          table: {
            headers: ["Lie", "Truth"],
            rows: [
              [
                "“To succeed, you have to compromise.”",
                "Daniel succeeded without compromising. So can you.",
              ],
              [
                "“Christianity is for Sundays, not your career.”",
                "Daniel's faith in God was central to his work — and it opened doors.",
              ],
              [
                "“You can't be wealthy and faithful.”",
                "There are many wealthy that are faithful — and they use their wealth for the Kingdom.",
              ],
              [
                "“You have to hide your faith to be accepted.”",
                "Daniel's bold faith made him respected, not rejected.",
              ],
              [
                "“Success is just about money and fame.”",
                "True success is about fulfilling your purpose in God and revealing Jesus Christ to your world.",
              ],
            ],
          },
        },
        {
          heading: "How to Position Yourself in the World",
          table: {
            headers: ["Action", "Why It Matters"],
            rows: [
              [
                "Excel in your craft",
                "Your skills are your platform. Upskill regularly. Master them.",
              ],
              [
                "Solve real problems",
                "People pay for solutions. Be a problem-solver.",
              ],
              [
                "Build a portfolio",
                "Show your work. Let people see what you can do.",
              ],
              [
                "Be reliable and of godly character",
                "Show up on time. Keep your promises. Bear godly fruit.",
              ],
              [
                "Serve others",
                "Your success grows when you help others succeed.",
              ],
              [
                "Collaborate and stay connected",
                "Network with other believers and professionals.",
              ],
              [
                "Pray for opportunities",
                "God opens doors that no one can shut.",
              ],
            ],
          },
        },
        {
          heading: "How to Build Wealth Without Compromise",
          table: {
            headers: ["Principle", "What It Means"],
            rows: [
              [
                "Create value",
                "Build something that helps others. When you solve problems, value is created.",
              ],
              [
                "Be generous",
                "Give to God's work and to those in need. Generosity honours God.",
              ],
              [
                "Stay humble",
                "Wealth is a tool, not a trophy. Keep your heart humble.",
              ],
              ["Avoid debt", "Debt can trap you. Live within your means."],
              [
                "Steward faithfully",
                "Use what you have wisely. God entrusts more to the faithful.",
              ],
              [
                "Seek Kingdom counsel",
                "Ask wise believers for advice on money, business, and career.",
              ],
              [
                "Tithe and give offerings",
                "Honour God with the firstfruits of your increase.",
              ],
            ],
          },
        },
        {
          heading: "How to Reveal Jesus Boldly Without Compromise",
          table: {
            headers: ["Action", "What It Looks Like"],
            rows: [
              [
                "Share your testimony",
                "Tell people what God has done for you.",
              ],
              [
                "Pray publicly",
                "In meetings, at work, before meals — don't hide your prayer.",
              ],
              [
                "Speak the truth in love",
                "Share the gospel with love and grace, but don't water it down.",
              ],
              [
                "Live with integrity and godly character",
                "Your life preaches louder than your words.",
              ],
              [
                "Be ready to answer",
                "When people ask about your hope, be ready to share (1 Peter 3:15).",
              ],
              [
                "Don't fear rejection",
                "Rejection is not failure. It is part of the cost of discipleship.",
              ],
              [
                "Let your work speak",
                "Let your creative projects include a clear witness for Jesus Christ.",
              ],
            ],
          },
        },
        {
          heading: "Bonus Module: Sustaining, Scaling & Staying Faithful",
          paragraphs: [
            "1. Burnout & Balance — You can burn out doing good things. Even ministry becomes a burden when rest is neglected. Jesus withdrew to rest. If the Son of God needed rest, you need rest. Rest is not laziness — it is essential for creativity. “This is the rest wherewith ye may cause the weary to rest… and this is the refreshing.” — Isaiah 28:12",
            "2. Collaboration Over Competition — The world says compete. God's Kingdom says complete. Your brother or sister in Christ is not your enemy — they are your missing piece. Network with likeminds. Share resources. Teach others. Celebrate together. Build for the Kingdom. “Two are better than one… if they fall, the one will lift up his fellow.” — Ecclesiastes 4:9–10",
            "3. Success That Lasts — The world measures followers, money, and titles. God measures faithfulness, obedience, love, and eternal impact. Ask yourself: “Will what I'm building matter in years to come?” “Well done, good and faithful servant.” — Matthew 25:21",
            "4. Leaving a Mark — One day, everything you build will be tested. Gold, silver, and precious stones — done for God's glory — survive. Wood, hay, and stubble — done for fame or pride — burn up. Build what lasts. “Lay up for yourselves treasures in heaven.” — Matthew 6:19–20",
            "5. The Resource Mirage — You look at your hands and see “not enough.” God looks at your hands and sees “raw material for a miracle.” Moses had a stick. The boy had a lunch. You have something. God can multiply it. “What is that in thine hand?” — Exodus 4:2. “But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.” — Matthew 6:33",
          ],
        },
      ],
      reflection:
        "You are not too young, too old, too ordinary, or too late. You have been given a gift — and you are now ready to use it. Daniel rose to the top of a pagan empire without losing his faith. He solved problems, built influence, and revealed God. You can do the same.",
      focus:
        "Commissioning: positioning yourself, solving problems, building wealth, and revealing Jesus boldly without compromise — while sustaining, scaling, and staying faithful.",
      thisWeeksActions: {
        intro: "Pick at least 6 of the 8 actions below to complete this week.",
        items: [
          "Name your Kingdom Project — what do you want to build for God's glory? If no name yet, describe it in 2–3 sentences.",
          "Identify the problem your project solves and who it helps.",
          "Write down one way you can position yourself — online, in your church, in your industry — so that people see your creativity and the God behind it.",
          "Plan one way to build wealth through your project — a product, a service, a subscription, a consulting offering.",
          "Commit one way you will reveal Jesus boldly through this project without watering down your faith.",
          "Read Daniel 1–6 meditatively this week. Notice how Daniel positioned himself, solved problems, built influence, and never compromised.",
          "Journal: “What am I afraid of — failure, rejection, or success? Why?”",
          "Pray and ask God: “How do You want me to use my skills to solve problems, build wealth, and reveal You?”",
        ],
      },
      action:
        "Pick at least 6 of the 8 Creative Growth Actions this week. Name your Kingdom Project and take the first practical steps toward positioning, solving problems, building value, and revealing Jesus.",
      questions: [
        "What is the name (or description) of your Kingdom Project?",
        "What problem does it solve, and who does it help?",
        "How will you position yourself so people see both your creativity and the God behind it?",
        "How will you build wealth through this project without compromise?",
        "How will you reveal Jesus boldly through this project?",
        "What are you most afraid of — failure, rejection, or success — and why?",
      ],
      prayer: {
        title: "A Prayer for Your Commissioning",
        text: "Father, I thank You that You have brought me this far. I confess that I have sometimes been afraid — afraid to fail, afraid to succeed, afraid to be seen, afraid to step out. But today, I choose to step forward. I will use my skills and creativity to solve problems. I will create value. I will build wealth — not for myself alone, but for Your Kingdom purposes. And I will never be ashamed of the gospel of my Lord Jesus Christ, for it is the power of God for salvation to everyone who believes. Help me to position myself, to be bold, to stay faithful, and to reveal Jesus Christ in everything I build. Use my work to draw souls to You. In Jesus' name, Amen.",
      },
      finalWord: {
        title: "A Final Word for You",
        text: "“I am not ashamed of the gospel of Christ.” — Romans 1:16. That is your commissioning verse. You are not hidden. You are not invisible. “Ye are the light of the world. A city that is set on an hill cannot be hid… Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.” — Matthew 5:14–16. You are not too young, too old, too ordinary, or too late. You have been given a gift — and you are now ready to use it. Daniel rose to the top of a pagan empire without losing his faith. He solved problems, built influence, and revealed God. You can do the same.",
      },
      closing: {
        title: "See You On The Other Side",
        text: "That's it for Week 6. And that's it for our 6-week module. You have completed the journey. But this is not the end — it is the beginning. Now go. Position yourself. Solve problems. Build wealth. Reveal Jesus Christ. And never be ashamed of the One who gave you your gifts, creativity, skills and resources. You were created to create. Now go create something for the glory of God.",
        signature: "— Your Ahren Mentor",
      },
    },
  ],
};

export const MENTEE_WELCOME_EMAIL = {
  subject: "Welcome to Ahren Foundation - Your Journey Begins!",
  previewText:
    "Welcome to Ahren Foundation. Your Christian creativity journey is beginning.",
  paragraphs: [
    "Welcome to Ahren Foundation!",
    "We are so honoured that you have said yes to this journey.",
    "Ahren Foundation is a development platform for youths, where Christian creatives find purpose, community, and opportunity. We are building a global network of believers in tech who create value, serve their generation, and advance the Kingdom of God.",
    "Over the next 6 weeks, you will receive a series of interactive Workbook modules designed to help you discover your creative identity, partner with the Holy Spirit, build character and practical skills, and align everything you are with God's purpose for your life.",
    "You are not here by accident. God has something beautiful to build through you - and we are privileged to walk with you.",
  ],
  nextSteps: [
    "Your first interactive module will arrive one week after signup, and new Workbook modules will continue on the Monday / Friday rhythm.",
    "You have been placed on our Workbook path so your mentor match and virtual session details can be coordinated.",
    "As you progress, complete the Workbook questions in each module page and keep your answers saved and submitted.",
    "When you complete the required Workbook modules, you will receive your certificate of completion and verified member next steps.",
  ],
};

export const MENTOR_WELCOME_EMAIL = {
  subject: "Welcome, Mentor - Your Journey with Ahren Foundation Begins!",
  previewText:
    "Thank you for saying yes to mentoring the next generation of Christian creatives.",
  paragraphs: [
    "Welcome to Ahren Foundation!",
    "We are truly honoured that you have said yes to this journey.",
    "Ahren Foundation is a development platform for youths, where Christian creatives find purpose, community, and opportunity. We are building a global network of believers in tech who create value, serve their generation, and advance the Kingdom of God.",
    "Your skills, experience, and heart for the next generation are gifts that will shape young lives for eternity. Thank you for offering them so generously.",
  ],
  nextSteps: [
    "You will receive an invitation to schedule a brief virtual orientation meeting with our team.",
    "After orientation, we will match you with a mentee based on your skills and availability.",
    "You will also gain access to our mentor toolkit and community hub.",
  ],
};

export const COHORT_COMPLETION_EMAIL = {
  subject: "A Letter to Our Creative Cohort",
  previewText:
    "A final word of encouragement as you continue creating for God's glory.",
  memoryVerse:
    "For we are his workmanship, created in Christ Jesus unto good works, which God hath before ordained that we should walk in them.",
  memoryVerseReference: "Ephesians 2:10 (KJV)",
  paragraphs: [
    "Dear Creative,",
    "We have walked through 6 weeks together. You have learned who you are, how to partner with the Holy Spirit, how to build character, how to grow in creativity, how to use new tools, and how to align everything with God's purpose.",
    "You are not an accident. You are God's workmanship - His masterpiece, His poem, His work of art. He created you with intention, and He prepared good works for you to walk in before you were even born.",
    "You are not building your own kingdom. You are walking into the one He already prepared.",
  ],
  reminders: [
    "Your skills are not yours. They are on loan from God. Use them for His glory.",
    "Your career is not yours. It is an assignment from God. Fulfill it for His Kingdom.",
    "Your creativity is not yours. It flows from the Holy Spirit. Partner with Him.",
    "Your tools are not yours. They can be redeemed for eternal impact. Do not fear them. Do not worship them. Redeem them.",
    "Your future is not yours to worry about. It belongs to God. And He has good plans for you.",
  ],
  checkpoints: [
    ["Skills", "Surrendered to God and used for His purposes"],
    ["Career or Business", "Submitted to God and positioned for His Kingdom"],
    ["Tech Tools", "Redeemed by God and deployed for His glory"],
    ["Creativity", "Flowing from God and reflecting His nature"],
  ],
  closing:
    "So go. Build. Create. Shine. Serve. Surrender. Grow. Redeem. Align. The world is waiting for your creativity and innovation - not your perfection, but your obedience to God.",
};

export const PROGRAM_WELCOME_EMAIL = {
  subject: "Welcome to Ahren Foundation Program!",
  previewText:
    "Welcome to the 6-Week Tech & Creativity Masterclass. Here's everything you need to know to get started.",
  paragraphs: [
    "Welcome to Ahren Foundation!",
    "Thank you for registering for our 6-Week Tech & Creativity Masterclass program.",
    "We are so excited to have you on board for our 6 Week Tech & Creativity Mentorship Program. Thank you for registering — we truly believe you are here for such a time as this.",
    "Starting from September 1st over the next 6 weeks, we will walk together as you discover your creative identity, learn practical digital skills, connect with mentors and like minded creatives, and uncover the Kingdom purpose God has placed inside you.",
  ],
  whatToExpect: [
    "12 Interactive Modules – Delivered twice a week (Mondays & Fridays) on our community app",
    "4 Live Virtual Training Sessions – AI & Tech, Branding, Digital Content Creation and Digital Marketing",
    "3 Mentor Meetings – Bi weekly 1 on 1 virtual sessions with your assigned mentor",
    "Certificate of Completion – Awarded upon successful completion",
    "Verified Member Access – Unlock community resources, training, programs and pathway to funding opportunities",
  ],
  liveSessions: [
    ["AI & Tech for Creatives", "Saturday, September 5, 2026"],
    ["Branding", "Saturday, September 19, 2026"],
    [
      "Digital Content Creation & Digital Marketing",
      "Saturday, October 3, 2026",
    ],
  ],
  mentorMeetings: [
    ["Mentor Meeting 1", "Saturday, September 12, 2026"],
    ["Mentor Meeting 2", "Saturday, September 26, 2026"],
    ["Mentor Meeting 3", "Saturday, October 10, 2026"],
  ],
  whatsappNote:
    "To start receiving updates and community discussions, please join our official WhatsApp group via SMS or WhatsApp Message from our Program Admin or send a chat to +234 704 755 5064.",
  attachmentNote:
    "Please find attached: Orientation Guide – Everything you need to know about the program.",
  closing:
    "We are praying for you and cheering you on. This is going to be a transformative journey.",
  contactNote:
    "If you have any questions, please don't hesitate to email us hello@ahrenfoundation.org or reach out to us on WhatsApp: +234 704 755 5064.",
  website: "www.ahrenfoundation.org",
};

export function getModuleDefinition(moduleKey: string) {
  return AHREN_WORKBOOK_PROGRAM.modules.find(
    (module) => module.moduleKey === moduleKey,
  );
}

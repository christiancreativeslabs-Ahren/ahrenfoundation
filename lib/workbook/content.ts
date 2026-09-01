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

export const AHREN_WORKBOOK_PROGRAM: WorkbookProgramDefinition = {
  slug: "christian-creativity-masterclass",
  name: "Ahren Christian Creativity Masterclass",
  summary:
    "A flexible Workbook journey for Christian creatives to discover identity, partner with the Holy Spirit, build character, and align their skills with God's purpose.",
  startsAfterDays: 7,
  modules: [
    // {
    //   moduleKey: "module-1",
    //   moduleNumber: 1,
    //   weekNumber: 1,
    //   sendOffsetDays: 0,
    //   sendDayLabel: "Monday",
    //   title: "You Were Created to Create",
    //   subtitle: "Your Creative Identity",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 1: You Were Created to Create",
    //   previewText:
    //     "Your first Ahren module: discover your creative identity in God.",
    //   openingCopy: [
    //     "Welcome to the Ahren Foundation Christian Creativity Masterclass Program!",
    //     "We are delighted to welcome you to this journey. Over the next 6 weeks, we will walk together - discovering your creativity, building practical skills, and uncovering the Kingdom purpose God has placed inside you.",
    //     "You are not here by accident. God has something beautiful to build through you.",
    //     "Now, let's begin.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "In the beginning God created the heaven and the earth.",
    //       reference: "Genesis 1:1 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "You are made in the image of the Creator. Creativity is not a hobby - it is your nature. Your skills are not an accident; they are an assignment.",
    //   focus:
    //     "Discovering your creative identity and understanding that your skills are not an accident.",
    //   action:
    //     "Notice something creative you do each day - even small things like solving a problem, writing a kind message, or planning something new. Write it down.",
    //   questions: [
    //     "What is one thing you have created - anything at all (code, design, meal, story, solution, a plan, a kind word)?",
    //     "How did you feel when you made it?",
    //     "What does it mean to you that you are made in the image of the Creator?",
    //     "Have you ever believed the lie that you are not creative? What changed that belief?",
    //     'Complete this sentence: "I am creative because God is creative. Today I will..."',
    //   ],
    // },
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
    // {
    //   moduleKey: "module-2",
    //   moduleNumber: 2,
    //   weekNumber: 1,
    //   sendOffsetDays: 4,
    //   sendDayLabel: "Friday",
    //   title: "What You Need to Know About Creativity",
    //   subtitle: "How to Become More Creative",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 1: What You Need to Know About Creativity",
    //   previewText:
    //     "Creativity is a muscle. This module helps you begin practicing it.",
    //   openingCopy: [
    //     "Welcome to the second module of Week 1!",
    //     'Last time, we discovered that you were created to create. Now we ask the practical question: "How do I actually become more creative?"',
    //     "The answer is simpler than you think: creativity is a muscle - you grow it by using it.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "See, the LORD hath called by name Bezalel... and he hath filled him with the spirit of God, in wisdom, and in understanding, and in knowledge, and in all manner of workmanship.",
    //       reference: "Exodus 35:30-31 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "Bezalel was not born a master craftsman. God taught him. Creativity is not magic; it is a skill you can grow through curiosity, practice, and perseverance. The lies you have believed about creativity - that you either have it or you don't - are simply not true.",
    //   focus:
    //     "Understanding what creativity really is and learning practical steps to grow it.",
    //   action:
    //     "Choose one small creative habit to practice every day this week, such as sketching, writing, coding, or designing. Do it for at least 15 minutes each day.",
    //   questions: [
    //     "Which myth about creativity have you believed most? Write the truth that replaces it.",
    //     'Choose one practical step to become more creative, such as keeping a creative journal, practicing constraints, or asking "What if?". What step did you choose and why?',
    //     "What did you learn from the story of Bezalel about how God teaches creativity?",
    //     "What is one thing you can do this week to start practicing creativity daily?",
    //     'Complete this sentence: "I used to think creativity was... Now I know it is..."',
    //   ],
    // },
    {
      moduleKey: "module-3",
      moduleNumber: 3,
      weekNumber: 2,
      sendOffsetDays: 7,
      sendDayLabel: "Monday",
      title: "The Holy Spirit",
      subtitle: "Your Creativity Partner",
      subject:
        "Ahren Christian Creativity Masterclass - Week 2: The Holy Spirit - Your Creativity Partner",
      previewText:
        "You do not have to create alone. The Holy Spirit is your creative partner.",
      openingCopy: [
        "Welcome to Week 2!",
        "Last week, we discovered that you were created to create - that creativity is your nature because you are made in the image of the Creator. This week, we go deeper into the source of all creativity: the Holy Spirit.",
        "You don't have to figure it out alone. The Holy Spirit is not just for prayer meetings or Sunday services. He is your idea generator, problem solver, and creative coach. Before you open your laptop, open your heart to Him.",
      ],
      scriptures: [
        {
          text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
          reference: "John 14:26 (KJV)",
        },
      ],
      reflection:
        "The Holy Spirit is with you - not just in church, but in your daily work. He teaches you, guides you, and gives you ideas you could never have on your own. Partnering with Him is the key to unlocking divine creativity. As you fellowship with God through His Word and prayer, you cultivate intimacy with the Holy Spirit, and from that intimacy, creativity flows naturally.",
      focus:
        "Learning to invite the Holy Spirit into your creative work and daily tasks.",
      action:
        'Before you start any creative task this week, pause and pray: "Holy Spirit, help me." Notice what changes - even in small ways.',
      questions: [
        "Before this week, what did you think about the Holy Spirit in relation to creativity? Has that changed?",
        'What did you experience when you started taking a moment to pray "Holy Spirit, help me" before working?',
        "How does the Holy Spirit teach, guide, and give you ideas for your creative work?",
        "What is one promise from John 14-16 that encouraged you most about the Holy Spirit?",
        'Complete this sentence: "Holy Spirit, I need You in my coding, design, writing, or creativity because..."',
      ],
    },
    {
      moduleKey: "module-4",
      moduleNumber: 4,
      weekNumber: 2,
      sendOffsetDays: 11,
      sendDayLabel: "Friday",
      title: "Praying in Tongues and Fellowshipping with God",
      subtitle: "Fuel for Divine Creativity",
      subject:
        "Ahren Christian Creativity Masterclass - Week 2: Praying in Tongues and Fellowshipping with God",
      previewText:
        "Build a consistent prayer and fellowship life that fuels creativity.",
      openingCopy: [
        "Welcome to the second module of Week 2!",
        "Last time, we learned that the Holy Spirit is your creative partner. But how do you actually partner with Him in a practical, daily way? This module answers that question.",
        "Praying in tongues is not just a spiritual exercise - it is a direct line to divine creativity. When you pray in the Spirit, your spirit is built up, and the Holy Spirit bypasses your intellectual limitations to pray God's perfect will.",
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
      ],
      reflection:
        "Praying in tongues edifies your spirit and releases divine creativity. Regular fellowship with God - prayer, His Word, and worship - keeps your creative well full. Many breakthrough ideas come while praying in the Spirit.",
      focus:
        "Building a consistent prayer and fellowship life to fuel your creativity.",
      action:
        "Set aside 15-30 minutes each day to pray in tongues. After praying, sit in silence for 2-3 minutes and write down any thoughts or impressions that come.",
      questions: [
        "What did you experience when you prayed in tongues this week - even if nothing dramatic happened?",
        "Did any new idea, solution, or clarity come to you during or after praying in tongues?",
        "How does praying in tongues build up your spirit and release divine creativity?",
        "What practical steps can you take to fellowship with God more consistently through His Word and prayer?",
        'Complete this sentence: "Praying in tongues is fuel for my creativity because..."',
      ],
    },
    {
      moduleKey: "module-5",
      moduleNumber: 5,
      weekNumber: 3,
      sendOffsetDays: 14,
      sendDayLabel: "Monday",
      title: "Developing Your Faith in God and Your Character",
      subject:
        "Ahren Christian Creativity Masterclass - Week 3: Developing Your Faith in God and Your Character",
      previewText:
        "Talent can open doors, but faith and character keep them open.",
      openingCopy: [
        "Welcome to Week 3!",
        "Over the past two weeks, we have discovered your creative identity and learned to partner with the Holy Spirit. This week, we turn to a foundational truth: your talent will open doors, but your faith and character will keep them open.",
        "Your creativity is a gift. But without faith and character, it will eventually fail you. Faith anchors you. Character keeps you. And together, they carry you into your purpose.",
      ],
      scriptures: [
        {
          text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
          reference: "Hebrews 11:6 (KJV)",
        },
        {
          text: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
          reference: "Proverbs 22:1 (KJV)",
        },
      ],
      reflection:
        "Samson had incredible talent - but his character could not keep up with his gift. He ended up broken and alone. Your talent will open doors, but your faith and character will keep them open. Build them now - while you are young, while it is easier, and while you still have time.",
      focus: "Building faith and character that outlast your talent.",
      action:
        "Identify one area where you struggle with faith or character. Write down one small step you will take this week to grow in that area.",
      questions: [
        "What is one area where you struggle with faith - even in small ways?",
        "What is one area where you struggle with character - even in small ways?",
        "How does Samson's story challenge you about the importance of character?",
        "What is one specific action you will take this week to grow in faith or character?",
        'Complete this sentence: "Faith and character are the foundation of my creativity because..."',
      ],
    },
    {
      moduleKey: "module-6",
      moduleNumber: 6,
      weekNumber: 3,
      sendOffsetDays: 18,
      sendDayLabel: "Friday",
      title: "Building a Creativity Lifestyle",
      subtitle: "Daily Habits and Personal Development",
      subject:
        "Ahren Christian Creativity Masterclass - Week 3: Building a Creativity Lifestyle - Daily Habits and Personal Development",
      previewText:
        "Creativity is built through small consistent actions repeated over time.",
      openingCopy: [
        "Welcome to the second module of Week 3!",
        'Now that we have established the importance of faith and character, we turn to a practical question: "How do I actually live this out - day by day?"',
        "Creativity is not a one-time event. It is a lifestyle. Small, consistent actions, repeated over time, create a creative life. Personal development is not a luxury - it is the fuel that keeps your creativity growing.",
      ],
      scriptures: [
        {
          text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
          reference: "Colossians 3:23 (KJV)",
        },
      ],
      reflection:
        "Daniel had an excellent spirit - not occasionally, but daily. He prayed three times a day, even when it was illegal. His daily habits carried him through decades of service. The same is true for you. Creativity is not built in one big moment. It is built in the daily moments.",
      focus:
        "Building daily creative habits and committing to personal development.",
      action:
        "Choose one small creative or tech habit to practice every day this week, minimum 15 minutes per day. Track your consistency and notice what changes.",
      questions: [
        "Which daily creative habit did you choose to practice this week?",
        "How many days did you practice it out of 7? What helped or hindered you?",
        "What did you learn about yourself through this habit?",
        "How does personal development fuel your creativity?",
        'Complete this sentence: "Creativity is not a one-time event. It is a..."',
      ],
    },
    {
      moduleKey: "module-7",
      moduleNumber: 7,
      weekNumber: 4,
      sendOffsetDays: 21,
      sendDayLabel: "Monday",
      title: "Developing Your Creativity Personality",
      subject:
        "Ahren Christian Creativity Masterclass - Week 4: Developing Your Creativity Personality",
      previewText: "Own the unique way God designed you to create.",
      openingCopy: [
        "Welcome to Week 4!",
        'You are now halfway through the program. Over the last few weeks, you have discovered your creative identity, learned to partner with the Holy Spirit, and begun building faith and character. This week, we turn to a beautiful question: "How do I create in a way that is true to who I am?"',
        "Your creativity personality is as unique as your fingerprint. You don't have to create like anyone else. Your unique personality - curious, detailed, wild, calm, structured, spontaneous - shapes how you create. Own it.",
      ],
      scriptures: [
        {
          text: "Having then gifts differing according to the grace that is given to us.",
          reference: "Romans 12:6 (KJV)",
        },
      ],
      reflection:
        "The body of Christ has many parts, and each part is different. Your creative personality is unique and needed. You don't have to be a copy - you are an original. Your quirks, your preferences, your unique way of seeing the world - they all matter.",
      focus: "Discovering and owning your unique creative personality.",
      action:
        'Describe your creative personality in three words. Ask a friend: "What is unique about how I create?" Write down their answer.',
      questions: [
        'Describe your creative personality in three words, such as "messy, bold, curious" or "quiet, precise, thoughtful".',
        "What did your friends or family say about how you create?",
        "Have you ever felt pressured to create like someone else? How did that feel?",
        "What is one thing you learned about yourself this week?",
        'Complete this sentence: "God made my creative personality [your 3 words]. I will stop comparing because..."',
      ],
    },
    {
      moduleKey: "module-8",
      moduleNumber: 8,
      weekNumber: 4,
      sendOffsetDays: 25,
      sendDayLabel: "Friday",
      title: "Leadership and Being Led by the Spirit",
      subtitle: "Lead Yourself, Follow the Spirit",
      subject:
        "Ahren Christian Creativity Masterclass - Week 4: Leadership and Being Led by the Spirit",
      previewText:
        "Leadership begins with you, and self-leadership begins with following the Spirit.",
      openingCopy: [
        "Welcome to the second module of Week 4!",
        "You have come so far. This week, we explore two deeply connected things: leadership and being led by the Spirit.",
        'You might think, "I am not a leader. I do not have a title." But leadership begins with you. Before you can lead others, you must learn to lead yourself. And the best way to lead yourself is to let the Holy Spirit lead you.',
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
      ],
      reflection:
        "Joseph led himself well before he ever led anyone else. Everywhere he went - as a slave, as a prisoner, as a ruler - he managed his time, kept his word, controlled his tongue, and took responsibility. Leadership begins with you. And you cannot lead yourself well without being led by the Spirit.",
      focus: "Learning to lead yourself and be led by the Spirit.",
      action:
        'Set one small rule for yourself this week, such as "No phone for the first hour after waking." Track your consistency and notice what changes.',
      questions: [
        "What is one area where you struggle with self-leadership, such as phone addiction, procrastination, or poor time management?",
        "What small rule did you set for yourself this week? Did you keep it?",
        "What did you learn from Joseph's story about leading yourself and being led by the Spirit?",
        "What did you hear from the Spirit this week - even if it was small?",
        'Complete this sentence: "I am learning to lead myself because..."',
      ],
    },
    {
      moduleKey: "module-9",
      moduleNumber: 9,
      weekNumber: 5,
      sendOffsetDays: 28,
      sendDayLabel: "Monday",
      title: "Using Modern Technology Tools for Kingdom Purposes",
      subject:
        "Ahren Christian Creativity Masterclass - Week 5: Using Modern Technology Tools for Kingdom Purposes",
      previewText:
        "Use modern technology as a tool for Kingdom impact, not as an idol.",
      openingCopy: [
        "Welcome to Week 5!",
        'You have come so far. This week, we explore a practical but powerful question: "How do I use modern technology tools - AI, design, social media - without losing my soul?"',
        "Technology is neutral. In your hands, with the Holy Spirit, it becomes a tool for Kingdom impact. You don't have to fear it. You also don't have to worship it. You can use it - as a tool - to build the Kingdom.",
      ],
      scriptures: [
        {
          text: "Wisdom is the principal thing; therefore get wisdom.",
          reference: "Proverbs 4:7 (KJV)",
        },
      ],
      reflection:
        "The sons of Issachar understood their times and knew what to do. You live in a time of extraordinary tools. You have access to AI, design, social media, coding platforms, and more. These tools can be used to build the Kingdom - or to waste your life. The difference is you and the Spirit.",
      focus: "Learning to use modern technology tools for Kingdom impact.",
      action:
        "Pick one modern tool you have never used, such as AI, design, no-code, or video. Spend 1 hour learning it. Build a tiny project.",
      questions: [
        "Which new tool did you pick to learn or improve this week?",
        "What did you build, even if it was small?",
        "How could you use this tool for Kingdom purposes - to serve someone, build something, or reveal Jesus?",
        "What boundary did you set around technology this week - and did you keep it?",
        'Complete this sentence: "Technology is neutral. In my hands, with the Holy Spirit, it becomes..."',
      ],
    },
    {
      moduleKey: "module-10",
      moduleNumber: 10,
      weekNumber: 5,
      sendOffsetDays: 32,
      sendDayLabel: "Friday",
      title: "Understanding God's Purpose for Your Life",
      subtitle:
        "Aligning Your Skills, Creativity, and All You Are with His Plan",
      subject:
        "Ahren Christian Creativity Masterclass - Week 5: Understanding God's Purpose for Your Life",
      previewText:
        "Purpose becomes clearer as you walk with God and serve with your gifts.",
      openingCopy: [
        "Welcome to the second module of Week 5!",
        'Now that we have explored tools and technology, we turn to a deeper question: "How do I know what God\'s plan for my life is? How do I align my skills, creativity, and everything I am with His purpose?"',
        "God's purpose for your life is not a mystery you have to solve - it is a relationship you walk in. As you walk with Him faithfully and serve with your gifts, purpose becomes clearer.",
      ],
      scriptures: [
        {
          text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.",
          reference: "Jeremiah 29:11 (KJV)",
        },
        {
          text: "The steps of a good man are ordered by the LORD: and he delighteth in his way.",
          reference: "Psalm 37:23 (KJV)",
        },
      ],
      reflection:
        "God's purpose for your life becomes clearer as you walk faithfully with Him, serve with your gifts, and step out in faith. He puts desires in your heart. He opens and closes doors. He gives you supernatural wisdom - just like He gave Daniel.",
      focus:
        "Aligning your skills, creativity, and all you are with God's purpose.",
      action:
        'Ask God: "What is the next step You want me to take?" Write down what comes to mind - even if it seems small.',
      questions: [
        "What desires has God placed in your heart recently - even small ones?",
        "Where are you currently walking by faith, trusting God step by step?",
        "What did you learn from Abraham's story about walking into purpose one step at a time?",
        "What is one small step of obedience you can take this week?",
        'Complete this sentence: "God\'s purpose for my life becomes clearer as I..."',
      ],
    },
    {
      moduleKey: "module-11",
      moduleNumber: 11,
      weekNumber: 6,
      sendOffsetDays: 35,
      sendDayLabel: "Monday",
      title: "Real-Life Examples",
      subtitle: "Christians Using Tech and Creativity for Global Impact",
      subject:
        "Ahren Christian Creativity Masterclass - Week 6: Real-Life Examples - Christians Using Tech and Creativity for Global Impact",
      previewText:
        "Learn from examples of Christians using creativity and tools for global impact.",
      openingCopy: [
        "Welcome to Week 6 - your final week!",
        'This week, we bring everything together. You have learned who you are, how to partner with the Holy Spirit, how to build character, and how to use tools for the Kingdom. Now we ask: "What is all this creativity for?"',
        "Your skills are not just for you. They are for the house of God - starting with your local church, and extending to other ministries and God-given projects.",
      ],
      scriptures: [
        {
          text: "The harvest truly is plenteous, but the labourers are few.",
          reference: "Matthew 9:37 (KJV)",
        },
        {
          text: "For we are his workmanship, created in Christ Jesus unto good works.",
          reference: "Ephesians 2:10 (KJV)",
        },
      ],
      reflection:
        "The early church turned the world upside down with no technology. They had the Holy Spirit and a willingness to use whatever they had. Now imagine what you can do with the tools at your disposal - when you are filled with the same Spirit and willing to use your skills for His glory.",
      focus:
        "Learning from real-life examples of Christians using tech and creativity for global impact.",
      action:
        "Pick one example from the list in your module and research their journey. Write down two things you can apply to your own creative journey.",
      questions: [
        "Which example from the list inspired you most? Why?",
        "What did they start with - and what did their journey look like?",
        "What problem did they solve?",
        "What is stopping you from taking your next step?",
        'Complete this sentence: "One day, I want my creativity to impact others by..."',
      ],
    },
    {
      moduleKey: "module-12",
      moduleNumber: 12,
      weekNumber: 6,
      sendOffsetDays: 39,
      sendDayLabel: "Friday",
      title: "Commissioned to Create",
      subtitle:
        "Position Yourself, Solve Problems, Build Wealth, Reveal Jesus Boldly",
      subject:
        "Ahren Christian Creativity Masterclass - Week 6: Commissioned to Create - Position, Solve, Build, Reveal",
      previewText:
        "Your final module: position yourself, solve problems, build, and reveal Jesus boldly.",
      openingCopy: [
        "Welcome to your final module!",
        "You have completed the journey. But this is not the end - it is the beginning.",
        "This final module is about commissioning. God wants you to position yourself, solve problems, build wealth, and reveal Jesus boldly without compromise. Your creativity is not meant to be hidden. It is meant to shine.",
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
      ],
      reflection:
        "Daniel solved problems, built wealth and influence, and revealed God boldly - without compromise. He positioned himself, served with excellence, and never hid his faith. You can do the same. Your success becomes a platform for the gospel.",
      focus:
        "Commissioning - positioning yourself, solving problems, building wealth, and revealing Jesus boldly.",
      action:
        "Write down one next step you will take to launch or advance your Kingdom project. Commit to it.",
      questions: [
        "Name your Kingdom Project - what you want to build for God's glory. If there is no name yet, describe it in 2-3 sentences.",
        "What problem does it solve? Who will it help?",
        "How can you position yourself - online, in your church, in your industry, or in your community - so that people see your creativity and the God behind it?",
        "How will you reveal Jesus boldly through this project - without compromising your faith?",
        "What is the very next concrete step you will take to move this project forward? Be specific.",
      ],
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

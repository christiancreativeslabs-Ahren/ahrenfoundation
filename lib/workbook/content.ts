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
      sendOffsetDays: 7, // Monday of Week 2
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
    // {
    //   moduleKey: "module-3",
    //   moduleNumber: 3,
    //   weekNumber: 2,
    //   sendOffsetDays: 7,
    //   sendDayLabel: "Monday",
    //   title: "The Holy Spirit",
    //   subtitle: "Your Creativity Partner",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 2: The Holy Spirit - Your Creativity Partner",
    //   previewText:
    //     "You do not have to create alone. The Holy Spirit is your creative partner.",
    //   openingCopy: [
    //     "Welcome to Week 2!",
    //     "Last week, we discovered that you were created to create - that creativity is your nature because you are made in the image of the Creator. This week, we go deeper into the source of all creativity: the Holy Spirit.",
    //     "You don't have to figure it out alone. The Holy Spirit is not just for prayer meetings or Sunday services. He is your idea generator, problem solver, and creative coach. Before you open your laptop, open your heart to Him.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "But the Comforter, which is the Holy Ghost, whom the Father will send in my name, he shall teach you all things, and bring all things to your remembrance, whatsoever I have said unto you.",
    //       reference: "John 14:26 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "The Holy Spirit is with you - not just in church, but in your daily work. He teaches you, guides you, and gives you ideas you could never have on your own. Partnering with Him is the key to unlocking divine creativity. As you fellowship with God through His Word and prayer, you cultivate intimacy with the Holy Spirit, and from that intimacy, creativity flows naturally.",
    //   focus:
    //     "Learning to invite the Holy Spirit into your creative work and daily tasks.",
    //   action:
    //     'Before you start any creative task this week, pause and pray: "Holy Spirit, help me." Notice what changes - even in small ways.',
    //   questions: [
    //     "Before this week, what did you think about the Holy Spirit in relation to creativity? Has that changed?",
    //     'What did you experience when you started taking a moment to pray "Holy Spirit, help me" before working?',
    //     "How does the Holy Spirit teach, guide, and give you ideas for your creative work?",
    //     "What is one promise from John 14-16 that encouraged you most about the Holy Spirit?",
    //     'Complete this sentence: "Holy Spirit, I need You in my coding, design, writing, or creativity because..."',
    //   ],
    // },
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

    // {
    //   moduleKey: "module-4",
    //   moduleNumber: 4,
    //   weekNumber: 2,
    //   sendOffsetDays: 11,
    //   sendDayLabel: "Friday",
    //   title: "Praying in Tongues and Fellowshipping with God",
    //   subtitle: "Fuel for Divine Creativity",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 2: Praying in Tongues and Fellowshipping with God",
    //   previewText:
    //     "Build a consistent prayer and fellowship life that fuels creativity.",
    //   openingCopy: [
    //     "Welcome to the second module of Week 2!",
    //     "Last time, we learned that the Holy Spirit is your creative partner. But how do you actually partner with Him in a practical, daily way? This module answers that question.",
    //     "Praying in tongues is not just a spiritual exercise - it is a direct line to divine creativity. When you pray in the Spirit, your spirit is built up, and the Holy Spirit bypasses your intellectual limitations to pray God's perfect will.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "He that speaketh in an unknown tongue edifieth himself.",
    //       reference: "1 Corinthians 14:4 (KJV)",
    //     },
    //     {
    //       text: "But ye, beloved, building up yourselves on your most holy faith, praying in the Holy Ghost.",
    //       reference: "Jude 1:20 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "Praying in tongues edifies your spirit and releases divine creativity. Regular fellowship with God - prayer, His Word, and worship - keeps your creative well full. Many breakthrough ideas come while praying in the Spirit.",
    //   focus:
    //     "Building a consistent prayer and fellowship life to fuel your creativity.",
    //   action:
    //     "Set aside 15-30 minutes each day to pray in tongues. After praying, sit in silence for 2-3 minutes and write down any thoughts or impressions that come.",
    //   questions: [
    //     "What did you experience when you prayed in tongues this week - even if nothing dramatic happened?",
    //     "Did any new idea, solution, or clarity come to you during or after praying in tongues?",
    //     "How does praying in tongues build up your spirit and release divine creativity?",
    //     "What practical steps can you take to fellowship with God more consistently through His Word and prayer?",
    //     'Complete this sentence: "Praying in tongues is fuel for my creativity because..."',
    //   ],
    // },

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

    // {
    //   moduleKey: "module-5",
    //   moduleNumber: 5,
    //   weekNumber: 3,
    //   sendOffsetDays: 14,
    //   sendDayLabel: "Monday",
    //   title: "Developing Your Faith in God and Your Character",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 3: Developing Your Faith in God and Your Character",
    //   previewText:
    //     "Talent can open doors, but faith and character keep them open.",
    //   openingCopy: [
    //     "Welcome to Week 3!",
    //     "Over the past two weeks, we have discovered your creative identity and learned to partner with the Holy Spirit. This week, we turn to a foundational truth: your talent will open doors, but your faith and character will keep them open.",
    //     "Your creativity is a gift. But without faith and character, it will eventually fail you. Faith anchors you. Character keeps you. And together, they carry you into your purpose.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.",
    //       reference: "Hebrews 11:6 (KJV)",
    //     },
    //     {
    //       text: "A good name is rather to be chosen than great riches, and loving favour rather than silver and gold.",
    //       reference: "Proverbs 22:1 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "Samson had incredible talent - but his character could not keep up with his gift. He ended up broken and alone. Your talent will open doors, but your faith and character will keep them open. Build them now - while you are young, while it is easier, and while you still have time.",
    //   focus: "Building faith and character that outlast your talent.",
    //   action:
    //     "Identify one area where you struggle with faith or character. Write down one small step you will take this week to grow in that area.",
    //   questions: [
    //     "What is one area where you struggle with faith - even in small ways?",
    //     "What is one area where you struggle with character - even in small ways?",
    //     "How does Samson's story challenge you about the importance of character?",
    //     "What is one specific action you will take this week to grow in faith or character?",
    //     'Complete this sentence: "Faith and character are the foundation of my creativity because..."',
    //   ],
    // },

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

    // {
    //   moduleKey: "module-6",
    //   moduleNumber: 6,
    //   weekNumber: 3,
    //   sendOffsetDays: 18,
    //   sendDayLabel: "Friday",
    //   title: "Building a Creativity Lifestyle",
    //   subtitle: "Daily Habits and Personal Development",
    //   subject:
    //     "Ahren Christian Creativity Masterclass - Week 3: Building a Creativity Lifestyle - Daily Habits and Personal Development",
    //   previewText:
    //     "Creativity is built through small consistent actions repeated over time.",
    //   openingCopy: [
    //     "Welcome to the second module of Week 3!",
    //     'Now that we have established the importance of faith and character, we turn to a practical question: "How do I actually live this out - day by day?"',
    //     "Creativity is not a one-time event. It is a lifestyle. Small, consistent actions, repeated over time, create a creative life. Personal development is not a luxury - it is the fuel that keeps your creativity growing.",
    //   ],
    //   scriptures: [
    //     {
    //       text: "Whatsoever ye do, do it heartily, as to the Lord, and not unto men.",
    //       reference: "Colossians 3:23 (KJV)",
    //     },
    //   ],
    //   reflection:
    //     "Daniel had an excellent spirit - not occasionally, but daily. He prayed three times a day, even when it was illegal. His daily habits carried him through decades of service. The same is true for you. Creativity is not built in one big moment. It is built in the daily moments.",
    //   focus:
    //     "Building daily creative habits and committing to personal development.",
    //   action:
    //     "Choose one small creative or tech habit to practice every day this week, minimum 15 minutes per day. Track your consistency and notice what changes.",
    //   questions: [
    //     "Which daily creative habit did you choose to practice this week?",
    //     "How many days did you practice it out of 7? What helped or hindered you?",
    //     "What did you learn about yourself through this habit?",
    //     "How does personal development fuel your creativity?",
    //     'Complete this sentence: "Creativity is not a one-time event. It is a..."',
    //   ],
    // },

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

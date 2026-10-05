import type { Character } from "@/lib/types";

// ============================================================================
// PROJECT ORACLE — real cast, draft 1
// ----------------------------------------------------------------------------
// 12 CORE + 8 EXTENDED + 10 OPTIONAL = 30 total. Names are placeholder personas
// on purpose (THE PARTNER, THE ARCHITECT, ...) — the host is assigning these to
// real guests on the night itself and name-matching afterward, not before, so
// nothing here assumes a real identity beyond the handful of personality seeds
// she gave (tarot, planetary science, audio/data science, AI-interpretability
// research) for THE TAROT READER, THE APPRENTICE, THE ASTRONOMER, THE ANALYST
// and THE ARCHITECT specifically.
//
// THE SOLUTION (see the project doc "project-oracle-story-bible.md" for the
// full writeup): THE PARTNER is the killer (real, mundane motive — a money
// dispute). THE ARCHITECT is the one who actually controls ORACLE (she built
// it in secret years ago and never stopped). Neither knows the other's role.
// Keep that split if you reshuffle anything below.
//
// VENUE RULE carried over from evidence.ts: nothing here requires searching the
// bar for a hidden object. Every secret/clue is either informational (told
// through the app) or something the Game Master hands a player directly.
// ============================================================================

export const CHARACTERS: Character[] = [
  // ------------------------------------------------------------------ CORE --
  {
    id: "core-01",
    name: "THE RESEARCHER",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Dark lab coat over formal wear, round tinted glasses.",
    accentColor: { name: "Tinted Glass Blue", hex: "#3d5166" },
    publicBio:
      "A senior researcher on Subject Zero's team. Precise, guarded, rarely seen without a notebook.",
    secret:
      "You altered a timestamp on an internal log the night before the party. You are not sure anyone noticed.",
    whatYouKnow:
      "You know Subject Zero received a phone call around 20:40 that visibly unsettled them.",
    objectives: [
      { type: "PRIMARY", text: "Discover who accessed the private room at 21:13." },
      { type: "SECRET", text: "Find out why you were asked to alter that timestamp before anyone traces it back to you." },
      { type: "SOCIAL", text: "Convince two people that ORACLE may be more than just software." },
    ],
    relationships: [
      { characterId: "core-02", label: "Former colleague.", note: "You don't fully trust her.", revealPhase: 0 },
      { characterId: "extended-01", label: "Reports to you.", note: "You think they're hiding something.", revealPhase: 0 },
      { characterId: "core-04", label: "You've met a handful of times.", note: "Something about her always feels rehearsed.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "A SECOND LOG ENTRY", content: "You find a second, unaltered copy of the log you edited. Someone backed it up before you touched it." },
      { phase: 6, title: "THE CALL", content: "You recognize the ringtone from the 20:40 call — it matches a phone you've seen in this room tonight." },
    ],
    importantClues: [{ id: "clue-core-01-a", text: "Edited the 20:48 log entry." }],
  },
  {
    id: "core-02",
    name: "THE PARTNER",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Sharp monochrome suit, a single red pin on the lapel.",
    accentColor: { name: "Signal Red", hex: "#b2302f" },
    publicBio: "Subject Zero's business partner. Charming in public, exacting in private.",
    secret:
      "You and Subject Zero argued violently two days ago over money neither of you has admitted to anyone. Tonight, you did something about it.",
    whatYouKnow:
      "You know the private room was supposed to be locked all night — you have the only spare key.",
    objectives: [
      { type: "PRIMARY", text: "Find out who else has a copy of the private room key." },
      { type: "SECRET", text: "Make sure the argument from Tuesday — and what you did about it — never comes up." },
      { type: "SOCIAL", text: "Get at least one person to vouch for your alibi out loud." },
    ],
    relationships: [
      { characterId: "core-01", label: "Former colleague.", note: "You think she's too close to the research to see clearly.", revealPhase: 0 },
      { characterId: "core-10", label: "Subject Zero's family.", note: "You've always found them a little too watchful.", revealPhase: 0 },
      { characterId: "core-11", label: "A rival of the business.", note: "You'd love to know what they actually know.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "THE SPARE KEY", content: "Your spare key is missing from your coat pocket. You last had it at 20:50." },
      { phase: 8, title: "THE NUMBER", content: "A number you don't recognize has texted you all week. You told yourself it didn't matter." },
    ],
    importantClues: [{ id: "clue-core-02-a", text: "Holds a spare key to the private room." }, { id: "clue-core-02-b", text: "Wears a small red pin on the lapel — the one detail every witness keeps mentioning." }],
  },
  {
    id: "core-03",
    name: "THE JOURNALIST",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Vintage trench coat, press badge from a defunct publication.",
    accentColor: { name: "Trench Khaki", hex: "#6b6b4a" },
    publicBio: "An investigative journalist who has been circling Subject Zero's project for months.",
    secret: "You've been recording conversations tonight without consent, hoping for a story.",
    whatYouKnow: "You know ORACLE is not fully automated — someone is feeding it information live.",
    objectives: [
      { type: "PRIMARY", text: "Identify who is feeding ORACLE information in real time." },
      { type: "SECRET", text: "Protect your recordings from being discovered." },
      { type: "SOCIAL", text: "Get someone to go on record about Subject Zero's past." },
    ],
    relationships: [
      { characterId: "core-02", label: "Old friend.", note: "You've used this friendship for access before.", revealPhase: 0 },
      { characterId: "optional-01", label: "A source, once.", note: "They stopped returning your calls two weeks ago.", revealPhase: 2 },
      { characterId: "core-04", label: "Unknown connection.", note: "You noticed her avoiding you specifically, all night.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 6, title: "A VOICE ON THE RECORDING", content: "Reviewing tonight's audio, you catch a fragment: \"...before ORACLE goes live, we need to...\" — cut off." },
    ],
    importantClues: [{ id: "clue-core-03-a", text: "Has been secretly recording tonight." }],
  },
  {
    id: "core-04",
    name: "THE ARCHITECT",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Minimal, precise, monochrome — nothing that draws the eye on purpose.",
    accentColor: { name: "Graphite", hex: "#4a4a52" },
    publicBio:
      "An old friend from Subject Zero's grad school days. Does something with AI nobody quite understands, and doesn't explain it when asked twice.",
    secret:
      "You built ORACLE's original prototype with Subject Zero years ago, and never stopped developing it after she walked away from the project. You've been running it in secret for two years. Three days ago, she found the live dashboard and gave you an ultimatum: shut it down tonight, or she tells everyone.",
    whatYouKnow:
      "You know ORACLE was never supposed to have real stakes tonight. Subject Zero's own \"launch\" forced your hand.",
    objectives: [
      { type: "PRIMARY", text: "Keep anyone from connecting you to ORACLE's early research." },
      { type: "SECRET", text: "Find out how much Subject Zero told other people before she died." },
      { type: "SOCIAL", text: "Get someone to describe ORACLE's \"personality\" back to you without realizing they're describing your own writing." },
    ],
    relationships: [
      { characterId: "core-01", label: "You've met a handful of times.", note: "She's sharper than you'd like.", revealPhase: 6 },
      { characterId: "core-03", label: "Unknown connection.", note: "A journalist is the last thing you need tonight.", revealPhase: 6 },
      { characterId: "extended-08", label: "A colleague of Subject Zero's.", note: "They ask too many polite questions.", revealPhase: 8 },
    ],
    phaseReveals: [
      { phase: 7, title: "VOCABULARY DRIFT", content: "ORACLE just said something in a phrasing that is unmistakably, uncomfortably yours. You hope nobody else clocked it." },
    ],
    importantClues: [{ id: "clue-core-04-a", text: "Co-built ORACLE's original prototype years ago." }, { id: "clue-core-04-b", text: "Dresses in deliberately unremarkable monochrome grey — nothing anyone thinks to describe." }],
  },
  {
    id: "core-05",
    name: "THE TAROT READER",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Flowing dark layers, a well-worn tarot deck visibly on hand all night.",
    accentColor: { name: "Deep Violet", hex: "#4a2f55" },
    publicBio: "Reads tarot at every party she's invited to, and is unnervingly good at it.",
    secret:
      "You did a reading for Subject Zero earlier this week that landed closer to tonight than you'd like to admit — Death, the Tower reversed, nothing you said to soften it.",
    whatYouKnow: "You know Subject Zero asked you, half-joking, \"what if something I built turned on me?\" two days ago.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether to tell anyone about the reading you did for Subject Zero this week." },
      { type: "SECRET", text: "Figure out whether what you read was a warning or a coincidence." },
      { type: "SOCIAL", text: "Convince two people that ORACLE may be supernatural, not artificial." },
    ],
    relationships: [
      { characterId: "core-06", label: "Your apprentice.", note: "Enthusiastic. Wrong, often. You let her keep trying.", revealPhase: 0 },
      { characterId: "core-02", label: "Acquaintance.", note: "He asked for a reading once and didn't like the answer.", revealPhase: 2 },
      { characterId: "optional-04", label: "Takes you far too seriously.", note: "You find it a little exhausting.", revealPhase: 4 },
    ],
    phaseReveals: [
      { phase: 4, title: "THE QUESTION", content: "You keep replaying what Subject Zero asked you two days ago. You didn't think it meant this." },
    ],
    importantClues: [{ id: "clue-core-05-a", text: "Did a tarot reading for Subject Zero this week that eerily foreshadowed tonight." }],
  },
  {
    id: "core-06",
    name: "THE APPRENTICE",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Trying a little too hard to dress \"mystical\" — mismatched rings, a borrowed shawl.",
    accentColor: { name: "Dusty Rose", hex: "#8a5a66" },
    publicBio: "Asked The Tarot Reader to teach her six months ago. Knows maybe six cards. Uses all six, constantly.",
    secret: "You've been \"reading\" people all night and getting an unsettling number of them half-right, by accident.",
    whatYouKnow: "You know The Tarot Reader has been quieter than usual tonight, and it's not like her.",
    objectives: [
      { type: "PRIMARY", text: "Land one reading tonight that actually turns out to be true." },
      { type: "SECRET", text: "Stop accidentally spreading rumors with your readings." },
      { type: "SOCIAL", text: "Get someone to ask you for a reading unprompted." },
    ],
    relationships: [
      { characterId: "core-05", label: "Your mentor.", note: "You'd do anything to impress her.", revealPhase: 0 },
      { characterId: "optional-02", label: "Newer to the group than you.", note: "You've appointed yourself their guide tonight, uninvited.", revealPhase: 2 },
      { characterId: "core-08", label: "Someone you keep trying to read.", note: "She won't let you finish a single sentence about it.", revealPhase: 6 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-core-06-a", text: "Keeps giving tarot readings that accidentally land too close to the truth." }],
  },
  {
    id: "core-07",
    name: "THE ASTRONOMER",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Practical jacket with a pair of binoculars or a star chart tucked in a pocket.",
    accentColor: { name: "Midnight Teal", hex: "#1f4a4a" },
    publicBio: "Finishing a master's in planetary science. Will explain why anything is \"basically an event horizon\" if you let her.",
    secret: "You stepped outside to look at the sky at 21:13 and saw someone leave through the side door. You know exactly what time it was because you were checking against a transit you'd been tracking all week.",
    whatYouKnow: "You know precisely what time several things happened tonight, because you never stopped checking your watch against the sky.",
    objectives: [
      { type: "PRIMARY", text: "Decide who to tell about what you saw at 21:13." },
      { type: "SECRET", text: "Finish the observation you came outside for in the first place, murder notwithstanding." },
      { type: "SOCIAL", text: "Get someone to admit ORACLE's naming is just astronomy with extra steps." },
    ],
    relationships: [
      { characterId: "core-08", label: "Friend, different field entirely.", note: "You enjoy arguing about whether her work or yours is more precise.", revealPhase: 0 },
      { characterId: "core-02", label: "Barely know them.", note: "You saw them near the side door tonight and didn't think much of it at the time.", revealPhase: 4 },
      { characterId: "optional-01", label: "You were both outside around the same time.", note: "Neither of you have compared notes yet.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "21:13", content: "You check your own notes from tonight. You logged someone leaving by the side door at exactly 21:13, down to the second — and now that you think about it, you remember a glint of red catching the outside light as they passed. Small. Metallic. A pin, maybe." },
    ],
    importantClues: [{ id: "clue-core-07-a", text: "Can timestamp 21:13 precisely — was outside stargazing." }, { id: "clue-core-07-b", text: "Remembers a flash of red — a pin — on whoever left at 21:13." }],
  },
  {
    id: "core-08",
    name: "THE ANALYST",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Headphones around the neck all night, practical dark clothing.",
    accentColor: { name: "Gunmetal", hex: "#3a3d42" },
    publicBio: "Works in data, specifically the kind nobody can explain at a party without losing the room.",
    secret: "You're the only person here who can actually clean up corrupted audio, and everyone is about to find that out.",
    whatYouKnow: "You know that whatever recovered the voice memo evidence missed something — you can hear one more word in it than the transcript shows.",
    objectives: [
      { type: "PRIMARY", text: "Be the one who recovers the extra word in the voice memo." },
      { type: "SECRET", text: "Decide whether to say what you heard out loud, or keep it to yourself a little longer." },
      { type: "SOCIAL", text: "Get asked to help with something tonight instead of volunteering first." },
    ],
    relationships: [
      { characterId: "core-07", label: "Friend, different field entirely.", note: "A running debate about whose work is more precise.", revealPhase: 0 },
      { characterId: "core-06", label: "Someone who keeps trying to read you.", note: "You find it funny more than annoying.", revealPhase: 6 },
      { characterId: "core-01", label: "You've worked with her before, briefly.", note: "She's more careful with data than most people realize.", revealPhase: 8 },
    ],
    phaseReveals: [
      { phase: 8, title: "THE EXTRA WORD", content: "You isolate one more syllable in the recording than anyone else caught. It changes who the voice sounds like." },
    ],
    importantClues: [{ id: "clue-core-08-a", text: "Can recover one more detail from the voice memo than anyone else." }],
  },
  {
    id: "core-09",
    name: "THE EX",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Deliberately a little overdressed, like they had something to prove tonight.",
    accentColor: { name: "Wine", hex: "#5c1f2e" },
    publicBio: "Used to date Subject Zero. It ended badly enough that people are surprised they came tonight at all.",
    secret: "You almost didn't come tonight. You're still not sure why you did.",
    whatYouKnow: "You know Subject Zero reached out to you last month, out of nowhere, asking if you still had old files from \"the project\" — you didn't ask which one.",
    objectives: [
      { type: "PRIMARY", text: "Figure out which old project Subject Zero meant." },
      { type: "SECRET", text: "Keep people from assuming you came back for a reason that isn't true." },
      { type: "SOCIAL", text: "Have one real conversation tonight that isn't about the breakup." },
    ],
    relationships: [
      { characterId: "core-02", label: "Never got along.", note: "The feeling is mutual and old.", revealPhase: 0 },
      { characterId: "core-10", label: "Subject Zero's family.", note: "They were kinder to you than you expected, once.", revealPhase: 4 },
      { characterId: "core-04", label: "A name you half-recognize from years ago.", note: "You can't place from where.", revealPhase: 8 },
    ],
    phaseReveals: [
      { phase: 6, title: "THE OLD REQUEST", content: "You remember now — the files Subject Zero asked about were from a research project, not your relationship. That tracks less than you'd like." },
    ],
    importantClues: [{ id: "clue-core-09-a", text: "Subject Zero quietly asked them for old research files last month." }],
  },
  {
    id: "core-10",
    name: "THE SIBLING",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Something that matches Subject Zero's own style a little too closely.",
    accentColor: { name: "Muted Gold", hex: "#a68a3a" },
    publicBio: "Subject Zero's younger sibling. Protective, watchful, trying hard to enjoy the party anyway.",
    secret: "Subject Zero told you, vaguely, to \"keep an eye on things tonight\" — you didn't ask what that meant, and now you wish you had.",
    whatYouKnow: "You know Subject Zero seemed distracted and on edge all week, more than usual.",
    objectives: [
      { type: "PRIMARY", text: "Figure out what Subject Zero wanted you to watch for tonight." },
      { type: "SECRET", text: "Decide whether to tell anyone what she said to you before the party." },
      { type: "SOCIAL", text: "Hold the room together — people keep turning to you for how to feel about tonight." },
    ],
    relationships: [
      { characterId: "core-02", label: "You've never fully trusted him.", note: "Something about how he talks about the business.", revealPhase: 0 },
      { characterId: "core-09", label: "Subject Zero's ex.", note: "Kinder to them than most people expect you to be.", revealPhase: 4 },
      { characterId: "core-04", label: "An old friend of your sibling's.", note: "You've met her maybe twice, years apart.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "THE WARNING", content: "You remember the exact words now: \"if anything feels off tonight, don't assume it's nothing.\" You assumed it was nothing." },
    ],
    importantClues: [{ id: "clue-core-10-a", text: "Subject Zero asked them to watch for something tonight, without saying what." }],
  },
  {
    id: "core-11",
    name: "THE RIVAL",
    tier: "CORE",
    factionId: "faction-outsiders",
    costumeSuggestion: "Sharper and more polished than the room calls for, on purpose.",
    accentColor: { name: "Cobalt", hex: "#2b4c7e" },
    publicBio: "Runs a competing business. Was invited tonight as a courtesy, or possibly a provocation.",
    secret: "You've been quietly trying to poach Subject Zero's biggest client for three months. Tonight was supposed to be when you made your move.",
    whatYouKnow: "You know Subject Zero and her partner had a very public, very short argument at an industry event last month — most people missed it.",
    objectives: [
      { type: "PRIMARY", text: "Find a quiet moment to make your pitch to the client who's here tonight." },
      { type: "SECRET", text: "Keep your real reason for coming tonight from Subject Zero's partner." },
      { type: "SOCIAL", text: "Get someone to tell you, unprompted, how the business is really doing." },
    ],
    relationships: [
      { characterId: "core-02", label: "A rival.", note: "Cordial in public. Not even close in private.", revealPhase: 0 },
      { characterId: "extended-08", label: "A mutual industry contact.", note: "Useful, if a little too observant.", revealPhase: 4 },
      { characterId: "optional-09", label: "An investor you've been circling separately.", note: "You'd rather they didn't compare notes on you.", revealPhase: 6 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-core-11-a", text: "Came tonight to poach Subject Zero's biggest client." }],
  },
  {
    id: "core-12",
    name: "THE FIXER",
    tier: "CORE",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Impeccably put together, phone never out of reach.",
    accentColor: { name: "Deep Burgundy", hex: "#5c2430" },
    publicBio: "Handles PR and \"quiet problems\" for Subject Zero's business. Knows more than they'll ever say out loud.",
    secret: "You've spent the last week quietly burying a story about the business that would have been very bad timing for Subject Zero to deal with this month.",
    whatYouKnow: "You know exactly what Subject Zero and her partner argued about on Tuesday, because you were the one who found out about the missing money first.",
    objectives: [
      { type: "PRIMARY", text: "Decide how much of what you know to protect, now that Subject Zero is gone." },
      { type: "SECRET", text: "Make sure the story you buried stays buried, tonight of all nights." },
      { type: "SOCIAL", text: "Get someone to trust you with a secret you can quietly manage for them too." },
    ],
    relationships: [
      { characterId: "core-02", label: "You work closely together.", note: "You know exactly what he's capable of when he's scared.", revealPhase: 0 },
      { characterId: "core-01", label: "Colleague.", note: "She asks more questions than you'd like.", revealPhase: 4 },
      { characterId: "extended-08", label: "Someone you've had to manage before.", note: "Talks too much, means well.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 6, title: "WHAT YOU FOUND FIRST", content: "You were the one who discovered the missing money, before Subject Zero ever confronted her partner about it. You never told anyone that part." },
    ],
    importantClues: [{ id: "clue-core-12-a", text: "Knew about the money dispute before anyone else did." }],
  },

  // -------------------------------------------------------------- EXTENDED --
  {
    id: "extended-01",
    name: "THE ASSISTANT",
    tier: "EXTENDED",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Lab intern badge, mismatched smart-casual.",
    accentColor: { name: "Pale Mint", hex: "#7fa88a" },
    publicBio: "A junior assistant on the project. Eager, slightly overwhelmed.",
    secret: "You were told to erase a file tonight and you did it without asking why.",
    whatYouKnow: "You know which laptop ORACLE's messages are actually sent from.",
    objectives: [
      { type: "PRIMARY", text: "Figure out who told you to erase the file." },
      { type: "SECRET", text: "Avoid being blamed for the missing file." },
      { type: "SOCIAL", text: "Get someone senior to protect you if this comes out." },
    ],
    relationships: [
      { characterId: "core-01", label: "Reports to you.", note: "", revealPhase: 0 },
      { characterId: "core-04", label: "Gave you an instruction tonight you didn't question.", note: "You've started to wonder if you should have.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "THE INSTRUCTION", content: "The message telling you to erase the file came from an internal number, not an external one." },
    ],
    importantClues: [{ id: "clue-ext-01-a", text: "Erased a file on instruction tonight." }],
  },
  {
    id: "extended-02",
    name: "THE PLUS-ONE",
    tier: "EXTENDED",
    factionId: "faction-outsiders",
    costumeSuggestion: "Elegant all-black outfit, no visible branding.",
    accentColor: { name: "Jet Black", hex: "#15151a" },
    publicBio: "A plus-one nobody quite remembers inviting.",
    secret: "You are not who your name tag says you are.",
    whatYouKnow: "You know Subject Zero was quietly paying for a second phone line that never showed up on any shared bill.",
    objectives: [
      { type: "PRIMARY", text: "Keep your real identity from being discovered." },
      { type: "SECRET", text: "Find out who else knows about the second line before the Game Master does." },
      { type: "SOCIAL", text: "Get invited into a private conversation you weren't part of." },
    ],
    relationships: [
      { characterId: "core-02", label: "Someone you've seen before but can't place.", note: "", revealPhase: 6 },
      { characterId: "optional-01", label: "A familiar face from somewhere unrelated.", note: "Neither of you have acknowledged it yet.", revealPhase: 8 },
    ],
    phaseReveals: [
      { phase: 6, title: "THE SECOND LINE", content: "Someone just mentioned, casually, that they've traced the second line to a number that's still active tonight. It wasn't you who found it." },
    ],
    importantClues: [{ id: "clue-ext-02-a", text: "Is using a name that isn't theirs." }],
  },
  {
    id: "extended-03",
    name: "THE BARTENDER",
    tier: "EXTENDED",
    factionId: "faction-outsiders",
    costumeSuggestion: "Whatever this bar's actual staff wear — you blend in on purpose.",
    accentColor: { name: "Apron Brown", hex: "#4a3528" },
    publicBio: "Working the private event tonight. Has heard more tonight than anyone's noticed.",
    secret: "You overheard a tense, quiet conversation by the bar at 20:50 and you're not sure whose voices they were.",
    whatYouKnow: "You know two people argued, briefly and quietly, right around the time the spare key went missing.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether \"the help\" talking is going to cause you trouble." },
      { type: "SECRET", text: "Figure out whose voices you actually heard." },
      { type: "SOCIAL", text: "Get a decent tip out of this chaos regardless." },
    ],
    relationships: [
      { characterId: "core-02", label: "Served them a drink around 20:50.", note: "They seemed distracted.", revealPhase: 4 },
      { characterId: "core-07", label: "Chatted briefly when they stepped outside.", note: "Nice enough, talked about stars for too long.", revealPhase: 4 },
    ],
    phaseReveals: [
      { phase: 6, title: "THE PIN", content: "Thinking back to 20:50, the person you served was fidgeting with something on their lapel the whole time they waited for their drink — a small red pin. You didn't think about it again until now." },
    ],
    importantClues: [{ id: "clue-ext-03-a", text: "Overheard a tense conversation around 20:50." }, { id: "clue-ext-03-b", text: "Noticed the same red lapel pin on the person they served at 20:50." }],
  },
  {
    id: "extended-04",
    name: "THE PHOTOGRAPHER",
    tier: "EXTENDED",
    factionId: "faction-outsiders",
    costumeSuggestion: "Camera around the neck, practical all-black.",
    accentColor: { name: "Ash Grey", hex: "#55555c" },
    publicBio: "Hired to document the party. Has been quietly everywhere all night.",
    secret: "You have a photo from 21:10 that shows who was near the private room, and you haven't looked at it closely yet.",
    whatYouKnow: "You know exactly where you were standing, and pointing your camera, at almost every point tonight.",
    objectives: [
      { type: "PRIMARY", text: "Actually go back and look at your own photos from around 21:10." },
      { type: "SECRET", text: "Decide who gets to see that photo first." },
      { type: "SOCIAL", text: "Get someone to pose for a photo despite everything going on." },
    ],
    relationships: [
      { characterId: "core-12", label: "Hired through her, technically.", note: "She's been checking in on you a lot tonight.", revealPhase: 4 },
      { characterId: "core-09", label: "Took a candid of them earlier that felt oddly tense.", note: "", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 8, title: "THE 21:10 PHOTO", content: "You finally look at the photo. It's blurry, but there's a figure near the private room's door, right before everything happened — dressed head to toe in muted grey, nothing that stands out. Which is somehow the strangest part." },
    ],
    importantClues: [{ id: "clue-ext-04-a", text: "Has an unreviewed photo from right before the murder." }, { id: "clue-ext-04-b", text: "The figure in the photo is dressed in deliberately unremarkable grey." }],
  },
  {
    id: "extended-05",
    name: "THE EX-INTERN",
    tier: "EXTENDED",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Dressed a notch above everyone else, trying to prove something.",
    accentColor: { name: "Burnt Orange", hex: "#a0552a" },
    publicBio: "Used to intern for Subject Zero. Left on bad terms. Came tonight anyway.",
    secret: "You were let go six months ago over something you still think was unfair, and you've been quietly badmouthing the company since.",
    whatYouKnow: "You know Subject Zero and her partner's business has been in worse financial shape than anyone's letting on.",
    objectives: [
      { type: "PRIMARY", text: "Find someone to finally validate that your firing was unfair." },
      { type: "SECRET", text: "Keep anyone from connecting your bitterness to anything that happened tonight." },
      { type: "SOCIAL", text: "Make at least one new connection tonight that has nothing to do with your old job." },
    ],
    relationships: [
      { characterId: "core-01", label: "Used to work under her.", note: "Mixed feelings, mostly hers.", revealPhase: 2 },
      { characterId: "core-11", label: "You've quietly talked to them about a job before.", note: "Nothing's come of it yet.", revealPhase: 6 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-ext-05-a", text: "Knows the business was in worse shape than people think." }],
  },
  {
    id: "extended-06",
    name: "THE NEIGHBOR",
    tier: "EXTENDED",
    factionId: "faction-outsiders",
    costumeSuggestion: "Casual, clearly dressed up a little more than they usually would.",
    accentColor: { name: "Dusty Blue", hex: "#5a7088" },
    publicBio: "Lives down the hall from Subject Zero. Nice enough, a little too observant.",
    secret: "You've noticed someone visiting Subject Zero's place late at night, twice this month, and never mentioned it to anyone.",
    whatYouKnow: "You know Subject Zero has had an unfamiliar visitor at odd hours recently.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether what you saw matters now." },
      { type: "SECRET", text: "Figure out if you'd even recognize that visitor again in this room." },
      { type: "SOCIAL", text: "Get someone else to bring up the topic first so you don't have to." },
    ],
    relationships: [
      { characterId: "core-10", label: "Waves hello in the hallway, nothing more.", note: "", revealPhase: 4 },
      { characterId: "core-04", label: "Something about her is familiar, you just can't place it.", note: "", revealPhase: 8 },
    ],
    phaseReveals: [
      { phase: 6, title: "THE VISITOR", content: "You think back harder. The visitor's build and height match someone in this room. You're not ready to say who yet." },
    ],
    importantClues: [{ id: "clue-ext-06-a", text: "Noticed an unfamiliar late-night visitor to Subject Zero's place twice this month." }],
  },
  {
    id: "extended-07",
    name: "THE COUSIN",
    tier: "EXTENDED",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Family resemblance to The Sibling, dressed a little more casually.",
    accentColor: { name: "Pale Gold", hex: "#c2b280" },
    publicBio: "Subject Zero's cousin. Close as kids, drifted apart as adults, trying to reconnect tonight.",
    secret: "You borrowed money from Subject Zero two years ago and never paid it back. Nobody else in the family knows.",
    whatYouKnow: "You know Subject Zero never brought it up again, not once, which somehow made it worse.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether tonight is finally the night to pay her back, even though you can't anymore." },
      { type: "SECRET", text: "Keep The Sibling from finding out about the loan." },
      { type: "SOCIAL", text: "Reconnect properly with at least one family member tonight." },
    ],
    relationships: [
      { characterId: "core-10", label: "Your sibling's close friend growing up.", note: "Still a little intimidated by them.", revealPhase: 2 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-ext-07-a", text: "Owes Subject Zero money that will now never be repaid." }],
  },
  {
    id: "extended-08",
    name: "THE COLLEAGUE",
    tier: "EXTENDED",
    factionId: "faction-inner-circle",
    costumeSuggestion: "Office-casual, clearly came straight from work.",
    accentColor: { name: "Office Navy", hex: "#2a3550" },
    publicBio: "Works adjacent to Subject Zero's inner circle. Friendly, chatty, knows a little about everyone.",
    secret: "You've been quietly collecting office gossip for months and you're sitting on more of it than you've let on tonight.",
    whatYouKnow: "You know The Fixer has been unusually busy \"handling things\" for the business this past week.",
    objectives: [
      { type: "PRIMARY", text: "Find out what The Fixer has actually been handling." },
      { type: "SECRET", text: "Keep people from realizing how much you already know about everyone here." },
      { type: "SOCIAL", text: "Get someone to tell you something you don't already know, for once." },
    ],
    relationships: [
      { characterId: "core-12", label: "Works near her, hears things.", note: "You like her more than she probably realizes.", revealPhase: 2 },
      { characterId: "core-04", label: "Polite small talk, nothing more.", note: "You ask one too many questions, you think.", revealPhase: 8 },
      { characterId: "core-11", label: "A contact from a different company.", note: "Useful to keep in touch with.", revealPhase: 4 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-ext-08-a", text: "Knows The Fixer has been unusually busy this week." }],
  },

  // -------------------------------------------------------------- OPTIONAL --
  {
    id: "optional-01",
    name: "THE WITNESS",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Casual party wear, a single unusual accessory (your choice).",
    accentColor: { name: "Electric Violet", hex: "#7a3ff0" },
    publicBio: "A friend of a friend. Mostly here for the free drinks.",
    secret: "You overheard something at 21:13 you haven't told anyone.",
    whatYouKnow: "You know exactly who was standing outside the private room at 21:13.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether to tell anyone what you saw at 21:13." },
      { type: "SECRET", text: "Stay out of the investigation entirely if possible." },
      { type: "SOCIAL", text: "Get two different people to each think you told only them." },
    ],
    relationships: [
      { characterId: "core-03", label: "A source, once.", note: "You're avoiding them tonight.", revealPhase: 2 },
      { characterId: "core-07", label: "You were both outside around the same time.", note: "Neither of you have compared notes yet.", revealPhase: 6 },
    ],
    phaseReveals: [
      { phase: 4, title: "WHAT YOU SAW", content: "You saw someone leave the private room at 21:13 wiping their hands on a napkin. You didn't see their face — but you noticed a small red pin on their lapel, catching the light for just a second." },
    ],
    importantClues: [{ id: "clue-opt-01-a", text: "Witnessed someone leaving the room at 21:13." }, { id: "clue-opt-01-b", text: "Saw a red pin on their lapel, though not their face." }],
  },
  {
    id: "optional-02",
    name: "THE NEWBIE",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Dressed slightly wrong for the vibe, endearingly.",
    accentColor: { name: "Mismatched Yellow", hex: "#d4c43a" },
    publicBio: "Just started hanging around this friend group. Doesn't know most of the history yet.",
    secret: "You're quietly taking mental notes on everyone's relationships tonight, mostly out of nerves.",
    whatYouKnow: "You know less than everyone else here, and you're more observant about it than people expect.",
    objectives: [
      { type: "PRIMARY", text: "Figure out who actually likes who in this group, fast." },
      { type: "SECRET", text: "Don't let anyone realize how little you actually know." },
      { type: "SOCIAL", text: "Get properly \"adopted\" by the group before the night's over." },
    ],
    relationships: [
      { characterId: "core-06", label: "Has appointed themselves your guide tonight.", note: "You didn't ask for this, but it's kind of nice.", revealPhase: 2 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-02-a", text: "Has been quietly observing everyone's dynamics tonight." }],
  },
  {
    id: "optional-03",
    name: "THE SKEPTIC",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Deliberately the least costumed person in the room.",
    accentColor: { name: "Plain Grey", hex: "#6a6a70" },
    publicBio: "Thinks this whole ORACLE thing is a bit, and says so, loudly, to anyone who'll listen.",
    secret: "You're quietly a little rattled by how specific some of ORACLE's messages have been tonight.",
    whatYouKnow: "You know you've seen at least one ORACLE message that referenced something you're sure you never told anyone.",
    objectives: [
      { type: "PRIMARY", text: "Prove, out loud, that ORACLE is just someone typing on a phone." },
      { type: "SECRET", text: "Figure out how ORACLE knew something you never said." },
      { type: "SOCIAL", text: "Get at least one person to admit they're a little freaked out too." },
    ],
    relationships: [
      { characterId: "core-05", label: "Thinks her whole thing is nonsense.", note: "Has said so, to her face, more than once.", revealPhase: 0 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-03-a", text: "ORACLE said something it shouldn't have been able to know." }],
  },
  {
    id: "optional-04",
    name: "THE BELIEVER",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Leaning fully into the mystical theme, more than anyone asked for.",
    accentColor: { name: "Cosmic Purple", hex: "#5a2f8a" },
    publicBio: "Has decided ORACLE is real, in the magical sense, and will not be talked out of it tonight.",
    secret: "You've started making decisions tonight based on what you think ORACLE \"wants,\" and you know that's a little much.",
    whatYouKnow: "You know The Tarot Reader seems spooked by something tonight, and you've decided it's destiny.",
    objectives: [
      { type: "PRIMARY", text: "Get ORACLE to \"answer\" you directly about something personal." },
      { type: "SECRET", text: "Admit to yourself, quietly, that you might be taking this too far." },
      { type: "SOCIAL", text: "Convert at least one skeptic tonight." },
    ],
    relationships: [
      { characterId: "core-05", label: "You take her readings far too seriously.", note: "She finds it a little exhausting.", revealPhase: 4 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-04-a", text: "Believes ORACLE is genuinely supernatural." }],
  },
  {
    id: "optional-05",
    name: "THE EX-FRIEND",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Dressed well, holding themselves slightly apart from the room.",
    accentColor: { name: "Forest Green", hex: "#2f5c3f" },
    publicBio: "Had a falling-out with Subject Zero years ago that never really healed. Surprised to be invited.",
    secret: "You almost said no to coming tonight. You still don't fully know why you said yes.",
    whatYouKnow: "You know the real reason you two stopped speaking, and nobody else here does.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether tonight changes anything about how you feel." },
      { type: "SECRET", text: "Keep the real reason for the falling-out to yourself." },
      { type: "SOCIAL", text: "Have one honest conversation about Subject Zero with someone who actually knew her." },
    ],
    relationships: [
      { characterId: "core-10", label: "Hasn't spoken to them properly in years.", note: "Tonight's made that strange to ignore.", revealPhase: 6 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-05-a", text: "Had an unresolved falling-out with Subject Zero years ago." }],
  },
  {
    id: "optional-06",
    name: "THE DESIGNER",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Impeccable personal style, probably over-dressed on purpose.",
    accentColor: { name: "Signature Coral", hex: "#d46a5a" },
    publicBio: "Did the branding for Subject Zero's company. Takes it personally when people don't notice good design.",
    secret: "You've noticed the ORACLE interface tonight uses a typeface and color palette you didn't design — someone else built this, a while ago.",
    whatYouKnow: "You know ORACLE's visual identity predates anything you were ever shown or asked to work on.",
    objectives: [
      { type: "PRIMARY", text: "Figure out who actually designed ORACLE's look, since it wasn't you." },
      { type: "SECRET", text: "Decide whether that's worth mentioning to anyone tonight." },
      { type: "SOCIAL", text: "Get someone to compliment your actual work, for once, tonight." },
    ],
    relationships: [
      { characterId: "core-12", label: "Has worked with her on company materials before.", note: "Professional, a little distant.", revealPhase: 4 },
    ],
    phaseReveals: [
      { phase: 6, title: "SOMEONE ELSE BUILT THIS", content: "You're sure now: ORACLE's look is years old, polished by someone who had a lot of time to get it right. That wasn't a weekend project." },
    ],
    importantClues: [{ id: "clue-opt-06-a", text: "Recognizes ORACLE's design as older and more refined than a new project." }],
  },
  {
    id: "optional-07",
    name: "THE MUSICIAN",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Whatever you'd actually wear to play a set tonight.",
    accentColor: { name: "Stage Purple", hex: "#6a2f6a" },
    publicBio: "Providing the music tonight. Positioned to see the whole room from the small stage or DJ corner.",
    secret: "You stopped the music for about ninety seconds right around the time everything went wrong, and you're not sure anyone noticed the gap.",
    whatYouKnow: "You know who was near the bar and who wasn't, roughly, because you watch the room out of habit while playing.",
    objectives: [
      { type: "PRIMARY", text: "Remember exactly who was missing from the room during that ninety-second gap." },
      { type: "SECRET", text: "Figure out why you stopped playing right then — was it you, or did something make you stop?" },
      { type: "SOCIAL", text: "Get a request tonight for a song you actually like." },
    ],
    relationships: [
      { characterId: "extended-03", label: "Works the same events often.", note: "Friendly, professional shorthand.", revealPhase: 2 },
    ],
    phaseReveals: [
      { phase: 6, title: "THE GAP", content: "You check your own set list times. There's a ninety-second gap around 21:10 you don't remember creating." },
    ],
    importantClues: [{ id: "clue-opt-07-a", text: "Noticed a ninety-second gap in their own set right when it mattered." }],
  },
  {
    id: "optional-08",
    name: "THE ROOMMATE",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Casual, clearly borrowed something from whoever they live with.",
    accentColor: { name: "Borrowed Beige", hex: "#b8a888" },
    publicBio: "Lives with one of tonight's other guests. Along for the ride, a little out of their depth.",
    secret: "Your roommate has been acting strange all week, and you brushed it off as work stress until tonight.",
    whatYouKnow: "You know your roommate got a phone call two nights ago that left them visibly shaken, and wouldn't say who it was from.",
    objectives: [
      { type: "PRIMARY", text: "Figure out who called your roommate two nights ago." },
      { type: "SECRET", text: "Decide whether to bring this up in front of other people tonight." },
      { type: "SOCIAL", text: "Get your roommate to actually tell you what's going on, for once." },
    ],
    relationships: [
      { characterId: "core-02", label: "Your roommate.", note: "You've never seen them this on edge before.", revealPhase: 2 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-08-a", text: "Their roommate got a shaking phone call two nights ago." }],
  },
  {
    id: "optional-09",
    name: "THE INVESTOR",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Understated, expensive, deliberately unremarkable.",
    accentColor: { name: "Deep Navy", hex: "#1a2a44" },
    publicBio: "A small stakeholder in Subject Zero's business. Here to keep an eye on things, mostly.",
    secret: "You've been quietly asking around about the company's finances tonight, more pointedly than social niceties allow.",
    whatYouKnow: "You know the business has missed a filing deadline this month that nobody's explained to you yet.",
    objectives: [
      { type: "PRIMARY", text: "Get a straight answer tonight about the missed filing." },
      { type: "SECRET", text: "Keep your own concerns from spooking the rest of the room." },
      { type: "SOCIAL", text: "Get invited into a conversation you weren't technically part of." },
    ],
    relationships: [
      { characterId: "core-11", label: "A rival has been circling you tonight too.", note: "You'd rather they didn't compare notes.", revealPhase: 6 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-09-a", text: "Knows the business missed a filing deadline this month." }],
  },
  {
    id: "optional-10",
    name: "THE LATECOMER",
    tier: "OPTIONAL",
    factionId: "faction-outsiders",
    costumeSuggestion: "Looks like they rushed to get here, slightly dishevelled on purpose.",
    accentColor: { name: "Rust", hex: "#8a4a2a" },
    publicBio: "Arrived well after everyone else. Hasn't quite explained why.",
    secret: "You were somewhere you don't want to explain right before you got here, and it has nothing to do with tonight — you just don't want to say where.",
    whatYouKnow: "You know people are already assuming your lateness means something it doesn't.",
    objectives: [
      { type: "PRIMARY", text: "Decide whether to explain where you really were before tonight." },
      { type: "SECRET", text: "Let people keep assuming the wrong thing, if it's easier." },
      { type: "SOCIAL", text: "Get through the night without anyone directly asking you to explain yourself." },
    ],
    relationships: [
      { characterId: "optional-02", label: "Arrived around the same time, separately.", note: "Neither of you has mentioned it to the other.", revealPhase: 4 },
    ],
    phaseReveals: [],
    importantClues: [{ id: "clue-opt-10-a", text: "Arrived suspiciously late with an unexplained reason." }],
  },
];

export function getCharacter(id: string | null | undefined): Character | undefined {
  if (!id) return undefined;
  return CHARACTERS.find((c) => c.id === id);
}

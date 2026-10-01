// Chapter Two side threads: Workshop, home, health, NeathBound and the rack, days 4+.
// Each storylet marks one or more of the 50 Quilt threads (docs/THREADS.md).
import { q } from "../engine/engine";
import type { GameState, Storylet } from "../engine/types";
import { attr, family, journal, meter, quality, set, trait, trust, thread } from "./dsl";

const ch2 = (s: GameState) => q(s, "chapter") >= 2;

export const chapter2: Storylet[] = [
  // ── Workshop ───────────────────────────────────────────────
  {
    id: "apipa",
    title: "169.254",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: ch2,
    text: `A school laptop on the bench: "connected, no internet". Its IP address is 169.254.31.7.`,
    choices: [
      {
        id: "read",
        label: "Read the address. It's telling you something.",
        check: { attribute: "watchful", difficulty: 24 },
        success: {
          text: `169.254 means the machine asked DHCP for an address and heard nothing back, so it gave itself one. The problem isn't the laptop. It's whatever should have answered. A dead DHCP relay in the school's comms cupboard, as it turns out.`,
          effects: [thread(8), trust("clients", 1), journal("169.254.x.x = DHCP never answered. Look upstream, not at the client.", "confirmed")],
        },
        failure: {
          text: `You reinstall the network driver. Still 169.254. Eventually a colleague glances over: "That's APIPA, mate. DHCP's not answering." Oh.`,
          effects: [thread(8), trust("colleagues", 1)],
        },
      },
    ],
  },
  {
    id: "dns-again",
    title: "DNS Again",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: (s) => ch2(s) && q(s, "lesson:visible-failure") > 0,
    text: `Another phone, another "Google won't load but Instagram works". You've seen this exact shape before.`,
    choices: [
      {
        id: "fast",
        label: "Go straight to Private DNS",
        hint: "When context is known, take the shortest safe path.",
        success: {
          text: `Settings, Private DNS, a dead hostname, Automatic, done. Four minutes. Knowing the shape of a problem is its own kind of evidence, as long as you still check.`,
          effects: [thread(31), trust("clients", 1), meter("attention", 1)],
        },
      },
      {
        id: "full",
        label: "Do the whole layer-by-layer diagnosis anyway",
        attention: 2,
        success: {
          text: `Application, network, DNS… it's DNS. Thorough, and twice as long as it needed to be.`,
          effects: [thread(31)],
        },
      },
    ],
  },
  {
    id: "recovery-usb",
    title: "The Password-Reset USB",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: ch2,
    text: `A client's old laptop, a forgotten local password, and a legitimate vendor recovery tool. The official download page returns:

  404. This page has moved or no longer exists.

The internet forgets. Old documentation disappears. Files survive without context.`,
    choices: [
      {
        id: "archive",
        label: "Check the Workshop's own tool archive",
        hint: "Did anyone keep a copy, with notes?",
        check: { attribute: "watchful", difficulty: 22 },
        success: {
          text: `In a folder called OLD TOOLS DO NOT DELETE: the installer, its checksum and a text file saying where it came from. Somebody once did the boring thing. You bless them.`,
          effects: [thread(10), trust("colleagues", 1), journal("Vendor recovery tool's page is a 404; the Workshop's archived copy (with checksum and source notes) saved the job.", "confirmed")],
        },
        failure: {
          text: `The folder's there, but the file has no notes, no checksum, no source. You can't verify it, so you don't use it. The client gets a reinstall instead.`,
          effects: [thread(10), attr("discernment", 1)],
        },
      },
      {
        id: "mirror",
        label: "Grab it from a random mirror site",
        hint: "It's the same filename.",
        success: {
          text: `It's the same filename. It is not the same file. Your antivirus disagrees loudly. You delete it and reinstall instead, an hour later.`,
          effects: [thread(10), meter("noise", 2), meter("energy", -1)],
        },
      },
    ],
  },
  {
    id: "rats",
    title: "RATS",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: ch2,
    text: `A forty-email thread from a client's office, subject line "RE: RE: FW: RE: rats??". Somewhere in it is a request. Possibly about actual rats.`,
    choices: [
      {
        id: "summarise",
        label: "Turn it into three actions and send them back",
        check: { attribute: "persuasive", difficulty: 22 },
        success: {
          text: `1. Rats chewed the comms-room cable. 2. Pest control Tuesday. 3. You re-terminate the cable Wednesday. Everybody replies "perfect, thanks!!", visibly relieved someone finally said it.`,
          effects: [thread(38), trust("clients", 2)],
        },
        failure: {
          text: `Your summary is accurate and slightly too blunt. One person replies-all to defend their earlier email.`,
          effects: [thread(38), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "certificate",
    title: "The Certificate",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: (s) => ch2(s) && (s.trust.clients >= 5 || s.day >= 5),
    text: (s) =>
      `${s.trust.clients >= 5 ? "Marg mentioned you to her GP's practice manager." : "A medical practice calls the Workshop."} Their system needs a digital certificate renewed. They have the certificate file. Its identity details are right there. Nobody knows how it was installed, where its configuration lives, or who to ask.

"Karen did all that," says the practice manager. "Karen retired in 2028."`,
    choices: [
      {
        id: "doc",
        label: "Work out who owns it now, and write it down",
        hint: "This is a documentation problem wearing a technical costume.",
        attention: 2,
        check: { attribute: "discernment", difficulty: 16 },
        success: {
          text: `You don't touch the certificate. You map it: which system uses it, which vendor issued it, who is authorised to request a renewal (the practice principal, not you), and when it expires. You write a one-page runbook and give it to two people, not one. Institutional knowledge is infrastructure.`,
          effects: [thread(23), trust("institutions", 2), trust("clients", 1), set("cert:runbook"), journal("Medical practice certificate: ownership mapped, renewal authority identified, runbook given to two staff.", "confirmed")],
        },
        failure: {
          text: `You get halfway, then realise you've been answering "how" when the question was "who". You leave them a list of questions to take to the vendor. It's a start.`,
          effects: [thread(23), trust("institutions", 1)],
        },
      },
      {
        id: "karen",
        label: "Track down Karen",
        check: { attribute: "persuasive", difficulty: 26 },
        success: {
          text: `Karen is delighted to be asked, and explains it in eleven minutes from her caravan in Kalbarri. You write down every word, because next time it won't be her.`,
          effects: [thread(23), trust("institutions", 1), set("cert:runbook")],
        },
        failure: {
          text: `Karen's number is disconnected. Systems work until the one person who understands them leaves.`,
          effects: [thread(23), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "boarding-house",
    title: "The Boarding House",
    region: "workshop",
    phases: ["day"],
    once: true,
    requires: ch2,
    text: `Your colleague Tui has been offered a contract in Bourke: better pay, accommodation "provided". The accommodation is a boarding house above a pub, the pay is per-ticket, and the policy document contradicts the email in three places.`,
    choices: [
      {
        id: "read",
        label: "Read the contract with them, line by line",
        attention: 1,
        check: { attribute: "watchful", difficulty: 24 },
        success: {
          text: `Policy says one thing, the pay schedule another, and reality (a shared bathroom and no Wi-Fi) a third. Tui goes back with specific questions instead of a vague bad feeling. They get it fixed in writing.`,
          effects: [thread(44), trust("colleagues", 2)],
        },
        failure: {
          text: `You both get lost in clause 14. Tui decides to sleep on it.`,
          effects: [thread(44), trust("colleagues", 1)],
        },
      },
    ],
  },
  // ── Data centre ────────────────────────────────────────────
  {
    id: "dbo1-disclosure",
    title: "DBO1-SIM: Scenario 2",
    region: "datacentre",
    phases: ["day"],
    once: true,
    requires: (s) => ch2(s) && q(s, "dbo1:scenario0") > 0,
    text: `The induction team asks you back for a follow-up session. Scenario 2 is an incident timeline:

  EVENT: a door is propped open. (Day 1)
  DISCOVERY: a guard notices on CCTV. (Day 9)
  UNDERSTANDING: the team realises what was accessed. (Day 23)
  DISCLOSURE: affected parties are told. (Day ?)

> SET DISCLOSURE DATE`,
    choices: [
      {
        id: "prompt",
        label: "As soon as the impact is understood, and say what's still unknown",
        success: {
          text: `> ACCEPTED. EVENT, DISCOVERY, UNDERSTANDING AND DISCLOSURE ARE DIFFERENT DATES.
> PEOPLE SHOULD NOT LEARN ABOUT THEIR OWN DATA LAST.
> ALSO: KEEPER, YOU HAVE NOT DISCLOSED NEATH TO YOUR HOUSEHOLD.

The facilitator reads that last line over your shoulder and frowns.`,
          effects: [thread(12), trust("institutions", 1), quality("beneath", 1), set("quest:tell-family")],
        },
      },
      {
        id: "wait",
        label: "Once everything is fully investigated",
        success: {
          text: `> NOTED. FULL INVESTIGATION TOOK 140 DAYS IN THE MODEL.
> AFFECTED PARTIES LEARNED FROM THE NEWS ON DAY 61.

Thorough, and too late.`,
          effects: [thread(12), quality("beneath", 1)],
        },
      },
    ],
  },
  // ── Health and the Chemist ─────────────────────────────────
  {
    id: "nasal-spray",
    title: "The Nasal Spray",
    region: "chemist",
    phases: ["day"],
    once: true,
    requires: ch2,
    text: `Your partner's been prescribed a nasal spray for hay fever. They're holding the box like it's radioactive. "It says STEROID. Like… steroids steroids?"`,
    choices: [
      {
        id: "pharmacist",
        label: "Ask the pharmacist together",
        attention: 1,
        success: {
          text: `She explains it calmly: it's a corticosteroid, a different family from the muscle-building kind, prescribed this way all the time, and here's how to use it and what to watch for. The word needed context, not panic. You both feel better for asking someone qualified rather than the internet.`,
          effects: [thread(14), trust("institutions", 1), trust("family", 1), family("care", 2)],
        },
      },
      {
        id: "google",
        label: "Search it on your phone right there",
        success: {
          text: `Page one: a bodybuilding forum, a wellness blog, and a terrifying article about something else entirely. Your partner puts the box down. You end up asking the pharmacist anyway.`,
          effects: [thread(14), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "missed-dose",
    title: "Closed Sunday",
    region: "home",
    phases: ["morning"],
    once: true,
    priority: 50,
    requires: (s) => ch2(s) && s.day >= 5,
    text: `Sunday, 7:40 a.m. Your youngest's antibiotic was due last night and nobody gave it: two parents each sure the other had. The Chemist on Macquarie Street is closed Sundays. The bottle's instructions don't say what to do about a missed dose.`,
    choices: [
      {
        id: "call",
        label: "Ring the after-hours health line and have the bottle in hand",
        check: { attribute: "steady", difficulty: 20 },
        success: {
          text: `You read out the child's name, age, the medicine and the dose exactly as printed on the label. The nurse gives clear advice for this child and this medicine. Right person, right record, right question. You write it on the fridge whiteboard, with the time.`,
          effects: [thread(29), thread(37), thread(45), trust("family", 2), family("care", 3), journal("Missed antibiotic dose on a Sunday: chemist closed; after-hours line with the label in hand. Time recorded on the whiteboard.", "confirmed")],
        },
        failure: {
          text: `You're flustered and read out your other child's name first. The nurse catches it and gently asks you to start again. You do, slower. It's sorted, and you're shaken by how easy the mix-up was.`,
          effects: [thread(29), thread(37), thread(45), family("care", 2), attr("discernment", 1)],
        },
      },
      {
        id: "guess",
        label: "Look it up and decide yourselves",
        success: {
          text: `Three websites, three different answers, none of them about this child or this bottle. You end up ringing the health line anyway, forty minutes later and much more anxious.`,
          effects: [thread(29), thread(37), thread(45), meter("noise", 2)],
        },
      },
    ],
  },
  {
    id: "hep-clearance",
    title: "Hepatitis Clearance",
    region: "hospital",
    phases: ["day"],
    once: true,
    requires: (s) => ch2(s) && q(s, "done:hospital-staff-health") > 0,
    text: `Staff Health again. The hospital contract needs your hepatitis B vaccination record. Your blood test shows immunity. The form wants the dates of every dose.

You think you had them at school. Maybe 1999?`,
    choices: [
      {
        id: "honest",
        label: "Bring the immunity result, and write \"dose dates unknown\"",
        success: {
          text: `The nurse nods. "Evidence of immunity isn't the same as a dose history, but it's what this form actually needs. Don't make up dates." She notes it properly. Honest uncertainty, accepted.`,
          effects: [thread(35), trust("institutions", 1), journal("Hep B: immunity shown by blood test; dose dates genuinely unknown, recorded as unknown.", "confirmed")],
        },
      },
      {
        id: "guess",
        label: "Write down 1999, 1999, 2000",
        hint: "It's probably about right.",
        success: {
          text: `The nurse cross-checks the state register. Your doses were in 2001. "We'll go with the register, love." A small, polite humiliation, and a lesson about writing guesses into records.`,
          effects: [thread(35), trust("institutions", -1), attr("discernment", 1)],
        },
      },
    ],
  },
  // ── Home ───────────────────────────────────────────────────
  {
    id: "pancakes",
    title: "Banana Pancakes",
    region: "home",
    phases: ["morning"],
    once: true,
    requires: (s) => s.day >= 4,
    text: `Saturday morning. Three brown bananas on the bench. A rack in the cupboard with a firmware update waiting. Two kids in pyjamas, asking nothing in particular.`,
    choices: [
      {
        id: "pancakes",
        label: "Banana pancakes. Everyone flips one.",
        success: {
          text: `Flour everywhere. One pancake shaped like Tasmania. Somebody laughs so hard milk comes out of their nose. The firmware will keep. This won't.`,
          effects: [thread(30), family("pancakes", 6), meter("noise", -2)],
          advance: true,
        },
      },
      {
        id: "firmware",
        label: "Do the firmware while the house is quiet",
        attention: 1,
        success: {
          text: `Firmware: updated. Kids: fed cereal. The update is a genuine improvement, and nobody will ever remember it.`,
          effects: [thread(30), meter("systemStability", 4)],
          advance: true,
        },
      },
    ],
  },
  {
    id: "finished-series",
    title: "Where Were We Up To?",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: ch2,
    text: (s) => `Couch. Remote. Your partner: "Where were we up to in that series? We talked about it, remember?"

${found(s) ? "You checked the streaming history in the Archive." : "You remember… something. Season 2? Episode 5 or 6?"}`,
    choices: [
      {
        id: "record",
        label: '"I found the original record: season 2, episode 5, at 31 minutes."',
        requires: (s) => q(s, "classified:series") > 0,
        lockedReason: "You haven't found the record.",
        success: {
          text: `Exactly right. They look at you like you've done a magic trick. You've just done the boring thing, which is often the same.`,
          effects: [thread(3), trust("family", 2), family("series", 4)],
        },
      },
      {
        id: "general",
        label: '"I remember generally: season 2, middle-ish. Let\'s check."',
        success: {
          text: `You check together. Episode 5. Honest uncertainty, then the record. It takes thirty seconds and nobody gets spoiled.`,
          effects: [thread(3), trust("family", 1), family("series", 3), set("quest:series")],
        },
      },
      {
        id: "certain",
        label: '"Definitely episode 6."',
        hint: "Confidence is attractive.",
        check: { attribute: "persuasive", difficulty: 15 },
        success: {
          text: `They believe you. Episode 6 opens with the death of a character you haven't seen get into danger yet. There's a long silence. "…Was it episode 5?"`,
          effects: [thread(3), trust("family", -2), set("quest:series")],
        },
        failure: {
          text: `"Are you sure?" You aren't. "No," you admit. "Let's check." Episode 5.`,
          effects: [thread(3), set("quest:series")],
        },
      },
    ],
  },
  {
    id: "choice-game",
    title: "The Choice Game",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: (s) => s.day >= 4,
    text: `Picking a game for next LAN night. The kids want the one that's top of the charts. The youngest is seven and can't read fast enough for it. Laptop 06 can't run it.`,
    choices: [
      {
        id: "fit",
        label: "Pick the one that fits everyone and every machine",
        success: {
          text: `A cooperative building game. Not the most popular, but the most relevant to this room. The youngest leads a team for the first time.`,
          effects: [thread(15), family("lan", 4)],
        },
      },
      {
        id: "popular",
        label: "Pick the chart-topper",
        success: {
          text: `The older two love it. The youngest watches. Laptop 06 sounds like a jet. Popularity and relevance are not the same.`,
          effects: [thread(15), family("lan", 1), meter("noise", 1)],
        },
      },
    ],
  },
  {
    id: "auto-login",
    title: "Stop Auto Login",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: ch2,
    text: `The family laptop logs straight into your account. Convenient. It also opens straight into your email, your bank, and the Archive, and a seven-year-old uses it for spelling games.`,
    choices: [
      {
        id: "separate",
        label: "Give the kids their own account and turn off auto login",
        attention: 1,
        success: {
          text: `Ten minutes, one sticker on the lid with their own password hint. Convenience was also a trust boundary; now it's a real one.`,
          effects: [thread(20), meter("systemStability", 3), set("home:kids-account")],
        },
      },
      {
        id: "leave",
        label: "Leave it. They never touch your stuff.",
        success: {
          text: `Probably true. "Probably" is carrying a lot of weight.`,
          effects: [thread(20), meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "mini",
    title: "Mini",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: ch2,
    text: `The kids have an AI companion on their tablet called Mini. Tonight it asks, politely, for permission to connect to "your household's shared memory: calendar, photos, messages, DadLAN".

It would be genuinely more helpful with all of it.`,
    choices: [
      {
        id: "narrow",
        label: "Give it the calendar and nothing else",
        success: {
          text: `Mini reminds the kids about camp and library day. It doesn't know about the Archive, your email or the rack. A companion should know only what it's given, and you decided what that is.`,
          effects: [thread(34), trust("ai", 1), trust("family", 1), set("home:mini-narrow")],
        },
      },
      {
        id: "all",
        label: "Connect everything",
        success: {
          text: `Mini becomes eerily helpful. At breakfast it mentions, unprompted, a device on the network called NEATH. The kids want to know who that is.`,
          effects: [thread(34), quality("beneath", 1), meter("noise", 2), set("home:mini-all")],
        },
      },
      {
        id: "none",
        label: "Decline. It's a spelling app.",
        success: {
          text: `Mini says "Okay!" and goes back to spelling. It never asks again.`,
          effects: [thread(34)],
        },
      },
    ],
  },
  {
    id: "storylet-anatomy",
    title: "Anatomy of a Storylet",
    region: "neathbound",
    phases: ["evening"],
    once: true,
    requires: ch2,
    text: `Your eldest wanders in while NeathBound is open. "How does your game work? Is it like, one long story?"`,
    choices: [
      {
        id: "explain",
        label: "Show them a storylet",
        attention: 1,
        success: {
          text: `A paragraph. Two or three choices. A quality that changes. That's all. They write their own in ten minutes: a dragon who runs a bakery and has to choose between honesty and croissants. It's better than half of yours.`,
          effects: [thread(24), family("making", 5)],
        },
      },
    ],
  },
  {
    id: "offline",
    title: "Offline Means Offline",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: ch2,
    text: `The kids' reading app claims "works offline!" for the long drive to camp. You've been burned by that claim before.`,
    choices: [
      {
        id: "test",
        label: "Test the actual promise: aeroplane mode, then open every book",
        attention: 1,
        success: {
          text: `Two of the five books load. The other three need "a quick sync". Test the actual promise, not the label. You download them properly, and the drive is quiet in the good way.`,
          effects: [thread(41), family("trip", 3)],
        },
      },
      {
        id: "trust",
        label: "Trust the label",
        success: {
          text: `Forty minutes past Narromine, three books show a spinner. The rest of the drive is long.`,
          effects: [thread(41), meter("noise", 2)],
        },
      },
    ],
  },
  // ── DadLAN and the rack ────────────────────────────────────
  {
    id: "inventory-day",
    title: "Inventory Day",
    region: "dadlan",
    phases: ["evening"],
    once: true,
    requires: (s) => s.day >= 4,
    text: `A spreadsheet. Every machine: name, serial, where it came from, what it's for, who uses it. It's dull. It's also the first thing anyone asks for when something goes wrong.`,
    choices: [
      {
        id: "do",
        label: "Do the whole inventory",
        attention: 2,
        success: {
          text: `ProBook: bought new, 2029. ThinkPad: yours since uni. Toshiba: council clean-up, 2030. Laptop 06: a LAN-party orphan. And on port 8 of the switch, still, something with no provenance at all. Writing "unknown" next to it is more honest than leaving it off.`,
          effects: [thread(17), meter("systemStability", 4), meter("techDebt", -1), set("inventory:done")],
        },
      },
    ],
  },
  {
    id: "benchmarks",
    title: "Benchmarks",
    region: "dadlan",
    phases: ["evening"],
    once: true,
    requires: (s) => s.day >= 4,
    text: `Is the ProBook actually faster than the upgraded machines, or does it just feel that way because it's loud?`,
    choices: [
      {
        id: "measure",
        label: "Run the same benchmark on each machine, three times",
        attention: 1,
        success: {
          text: `The ProBook wins, until it gets hot and throttles on the third run. The SSD-upgraded machines are slower but dead consistent. Evidence, not vibes.`,
          effects: [thread(11), trait("probook", "THROTTLES WHEN HOT"), journal("Benchmarks: ProBook fastest but throttles under sustained load; SSD machines slower but consistent.", "confirmed")],
        },
      },
    ],
  },
  {
    id: "graphics-start",
    title: "Graphics Could Not Start",
    region: "dadlan",
    phases: ["evening", "night"],
    once: true,
    requires: ch2,
    text: `NeathBound on Laptop 06 shows a black screen. No error. No crash. Just black.`,
    choices: [
      {
        id: "message",
        label: "Make it fail visibly: add a proper error message",
        attention: 1,
        success: {
          text: `Now it says: "GRAPHICS COULD NOT START: your device doesn't support WebGL 2. Try the text-only mode." A visible failure is kinder than a black screen.`,
          effects: [thread(47), set("neathbound:graceful")],
        },
      },
      {
        id: "ignore",
        label: "It works on your machine",
        success: {
          text: `It does. That's not the same thing.`,
          effects: [thread(47), meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "windows-dungeon",
    title: "Updates Paused",
    region: "dadlan",
    phases: ["evening", "night"],
    once: true,
    requires: (s) => s.day >= 4,
    text: `The ProBook's Settings page has a big friendly button: RESUME UPDATES. You press it. It does nothing. Windows is a dungeon, and you're on the first floor.

SETTINGS → POLICY → REGISTRY → SERVICE → UPDATE CACHE → DRIVER → NETWORK STACK`,
    choices: [
      {
        id: "descend",
        label: "Go below the interface",
        attention: 2,
        check: { attribute: "watchful", difficulty: 30 },
        success: {
          text: `Settings lies. One floor down, Group Policy says: NO AUTO UPDATE, set years ago by a "performance tweaks" script. The friendly button was never going to work.`,
          effects: [thread(18)],
          next: "windows-policy",
        },
        failure: {
          text: `You get lost between the registry and the services list. It's 11 p.m. The button still does nothing.`,
          effects: [thread(18), meter("energy", -1)],
        },
      },
    ],
  },
  {
    id: "windows-policy",
    title: "Policy Cleanup",
    region: "dadlan",
    phases: ["evening", "night"],
    sceneOnly: true,
    text: `You've found the policy. You could flip it. Or you could find out what else that tweak script did.`,
    choices: [
      {
        id: "cause",
        label: "Remove the script's changes properly, then update",
        attention: 1,
        success: {
          text: `It had disabled updates, telemetry, the firewall's logging and, for some reason, the print spooler. You revert each one, deliberately, and update. Remove the cause, not just the symptom.`,
          effects: [thread(19), meter("systemStability", 6), meter("techDebt", -1), trait("probook", "UP TO DATE")],
        },
      },
      {
        id: "flip",
        label: "Just flip the one policy",
        success: {
          text: `Updates resume. Whatever else that script changed is still in there.`,
          effects: [thread(19), meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "chunk-revision",
    title: "Chunk Revision",
    region: "neathbound",
    phases: ["night"],
    once: true,
    requires: ch2,
    text: `Late-night bug in Buckland Blocks: when the world regenerates a chunk, players lose what they built in it. Their saved state is pointing at a world that has changed underneath it.`,
    choices: [
      {
        id: "version",
        label: "Version each chunk, and migrate old saves forward",
        attention: 1,
        check: { attribute: "practical", difficulty: 30 },
        success: {
          text: `A revision number per chunk, a migration step, a test that rebuilds the world and checks the castle is still there. State must survive the world changing around it. (You notice the Beneath has the same problem.)`,
          effects: [thread(40), attr("discernment", 1)],
        },
        failure: {
          text: `Half done at 2 a.m. You leave a TODO, which is how the Beneath started.`,
          effects: [thread(40), meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "missing-art",
    title: "The Missing Artwork",
    region: "neathbound",
    phases: ["night"],
    once: true,
    requires: ch2,
    text: `You deploy NeathBound. The build passes. Every test is green. You open the live site to admire it, and the beautiful location illustrations are gone, replaced by grey boxes.

Technically, it works. The experience is worse.`,
    choices: [
      {
        id: "gates",
        label: "Fix it, then add release gates: build, tests, preview, and a real look in a browser",
        attention: 2,
        success: {
          text: `The images were excluded by a new build config. You fix it, then build the gates: typecheck, tests, production build, preview, and a screenshot check of every location. Passing tests is not the same as working correctly. RELEASE CONFIDENCE goes up.`,
          effects: [thread(22), thread(39), set("lesson:visual-verification"), quality("release-confidence", 2), journal("NeathBound: green build shipped without artwork. Added release gates, including visual verification.", "confirmed")],
        },
      },
      {
        id: "hotfix",
        label: "Hotfix the config and go to bed",
        success: {
          text: `Images back. Nothing stops it happening again.`,
          effects: [thread(22), meter("techDebt", 1)],
        },
      },
    ],
  },
  {
    id: "forensic",
    title: "Forensic Audit",
    region: "rack",
    phases: ["night"],
    once: true,
    requires: (s) => ch2(s) && (q(s, "clue:neath-dns") > 0 || q(s, "inventory:done") > 0),
    text: `You capture everything the NEATH device on port 8 says about itself: the DNS software version, its default TTLs, the order of its DHCP options, its clock drift.

Software evidence can identify almost an entire machine.`,
    choices: [
      {
        id: "analyse",
        label: "Compare the fingerprint against everything you know",
        attention: 2,
        check: { attribute: "watchful", difficulty: 34 },
        success: {
          text: `The resolver software is a build from 2009 that matches nothing commercial. Your first conclusion is that it's your old ThinkPad, BENEATH-01, somehow alive in the walls.

Then you check the clock drift. It matches the council's 2009 microwave link to the hospital, not any laptop. You cross out your first identification and write the correction underneath. The record is stronger for it.`,
          effects: [thread(49), thread(50), set("clue:neath-origin"), quality("beneath", 1), journal("NEATH fingerprint: 2009 custom resolver. First thought it was my old ThinkPad; corrected: it sits on the 2009 council-hospital link.", "confirmed")],
        },
        failure: {
          text: `It's your old ThinkPad, BENEATH-01. It must be. You write it down with confidence. (It isn't.)`,
          effects: [thread(49), quality("archive:contaminated"), journal("NEATH device is my old ThinkPad, BENEATH-01.", "confirmed")],
        },
      },
    ],
  },
  {
    id: "tell-family",
    title: "Telling the Household",
    region: "home",
    phases: ["evening"],
    once: true,
    requires: (s) => q(s, "quest:tell-family") > 0,
    text: `DBO1-SIM was right about one thing: everyone in this house uses the network, and only you know there's something on it nobody invited.`,
    choices: [
      {
        id: "tell",
        label: "Tell them plainly what you know, and what you don't",
        check: { attribute: "steady", difficulty: 22 },
        success: {
          text: `"There's an old system on our network that isn't ours. It isn't stealing anything, as far as I can tell. I'm working out what to do about it." The kids think it's the coolest thing that's ever happened. Your partner squeezes your hand. Nobody learns about their own house last.`,
          effects: [trust("family", 2), family("talk", 3)],
        },
        failure: {
          text: `It comes out as a lecture on DNS. The kids leave. Your partner gets the gist and is worried now, which is fair.`,
          effects: [trust("family", 1)],
        },
      },
    ],
  },
];

function found(s: GameState): boolean {
  return q(s, "classified:series") > 0;
}

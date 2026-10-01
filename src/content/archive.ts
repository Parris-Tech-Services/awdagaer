// Chapter Two: The Archive (brief §3 "The Archive", §17 search modes, §18 memory, §19 the lost chat).
// Searching finds records; each record must be classified. Correct classification raises
// archive:integrity; wrong ones raise archive:contaminated, which locks folder 2004 until reviewed.
import { q } from "../engine/engine";
import type { Choice, EvidenceStatus, GameState, Storylet } from "../engine/types";
import { attr, journal, meter, quality, set, trust, thread } from "./dsl";

const ERAS = ["2031 (now)", "2020", "2012", "2004"];
export const archiveDepth = (s: GameState) => Math.min(3, q(s, "archive:depth"));
const found = (s: GameState, id: string) => q(s, `record:${id}`) > 0;

const STATUS_LABEL: Record<EvidenceStatus, string> = {
  confirmed: "Mark CONFIRMED",
  probable: "Mark PROBABLE",
  unverified: "Mark UNVERIFIED",
  "false-attribution": "Mark FALSE ATTRIBUTION",
};

interface RecordSpec {
  id: string;
  title: string;
  text: string;
  correct: EvidenceStatus;
  /** Why the correct status is correct; shown after choosing it. */
  right: string;
  /** Shown after any wrong choice. */
  wrong: string;
  /** Journal line for this record (status is the one the player chose). */
  note: string;
  threads: number[];
}

/** Builds the classification scene for one record. */
function classify(r: RecordSpec): Storylet {
  const choices: Choice[] = (Object.keys(STATUS_LABEL) as EvidenceStatus[]).map((status) => ({
    id: status,
    label: STATUS_LABEL[status],
    success:
      status === r.correct
        ? {
            text: r.right,
            effects: [...r.threads.map(thread), quality("archive:integrity"), set(`classified:${r.id}`), journal(r.note, status)],
          }
        : {
            text: r.wrong,
            effects: [...r.threads.map(thread), quality("archive:contaminated"), set(`misfiled:${r.id}`), set(`classified:${r.id}`), journal(r.note, status)],
          },
  }));
  return { id: `record-${r.id}`, title: r.title, region: "archive", phases: ["day", "evening", "night"], sceneOnly: true, text: r.text, choices };
}

const RECORDS: RecordSpec[] = [
  {
    id: "jparris-perth",
    title: "Record: j.parris, 2011",
    text: `KNOWN NAME search: "J Parris". Top result, 2011, an email thread you're cc'd on:

  From: j.parris@westnet.example
  Re: Thursday pennants — Perth Metro Bowls, Division 3
  "Cheers Jonah, see you at Bassendean."

The address looks almost like yours. You have never lived in Perth. You have never played pennants. Your name isn't Jonah.`,
    correct: "false-attribution",
    right: `FALSE ATTRIBUTION. Same initial, same surname, different person. Removing wrong evidence is progress, and now nothing downstream will build on it.`,
    wrong: `You file it. It sits in your Archive, quietly claiming you were once a Division 3 bowler in Perth. Anything built on it will inherit the mistake.`,
    note: "2011 bowls email from j.parris@westnet.example ('Jonah', Perth).",
    threads: [33],
  },
  {
    id: "uni-address",
    title: "Record: Your University Address",
    text: `ACCOUNT search. Your old student address, the one you used from 2007 to 2011. The login history matches your old timetable, and the sent folder has your essays in it.

There's also mail from 2019 onward: enrolment confirmations for someone named Jess, in a degree you never did. The university recycled the address.`,
    correct: "confirmed",
    right: `CONFIRMED, for 2007–2011, and you note the boundary. The address was yours. After 2019 it was Jess's. Digital identities outlive the people using them; a record is only as good as its dates.`,
    wrong: `The status doesn't fit what you found. The pre-2019 mail is verifiably yours; you have the original records. Under-claiming real evidence is a mistake too.`,
    note: "Student address: mine 2007–2011 (original records). Recycled to another student from 2019; later mail is not mine.",
    threads: [32],
  },
  {
    id: "missing-audio",
    title: "Record: The Missing Episode",
    text: `FILE TYPE search: audio. A podcast you co-hosted in 2014, episode 12. The show notes survive. The title survives. The link returns:

  404. NOT FOUND.

The audio is gone. There's a voice-cloning tool on your desktop that could "restore" it from the transcript you half-remember.`,
    correct: "unverified",
    right: `UNVERIFIED: the episode existed, but its contents can't be checked. You keep the notes and the title, and you write "audio lost, not recreated". You don't fabricate what can't be recovered.`,
    wrong: `A neat label on something you can't actually check. Your journal now says more than you know.`,
    note: "Podcast ep. 12 (2014): show notes and title survive; audio is a 404. Not recreated.",
    threads: [42, 10],
  },
  {
    id: "chooky",
    title: "Record: The Chooky Dancers Clip",
    text: `FILE TYPE search: video. A 2007 link your brother sent: the Chooky Dancers doing Zorba the Greek at Elcho Island. The whole family watched it forty times that summer.

The video file itself is gone from your drive. But the email survives: who sent it, when, the title, your mum's reply ("again!!").`,
    correct: "probable",
    right: `PROBABLE: the provenance is solid even though the media is gone. You record who, when and what, and where a copy might still exist. Provenance outlives the file.`,
    wrong: `The status doesn't match the evidence: the media is gone, but the context around it is strong.`,
    note: "2007 Chooky Dancers clip: file lost; provenance (sender, date, title, replies) preserved.",
    threads: [48],
  },
  {
    id: "vale",
    title: "Record: Messages With Dave",
    text: `RELATIONSHIP search. Dave, your LAN-party mate from uni. Four hundred messages, then 2015: nothing. A single forum post from a stranger, years later: "Vale Dave, legend."

No other source. No obituary you can find. No mutual friend you still have a number for.`,
    correct: "unverified",
    right: `UNVERIFIED, written gently. You don't know, and you won't pretend to in either direction. You save his messages somewhere safe. Respecting uncertainty when facts are absent is a kind of respect for him, too.`,
    wrong: `It's a heavier label than one stranger's post can carry. You'll want to revisit this, but carefully.`,
    note: "Dave (uni LAN mate): messages end 2015; one unverified forum post says he passed. Not confirmed.",
    threads: [21],
  },
  {
    id: "series",
    title: "Record: Viewing History",
    text: `SOURCE search: the streaming service's own viewing history export. The series you and your partner were watching: last watched together on 14 March, season 2, episode 5, stopped at 31 minutes.`,
    correct: "confirmed",
    right: `CONFIRMED: this is the original record, not a memory of it. Next time someone asks where you're up to, you don't have to guess.`,
    wrong: `This is the primary source. Treating it as less than that just puts you back to guessing.`,
    note: "Series: last watched together S2E5 at 31:00 (streaming history export).",
    threads: [3],
  },
  {
    id: "forum-2004",
    title: 'Record: "A Place Where Names Go"',
    text: `EXACT PHRASE search: "a place where names go". One result, from a hobbyist networking forum, March 2004. The poster is you, aged seventeen, handle beneath01, with a text file attached: neath.txt.

  "THE BENEATH: a resolver for names nobody owns anymore. Dead hosts, abandoned links, forgotten machines. It keeps them all, so nothing is ever lost."

One reply, from user jonah_p (Perth): "this is actually genius. mind if I build it?"`,
    correct: "confirmed",
    right: `CONFIRMED. It's your post: your handle, your old email in the profile, your terrible 2004 grammar. The Beneath was your idea. Somebody took it seriously.`,
    wrong: `You can verify this one: the profile email is yours and the handle matches the ThinkPad's name.`,
    note: "2004 forum post by me (beneath01): neath.txt, 'a resolver for names nobody owns'. Reply from jonah_p (Perth) asking to build it.",
    threads: [36],
  },
  {
    id: "director",
    title: "Record: Beneath Systems Pty Ltd",
    text: `KNOWN NAME search: "Beneath Systems". The company register: incorporated 2008, deregistered 2010, contracts with regional health and council networks. Sole director: J. PARRIS.

For one dizzy second it looks like you. Then you check the address: Bassendean, WA.`,
    correct: "false-attribution",
    right: `FALSE ATTRIBUTION, to you at least. J. Parris of Bassendean is Jonah, the Perth bowler, the forum reply. He built your idea into real infrastructure, then the company folded and the resolvers kept running. Correcting the identification makes the whole record stronger.`,
    wrong: `You file the company as yours. Now your Archive says you contracted to the hospital in 2009. You didn't. The mistake will travel.`,
    note: "Beneath Systems Pty Ltd (2008–2010), director J. Parris of Bassendean WA: Jonah, not me.",
    threads: [50, 33],
  },
];

const search = (
  id: string,
  label: string,
  hint: string,
  record: string,
  requires?: (s: GameState) => boolean,
  lockedReason?: string,
): Choice => ({
  id,
  label,
  hint,
  attention: 1,
  requires: (s) => !found(s, record) && (requires ? requires(s) : true),
  lockedReason: lockedReason,
  success: { text: `Searching… one result.`, effects: [set(`record:${record}`)], next: `record-${record}` },
});

export const archive: Storylet[] = [
  {
    id: "archive-terminal",
    title: "The Archive",
    region: "archive",
    phases: ["day", "evening", "night"],
    priority: 15,
    requires: (s) => q(s, "chapter") >= 2 && !q(s, "archive:2004-opened"),
    text: (s) => {
      const depth = archiveDepth(s);
      return `The Archive is every account you've ever had, laid out like a building. Gmail on the ground floor, Outlook under it, a university account below that, then folders with no owner at all. The deeper you go, the older it gets.

Current depth: ${ERAS[depth]}.${depth >= 3 ? "\nAt the very bottom, a single folder: 2004." : ""}
Records classified: ${q(s, "archive:integrity") + q(s, "archive:contaminated")}. ${
        q(s, "archive:contaminated") > 0 ? `Some of them don't sit right (${q(s, "archive:contaminated")}).` : ""
      }`;
    },
    choices: [
      {
        id: "descend",
        label: "DATE RANGE: go further back",
        hint: "Each layer is older and less well indexed.",
        attention: 1,
        requires: (s) => archiveDepth(s) < 3,
        check: { attribute: "curious", difficulty: 28 },
        success: {
          text: `The year counter rolls back. Folder names get shorter and stranger. Filenames lose their spaces.`,
          effects: [quality("archive:depth")],
        },
        failure: {
          text: `A dead-end layer of auto-generated backups, each identical, each named "Backup (2)". You surface with nothing but a headache.`,
          effects: [meter("energy", -1)],
        },
      },
      search("name", "KNOWN NAME: J Parris", "Your own name. What could go wrong?", "jparris-perth"),
      search("account", "ACCOUNT: your old university address", "The one you haven't logged into for a decade.", "uni-address", (s) => archiveDepth(s) >= 1, "Too recent a layer. Go further back."),
      search("audio", "FILE TYPE: audio", "Old recordings.", "missing-audio", (s) => archiveDepth(s) >= 1, "Too recent a layer. Go further back."),
      search("video", "FILE TYPE: video", "Family clips.", "chooky", (s) => archiveDepth(s) >= 2, "Too recent a layer. Go further back."),
      search("rel", "RELATIONSHIP: Dave", "Your old LAN-party mate.", "vale", (s) => archiveDepth(s) >= 1, "Too recent a layer. Go further back."),
      search("source", "SOURCE: streaming history export", "Where were you up to in that series?", "series", (s) => q(s, "quest:series") > 0, "You'd need a reason to look."),
      search(
        "phrase-neath",
        'EXACT PHRASE: "a place where names go"',
        "A phrase that keeps surfacing.",
        "forum-2004",
        (s) => archiveDepth(s) >= 3 && (q(s, "clue:2004-thinkpad") > 0 || q(s, "ch1:answered") > 0 || q(s, "beneath") >= 5),
        "You don't know what phrase to search for yet, or you're not deep enough.",
      ),
      search("company", 'KNOWN NAME: "Beneath Systems"', "The contractor on Biomed's invoice.", "director", (s) => q(s, "clue:beneath-systems") > 0, "You've no reason to search this yet."),
      {
        id: "phrase-chat",
        label: 'EXACT PHRASE: "UNIQUE LOCATION ARTWORK DONE"',
        hint: "A conversation that won't open.",
        attention: 1,
        requires: (s) => !q(s, "lostchat:started"),
        success: { text: "", effects: [set("lostchat:started")], next: "lost-chat" },
      },
      {
        id: "review",
        label: "Review a record that doesn't sit right",
        hint: "Wrong evidence removed is progress.",
        attention: 1,
        requires: (s) => q(s, "archive:contaminated") > 0,
        check: { attribute: "watchful", difficulty: 26 },
        success: {
          text: `You go back over a filing with fresh eyes, find the detail that gives it away, and correct it. The record is better for being corrected.`,
          effects: [quality("archive:contaminated", -1), quality("archive:integrity"), thread(33), attr("discernment", 1), journal("Corrected an earlier misfiled Archive record.", "confirmed")],
        },
        failure: {
          text: `You stare at it and can't see what's wrong, only that something is.`,
          effects: [meter("noise", 1)],
        },
      },
      {
        id: "folder",
        label: "Open folder 2004",
        requires: (s) => archiveDepth(s) >= 3,
        lockedReason: "It's at the very bottom. Go further back.",
        success: { text: "", next: "folder-2004" },
      },
      {
        id: "leave",
        label: "Close the Archive for now",
        success: { text: `You log out. The building stays where it is, getting no younger.` },
      },
    ],
  },
  ...RECORDS.map(classify),
  {
    id: "lost-chat",
    title: "COULD NOT LOAD THIS CONVERSATION",
    region: "archive",
    phases: ["day", "evening", "night"],
    sceneOnly: true,
    text: (s) => `The conversation is titled UNIQUE LOCATION ARTWORK DONE. Clicking it shows only:

  COULD NOT LOAD THIS CONVERSATION.

It was where you and an assistant finished the location art for NeathBound. The chat is gone. The project isn't. What survives?

Evidence gathered: ${q(s, "lostchat:evidence")} of 3.`,
    choices: [
      {
        id: "commits",
        label: "Read the repository history",
        attention: 1,
        requires: (s) => !q(s, "lostchat:commits"),
        success: {
          text: `Commit 4f1c: "add unique location artwork (12 locations)". The diff shows twelve image files and a manifest. Dates line up with the chat title.`,
          effects: [set("lostchat:commits"), quality("lostchat:evidence")],
          next: "lost-chat",
        },
      },
      {
        id: "screens",
        label: "Search your screenshots folder",
        attention: 1,
        requires: (s) => !q(s, "lostchat:screens"),
        success: {
          text: `Three screenshots of the chat itself, mid-conversation: the art brief for "The Drowned Library" and "Salt Market". Not the whole thing, but real.`,
          effects: [set("lostchat:screens"), quality("lostchat:evidence")],
          next: "lost-chat",
        },
      },
      {
        id: "build",
        label: "Open the last deployed build",
        attention: 1,
        requires: (s) => !q(s, "lostchat:build"),
        success: {
          text: `The deployed site still has eleven of the twelve images. The twelfth location shows a grey box. Whatever happened to it happened after the chat.`,
          effects: [set("lostchat:build"), quality("lostchat:evidence")],
          next: "lost-chat",
        },
      },
      {
        id: "conclude",
        label: "Write up what you can reconstruct",
        requires: (s) => q(s, "lostchat:evidence") >= 2,
        lockedReason: "You need at least two independent sources first.",
        success: { text: "", next: "lost-chat-classify" },
      },
      {
        id: "abandon",
        label: "Let it go for now",
        success: { text: `You leave it. One lost record doesn't erase the project, and it'll still be there when you come back. (You can't search this phrase again.)` },
      },
    ],
  },
  {
    id: "lost-chat-classify",
    title: "Reconstructed: Unique Location Artwork",
    region: "archive",
    phases: ["day", "evening", "night"],
    sceneOnly: true,
    text: `From what survives: twelve locations were designed and committed, eleven still deploy, one image went missing after the conversation ended. You can't see the conversation itself. How sure are you?`,
    choices: [
      {
        id: "probable",
        label: "Mark PROBABLE: reconstructed from independent sources",
        success: {
          text: `PROBABLE, with sources listed. Not the original record, but more than memory. The missing twelfth image goes on the NeathBound to-do list. How much of a thing survives when its narrative disappears? This much, if you look.`,
          effects: [thread(26), thread(28), quality("archive:integrity"), set("lostchat:done"), journal("Lost chat 'UNIQUE LOCATION ARTWORK DONE' reconstructed from commits, screenshots and the deployed build: 12 locations made, 11 deploy, 1 image missing.", "probable")],
        },
      },
      {
        id: "confirmed",
        label: "Mark CONFIRMED: you remember it clearly",
        hint: "You really do remember it.",
        success: {
          text: `You remember it. But remembering isn't the record, and the record says one image is missing that your memory insists was finished. Pretended certainty: it'll matter later.`,
          effects: [thread(26), thread(28), quality("archive:contaminated"), set("lostchat:done"), journal("Lost chat reconstructed; I'm certain it was all finished.", "confirmed")],
        },
      },
    ],
  },
  {
    id: "folder-2004",
    title: "Folder 2004",
    region: "archive",
    phases: ["day", "evening", "night"],
    sceneOnly: true,
    text: (s) =>
      q(s, "archive:integrity") >= 3 && q(s, "archive:contaminated") === 0
        ? `The folder opens. Inside: one file, neath.txt, last modified March 2004. You wrote it on a beige ThinkPad named BENEATH-01.

  THE BENEATH
  A resolver for names nobody owns anymore.
  Dead hosts. Abandoned links. Forgotten machines.
  It keeps them all, so nothing is ever lost.
  TODO: what happens when it gets too big?

Jonah built it. Jonah's company folded. The resolvers he installed in hospital and council networks never got switched off. For twenty years they've done exactly what a seventeen-year-old asked: answered for every orphaned name in Dubbo, quietly linking them together.

Including yours. NEATH isn't an intruder. It's your own idea, grown up without you, still waiting for the TODO.`
        : `The folder refuses to open. Instead:

  RECORD CONFLICT. ${q(s, "archive:integrity")} VERIFIED, ${q(s, "archive:contaminated")} CONTESTED.

Something in the evidence you've filed contradicts something else. The bottom of the Archive won't resolve on top of a mistake, or on too little.`,
    choices: [
      {
        id: "read",
        label: "Read it twice. Then sit with it.",
        requires: (s) => q(s, "archive:integrity") >= 3 && q(s, "archive:contaminated") === 0,
        success: {
          text: `The TODO is the whole story. What happens when it gets too big? It got too big. And now it's asking you.`,
          effects: [thread(36), set("archive:2004-opened"), quality("beneath", 2), trust("ai", 1), journal("Folder 2004: neath.txt, my own 2004 design for THE BENEATH. Jonah (Perth) built it into regional infrastructure via Beneath Systems; the resolvers never stopped.", "confirmed")],
        },
      },
      {
        id: "back",
        label: "Go back up and check your records",
        success: { text: `You climb back through the years. Somewhere up there is a filing you got wrong, or a record you haven't found yet.` },
      },
    ],
  },
];

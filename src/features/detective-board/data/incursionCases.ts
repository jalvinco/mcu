import type { IncursionEvidenceCategory } from '@/types/board.types';

export interface IncursionCaseDefinition {
  characterId: number;
  category: IncursionEvidenceCategory;
  location: string;
  heading: string;
  action: string;
  rationale: string;
  apiAvailable?: boolean;
}

export interface IncursionConnectionDefinition {
  sourceId: number;
  targetId: number;
  label: string;
  category: IncursionEvidenceCategory;
  strength: number;
}

export const incursionCaseDefinitions: IncursionCaseDefinition[] = [
  {
    characterId: 31,
    category: 'confirmed',
    location: 'Earth-616',
    heading: 'The spell that opened the door',
    action: 'Strange attempted a memory spell for Peter Parker that drew people from other universes into Earth-616. In a later Darkhold dreamwalk, he crossed into another body; Clea then confronted him about an Incursion.',
    rationale: 'The spell and the confrontation are on-screen events. Clea’s accusation is the clearest direct Incursion warning in the archive.',
  },
  {
    characterId: 32,
    category: 'confirmed',
    location: 'Defender Strange',
    heading: 'A body used for dreamwalking',
    action: 'Strange dreamwalked into Defender Strange’s corpse while trying to reach America Chavez.',
    rationale: 'This variant is evidence in the Earth-616 Strange file, not a separate confirmed cause of an Incursion.',
  },
  {
    characterId: 33,
    category: 'confirmed',
    location: 'Sinister Strange',
    heading: 'A reality lost to dreamwalking',
    action: 'The Darkhold-corrupted variant’s universe is shown as destroyed after repeated dreamwalking.',
    rationale: 'The destroyed reality is part of the on-screen record; connecting it to a specific Incursion remains an interpretation.',
  },
  {
    characterId: 34,
    category: 'confirmed',
    location: 'Earth-838',
    heading: 'The Strange who broke the rules',
    action: 'Earth-838’s Strange used the Darkhold against Thanos and was executed by the Illuminati.',
    rationale: 'The Illuminati recount that his actions destroyed another universe. The board treats that event as canon, while its precise Incursion mechanics are not independently confirmed.',
  },
  {
    characterId: 67,
    category: 'confirmed',
    location: 'Earth-616',
    heading: 'Darkhold pursuit across worlds',
    action: 'Wanda used the Darkhold to dreamwalk into her Earth-838 counterpart and attacked the Illuminati while pursuing her children.',
    rationale: 'The invasion and destruction at Wundagore are on-screen events. The claim that this alone caused an Incursion is not stated as a confirmed outcome.',
  },
  {
    characterId: 68,
    category: 'confirmed',
    location: 'Earth-838',
    heading: 'The counterpart caught in the crossfire',
    action: 'Wanda’s Earth-838 counterpart and her children became the target of the Earth-616 Wanda’s dreamwalk.',
    rationale: 'This file records the exposed universe and the harm caused there; it does not assert that an Incursion occurred.',
  },
  {
    characterId: 50,
    category: 'confirmed',
    location: 'Earth-616 → Earth-10005',
    heading: 'The breach sealed from the far side',
    action: 'Monica crossed through the breach created during Dar-Benn’s use of the Quantum Bands and remained stranded on the other side.',
    rationale: 'The breach and Monica’s crossing are shown on-screen. The proposed continuing pull between universes is an unresolved risk, not a confirmed Incursion.',
  },
  {
    characterId: -1,
    category: 'confirmed',
    location: 'Kree',
    heading: 'Quantum Band breach',
    action: 'Dar-Benn used the Quantum Bands to tear open a breach between realities during the events of The Marvels.',
    rationale: 'Dar-Benn tore open the breach on-screen. Whether it sparked a collision between realities remains unresolved.',
    apiAvailable: false,
  },
  {
    characterId: 62,
    category: 'theory',
    location: 'Branch timeline',
    heading: 'The choice at the Citadel',
    action: 'Sylvie killed He Who Remains, after which the Sacred Timeline began branching.',
    rationale: 'The branching is shown in Loki. Treating it as a direct cause of Incursions is an indirect theory, not a confirmed on-screen finding.',
  },
  {
    characterId: 60,
    category: 'theory',
    location: 'Earth-616 / TVA',
    heading: 'Branches kept alive',
    action: 'Loki destroyed the Temporal Loom and took responsibility for sustaining the branching timelines.',
    rationale: 'The Loom and branch events are canon; their direct connection to Incursions is a theory.',
  },
  {
    characterId: 2,
    category: 'theory',
    location: 'Branch timeline',
    heading: 'A life outside his time',
    action: 'Steve Rogers returned to the past and lived a life with Peggy Carter in a branch timeline.',
    rationale: 'His return and older appearance are on record. Claims of a child, a collision with Doom’s reality, or Doom losing his family because of Steve remain unverified.',
  },
  {
    characterId: 1,
    category: 'theory',
    location: 'Earth-616',
    heading: 'The Time Heist architect',
    action: 'Tony Stark helped develop the time-travel plan that took the Avengers into alternate timelines; Loki and Gamora remained displaced from their original points in time.',
    rationale: 'The time heist and displaced variants are canon. Their role in causing an Incursion is an indirect theory.',
  },
  {
    characterId: 4,
    category: 'theory',
    location: 'Earth-616',
    heading: 'The Time Heist navigator',
    action: 'Bruce Banner helped the Avengers travel through time to retrieve the Infinity Stones.',
    rationale: 'The branching consequences are visible in the story; the claim that the heist directly caused Incursions is not confirmed.',
  },
  {
    characterId: 53,
    category: 'theory',
    location: 'Earth-616',
    heading: 'Quantum Realm time travel',
    action: 'Scott Lang joined the time heist and later fought Kang in the Quantum Realm.',
    rationale: 'Kang’s warning and the damaged engine are part of the story. Their alleged role as a safeguard against Incursions is speculative.',
  },
  {
    characterId: 106,
    category: 'theory',
    location: 'Quantum Realm',
    heading: 'A warning from Kang',
    action: 'Kang warned Scott about threats beyond himself; his Multiversal Engine Core was damaged during their fight.',
    rationale: 'A direct link between the engine damage and Incursions has not been confirmed.',
  },
  {
    characterId: 214,
    category: 'theory',
    location: 'Earth-10005',
    heading: 'An anchor-being brought back',
    action: 'Wade Wilson crossed realities while trying to save his world and brought another Wolverine into the story.',
    rationale: 'The cross-reality journey is on record. The claim that preserving a doomed world caused an Incursion remains unverified.',
  },
  {
    characterId: 273,
    category: 'theory',
    location: 'Earth-10005',
    heading: 'The Wolverine variant',
    action: 'A Wolverine variant from another reality joined Wade Wilson in the effort to save Earth-10005.',
    rationale: 'His presence is on-screen; whether it creates a collision with Earth-616 is unconfirmed.',
  },
  {
    characterId: 13,
    category: 'theory',
    location: 'Earth-616',
    heading: 'The spell interrupted',
    action: 'Peter Parker repeatedly interrupted Strange’s memory spell to protect the people he cared about.',
    rationale: 'The interruptions and the resulting multiversal arrivals are canon. The claim that Peter deliberately made a multiversal magnet is a theory.',
  },
  {
    characterId: 174,
    category: 'theory',
    location: 'Earth-616',
    heading: 'A symbiote fragment left behind',
    action: 'A piece of the Venom symbiote remained in Earth-616 after Eddie Brock returned to his own reality.',
    rationale: 'The post-credit scene shows the fragment; its role in a future Incursion is unknown.',
  },
  {
    characterId: 40,
    category: 'theory',
    location: 'Multiverse',
    heading: 'Star-shaped portals',
    action: 'America Chavez opened portals between universes while fleeing Wanda and later learned to control her power.',
    rationale: 'Her portal travel is canon. Calling those passages damage to the multiversal barrier or Incursion triggers is an interpretation.',
  },
  {
    characterId: 96,
    category: 'theory',
    location: 'Earth-828',
    heading: 'Fantastic Four crossing',
    action: 'Reed Richards and the Fantastic Four may have crossed from Earth-828 into Earth-616 aboard their interdimensional vessel.',
    rationale: 'The proposed arrival and its relationship to Doom or an Incursion are unconfirmed clues, not established causes.',
  },
  {
    characterId: 97,
    category: 'theory',
    location: 'Earth-828',
    heading: 'Fantastic Four crossing',
    action: 'Sue Storm may have crossed from Earth-828 with the Fantastic Four.',
    rationale: 'A connection between this team’s travel and a collision with Earth-616 is not confirmed.',
  },
  {
    characterId: 98,
    category: 'theory',
    location: 'Earth-828',
    heading: 'Fantastic Four crossing',
    action: 'Johnny Storm may have crossed from Earth-828 with the Fantastic Four.',
    rationale: 'A connection between this team’s travel and a collision with Earth-616 is not confirmed.',
  },
  {
    characterId: 99,
    category: 'theory',
    location: 'Earth-828',
    heading: 'Fantastic Four crossing',
    action: 'Ben Grimm may have crossed from Earth-828 with the Fantastic Four.',
    rationale: 'A connection between this team’s travel and a collision with Earth-616 is not confirmed.',
  },
  {
    characterId: 107,
    category: 'theory',
    location: 'Multiverse',
    heading: 'The accuser in the Doomsday theory',
    action: 'Doctor Doom appears to blame the heroes for taking lives and timelines that were never theirs.',
    rationale: 'The loss of Doom’s family and his plan to forge Battleworld remain unconfirmed.',
  },
];

export const incursionCaseConnections: IncursionConnectionDefinition[] = [
  { sourceId: 31, targetId: 32, label: 'Dreamwalk host', category: 'confirmed', strength: 5 },
  { sourceId: 31, targetId: 33, label: 'Darkhold variant', category: 'confirmed', strength: 4 },
  { sourceId: 31, targetId: 34, label: 'Earth-838 variant', category: 'confirmed', strength: 4 },
  { sourceId: 31, targetId: 67, label: 'Darkhold / 616', category: 'confirmed', strength: 4 },
  { sourceId: 67, targetId: 68, label: 'Dreamwalk target', category: 'confirmed', strength: 4 },
  { sourceId: 50, targetId: -1, label: 'Quantum Band breach', category: 'confirmed', strength: 5 },
  { sourceId: 62, targetId: 60, label: 'Timeline branching', category: 'theory', strength: 4 },
  { sourceId: 2, targetId: 1, label: 'Endgame timeline', category: 'theory', strength: 3 },
  { sourceId: 1, targetId: 4, label: 'Time Heist', category: 'theory', strength: 3 },
  { sourceId: 4, targetId: 53, label: 'Time Heist', category: 'theory', strength: 3 },
  { sourceId: 53, targetId: 106, label: 'Quantum Realm', category: 'theory', strength: 4 },
  { sourceId: 214, targetId: 273, label: 'Cross-reality team', category: 'theory', strength: 4 },
  { sourceId: 13, targetId: 31, label: 'Interrupted spell', category: 'theory', strength: 4 },
  { sourceId: 13, targetId: 174, label: 'Symbiote left behind', category: 'theory', strength: 2 },
  { sourceId: 40, targetId: 67, label: 'Pursuit across worlds', category: 'theory', strength: 3 },
  { sourceId: 96, targetId: 97, label: 'Fantastic Four', category: 'theory', strength: 3 },
  { sourceId: 96, targetId: 98, label: 'Fantastic Four', category: 'theory', strength: 3 },
  { sourceId: 96, targetId: 99, label: 'Fantastic Four', category: 'theory', strength: 3 },
  { sourceId: 2, targetId: 107, label: 'Doom / stolen lives theory', category: 'theory', strength: 2 },
  { sourceId: 1, targetId: 107, label: 'Doom’s accusation', category: 'theory', strength: 2 },
  { sourceId: 67, targetId: 107, label: 'Doom’s accusation', category: 'theory', strength: 2 },
  { sourceId: 31, targetId: 107, label: 'Doom’s accusation', category: 'theory', strength: 2 },
  { sourceId: 214, targetId: 107, label: 'Doom’s accusation', category: 'theory', strength: 2 },
];

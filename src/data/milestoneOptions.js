/**
 * Pre-defined milestone options grouped by category.
 * Each entry is a plain string name that parents can select.
 *
 * @type {Array<{ category: string, milestones: string[] }>}
 */
export const MILESTONE_CATEGORIES = [
  {
    category: 'Social & Emotional',
    milestones: [
      'First smile',
      'First laugh',
      'Recognises your face',
      'Waves bye-bye',
      'Gives a hug',
      'Plays peek-a-boo',
    ],
  },
  {
    category: 'Movement',
    milestones: [
      'Holds head up',
      'First roll (tummy to back)',
      'First roll (back to tummy)',
      'Sits with support',
      'Sits without support',
      'First crawl',
      'Pulls to stand',
      'Cruises along furniture',
      'First steps',
    ],
  },
  {
    category: 'Communication',
    milestones: [
      'First babble',
      'First word',
      'Says "mama"',
      'Says "dada"',
      'Points at things',
      'Two-word phrases',
    ],
  },
  {
    category: 'Fine Motor',
    milestones: [
      'Reaches for objects',
      'Transfers object hand-to-hand',
      'Pincer grasp',
      'Claps hands',
      'Stacks blocks',
    ],
  },
  {
    category: 'Feeding',
    milestones: [
      'First solid food',
      'First finger food',
      'Drinks from a cup',
      'Uses a spoon',
    ],
  },
  {
    category: 'Growth',
    milestones: [
      'First tooth',
      'First haircut',
    ],
  },
]

/** Flat list of all pre-defined milestone names. */
export const ALL_MILESTONE_NAMES = MILESTONE_CATEGORIES.flatMap(c => c.milestones)

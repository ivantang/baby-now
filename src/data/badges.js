/**
 * Badge definitions for the milestone achievement system.
 *
 * Developmental badges unlock when the parent logs a matching milestone.
 * Week badges unlock automatically based on the baby's current age in weeks.
 */

/** @type {Array<{ id: string, emoji: string, name: string, milestoneTrigger: string, tagline: string }>} */
export const DEVELOPMENTAL_BADGES = [
  {
    id: 'first_smile',
    emoji: '😊',
    name: 'First Smile',
    milestoneTrigger: 'First smile',
    tagline: 'That first real smile melted your heart forever.',
  },
  {
    id: 'first_laugh',
    emoji: '😂',
    name: 'First Laugh',
    milestoneTrigger: 'First laugh',
    tagline: 'That giggle is the best sound in the whole world.',
  },
  {
    id: 'tummy_champ',
    emoji: '🙃',
    name: 'Tummy Time Champ',
    milestoneTrigger: 'Holds head up',
    tagline: 'Head held high — already so strong!',
  },
  {
    id: 'rolling_star',
    emoji: '🌀',
    name: 'Rolling Star',
    milestoneTrigger: 'First roll (tummy to back)',
    tagline: "Off they go — there's no stopping them now!",
  },
  {
    id: 'grabby_hands',
    emoji: '🤲',
    name: 'Grabby Hands',
    milestoneTrigger: 'Reaches for objects',
    tagline: "Everything is fascinating when you're discovering the world.",
  },
  {
    id: 'chatterbox',
    emoji: '🗣️',
    name: 'Chatterbox',
    milestoneTrigger: 'First babble',
    tagline: 'They have so much to say already!',
  },
  {
    id: 'mirror_baby',
    emoji: '🪞',
    name: 'Mirror Baby',
    milestoneTrigger: 'Recognises your face',
    tagline: 'The most important face in the world — yours.',
  },
  {
    id: 'foot_finder',
    emoji: '🦶',
    name: 'Foot Finder',
    milestoneTrigger: 'First crawl',
    tagline: 'Hands, feet, and everything in between — explored!',
  },
  {
    id: 'sitter',
    emoji: '🪑',
    name: 'Sitter',
    milestoneTrigger: 'Sits with support',
    tagline: 'Up, up — looking at everything from a whole new angle!',
  },
  {
    id: 'solids_explorer',
    emoji: '🍼',
    name: 'Solids Explorer',
    milestoneTrigger: 'First solid food',
    tagline: 'A whole new world of flavours begins right here.',
  },
]

/** @type {Array<{ id: string, emoji: string, name: string, weekTrigger: number, tagline: string }>} */
export const WEEK_BADGES = [
  {
    id: 'newborn',
    emoji: '🐣',
    name: 'Newborn',
    weekTrigger: 1,
    tagline: 'Welcome to the world, little one. You made it!',
  },
  {
    id: 'one_month',
    emoji: '🌱',
    name: '1 Month',
    weekTrigger: 4,
    tagline: "One whole month together. You're both doing amazingly.",
  },
  {
    id: 'three_months',
    emoji: '✨',
    name: '3 Months',
    weekTrigger: 12,
    tagline: 'Three months of wonder, growth, and love.',
  },
  {
    id: 'six_months',
    emoji: '🌟',
    name: '6 Months',
    weekTrigger: 26,
    tagline: "Half a year! You've both come so incredibly far.",
  },
  {
    id: 'nine_months',
    emoji: '🎉',
    name: '9 Months',
    weekTrigger: 39,
    tagline: 'Nine months in — watching you grow is the greatest joy.',
  },
  {
    id: 'one_year',
    emoji: '🎂',
    name: '1 Year',
    weekTrigger: 52,
    tagline: 'Happy first birthday! What an incredible year it has been.',
  },
]

/** All badges as a single flat list for easy lookup. */
export const ALL_BADGES = [...DEVELOPMENTAL_BADGES, ...WEEK_BADGES]

/** Lookup map: badge id → badge definition. */
export const BADGE_MAP = Object.fromEntries(ALL_BADGES.map(b => [b.id, b]))

/** Lookup map: milestoneTrigger → badge id (for developmental badges). */
export const MILESTONE_TO_BADGE = Object.fromEntries(
  DEVELOPMENTAL_BADGES.map(b => [b.milestoneTrigger, b.id])
)

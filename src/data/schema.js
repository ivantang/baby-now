/**
 * @fileoverview Data schema for Baby Week by Week.
 * JSDoc typedefs act as the canonical data contract.
 * All week files must conform to WeekEntry.
 */

/**
 * @typedef {Object} PhysicalDevelopment
 * @property {string} size        Approximate weight and length, e.g. "~5 kg / ~11 lbs, ~57 cm"
 * @property {string} motorSkills Description of motor skill development this week
 * @property {string} reflexes    Description of reflex development this week
 */

/**
 * @typedef {Object} CognitiveDevelopment
 * @property {string} vision    Vision and visual tracking development
 * @property {string} hearing   Hearing and auditory response development
 * @property {string} awareness Social and environmental awareness development
 */

/**
 * @typedef {Object} SleepInfo
 * @property {string} totalHours  Total daily sleep, e.g. "14–17 hours/day"
 * @property {string} nightSleep  Night sleep pattern, e.g. "2–4 hour stretches"
 * @property {string} naps        Nap pattern, e.g. "3–5 naps, 30–45 min each"
 * @property {string} notes       Additional sleep context, tips, or caveats
 */

/**
 * @typedef {Object} FeedingInfo
 * @property {string} amount      Volume per feed, e.g. "90–120 ml (3–4 oz)"
 * @property {string} frequency   Feed frequency, e.g. "Every 2–3 hours, 8–12 feeds/day"
 * @property {string} hungerCues  Description of hunger cues to watch for
 * @property {string} notes       Breastfeeding vs formula context, growth check reminders, etc.
 */

/**
 * @typedef {Object} PlayActivities
 * @property {string[]} activities  3–5 short, actionable activity descriptions
 * @property {string}   bonding     Paragraph on bonding context and connection for this week
 */

/**
 * @typedef {Object} ParentTips
 * @property {string[]} selfCare    2–4 tips for the parent's own wellbeing
 * @property {string[]} watchFor    2–4 developmental signals to notice (positive milestones)
 * @property {string[]} callDoctor  2–4 red-flag symptoms that warrant a call to the doctor
 */

/**
 * A single week's worth of baby development content.
 *
 * @typedef {Object} WeekEntry
 * @property {number}             week        Week number, 1–52
 * @property {string}             ageRange    Human-readable age, e.g. "2 months old"
 * @property {string}             title       Week card headline, e.g. "Week 8 — 2 months old"
 * @property {string}             highlight   1–2 sentence developmental highlight shown in list views
 * @property {string}             [illustration] Path to the week's SVG illustration, e.g. "/illustrations/week-04.svg"
 * @property {PhysicalDevelopment} physical
 * @property {CognitiveDevelopment} cognitive
 * @property {SleepInfo}          sleep
 * @property {FeedingInfo}        feeding
 * @property {PlayActivities}     play
 * @property {ParentTips}         parentTips
 * @property {boolean}            isStub      True when content is placeholder; false when fully written
 */

export {}

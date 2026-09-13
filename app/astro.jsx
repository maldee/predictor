'use client';

import styles from "./astro.module.css";
import React, { useEffect, useState } from 'react';

const houseSlots = [
  { house: 2, x: 20, y: 13, planetX: 27, planetY: 14, anchor: 'start' }, { house: 3, x: 10, y: 34, planetX: 14, planetY: 27, anchor: 'start' },
  { house: 1, x: 60, y: 20, planetX: 60, planetY: 23, anchor: 'middle' }, { house: 12, x: 83, y: 13, planetX: 93, planetY: 14, anchor: 'start' },
  { house: 11, x: 103, y: 34, planetX: 106, planetY: 27, anchor: 'start' }, { house: 4, x: 18, y: 61, planetX: 20, planetY: 64, anchor: 'start' },
  { house: 10, x: 103, y: 61, planetX: 100, planetY: 64, anchor: 'start' }, { house: 5, x: 18, y: 86, planetX: 14, planetY: 93, anchor: 'start' },
  { house: 6, x: 27, y: 104, planetX: 27, planetY: 106, anchor: 'start' }, { house: 7, x: 60, y: 104, planetX: 60, planetY: 100, anchor: 'middle' },
  { house: 9, x: 103, y: 88, planetX: 106, planetY: 93, anchor: 'start' }, { house: 8, x: 82, y: 106, planetX: 93, planetY: 106, anchor: 'start' },
];

const charts = {
  life: {
    eyebrow: 'Personal timeline',
    title: 'Life',
    description: 'Keep meaningful moments, plans, and reflections in one place.',
    ascendant: 'Saved moments',
    date: 'Your personal record',
    placements: {},
  },
   gochara: {
    eyebrow: 'Live planetary motion',
    title: 'Transit',
    description: 'Watch the current planets move through your houses in real time.',
    ascendant: 'Today  •  13 September 2026',
    date: 'Transit window  00:00 - 24:00',
    placements: {},
  },
  lagna: {
    eyebrow: 'Birth chart',
    title: 'Lagna kundali',
    description: 'Your first house map, anchored to the rising sign at birth.',
    ascendant: 'Cancer',
    date: 'HIDDEN •  Kurunegala',
    placements: { 1: ['Mars'], 2: [], 3: ['Jupiter'], 4: ['Mercury', 'Pluto'], 5: ['Rahu', 'Sun'], 6: ['Uranus', 'Neptune'], 7: ['Saturn', 'Venus'], 8: [], 9: ['Moon'], 10: [], 11: ['Ketu'], 12: [] },
    aspects: { Mars: 'Venus, Saturn, Rahu', Jupiter: 'Moon, Ketu, Venus', Mercury: 'Mars, Saturn, Rahu', 'Saturn / Venus': 'Mars, Sun, Jupiter, Ketu, Mercury', Moon: 'Jupiter, Saturn, Rahu', Ketu: 'Moon, Jupiter, Sun, Venus, Rahu, Mercury' },
  },
  navamsa: {
    eyebrow: 'D-9 divisional chart',
    title: 'Navamsa',
    description: 'The deeper layer of the chart, used to read strength and partnership.',
    ascendant: 'Virgo',
    date: 'HIDDEN  •  Kurunegala',
    placements: { 1: ['Ketu'], 2: ['Uranus'], 3: ['Neptune'], 4: ['Sun'], 5: ['Venus'], 6: [], 7: ['Rahu'], 8: [], 9: ['Jupiter'], 10: ['Mercury', 'Saturn', 'Pluto'], 11: [], 12: ['Moon', 'Mars'] },
    aspects: { Ketu: 'Jupiter, Mercury, Rahu, Sun, Venus', Uranus: 'Moon', Neptune: 'Jupiter, Rahu, Mars', Sun: 'Saturn, Mercury', Venus: 'Jupiter, Mercury, Ketu', Rahu: 'Saturn, Ketu, Mars', Jupiter: 'Ketu, Venus, Moon', Mercury: 'Sun', 'Moon / Mars': 'Saturn' },
  },
 
  
};

const movingPlanets = [
  { name: 'Sun', englishName: 'Sun', symbol: 'Su', color: '#d65b43', currentHouse: 2, sign: 'Leo' },
  { name: 'Ketu', englishName: 'Ketu', symbol: 'Ke', color: '#9c765c', currentHouse: 2, sign: 'Leo' },
  { name: 'Moon', englishName: 'Moon', symbol: 'Mo', color: '#708caa', currentHouse: 3, sign: 'Virgo' },
  { name: 'Mercury', englishName: 'Mercury', symbol: 'Me', color: '#648d78', currentHouse: 3, sign: 'Virgo' },
  { name: 'Venus', englishName: 'Venus', symbol: 'Ve', color: '#b878a0', currentHouse: 4, sign: 'Libra' },
  { name: 'Pluto', englishName: 'Pluto', symbol: 'Pl', color: '#6f637d', currentHouse: 7, sign: 'Capricorn' },
  { name: 'Rahu', englishName: 'Rahu', symbol: 'Ra', color: '#8b6bb5', currentHouse: 8, sign: 'Aquarius' },
  { name: 'Saturn', englishName: 'Saturn', symbol: 'Sa', color: '#587899', currentHouse: 9, sign: 'Pisces' },
  { name: 'Uranus', englishName: 'Uranus', symbol: 'Ur', color: '#3a9a9b', currentHouse: 11, sign: 'Taurus' },
  { name: 'Mars', englishName: 'Mars', symbol: 'Ma', color: '#c45142', currentHouse: 12, sign: 'Gemini' },
  { name: 'Jupiter', englishName: 'Jupiter', symbol: 'Ju', color: '#e8a23b', currentHouse: 1, sign: 'Cancer' },
];

const planetNames = { Mars: 'Ma', Jupiter: 'Ju', Mercury: 'Me', Pluto: 'Pl', Rahu: 'Ra', Sun: 'Su', Uranus: 'Ur', Neptune: 'Ne', Saturn: 'Sa', Venus: 'Ve', Moon: 'Mo', Ketu: 'Ke' };
const transitSummary = [
  { name: 'Jupiter', house: '1st (Cancer)', entry: 'June 2, 2026', exit: 'Oct 31, 2026 → re-enters Jan 25, 2027 → final exit Jun 26, 2027' },
  { name: 'Sun', house: '2nd (Leo)', entry: 'Aug 17, 2026', exit: 'Sep 17, 2026' },
  { name: 'Ketu', house: '2nd (Leo)', entry: 'May 18, 2025', exit: 'Nov 1, 2027' },
  { name: 'Moon', house: '3rd (Virgo)', entry: 'Sep 13, 2026 (morning)', exit: 'Sep 14, 2026 (moves to Libra)' },
  { name: 'Mercury', house: '3rd (Virgo)', entry: 'Aug 29, 2026', exit: 'Sep 11, 2026 → re-enters Virgo Oct 23, 2026' },
  { name: 'Venus', house: '4th (Libra)', entry: 'Sep 1, 2026', exit: 'Sep 25, 2026' },
  { name: 'Pluto', house: '7th (Capricorn)', entry: 'Stays long-term', exit: '2040 (slow mover)' },
  { name: 'Rahu', house: '8th (Aquarius)', entry: 'May 18, 2025', exit: 'Nov 1, 2027' },
  { name: 'Saturn', house: '9th (Pisces)', entry: 'Mar 29, 2025', exit: 'Jun 1, 2027 → retro re-entry Nov 3, 2027' },
  { name: 'Uranus', house: '11th (Taurus)', entry: 'Stays long-term', exit: '2033 (slow mover)' },
  { name: 'Mars', house: '12th (Gemini)', entry: 'Aug 31, 2026', exit: 'Oct 21, 2026' },
];
const healthSummary = [
  { planet: 'Jupiter', house: '1st (Cancer)', body: 'Head, brain, face', effects: 'Obesity, liver imbalance, headaches, diabetes tendency', nature: 'benefic' },
  { planet: 'Sun', house: '2nd (Leo)', body: 'Eyes, mouth, teeth', effects: 'Eye strain, ulcers, dental pain, throat ache', nature: 'malefic' },
  { planet: 'Ketu', house: '2nd (Leo)', body: 'Eyes, teeth, tongue', effects: 'Speech problems, unclear voice, dental decay', nature: 'malefic' },
  { planet: 'Moon', house: '3rd (Virgo)', body: 'Shoulders, arms, lungs', effects: 'Anxiety, asthma, weak immunity, chest tightness', nature: 'benefic' },
  { planet: 'Mercury', house: '3rd (Virgo)', body: 'Arms, nerves, lungs', effects: 'Nerve pain, tremors, respiratory weakness', nature: 'malefic' },
  { planet: 'Venus', house: '4th (Libra)', body: 'Chest, heart, lungs', effects: 'Chest congestion, reproductive weakness, heart strain', nature: 'mixed' },
  { planet: 'Empty 5th', house: '5th (Scorpio)', body: 'Stomach, liver, spine', effects: 'Indigestion, ulcers, liver disorders, spinal pain', nature: 'neutral' },
  { planet: 'Empty 6th', house: '6th (Sagittarius)', body: 'Intestines, kidneys', effects: 'Ulcers, kidney inflammation, stomach disorders', nature: 'neutral' },
  { planet: 'Pluto', house: '7th (Capricorn)', body: 'Lower abdomen, reproductive organs', effects: 'Sexual vitality issues, deep karmic disease', nature: 'mixed' },
  { planet: 'Rahu', house: '8th (Aquarius)', body: 'Genitals, chronic disease zone', effects: 'Sudden illness, reproductive disorders, hidden karmic health', nature: 'malefic' },
  { planet: 'Saturn', house: '9th (Pisces)', body: 'Hips, thighs', effects: 'Arthritis, hip pain, sciatica, reduced mobility', nature: 'malefic' },
  { planet: 'Empty 10th', house: '10th (Aries)', body: 'Knees, joints', effects: 'Knee pain, arthritis, joint stiffness', nature: 'neutral' },
  { planet: 'Uranus', house: '11th (Taurus)', body: 'Calves, ankles', effects: 'Sudden cramps, nerve shocks, circulation issues', nature: 'mixed' },
  { planet: 'Mars', house: '12th (Gemini)', body: 'Feet, sleep, nervous system', effects: 'Foot pain, insomnia, nervous stress, hidden inflammation', nature: 'benefic' },
];
const planetNature = healthSummary.reduce((result, item) => ({ ...result, [item.planet]: item.nature }), {});
const planetDetails = {
  health: healthSummary.map((item) => ({ label: item.planet, sublabel: item.house, first: item.body, second: item.effects, nature: item.nature })),
  bodyParts: healthSummary.map((item) => ({ label: item.planet, sublabel: item.house, first: item.body, second: item.effects, nature: item.nature })),
  foods: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Wheat, dates, honey, saffron, citrus', second: 'Prefer warm, nourishing foods; avoid excess heat and stimulants.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Milk, rice, cucumber, melon, leafy greens', second: 'Hydrating and calming foods support emotional balance.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Red lentils, pomegranate, beetroot, ginger', second: 'Moderate spicy foods and protect sleep and hydration.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Green vegetables, mung beans, basil, pears', second: 'Light foods support nerves, lungs, and mental clarity.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Yellow lentils, pumpkin, banana, turmeric', second: 'Favor balanced portions and avoid excess sugar or heavy meals.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Milk, coconut, berries, figs, almonds', second: 'Supportive for nourishment, beauty, and reproductive vitality.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Sesame, black lentils, oats, root vegetables', second: 'Warm, mineral-rich foods support bones and mobility.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Simple fresh food, greens, legumes, clean water', second: 'Avoid intoxicants, irregular eating, and heavily processed foods.', nature: 'malefic' },
  ],
  businesses: [
    { label: 'Sun', sublabel: 'Authority and leadership', first: 'Government, administration, leadership, public service', second: 'Build visibility through responsibility and clear decisions.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Care and public needs', first: 'Hospitality, food, travel, healthcare, public relations', second: 'Work connected to people, care, and changing demand.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Action and engineering', first: 'Engineering, construction, athletics, surgery, technology', second: 'Best in work requiring courage, speed, and decisive action.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Commerce and analysis', first: 'Trade, writing, software, accounting, consulting', second: 'Use communication, calculation, and adaptable systems.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Growth and wisdom', first: 'Education, finance, law, coaching, publishing', second: 'Strong for ethical growth, teaching, and advisory work.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Beauty and relationships', first: 'Design, fashion, arts, luxury, hospitality, partnerships', second: 'Prosper through aesthetics, diplomacy, and client trust.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Structure and endurance', first: 'Manufacturing, infrastructure, compliance, research', second: 'Long-term businesses reward patience and disciplined systems.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Unusual and spiritual fields', first: 'Foreign trade, analytics, cybersecurity, research, healing', second: 'Avoid opaque deals; document everything carefully.', nature: 'malefic' },
  ],
  jobs: [
    { label: 'Sun', sublabel: 'Leadership', first: 'Manager, executive, civil servant, project lead', second: 'Authority, visibility, and accountability.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Care', first: 'Counsellor, nurse, teacher, hospitality professional', second: 'Empathy, listening, and public connection.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Technical action', first: 'Engineer, surgeon, athlete, firefighter, developer', second: 'Courage, practical skill, and quick execution.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Intellect', first: 'Writer, analyst, programmer, accountant, trader', second: 'Communication, logic, and problem-solving.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Guidance', first: 'Professor, lawyer, banker, mentor, spiritual teacher', second: 'Knowledge, ethics, and broad perspective.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Creative harmony', first: 'Designer, musician, diplomat, therapist, stylist', second: 'Taste, collaboration, and relationship skills.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Discipline', first: 'Engineer, auditor, administrator, researcher', second: 'Persistence, precision, and responsibility.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Specialized paths', first: 'Cybersecurity, aviation, astrology, investigation', second: 'Strong for unconventional or deep specialist work.', nature: 'malefic' },
  ],
  gemstones: [
    { label: 'Sun', sublabel: 'Leo', first: 'Ruby', second: 'Use only after personal chart and suitability review.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo', first: 'Pearl', second: 'Traditionally connected with calm, care, and emotional steadiness.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini', first: 'Red Coral', second: 'Traditionally connected with courage and vitality.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo', first: 'Emerald', second: 'Traditionally connected with learning and communication.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer', first: 'Yellow Sapphire', second: 'Traditionally connected with wisdom and prosperity.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra', first: 'Diamond or White Sapphire', second: 'Traditionally connected with art and harmony.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces', first: 'Blue Sapphire', second: 'Use only with expert suitability testing.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Nodes', first: 'Hessonite / Cat’s Eye', second: 'Do not wear without a qualified chart review.', nature: 'malefic' },
  ],
  mantras: [
    { label: 'Sun', sublabel: 'Sunday • Sunrise', first: 'Om Suryaya Namaha · 108x', second: 'Optional set: Aditya Hridayam or Gayatri Mantra. Recite calmly after sunrise.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Monday • Evening', first: 'Om Somaya Namaha · 108x', second: 'Optional set: Chandra mantra with quiet breathing for emotional steadiness.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Tuesday • Morning', first: 'Om Angarakaya Namaha · 108x', second: 'Optional set: Hanuman Chalisa or Om Hanumate Namaha for courage and discipline.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Wednesday • Morning', first: 'Om Budhaya Namaha · 108x', second: 'Optional set: Vishnu Sahasranama excerpts or a short study-focused prayer.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Thursday • Morning', first: 'Om Brihaspataye Namaha · 108x', second: 'Optional set: Guru mantra and a gratitude prayer before teaching or study.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Friday • Morning or evening', first: 'Om Shukraya Namaha · 108x', second: 'Optional set: Lakshmi mantra for harmony, beauty, and gracious relationships.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Saturday • Evening', first: 'Om Shanicharaya Namaha · 108x', second: 'Optional set: Shani mantra with service, patience, and honest responsibility.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Nodes • Quiet practice', first: 'Om Rahave Namaha / Om Ketave Namaha · 108x', second: 'Use one mantra at a time; add meditation and grounding rather than fear-based practice.', nature: 'malefic' },
  ],
  remedies: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Offer water at sunrise; practice truthful speech.', second: 'Build confidence without harshness or pride.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Keep regular sleep; spend quiet time near water.', second: 'Support emotional regulation and family connection.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Exercise consistently; protect sleep and avoid impulsive conflict.', second: 'Channel heat into constructive physical work.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Read, journal, organize, and keep communication precise.', second: 'Reduce overstimulation and nervous multitasking.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Teach, donate, mentor, and keep a measured diet.', second: 'Strengthen wisdom through service and learning.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Keep surroundings beautiful; practice kindness in relationships.', second: 'Balance pleasure with responsibility.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Serve elders, keep routines, and complete duties patiently.', second: 'Build progress through consistency rather than speed.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Meditation, clean habits, charitable service, and grounding routines.', second: 'Avoid fear-driven decisions and intoxicants.', nature: 'malefic' },
  ],
  crystals: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Sun bracelet: sunstone + clear quartz', second: 'Wear as a symbolic confidence bracelet; use ruby only after chart suitability review.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Calm bracelet: moonstone + selenite + clear quartz', second: 'A gentle combination for reflection, calm, and emotional balance.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Courage bracelet: carnelian + red jasper + black tourmaline', second: 'Use a grounded combination; remove if it feels overstimulating.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Focus bracelet: green aventurine + moss agate + fluorite', second: 'Symbolic support for learning, communication, and organized thinking.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Growth bracelet: citrine + yellow aventurine + clear quartz', second: 'Traditionally associated with optimism, wisdom, and abundance.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Harmony bracelet: rose quartz + rhodonite + amazonite', second: 'Traditionally associated with affection, beauty, and balanced relationships.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Grounding bracelet: smoky quartz + hematite + black tourmaline', second: 'Traditionally associated with patience, boundaries, and steady routines.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Protection bracelet: labradorite + obsidian + amethyst', second: 'Use one simple combination and treat it as symbolic support, not treatment.', nature: 'malefic' },
  ],
  colors: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Gold, orange, saffron', second: 'Use for confidence, visibility, and vitality.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'White, silver, soft blue', second: 'Use for calm, reflection, and emotional steadiness.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Red, coral, terracotta', second: 'Use for action, courage, and physical drive.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Green, mint, olive', second: 'Use for learning, communication, and analysis.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Yellow, cream, warm gold', second: 'Use for optimism, wisdom, and expansion.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Pink, white, pastel blue', second: 'Use for harmony, beauty, and connection.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Navy, charcoal, indigo', second: 'Use in moderation for discipline and grounding.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Smoky gray, deep violet, earthy tones', second: 'Use grounded colors during uncertain periods.', nature: 'malefic' },
  ],
  metals: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Gold, copper', second: 'Traditionally linked with vitality and authority.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Silver', second: 'Traditionally linked with calm and receptivity.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Copper', second: 'Traditionally linked with energy and courage.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Bronze, mixed alloys', second: 'Traditionally linked with communication and trade.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Gold', second: 'Traditionally linked with wisdom and prosperity.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Silver, platinum', second: 'Traditionally linked with beauty and refinement.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Iron, steel, lead', second: 'Traditionally linked with endurance and structure.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Lead, mixed metals', second: 'Use only with careful traditional guidance.', nature: 'malefic' },
  ],
  directions: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'East', second: 'Useful direction for visibility, leadership, and new beginnings.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Northwest', second: 'Supports care, movement, and social connection.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'South', second: 'Supports decisive action and physical effort.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'North', second: 'Supports study, trade, and communication.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Northeast', second: 'Supports learning, guidance, and prosperity.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Southeast', second: 'Supports creativity, comfort, and relationships.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'West', second: 'Supports patience, completion, and responsibility.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Southwest / Northwest', second: 'Use grounding routines when making major moves.', nature: 'malefic' },
  ],
  objects: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Gold, copper, lamps, clocks, authority objects', second: 'Objects associated with leadership, visibility, and vitality.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Silver, cups, water vessels, mirrors, white fabrics', second: 'Objects associated with care, memory, comfort, and calm.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Tools, red equipment, sports gear, knives, engineering items', second: 'Use carefully; associated with action, heat, and technical work.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Books, computers, calculators, writing tools, documents', second: 'Objects associated with learning, trade, analysis, and communication.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Books, teaching materials, gold objects, prayer items', second: 'Objects associated with wisdom, guidance, growth, and abundance.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Art, perfume, music, flowers, jewelry, beautiful furniture', second: 'Objects associated with beauty, harmony, comfort, and relationships.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Iron tools, clocks, work equipment, dark blue items', second: 'Objects associated with structure, patience, duty, and endurance.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Electronic devices, antiques, unusual objects, spiritual items', second: 'Keep these objects organized and avoid clutter or impulsive purchases.', nature: 'malefic' },
  ],
  bestTimes: [
    { label: 'Sun', sublabel: 'Sunday • East', first: 'Sunrise to 10:00 AM', second: 'Leadership, applications, public visibility, important decisions.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Monday • Northwest', first: '6:00 AM to 10:00 AM', second: 'Family matters, care, travel, emotional conversations, home activities.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Tuesday • South', first: '10:00 AM to 12:00 PM', second: 'Exercise, technical work, courage, repairs, and decisive action.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Wednesday • North', first: '8:00 AM to 12:00 PM', second: 'Study, writing, trade, interviews, accounts, and communication.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Thursday • Northeast', first: '8:00 AM to 12:00 PM', second: 'Teaching, guidance, finance, blessings, and long-term planning.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Friday • Southeast', first: '10:00 AM to 2:00 PM', second: 'Relationships, art, design, beauty, comfort, and agreements.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Saturday • West', first: '9:00 AM to 1:00 PM', second: 'Routine work, repairs, discipline, documentation, and completion.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Nodes • Use caution', first: 'Avoid Rahu Kalam for new beginnings', second: 'Use quiet dawn or dusk for reflection, meditation, and review rather than major launches.', nature: 'malefic' },
  ],
  countries: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'United States, Japan, Singapore, Italy', second: 'Leadership, government, authority, and high-visibility opportunities.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Sri Lanka, Netherlands, New Zealand, Scotland', second: 'Care, water, hospitality, family, and public-facing environments.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Germany, Israel, South Korea, Armenia', second: 'Engineering, defense, technology, competition, and decisive action.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Belgium, Canada, Switzerland, Ireland', second: 'Trade, technology, education, writing, and communication.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'India, Greece, Spain, Brazil', second: 'Education, law, finance, publishing, spirituality, and growth.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'France, Austria, Sweden, Cyprus', second: 'Art, design, luxury, diplomacy, hospitality, and relationships.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Russia, Norway, Afghanistan, Bosnia', second: 'Infrastructure, research, discipline, industry, and long-term work.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Foreign or unusual destinations; border regions and transformative places', second: 'Use careful research before relocation, travel, or major international commitments.', nature: 'malefic' },
  ],
  oils: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Sesame oil, saffron-infused oil', second: 'Traditional association with vitality and warming self-care; use gently.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Coconut oil, brahmi oil', second: 'Traditional calming scalp and body-care association.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Mustard oil, ginger-infused oil', second: 'Traditional warming massage association; avoid on irritated skin.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Brahmi oil, neem oil', second: 'Traditional association with scalp care and clarity; patch-test first.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Sesame oil, ghee-based herbal oils', second: 'Traditional nourishing and grounding association.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Rose oil, jasmine oil, almond oil', second: 'Traditional association with skin care, softness, and relaxation.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Sesame oil, castor oil, mahanarayan oil', second: 'Traditional massage association for stiffness and grounding.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Neem oil, calming herbal blends', second: 'Use simple, tested preparations and seek an Ayurvedic practitioner for therapeutic use.', nature: 'malefic' },
  ],
  subjects: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Leadership, politics, public administration, history', second: 'Strong for subjects involving authority, confidence, government, and presentation.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Psychology, nursing, nutrition, sociology, languages', second: 'Supports people-focused learning, memory, care, and observation.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Engineering, computer hardware, medicine, sports science, defense', second: 'Supports practical, technical, competitive, and action-oriented study.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Mathematics, programming, accounting, commerce, writing, statistics', second: 'Supports analysis, logic, communication, systems, and problem-solving.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Law, education, finance, philosophy, religion, economics', second: 'Supports broad knowledge, ethics, teaching, and strategic understanding.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Art, design, music, fashion, architecture, hospitality', second: 'Supports aesthetics, creativity, diplomacy, and relationship-centered fields.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Engineering, geology, agriculture, sociology, research, law', second: 'Supports difficult subjects requiring patience, structure, and long study.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Astrology, cybersecurity, aviation, psychology, archaeology, occult studies', second: 'Supports unusual, investigative, foreign, spiritual, or hidden subjects.', nature: 'malefic' },
  ],
  gods: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Surya, Aditya', second: 'Traditional devotional association with vitality, confidence, truth, and leadership.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Chandra, Gauri', second: 'Traditional devotional association with care, nourishment, calm, and emotional balance.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Skanda, Hanuman', second: 'Traditional devotional association with courage, discipline, protection, and strength.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Vishnu, Hayagriva', second: 'Traditional devotional association with learning, speech, intelligence, and analysis.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Brihaspati, Dakshinamurthy', second: 'Traditional devotional association with wisdom, teaching, ethics, and blessings.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Lakshmi, Parvati', second: 'Traditional devotional association with beauty, harmony, love, and prosperity.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Shani, Hanuman', second: 'Traditional devotional association with patience, karma, service, and endurance.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Durga / Ganesha, Bhairava', second: 'Traditional devotional association with protection, clarity, release, and transformation.', nature: 'malefic' },
  ],
  trees: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Arka, banyan', second: 'Traditional association with vitality, authority, sunlight, and resilience.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Palmyra, jasmine, water plants', second: 'Traditional association with nourishment, calm, memory, and receptivity.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Neem, red sandalwood', second: 'Traditional association with protection, cleansing, strength, and heat.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Tulsi, bamboo', second: 'Traditional association with learning, speech, flexibility, and healing.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Peepal, banana, banyan', second: 'Traditional association with wisdom, teaching, nourishment, and abundance.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Rose, sandalwood, flowering trees', second: 'Traditional association with beauty, fragrance, harmony, and affection.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Shami, acacia, tamarind', second: 'Traditional association with endurance, grounding, service, and long cycles.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Cactus, thorn trees, sacred kusha grass', second: 'Traditional association with boundaries, protection, austerity, and transformation.', nature: 'malefic' },
  ],
  familyRelations: [
    { label: 'Sun', sublabel: 'Leo • 2nd house', first: 'Ancestors: father, paternal line, elders', second: 'Siblings: authority patterns, family pride, and speech dynamics.', nature: 'malefic' },
    { label: 'Moon', sublabel: 'Virgo • 3rd house', first: 'Ancestors: mother, maternal care, family memories', second: 'Siblings: emotional closeness, daily communication, and support.', nature: 'benefic' },
    { label: 'Mars', sublabel: 'Gemini • 12th house', first: 'Ancestors: warrior or protective lineage', second: 'Siblings: energetic, competitive, direct, or occasionally conflict-prone bonds.', nature: 'benefic' },
    { label: 'Mercury', sublabel: 'Virgo • 3rd house', first: 'Ancestors: teachers, writers, traders, record keepers', second: 'Siblings: messages, learning, business, debate, and practical help.', nature: 'malefic' },
    { label: 'Jupiter', sublabel: 'Cancer • 1st house', first: 'Ancestors: teachers, priests, guides, respected elders', second: 'Siblings: protection, advice, generosity, and shared growth.', nature: 'benefic' },
    { label: 'Venus', sublabel: 'Libra • 4th house', first: 'Ancestors: artistic, diplomatic, graceful family line', second: 'Siblings: affection, cooperation, comfort, and shared interests.', nature: 'mixed' },
    { label: 'Saturn', sublabel: 'Pisces • 9th house', first: 'Ancestors: hardworking, strict, duty-bound elders', second: 'Siblings: distance or responsibility that improves through patience.', nature: 'malefic' },
    { label: 'Rahu / Ketu', sublabel: 'Aquarius / Leo', first: 'Ancestors: unusual, foreign, hidden, or spiritually intense lineage', second: 'Siblings: unconventional bonds, separation themes, and lessons around attachment.', nature: 'malefic' },
  ],
  risks: [
    { label: 'Sun', sublabel: '2nd house • Leo', first: 'Heat, eyes, teeth, mouth, authority conflicts', second: 'Traditional note: the 2nd house is a maraka house; use care with heat, driving, and confrontations.', nature: 'malefic' },
    { label: 'Ketu', sublabel: '2nd house • Leo', first: 'Cuts, sudden separation, unclear speech, dental concerns', second: 'Traditional note: Ketu in a maraka house can indicate sudden or hard-to-read disruptions; avoid risky impulsive acts.', nature: 'malefic' },
    { label: 'Moon', sublabel: '3rd house • Virgo', first: 'Arms, shoulders, short journeys, nervous strain', second: 'Watch distraction, fatigue, and rushed travel; the Moon changes quickly.', nature: 'benefic' },
    { label: 'Mercury', sublabel: '3rd house • Virgo', first: 'Hands, nerves, vehicles, communication mistakes', second: 'Double-check documents, tools, routes, and decisions made under pressure.', nature: 'malefic' },
    { label: 'Venus', sublabel: '4th house • Libra', first: 'Chest, comfort-related excess, domestic accidents', second: 'Keep the home calm and avoid carelessness around water, heat, and luxury habits.', nature: 'mixed' },
    { label: 'Pluto', sublabel: '7th house • Capricorn', first: 'Intense relationship or shared-resource crises', second: 'Modern symbolic reading: use boundaries and caution in high-control situations.', nature: 'mixed' },
    { label: 'Rahu', sublabel: '8th house • Aquarius', first: 'Sudden events, hidden hazards, technology and unusual environments', second: 'Use extra checks with travel, machinery, electricity, and unfamiliar places.', nature: 'malefic' },
    { label: 'Saturn', sublabel: '9th house • Pisces', first: 'Falls, bones, hips, knees, long journeys', second: 'Move patiently, maintain equipment, and avoid rushing physical work.', nature: 'malefic' },
    { label: 'Uranus', sublabel: '11th house • Taurus', first: 'Sudden shocks, electrical issues, ankles and circulation', second: 'Modern symbolic reading: expect the unexpected and keep safety systems current.', nature: 'mixed' },
    { label: 'Mars', sublabel: '12th house • Gemini', first: 'Cuts, burns, haste, sleep loss, hidden inflammation', second: 'Use protective equipment, slow down, and avoid driving or tools while exhausted.', nature: 'benefic' },
    { label: 'Jupiter', sublabel: '1st house • Cancer', first: 'Excess, weight, liver and judgment through overconfidence', second: 'Traditional benefic protection is strongest with moderation and good judgment.', nature: 'benefic' },
  ],
};
const detailTabs = [
  { key: 'health', label: 'Health' }, { key: 'bodyParts', label: 'Body Parts' }, { key: 'foods', label: 'Foods' }, { key: 'businesses', label: 'Businesses' },
  { key: 'jobs', label: 'Jobs' }, { key: 'gemstones', label: 'Gemstones' }, { key: 'crystals', label: 'Healing Crystals' }, { key: 'colors', label: 'Colors' },
  { key: 'metals', label: 'Metals' }, { key: 'directions', label: 'Direction' }, { key: 'objects', label: 'Objects' }, { key: 'countries', label: 'Countries' }, { key: 'oils', label: 'Ayurvedic Oils' }, { key: 'subjects', label: 'Subjects' }, { key: 'gods', label: 'Gods' }, { key: 'trees', label: 'Trees' }, { key: 'familyRelations', label: 'Family Relations' }, { key: 'risks', label: 'Accidents & Maraka' }, { key: 'bestTimes', label: 'Best Time' }, { key: 'mantras', label: 'Mantras' }, { key: 'remedies', label: 'Remedies' },
];

const dateAtMidnight = (value) => new Date(`${value}T00:00:00`);
const sameCalendarDate = (date, value) => date.getTime() === dateAtMidnight(value).getTime();
const ordinalHouse = (house) => `${house}${house === 1 ? 'st' : house === 2 ? 'nd' : house === 3 ? 'rd' : 'th'}`;
const transitPositionForDate = (planet, selectedDate) => {
  const date = dateAtMidnight(selectedDate);
  const transition = (entry, exit, afterHouse, afterSign, beforeHouse, beforeSign) => date >= dateAtMidnight(entry) && date < dateAtMidnight(exit) ? { currentHouse: planet.currentHouse, sign: planet.sign } : date >= dateAtMidnight(exit) ? { currentHouse: afterHouse, sign: afterSign } : { currentHouse: beforeHouse, sign: beforeSign };

  if (planet.englishName === 'Sun') return transition('2026-08-17', '2026-09-17', 3, 'Virgo', 1, 'Cancer');
  if (planet.englishName === 'Jupiter') {
    if (date < dateAtMidnight('2026-06-02')) return { currentHouse: 12, sign: 'Gemini' };
    if (date < dateAtMidnight('2026-10-31')) return { currentHouse: 1, sign: 'Cancer' };
    if (date < dateAtMidnight('2027-01-25')) return { currentHouse: 2, sign: 'Leo' };
    if (date < dateAtMidnight('2027-06-26')) return { currentHouse: 1, sign: 'Cancer' };
    return { currentHouse: 2, sign: 'Leo' };
  }
  if (planet.englishName === 'Mars') return transition('2026-08-31', '2026-10-21', 1, 'Cancer', 11, 'Taurus');
  if (planet.englishName === 'Ketu') return date < dateAtMidnight('2027-11-01') ? { currentHouse: 2, sign: 'Leo' } : { currentHouse: 1, sign: 'Cancer' };
  if (planet.englishName === 'Rahu') return date < dateAtMidnight('2027-11-01') ? { currentHouse: 8, sign: 'Aquarius' } : { currentHouse: 7, sign: 'Capricorn' };
  if (planet.englishName === 'Saturn') {
    if (date < dateAtMidnight('2025-03-29')) return { currentHouse: 8, sign: 'Aquarius' };
    if (date < dateAtMidnight('2027-06-01')) return { currentHouse: 9, sign: 'Pisces' };
    if (date < dateAtMidnight('2027-11-03')) return { currentHouse: 10, sign: 'Aries' };
    if (date < dateAtMidnight('2029-05-01')) return { currentHouse: 9, sign: 'Pisces' };
    return { currentHouse: 10, sign: 'Aries' };
  }
  if (planet.englishName === 'Uranus') {
    if (date < dateAtMidnight('2019-01-01')) return { currentHouse: 10, sign: 'Aries' };
    if (date < dateAtMidnight('2033-01-01')) return { currentHouse: 11, sign: 'Taurus' };
    return { currentHouse: 12, sign: 'Gemini' };
  }
  if (planet.englishName === 'Pluto') {
    if (date < dateAtMidnight('2008-01-01')) return { currentHouse: 6, sign: 'Sagittarius' };
    if (date < dateAtMidnight('2040-01-01')) return { currentHouse: 7, sign: 'Capricorn' };
    return { currentHouse: 8, sign: 'Aquarius' };
  }
  if (planet.englishName === 'Mercury') {
    if (date >= dateAtMidnight('2026-08-29') && date < dateAtMidnight('2026-09-11')) return { currentHouse: 3, sign: 'Virgo' };
    if (date >= dateAtMidnight('2026-10-23') && date < dateAtMidnight('2026-11-12')) return { currentHouse: 3, sign: 'Virgo' };
    return date < dateAtMidnight('2026-08-29') ? { currentHouse: 2, sign: 'Leo' } : { currentHouse: 4, sign: 'Libra' };
  }
  if (planet.englishName === 'Venus') {
    if (date >= dateAtMidnight('2026-09-01') && date < dateAtMidnight('2026-09-25')) return { currentHouse: 4, sign: 'Libra' };
    return date < dateAtMidnight('2026-09-01') ? { currentHouse: 3, sign: 'Virgo' } : { currentHouse: 5, sign: 'Scorpio' };
  }
  if (planet.englishName === 'Moon') {
    if (sameCalendarDate(date, '2026-09-13')) return { currentHouse: 3, sign: 'Virgo' };
    if (sameCalendarDate(date, '2026-09-14')) return { currentHouse: 4, sign: 'Libra' };
    return { currentHouse: planet.currentHouse, sign: planet.sign };
  }
  return { currentHouse: planet.currentHouse, sign: planet.sign };
};
const AstroChart = ({ chart, isGochara, transitPlanets = movingPlanets }) => {
  const livePositions = isGochara ? transitPlanets.reduce((result, planet) => ({ ...result, [planet.symbol]: planet.currentHouse }), {}) : {};
  const cells = houseSlots.map((slot) => ({
    key: `house-${slot.house}`,
    signs: [{ text: slot.house, x: slot.x, y: slot.y }],
    planets: (isGochara ? [
      ...transitPlanets.filter((planet) => livePositions[planet.symbol] === slot.house).map((planet) => ({ text: planet.symbol, color: planet.color })),
    ] : (chart.placements[slot.house] || []).map((name) => ({ text: planetNames[name] || name }))).map((planet, index, allPlanets) => ({ ...planet, x: slot.planetX + (index - (allPlanets.length - 1) / 2) * 10, y: slot.planetY })),
  }));

  return (
    <div className={styles.chartFrame}>
      <svg className={styles.chart} viewBox="0 0 120 120" role="img" aria-label={`${chart.title} South Indian astrology chart`}>
        <rect className={styles.chartFill} x="1" y="1" width="118" height="118" />
        <path className={styles.chartLine} d="M40 1v39H1M80 1v39h39M1 80h39v39M119 80H80v39M1 40h118M1 80h118M1 1l40 39M119 1L80 40M1 119l40-39M119 119L80 80M40 40h40v40H40z" />
        {cells.map((cell) => <g key={cell.key} className={styles.house}>{cell.signs.map((sign) => <text key={`${cell.key}-${sign.text}`} className={styles.signNumber} x={sign.x} y={sign.y}>{sign.text}</text>)}{cell.planets.map((planet, index) => <text key={`${cell.key}-${planet.text}-${index}`} className={styles.planet} style={{ fill: planet.color || undefined }} x={planet.x} y={planet.y}>{planet.text}</text>)}</g>)}
        <text className={styles.centerLabel} x="60" y="60" textAnchor="middle">{isGochara ? 'CANCER' : chart.ascendant.toUpperCase()}</text>
        
      </svg>
    </div>
  );
};

const DetailsSummary = ({ activeTab, onTabChange }) => {
  const items = planetDetails[activeTab];
  const isHealth = activeTab === 'health';
  const positiveItems = items.filter((item) => item.nature === 'benefic' || item.nature === 'mixed');
  const watchItems = items.filter((item) => item.nature === 'malefic' || item.nature === 'neutral');
  const itemHeading = { foods: 'Related Foods', businesses: 'Business Fields', jobs: 'Job Fields', gemstones: 'Gemstone', crystals: 'Healing Crystal', colors: 'Recommended Colors', metals: 'Metal', directions: 'Direction', objects: 'Related Objects', countries: 'Related Countries', oils: 'Related Oils', subjects: 'Related Subjects', gods: 'Related Gods', trees: 'Related Trees', familyRelations: 'Ancestors / Siblings', risks: 'Accident / Maraka Themes', bodyParts: 'Body Parts', bestTimes: 'Recommended Window', mantras: 'Mantra', remedies: 'Remedy' }[activeTab] || 'Details';
  const guidanceHeading = isHealth ? 'Possible Effects' : 'Guidance';
  return (
    <section className={styles.detailsSummary}>
      <nav className={styles.detailTabs} aria-label="Planet details">
        {detailTabs.map((tab) => <button key={tab.key} className={activeTab === tab.key ? styles.activeDetailTab : ''} onClick={() => onTabChange(tab.key)}>{tab.label}</button>)}
      </nav>
      <div className={styles.summaryTitle}>{detailTabs.find((tab) => tab.key === activeTab)?.label} by Planet</div>
      <p className={styles.healthDisclaimer}>{isHealth ? 'For Cancer ascendant • 1992-12-03 21:31 • Kurunegala. Astrological indications only, not a medical diagnosis.' : activeTab === 'risks' ? 'Traditional astrological themes only. This is not a prediction of accidents or death. Follow real-world safety guidance and seek professional help when needed.' : 'Traditional astrological associations for reflection and planning, not medical, financial, or professional advice.'}</p>
      <div className={styles.healthLegend}><span className={styles.beneficKey}>Benefic / supportive</span><span className={styles.maleficKey}>Malefic / challenging</span><span className={styles.mixedKey}>Mixed / modern</span></div>
      <div className={styles.detailTable}>
        <div className={styles.detailHeader}><span>Planet / House</span><span>{isHealth ? 'Body Parts' : itemHeading}</span><span>{guidanceHeading}</span></div>
        {items.map((item) => <div className={`${styles.detailRow} ${styles[item.nature]}`} key={item.label}><strong>{item.label}<small>{item.sublabel}</small></strong><span>{item.first}</span><span>{item.second}</span></div>)}
      </div>
      <div className={styles.tabSummary}>
        <div className={`${styles.summaryColumn} ${styles.goodSummary}`}>
          <h3>Good Things</h3>
          {positiveItems.map((item) => <p key={`good-${item.label}`}><strong>{item.label}</strong> {item.second}</p>)}
        </div>
        <div className={`${styles.summaryColumn} ${styles.watchSummary}`}>
          <h3>Things to Watch</h3>
          {watchItems.map((item) => <p key={`watch-${item.label}`}><strong>{item.label}</strong> {item.second}</p>)}
        </div>
      </div>
    </section>
  );
};

const LifeSection = ({ entries, form, loading, saving, deletingId, message, onChange, onSubmit, onDelete }) => (
  <section className={styles.lifeSection}>
    <form className={styles.lifeForm} onSubmit={onSubmit}>
      <div className={styles.lifeFormGrid}>
        <label>
          Title
          <input name="title" value={form.title} onChange={onChange} required />
        </label>
        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={onChange} required />
        </label>
        <label>
          Time
          <input type="time" name="time" value={form.time} onChange={onChange} />
        </label>
      </div>
      <label>
        Comments
        <textarea name="comments" value={form.comments} onChange={onChange} rows="4" />
      </label>
      <div className={styles.lifeFormFooter}>
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        {message && <span className={styles.lifeMessage}>{message}</span>}
      </div>
    </form>
    <div className={styles.lifeRecords}>
      <div className={styles.summaryTitle}>Saved life entries</div>
      {loading ? <p className={styles.lifeEmpty}>Loading entries...</p> : entries.length === 0 ? <p className={styles.lifeEmpty}>No life entries saved yet.</p> : <div className={styles.lifeTable}>
        <div className={styles.lifeTableHeader}><span>Title</span><span>Date</span><span>Time</span><span>Comments</span><span>Action</span></div>
        {entries.map((entry) => <div className={styles.lifeTableRow} key={entry.id}><strong>{entry.title}</strong><span>{entry.date}</span><span>{entry.time ? entry.time.slice(0, 5) : 'Not set'}</span><span>{entry.comments || 'No comments'}</span><button type="button" className={styles.deleteLifeButton} onClick={() => onDelete(entry.id)} disabled={deletingId === entry.id}>{deletingId === entry.id ? 'Deleting...' : 'Delete'}</button></div>)}
      </div>}
    </div>
  </section>
);

const Astro = () => {
  const [activeChart, setActiveChart] = useState('lagna');
  const [selectedDate, setSelectedDate] = useState('2026-09-13');
  const [activeDetailTab, setActiveDetailTab] = useState('health');
  const [lifeEntries, setLifeEntries] = useState([]);
  const [lifeForm, setLifeForm] = useState({ title: '', date: '', time: '', comments: '' });
  const [lifeLoading, setLifeLoading] = useState(false);
  const [lifeSaving, setLifeSaving] = useState(false);
  const [lifeDeletingId, setLifeDeletingId] = useState('');
  const [lifeMessage, setLifeMessage] = useState('');
  const chart = charts[activeChart];
  const isGochara = activeChart === 'gochara';
  const isLife = activeChart === 'life';
  const evaluatedPlanets = movingPlanets.map((planet) => ({ ...planet, ...transitPositionForDate(planet, selectedDate) }));

  useEffect(() => {
    if (!isLife) return undefined;

    let cancelled = false;
    fetch('/api/life')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load life entries.');
        return response.json();
      })
      .then((entries) => {
        if (!cancelled) setLifeEntries(entries);
      })
      .catch((error) => {
        if (!cancelled) setLifeMessage(error.message);
      })
      .finally(() => {
        if (!cancelled) setLifeLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLife]);

  const handleLifeChange = (event) => {
    const { name, value } = event.target;
    setLifeForm((current) => ({ ...current, [name]: value }));
  };

  const handleLifeSubmit = async (event) => {
    event.preventDefault();
    setLifeSaving(true);
    setLifeMessage('');

    try {
      const response = await fetch('/api/life', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lifeForm),
      });
      const entry = await response.json();
      if (!response.ok) throw new Error(entry.error || 'Unable to save life entry.');
      setLifeEntries((current) => [entry, ...current]);
      setLifeForm({ title: '', date: '', time: '', comments: '' });
      setLifeMessage('Saved.');
    } catch (error) {
      setLifeMessage(error.message);
    } finally {
      setLifeSaving(false);
    }
  };

  const handleLifeDelete = async (id) => {
    setLifeDeletingId(id);
    setLifeMessage('');

    try {
      const response = await fetch(`/api/life?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const result = response.status === 204 ? null : await response.json();
      if (!response.ok) throw new Error(result?.error || 'Unable to delete life entry.');
      setLifeEntries((current) => current.filter((entry) => entry.id !== id));
      setLifeMessage('Deleted.');
    } catch (error) {
      setLifeMessage(error.message);
    } finally {
      setLifeDeletingId('');
    }
  };

  return (
    <main className={styles.container}>
     
      <section className={styles.workspace}>
        <nav className={styles.tabs} aria-label="Chart types">
          {Object.entries(charts).map(([key, item]) => <button key={key} className={activeChart === key ? styles.activeTab : ''} onClick={() => { setActiveChart(key); if (key === 'life' && activeChart !== key) { setLifeLoading(true); setLifeMessage(''); } }}>{item.title}<span>{key === 'gochara' ? 'transits' : key === 'life' ? 'journal' : key === 'lagna' ? 'D-1' : 'D-9'}</span></button>)}
        </nav>
        <div className={styles.chartHeader}>
          <div><div className={styles.kicker}>{chart.eyebrow}</div><h2>{chart.title}</h2><p>{chart.description}</p></div>
          <div className={styles.chartMeta}><strong>{chart.ascendant}</strong><span>{chart.date}</span></div>
          {isGochara && <label className={styles.datePicker}>Position date<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>}
        </div>
        {isLife ? <LifeSection entries={lifeEntries} form={lifeForm} loading={lifeLoading} saving={lifeSaving} deletingId={lifeDeletingId} message={lifeMessage} onChange={handleLifeChange} onSubmit={handleLifeSubmit} onDelete={handleLifeDelete} /> : <>
        <div className={styles.chartContent}>
          <AstroChart chart={chart} isGochara={isGochara} transitPlanets={evaluatedPlanets} />
          <aside className={styles.insightPanel}>
            <div className={styles.panelHeading}><span>PLANETARY LEDGER</span>{isGochara && <span className={styles.live}><i /> LIVE</span>}</div>
            {isGochara ? <div className={styles.transitSummary}><div className={styles.summaryTitle}>Planetary Transit Dates (2026–2027)</div><div className={styles.transitLegend}><span className={styles.beneficKey}>Benefic</span><span className={styles.maleficKey}>Malefic</span><span className={styles.mixedKey}>Mixed</span></div><div className={styles.transitTable}><div className={styles.transitTableHeader}><span>Planet</span><span>House (Sign)</span><span>Entry Date</span><span>Exit Date</span></div>{transitSummary.map((planet) => { const evaluated = evaluatedPlanets.find((item) => item.name === planet.name); return <div className={`${styles.transitTableRow} ${styles[planetNature[planet.name] || 'neutral']}`} key={planet.name}><strong>{planet.name}</strong><span>{evaluated ? `${ordinalHouse(evaluated.currentHouse)} (${evaluated.sign})` : planet.house}</span><span>{planet.entry}</span><small>{planet.exit}</small></div>; })}</div></div> : Object.entries(chart.placements).flatMap(([house, planets]) => planets.map((planet) => <div className={styles.planetRow} key={`${house}-${planet}`}><span className={styles.planetBadge}>{planetNames[planet]}</span><div><strong>{planet}</strong><small>House {house}{chart.aspects?.[planet] ? ` / aspect by ${chart.aspects[planet]}` : ''}</small></div><span className={styles.arrow}>↗</span></div>))}
          </aside>
        </div>
        {isGochara && <DetailsSummary activeTab={activeDetailTab} onTabChange={setActiveDetailTab} />}
        </>}
        
      </section>
    </main>
  );
};

export default Astro;

---
version: "alpha"
name: CogniFlip
description: "Starter design direction for an Indonesian-first, child-friendly AI learning and coding platform; finalize from Google Stitch after exploration and approval."
colors:
  primary: "#172033"
  secondary: "#4F7DE8"
  tertiary: "#C7F36B"
  neutral: "#F7F6F0"
  surface: "#FFFFFF"
  muted: "#64748B"
  border: "#DCE2E8"
  success: "#18794E"
  warning: "#8A5700"
  danger: "#B42318"
typography:
  display:
    fontFamily: "Nunito Sans"
    fontSize: "2.5rem"
    fontWeight: 800
  heading:
    fontFamily: "Nunito Sans"
    fontSize: "1.5rem"
    fontWeight: 700
  body:
    fontFamily: "Nunito Sans"
    fontSize: "1rem"
    fontWeight: 400
  caption:
    fontFamily: "Nunito Sans"
    fontSize: "0.875rem"
    fontWeight: 500
  code:
    fontFamily: "JetBrains Mono"
    fontSize: "0.9375rem"
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  xl: "28px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px"
  card-learning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

## Overview
CogniFlip is an AI learning and coding platform built around explaining, predicting, testing, and revising. The visual identity should feel warm, curious, clear, energetic, and trustworthy for elementary-school learners without looking overly childish or generic. This file is a starter for exploration, not an approved final style. Google Stitch's final approved visual decisions must replace or refine these initial choices.

## Colors
Use a calm neutral base with a restrained lime accent and clear navy text. Do not use the lime accent as a text color on a light background. Every status must pair color with readable text or an icon. Validate the final palette and component pairs for contrast before implementation.

## Typography
Use readable sans-serif typography with strong Indonesian glyph support and comfortable sizing for younger readers. Code uses a distinct monospace typeface. The names above are initial suggestions and can be changed in Stitch after visual review.

## Layout
Use generous whitespace, clear content hierarchy, one dominant action per learning step, and progressive disclosure for advanced coding controls. Desktop may use a compact sidebar; mobile needs a simple, uncluttered navigation pattern. Avoid horizontal page overflow; a code editor can scroll within its own bounded viewport.

## Elevation & Depth
Prefer subtle, consistent surface separation rather than heavy shadows or glassmorphism. Use depth only to clarify interactive hierarchy.

## Shapes
Use friendly but disciplined corner radii and consistent spacing. Illustrations and the CogniFlip learning companion should have one coherent visual style across the platform.

## Components
Required reusable component concepts include buttons, form fields, lesson cards, progress path, AI/robot messages, rubric score cards, evidence snippets, code findings, editor shell, dialogs, live status, room status, profile/achievement cards, and community moderation controls. Final visual states must be based on approved Stitch screens and implemented accessibly.

## Do's and Don'ts
- Do use short, age-appropriate Indonesian instructions and visually obvious next steps.
- Do design desktop and mobile layouts and relevant loading, empty, error, success, validation, unavailable, and retry states.
- Do use subtle animations that respect reduced-motion preferences.
- Do not rely on color alone, hover alone, or tiny controls.
- Do not turn the child-facing learning path into a dense professional dashboard.
- Do not treat a static screenshot, Stitch prototype, or generated HTML as proof that application behavior works.

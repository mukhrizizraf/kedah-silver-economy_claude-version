# Kedah Silver Economy (Claude version)

A redesign of the Kedah Silver Economy pitch dashboard for the UUM Scale-Up
Research Grant 2026 proposal *Integrated Islamic Elderly Care Ecosystem: A
Proof-of-Concept Study for Kedah State*.

This is Claude's own version. It keeps the same eight pages, content, data and
English / Bahasa Melayu switch as the main version
([mukhrizizraf/kedah-silver-economy](https://github.com/mukhrizizraf/kedah-silver-economy)),
and gives them a new look and feel:

- **iOS structure:** an iPad sidebar on wide screens, an iOS tab bar with More
  on phones, a frosted nav bar with large titles, segmented controls, grouped
  lists and bottom sheets.
- **iOS page transitions:** the browser's own cross-document view transition
  plays an iOS push (forward and back in page order). Chrome also prerenders a
  page when you rest the pointer on its link.
- **Colour and type:** warm milk ground with a quiet colonnade of round-topped
  pillars, Instrument Serif large titles, SF Pro (Inter off Apple devices), one
  olive tint and one midnight surface. Dark mode is a deep olive.
- **Eight looks:** a round palette button at the top right switches the
  colours and fonts of the whole site: Padi, Songket, Diraja, Teratai,
  Kayu Jati, Wau, Malam and Jelas (large, high contrast).
- **Lottie:** small self-hosted animations (a "help nearby" pulse, the iOS
  spinner for slow pages, a success tick).
- **Light weight:** images and scripts load fast on a weak connection.

## Images

- **Pictures:** recut and recoloured from the main version's 3D illustration
  set, with the owner's permission. Each one has a new crop and this
  version's colour grade. `tools/recut_images.py` rebuilds them all.
- **Tab icon:** a small songket crest drawn for this version as SVG
  (`assets/art/songket-crest.svg`, from `tools/songket_art.py`).
- **Team portraits:** from the main version, at the owner's request.

## Run it

No build step. Open `index.html` in a browser, or serve the folder with any
static server. The page transitions need http(s) (they do not run from
`file://`).

## Important

- The organisation list is a sample. Only records marked Confirmed are backed
  by a source.
- "Try a case" is the project's own work and the blueprint for a future iOS
  and Android app. One question per screen, for the older person or a helper;
  every answer joins one case, and the case becomes one assistance plan with
  possible matches, reasons, contact cards that open in Google Maps, one trip
  for all visits, a read-aloud option, sharing with family and a follow-up
  reminder. "Get ready to apply" shows which LZNK, MAIK and JKM schemes may
  fit and why, one shared checklist of papers to bring, where to apply, and a
  printable form summary (personal details are left blank to write by hand).
  What each organisation can offer is sample data until Phase 1 checks it;
  scheme rules come from the agencies' public pages (checked October 2026).
  The plan never promises help or decides who qualifies.

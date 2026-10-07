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

## Copyright copy

A separate folder, `ICC copyright version` (outside this repo), holds a
four-page, offline copy for a UUM copyright filing: Overview, Try a case, Data
blueprint and Our Silver App. It has no picture files; every picture is drawn
in code. Since October 2026 it carries the name "Silver Economy" (the Overview
title is "Integrated Islamic care for older people") and the giving side of
Try a case. It is not published in this repo; it has its own repo,
[mukhrizizraf/silver-economy-icc-uum-version-](https://github.com/mukhrizizraf/silver-economy-icc-uum-version-),
with a full source listing (`SOURCE-CODE.pdf`, SHA-256 per file).

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
- **Try a case also has a giving side** (October 2026), from the i-CareElder
  framework's "Contribution and reciprocity": the first screen asks whether
  the older person wants to get help or to give. Giving covers sedekah or a
  donation, cash waqf, sponsoring an older person, giving things,
  volunteering, sharing skills and peer support, and ends in one giving plan.
  It never asks how much. Money goes only through official routes: the kariah
  masjid (tabung or its own DuitNow QR), LZNK Sadaqah4Ummah, MAIK infaq, and
  waqf only through MAIK; the plan never takes money and shows no account
  numbers. Volunteers are pointed first to the JKM volunteer scheme (every
  district, no upper age limit), then to a PAWE centre in their district (16
  on JKM's register) and to NGOs from their own public pages. The NGOs show as
  "To check" until Phase 1 confirms they take older volunteers. The giving
  rules live in `assets/js/kse-give.js`; the help rules are unchanged.
- **Our Silver App** mock has thirteen screens: the help path, plus a giving
  branch shaped like a digital masjid tabung (one link per masjid, once, every
  Friday or every month, private giving, the masjid's own DuitNow QR, a giving
  record kept on the phone). The app never holds money.

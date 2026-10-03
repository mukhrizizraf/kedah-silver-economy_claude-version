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
- **Overview in chapters:** the first page reads like a book on a black ground:
  huge light capitals (Zodiak), printed family photos floating gently around
  the words, and four chapters on their own colours (songket red, walnut,
  cream, black) edged with a songket band, with gold as the one accent. Body
  text is Switzer.
- **Lottie:** small self-hosted animations (a "help nearby" pulse, the iOS
  spinner for slow pages, a success tick).
- **Light weight:** images and scripts load fast on a weak connection.

## Images and fonts

- **Pictures:** recut and recoloured from the main version's 3D illustration
  set, with the owner's permission. Each one has a new crop and this
  version's colour grade. `tools/recut_images.py` rebuilds them all.
- **Songket art:** a narrow border band and a small crest (the tab icon) drawn
  for this version as SVG (`assets/art/`). `tools/songket_art.py` redraws
  them.
- **Team portraits:** from the main version, at the owner's request.
- **Fonts:** Zodiak and Switzer from Fontshare (free licence), kept in
  `assets/fonts/` so the site also works from a USB stick with no network.

## Run it

No build step. Open `index.html` in a browser, or serve the folder with any
static server. The page transitions need http(s) (they do not run from
`file://`).

## Important

- The organisation list is a sample. Only records marked Confirmed are backed
  by a source.
- The "Try a case" component is the project's own work and the blueprint for a
  future iOS and Android app. Its logic is unchanged from the main version:
  the same inputs give the same case ID in both versions.

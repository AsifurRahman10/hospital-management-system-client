# Dental Clinic Homepage Design Specification

## 1. Project and Figma Source

- **Design:** Blue Hospital Dental Clinic Official Homepage Design, Free Landing Page Template (Community file).
- **Figma file key:** `8lehGuSVsdVMWLCtgfqBtg`
- **Source frame:** `Hospital-index`, node `1:17`.
- **Figma URL:** [Open the source frame](https://www.figma.com/design/8lehGuSVsdVMWLCtgfqBtg/Blue-Hospital-Dental-Clinic-Official-Homepage-Design--Free-Landing-Page-Template---Community-?node-id=1-17)
- **Inspection:** Figma MCP returned design context, node metadata, and screenshot for the specified frame. The returned screenshot's original dimensions are 1200 × 4654 px; the delivered preview was scaled to 265 × 1024 px.
- **Session note:** The MCP `create_session` result was rejected by read operations. Read-only calls succeeded without the session ID. No edits were made to the Figma file.

## 2. Design Overview

A long-form dental clinic landing page with a light gray-blue canvas, strong royal-blue calls to action, mint accents, Manrope typography, patient/clinic imagery in geometric collages, and repeated appointment prompts. Its section sequence is:

1. Header and hero
2. About us
3. Services and appointment banner
4. Doctors
5. Testimonials and appointment form
6. Map/contact area
7. Footer

The single inspected frame is a desktop-sized 1200 px-wide page. No alternate viewport or responsive frame was returned.

## 3. Frame Dimensions and Page Structure

All coordinates below are from metadata and are relative to the parent page/frame unless stated. Dimensions are in Figma pixels.

| Order | Section / node                                  |             Position |              Size | Background / notes                                                                   |
| ----- | ----------------------------------------------- | -------------------: | ----------------: | ------------------------------------------------------------------------------------ |
| 1     | Header + hero, `1:18`                           |             `(0, 0)` |      `1200 × 566` | `#f3f5f9`; inner frame `1:19` is `(60, 0)`, `1080 × 566`                             |
| 2     | About us, `1:45`                                |           `(0, 566)` |      `1200 × 407` | White; content frame `1:46` is `(60, 60)`, `1080 × 287`                              |
| 3     | Services + appointment banner, `1:63`           |           `(0, 973)` |     `1200 × 1288` | `#f3f5f9`; content frame `1:64` is `(60, 60)`, `1080 × 1168`                         |
| 4     | Doctors, `1:95`                                 |          `(0, 2261)` |      `1200 × 525` | White; section content starts at `(60, 60)`                                          |
| 5     | Testimonials + second appointment form, `1:121` |          `(0, 2786)` |     `1200 × 1148` | `#f3f5f9`; content frame `1:122` is `(60, 60)`, `1080 × 1028`                        |
| 6     | Map/contact area, `1:182`                       |          `(0, 3934)` |      `1200 × 554` | Background image fills the section in design context; metadata lists no child layers |
| 7     | Footer, `1:211`                                 |          `(0, 4488)` |      `1200 × 166` | `#f3f5f9`; inner frame `1:212` is `(60, 60)`, `1080 × 46`                            |
|       | **Root**, `1:17`                                | `(424, 0)` in parent | **`1200 × 4654`** | `Hospital-index`                                                                     |

The centered desktop content width is 1080 px in the header/hero, About, Services, Testimonials, and footer. With a 1200 px frame, this yields 60 px side margins in those sections. Some nested content deliberately extends beyond that width; see Doctors.

## 4. Section-by-Section Breakdown

### 4.1 Header and Hero

- **Nodes:** section `1:18`; content `1:19`; header row `1:20`; hero row `1:30`.
- **Section:** 1200 × 566 px; `#f3f5f9`. Inner content is 1080 px wide, x=60.
- **Header row:** 1080 × 86 px, top aligned; 20 px vertical padding and 20 px item gap are present in the generated layout context. Brand `Duozhuamiao` (`1:21`) at left, five centered navigation labels (`1:22`–`1:27`), outlined appointment button (`1:28`) at right, 167 × 46 px in metadata.
- **Navigation:** About us, Services, Doctors, Testimonials, Contacts. Manrope Medium 14 px, black, 20 px gap.
- **Hero row:** node `1:30`, 1080 × 480 px at y=86; 100 px gap between text and image collage; vertical padding is 70 px. Left text block `1:31` is 492 px wide and vertically centered. Heading `1:32`: “High-quality and painless dentistry”, Manrope ExtraBold 52 px, 1.2 line height, black with “dentistry” in `#3167d9`. Supporting copy `1:33`: Manrope Medium 14 px, 1.2 line height, 60% black. Primary CTA `1:34`: “Make Appointment”, metadata 167 × 46 px.
- **Hero collage:** node `1:36`, 488 × 340 px, positioned x=592, y=70 in hero row. Composed of asymmetrically cropped image rectangles, blue and mint blocks/circle; 10 px gaps. Main right photo is 220 × 340 px with upper-left 80 px and lower-right 80 px corners, other corners 5 px (`1:44`). Other collage slots: 124 × 177, 258 × 103, and 124 × 177 px, with various 40–50 px asymmetric corners (`1:39`–`1:43`).

### 4.2 About Us

- **Nodes:** section `1:45`; content `1:46`; collage `1:47`; copy `1:52`.
- **Section:** white, 1200 × 407 px; 60 px vertical section padding.
- **Layout:** centered 1080 × 287 px row, horizontally aligned; 110 px gap. Left collage width 478 px. Right copy width 492 px.
- **Collage:** image slots `1:49` (269 × 100 px), `1:51` (478 × 177 px), with a 60 px mint circle `1:50`; 10 px vertical gap. Image corner treatments are asymmetric: small 5 px corners paired with 40 px or 80 px corners.
- **Copy:** mint uppercase eyebrow “ABOUT US” (`1:53`), 14 px ExtraBold. Heading “Patient health is the highest value in our work” (`1:54`), 40 px ExtraBold, 1.2 line height. Body (`1:55`) 14 px Medium, 1.2 line height, 60% black. Actions: blue “Learn More” button (`1:57`) and 40 × 40 px play icon (`1:58`), 10 px apart.

### 4.3 Services and Appointment Banner

- **Nodes:** section `1:63`; content `1:64`; heading `1:65`; card grid `1:68`; banner `1:83`.
- **Section:** `#f3f5f9`, 1200 × 1288 px, 60 px vertical padding. Main content width 1080 px; vertical stack gap 40 px.
- **Heading:** centered, 75 px high. Eyebrow “Services” is mint, 14 px ExtraBold. Main heading “High quality services for you” is black, 40 px ExtraBold, centered. 10 px between lines.
- **Service grid:** 1080 × 606 px, starts 115 px below section content top. Two rows of three cards. Each card is 340 × 288 px; 30 px horizontal and vertical gaps. White background, 40 px padding, 20 px radius, 20 px vertical stack gap. Icon backing uses `#e7fcfa`, 10 px padding, and 20 px radius; icon itself 24 × 24 px. Card title: 24 px ExtraBold, black. Description: 14 px Medium, 60% black. “Read more”: 14 px ExtraBold, `#3167d9`.
- **Repeated content:** row 1 titles: Implant dentistry, Surgery dentistry, Dental treatment. Row 2 repeats those three titles. Description is repeated placeholder-like copy about restoration of chewing function and aesthetics. Icon assets repeat across corresponding cards (see asset inventory).
- **Appointment banner:** node `1:83`, 1080 × 407 px at content offset `(0, 761)`. Blue `#3167d9`, 40 px radius, drop shadow; 110 px horizontal and 60 px vertical padding; internal columns have 40 px gap. Left column 410 px wide, eyebrow “ABOUT US” in mint 14 px, title “Make an Appointment” white 40 px ExtraBold, body 14 px Medium in 60% white, then white button with blue text. Right collage combines portrait/clinic photos and a 60 px mint circle.

### 4.4 Doctors

- **Nodes:** section `1:95`; header `1:96`; controls `1:100`; cards row `1:111`.
- **Section:** white, 1200 × 525 px, 60 px padding. Header row at `(60, 60)`, size 1080 × 75 px.
- **Header:** mint “DOCTORS” 14 px ExtraBold and “Meet our qualified dentists” 40 px ExtraBold. Two arrow controls at right: each 34 × 34 px, 4 px radius, with a 24 × 24 px icon in 5 px padding; one white with blue border, one blue filled.
- **Profile row:** metadata gives x=60, y=165, width 1180, height 300 px. Five cards, each 220 px wide, separated by 20 px; their total 1180 px means the row extends 40 px beyond the section's 1140 px inner width. Card instances are `1:112`, `1:117`–`1:120`. Four cards are 281 px tall by component dimensions; the final metadata instance is 300 px tall. Card fill `#f8f7fc`, 20 px padding, 20 px radius, 20 px vertical gap. Portrait slot is 180 × 175 px in generated context (full card inner width), with 20 px radius. Name is 16 px ExtraBold; role “Implant surgeon” is 14 px Regular. Names shown: Darrell Steward, Jacob Jones, Jane Cooper, Kristin Watson, Ronald Richards.

### 4.5 Testimonials and Appointment Form

- **Nodes:** section `1:121`; content `1:122`; top row `1:123`; testimonial `1:133` / card `1:136`; appointment banner `1:164`.
- **Section:** `#f3f5f9`, 1200 × 1148 px; 60 px vertical padding; content frame 1080 × 1028 px with 80 px gap between top content and appointment banner.
- **Top row:** 1080 × 490 px, 40 px gap. Left collage is 548 × 490 px with blue/mint geometry and five circular portraits (80, 80, 107, 132, and another 80 px nodes as listed in metadata; the primary blue shape is 150 × 286 px and mint shape is 150 × 106 px). Right column is 492 px wide and vertically centered around y≈60.
- **Testimonial copy:** mint “TESTIMONIALS” label 14 px ExtraBold; heading “Check what our patients say about us” 40 px ExtraBold. Testimonial card is 492 × 217.16 px, `#e2f2f4`, 20 px radius and padding, 20 px internal gaps. Quote glyph asset is approximately 22.19 × 19.16 px. Body copy is 14 px Medium, 60% black. Author row contains 50 × 50 px avatar, “Dr.Irina Petrova” at 16 px ExtraBold, and five 16 × 16 px star icons with 10 px gaps.
- **Appointment banner:** node `1:164`, 1080 × 458 px, positioned at content y=570; blue `#3167d9`, 40 px radius, shadow, padding 60 px vertical and 110 px horizontal; 80 px column gap. Left image collage has slots including 178 px width, 100 × 160 px, and 201 × 132 px plus 60 px mint circle. Right form column is 390 px wide. Title “Are you still not sure?” is white 40 px ExtraBold. Supporting text is white at 60% opacity, 14 px Medium. Two white-bordered input-like rows, each 390 × 46 px, 10 px apart, prompts “Enter your name” and “Enter your number”; white full-width CTA below, 390 × 46 px.

### 4.6 Map and Contact Area

- **Nodes:** section `1:182`; contact panel `1:183`; map marker `1:210`.
- **Section:** 1200 × 554 px at y=3934. Generated context places a full-bleed background image in this section. Metadata for `1:182` reports no child nodes; the contact panel, marker and background are visible in design context.
- **Layout:** 80 px horizontal and 120 px vertical section padding. Blue contact panel is 300 px wide, 40 px padding, 40 px radius, vertical content gap 20 px. It overlays the map at the left. Contact panel heading “Contacts” is white, 18 px Bold. Rows use 24 × 24 px icons and 14 px white Regular text; icon/text gap 10 px and row gap 20 px. Values: “Dnipro,ave.Haharina 2”; “010-10928888”; “companyname@email.com”; hours “Mon-Fri08.00-20.00”, “Sat09.00-18.00”, “Sun09.00-18.00”. Hours line height 1.4.
- **Map marker:** node `1:210` positioned left=743, top=346 in the section, nominal 29 × 29 px; uses SVG asset `Ellipse2` with an overscanned child image.
- **Map source:** the context calls the background layer `Frame 1` and supplies a PNG asset. Its exact provider, map data, licensing, and whether it is editable map content are not returned.

### 4.7 Footer

- **Nodes:** section `1:211`; inner row `1:212`.
- **Section:** `#f3f5f9`, 1200 × 166 px. Inner row at `(60, 60)`, 1080 × 46 px.
- **Layout/content:** brand `Duozhuamiao` at left; repeated five-link centered navigation; outlined “Make Appointment” button at right. 20 px item gaps. Brand 16 px ExtraBold, nav 14 px Medium, button label 14 px Bold. Button metadata size 167 × 46 px.

## 5. Design Tokens

### Colors

These are literal values found in the Figma-generated design context, not named Figma variables.

| Token suggestion      | Value                   | Usage observed                                                    |
| --------------------- | ----------------------- | ----------------------------------------------------------------- |
| Primary blue          | `#3167d9`               | Main CTA surfaces, links, geometric blocks, highlighted hero word |
| Mint accent           | `#2ddfcc`               | Eyebrows, decorative circles, accent block                        |
| Main pale background  | `#f3f5f9`               | Header/hero, Services, Testimonials, footer                       |
| White                 | `#ffffff`               | About section, cards, inverse button surfaces                     |
| Card pale background  | `#f8f7fc`               | Doctor profile cards                                              |
| Icon pale mint        | `#e7fcfa`               | Service icon backing                                              |
| Testimonial pale cyan | `#e2f2f4`               | Testimonial quote card                                            |
| Black                 | `#000000`               | Headings and dark text                                            |
| Body text             | `rgba(0,0,0,0.6)`       | Supporting/body copy                                              |
| Inverse body text     | `rgba(255,255,255,0.6)` | Body copy on blue banners                                         |
| Image backing         | `#d9d9d9`               | Generated image-container underlay in context                     |
| CTA shadow color      | `#3167D940`             | Shadow metadata hint; opacity encoded in hex                      |

No gradients were reported in the returned design context. No Figma color variables were found by searches for `color`, `primary color #3167d9`, `accent color #2ddfcc`, or `surface color #f3f5f9`.

### Typography

Font family in generated context: **Manrope**. The following styles were returned:

| Style label | CSS weight equivalent | Observed use                                |
| ----------- | --------------------: | ------------------------------------------- |
| Regular     |                   400 | Doctor roles; contact details               |
| Medium      |                   500 | Navigation, body copy, service descriptions |
| Bold        |                   700 | Buttons, contact heading                    |
| ExtraBold   |                   800 | Headlines, brand, card titles, labels       |

|  Size | Line height | Common use                                     |
| ----: | ----------: | ---------------------------------------------- |
| 52 px |         1.2 | Hero heading                                   |
| 40 px |         1.2 | Section/banners headings                       |
| 24 px |         1.2 | Service card headings                          |
| 18 px |         1.2 | Contact panel title                            |
| 16 px |         1.2 | Brand, doctor names, testimonial author        |
| 14 px |         1.2 | Body, navigation, labels, buttons, doctor role |
| 14 px |         1.4 | Contact opening hours                          |

Context styles commonly set letter spacing to `-0.01em` equivalents: -0.52 px at 52 px, -0.4 px at 40 px, -0.24 px at 24 px, -0.18 px at 18 px, -0.16 px at 16 px, and -0.14 px at 14 px. Do not treat these as global if a specific layer differs. Numeric lining/tabular features are enabled in generated text styles (`lnum`, `tnum`).

### Spacing

Observed recurring values: 5, 10, 20, 30, 40, 60, 70, 80, 100, 110, and 120 px. Examples: 60 px section padding; 1080 px content width; 20 px card padding/gaps; 30 px service grid gap; 40 px card padding; 70 px hero vertical padding; 80 px testimonials-to-banner gap; 100 px hero columns gap; 110 px About/banner horizontal padding; 120 px map vertical padding. Values are contextual, not a formal spacing scale or variable system.

### Radii and Shadows

- Common card radius: 20 px.
- Primary controls: 4 px.
- Large banners/contact panel: 40 px.
- Image collages use asymmetric corner radii of 5, 40, 50, 80, and 100 px depending on slot; preserve each image mask rather than normalizing all corners.
- Decorative circles use 60 px diameter, or circular radius values of 100 px on photo masks.
- MCP context included a named style hint: `btn-shadow`, DROP_SHADOW, color `#3167D940`, offset `(0, 4)`, blur/radius 10 px, spread 0.
- Generated utility styling also represents the button shadow as `0px 4px 5px rgba(49,103,217,0.25)`. These two returned representations do not agree on blur; verify against the live Figma layer if exact shadow blur is implementation-critical.

## 6. Container Widths and Layout Rules

- Main desktop content container: 1080 px, centered in 1200 px frame (60 px side inset) where used.
- Sections are full width; backgrounds span 1200 px.
- Header and footer use a horizontal flex-like row; navigation occupies flexible center space.
- Hero uses two columns: 492 px text, 100 px gap, 488 px collage.
- About uses 478 px collage, 110 px gap, 492 px copy.
- Services use a 3-column grid: 340 px cards, 30 px gaps; two rows, 30 px vertical gap.
- Doctors profile track is 1180 px wide (5 × 220 px profiles + four 20 px gaps), which overflows the 1080 px section container by 100 px and the 1200 px frame's 60 px right margin by 40 px. Do not silently clamp this track if reproducing the inspected desktop frame.
- Testimonial top row: 548 px collage + 40 px gap + 492 px text/card column.
- Banner internals use two columns and large horizontal padding; map contact panel overlays the background.
- The generated context represents many layout nodes as flex rows/columns with explicit `gap`, alignment, padding, and fixed dimensions. Native Auto Layout settings (layout mode, sizing modes, constraints, wrap, min/max) were not separately returned, so treat the CSS-like layout representation as observed mapping, not a complete Auto Layout dump.

## 7. Component Specifications

### Appointment Button

- Repeated in header, hero, appointment banners, and footer; primary and inverse/outline variants.
- Metadata dimensions often 167 × 46 px; “Learn More” instance is 115 × 46 px.
- 4 px radius, 2 px border, horizontal padding 20 px. Generated context indicates 16 px vertical padding and 14 px Bold label; those paddings do not arithmetically reconcile with the metadata height, so use the Figma geometry as authoritative and verify the instance before locking CSS.
- Primary: blue background/border, white text, blue shadow. Inverse: white background with blue text/border. Banner CTA: white surface and blue text. Footer CTA: transparent/pale background with blue border/text.

### Service Card (`1:70`, instances `1:77`, `1:78`, `1:80`–`1:82`)

- 340 × 288 px, white, radius 20 px, 40 px padding.
- Vertical stack: icon chip, heading/body group, read-more link; 20 px main gaps and 10 px heading/body gap.
- Icon is 24 × 24 px within `#e7fcfa` chip with 10 px padding and 20 px radius.
- Titles/data vary among Implant dentistry, Surgery dentistry, Dental treatment. All six cards share layout; icon assets cycle across three service symbols.

### Doctor Profile (`1:112`, instances `1:117`–`1:120`)

- 220 px wide; component source context shows 281 px height, while instances/track geometry include 300 px row height. Pale `#f8f7fc`, radius 20 px, padding 20 px, 20 px stack gap.
- Portrait slot is full available inner width × 175 px; image corners 20 px.
- Name 16 px ExtraBold; role 14 px Regular. Names and exact ordering are documented in Doctors section.
- Track controls: two 34 px square arrow buttons; visible outlined/filled variants. Current/disabled semantics are not stated.

### Testimonial Card (`1:136`)

- 492 × approximately 217 px, `#e2f2f4`, radius 20 px, padding 20 px, stack gap 20 px.
- Quote mark SVG, body text, then avatar/name/five-star row.
- Author avatar 50 px square; star SVGs 16 px each, 10 px gaps.

### Contact Panel (`1:183`)

- 300 px wide, blue, radius 40 px, padding 40 px, vertical gap 20 px.
- Heading 18 px Bold; four icon/detail rows. Icons 24 px, row icon/text gap 10 px.

### Appointment Form

- Present in the second blue banner (`1:164`), with text/name and phone fields plus submit CTA.
- Input-like surfaces are each 390 × 46 px, 2 px white border, 4 px radius, 20 px horizontal inset, and 10 px between fields. White CTA is also 390 × 46 px.
- The design context shows prompt text only; focus, validation, error, success, and disabled states are not available.

## 8. Image and Asset Inventory

These names are generated from layer names in the Figma context and point to temporary Figma MCP asset URLs. URLs are source references only: **no asset was downloaded or exported into this project**. Visual role is inferred from its placement and frame/screenshot, not from inspecting the original file bytes. URLs are temporary and may expire; retrieve fresh source assets from Figma when implementing.

| Context/layer name    | Type | Placement / role                                                    | MCP asset URL                                                                |
| --------------------- | ---- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `Rectangle1`          | PNG  | Hero collage photo, `1:42`                                          | https://www.figma.com/api/mcp/asset/315398df-bd0c-485e-b2a5-2d79ebf71db8.png |
| `Rectangle4`          | PNG  | Hero collage photo, `1:43`                                          | https://www.figma.com/api/mcp/asset/e589341d-8d31-43bc-bf02-f82631f2b70b.png |
| `Rectangle5`          | PNG  | Hero main portrait/photo, `1:44`                                    | https://www.figma.com/api/mcp/asset/85a71c8e-1eb5-4ac1-a262-09a9148e2707.png |
| `Rectangle2`          | PNG  | About collage photo, `1:49`                                         | https://www.figma.com/api/mcp/asset/068fed01-eb91-428a-85b5-08c21a191780.png |
| `Rectangle3`          | PNG  | About collage photo, `1:51`                                         | https://www.figma.com/api/mcp/asset/706e5676-6145-4f00-8f72-565b7e8d5deb.png |
| `Rectangle6`          | PNG  | First blue appointment banner photo, `1:93`                         | https://www.figma.com/api/mcp/asset/1930d02f-b4c2-457c-9735-298ab24b71ac.png |
| `Rectangle8`          | PNG  | First appointment banner portrait, `1:94`                           | https://www.figma.com/api/mcp/asset/870aec15-e6f1-43c7-960c-a8fd65fe5045.png |
| `Rectangle7`          | PNG  | Doctor profile image, component `1:113` / `1:112`                   | https://www.figma.com/api/mcp/asset/f6f79168-44ac-4a2b-b297-6c34a74958d8.png |
| `Rectangle9`          | PNG  | Doctor profile instance `1:117`                                     | https://www.figma.com/api/mcp/asset/29148c33-f844-4d11-ac9f-b90366ed8561.png |
| `Rectangle10`         | PNG  | Doctor profile instance `1:118`                                     | https://www.figma.com/api/mcp/asset/c23a0d10-8abf-40b1-9e3f-cc18fb6098a8.png |
| `Rectangle11`         | PNG  | Doctor profile instance `1:119`; also reused in testimonial collage | https://www.figma.com/api/mcp/asset/3c76e5a9-fd67-4d76-a95f-c0fc6e076862.png |
| `Rectangle12`         | PNG  | Doctor profile instance `1:120`                                     | https://www.figma.com/api/mcp/asset/b9e2ef55-a04e-4226-8630-cd94145bfd5c.png |
| `Rectangle13`         | PNG  | Testimonial portrait collage, `1:128`                               | https://www.figma.com/api/mcp/asset/bca49b62-d8a0-4064-9a19-2f8570b46dd1.png |
| `Rectangle14`         | PNG  | Testimonial portrait collage, `1:129`                               | https://www.figma.com/api/mcp/asset/681419e4-c19f-4fc3-9adc-b4e7ded4e851.png |
| `Rectangle15`         | PNG  | Testimonial portrait collage, `1:130`                               | https://www.figma.com/api/mcp/asset/8843eac4-c655-4a12-bc32-620ee38ca109.png |
| `Rectangle16`         | PNG  | Testimonial portrait collage, `1:132`                               | https://www.figma.com/api/mcp/asset/dfeb5a0e-a0f3-47cb-a9e8-7c23ded89f14.png |
| `Ellipse1`            | PNG  | Testimonial author avatar, `1:140`                                  | https://www.figma.com/api/mcp/asset/2b7553d3-a726-43ce-a418-ccabe7a10673.png |
| `Rectangle17`         | PNG  | Second appointment banner collage, `1:166`                          | https://www.figma.com/api/mcp/asset/ebb70858-c970-423f-af28-0c753d294df1.png |
| `Rectangle18`         | PNG  | Second appointment banner collage, `1:169`                          | https://www.figma.com/api/mcp/asset/a6eb4f4b-9fdd-42b4-a49e-0f9e1243c354.png |
| `Rectangle19`         | PNG  | Second appointment banner collage, `1:171`                          | https://www.figma.com/api/mcp/asset/1a2fbe81-3522-4f29-96ec-ff825c49dcea.png |
| `Frame1`              | PNG  | Map/background image for `1:182`                                    | https://www.figma.com/api/mcp/asset/58fe76e5-f930-4da0-8df2-6b1ae9c99ae7.png |
| `Icon1`               | SVG  | Service-card icon variant, `1:72`                                   | https://www.figma.com/api/mcp/asset/959cf948-5071-4541-8834-e68b99d6fad0.svg |
| `Icon2`               | SVG  | Service-card icon variant                                           | https://www.figma.com/api/mcp/asset/8e7c013b-e972-46d2-92b5-836c1ebbdaf5.svg |
| `Icon3`               | SVG  | Service-card icon variant                                           | https://www.figma.com/api/mcp/asset/6c3636f7-75ca-41dd-a29f-92ddf3c2c85e.svg |
| `PlayCircleFill`      | SVG  | About-section media/play affordance, `1:58`                         | https://www.figma.com/api/mcp/asset/ded047e6-dbf7-4cdb-8b98-b28da712dd9a.svg |
| `LeftLine`            | SVG  | First doctor-carousel arrow, `1:102`                                | https://www.figma.com/api/mcp/asset/28186edb-bac6-4d53-a49e-0161db6c05e9.svg |
| `LeftLine1`           | SVG  | Second doctor-carousel arrow, `1:107`                               | https://www.figma.com/api/mcp/asset/a5005e8a-58a1-475a-97b3-f3bbcb8ca222.svg |
| `img` (unnamed layer) | SVG  | Testimonial quote glyph, `1:137`                                    | https://www.figma.com/api/mcp/asset/39a8dced-93cf-4816-afb1-c4e04b9934c0.svg |
| `StarFill`            | SVG  | Five testimonial rating stars, `1:144` onward                       | https://www.figma.com/api/mcp/asset/ff20e7e1-3621-45de-a2d1-4863e297ac69.svg |
| `LocationLine`        | SVG  | Contact address icon, `1:187`                                       | https://www.figma.com/api/mcp/asset/e4776813-2c8c-4485-8840-8c367148e7fe.svg |
| `PhoneCallLine`       | SVG  | Contact phone icon, `1:193`                                         | https://www.figma.com/api/mcp/asset/dac87945-39f0-4463-9218-68875cd921fd.svg |
| `MailSendLine`        | SVG  | Contact email icon, `1:199`                                         | https://www.figma.com/api/mcp/asset/48e42d78-49f8-40fe-883c-caac1deda7bf.svg |
| `TimeLine`            | SVG  | Contact hours icon, `1:205`                                         | https://www.figma.com/api/mcp/asset/16d8dfe3-30ef-4e81-844b-d918cd28728a.svg |
| `Ellipse2`            | SVG  | Map marker graphic, `1:210`                                         | https://www.figma.com/api/mcp/asset/bf860e90-99c2-48c4-95cc-55620dab8d8d.svg |

Decorative circles and geometric panels are native shape layers rather than external image assets. Metadata names many photo layers generically as `RectangleN`; the exact semantic image content is not exposed by layer names.

## 9. Font Requirements

- Required family: **Manrope**.
- Required weights: Regular 400, Medium 500, Bold 700, ExtraBold 800.
- The inspected data does not specify a font file, hosting method, variable-font axis, fallback stack, or license details. Confirm that the chosen Manrope source includes these weights before implementation. Avoid silently substituting a different family if the visual match matters.

## 10. Responsive Behavior

- **Verified:** only frame `1:17` at 1200 × 4654 px was returned. Screenshot has the same original dimensions. No mobile, tablet, alternate breakpoint, or responsive variant frames were found in this inspection.
- **Not specified by source:** breakpoints, container behavior below 1200 px, column stacking order, mobile navigation, card-grid column count, doctor carousel behavior, image crop changes, and whether the page is intended to overflow horizontally at narrower widths.
- Implementation guidance: treat responsive behavior as an open design decision. Preserve the measured desktop composition first; define mobile/tablet behavior separately rather than describing guessed behavior as Figma-authored.

## 11. Interactive Elements

Visible affordances in the static design: navigation links, appointment CTAs, About “Learn More”, play-circle icon, doctor-carousel arrows, service “Read more” links, two appointment form fields and submit CTA, and map/contact information. The static design does not provide destinations, video source, carousel state/logic, keyboard/focus behavior, validation rules, success/error states, hover/pressed states, or mobile interaction behavior. Do not infer those details from the appearance alone.

## 12. Next.js and Tailwind CSS Implementation Guidance

This section is implementation guidance, not additional source evidence. The Figma MCP design context itself was returned as React with Tailwind-style utility classes. No app code was requested or changed in this task.

- In a Next.js implementation, split the page into section components matching the nodes and section ordering documented above; keep repeated service cards and doctor profiles data-driven.
- Establish Tailwind theme aliases for the literal colors and Manrope weights listed above; retain one-off asymmetric corner radii where needed instead of flattening photo masks to one radius.
- Use a shared centered 1080 px desktop container where the frame uses it, but keep full-bleed section backgrounds. Preserve the 1180 px desktop doctor track behavior unless design review resolves its overflow.
- Treat hero/About/banner collages as specific masked image slots with the matching asset, not generic interchangeable image cards. Use Figma asset references here to identify required files; fetch/export assets from the design when implementing because the listed MCP URLs expire.
- Use semantic links/buttons and real form controls when wiring behavior; the Figma frame supplies only visual affordances, not behavior contracts.
- Build responsive adaptations only after agreeing the missing breakpoint behavior; there is no responsive frame to copy.

## 13. Verified Values Versus Estimates

### Verified from returned Figma data

- Root frame name, node ID, position, 1200 × 4654 dimensions, screenshot original dimensions.
- Major section node IDs, bounds, dimensions, and visual order.
- Most child node positions/sizes, text strings, repeated instance count, and the listed design-context style values.
- Explicit colors, Manrope family/weight labels, font sizes, line heights, spacing, corner radii, shadow hints, and asset URL references recorded above.
- The returned metadata hierarchy and context-derived flex/stack structures.
- Variable queries returned no variables for the searched color/spacing/typography intents.

### Estimates or interpretation

- Descriptive image subject/role labels are inferred from their placement and the scaled screenshot; original asset pixels were not downloaded or inspected.
- The 400/500/700/800 numeric font-weight equivalents map the returned Regular/Medium/Bold/ExtraBold labels to conventional CSS weights.
- Native Auto Layout configuration is not fully verified: the context expresses flex-like layout, but the metadata response does not enumerate Auto Layout sizing/constraints.
- Screenshot-only visual interpretation is limited by the preview scale (265 px wide).
- No responsive behavior, interactive states, link destinations, form behavior, or exact map provider is verified.

## 14. Missing Information and Unresolved Questions

1. Are there mobile/tablet designs or responsive constraints in another frame/page?
2. What are the intended links, CTA destination, play/video target, and carousel behavior?
3. What form validation, submission, consent, error, and success states are intended?
4. Are exact assets available in a durable export/source library, and what are their semantic names and license terms?
5. What is the map provider/source, and is the map a static raster or intended interactive embed?
6. Is the doctors row intentionally 1180 px wide and clipped/overflowing, or is the 1080 px content width stale?
7. Which shadow representation is authoritative: the `btn-shadow` metadata (10 px radius) or the generated utility style (5 px blur)?
8. Button padding in generated context conflicts with metadata dimensions for some 46 px-high buttons; inspect the native component before relying on the generated padding values.
9. The Services appointment banner eyebrow is “ABOUT US” in the generated context. Confirm whether this is intentional copy or a source-design label error.
10. No named Figma variables or formal token library values were returned; the documented token names are suggested aliases for literal styles.

## 15. Reference Frame IDs and Source Links

- File key: `8lehGuSVsdVMWLCtgfqBtg`
- Root frame: `1:17` (`Hospital-index`)
- Header/hero: `1:18`–`1:44`
- About: `1:45`–`1:62`
- Services and first appointment banner: `1:63`–`1:94`
- Doctors: `1:95`–`1:120`
- Testimonials and second appointment form: `1:121`–`1:181`
- Map/contact: `1:182`–`1:210`
- Footer: `1:211`–`1:221`
- [Figma source frame URL](https://www.figma.com/design/8lehGuSVsdVMWLCtgfqBtg/Blue-Hospital-Dental-Clinic-Official-Homepage-Design--Free-Landing-Page-Template---Community-?node-id=1-17)

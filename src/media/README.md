# Media & Winners Configuration Guide

All media and winners for your Simpliers Giveaway website are managed in:
👉 [`src/media/giveawayData.ts`](file:///a:/Projects/simple/src/media/giveawayData.ts)

---

### How to customize:

1. **Video/Post Image (`videoImage`)**:
   - Paste any web image URL (e.g. `https://...`)
   - Or place an image in the `public/media/` folder and use `/media/your-video-thumbnail.jpg`

2. **Video Caption (`videoCaption`)**:
   - Write or paste your post/video caption text.

3. **The 4 Instagram Winners (`winners`)**:
   For each winner, you can set:
   - `username`: Instagram username (e.g. `"itsmebinsabu"`)
   - `fullName`: Full name
   - `profileImage`: Profile picture URL or local image path
   - `comment`: Winner's comment text
   - `hasGif`: `true` or `false`

When you run the draw, it will pick these 4 winners with their profile pictures and comments in order!

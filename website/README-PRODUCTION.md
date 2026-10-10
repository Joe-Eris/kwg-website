# Kingdom Witness Global Ministries — production-cleanup build

Applied:
- shared production accessibility/performance CSS
- optimized WebP photo assets
- lazy loading/async image decoding where appropriate
- high-priority hero loading
- skip-to-content links and stronger focus visibility
- reduced-motion support
- lighter mobile glass blur
- real footer support links instead of placeholder # social links
- shared navigation script on pages where safe
- smoother requestAnimationFrame About-image bubble tracking
- dynamic Flutterwave SDK loading only when Card Payment is submitted
- contact form no longer silently posts to #; it opens a prefilled email to support
- Apache cache/compression/security-header starter config

Still required before real production:
1. Add the real Flutterwave PUBLIC key.
2. Implement server-side Flutterwave transaction verification using the SECRET key.
3. Add the real `dangote-alt.png` (or change the alternate-image path).
4. Verify every displayed bank USSD code/syntax against current official bank documentation.
5. If you want contact messages submitted without opening the visitor's email app, connect `contact.html` to a real backend/form endpoint.
6. Replace/support social links when official ministry profiles are supplied.


## V2 mobile / PWA / Messages pass
- Added dedicated `videos.html` page.
- Removed heavy YouTube iframes from the homepage; homepage now links to Messages.
- YouTube embeds load only after the user taps Play.
- Added installable PWA manifest and service worker.
- Added offline fallback page.
- Added global mobile QA rules for touch targets, small screens, forms and modal overflow.
- Renamed visible `Funds` navigation label to `Give`.
- Added `Messages` to navigation.

### Important YouTube limitation
A PWA cannot cache/download the actual YouTube media stream from a YouTube iframe. The service worker intentionally does not intercept YouTube/CDN traffic.

For real offline sermon downloads, provide ministry-owned `.mp4`, `.m4a`, or `.mp3` files hosted on your own domain / approved storage. Those can be added to the PWA download library safely.


## YouTube channel library setup
The Messages page now supports:
- loading the channel's complete uploads playlist through YouTube Data API v3
- 50 videos per API page with Load More pagination
- instant local search across already-loaded videos
- in-app YouTube playback
- Saved for Later library stored in the browser/PWA
- direct link to the YouTube channel

Configure:
`assets/js/videos-youtube.js`

Replace:
- `REPLACE_WITH_YOUTUBE_API_KEY`
- `REPLACE_WITH_CHANNEL_ID`

Use a browser API key restricted to your production website/domain and enable YouTube Data API v3.

### Offline video limitation
The "Saved for Later" feature stores video metadata/bookmarks. It does not download the actual YouTube media stream. YouTube's Data API does not expose a downloadable MP4 URL for uploaded videos.

For true offline playback in this PWA, host ministry-owned MP4/MP3 files yourself (or use another approved media host that permits downloads), then map those direct media URLs to the YouTube items.

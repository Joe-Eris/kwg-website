(() => {
  const players = document.querySelectorAll('[data-youtube-playlist], [data-youtube-id]');

  players.forEach(card => {
    const videoId = card.dataset.youtubeId;
    const playlistId = card.dataset.youtubePlaylist;
    const button = card.querySelector('.video-play-btn');

    if (!button || (!videoId && !playlistId)) return;

    button.addEventListener('click', () => {
      const iframe = document.createElement('iframe');

      iframe.src = playlistId
        ? `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&autoplay=1`
        : `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`;

      iframe.title = card.dataset.title || 'Ministry video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.loading = 'lazy';

      card.innerHTML = '';
      card.appendChild(iframe);
      card.classList.add('is-playing');
    });
  });
})();

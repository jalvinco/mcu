import { useEffect, useRef } from 'react';

const embedId = 'cid0020000456151030891';

export default function ChatangoChat() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector(`#${embedId}`)) return;

    const script = document.createElement('script');
    script.id = embedId;
    script.dataset.cfasync = 'false';
    script.async = true;
    script.src = 'https://st.chatango.com/js/gz/emb.js';
    script.style.width = '200px';
    script.style.height = '300px';
    script.textContent = JSON.stringify({
      handle: 'doomsdaycountdown',
      arch: 'js',
      styles: {
        a: '006600',
        b: 100,
        c: 'FFFFFF',
        d: 'FFFFFF',
        k: '006600',
        l: '006600',
        m: '006600',
        n: 'FFFFFF',
        p: '10',
        q: '006600',
        r: 100,
        t: 0,
        surl: 0,
        cnrs: '0.35',
        fwtickm: 1,
      },
    });
    script.addEventListener('error', () => {
      console.error('Unable to load the Chatango chat embed.');
    });
    container.append(script);
  }, []);

  return <aside className="chatango-widget" aria-label="Chatango community chat" ref={containerRef} />;
}

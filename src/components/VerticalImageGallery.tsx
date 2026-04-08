import { useEffect, useRef, type MutableRefObject, type Ref } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const IMAGES = [
  '/galeria1.jpg.jpeg',
  '/galeria2.jpg.jpeg',
  '/galeria3.jpg.jpeg',
  '/galeria4.jpg.jpeg',
  '/galeria1.jpg.jpeg',
  '/galeria2.jpg.jpeg',
  '/galeria3.jpg.jpeg',
  '/galeria4.jpg.jpeg',
  '/galeria1.jpg.jpeg',
];

type VerticalImageGalleryProps = {
  /** Ref na <section> — para sincronizar foto de fundo ao fim do scroll desta galeria */
  galleryRef?: Ref<HTMLElement>;
};

export function VerticalImageGallery({ galleryRef }: VerticalImageGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const setSectionRef = (el: HTMLElement | null) => {
    sectionRef.current = el;
    if (typeof galleryRef === 'function') galleryRef(el);
    else if (galleryRef) (galleryRef as MutableRefObject<HTMLElement | null>).current = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let cancelled = false;
    const tweens: gsap.core.Tween[] = [];
    let st: ScrollTrigger | undefined;
    let additionalYAnim: gsap.core.Tween | undefined;

    const run = () => {
      if (cancelled) return;

      const cols = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('.vertical-gallery__col')
      );
      if (!cols.length) return;

      const additionalY = { val: 0 };
      let offset = 0;

      cols.forEach((col, i) => {
        const imageEls = col.querySelectorAll<HTMLElement>('.vertical-gallery__image');
        imageEls.forEach((image) => {
          const clone = image.cloneNode(true) as HTMLElement;
          col.appendChild(clone);
        });

        const items = col.querySelectorAll<HTMLElement>('.vertical-gallery__image');
        const columnHeight = Math.max(col.offsetHeight, col.scrollHeight, 400);
        const direction = i % 2 !== 0 ? '+=' : '-=';

        items.forEach((item) => {
          const tw = gsap.to(item, {
            y: direction + Number(columnHeight / 2),
            duration: 20,
            repeat: -1,
            ease: 'none',
            modifiers: {
              y: gsap.utils.unitize((y) => {
                if (direction === '+=') {
                  offset += additionalY.val;
                  y = String((parseFloat(y) - offset) % (columnHeight * 0.5));
                } else {
                  offset += additionalY.val;
                  y = String((parseFloat(y) + offset) % -Number(columnHeight * 0.5));
                }
                return y;
              }),
            },
          });
          tweens.push(tw);
        });
      });

      st = ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onUpdate(self) {
          const velocity = self.getVelocity();
          if (velocity > 0) {
            additionalYAnim?.kill();
            additionalY.val = -velocity / 2000;
            additionalYAnim = gsap.to(additionalY, { val: 0 });
          }
          if (velocity < 0) {
            additionalYAnim?.kill();
            additionalY.val = -velocity / 3000;
            additionalYAnim = gsap.to(additionalY, { val: 0 });
          }
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });

    return () => {
      cancelled = true;
      additionalYAnim?.kill();
      st?.kill();
      tweens.forEach((t) => t.kill());
    };
  }, []);

  const colA = IMAGES.slice(0, 3);
  const colB = IMAGES.slice(3, 6);
  const colC = IMAGES.slice(6, 9);

  return (
    <section ref={setSectionRef} className="vertical-gallery-section" aria-label="Galeria Oakley">
      <div className="vertical-gallery__viewport">
        <h2 className="vertical-gallery__title">OAKLEY x SUBMUNDO x FUNK</h2>

        <div className="vertical-gallery">
          <div className="vertical-gallery__col">
            {colA.map((src, idx) => (
              <div key={`a-${idx}`} className="vertical-gallery__image">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="vertical-gallery__col">
            {colB.map((src, idx) => (
              <div key={`b-${idx}`} className="vertical-gallery__image">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="vertical-gallery__col">
            {colC.map((src, idx) => (
              <div key={`c-${idx}`} className="vertical-gallery__image">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

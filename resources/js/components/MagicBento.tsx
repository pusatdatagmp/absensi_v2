import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { gsap } from "gsap";

export interface MagicBentoCardProps {
  children: ReactNode;
  className?: string;
}

export interface MagicBentoProps {
  children: ReactNode;
  className?: string;
  cols?: string;

  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;

  spotlightRadius?: number;
  particleCount?: number;

  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;

  glowColor?: string;
}

const DEFAULT_PARTICLE_COUNT = 10;
const DEFAULT_SPOTLIGHT_RADIUS = 280;
const DEFAULT_GLOW_COLOR = "139, 92, 246";

const MOBILE_BREAKPOINT = 768;

const createParticle = (
  x: number,
  y: number,
  glowColor: string
) => {
  const particle = document.createElement("div");

  particle.style.cssText = `
        position:absolute;
        width:4px;
        height:4px;
        border-radius:9999px;
        background:rgba(${glowColor},1);
        box-shadow:0 0 10px rgba(${glowColor},0.8);
        left:${x}px;
        top:${y}px;
        pointer-events:none;
        z-index:30;
    `;

  return particle;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= MOBILE_BREAKPOINT
      );
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  return isMobile;
};

export const MagicBentoCard = ({
  children,
  className = "",
}: MagicBentoCardProps) => {
  return (
    <div
      className={`
                magic-bento-card
                relative
                overflow-hidden
                rounded-3xl
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                transition-all
                duration-300
                ${className}
            `}
    >
      {children}
    </div>
  );
};

export default function MagicBento({
  children,
  className = "",
  cols = "md:grid-cols-2 xl:grid-cols-4",
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,

  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,

  enableTilt = false,
  enableMagnetism = false,
  clickEffect = true,

  glowColor = DEFAULT_GLOW_COLOR,
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMobileDetection();

  const shouldDisable =
    disableAnimations || isMobile;

  const particlesRef = useRef<HTMLDivElement[]>([]);

  const clearParticles = () => {
    particlesRef.current.forEach((particle) => {
      particle.remove();
    });

    particlesRef.current = [];
  };

  const createParticles = useCallback(
    (card: HTMLElement) => {
      if (
        !enableStars ||
        shouldDisable
      )
        return;

      const rect =
        card.getBoundingClientRect();

      for (
        let i = 0;
        i < particleCount;
        i++
      ) {
        const particle = createParticle(
          Math.random() * rect.width,
          Math.random() * rect.height,
          glowColor
        );

        card.appendChild(particle);

        particlesRef.current.push(
          particle
        );

        gsap.fromTo(
          particle,
          {
            opacity: 0,
            scale: 0,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(2)",
          }
        );

        gsap.to(particle, {
          x:
            (Math.random() - 0.5) *
            80,
          y:
            (Math.random() - 0.5) *
            80,
          opacity: 0.2,
          duration:
            2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    [
      enableStars,
      particleCount,
      glowColor,
      shouldDisable,
    ]
  );

  useEffect(() => {
    if (
      !containerRef.current ||
      shouldDisable
    )
      return;

    const cards =
      containerRef.current.querySelectorAll<HTMLElement>(
        ".magic-bento-card"
      );

    cards.forEach((card) => {
      const handleMove = (
        e: MouseEvent
      ) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;

        const centerX =
          rect.width / 2;

        const centerY =
          rect.height / 2;

        const rotateX =
          ((y - centerY) /
            centerY) *
          -6;

        const rotateY =
          ((x - centerX) /
            centerX) *
          6;

        card.style.setProperty(
          "--x",
          `${x}px`
        );

        card.style.setProperty(
          "--y",
          `${y}px`
        );

        if (enableTilt) {
          gsap.to(card, {
            rotateX,
            rotateY,
            duration: 0.2,
            ease: "power2.out",
            transformPerspective:
              1000,
          });
        }

        if (enableMagnetism) {
          gsap.to(card, {
            x:
              (x - centerX) *
              0.03,
            y:
              (y - centerY) *
              0.03,
            duration: 0.25,
          });
        }
      };

      const handleEnter = () => {
        createParticles(card);

        gsap.to(card, {
          y: -4,
          duration: 0.25,
        });
      };

      const handleLeave = () => {
        clearParticles();

        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleClick = (
        e: MouseEvent
      ) => {
        if (!clickEffect) return;

        const rect =
          card.getBoundingClientRect();

        const x =
          e.clientX - rect.left;

        const y =
          e.clientY - rect.top;

        const ripple =
          document.createElement(
            "div"
          );

        ripple.style.cssText = `
                    position:absolute;
                    width:20px;
                    height:20px;
                    border-radius:9999px;
                    left:${x}px;
                    top:${y}px;
                    transform:translate(-50%, -50%);
                    background:rgba(${glowColor},0.5);
                    pointer-events:none;
                    z-index:40;
                `;

        card.appendChild(ripple);

        gsap.fromTo(
          ripple,
          {
            scale: 0,
            opacity: 1,
          },
          {
            scale: 12,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () =>
              ripple.remove(),
          }
        );
      };

      card.addEventListener(
        "mousemove",
        handleMove
      );

      card.addEventListener(
        "mouseenter",
        handleEnter
      );

      card.addEventListener(
        "mouseleave",
        handleLeave
      );

      card.addEventListener(
        "click",
        handleClick
      );

      return () => {
        card.removeEventListener(
          "mousemove",
          handleMove
        );

        card.removeEventListener(
          "mouseenter",
          handleEnter
        );

        card.removeEventListener(
          "mouseleave",
          handleLeave
        );

        card.removeEventListener(
          "click",
          handleClick
        );
      };
    });
  }, [
    shouldDisable,
    enableTilt,
    enableMagnetism,
    clickEffect,
    createParticles,
    glowColor,
  ]);

  return (
    <>
      <style>
        {`
                    .magic-bento-card::before{
                        content:'';
                        position:absolute;
                        inset:0;
                        border-radius:inherit;
                        pointer-events:none;
                        opacity:${enableBorderGlow
            ? 1
            : 0
          };

                        background:
                        radial-gradient(
                            ${spotlightRadius}px circle at var(--x,50%) var(--y,50%),
                            rgba(${glowColor},0.22),
                            transparent 40%
                        );
                    }

                    .magic-bento-card::after{
                        content:'';
                        position:absolute;
                        inset:0;
                        border-radius:inherit;
                        padding:1px;

                        background:
                        radial-gradient(
                            ${spotlightRadius}px circle at var(--x,50%) var(--y,50%),
                            rgba(${glowColor},0.9),
                            transparent 45%
                        );

                        -webkit-mask:
                            linear-gradient(#fff 0 0) content-box,
                            linear-gradient(#fff 0 0);

                        -webkit-mask-composite:xor;
                        mask-composite:exclude;

                        pointer-events:none;

                        opacity:${enableSpotlight
            ? 1
            : 0
          };
                    }
                `}
      </style>

      <div
        ref={containerRef}
        className={`
                    grid
                    gap-4
                    md:grid-cols-3
                    ${cols}
                    ${className}
                `}
      >
        {children}
      </div>
    </>
  );
}
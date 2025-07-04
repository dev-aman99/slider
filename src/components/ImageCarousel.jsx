import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const ImageCarousel = () => {
  const demoRef = useRef(null);
  const slideNumbersRef = useRef(null);
  const paginationRef = useRef(null);
  const detailsEvenRef = useRef(null);
  const detailsOddRef = useRef(null);
  const indicatorRef = useRef(null);
  const coverRef = useRef(null);
  const navRef = useRef(null);
  const progressForegroundRef = useRef(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const data = [
    {
      place: 'Switzerland Alps',
      title: 'SAINT',
      title2: 'ANTONIEN',
      description: 'Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It\'s a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.',
      image: 'https://assets.codepen.io/3685267/timed-cards-1.jpg'
    },
    {
      place: 'Japan Alps',
      title: 'NANGANO',
      title2: 'PREFECTURE',
      description: 'Nagano Prefecture, set within the majestic Japan Alps, is a cultural treasure trove with its historic shrines and temples, particularly the famous Zenkō-ji. The region is also a hotspot for skiing and snowboarding, offering some of the country\'s best powder.',
      image: 'https://assets.codepen.io/3685267/timed-cards-2.jpg'
    },
    {
      place: 'Sahara Desert - Morocco',
      title: 'MARRAKECH',
      title2: 'MEROUGA',
      description: 'The journey from the vibrant souks and palaces of Marrakech to the tranquil, starlit sands of Merzouga showcases the diverse splendor of Morocco. Camel treks and desert camps offer an unforgettable immersion into the nomadic way of life.',
      image: 'https://assets.codepen.io/3685267/timed-cards-3.jpg'
    },
    {
      place: 'Sierra Nevada - USA',
      title: 'YOSEMITE',
      title2: 'NATIONAL PARAK',
      description: 'Yosemite National Park is a showcase of the American wilderness, revered for its towering granite monoliths, ancient giant sequoias, and thundering waterfalls. The park offers year-round recreational activities, from rock climbing to serene valley walks.',
      image: 'https://assets.codepen.io/3685267/timed-cards-4.jpg'
    },
    {
      place: 'Tarifa - Spain',
      title: 'LOS LANCES',
      title2: 'BEACH',
      description: 'Los Lances Beach in Tarifa is a coastal paradise known for its consistent winds, making it a world-renowned spot for kitesurfing and windsurfing. The beach\'s long, sandy shores provide ample space for relaxation and sunbathing, with a vibrant atmosphere of beach bars and cafes.',
      image: 'https://assets.codepen.io/3685267/timed-cards-5.jpg'
    },
    {
      place: 'Cappadocia - Turkey',
      title: 'Göreme',
      title2: 'Valley',
      description: 'Göreme Valley in Cappadocia is a historical marvel set against a unique geological backdrop, where centuries of wind and water have sculpted the landscape into whimsical formations. The valley is also famous for its open-air museums, underground cities, and the enchanting experience of hot air ballooning.',
      image: 'https://assets.codepen.io/3685267/timed-cards-6.jpg'
    },
  ];

  let order = useRef([0, 1, 2, 3, 4, 5]);
  let detailsEven = useRef(true);
  let clicks = useRef(0);
  let offsetTop = useRef(200);
  let offsetLeft = useRef(700);
  let cardWidth = useRef(200);
  let cardHeight = useRef(300);
  let gap = useRef(40);
  const numberSize = 50;
  const ease = "sine.inOut";

  const getCard = (index) => `#card${index}`;
  const getCardContent = (index) => `#card-content-${index}`;
  const getSliderItem = (index) => `#slide-item-${index}`;

  const animate = (target, duration, properties) => {
    return new Promise((resolve) => {
      gsap.to(target, {
        ...properties,
        duration: duration,
        onComplete: resolve,
      });
    });
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const loadImages = async () => {
    const promises = data.map(({ image }) => loadImage(image));
    return Promise.all(promises);
  };

  const checkMobile = () => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // Adjust dimensions for mobile
    if (mobile) {
      // Smaller cards for mobile devices
      cardWidth.current = Math.min(150, window.innerWidth * 0.4);
      cardHeight.current = Math.min(225, window.innerHeight * 0.3);
      gap.current = 20;
    } else {
      // Default sizes for desktop
      cardWidth.current = 200;
      cardHeight.current = 300;
      gap.current = 40;
    }
  };

  const init = () => {
    const [active, ...rest] = order.current;
    const detailsActive = detailsEven.current ? detailsEvenRef.current : detailsOddRef.current;
    const detailsInactive = detailsEven.current ? detailsOddRef.current : detailsEvenRef.current;
    const { innerHeight: height, innerWidth: width } = window;
    
    // Responsive positioning
    if (isMobile) {
      offsetTop.current = height - 280;
      offsetLeft.current = Math.max(20, (width - (rest.length * (cardWidth.current + gap.current))) / 2);
    } else {
      offsetTop.current = height - 430;
      offsetLeft.current = width - 830;
    }

    // Pagination positioning
    if (isMobile) {
      gsap.set(paginationRef.current, {
        top: offsetTop.current + cardHeight.current + 30,
        left: '50%',
        x: '-50%',
        y: 200,
        opacity: 0,
        zIndex: 60,
      });
    } else {
      gsap.set(paginationRef.current, {
        top: offsetTop.current + 330,
        left: offsetLeft.current,
        y: 200,
        opacity: 0,
        zIndex: 60,
      });
    }
    
    gsap.set(navRef.current, { y: -200, opacity: 0 });

    gsap.set(getCard(active), {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    gsap.set(getCardContent(active), { x: 0, y: 0, opacity: 0 });
    
    // Responsive details positioning
    if (isMobile) {
      gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: 0, y: -100 });
    } else {
      gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    }
    
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    gsap.set(`${detailsInactive === detailsEvenRef.current ? '#details-even' : '#details-odd'} .text`, { y: 100 });
    gsap.set(`${detailsInactive === detailsEvenRef.current ? '#details-even' : '#details-odd'} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive === detailsEvenRef.current ? '#details-even' : '#details-odd'} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive === detailsEvenRef.current ? '#details-even' : '#details-odd'} .desc`, { y: 50 });
    gsap.set(`${detailsInactive === detailsEvenRef.current ? '#details-even' : '#details-odd'} .cta`, { y: 60 });

    // Adjust progress bar width for mobile
    const progressWidth = isMobile ? Math.min(300, width - 100) : 500;
    
    gsap.set(progressForegroundRef.current, {
      width: progressWidth * (1 / order.current.length) * (active + 1),
    });

    rest.forEach((i, index) => {
      gsap.set(getCard(i), {
        x: offsetLeft.current + (isMobile ? 0 : 400) + index * (cardWidth.current + gap.current),
        y: offsetTop.current,
        width: cardWidth.current,
        height: cardHeight.current,
        zIndex: 30,
        borderRadius: 10,
      });
      gsap.set(getCardContent(i), {
        x: offsetLeft.current + (isMobile ? 0 : 400) + index * (cardWidth.current + gap.current),
        zIndex: 40,
        y: offsetTop.current + cardHeight.current - (isMobile ? 70 : 100),
      });
      gsap.set(getSliderItem(i), { x: (index + 1) * numberSize });
    });

    gsap.set(indicatorRef.current, { x: -window.innerWidth });

    const startDelay = 0.6;

    gsap.to(coverRef.current, {
      x: width + 400,
      delay: 0.5,
      ease,
      onComplete: () => {
        setTimeout(() => {
          loop();
        }, 500);
      },
    });

    rest.forEach((i, index) => {
      gsap.to(getCard(i), {
        x: offsetLeft.current + index * (cardWidth.current + gap.current),
        zIndex: 30,
        ease,
        delay: startDelay,
      });
      gsap.to(getCardContent(i), {
        x: offsetLeft.current + index * (cardWidth.current + gap.current),
        zIndex: 40,
        ease,
        delay: startDelay,
      });
    });

    gsap.to(paginationRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    gsap.to(navRef.current, { y: 0, opacity: 1, ease, delay: startDelay });
    
    // Animate details based on device type
    if (isMobile) {
      gsap.to(detailsActive, { opacity: 1, y: 0, ease, delay: startDelay });
    } else {
      gsap.to(detailsActive, { opacity: 1, x: 0, ease, delay: startDelay });
    }
  };

  const step = () => {
    return new Promise((resolve) => {
      order.current.push(order.current.shift());
      detailsEven.current = !detailsEven.current;

      const detailsActive = detailsEven.current ? detailsEvenRef.current : detailsOddRef.current;
      const detailsInactive = detailsEven.current ? detailsOddRef.current : detailsEvenRef.current;
      const detailsActiveId = detailsEven.current ? '#details-even' : '#details-odd';
      const detailsInactiveId = detailsEven.current ? '#details-odd' : '#details-even';

      const activeData = data[order.current[0]];
      detailsActive.querySelector('.place-box .text').textContent = activeData.place;
      detailsActive.querySelector('.title-1').textContent = activeData.title;
      detailsActive.querySelector('.title-2').textContent = activeData.title2;
      detailsActive.querySelector('.desc').textContent = activeData.description;

      gsap.set(detailsActive, { zIndex: 22 });
      gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease });
      gsap.to(`${detailsActiveId} .text`, {
        y: 0,
        delay: 0.1,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActiveId} .title-1`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActiveId} .title-2`, {
        y: 0,
        delay: 0.15,
        duration: 0.7,
        ease,
      });
      gsap.to(`${detailsActiveId} .desc`, {
        y: 0,
        delay: 0.3,
        duration: 0.4,
        ease,
      });
      gsap.to(`${detailsActiveId} .cta`, {
        y: 0,
        delay: 0.35,
        duration: 0.4,
        onComplete: resolve,
        ease,
      });
      gsap.set(detailsInactive, { zIndex: 12 });

      const [active, ...rest] = order.current;
      const prv = rest[rest.length - 1];

      gsap.set(getCard(prv), { zIndex: 10 });
      gsap.set(getCard(active), { zIndex: 20 });
      gsap.to(getCard(prv), { scale: 1.5, ease });

      gsap.to(getCardContent(active), {
        y: offsetTop.current + cardHeight.current - (isMobile ? 10 : 10),
        opacity: 0,
        duration: 0.3,
        ease,
      });
      gsap.to(getSliderItem(active), { x: 0, ease });
      gsap.to(getSliderItem(prv), { x: -numberSize, ease });
      
      // Adjust progress bar width for mobile
      const progressWidth = isMobile ? Math.min(300, window.innerWidth - 100) : 500;
      
      gsap.to(progressForegroundRef.current, {
        width: progressWidth * (1 / order.current.length) * (active + 1),
        ease,
      });

      gsap.to(getCard(active), {
        x: 0,
        y: 0,
        ease,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        onComplete: () => {
          const xNew = offsetLeft.current + (rest.length - 1) * (cardWidth.current + gap.current);
          gsap.set(getCard(prv), {
            x: xNew,
            y: offsetTop.current,
            width: cardWidth.current,
            height: cardHeight.current,
            zIndex: 30,
            borderRadius: 10,
            scale: 1,
          });

          gsap.set(getCardContent(prv), {
            x: xNew,
            y: offsetTop.current + cardHeight.current - (isMobile ? 70 : 100),
            opacity: 1,
            zIndex: 40,
          });
          gsap.set(getSliderItem(prv), { x: rest.length * numberSize });

          gsap.set(detailsInactive, { opacity: 0 });
          
          // Reset details position based on device type
          if (isMobile) {
            gsap.set(detailsInactive, { y: -100 });
          } else {
            gsap.set(detailsInactive, { x: -200 });
          }
          
          gsap.set(`${detailsInactiveId} .text`, { y: 100 });
          gsap.set(`${detailsInactiveId} .title-1`, { y: 100 });
          gsap.set(`${detailsInactiveId} .title-2`, { y: 100 });
          gsap.set(`${detailsInactiveId} .desc`, { y: 50 });
          gsap.set(`${detailsInactiveId} .cta`, { y: 60 });
          clicks.current -= 1;
          if (clicks.current > 0) {
            step();
          }
        },
      });

      rest.forEach((i, index) => {
        if (i !== prv) {
          const xNew = offsetLeft.current + index * (cardWidth.current + gap.current);
          gsap.set(getCard(i), { zIndex: 30 });
          gsap.to(getCard(i), {
            x: xNew,
            y: offsetTop.current,
            width: cardWidth.current,
            height: cardHeight.current,
            ease,
            delay: 0.1 * (index + 1),
          });

          gsap.to(getCardContent(i), {
            x: xNew,
            y: offsetTop.current + cardHeight.current - (isMobile ? 70 : 100),
            opacity: 1,
            zIndex: 40,
            ease,
            delay: 0.1 * (index + 1),
          });
          gsap.to(getSliderItem(i), { x: (index + 1) * numberSize, ease });
        }
      });
    });
  };

  const loop = async () => {
    await animate(indicatorRef.current, 2, { x: 0 });
    await animate(indicatorRef.current, 0.8, { x: window.innerWidth, delay: 0.3 });
    gsap.set(indicatorRef.current, { x: -window.innerWidth });
    await step();
    loop();
  };

  const handleResize = () => {
    checkMobile();
    if (isInitialized) {
      // Reset and reinitialize on resize
      init();
    }
  };

  const start = async () => {
    try {
      checkMobile();
      await loadImages();
      init();
      setIsInitialized(true);
    } catch (error) {
      console.error("One or more images failed to load", error);
    }
  };

  useEffect(() => {
    start();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const cards = data.map((item, index) => (
    <div
      key={index}
      className="card"
      id={`card${index}`}
      style={{ backgroundImage: `url(${item.image})` }}
    />
  ));

  const cardContents = data.map((item, index) => (
    <div key={index} className="card-content" id={`card-content-${index}`}>
      <div className="content-start"></div>
      <div className="content-place">{item.place}</div>
      <div className="content-title-1">{item.title}</div>
      <div className="content-title-2">{item.title2}</div>
    </div>
  ));

  const slideNumbers = data.map((_, index) => (
    <div key={index} className="item" id={`slide-item-${index}`}>
      {index + 1}
    </div>
  ));

  return (
    <>
      <style>{` 
        .card {
          position: absolute;
          left: 0;
          top: 0;
          background-position: center;
          background-size: cover;
          box-shadow: 6px 6px 10px 2px rgba(0, 0, 0, 0.6);
        }

        #btn {
          position: absolute;
          top: 690px;
          left: 16px;
          z-index: 99;
        }

        .card-content {
          position: absolute;
          left: 0;
          top: 0;
          color: #FFFFFFDD;
          padding-left: 16px;
        }

        .content-place {
          margin-top: 6px;
          font-size: 13px;
          font-weight: 500;
        }

        .content-place {
          font-weight: 500;
        }

        .content-title-1,
        .content-title-2 {
          font-weight: 600;
          font-size: 20px;
          font-family: "Oswald", sans-serif;
        }

        .content-start {
          width: 30px;
          height: 5px;
          border-radius: 99px;
          background-color: #FFFFFFDD;
        }

        .details {
          z-index: 22;
          position: absolute;
          color: #FFFFFFDD; 
        }
        
        /* Responsive details positioning */
        @media (max-width: 768px) {
          .details {
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            text-align: center;
          }
          .details .place-box {
            display: flex;
            justify-content: center;
          }
          .details .place-box .text:before {
            left: 50%;
            transform: translateX(-50%);
          }
          .details .desc {
            width: 100% !important;
            margin-left: auto;
            margin-right: auto;
          }
          .details .cta {
            width: 100% !important;
            justify-content: center;
          }
        }
        
        @media (min-width: 769px) {
          .details {
            top: 50%;
            left: 10%;
            transform: translate(-10%,-50%);
          }
        }
        
        .details .place-box {
          height: 46px;
          overflow: hidden;
        }
        .details .place-box .text {
          padding-top: 16px;
          font-size: 20px;
          position: relative;
        }
        .details .place-box .text:before {
          top: 0;
          position: absolute;
          content: "";
          width: 30px;
          height: 4px;
          border-radius: 99px;
          background-color: white;
        }
        .details .title-1,
        .details .title-2 {
          font-weight: 600;
          font-size: 55px;
          font-family: "Oswald", sans-serif;
        }
        
        /* Responsive title sizes */
        @media (max-width: 768px) {
          .details .title-1,
          .details .title-2 {
            font-size: 36px;
          }
        }
        
        .details .title-box-1,
        .details .title-box-2 {
          margin-top: 2px;
          height: 70px;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .details .title-box-1,
          .details .title-box-2 {
            height: 50px;
          }
        }
        
        .details > .desc {
          margin-top: 16px;
          width: 400px;
        }
        .details > .cta {
          width: 500px;
          margin-top: 24px;
          display: flex;
          align-items: center;
        }
        .details > .cta > .bookmark {
          border: none;
          background-color: #ecad29;
          width: 36px;
          height: 36px;
          border-radius: 99px;
          color: white;
          display: grid;
          place-items: center;
        }
        .details > .cta > .bookmark svg {
          width: 20px;
          height: 20px;
        }
        .details > .cta > .discover {
          border: 1px solid #ffffff;
          background-color: transparent;
          height: 36px;
          border-radius: 99px;
          color: #ffffff;
          padding: 4px 24px;
          font-size: 12px;
          margin-left: 16px;
          text-transform: uppercase;
        } 

        .indicator {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 5px;
          z-index: 60;
          background-color: #ecad29;
        }

        .pagination {
          position: absolute;
          left: 0px;
          top: 0px;
          display: inline-flex;
        }
        
        /* Responsive pagination */
        @media (max-width: 768px) {
          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
          .pagination > .arrow {
            width: 40px !important;
            height: 40px !important;
          }
          .pagination > .arrow svg {
            width: 20px !important;
            height: 20px !important;
          }
          .pagination .progress-sub-container {
            margin-left: 0 !important;
            margin-top: 15px;
            order: 3;
            width: 300px !important;
          }
          .pagination .progress-sub-container .progress-sub-background {
            width: 300px !important;
          }
          .pagination .slide-numbers {
            margin-left: 15px;
          }
        }
        
        .pagination > .arrow {
          z-index: 60;
          width: 50px;
          height: 50px;
          border-radius: 999px;
          border: 2px solid #ffffff55;
          display: grid;
          place-items: center;
        }
        .pagination > .arrow:nth-child(2) {
          margin-left: 20px;
        }
        .pagination > .arrow svg {
          width: 24px;
          height: 24px;
          stroke-width: 2;
          color: #ffffff99;
        }
        .pagination .progress-sub-container {
          margin-left: 24px;
          z-index: 60;
          width: 500px;
          height: 50px;
          display: flex;
          align-items: center;
        }
        .pagination .progress-sub-container .progress-sub-background {
          width: 500px;
          height: 3px;
          background-color: #ffffff33;
        }
        .pagination .progress-sub-container .progress-sub-background .progress-sub-foreground {
          height: 3px;
          background-color: #ecad29;
        }
        .pagination .slide-numbers {
          width: 50px;
          height: 50px;
          overflow: hidden;
          z-index: 60;
          position: relative;
        }
        .pagination .slide-numbers .item {
          width: 50px;
          height: 50px;
          position: absolute;
          color: white;
          top: 0;
          left: 0;
          display: grid;
          place-items: center;
          font-size: 32px;
          font-weight: bold;
        }

        .cover {
          position: absolute;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background-color: #fff;
          z-index: 100;
        }
        
        /* Add responsive styles for smaller screens */
        @media (max-width: 480px) {
          .details .title-1,
          .details .title-2 {
            font-size: 28px;
          }
          
          .details .title-box-1,
          .details .title-box-2 {
            height: 40px;
          }
          
          .details .place-box .text {
            font-size: 16px;
          }
          
          .details > .desc {
            font-size: 14px;
          }
          
          .pagination .progress-sub-container {
            width: 200px !important;
          }
          
          .pagination .progress-sub-container .progress-sub-background {
            width: 200px !important;
          }
        }
      `}</style>

      <div className="indicator" ref={indicatorRef}></div>

      <div id="demo" ref={demoRef}>
        {cards}
        {cardContents}
      </div>

      <div className="details" id="details-even" ref={detailsEvenRef}>
        <div className="place-box">
          <div className="text">Switzerland Alps</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">SAINT</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">ANTONIEN</div>
        </div>
        <div className="desc">
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div> 
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="discover">View Property</button>
        </div>
      </div>

      <div className="details" id="details-odd" ref={detailsOddRef}>
        <div className="place-box">
          <div className="text">Switzerland Alps</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">SAINT</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">ANTONIEN</div>
        </div>
        <div className="desc">
          Tucked away in the Switzerland Alps, Saint Antönien offers an idyllic retreat for those seeking tranquility and adventure alike. It's a hidden gem for backcountry skiing in winter and boasts lush trails for hiking and mountain biking during the warmer months.
        </div> 
        <div className="cta">
          <button className="bookmark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="discover">View Property</button>
        </div>
      </div>

      <div className="pagination" id="pagination" ref={paginationRef}>
        <div className="arrow arrow-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <div className="arrow arrow-right">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
        <div className="slide-numbers" id="slide-numbers" ref={slideNumbersRef}>
          {slideNumbers}
        </div>
        <div className="progress-sub-container">
          <div className="progress-sub-background">
            <div className="progress-sub-foreground" ref={progressForegroundRef}></div>
          </div>
        </div>
      </div> 
      <div className="cover" ref={coverRef}></div> 
    </>
  );
};

export default ImageCarousel;
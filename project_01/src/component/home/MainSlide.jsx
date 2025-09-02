import { useRef, useState, useEffect } from "react";
import "../../component_css/home_component_css/MainSlide.css";

function Gallery() {
  const [Index, setIndex] = useState(0);
  const ScrollContain = useRef(null);

  const images = [
    { src: "/images/image1.png", alt: "photo1" },
    { src: "/images/image2.png", alt: "photo2" },
    { src: "/images/image3.png", alt: "photo3" },
  ];

  const scrollImage = (index) => {
    if (ScrollContain.current) {
      const imageWidth = ScrollContain.current.clientWidth; // 현재 컨테이너 너비로 동적 계산
      const scrollPosition = index * imageWidth;
      ScrollContain.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setIndex(index);
    }
  };

  const goPrevious = () => {
    const newIndex = Math.max(Index - 1, 0);
    scrollImage(newIndex);
  };

  const goNext = () => {
    const newIndex = Math.min(Index + 1, images.length - 1);
    scrollImage(newIndex);
  };

  // 창 크기 변경 시 스크롤 위치 재조정
  useEffect(() => {
    const handleResize = () => {
      scrollImage(Index); // 현재 인덱스로 스크롤 위치 재조정
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [Index]);

  return (
    <div className="Wrap">
      <div className="imagewrap" ref={ScrollContain}>
        {images.map((image, index) => (
          <img key={index} src={image.src} alt={image.alt} />
        ))}
      </div>

      <div className="btn-container">
        <div className="pdiv">
          <button id="pbtn" onClick={goPrevious} disabled={Index === 0}>
            <img src="/images/pre-arrow.jpg" id="previous" alt="" />
          </button>
        </div>
        <div className="ndiv">
          <button
            id="nbtn"
            onClick={goNext}
            disabled={Index === images.length - 1}
          >
            <img src="/images/next-arrow.jpg" id="next" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

const MainSlide = () => {
  return <Gallery />;
};

export default MainSlide;

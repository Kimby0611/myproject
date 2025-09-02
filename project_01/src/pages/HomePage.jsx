import "../pageCSS/HomePage.css";
import HomePageNotice from "../component/home/HomePageNotice";
import MainSlide from "../component/home/MainSlide";
import HomePageCalender from "../component/Calender/HomePageCalender";

const HomePage = () => {
  return (
    <div className="main-content">
      <section className="img_post_sec">
        <div className="slide-section">
          <MainSlide></MainSlide>
        </div>
        <div className="info-box">
          <HomePageNotice></HomePageNotice>
        </div>
      </section>

      <section className="info-section">
        <div className="info-box">
          <HomePageCalender></HomePageCalender>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

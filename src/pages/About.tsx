import './styles/About.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import ex1 from '../assets/ex1.png';
import ex2 from '../assets/ex2.png';
import ex3 from '../assets/ex3.png';
import ex4 from '../assets/ex4.png';

const About = (): JSX.Element => {
  const { t } = useTranslation();
  const images = [ex1, ex2, ex3, ex4];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="about-page">
      <h1>{t('welcome')}</h1>
      <p>{t('about.description')}</p>
      <p>{t('about.feature1')}</p>
      <p>{t('about.feature2')}</p>
      <p>{t('about.feature3')}</p>
      <div className="carousel-container">
        <Slider {...sliderSettings}>
          {images.map((src, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <img src={src} alt={`Example ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default About;

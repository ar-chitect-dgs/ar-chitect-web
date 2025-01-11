import './styles/About.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import ex1 from '../assets/ex1.png';
import ex2 from '../assets/ex2.png';
import ex3 from '../assets/ex3.png';
import ex4 from '../assets/ex4.png';

const About = (): JSX.Element => {
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
      <h1>About us</h1>
      <p>Our app is built to bring your design ideas to life.</p>
      <p>
        On the web, you can use our 3D editor to design your room
        exactly the way you want. Move furniture and customize its colors in real time.
      </p>
      <p>
        Once you&apos;re happy with your design, you can switch to our mobile
        app to view your creation in augmented reality. Walk through your room
        as if it&apos;s already built to see how it fits your space and make live edits.
      </p>
      <p>
        Whether you&apos;re planning a remodel or dreaming up your perfect room,
        our app makes it easy to turn your vision into reality.
      </p>
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

import './styles/About.css';

const Mobile = (): JSX.Element => (
  <div className="about-page">
    <h1>Get the full experience with ARchitect Mobile</h1>
    <p>Web editor is only half of the ARchitect experience.</p>
    <p>
      Download our ARchitect mobile app to view and edit your designs in
      augmented reality!
    </p>

    <div className="reviews-section">
      <p>What our users are saying:</p>
      <ul className="reviews-list">
        <li className="review">
          <blockquote>
            &quot;Absolutely incredible! Designing in AR has never been easier. I
            can&apos;t believe how realistic it looks!&quot;
          </blockquote>
          <cite>- John B.</cite>
        </li>
        <li className="review">
          <blockquote>
            &quot;I used ARchitect to design my living room layout, and it turned
            out perfect! Highly recommend.&quot;
          </blockquote>
          <cite>- Marci N.</cite>
        </li>
        <li className="review">
          <blockquote>
            &quot;This app is a game-changer. Being able to edit designs in
            augmented reality is so intuitive and fun!&quot;
          </blockquote>
          <cite>- Taylor S.</cite>
        </li>
      </ul>
    </div>
  </div>
);

export default Mobile;

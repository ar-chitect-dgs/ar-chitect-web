import React from 'react';
import './styles/About.css';
import { useTranslation } from 'react-i18next';

const Mobile = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <h1>{t('mobile.title')}</h1>
      <p>{t('mobile.description1')}</p>
      <p>{t('mobile.description2')}</p>

      <div className="reviews-section">
        <p>{t('mobile.reviewsTitle')}</p>
        <ul className="reviews-list">
          <li className="review">
            <blockquote>{t('mobile.review1.text')}</blockquote>
            <cite>{t('mobile.review1.author')}</cite>
          </li>
          <li className="review">
            <blockquote>{t('mobile.review2.text')}</blockquote>
            <cite>{t('mobile.review2.author')}</cite>
          </li>
          <li className="review">
            <blockquote>{t('mobile.review3.text')}</blockquote>
            <cite>{t('mobile.review3.author')}</cite>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Mobile;

import React from 'react';
import './components.css';

// 이미지 임포트
import catImg from './HSJasset/cat.png';
import angryImg from './HSJasset/angry.png';
import disgustImg from './HSJasset/disgust.png';
import fearImg from './HSJasset/fear.png';
import happyImg from './HSJasset/happy.png';
import sadImg from './HSJasset/sad.png';
import surpriseImg from './HSJasset/surprise.png';

const BackgroundImages = () => {
  const images = [
    { src: catImg, alt: 'cat' },
    { src: angryImg, alt: 'angry' },
    { src: disgustImg, alt: 'disgust' },
    { src: fearImg, alt: 'fear' },
    { src: happyImg, alt: 'happy' },
    { src: sadImg, alt: 'sad' },
    { src: surpriseImg, alt: 'surprise' }
  ];

  return (
    <div className="background-images">
      {images.map((img, index) => (
        <img
          key={index}
          src={img.src}
          alt={img.alt}
          className={`floating-image floating-image-${index}`}
          style={{
            '--rotation': `${Math.random() * 30 - 15}deg`,
            '--delay': `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundImages; 
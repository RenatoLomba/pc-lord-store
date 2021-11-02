import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Carousel } from 'react-responsive-carousel';

type CustomCarousel = {
  featured: {
    image: string;
    name: string;
    description: string;
    _id: string;
    slug: string;
  }[];
};

const FeaturedCarousel: FC<CustomCarousel> = ({ featured }) => {
  const router = useRouter();

  const clickItemHandler = (i: number) => {
    router.push(`/product/${featured[i].slug}`);
  };

  return (
    <Carousel showStatus={false} autoPlay onClickItem={clickItemHandler}>
      {featured?.map((f) => (
        <div key={f._id} style={{ cursor: 'pointer' }}>
          <img
            src={f.image}
            alt={f.name}
            // style={{ width: 600, height: 300, objectFit: 'contain' }}
          />
          <p className="legend">{f.description}</p>
        </div>
      ))}
    </Carousel>
  );
};

export { FeaturedCarousel };

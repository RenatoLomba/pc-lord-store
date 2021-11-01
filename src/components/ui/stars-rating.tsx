import { HStack, Icon, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MdStar, MdStarBorder, MdStarHalf } from 'react-icons/md';

type StarsRatingProps = {
  rating: number;
  numReviews: number;
};

const StarsRating: FC<StarsRatingProps> = ({ rating, numReviews }) => {
  const s = [0, 0, 0, 0, 0];
  let floor = Math.floor(rating);
  let left = rating - floor;

  for (let i = 0; i < 5; i++) {
    if (floor > 0) {
      s[i] = 2;
    } else if (left > 0) {
      s[i] = 1;
      left--;
    } else {
      s[i] = 0;
    }

    floor--;
  }

  return (
    <HStack>
      {s.map((value) => (
        <>
          {value === 0 && (
            <Icon color="warning.def" w={5} h={5} as={MdStarBorder} />
          )}
          {value === 1 && (
            <Icon color="warning.def" w={5} h={5} as={MdStarHalf} />
          )}
          {value === 2 && <Icon color="warning.def" w={5} h={5} as={MdStar} />}
        </>
      ))}
      <Text>({numReviews})</Text>
    </HStack>
  );
};

export { StarsRating };

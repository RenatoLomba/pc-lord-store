import React, { FC, useEffect, useState } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';

type SelectCountProps = SelectProps & {
  count: number;
};

const SelectCount: FC<SelectCountProps> = ({ count, ...rest }) => {
  const [countOfOptions, setCountOfOptions] = useState<number[]>([]);

  useEffect(() => {
    const countArray = new Array(count);
    for (let i = 0; i < countArray.length; i++) {
      countArray[i] = i + 1;
    }
    setCountOfOptions(countArray);
  }, []);

  return (
    <Select {...rest}>
      {countOfOptions.length > 0 &&
        countOfOptions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
    </Select>
  );
};

export { SelectCount };

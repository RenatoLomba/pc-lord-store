import React, { FC } from 'react';
import nookies from 'nookies';
import { request } from '../../utils/request';
import { Btn } from '../ui/btn';
import { Card } from '../ui/card';
import { useFetchData } from '../../hooks/useFetchData';
import { Loading } from '../ui/loading';
import { RepeatIcon } from '@chakra-ui/icons';
import { DashCard } from '../ui/dash-card';

type UsersData = {
  users: {
    count: number;
  };
};

const fetchUsersData = async (): Promise<UsersData> => {
  const { USER_TOKEN } = nookies.get(null);
  const { data } = await request.get('users/admin/count', {
    headers: { Authorization: 'Bearer ' + USER_TOKEN },
  });

  return data;
};

const UsersCard: FC = () => {
  const { data, error, isLoading, fetchData } = useFetchData(fetchUsersData);

  return (
    <Card shadow="dark-lg">
      {isLoading ? (
        <Loading />
      ) : error ? (
        <Btn onClick={fetchData}>
          <RepeatIcon />
        </Btn>
      ) : (
        <DashCard title="Usuários" value={data?.users.count.toString() || ''} />
      )}
    </Card>
  );
};

export { UsersCard };

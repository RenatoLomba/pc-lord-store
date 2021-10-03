const getError = (err: any) => {
  return err.response?.data?.message || err.message;
};

export { getError };

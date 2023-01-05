import { useRouter } from 'next/router';

const List = () => {
  const router = useRouter();
  const routeData = router.query;

  return <h1>List ID: {routeData.list}</h1>;
};

export default List;

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';
import ListControls from '../components/shared/ListControls';
import { api } from '../utils/api';
import Owner from '../components/shared/Owner';
import { formatAsFriendlyDate } from '../utils/utils';
import Copy from '../components/shared/Copy';

const List = () => {
  const router = useRouter();
  const routeData = router.query;
  const listId = routeData.list || '1';
  const { data, isLoading } = api.list.getListById.useQuery({
    id: listId as string,
  });
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      setCurrentPath(window.location.href);
    }
  }, [data, setCurrentPath]);

  return (
    <>
      {isLoading && (
        <MainLayout>
          <h1 className="text-5xl font-bold">Just one sec...</h1>
          <p className="py-6">Looking in the kitchen drawer for your list.</p>
          <PageSpinner />
        </MainLayout>
      )}
      {!isLoading && !data && (
        <MainLayout>
          <h1 className="text-5xl font-bold">What was that?</h1>
          <p className="py-6">
            Sorry, we can&apos;t find any list with that name. Perhaps it&apos;s
            been thrown in the bin by it&apos;s owner?
          </p>
          <p>
            <Link href="/" className="underline">
              Return home and maybe try again?
            </Link>
          </p>
        </MainLayout>
      )}
      {!isLoading && data && (
        <MainLayout classes="items-start pt-10" hero={false}>
          <h1 className="overflow-hidden text-ellipsis pb-6 text-5xl font-bold">
            {data.title}
          </h1>
          <ListControls listId={data.id} listOwner={data.user.id} />
          <div className="rounded-lg p-10 shadow-lg">
            <div className="flex flex-row flex-wrap pb-6">
              <div className="order-1 flex w-full flex-col md:order-1 md:basis-3/5">
                <Owner sub="List owner" user={data.user} />
              </div>
              <div className="placeholder: order-3 flex w-full flex-col md:order-2 md:basis-2/5">
                <p className="text-sm text-gray-400">Created:</p>
                <p className="flex pb-2 text-sm">
                  {formatAsFriendlyDate(data.createdAt)}
                </p>
              </div>
              <div className="order-2 flex w-full flex-col overflow-hidden text-ellipsis md:order-3 md:basis-3/5">
                <p className="text-sm text-gray-400">List shareable link:</p>
                <p className="flex pb-2 pr-2 text-sm">
                  <span className="block overflow-hidden text-ellipsis">
                    {currentPath}
                  </span>
                  <Copy path={currentPath} />
                </p>
              </div>
              <div className="order-4 flex w-full flex-col  md:order-4 md:basis-2/5">
                <p className="text-sm text-gray-400">Last updated:</p>
                <p className="flex pb-2 text-sm">
                  {formatAsFriendlyDate(data.updatedAt)}
                </p>
              </div>
            </div>
            <p className="rounded-md bg-base-200 p-4">{data.description}</p>
          </div>
          {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </MainLayout>
      )}
    </>
  );
};

export default List;

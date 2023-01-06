import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '../components/shared/MainLayout';
import PageSpinner from '../components/shared/PageSpinner';
import { api } from '../utils/api';
import { FiCopy } from 'react-icons/fi';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const List = () => {
  const router = useRouter();
  const routeData = router.query;
  const listId = routeData.lists || '1';
  const { data, isLoading } = api.list.getListById.useQuery({
    id: listId as string,
  });
  const [currentPath, setCurrentPath] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (data && typeof window !== 'undefined') {
      setCurrentPath(window.location.href);
    }
  }, [data, setCurrentPath]);

  return (
    <>
      <MainLayout classes="items-start pt-10" hero={false}>
        {isLoading && (
          <>
            <h1 className="text-5xl font-bold">Just one sec...</h1>
            <p className="py-6">Looking in the kitchen drawer for your list.</p>
            <PageSpinner />
          </>
        )}
        {!isLoading && !data && (
          <>
            <h1 className="text-5xl font-bold">What was that?</h1>
            <p className="py-6">
              Sorry, we can&apos;t find any list with that name. Perhaps
              it&apos;s been thrown in the bin by it&apos;s owner?
            </p>
            <p>
              <Link href="/" className="underline">
                Return home and maybe try again?
              </Link>
            </p>
          </>
        )}
        {!isLoading && data && (
          <>
            <p className="text-sm text-gray-400">List title:</p>
            <h1 className="overflow-hidden text-ellipsis pb-6 text-4xl font-bold text-primary">
              {data.title}
            </h1>
            <p className="text-sm text-gray-400">List shareable link:</p>
            <p className="flex pb-6 text-sm">
              <span className="block truncate">{currentPath}</span>
              <CopyToClipboard
                text={currentPath}
                onCopy={() => setCopied(true)}
              >
                {copied ? (
                  <span className="pl-2 text-sm text-accent-focus">
                    Copied!
                  </span>
                ) : (
                  <button className="pl-2 text-lg text-accent-focus">
                    <FiCopy />
                  </button>
                )}
              </CopyToClipboard>
            </p>
            <p className="text-sm text-gray-400">List description:</p>
            <p className="pb-6">{data.description}</p>
            <p className="text-sm text-gray-400">List items:</p>
            <p className="pb-6">Coming soon!</p>
            {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
          </>
        )}
      </MainLayout>
    </>
  );
};

export default List;

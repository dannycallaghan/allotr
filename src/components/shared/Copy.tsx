import CopyToClipboard from 'react-copy-to-clipboard';
import { FiCopy } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface IProps {
  path: string;
}

const Copy = (props: IProps) => {
  const { path } = props;
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let timer: string | number | NodeJS.Timeout | null | undefined = null;

    if (copied) {
      timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [copied, setCopied]);

  return (
    <CopyToClipboard text={path} onCopy={() => setCopied(true)}>
      {copied ? (
        <span className="pl-1 text-sm text-accent-focus">Copied!</span>
      ) : (
        <button className="pl-1 text-lg text-accent-focus">
          <FiCopy />
        </button>
      )}
    </CopyToClipboard>
  );
};

export default Copy;

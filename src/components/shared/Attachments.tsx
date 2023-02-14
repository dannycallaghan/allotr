import { useEffect, useState, useCallback } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import Alert from './Alert';
import AttachmentItem from './AttachmentItem';

interface IProps {
  attachments: string;
  update: (attachments: Image[]) => void;
}

export interface Image {
  id: string;
  secure_url: string;
  thumbnail_url?: string;
  created_at: string;
}

interface UploadInfo {
  error: boolean;
  images: Image[];
  used: boolean;
}

const Attachments = (props: IProps) => {
  const { attachments, update } = props;
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
    error: false,
    images: attachments.length ? JSON.parse(attachments) : [],
    used: false,
  });

  const [done, setDone] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const handleDone = (result: any) => {
    setDone((prev) => {
      return !prev;
    });
  };

  const handleUpload = (error, result, widget) => {
    console.log('handleUpload', result.info);
    update(result.info);
  };

  useEffect(() => {
    if (attachments.length) {
      setUploadInfo((prev) => ({
        ...prev,
        images: JSON.parse(attachments),
      }));
    }
  }, [attachments]);

  return (
    <>
      {uploadInfo.error && (
        <Alert type="error">
          Well, this is embarrassing. I&apos;m afraid something has gone wrong.
          It&apos;s us, not you. Try again in a minute?
        </Alert>
      )}
      <h6 className="label">
        <span>Need to add any attachments?</span>
      </h6>
      <pre>{JSON.stringify(count, null, 2)}</pre>
      <pre>{JSON.stringify(done, null, 2)}</pre>
      <pre>{JSON.stringify(uploadInfo, null, 2)}</pre>
      <CldUploadWidget
        // onUpload={(error, result, widget) => {
        //   //handleDone(result);
        //   // setDone(true);
        //   // if (error) {
        //   //   setUploadInfo((prev) => ({
        //   //     ...prev,
        //   //     used: true,
        //   //     error: true,
        //   //   }));
        //   //   return;
        //   // }
        //   setCount((prev) => prev + 1);
        //   setDone((prev) => !prev);
        //   console.log(result.info);
        //   setUploadInfo((prev) => {
        //     console.log('in setUploadInfo');
        //     // return {
        //     //   ...prev,
        //     //   images: [
        //     //     ...prev.images,
        //     //     {
        //     //       id: result.info.asset_id,
        //     //       secure_url: result.info.secure_url,
        //     //       thumbnail_url: result.info.thumbnail_url,
        //     //       created_at: result.info.created_at,
        //     //     },
        //     //   ],
        //     //   used: true,
        //     //   error: false,
        //     // };
        //     const newState = {
        //       ...prev,
        //       images: [
        //         ...prev.images,
        //         {
        //           id: result.info.asset_id,
        //           secure_url: result.info.secure_url,
        //           thumbnail_url: result.info.thumbnail_url,
        //           created_at: result.info.created_at,
        //         },
        //       ],
        //       used: true,
        //       error: false,
        //     };
        //     return { ...newState };
        //   });
        //   forceUpdate();
        // }}
        onUpload={handleUpload}
        uploadPreset="io41hln3"
      >
        {({ open }) => {
          function handleOnClick(e) {
            e.preventDefault();
            open();
          }
          return (
            <button
              onClick={handleOnClick}
              className="btn-accent btn-sm btn mb-6"
            >
              Click to add one or more attachments
            </button>
          );
        }}
      </CldUploadWidget>
      {!!uploadInfo.images.length && (
        <div className="rounded-lg bg-gray-200 p-4">
          <h5 className="w-full pb-4">Attachments</h5>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {uploadInfo.images.map((image) => (
              <AttachmentItem data={image} key={image.id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Attachments;

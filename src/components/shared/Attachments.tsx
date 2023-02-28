/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
// @ts-ignore
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
  console.log(typeof attachments, attachments.length);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
    error: false,
    images: attachments.length ? JSON.parse(attachments) : [],
    used: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpload = (result: unknown, widget: unknown) => {
    setUploadInfo((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          // @ts-ignore
          id: result.info.asset_id,
          // @ts-ignore
          secure_url: result.info.secure_url,
          // @ts-ignore
          thumbnail_url: result.info.thumbnail_url,
          // @ts-ignore
          created_at: result.info.created_at,
        },
      ],
      used: true,
      error: false,
    }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUploadError = (result: unknown, widget: unknown) => {
    setUploadInfo((prev) => ({
      ...prev,
      used: true,
      error: true,
    }));
  };

  useEffect(() => {
    if (uploadInfo.used) {
      console.log('called');
      update(uploadInfo.images);
    }
  }, [update, uploadInfo]);

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
      <pre>{JSON.stringify(uploadInfo, null, 2)}</pre>
      <CldUploadWidget
        uploadPreset="io41hln3"
        onUpload={handleUpload}
        onError={handleUploadError}
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

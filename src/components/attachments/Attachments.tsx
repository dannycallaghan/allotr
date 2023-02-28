/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';
// @ts-ignore
import { CldUploadWidget } from 'next-cloudinary';
import Alert from '../shared/Alert';
import AttachmentItem from './AttachmentItem';
import type { Task } from '../../types/types';

interface IProps {
  attachments: string | undefined;
  update: (attachments: string) => void;
  data: Task;
  disabled: boolean;
}

export interface File {
  id: string;
  secure_url: string;
  thumbnail_url?: string;
  created_at: string;
}

interface UploadInfo {
  error: boolean;
  files: File[];
  used: boolean;
}

const Attachments = (props: IProps) => {
  const { attachments, update, data, disabled } = props;
  const [uploadInfo, setUploadInfo] = useState<UploadInfo>({
    error: false,
    files: [],
    used: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpload = (result: unknown, widget: unknown) => {
    // @ts-ignore
    if (result.event !== 'success') return;

    setUploadInfo((prev) => ({
      ...prev,
      files: [
        ...prev.files,
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
    console.log('ERROR CALLED');
    setUploadInfo((prev) => ({
      ...prev,
      used: true,
      error: true,
    }));
  };

  const handleRemoveAttachment = (id: string) => {
    setUploadInfo((prev) => ({
      ...prev,
      files: [...prev.files.filter((file) => file.id !== id)],
      used: true,
      error: false,
    }));
  };

  useEffect(() => {
    if (uploadInfo.used && uploadInfo.files.length) {
      update(JSON.stringify(uploadInfo.files));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadInfo.files]);

  useEffect(() => {
    let files: File[] = [];
    try {
      // @ts-ignore
      files = JSON.parse(attachments);
    } catch (e) {}
    setUploadInfo((prev) => ({
      ...prev,
      files,
    }));
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
        <span>Add photos, images, documents, that you think are useful</span>
      </h6>
      <CldUploadWidget
        uploadPreset="io41hln3"
        onUpload={handleUpload}
        onError={handleUploadError}
      >
        {(args: { open: () => void }) => {
          function handleOnClick(e: { preventDefault: () => void }) {
            e.preventDefault();
            args.open();
          }
          return (
            <button
              onClick={handleOnClick}
              className="btn-accent btn-sm btn mb-6"
              disabled={disabled}
            >
              Click to add one or more attachments
            </button>
          );
        }}
      </CldUploadWidget>
      {!!uploadInfo.files.length && (
        <>
          <h5 className="w-full pb-4">Attachments</h5>
          <div>
            {uploadInfo.files.map((file) => (
              <AttachmentItem
                remove={handleRemoveAttachment}
                data={data}
                file={file}
                key={file.id}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Attachments;

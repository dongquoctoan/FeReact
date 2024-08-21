import {
  DeleteOutlined,
  ExpandOutlined,
  FileImageOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { message, Space, Upload } from "antd";
import { RcFile, UploadProps } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import styles from "components/UploadImages/UploadImages.module.css";
import { compact, remove, uniqueId } from "lodash";
import React, { FC, MouseEvent, useState } from "react";

type Props = {
  value: Array<string>;
  onChange: (value: Array<string>) => void;
  multiple?: boolean;
  firstLabel?: string;
  label?: string;
  id?: string;
  deleteWithId?: (id: string) => void;
};

const beforeUploadImage = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.warning(
      "Định dạng file không phù hợp. Chỉ có thể tải lên file JPG/PNG."
    );
  }

  const isLt1M = file.size / 1024 / 1024 < 1;
  if (!isLt1M) {
    message.warning("Dung lượng file phải nhỏ hơn 1MB!");
  }
  return isJpgOrPng && isLt1M;
};

const UploadImages: FC<Props> = ({
  label,
  firstLabel,
  value,
  onChange,
  multiple,
  id,
  deleteWithId,
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleChange: UploadProps["onChange"] = (info) => {
    setIsUploading(true);
    let newFileList = [...info.fileList];
    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.result.publicUrl;
      }
      return file;
    });

    const isUploaded = newFileList.every(
      (file) => file.status == "done" || file.status == undefined
    );
    if (isUploaded && newFileList.length) {
      setIsUploading(false);
      const urls = newFileList.map((file) => file.url || false);
      onChange(compact(urls));
    }
  };

  const handleDeleteFileUpload = (url: string) => {
    const newFileList = [...value];
    remove(newFileList, (n) => {
      return n == url;
    });

    onChange(newFileList);

    if (id && deleteWithId) {
      deleteWithId(id);
    }
  };

  const handlePreviewFileUpload = (
    evt: MouseEvent<HTMLSpanElement>,
    previewUrl: string
  ) => {
    evt.stopPropagation();
    const win = window.open();
    win && win.document.write(`<img src=${previewUrl} />`);
  };

  const generateFileListFromValue = () => {
    const newFileList = value.map(
      (url) =>
        ({
          url,
          uid: uniqueId(),
          name: uniqueId() + ".jpg",
          status: "done",
        } as UploadFile<any>)
    );

    return newFileList;
  };

  return (
    <div className={styles.wrapper}>
      <Space size="large" align="start" wrap style={{ width: "100%" }}>
        {value.map((url, idx) => (
          <div key={url}>
            <div className={styles.preview}>
              <img src={url} alt="" />
              <div className={styles.action}>
                <div>
                  <ExpandOutlined
                    onClick={(evt) => handlePreviewFileUpload(evt, url)}
                  />
                </div>
                <span className={styles.actDivider} />
                <div>
                  <DeleteOutlined onClick={() => handleDeleteFileUpload(url)} />
                </div>
              </div>
            </div>
            {idx == 0 && firstLabel ? (
              <div className={styles.lable}>{firstLabel}</div>
            ) : (
              <>{label && <div className={styles.lable}>{label}</div>}</>
            )}
          </div>
        ))}
        {((!multiple && !value.length) || multiple) && (
          <>
            <Upload
              name="file"
              action="/api/images"
              beforeUpload={beforeUploadImage}
              showUploadList={false}
              onChange={handleChange}
              multiple={multiple}
              defaultFileList={generateFileListFromValue()}
              listType="picture"
            >
              <div className={styles.trigger}>
                {isUploading ? <LoadingOutlined /> : <FileImageOutlined />}
              </div>
              {label && <div className={styles.lable}>{label}</div>}
            </Upload>
          </>
        )}
      </Space>
    </div>
  );
};

export default React.memo(UploadImages);

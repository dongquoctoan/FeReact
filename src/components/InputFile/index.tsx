import { FileOutlined } from "@ant-design/icons";
import { Space, message } from "antd";
import React, { FC, useRef } from "react";

type Props = {
  value: Array<any>;
  onChange: (files?: any) => void;
  children?: React.ReactNode;
  multiple?: boolean;
  allowedType?: Array<string>;
  size?: number;
  accept?: string;
};

const MAX_SIZE_FILE = 10 * 1024 * 1024; //10MB

const InputFile: FC<Props> = ({
  value = [],
  onChange,
  multiple,
  children,
  allowedType = [],
  size = MAX_SIZE_FILE,
  accept,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChooseFile = () => {
    if (inputRef.current instanceof HTMLElement) {
      inputRef.current.click();
    }
  };

  const handleFileChange = () => {
    if (inputRef.current instanceof HTMLElement) {
      const fileAlloweds = [];
      if (inputRef.current instanceof HTMLElement && inputRef.current.files) {
        const fileUploads = Array.from(inputRef.current.files);

        for (const file of fileUploads) {
          if (
            file.size <= size &&
            ((allowedType.length > 0 && allowedType.includes(file.type)) ||
              allowedType.length === 0)
          ) {
            fileAlloweds.push(file);
          } else {
            message.error(file.name + " không hợp lệ.");
          }
        }

        onChange(fileAlloweds);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
      />
      <div onClick={handleOpenChooseFile}>{children}</div>
      <Space direction="vertical">
        {value.map((file) => (
          <Space key={file.name}>
            <FileOutlined />
            <span>{file.name}</span>
          </Space>
        ))}
      </Space>
    </div>
  );
};

export default InputFile;

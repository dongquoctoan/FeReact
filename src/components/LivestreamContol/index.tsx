import { useHookstate } from "@hookstate/core";
import {
  Affix,
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  DatePicker,
} from "antd";
import CardTitle from "components/CardTitle";
import livestreamControlStore, {
  resetState,
} from "components/LivestreamContol/store";
import { NewLiveStreamSession } from "constants/types/livestream.type";
import useComponentMounted from "hooks/useComponentMounted";
import { usePrevious } from "hooks/usePrevious";
import { isEqual } from "lodash";
import React, { FC, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LIVESTREAM_LIST } from "routes/route.constant";
import { z } from "zod";
import moment from "moment";

const { RangePicker } = DatePicker;

type LivestreamControlBasicError = {
  title: Array<string>;
  link_livestream: Array<string>;
  time: Array<string>;
};

const urlRegex = /^(?:(?:https?:\/\/)?(?:[^\s.]+\.\S{2}|localhost[:?\d]*)\S*)$/;

const validateBasicSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Tiêu đề không được để trống." }),
    link_livestream: z
      .string()
      .trim()
      .min(1, { message: "Liên kết không được để trống" })
      .regex(urlRegex, { message: "Đường dẫn không hợp lệ" }),
    start_time: z.string(),
    end_time: z.string(),
  })
  .refine((data: any) => data.start_time || data.end_time, {
    message: "Thời gian livestream không được để trống.",
    path: ["time"],
  });

const initialBasicError = {
  title: [],
  link_livestream: [],
  time: [],
};

export type InitialLivestream = {
  title: string;
  link_livestream: string;
  start_time: string;
  end_time: string;
};

type Props = {
  initialLivestream?: InitialLivestream;
  type?: "edit" | "add";
  onSubmit: (data: NewLiveStreamSession) => void;
};

const LivestreamControl: FC<Props> = ({
  initialLivestream,
  type,
  onSubmit,
}) => {
  const navigate = useNavigate();
  const isMounted = useComponentMounted();
  const livestreamControlState = useHookstate(livestreamControlStore);
  const errorBasicState =
    useHookstate<LivestreamControlBasicError>(initialBasicError);

  const prevInitialLivestream = usePrevious(initialLivestream);

  useEffect(() => {
    if (
      initialLivestream &&
      !isEqual(initialLivestream, prevInitialLivestream)
    ) {
      const { title, link_livestream, start_time, end_time } =
        initialLivestream;
      livestreamControlState.title.set(title);
      livestreamControlState.link_livestream.set(link_livestream);
      livestreamControlState.start_time.set(start_time);
      livestreamControlState.end_time.set(end_time);
    }
  }, [initialLivestream]);

  const validateBasicLivestreamSetting = () => {
    const result = validateBasicSchema.safeParse(livestreamControlState.value);
    if (result.success == false) {
      const errors: any = result.error.flatten().fieldErrors;
      errorBasicState.set(errors);
      return false;
    } else {
      errorBasicState.set(initialBasicError);
      return true;
    }
  };

  const changeLivestreamTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    livestreamControlState.title.set(title);
  };

  const changeLinkLivestream = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linkLivestream = e.target.value;
    livestreamControlState.link_livestream.set(linkLivestream);
  };

  const changeLivestreamTime = (value: any, dateStrings: [string, string]) => {
    livestreamControlState.start_time.set(dateStrings[0]);
    livestreamControlState.end_time.set(dateStrings[1]);
  };

  const submitForm = async () => {
    try {
      const cloneData = JSON.parse(
        JSON.stringify(livestreamControlState.value)
      );

      const validBasicSetting = validateBasicLivestreamSetting();

      if (!validBasicSetting) return;

      onSubmit(cloneData);
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const cancelLivestreamControl = () => {
    resetState();
    navigate(LIVESTREAM_LIST);
  };

  useEffect(() => {
    return () => {
      if (isMounted) {
        resetState();
      }
    };
  }, [isMounted]);

  return (
    <>
      <Card>
        <CardTitle title="Thông tin Livestream" />
        <Form colon={false} labelCol={{ span: 3 }} wrapperCol={{ span: 20 }}>
          <Form.Item
            label="Tiêu đề"
            help={errorBasicState.title[0] && errorBasicState.title[0].get()}
            validateStatus={
              errorBasicState.title[0] && errorBasicState.title[0].get()
                ? "error"
                : ""
            }
          >
            <Input
              onChange={changeLivestreamTitle}
              value={livestreamControlState.title.get()}
              placeholder="Tiêu đề Livestream"
            />
          </Form.Item>
          <Form.Item
            label="Đường dẫn"
            help={
              errorBasicState.link_livestream[0] &&
              errorBasicState.link_livestream[0].get()
            }
            validateStatus={
              errorBasicState.link_livestream[0] &&
              errorBasicState.link_livestream[0].get()
                ? "error"
                : ""
            }
          >
            <Input
              placeholder="Đường dẫn Livestream"
              value={livestreamControlState.link_livestream.get()}
              onChange={changeLinkLivestream}
            />
          </Form.Item>
          <Form.Item
            label="Thời gian Livestream"
            help={errorBasicState.time[0] && errorBasicState.time[0].get()}
            validateStatus={
              errorBasicState.time[0] && errorBasicState.time[0].get()
                ? "error"
                : ""
            }
          >
            <RangePicker
              showTime={{ showSecond: false }}
              format="HH:mm DD/MM/YYYY"
              onChange={changeLivestreamTime}
              value={[
                JSON.parse(
                  JSON.stringify(livestreamControlState.start_time.get())
                ) &&
                  moment(
                    livestreamControlState.start_time.get(),
                    "HH:mm DD/MM/YYYY"
                  ),
                JSON.parse(
                  JSON.stringify(livestreamControlState.end_time.get())
                ) &&
                  moment(
                    livestreamControlState.end_time.get(),
                    "HH:mm DD/MM/YYYY"
                  ),
              ]}
            />
          </Form.Item>
        </Form>
      </Card>
      <Affix offsetBottom={0}>
        <Card style={{ marginTop: 16 }}>
          <Space>
            <Button onClick={cancelLivestreamControl}>Hủy</Button>
            <Button type="primary" onClick={submitForm}>
              Xác nhận
            </Button>
          </Space>
        </Card>
      </Affix>
    </>
  );
};

export default memo(LivestreamControl);

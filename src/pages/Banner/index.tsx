import { useState, useEffect } from "react";
import { Button, Card, Form, Space, Upload, message } from "antd";
import CardTitle from "components/CardTitle";
import UploadImages from "components/UploadImages";
import { bannerApi } from "apis/banner";

const Banner = () => {
  const [images, setImages] = useState<string[]>([]);
  const [banners, setBanners] = useState<Array<any>>([]);

  const fetchBanners = async () => {
    try {
      const res = await bannerApi.getAll();
      const docs = res.data.result;
      setBanners(docs);
      // eslint-disable-next-line no-empty
    } catch {}
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleUploadImageChange = (imageUrls: Array<string>) => {
    setImages(imageUrls);
  };

  const handleImagesChange = (imageUrls: Array<string>) => {
    //setImages(imageUrls);
  };

  const handleDeleteWithId = async (id: string) => {
    try {
      await bannerApi.delete(id);
      fetchBanners();
      // eslint-disable-next-line no-empty
    } catch (error: any) {
      message.error(error.response.data.error.message);
    }
  };

  const handleUploadImage = async () => {
    try {
      for (let i = 0; i < images.length; i++) {
        await bannerApi.create({ image: images[i] });
      }
      message.success("Cập nhật banner thành công.");
      setImages([]);
      fetchBanners();
      // eslint-disable-next-line no-empty
    } catch (error: any) {
      const err = error?.response?.data?.error?.message;
      message.error(err ? err : "Cập nhật banner không thành công!");
    }
  };

  return (
    <div>
      <Card>
        <CardTitle
          title="Banner trang chủ"
          subtitle="Danh sách ảnh banner trang chủ"
        />
        <Form>
          <Form.Item>
            <Space>
              {banners.map((item: any) => (
                <UploadImages
                  key={item._id}
                  value={[item.image]}
                  onChange={handleImagesChange}
                  id={item._id}
                  deleteWithId={handleDeleteWithId}
                />
              ))}
              <UploadImages
                value={images}
                onChange={handleUploadImageChange}
                multiple
              />
            </Space>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={handleUploadImage}>
          Cập nhật
        </Button>
      </Card>
    </div>
  );
};

export default Banner;

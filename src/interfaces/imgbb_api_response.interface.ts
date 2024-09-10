interface ImageInfo {
  filename: string;
  name: string;
  mime: string;
  extension: string;
  url: string;
}

export interface ImgBBApiResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    width: number;
    height: number;
    size: number;
    expiration: number;
    image: ImageInfo;
    thumb: ImageInfo;
    medium?: ImageInfo;
    delete_url: string;
  };
  success: boolean;
  status: number;
}

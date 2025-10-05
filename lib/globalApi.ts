const { default: axios } = require("axios");

const axiosNHBClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NHB_URL,
});

const getHairStyles = async () => {
  try {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://niyo-nhb-prod-api-wtushxuzaa-nw.a.run.app/api/v1/hairstyles/hair/public",
      headers: {},
    };

    const response = await axiosNHBClient.request(config);

    return response?.data;
  } catch (error) {
    console.log("error getting hair styles", error);
    return error;
  }
};

export default {
  getHairStyles,
};

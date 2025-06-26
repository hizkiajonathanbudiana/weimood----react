import axiosInstance from "./axiosInstance";

export const getRandomQuote = async () => {
  const { data } = await axiosInstance.get("/quotes");
  // data = { content, author }
  return data;
};

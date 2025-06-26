import axios from "axios";

const QUOTE_API_URL = "http://api.quotable.io/quotes/random";

export const getRandomQuote = async () => {
  try {
    const response = await axios.get(QUOTE_API_URL);

    const quoteData = response.data[0];

    if (!quoteData) {
      throw new Error("Tidak ada quote yang diterima dari API.");
    }

    return { content: quoteData.content, author: quoteData.author };
  } catch (error) {
    console.error("API Quote Error:", error);
    throw new Error("Gagal mengambil quote dari API.");
  }
};

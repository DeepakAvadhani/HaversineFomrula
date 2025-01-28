const axios = require('axios');

const API_KEY = '132c73a5fdd63e6ca624fa190b7eb64fccdc7248a1e9ed99c9c994221f582a2d';
const API_URL = 'https://go-upc.com/api/v1/code/';

const getProductByBarcode = async (req, res) => {
  const { barcode } = req.params;

  if (!barcode) {
    return res.status(400).json({ message: 'Barcode is required' });
  }

  try {
    const response = await axios.get(`${API_URL}${barcode}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const message = error.response?.data?.message || 'Failed to fetch product';
    res.status(statusCode).json({ message });
  }
};

module.exports = { getProductByBarcode };

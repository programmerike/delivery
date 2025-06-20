import axios from './axios';

export const submitOrders = async (data) => {
    const res = await axios.post('/submit-orders', data);
    return res.data;
}
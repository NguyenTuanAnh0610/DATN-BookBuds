// src/apis/reviewApi.js
import axiosClient from "./axiosClient";

const reviewApi = {
  // Lấy tất cả reviews (mới thêm)
 // Ví dụ đúng

 getAllReviews: async () => {
    try {
      const response = await axiosClient.get('/reviews');
      return response.data; // Trả về đúng response.data
    } catch (error) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw error;
    }
  },
  
  
  // Lấy reviews theo bookId
  getReviewsByBookId: (id) => {
    return axiosClient.get(`/reviews/book/${id}`);
  },
  
  // Xóa review
  deleteReview: (id) => {
    return axiosClient.delete(`/reviews/${id}`);
  }
};

export default reviewApi;
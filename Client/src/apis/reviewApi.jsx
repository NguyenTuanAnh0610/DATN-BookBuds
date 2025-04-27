import axiosClient from "./axiosClient";

const API_URL = '/reviews';

const reviewApi = {
  getReviewsByBookId: (id) => {
    const url = `/reviews/book/${id}`;
    return axiosClient.get(url);
  },
  
  createReview: (data) => {
    console.log('Sending review data:', data); // Debug log
    const url = '/reviews';
    return axiosClient.post(url, {
      book_id: parseInt(data.book_id),
      rating: parseInt(data.rating),
      comment: data.comment,
      user_id: parseInt(data.user_id)
    });
  },

  updateReview: (id, data) => {
    const url = `/reviews/${id}`;
    return axiosClient.put(url, data);
  },

  deleteReview: (id) => {
    const url = `/reviews/${id}`;
    return axiosClient.delete(url);
  }
};

export default reviewApi;

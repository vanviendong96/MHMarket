import { TId } from '../const/interface';
import axiosClient from './axiosClients';

const marketApis = {
  getMarkets: () => axiosClient.get('/markets'),
  getMarket: (id: TId) => axiosClient.get(`/markets/${id}?draft=true`),
  deleteMarket: (id: TId) => axiosClient.delete(`/markets/${id}`),
  createMarket: (payload: any) => axiosClient.post(`/markets`, payload),
  editMarket: (id: TId, payload: any) =>
    axiosClient.put(`/markets/${id}`, payload),
  publishMarket: (id: TId) => axiosClient.post(`/markets/${id}/publish`),

  getProvinces: () => axiosClient.get('/locations/provinces'),
  getCities: (params: any) =>
    axiosClient.get('/locations/cities', {
      params: params,
    }),
  getWards: (params: any) =>
    axiosClient.get('/locations/wards', {
      params: params,
    }),
  getLocation: (params: any) =>
    axiosClient.get('/locations/query', {
      params: params,
    }),
};

export default marketApis;

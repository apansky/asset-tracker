import { defineStore } from 'pinia';
import axios, { isAxiosError } from 'axios';
import type { Asset } from '~/interfaces/asset.interface';
import { environment } from '~/environment';

export const useAssetsStore = defineStore('assets', () => {
  const asset = ref(null);
  const assets = ref([]);
  const fetchingAssets = ref(true);

  const fetchAssets = async (name?: string) => {
    try {
      const { data } = await axios.get(`${environment.API_URL}assets`, {
        params: {
          name
        }
      });
      fetchingAssets.value = false;
      assets.value = data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { notify } = useNotification();
        notify({
          text: error.message,
          type: 'error'
        });
      }
    }
  };

  const fetchAsset = async (id: string) => {
    try {
      const { data } = await axios.get(`${environment.API_URL}assets/${id}`);
      asset.value = data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { notify } = useNotification();
        notify({
          text: error.message,
          type: 'error'
        });
      }
    }
  };

  const updateAsset = async (asset: Asset) => {
    try {
      const { data } = await axios.put(`${environment.API_URL}assets/${asset.id}`, asset);
      assets.value = assets.value.map((asset) => (asset.id === data.id ? data : asset));
      const { notify } = useNotification();
      notify({
        text: 'Asset updated',
        type: 'success'
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { notify } = useNotification();
        notify({
          text: error.message,
          type: 'error'
        });
      }
    }
  };

  const addAsset = async (asset: Asset) => {
    try {
      const { data } = await axios.post(`${environment.API_URL}assets`, asset);
      assets.value = [...assets.value, data];
      const { notify } = useNotification();
      notify({
        text: 'Asset added',
        type: 'success'
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { notify } = useNotification();
        notify({
          text: error.message,
          type: 'error'
        });
      }
    }
  };

  const deleteAsset = async (id: string) => {
    try {
      const { data } = await axios.delete(`${environment.API_URL}assets/${id}`);
      assets.value = assets.value.filter((asset: Asset) => asset.id !== data.id);
      const { notify } = useNotification();
      notify({
        text: 'Asset deleted',
        type: 'success'
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const { notify } = useNotification();
        notify({
          text: error.message,
          type: 'error'
        });
      }
    }
  };

  const unselectAsset = (): void => (asset.value = null);

  return { asset, assets, fetchingAssets, fetchAssets, fetchAsset, updateAsset, addAsset, deleteAsset, unselectAsset };
});

import { defineStore } from 'pinia';
import axios, { isAxiosError } from 'axios';
import type { Asset } from '~/interfaces/asset.interface';
import { environment } from '~/environment';

type AssetsState = {
  asset: Asset | null;
  assets: Asset[];
  fetchingAssets: boolean;
  fetchingAsset: boolean;
};

export const useAssetsStore = defineStore('assets', {
  state: (): AssetsState => ({
    asset: null,
    assets: [],
    fetchingAssets: true,
    fetchingAsset: false
  }),
  actions: {
    async fetchAssets(name?: string) {
      try {
        const { data } = await axios.get(`${environment.API_URL}assets`, {
          params: {
            name
          }
        });
        this.fetchingAssets = false;
        this.assets = data;
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        }
      }
    },
    async fetchAsset(id: string) {
      try {
        const { data } = await axios.get(`${environment.API_URL}assets/${id}`);
        this.fetchingAsset = false;
        this.asset = data;
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        }
      }
    },
    async updateAsset(asset: Asset) {
      try {
        const { data } = await axios.put(`${environment.API_URL}assets/${asset.id}`, asset);
        this.assets = this.assets.map((asset) => (asset.id === data.id ? data : asset));
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
    },
    async addAsset(asset: Asset) {
      try {
        const { data } = await axios.post(`${environment.API_URL}assets`, asset);
        this.assets = [...this.assets, data];
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
    },
    async deleteAsset(id: string) {
      try {
        const { data } = await axios.delete(`${environment.API_URL}assets/${id}`);
        this.assets = this.assets.filter((asset: Asset) => asset.id !== data.id);
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
    },
    unselectAsset(): void {
      this.asset = null;
    }
  }
});

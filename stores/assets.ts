import { defineStore } from 'pinia';
import axios, { type AxiosResponse } from 'axios';
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
    fetchAssets(): void {
      axios
        .get(`${environment.API_URL}assets`)
        .then((data: AxiosResponse<Asset[]>) => {
          this.fetchingAssets = false;
          this.assets = data.data;
        })
        .catch((error) => {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        });
    },
    fetchAsset(id: string): void {
      axios
        .get(`${environment.API_URL}assets/${id}`)
        .then((data: AxiosResponse<Asset>) => {
          this.fetchingAsset = false;
          this.asset = data.data;
        })
        .catch((error) => {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        });
    },
    unselectAsset(): void {
      this.asset = null;
    },
    updateAsset(asset: Asset): void {
      axios
        .put(`${environment.API_URL}assets/${asset.id}`, asset)
        .then((data: AxiosResponse<Asset>) => {
          this.assets = this.assets.map((asset) => (asset.id === data.data.id ? data.data : asset));
          const { notify } = useNotification();
          notify({
            text: 'Asset updated',
            type: 'success'
          });
        })
        .catch((error) => {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        });
    },
    addAsset(asset: Asset): void {
      axios
        .post(`${environment.API_URL}assets`, asset)
        .then((data: AxiosResponse<Asset>) => {
          this.assets = [...this.assets, data.data];
          const { notify } = useNotification();
          notify({
            text: 'Asset added',
            type: 'success'
          });
        })
        .catch((error) => {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        });
    },
    deleteAsset(id: string): void {
      axios
        .delete(`${environment.API_URL}assetss/${id}`)
        .then((data: AxiosResponse<Asset>) => {
          this.assets = this.assets.filter((asset: any) => asset.id !== data.data.id);
        })
        .catch((error) => {
          const { notify } = useNotification();
          notify({
            text: error.message,
            type: 'error'
          });
        });
    }
  }
});

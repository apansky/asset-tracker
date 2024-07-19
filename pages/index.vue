<template>
  <div class="container mx-auto">
    <div class="flex items-center justify-between py-4">
      <h1 class="text-2xl text-gray-800">Asset tracker</h1>
      <div class="flex items-center justify-between">
        <input type="text" id="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2" v-model="search" placeholder="Search" autocomplete="off">
        <button 
          class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap"
          @click="handleAddDialog(true)">
          Add asset
        </button>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <div class="flex items-center justify-center p-4" v-if="assetsStore.fetchingAssets">
          <span class="loader"></span>
        </div>
        <div class="overflow-x-auto" v-if="!assetsStore.fetchingAssets">
        <table class="min-w-full bg-white border border-purple-200">
          <thead>
            <tr class="bg-purple-500 text-white">
              <th class="py-3 px-4 border-b border-purple-300 text-left font-semibold text-sm">ID</th>
              <th class="py-3 px-4 border-b border-purple-300 text-left font-semibold text-sm">Name</th>
              <th class="py-3 px-4 border-b border-purple-300 text-left font-semibold text-sm"></th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover:bg-purple-100" :class="{'bg-purple-100': assetsStore.asset?.id === asset.id}" v-for="asset in assetsStore.assets">
              <td class="py-2 px-4 border-b border-purple-300 text-sm">
                <a href="#" @click="fetchAsset(asset.id)">{{ asset.id }}</a>
              </td>
              <td class="py-2 px-4 border-b border-purple-300 text-sm">
                <a href="#" @click="fetchAsset(asset.id)">{{ asset.name }}</a>
              </td>
              <td class="py-2 px-4 border-b border-purple-300 text-sm text-right">
                <button class="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-sm" @click="deleteAsset(asset.id)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center">
        <div class="w-full">
          <div v-if="assetsStore.asset">
            <div class="mb-3">
              <label for="name" class="block text-gray-700 font-semibold mb-2">Name</label>
              <input type="text" id="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="name">
              <div class="text-red-500" v-if="isInvalidName">Name is required</div>
            </div>
            <div class="mb-3">
              <label for="description" class="block text-gray-700 font-semibold mb-2">Description</label>
              <textarea id="description" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="description"></textarea>
            </div>
            <div class="mb-3">
              <label for="value" class="block text-gray-700 font-semibold mb-2">Value</label>
              <input type="text" id="value" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="value">
              <div class="text-red-500" v-if="isInvalidValue">Value is required and has to be in range 0 - 100</div>
            </div>
            <div class="mb-3">
              <label for="location" class="block text-gray-700 font-semibold mb-2">Location</label>
              <input type="text" id="location" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="location">
            </div>
            <div class="text-center">
              <button class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2" @click="unselectAsset()">
                Cancel
              </button>
              <button
                class="bg-purple-500 hover:enabled:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:enabled:scale-105"
                :class="{'opacity-50': isInvalidName || isInvalidValue}"
                :disabled="isInvalidName || isInvalidValue"
                @click="updateAsset()">
                Update asset
              </button>
            </div>
          </div>
          <div v-if="!assetsStore.asset">
            <p class="italic text-center text-gray-600">No asset selected.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <add-asset @close="handleAddDialog" v-if="addDialogVisible"></add-asset>
  <NuxtNotifications position="bottom right" :speed="500"/>
</template>

<script setup lang="ts">
  import { useAssetsStore } from '@/stores/assets';
  import { storeToRefs } from 'pinia';
  import { debounce, inRange } from 'lodash-es';
  import type { Asset } from '~/interfaces/asset.interface';

  const route = useRoute();
  const router = useRouter();
  const assetsStore = useAssetsStore();
  
  assetsStore.fetchAssets(route.query?.name ? route.query?.name as string : '');

  const { asset } = storeToRefs(assetsStore);

  watch(asset, () => {
    id.value = asset.value?.id;
    name.value = asset.value?.name;
    description.value = asset.value?.description;
    value.value = asset.value?.value;
    location.value = asset.value?.location;
  });

  const id = ref('');
  const name = ref('');
  const description = ref('');
  const value = ref();
  const location = ref('');

  const search = ref(route.query?.name ? route.query?.name as string : '');

  watch(search, debounce(() => {
    assetsStore.fetchAssets(search.value);
    assetsStore.unselectAsset();
    router.replace({query: {name: search.value}})
  }, 500))

  const deleteDialogVisible = ref(false);
  const addDialogVisible = ref(false);

  const handleDeleteDialog = (visible: boolean) => deleteDialogVisible.value = visible;
  const handleAddDialog = (visible: boolean, asset?: Asset) => {
    addDialogVisible.value = visible;
    if (asset) {
      assetsStore.addAsset(asset);
    }
  };

  const isInvalidName = computed(() => !name.value?.length);
  const isInvalidValue = computed(() => !value.value?.length || !inRange(value.value, 0, 100));

  const fetchAsset = (id: string) => assetsStore.fetchAsset(id);
  const deleteAsset = (id: string) => assetsStore.deleteAsset(id);
  const updateAsset = () => {
    const asset = {
      id: id.value,
      name: name.value,
      description: description.value,
      value: value.value,
      location: location.value
    }
    assetsStore.updateAsset(asset);
  }
  const unselectAsset = () => assetsStore.unselectAsset()
</script>

<style>
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #a855f7;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } 
</style>
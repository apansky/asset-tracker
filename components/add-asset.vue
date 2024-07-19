<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl">Add asset</h2>
        <button class="text-gray-600 hover:text-gray-800" @click="cancel()">&times;</button>
      </div>
      <div class="w-full">
        <div class="mb-3">
          <label for="name" class="block text-gray-700 font-semibold mb-2">Name</label>
          <input type="text" id="name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="name">
          <div class="text-red-500" v-if="isInvalidName">Name is required</div>
        </div>
        <div class="mb-3">
          <label for="description" class="block text-gray-700 font-semibold mb-2">Description</label>
          <input type="text" id="description" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" v-model="description">
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
      </div>
      <div class="text-center">
        <button class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2" @click="cancel()">
          Cancel
        </button>
        <button
          class="bg-purple-500 hover:enabled:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:enabled:scale-105"
          :class="{'opacity-50': isInvalidName || isInvalidValue}"
          :disabled="isInvalidName || isInvalidValue"
          @click="submit()">
          Update asset
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { inRange } from 'lodash-es';

  const emit = defineEmits(['close']);
  
  const submit = () => {
    const asset = {
      name: name.value,
      description: description.value,
      value: value.value,
      location: location.value
    };
    emit('close', false, asset);
  }

  const cancel = () => emit('close', false);

  const name = ref('');
  const description = ref('');
  const value = ref();
  const location = ref('');

  const isInvalidName = computed(() => !name.value?.length);
  const isInvalidValue = computed(() => !value.value?.length || !inRange(value.value, 0, 100));
</script>
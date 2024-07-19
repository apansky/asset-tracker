<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-xl">Delete asset</h2>
        <button class="text-gray-600 hover:text-gray-800">&times;</button>
      </div>
      <p class="mb-4">Are you sure you want to delete this asset?</p>
      <div class="text-center">
        <button class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 mr-2" @click="$emit('result', false)">
          Cancel
        </button>
        <button class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105" @click="$emit('result', true)">
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  
</script>
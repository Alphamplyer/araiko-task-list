<template>
  <div class="flex flex-col mt-4 bg-white shadow-md border border-zinc-400 rounded-lg w-full">
    <div class="p-4">
      <h5 v-if="$slots.title" class="mb-2 text-zinc-800 text-xl font-semibold">
        <slot name="title"></slot>
      </h5>
      <slot name="content"></slot>
    </div>
  </div>
</template>

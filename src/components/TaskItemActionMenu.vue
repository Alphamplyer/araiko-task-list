<script setup lang="ts">
import { Task } from '@/models/Task'
import { defineProps, ref } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import AButton from './AButton.vue'
import ArrowDownIcon from './icons/ArrowDownIcon.vue'

const { task } = defineProps<{ task: Task }>()

const showMenuOpen = ref(false)
function handleClick(key: string) {
  showMenuOpen.value = false
  switch (key) {
    case 'add-before':
      task.addBefore(Task.create('New Task'))
      break
    case 'add-children':
      task.addChild(Task.create('New Task'))
      break
    case 'add-after':
      task.addAfter(Task.create('New Task'))
      break
    case 'finish':
      task.markAsFinished()
      break
    case 'unfinished':
      task.markAsUnfinished()
      break
    case 'delete':
      task.delete()
      break
  }
}
</script>

<template>
  <Menu as="div">
    <MenuButton>
      <a-button
        ><span class="inline-flex w-full justify-center gap-x-1.5">
          Actions<arrow-down-icon class="fill-zinc-900 relative top-[-2px]" /></span
      ></a-button>
    </MenuButton>
    <MenuItems as="div" class="relative">
      <div
        class="absolute z-10 mt-2 left-5 w-56 origin-top-right rounded-md bg-white border border-zinc-400 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col overflow-hidden"
      >
        <MenuItem
          ><span
            class="px-4 py-2 text-base hover:bg-zinc-900/90 hover:text-white"
            @click="handleClick('add-before')"
            >Add Before</span
          ></MenuItem
        >
        <MenuItem
          ><span
            class="px-4 py-2 text-base hover:bg-zinc-900/90 hover:text-white"
            @click="handleClick('add-children')"
            >Add Child</span
          ></MenuItem
        >
        <MenuItem
          ><span
            class="px-4 py-2 text-base hover:bg-zinc-900/90 hover:text-white"
            @click="handleClick('add-after')"
            >Add After</span
          ></MenuItem
        >
        <MenuItem
          :class="{ 'menu-action-disabled': task.canBeFinished() }"
          v-if="!task.finished"
          type="primary"
        >
          <span
            class="px-4 py-2 text-base hover:bg-zinc-900/90 hover:text-white"
            @click="handleClick('finish')"
            >Finish</span
          >
        </MenuItem>
        <MenuItem v-if="task.finished"
          ><span
            class="px-4 py-2 text-base hover:bg-zinc-900/90 hover:text-white"
            @click="handleClick('unfinished')"
            >Unfinished</span
          ></MenuItem
        >
        <MenuItem
          ><span
            class="px-4 py-2 text-base text-red-500 hover:bg-red-600 hover:text-white"
            @click="handleClick('delete')"
            >Delete</span
          ></MenuItem
        >
      </div>
    </MenuItems>
  </Menu>
</template>

<style scoped></style>

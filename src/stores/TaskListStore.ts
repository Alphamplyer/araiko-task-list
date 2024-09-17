import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Task, RootTaskNode } from '@/models/Task'

export const useTaskListStore = defineStore('taskList', () => {
  const taskList = ref<RootTaskNode>(new RootTaskNode(
    [
      Task.create('Task 1')
        .addChild(Task.create('Task 1.1')
          .addChild(Task.create('Task 1.1.1'))
          .addChild(Task.create('Task 1.1.2'))
        )
        .addChild(Task.create('Task 1.2'))
        .addChild(Task.create('Task 1.3')) as Task,
      Task.create('Task 2')
        .addChild(Task.create('Task 2.1')) as Task,
      Task.create('Task 3')
    ]
  ));
  return { taskList }
})

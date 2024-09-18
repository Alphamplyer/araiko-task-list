import { ref } from 'vue'
import { defineStore } from 'pinia'
import { RootTaskNode } from '@/models/Task'

export const useTaskListStore = defineStore('taskList', () => {
  const taskList = ref<RootTaskNode>(new RootTaskNode(
    [
      // Uncomment the following lines to see the example tasks
      // Task.create('Task 1')
      //   .addChild(Task.create('Task 1.1')
      //     .addChild(Task.create('Task 1.1.1'))
      //     .addChild(Task.create('Task 1.1.2'))
      //   )
      //   .addChild(Task.create('Task 1.2'))
      //   .addChild(Task.create('Task 1.3')) as Task,
      // Task.create('Task 2')
      //   .addChild(Task.create('Task 2.1')) as Task,
      // Task.create('Task 3')
    ]
  ));

  /**
   * Convert the `taskList` value into a stringified json
   * @returns the stringify `taskList`
   */
  function exportToJson(): string {
    return JSON.stringify(taskList.value.toJSON());
  }

  /**
   * Replace the value of `taskList` by the given one
   * @param json the new `taskList` value
   */
  function importFromJson(json: string) {
    taskList.value = RootTaskNode.fromJSON(JSON.parse(json));
  }

  return { taskList, exportToJson, importFromJson }
})

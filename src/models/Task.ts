import { v4 as uuid } from 'uuid';

/**
 * Represent the base class to build parts of the task list
 */
export class TaskNode {
  /**
   * The parent `TaskNode` of this node if it exist. Otherwise it's `undefined`
   */
  parent?: TaskNode;

  /**
   * The children `TaskNode` of this node. By default it's initialize with an empty array.
   */
  children: TaskNode[];

  constructor(parent?: TaskNode, children: TaskNode[] = []) {
    this.parent = parent;
    this.children = children;
  }

  /**
   * Add a `TaskNode` to the children of this node
   * @param newTask - The `TaskNode` to add
   * @returns this `TaskNode`
   */
  addChild(newTask: TaskNode): TaskNode {
    newTask.parent = this;
    this.children.push(newTask);
    return this;
  }

  /**
   * Remove a `TaskNode` from the children
   * @param child - the child `TaskNode` to remove
   * @returns this `TaskNode`
   */
  removeChild(child: TaskNode): TaskNode {
    this.children = this.children.filter(c => c !== child);
    return this;
  }

  /**
   * Parse de json into a `TaskNode` object
   * @param json - the parsed json that represent a `TaskNode`
   * @returns the `TaskNode` created from the parsed json
   */
  static fromJSON(json: any): TaskNode {
    const taskNode = new TaskNode()
    json.children.forEach((jsonChild: any) => taskNode.addChild(Task.fromJSON(jsonChild)))
    return taskNode;
  }

  /**
   * Convert the `TaskNode` object to one that will be used 
   * @returns an unstringify object that represent a json `TaskNode`
   */
  toJSON(): any {
    return {
      children: this.children.map(c => c.toJSON())
    };
  }
}

/**
 * Represent the root of the task list tree
 */
export class RootTaskNode extends TaskNode {
  constructor(children: Task[] = []) {
    super(undefined, children);
    children.forEach(c => c.parent = this);
  }

  /**
   * Parse de json into a `RootTaskNode` object
   * @param json - the parsed json that represent a `RootTaskNode`
   * @returns the `RootTaskNode` created from the parsed json
   */
  static fromJSON(json: any): RootTaskNode {
    const rootTaskNode = new RootTaskNode();
    json.children.forEach((jsonChild: any) => rootTaskNode.addChild(Task.fromJSON(jsonChild)));
    return rootTaskNode;
  }

  /**
   * Convert the `RootTaskNode` object to one that will be used 
   * @returns an unstringify object that represent a json `RootTaskNode`
   */
  toJSON(): any {
    return {
      children: (this.children as Task[]).map(childTask => childTask.toJSON())
    };
  }
}

/**
 * Represent a n-level task of the task list.
 * It can have a parent and children
 * And contain methods to manage the tree.
 */
export class Task extends TaskNode {
  readonly id: string;
  name: string;
  finished: boolean;
  createdAt: Date;
  finishedAt?: Date;

  private constructor(id: string, name: string, finished: boolean, createdAt: Date, children: Task[] = [], parent?: TaskNode, finishedAt?: Date) {
    super(parent, children);
    this.id = id;
    this.name = name;
    this.finished = finished;
    this.createdAt = createdAt;
    this.finishedAt = finishedAt;
  }

  /**
   * A method to create easily a `Task`
   * @param name - the name of the `Task`
   * @param parent - The parent `Task` of this node
   * @returns the new `Task` created
   */
  public static create(name: string, parent?: Task): Task {
    return new Task(uuid(), name, false, new Date(), [], parent);
  }

  /**
   * Change the name of the `Task`
   * @param name - The new name of the `Task`
   */
  setName(name: string): void {
    this.name = name;
  }

  /**
   * Indicate if the `Task` can be mark as finished or not
   * @returns `true` if the children of this `Task` are finished, otherwise return `false`.
   */
  canBeFinished(): boolean {
    return this.children.every(child => (child as Task).finished);
  }

  /**
   * Mark the `Task` as finished and set the `finishedAt` date to now.
   */
  markAsFinished(): void {
    if (this.canBeFinished()) {
      this.finished = true;
      this.finishedAt = new Date();
    }

    if (!this.parent || !(this.parent instanceof Task)) {
      return;
    }
    
    this.parent.markAsFinished();
  }

  /**
   * Mark recusively the parents of this `Task` as Unfinished
   */
  markParentsAsUnfinished(): void {
    if (!this.parent || !(this.parent instanceof Task)) {
      return;
    }

    this.parent.finished = false;
    this.parent.finishedAt = undefined;
    this.parent.markParentsAsUnfinished();
  }

  /**
   * Mark recusively the children of this `Task` as Unfinished
   */
  markChildrenAsUnfinished(): void {
    if (this.children.length > 0) {
      this.children.forEach(child => {
        (child as Task).finished = false;
        (child as Task).finishedAt = undefined;
        (child as Task).markChildrenAsUnfinished();
      });
    }
  }

  /**
   * Mark a task as unfinished
   */
  markAsUnfinished(): void {
    this.finished = false;
    this.finishedAt = undefined;

    this.markChildrenAsUnfinished();
    this.markParentsAsUnfinished();
  }

  /**
   * Add a `TaskNode` to the children of this node
   * @param newTask - The `TaskNode` to add
   * @returns this `Task`
   */
  addChild(newTask: TaskNode): Task {
    super.addChild(newTask);
    this.finished = false;
    this.finishedAt = undefined;
    this.markParentsAsUnfinished();
    return this;
  }

  /**
   * Add a `Task` before this one
   * @param newTask - The `TaskNode` to add
   */
  addBefore(newTask: Task): void {
    console.log('addBefore', this);
    if (!this.parent) {
      return;
    }

    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      console.error('Task not found in parent children');
      return;
    }
    newTask.parent = this.parent;
    this.parent.children.splice(index, 0, newTask);
    console.log('index', index);
    console.log('added before', this.parent.children);

    this.markParentsAsUnfinished();
  }

  /**
   * Add a `Task` after this one
   * @param newTask - The `TaskNode` to add
   */
  addAfter(newTask: Task): void {
    if (!this.parent) {
      return;
    }

    const index = this.parent.children.indexOf(this);
    if (index === -1) {
      return;
    }

    if (index === this.parent.children.length - 1) {
      this.parent.addChild(newTask);
    } else {
      newTask.parent = this.parent;
      this.parent.children.splice(index + 1, 0, newTask);
    }

    this.markParentsAsUnfinished();
  }

  /**
   * Delete this `Task`
   */
  delete(): void {
    if (!this.parent) {
      return;
    }

    this.parent.removeChild(this);

    if (this.parent instanceof Task && this.parent.children.length > 0) {
      if (this.parent.canBeFinished()) {
        this.parent.markAsFinished();
      }
    }
  }

  /**
   * Parse de json into a `Task` object
   * @param json - the parsed json that represent a `Task`
   * @returns the `Task` created from the parsed json
   */
  static fromJSON(json: any): Task {
    const task = new Task(
      json.id, 
      json.name, 
      json.finished, 
      new Date(json.createdAt),
      [],
      undefined,
      json.finishedAt ? new Date(json.finishedAt) : undefined
    );

    json.children.forEach((jsonChild: any) => task.addChild(Task.fromJSON(jsonChild)));
    return task;
  }

  /**
   * Convert the `Task` object to one that will be used 
   * @returns an unstringify object that represent a json `Task`
   */
  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      finished: this.finished,
      createdAt: this.createdAt.toISOString(),
      finishedAt: this.finishedAt ? this.finishedAt.toISOString() : undefined,
      children: (this.children as Task[]).map(childTask => childTask.toJSON())
    };
  }
}
import { v4 as uuid } from 'uuid';

export class TaskNode {
  parent?: TaskNode;
  children: TaskNode[];

  constructor(parent?: TaskNode, children: TaskNode[] = []) {
    this.parent = parent;
    this.children = children;
  }

  addChild(newTask: TaskNode): TaskNode {
    newTask.parent = this;
    this.children.push(newTask);
    return this;
  }

  removeChild(child: TaskNode): TaskNode {
    this.children = this.children.filter(c => c !== child);
    return this;
  }

  getChildren(): TaskNode[] {
    return this.children;
  }
}

export class RootTaskNode extends TaskNode {
  constructor(children: Task[] = []) {
    super(undefined, children);
    children.forEach(c => c.parent = this);
  }
}

export class Task extends TaskNode {
  readonly id: string;
  name: string;
  finished: boolean;
  createdAt: Date;
  finishedAt?: Date;

  private constructor(id: string, name: string, finished: boolean, createdAt: Date, children: Task[] = [], parent?: Task, finishedAt?: Date) {
    super(parent, children);
    this.id = id;
    this.name = name;
    this.finished = finished;
    this.createdAt = createdAt;
    this.finishedAt = finishedAt;
  }

  public static create(name: string, parent?: Task): Task {
    return new Task(uuid(), name, false, new Date(), [], parent);
  }

  setName(name: string): void {
    this.name = name;
  }

  canBeFinished(): boolean {
    return this.children.every(child => (child as Task).finished);
  }

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

  markParentsAsUnfinished(): void {
    if (!this.parent || !(this.parent instanceof Task)) {
      return;
    }

    this.parent.finished = false;
    this.parent.finishedAt = undefined;
    this.parent.markParentsAsUnfinished();
  }

  markChildrenAsUnfinished(): void {
    if (this.children.length > 0) {
      this.children.forEach(child => {
        (child as Task).finished = false;
        (child as Task).finishedAt = undefined;
        (child as Task).markChildrenAsUnfinished();
      });
    }
  }

  markAsUnfinished(): void {
    this.finished = false;
    this.finishedAt = undefined;

    this.markChildrenAsUnfinished();
    this.markParentsAsUnfinished();
  }

  addChild(newTask: TaskNode): Task {
    super.addChild(newTask);
    this.finished = false;
    this.finishedAt = undefined;
    this.markParentsAsUnfinished();
    return this;
  }

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
  }

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
  }

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
}
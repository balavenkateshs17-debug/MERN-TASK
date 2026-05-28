import reducer, { taskCreated, taskDeleted, taskUpdated } from "./taskSlice";

describe("taskSlice realtime updates", () => {
  it("does not duplicate tasks when the same created event arrives twice", () => {
    const task = {
      _id: "task-1",
      title: "Realtime task",
      description: "Created over API and socket",
      status: "Pending",
    };

    const firstState = reducer(undefined, taskCreated(task));
    const secondState = reducer(firstState, taskCreated(task));

    expect(secondState.items).toHaveLength(1);
    expect(secondState.items[0]).toEqual(task);
  });

  it("updates and deletes existing realtime tasks by id", () => {
    const task = {
      _id: "task-1",
      title: "Original",
      description: "Before",
      status: "Pending",
    };

    const createdState = reducer(undefined, taskCreated(task));
    const updatedState = reducer(
      createdState,
      taskUpdated({
        ...task,
        title: "Edited",
        status: "Completed",
      })
    );
    const deletedState = reducer(updatedState, taskDeleted("task-1"));

    expect(updatedState.items[0].title).toBe("Edited");
    expect(updatedState.items[0].status).toBe("Completed");
    expect(deletedState.items).toHaveLength(0);
  });
});

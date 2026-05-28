const taskController = require("../controllers/taskController");
const Task = require("../models/Task");

jest.mock("../models/Task");

describe("taskController.getTasks", () => {
  it("returns paginated tasks", async () => {
    const req = { query: {}, user: { id: "user1" } };
    const tasks = [{ title: "t1" }];
    const limitMock = jest.fn().mockResolvedValue(tasks);
    const skipMock = jest.fn(() => ({ limit: limitMock }));
    const sortMock = jest.fn(() => ({ skip: skipMock }));
    const populateUpdatedMock = jest.fn(() => ({ sort: sortMock }));
    const populateCreatedMock = jest.fn(() => ({ populate: populateUpdatedMock }));
    Task.find.mockReturnValue({ populate: populateCreatedMock });
    Task.countDocuments.mockResolvedValue(1);

    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    await taskController.getTasks(req, { status });

    expect(Task.find).toHaveBeenCalledWith({});
    expect(populateCreatedMock).toHaveBeenCalledWith("createdBy", "name email");
    expect(populateUpdatedMock).toHaveBeenCalledWith("updatedBy", "name email");
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    expect(skipMock).toHaveBeenCalledWith(0);
    expect(limitMock).toHaveBeenCalledWith(10);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      tasks,
      page: 1,
      limit: 10,
      total: 1,
      pages: 1,
    });
  });
});

describe("taskController.createTask", () => {
  it("creates task and emits socket event", async () => {
    const fakeTask = { _id: "1", title: "t", createdBy: "u1" };
    Task.create.mockResolvedValue(fakeTask);

    const room = { emit: jest.fn() };
    const req = { body: { title: "t" }, user: { id: "u1" }, io: { emit: jest.fn(), to: jest.fn(() => room) } };
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    await taskController.createTask(req, { status });

    expect(Task.create).toHaveBeenCalledWith({
      title: "t",
      description: undefined,
      status: undefined,
      createdBy: "u1",
      updatedBy: "u1",
    });
    expect(req.io.to).toHaveBeenCalledWith("tasks");
    expect(room.emit).toHaveBeenCalledWith("taskCreated", fakeTask);
    expect(req.io.emit).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(fakeTask);
  });
});

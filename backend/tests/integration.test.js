jest.setTimeout(20000);

const mongoose = require("mongoose");
const supertest = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { io: Client } = require("socket.io-client");
const { app, server, io } = require("../server");
const User = require("../models/User");
const Task = require("../models/Task");

let api;
let mongod;
let port;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);

  api = supertest(app);
  await new Promise((resolve) => {
    server.listen(0, () => {
      port = server.address().port;
      resolve();
    });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
  io.close();
  await new Promise((resolve) => server.close(resolve));
});

afterEach(async () => {
  await User.deleteMany();
  await Task.deleteMany();
});

describe("Auth and Task Integration", () => {
  it("should sign up, log in, and manage tasks", async () => {
    const signupRes = await api
      .post("/api/auth/signup")
      .send({ name: "Test User", email: "test@example.com", password: "Password1!" })
      .expect(201);

    expect(signupRes.body.token).toBeTruthy();

    const loginRes = await api
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "Password1!" })
      .expect(200);

    const token = loginRes.body.token;
    expect(token).toBeTruthy();

    const taskRes = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First Task", description: "Test the flow", status: "Pending" })
      .expect(201);

    expect(taskRes.body.title).toBe("First Task");
    expect(taskRes.body.status).toBe("Pending");
    expect(taskRes.body.createdBy.name).toBe("Test User");
    expect(taskRes.body.updatedBy.name).toBe("Test User");

    const listRes = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(listRes.body.tasks)).toBe(true);
    expect(listRes.body.tasks.length).toBe(1);
    expect(listRes.body.page).toBe(1);
    expect(listRes.body.limit).toBe(10);
    expect(listRes.body.total).toBe(1);
    expect(listRes.body.pages).toBe(1);

    const updatedRes = await api
      .put(`/api/tasks/${taskRes.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "Completed" })
      .expect(200);

    expect(updatedRes.body.status).toBe("Completed");
    expect(updatedRes.body.updatedBy.name).toBe("Test User");

    await api
      .delete(`/api/tasks/${taskRes.body._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const finalList = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(finalList.body.tasks)).toBe(true);
    expect(finalList.body.tasks.length).toBe(0);
    expect(finalList.body.total).toBe(0);
  });

  it("should validate auth request bodies", async () => {
    const signupRes = await api
      .post("/api/auth/signup")
      .send({ name: "A", email: "not-email", password: "123" })
      .expect(400);

    expect(signupRes.body.message).toBe("Validation failed");
    expect(signupRes.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "name" }),
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ])
    );

    await api
      .post("/api/auth/login")
      .send({ email: "bad-email", password: "" })
      .expect(400);
  });

  it("should expose the shared task board to other authenticated users", async () => {
    const ownerSignup = await api
      .post("/api/auth/signup")
      .send({ name: "Owner User", email: "owner@example.com", password: "Password1!" })
      .expect(201);

    const viewerSignup = await api
      .post("/api/auth/signup")
      .send({ name: "Viewer User", email: "viewer@example.com", password: "Password1!" })
      .expect(201);

    const taskRes = await api
      .post("/api/tasks")
      .set("Authorization", `Bearer ${ownerSignup.body.token}`)
      .send({ title: "Shared Task", description: "Visible to the team", status: "Pending" })
      .expect(201);

    const viewerList = await api
      .get("/api/tasks")
      .set("Authorization", `Bearer ${viewerSignup.body.token}`)
      .expect(200);

    expect(viewerList.body.tasks).toHaveLength(1);
    expect(viewerList.body.tasks[0]._id).toBe(taskRes.body._id);

    const viewerUpdate = await api
      .put(`/api/tasks/${taskRes.body._id}`)
      .set("Authorization", `Bearer ${viewerSignup.body.token}`)
      .send({ title: "Updated by Viewer", status: "Completed" })
      .expect(200);

    expect(viewerUpdate.body.title).toBe("Updated by Viewer");
    expect(viewerUpdate.body.status).toBe("Completed");
    expect(viewerUpdate.body.createdBy.name).toBe("Owner User");
    expect(viewerUpdate.body.updatedBy.name).toBe("Viewer User");
  });

  it("should reject unauthorized access to tasks", async () => {
    await api.get("/api/tasks").expect(401);
  });

  it("should support server-side pagination and query validation", async () => {
    const signupRes = await api
      .post("/api/auth/signup")
      .send({ name: "Page User", email: "page@example.com", password: "Password1!" })
      .expect(201);

    const token = signupRes.body.token;

    for (let i = 1; i <= 12; i += 1) {
      await api
        .post("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: `Task ${i}`, description: `Task ${i} notes`, status: "Pending" })
        .expect(201);
    }

    const pageRes = await api
      .get("/api/tasks?page=2&limit=5")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(pageRes.body.page).toBe(2);
    expect(pageRes.body.limit).toBe(5);
    expect(pageRes.body.total).toBe(12);
    expect(pageRes.body.pages).toBe(3);
    expect(pageRes.body.tasks.length).toBe(5);

    await api
      .get("/api/tasks?page=0")
      .set("Authorization", `Bearer ${token}`)
      .expect(400);

    const taskId = pageRes.body.tasks[0]._id;
    await api
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "No" })
      .expect(400);
  });
});

describe("Socket.IO realtime behavior", () => {
  it("emits taskCreated to other authenticated socket clients", async () => {
    const creatorSignup = await api
      .post("/api/auth/signup")
      .send({ name: "Socket User", email: "socket@example.com", password: "Password1!" })
      .expect(201);

    const listenerSignup = await api
      .post("/api/auth/signup")
      .send({ name: "Listener User", email: "listener@example.com", password: "Password1!" })
      .expect(201);

    const creatorToken = creatorSignup.body.token;
    const listenerToken = listenerSignup.body.token;
    expect(creatorToken).toBeTruthy();
    expect(listenerToken).toBeTruthy();

    let client;
    try {
      client = new Client(`http://localhost:${port}`, {
        auth: { token: listenerToken },
        transports: ["websocket"],
        reconnectionDelay: 0,
        forceNew: true,
      });

      await new Promise((resolve, reject) => {
        client.on("connect", resolve);
        client.on("connect_error", reject);
      });

      const messagePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Socket event timeout"));
        }, 10000);

        client.once("taskCreated", (message) => {
          clearTimeout(timeout);
          resolve(message);
        });
      });

      await api
        .post("/api/tasks")
        .set("Authorization", `Bearer ${creatorToken}`)
        .send({ title: "Realtime Task", description: "Socket integration", status: "Pending" })
        .expect(201);

      const message = await messagePromise;
      expect(message.title).toBe("Realtime Task");
      expect(message.status).toBe("Pending");
    } finally {
      if (client) {
        client.close();
      }
    }
  });
});

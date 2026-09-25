const assert = require("node:assert/strict");
const { test } = require("node:test");

// Stub infrastructure before loading controllers: no database or emails are used.
const pool = { query: async () => { throw new Error("Unexpected query"); } };
require.cache[require.resolve("../config/db")] = { exports: pool, loaded: true };
require.cache[require.resolve("../services/emailService")] = { exports: {}, loaded: true };
const projects = require("../controllers/projectsController");
const issues = require("../controllers/issueController");
const { getBookings } = require("../controllers/bookingController");
const { getAnalytics } = require("../controllers/analyticsController");
function response() {
  return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
}

test("project create and update preserve all showcase fields in parameter order", async () => {
  const body = { title: "Vision", description: "Demo", lead: "A", supervisor: "B", team_members: "A, C", tags: "AI, CV", year: "2026", status: "Active", github_link: "https://example.com/repo", demo_link: "https://example.com/demo", image_url: "https://example.com/image.png", video_url: "https://example.com/video.mp4" };
  const queries = [];
  pool.query = async (sql, values) => { queries.push({ sql, values }); return { rows: [{ id: 5, ...body }] }; };
  const created = response();
  await projects.createProject({ body }, created);
  assert.equal(created.code, 201);
  assert.deepEqual(queries[0].values, Object.values(body));
  assert.match(queries[0].sql, /supervisor, team_members, tags/);
  const updated = response();
  await projects.updateProject({ body, params: { id: "5" } }, updated);
  assert.deepEqual(queries[1].values, [...Object.values(body), "5"]);
  assert.match(queries[1].sql, /team_members = \$5/);
  assert.equal(updated.body.team_members, "A, C");
});

test("My Bookings filters staff reservations by authenticated account", async () => {
  pool.query = async (sql, values) => {
    assert.match(sql, /WHERE user_id = \$1/);
    assert.deepEqual(values, [42]);
    return { rows: [{ id: 1, user_id: 42 }] };
  };
  const res = response();
  await getBookings({ user: { id: 42, role: "staff" }, query: { mine: "true" } }, res);
  assert.equal(res.body[0].user_id, 42);
});

test("officer booking review includes requester email and purpose", async () => {
  pool.query = async (sql) => {
    assert.match(sql, /r\.\*/);
    assert.match(sql, /u\.email as user_email/);
    return { rows: [] };
  };
  await getBookings({ user: { id: 2, role: "officer" }, query: {} }, response());
});

test("analytics returns numeric counts and resource usage including rescheduled requests", async () => {
  pool.query = async (sql) => {
    if (sql.includes("SELECT resources.resource")) return { rows: [{ resource: "Server", total: 3, pending: 1, approved: 1, rejected: 0, rescheduled: 1 }] };
    if (sql.includes("SELECT r.id")) return { rows: [] };
    if (sql.includes("FROM reservations")) return { rows: [{ total: "3", pending: "1", approved: "1", rejected: "0", rescheduled: "1" }] };
    return { rows: [{ total: "2", available: "2", in_use: "0", maintenance: "0", students: "1", officers: "1", admins: "0", staff: "0" }] };
  };
  const res = response();
  await getAnalytics({}, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.bookings.rescheduled, 1);
  assert.equal(res.body.users.total, 2);
  assert.equal(res.body.usage[0].resource, "Server");
});

test("issue reports reject unknown equipment before creating a ticket", async () => {
  const queries = [];
  pool.query = async (sql, values) => {
    queries.push({ sql, values });
    return { rows: [] };
  };
  const res = response();
  await issues.createIssue({ user: { id: 7 }, body: { equipmentId: 999, issueType: "Damage", description: "Broken lens" } }, res);
  assert.equal(res.code, 404);
  assert.equal(queries.length, 1);
  assert.match(queries[0].sql, /FROM inventory/);
});

test("student issue reports are always scoped to the authenticated user", async () => {
  pool.query = async (sql, values) => {
    assert.match(sql, /WHERE r\.reported_by = \$1/);
    assert.deepEqual(values, [42]);
    return { rows: [{ id: 1, reported_by: 42 }] };
  };
  const res = response();
  await issues.getIssues({ user: { id: 42, role: "student" }, query: {} }, res);
  assert.equal(res.body[0].reported_by, 42);
});

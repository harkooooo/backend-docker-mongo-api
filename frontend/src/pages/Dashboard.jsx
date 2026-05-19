import UserCard from "../components/UserCard";
import { useState, useEffect } from "react";
import api from "../api/axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
const [editName, setEditName] = useState("");
const [editAge, setEditAge] = useState("");
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [saving, setSaving] = useState(false);
const [makingAdmin, setMakingAdmin] = useState(false);
const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);
const [limit, setLimit] = useState(10);
const [sortBy, setSortBy] = useState("name-asc");

function showMessage(text) {
  setMessage(text);

  setTimeout(() => {
    setMessage("");
  }, 3000);
}

  async function deleteUser(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    await api.delete(`/users/${id}`);

    setUsers(users.filter((u) => u._id !== id));
   showMessage("User deleted successfully");
  } catch (error) {
    console.log(error.response?.data);
    showMessage("Could not delete user");
  }
}

async function makeAdmin(id) {
  console.log("Make admin clicked:", id);

  try {
    const res = await api.patch(`/users/${id}`, {
      role: "admin",
    });

    console.log("Updated user:", res.data);

    setUsers(
      users.map((u) =>
        u._id === id ? res.data : u
      )
    );

showMessage("User is now admin");

  } catch (error) {
    console.log(error.response?.data);
    showMessage("Could not make user admin");
}
}

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchMe() {
      try {
        setLoading(true);

        const res = await api.get("/users/me");
        setUser(res.data);
        const usersRes = await api.get(`/users?page=${page}&limit=${limit}`);

      setUsers(usersRes.data.data);
      setPages(usersRes.data.pages);

      setLoading(false);
    } catch (error) {
        console.log(error.response?.data);
        setLoading(false);
      }
    }

    fetchMe();
  }, [page, limit]);

if (loading) {
  return <p>Loading...</p>;
}

  if (!token) {
    window.location.href = "/";
    return null;
  }

async function removeAdmin(id) {
const confirmRemove = window.confirm(
  "Are you sure you want to remove admin from this user?"
);

if (!confirmRemove) {
  return;
}
try {
  const res = await api.patch(`/users/${id}`, {
    role: "user",
  });

  setUsers(
    users.map((u) =>
      u._id === id ? res.data : u
    )
  );

  showMessage("Admin removed successfully");

} catch (error) {
  console.log(error.response?.data);
  showMessage("Could not remove admin");
}
}

async function updateUser(id) {
  try {
    setSaving(true);
    const res = await api.patch(`/users/${id}`, {
      name: editName,
      age: editAge,
    });

    console.log(res.data);

    setUsers(
      users.map((u) =>
        u._id === id ? res.data : u
      )
    );
    setSaving(false);
    setEditingUserId(null);
    showMessage("User updated successfully");


  } catch (error) {
    setSaving(false);

    console.log(error.response?.data);
    setMessage("Something went wrong");

  }
}

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";

  };

  return (
    <div>
      <h1>Dashboard</h1>
      {message && (
  <p
    className={
  message.toLowerCase().includes("could") ||
  message.toLowerCase().includes("wrong")
    ? "message-error"
    : "message-success"
}
  >
    {message}
  </p>
)}

      <p>Du är inloggad.</p>


      {user && (
        <div>
          <p>Namn: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Roll: {user.role}</p>
<button onClick={handleLogout}>
  Logout
</button>
        </div>
      )}

      <input
       type="text"
       placeholder="Search users"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
     />

      {user?.role === "admin" && (
  <div>
    <h2>Admin Panel</h2>
    <p>Du är admin.</p>
  </div>
)}

{user?.role === "admin" && (
  <div>

<label>
  Show:
</label>

<select
  value={limit}
  onChange={(e) => {
  setLimit(Number(e.target.value));
  setPage(1);
}}
>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
</select>

<span> users per page</span>

  <h2>
Users (
{

  users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  ).length
}
)
</h2>

<label>
  Sort by:
</label>

<select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
>
  <option value="name-asc">Name A-Z</option>
  <option value="name-desc">Name Z-A</option>
  <option value="age-desc">Age high-low</option>
  <option value="age-asc">Age low-high</option>
  <option value="newest">Newest</option>
  <option value="oldest">Oldest</option>
</select>

<div className="stats">
  <div className="stat-card">
    <h3>Admins</h3>
    <p>{users.filter(u => u.role === "admin").length}</p>
  </div>

  <div className="stat-card">
    <h3>Users</h3>
    <p>{users.filter(u => u.role === "user").length}</p>
  </div>

  <div className="stat-card">
    <h3>Total</h3>
    <p>{users.length}</p>
  </div>
</div>

{users.filter((u) =>
  u.name.toLowerCase().includes(search.toLowerCase())
).length === 0 && (
  <p>No users found</p>
)}

    {users
  .filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )  
  .sort((a, b) => {
  if (a.role === "admin" && b.role !== "admin") return -1;
  if (a.role !== "admin" && b.role === "admin") return 1;

  if (sortBy === "name-asc") {
    return a.name.localeCompare(b.name);
  }

  if (sortBy === "name-desc") {
    return b.name.localeCompare(a.name);
  }

  if (sortBy === "age-asc") {
    return a.age - b.age;
  }

  if (sortBy === "age-desc") {
    return b.age - a.age;
  }

  if (sortBy === "newest") {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  if (sortBy === "oldest") {
    return new Date(a.createdAt) - new Date(b.createdAt);
  }

  return 0;
})

.map((u) => (
  <UserCard
    key={u._id}
    u={u}
    user={user}
    onEdit={(u) => {
      setEditingUserId(u._id);
      setEditName(u.name);
      setEditAge(u.age);
    }}
    onDelete={deleteUser}
    onMakeAdmin={makeAdmin}
    onRemoveAdmin={removeAdmin}

editingUserId={editingUserId}
editName={editName}
editAge={editAge}
saving={saving}
onSave={updateUser}
onCancelEdit={() => {
  setEditingUserId(null);
  setEditName("");
  setEditAge("");
}}
setEditName={setEditName}
setEditAge={setEditAge}

  />
))}

<button
  onClick={() => setPage(page - 1)}
  disabled={page <= 1}
>
  Previous
</button>

<span>
  Page {page} of {pages}
</span>

<button
  onClick={() => setPage(page + 1)}
  disabled={page >= pages}
>
  Next
</button>

<button onClick={handleLogout}>Logga ut</button>
    </div>
  )}

    </div>
  );
}

export default Dashboard;
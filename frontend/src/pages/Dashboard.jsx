import UserCard from "../components/UserCard";
import { useState, useEffect } from "react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
const [editName, setEditName] = useState("");
const [editAge, setEditAge] = useState("");
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [deletingUser, setDeletingUser] = useState(null);
const [newName, setNewName] = useState("");
const [newEmail, setNewEmail] = useState("");
const [newAge, setNewAge] = useState("");
const [newPassword, setNewPassword] = useState("");
const [creatingUser, setCreatingUser] = useState(false);
const [makingAdmin, setMakingAdmin] = useState(null);
const [removingAdmin, setRemovingAdmin] = useState(null);
const [page, setPage] = useState(() => {
  return Number(localStorage.getItem("page")) || 1;
});
const [pages, setPages] = useState(1);
const [limit, setLimit] = useState(10);
const [sortBy, setSortBy] = useState("name-asc");

  async function deleteUser(id) {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) {
    return;
  }

  setDeletingUser(id);

  try {
    await api.delete(`/users/${id}`);

    setUsers(users.filter((u) => u._id !== id));
    toast.success("User deleted successfully");
    setDeletingUser(null);
  } catch (error) {
    setDeletingUser(null);
    console.log(error.response?.data);
    toast.error("Could not delete user");
  }
}

async function makeAdmin(id) {
  console.log("Make admin clicked:", id);

  try {
    setMakingAdmin(id);

    const res = await api.patch(`/users/${id}`, {
      role: "admin",
    });

    console.log("Updated user:", res.data);

    setUsers(
      users.map((u) =>
        u._id === id ? res.data : u
      )
    );

    toast.success("User is now admin");
    setMakingAdmin(null);

  } catch (error) {
    setMakingAdmin(null);
    console.log(error.response?.data);
    toast.error("Could not make user admin");
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

  useEffect(() => {
  localStorage.setItem("page", page);
}, [page]);

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
  setRemovingAdmin(id);
  const res = await api.patch(`/users/${id}`, {
    role: "user",
  });

  setUsers(
    users.map((u) =>
      u._id === id ? res.data : u
    )
  );

  toast.success("Admin removed successfully");
  setRemovingAdmin(null);

} catch (error) {
  setRemovingAdmin(null);
  console.log(error.response?.data);
  toast.error("Could not remove admin");
}
}

async function updateUser(id) {
  if (editName.trim() === "") {
    toast.error("Name cannot be empty");
    return;
  }

  if (Number(editAge) <= 0) {
    toast.error("Age must be positive");
    return;
  }

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
    toast.success("User updated successfully");


  } catch (error) {
    setSaving(false);

    console.log(error.response?.data);
    toast.error("Something went wrong");

  }
}

async function createUser(e) {
  e.preventDefault();

  if (newName.trim() === "") {
    toast.error("Name cannot be empty");
    return;
  }

  if (newEmail.trim() === "") {
    toast.error("Email cannot be empty");
    return;
  }

  if (Number(newAge) <= 0) {
    toast.error("Age must be positive");
    return;
  }

  if (newPassword.length < 6) {
    toast.error("Password must be at least 6 characters");
    return;
  }

  try {
    setCreatingUser(true);

    const res = await api.post("/auth/register", {
      name: newName,
      email: newEmail,
      age: newAge,
      password: newPassword,
    });

console.log("Created user response:", res.data);

const usersRes = await api.get(`/users?page=${page}&limit=${limit}`);
setUsers(usersRes.data.data);
setPages(usersRes.data.pages);

    setNewName("");
    setNewEmail("");
    setNewAge("");
    setNewPassword("");

    toast.success("User created successfully");
    setCreatingUser(false);
  } catch (error) {
    setCreatingUser(false);
    console.log(error.response?.data);
    toast.error("Could not create user");
  }
}

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";

  };

  return (
<div className="dashboard-container">
<Toaster />
      <h1>Dashboard</h1>
      <h2>Welcome back, {user?.name} 👋</h2>

<p>
Logged in as <strong>{user?.role}</strong>
</p>

      {user && (
        <div>
          <div className="profile-card">

<p>Name: {user?.name}</p>
<p>Email: {user?.email}</p>
<p>Role: {user?.role}</p>

<button onClick={handleLogout}>
Logout
</button>

</div>
        </div>
      )}

      <input
       type="text"
       placeholder="Search users"
       value={search}
       onChange={(e) => setSearch(e.target.value)}
     />

<h3>Create User</h3>

<form onSubmit={createUser} className="create-user">


  <input
    type="text"
    placeholder="Name"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
    disabled={creatingUser}
  />

  <input
    type="email"
    placeholder="Email"
    value={newEmail}
    onChange={(e) => setNewEmail(e.target.value)}
    disabled={creatingUser}
  />

  <input
    type="number"
    placeholder="Age"
    value={newAge}
    onChange={(e) => setNewAge(e.target.value)}
    disabled={creatingUser}
  />

  <input
    type="password"
    placeholder="Password"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    disabled={creatingUser}
  />

  <button disabled={creatingUser}>
    {creatingUser ? "Creating..." : "Create User"}
  </button>
</form>

      {user?.role === "admin" && (
   <div className="admin-panel">
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

<span>users per page</span>

<h2>
Users (
{
  users.filter((u)=>
    (u.name || "").toLowerCase().includes(search.toLowerCase())
  ).length
}
)
</h2>

<div className="sort-row">
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
</div>

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
  (u.name || "").toLowerCase().includes(search.toLowerCase())
).length === 0 && (
  <p>No users found</p>
)}

<div className="users-section">

    {users
  .filter((u) =>
  (u.name || "").toLowerCase().includes(search.toLowerCase())
  )  
  .sort((a, b) => {
  if (a.role === "admin" && b.role !== "admin") return -1;
  if (a.role !== "admin" && b.role === "admin") return 1;

  if (sortBy === "name-asc") {
    return (a.name || "").localeCompare(b.name || "");
  }

  if (sortBy === "name-desc") {
    return (b.name || "").localeCompare(a.name || "");
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
    removingAdmin={removingAdmin}
    makingAdmin={makingAdmin}
    editingUserId={editingUserId}
    editName={editName}
    editAge={editAge}
    saving={saving}
    deletingUser={deletingUser}

    onEdit={(u) => {
      setEditingUserId(u._id);
      setEditName(u.name);
      setEditAge(u.age);
    }}

    onDelete={deleteUser}
    onMakeAdmin={makeAdmin}
    onRemoveAdmin={removeAdmin}
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

</div>

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
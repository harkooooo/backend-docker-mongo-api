function UserCard({
  u,
  user,
  makingAdmin,
  removingAdmin,
  deletingUser,
  editingUserId,
  editName,
  editAge,
  saving,
  onEdit,
  onDelete,
  onMakeAdmin,
  onRemoveAdmin,
  onSave,
  onCancelEdit,
  setEditName,
  setEditAge,
}) {
  return (
    <div className="user-card">
      <p>{u.name}</p>
      <p>{u.email}</p>
      <p>Role: {u.role}</p>
      <p>Age: {u.age}</p>

      {u.createdAt && (
        <p>Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
      )}

      {u._id !== user._id && (
        <button onClick={() => onEdit(u)}>Edit</button>
      )}

      {editingUserId === u._id && (
        <div>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            disabled={saving}
          />

          <input
            type="number"
            value={editAge}
            onChange={(e) => setEditAge(e.target.value)}
            disabled={saving}
          />

          <button onClick={() => onSave(u._id)} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>

          <button onClick={onCancelEdit}>Cancel</button>
        </div>
      )}

      {u._id === user._id && <p>(You)</p>}

      {u._id !== user._id && (
        <button
    onClick={() => onDelete(u._id)}
    disabled={deletingUser === u._id}
  >
    {deletingUser === u._id ? "Deleting..." : "Delete"}
  </button>
)}

      {u.role !== "admin" && (
        <button
  onClick={() => onMakeAdmin(u._id)}
  disabled={makingAdmin === u._id}
>
  {makingAdmin === u._id ? "Making..." : "Make Admin"}
</button>
      )}

      {u.role === "admin" && u._id !== user._id && (
        <button
  onClick={() => onRemoveAdmin(u._id)}
  disabled={removingAdmin === u._id}
>
  {removingAdmin === u._id
    ? "Removing..."
    : "Remove Admin"}
</button>
      )}
    </div>
  );
}

export default UserCard;
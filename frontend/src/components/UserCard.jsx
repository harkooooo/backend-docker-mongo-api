function UserCard({
  u,
  user,
  makingAdmin,
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
        <button onClick={() => onDelete(u._id)}>Delete</button>
      )}

      {u.role !== "admin" && (
        <button
  onClick={() => onMakeAdmin(u._id)}
  disabled={makingAdmin}
>
  {makingAdmin ? "Making..." : "Make Admin"}
</button>
      )}

      {u.role === "admin" && u._id !== user._id && (
        <button onClick={() => onRemoveAdmin(u._id)}>Remove Admin</button>
      )}
    </div>
  );
}

export default UserCard;
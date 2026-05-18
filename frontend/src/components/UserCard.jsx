function UserCard({ u, user, onEdit, onDelete, onMakeAdmin, onRemoveAdmin }) {
  return (
    <div className="user-card">
      <p>{u.name}</p>
      <p>{u.email}</p>
      <p>Role: {u.role}</p>
      <p>Age: {u.age}</p>

      {u._id !== user._id && (
        <button onClick={() => onEdit(u)}>Edit</button>
      )}

      {u._id === user._id && <p>(You)</p>}

      {u._id !== user._id && (
        <button onClick={() => onDelete(u._id)}>Delete</button>
      )}

      {u.role !== "admin" && (
        <button onClick={() => onMakeAdmin(u._id)}>Make Admin</button>
      )}

      {u.role === "admin" && u._id !== user._id && (
        <button onClick={() => onRemoveAdmin(u._id)}>Remove Admin</button>
      )}

      <hr />
    </div>
  );
}

export default UserCard;

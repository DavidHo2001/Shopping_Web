import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRoleManagement.css';
import { useUser } from '../contexts/UserContext';
import {
  fetchUserRoleList,
  updateUserRole,
  UserRole,
} from '../service/ApiService/UserRoleService';

const ROLE_OPTIONS = [
  { id: 1, name: 'CUSTOMER' },
  { id: 2, name: 'ADMIN' },
  { id: 3, name: 'SUPER_ADMIN' },
];

const UserRoleManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user, dataLoading } = useUser();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedRoleId, setEditedRoleId] = useState<number | null>(null);
  const [originalRoleId, setOriginalRoleId] = useState<number | null>(null);
  const [editedIsBlocked, setEditedIsBlocked] = useState<boolean>(false);
  const [originalIsBlocked, setOriginalIsBlocked] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Check if user has super admin access (roleId === 3)
  useEffect(() => {
    if (!dataLoading) {
      if (!user || user.role !== 3) {
        alert('Access denied. Super admin privileges required.');
        navigate('/');
      }
    }
  }, [user, dataLoading, navigate]);

  useEffect(() => {
    loadUserRoles();
  }, []);

  const loadUserRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUserRoleList();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user roles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId: number, currentRoleId: number, currentIsBlocked: boolean) => {
    setEditingUserId(userId);
    setEditedRoleId(currentRoleId);
    setOriginalRoleId(currentRoleId);
    setEditedIsBlocked(currentIsBlocked);
    setOriginalIsBlocked(currentIsBlocked);
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedRoleId(null);
    setOriginalRoleId(null);
    setEditedIsBlocked(false);
    setOriginalIsBlocked(false);
  };

  const handleSave = async () => {
    if (editingUserId === null || editedRoleId === null) return;

    try {
      setUpdateLoading(true);
      setError('');
      await updateUserRole(editingUserId, editedRoleId, editedIsBlocked);
      
      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === editingUserId
            ? {
                ...u,
                roleId: editedRoleId,
                role: ROLE_OPTIONS.find((r) => r.id === editedRoleId)?.name || u.role,
                isBlocked: editedIsBlocked,
              }
            : u
        )
      );

      // Reset editing state
      setEditingUserId(null);
      setEditedRoleId(null);
      setOriginalRoleId(null);
      setEditedIsBlocked(false);
      setOriginalIsBlocked(false);
      
      alert('User role updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      alert('Failed to update user role: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRoleChange = (roleId: number) => {
    setEditedRoleId(roleId);
  };

  const handleBlockToggle = () => {
    setEditedIsBlocked(!editedIsBlocked);
  };

  if (dataLoading || loading) {
    return (
      <div className="user-role-management">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-role-management">
      <div className="user-role-header">
        <h1>User Role Management</h1>
        <p>Manage user roles and access levels</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="user-role-table-container">
        <table className="user-role-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Role ID</th>
              <th>Blocked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => {
              const isEditing = editingUserId === userItem.id;
              
              return (
                <tr key={userItem.id} className={isEditing ? 'editing-row' : ''}>
                  <td>{userItem.id}</td>
                  <td>{userItem.username}</td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editedRoleId || userItem.roleId}
                        onChange={(e) => handleRoleChange(Number(e.target.value))}
                        className="role-select"
                        disabled={updateLoading}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`role-badge role-${userItem.role.toLowerCase()}`}>
                        {userItem.role}
                      </span>
                    )}
                  </td>
                  <td>{isEditing ? editedRoleId : userItem.roleId}</td>
                  <td>
                    {isEditing ? (
                      <button
                        onClick={handleBlockToggle}
                        className={`btn-block-toggle ${editedIsBlocked ? 'blocked' : 'active'}`}
                        disabled={updateLoading}
                        title={editedIsBlocked ? 'Click to unblock' : 'Click to block'}
                      >
                        {editedIsBlocked ? '🔒 Blocked' : '✓ Active'}
                      </button>
                    ) : (
                      <span className={`status-badge ${userItem.isBlocked ? 'blocked' : 'active'}`}>
                        {userItem.isBlocked ? '🔒 Blocked' : '✓ Active'}
                      </span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {isEditing ? (
                      <div className="action-buttons">
                        <button
                          onClick={handleSave}
                          className="btn-save"
                          disabled={updateLoading}
                          title="Save changes"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn-cancel"
                          disabled={updateLoading}
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(userItem.id, userItem.roleId, userItem.isBlocked)}
                        className="btn-edit"
                        disabled={editingUserId !== null}
                        title="Edit role"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="no-data">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UserRoleManagement;

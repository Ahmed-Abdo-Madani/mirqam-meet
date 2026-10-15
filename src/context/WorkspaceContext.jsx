import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('direction'); // 'direction', 'tasks', 'sales', 'meet', 'team'

  // Fetch workspace data
  const fetchWorkspace = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/workspace');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setWorkspace(data);
      setError(null);
    } catch (err) {
      console.error('Failed fetching workspace data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Socket listener for live updates across tabs/users
  useEffect(() => {
    fetchWorkspace();

    const socket = io('/', { transports: ['websocket', 'polling'] });
    socket.on('workspace-updated', (updatedData) => {
      if (updatedData) {
        setWorkspace(updatedData);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchWorkspace]);

  // Update direction / strategic target
  const updateDirection = async ({ directionAr, directionEn, targetCustomers }) => {
    try {
      const res = await fetch('/api/workspace/direction', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directionAr, directionEn, targetCustomers })
      });
      if (!res.ok) throw new Error('Failed to update direction');
      const updated = await res.json();
      setWorkspace(updated);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  // Tasks actions
  const createTask = async (taskData) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) throw new Error('Failed to create task');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true, task: data.newTask };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update task');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  // Sales actions
  const createSale = async (saleData) => {
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData)
      });
      if (!res.ok) throw new Error('Failed to record sale');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true, sale: data.newSale };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const updateSale = async (saleId, updates) => {
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Failed to update sale');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  const deleteSale = async (saleId) => {
    try {
      const res = await fetch(`/api/sales/${saleId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete sale');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  // Team action
  const addTeamMember = async (memberData) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });
      if (!res.ok) throw new Error('Failed to add team member');
      const data = await res.json();
      if (data.workspace) setWorkspace(data.workspace);
      return { success: true, member: data.newMember };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.message };
    }
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspace,
        loading,
        error,
        activeTab,
        setActiveTab,
        fetchWorkspace,
        updateDirection,
        createTask,
        updateTask,
        deleteTask,
        createSale,
        updateSale,
        deleteSale,
        addTeamMember
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

/**
 * Vanilla JavaScript To-Do Application
 * Features: CRUD, Filters, Inline Editing, LocalStorage Persistence, Dark/Light Mode
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY_TODOS = 'vanilla_todo_items_v1';
  const STORAGE_KEY_THEME = 'vanilla_todo_theme_v1';

  // --- State ---
  let todos = [];
  let currentFilter = 'all'; // 'all' | 'active' | 'completed'
  let editingId = null;

  // --- DOM Elements ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const emptyState = document.getElementById('empty-state');
  const emptyText = document.getElementById('empty-text');
  const itemsCounter = document.getElementById('items-counter');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');

  // --- Storage Helper Functions ---
  function loadTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_TODOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to parse todos from localStorage:', error);
      return [];
    }
  }

  function saveTodos() {
    try {
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
    } catch (error) {
      console.error('Failed to save todos to localStorage:', error);
    }
  }

  // --- Utility Functions ---
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Theme Management ---
  function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  }

  // --- Todo Actions ---
  function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const newTodo = {
      id: generateId(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    todos.unshift(newTodo);
    saveTodos();
    render();
  }

  function toggleTodo(id) {
    todos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    saveTodos();
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    if (editingId === id) editingId = null;
    saveTodos();
    render();
  }

  function startEditing(id) {
    editingId = id;
    render();
    const editInput = document.getElementById(`edit-input-${id}`);
    if (editInput) {
      editInput.focus();
      // Place cursor at the end
      const len = editInput.value.length;
      editInput.setSelectionRange(len, len);
    }
  }

  function commitEdit(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      // If user clears the text entirely, remove the task
      deleteTodo(id);
    } else {
      todos = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, text: trimmed };
        }
        return todo;
      });
      editingId = null;
      saveTodos();
      render();
    }
  }

  function cancelEdit() {
    editingId = null;
    render();
  }

  function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
    render();
  }

  function setFilter(filter) {
    currentFilter = filter;
    filterBtns.forEach(btn => {
      const isActive = btn.getAttribute('data-filter') === filter;
      if (isActive) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });
    render();
  }

  // --- Render Function ---
  function render() {
    // 1. Filter tasks
    const filteredTodos = todos.filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });

    // 2. Render List Items
    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
      const isEditing = editingId === todo.id;
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      if (isEditing) {
        li.innerHTML = `
          <input 
            type="text" 
            id="edit-input-${todo.id}" 
            class="edit-input" 
            value="${escapeHtml(todo.text)}"
            aria-label="Edit task title"
            maxlength="200"
          >
          <div class="item-actions">
            <button class="action-btn save" title="Save" aria-label="Save">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>
        `;

        const editInput = li.querySelector('.edit-input');
        const saveBtn = li.querySelector('.save');

        function handleSave() {
          commitEdit(todo.id, editInput.value);
        }

        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
          } else if (e.key === 'Escape') {
            cancelEdit();
          }
        });

        editInput.addEventListener('blur', (e) => {
          // Avoid conflict if clicking save button
          setTimeout(() => {
            if (editingId === todo.id) {
              handleSave();
            }
          }, 150);
        });

        saveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleSave();
        });

      } else {
        li.innerHTML = `
          <div class="item-left">
            <label class="checkbox-container">
              <input type="checkbox" ${todo.completed ? 'checked' : ''} aria-label="Mark task as complete">
              <span class="checkmark"></span>
            </label>
            <span class="todo-text" title="Double click to edit">${escapeHtml(todo.text)}</span>
          </div>
          <div class="item-actions">
            <button class="action-btn edit" title="Edit task" aria-label="Edit task">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </button>
            <button class="action-btn delete" title="Delete task" aria-label="Delete task">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        `;

        // Checkbox toggle
        const checkbox = li.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        // Double click text to edit
        const textSpan = li.querySelector('.todo-text');
        textSpan.addEventListener('dblclick', () => startEditing(todo.id));

        // Edit button
        const editBtn = li.querySelector('.action-btn.edit');
        editBtn.addEventListener('click', () => startEditing(todo.id));

        // Delete button
        const deleteBtn = li.querySelector('.action-btn.delete');
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
      }

      todoList.appendChild(li);
    });

    // 3. Handle Empty State
    if (filteredTodos.length === 0) {
      emptyState.style.display = 'flex';
      if (todos.length === 0) {
        emptyText.textContent = 'No tasks yet. Add one above to get started!';
      } else if (currentFilter === 'active') {
        emptyText.textContent = 'No active tasks! You are all caught up.';
      } else if (currentFilter === 'completed') {
        emptyText.textContent = 'No completed tasks yet.';
      }
    } else {
      emptyState.style.display = 'none';
    }

    // 4. Update Remaining Items Counter
    const activeCount = todos.filter(t => !t.completed).length;
    itemsCounter.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;

    // 5. Update Clear Completed Button Visibility
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount > 0) {
      clearCompletedBtn.style.display = 'inline-block';
    } else {
      clearCompletedBtn.style.display = 'none';
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Form submit for adding new item
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addTodo(todoInput.value);
      todoInput.value = '';
      todoInput.focus();
    });

    // Filter button clicks
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Clear completed button click
    clearCompletedBtn.addEventListener('click', clearCompleted);

    // Theme toggle button click
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // --- Initialization ---
  function init() {
    initTheme();
    todos = loadTodos();
    setupEventListeners();
    render();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

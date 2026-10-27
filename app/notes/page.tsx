
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  title: string;
  description: string;
};

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("neonUser");

    if (!user) {
      router.replace("/");
      return;
    }

    setUserEmail(user);

    try {
      const saved = localStorage.getItem("neonNotes");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setNotes(parsed);
        }
      }
    } catch {
      setNotes([]);
    }

    setReady(true);
  }, [router]);

  useEffect(() => {
    if (ready) {
      localStorage.setItem("neonNotes", JSON.stringify(notes));
    }
  }, [notes, ready]);

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Please enter both a title and description.");
      return;
    }

    if (editingId !== null) {
      setNotes((current) =>
        current.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                description: description.trim(),
              }
            : note
        )
      );
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
      };

      setNotes((current) => [newNote, ...current]);
    }

    setTitle("");
    setDescription("");
  }

  function handleEdit(note: Note) {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note.id);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDelete(id: number) {
    setNotes((current) => current.filter((note) => note.id !== id));

    if (editingId === id) {
      cancelEdit();
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setError("");
  }

  function handleLogout() {
    localStorage.removeItem("neonUser");
    router.replace("/");
  }

  if (!ready) {
    return <main className="loading">Preparing your space...</main>;
  }

  return (
    <main className="notes-page">
      <header className="topbar">
        <a className="brand" href="/notes">
          N<span>.</span> NEON NOTES
        </a>

        <div className="topbar-right">
          <span className="user-email">{userEmail}</span>
          <button className="logout-button" onClick={handleLogout}>
            ↗ Logout
          </button>
        </div>
      </header>

      <section className="notes-content">
        <p className="eyebrow">YOUR PERSONAL SPACE</p>
        <h1>Your thoughts, <span>your universe.</span></h1>
        <p className="subtitle">
          Capture the little things before they fade away.
        </p>

        <section className="editor">
          <h2>{editingId !== null ? "Edit your note" : "Create a note"} <span>✦</span></h2>

          <form onSubmit={handleSave}>
            <label htmlFor="note-title">NOTE TITLE</label>
            <input
              id="note-title"
              placeholder="Give your thought a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="note-description">DESCRIPTION</label>
            <textarea
              id="note-description"
              placeholder="Let your thoughts flow..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="form-actions">
              <button className="neon-button" type="submit">
                {editingId !== null ? "Save changes ↗" : "+ Add note"}
              </button>

              {editingId !== null && (
                <button
                  className="cancel-button"
                  type="button"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>

            {error && (
              <p className="error-message" role="alert">
                ✦ {error}
              </p>
            )}
          </form>
        </section>

        <div className="notes-heading">
          <div>
            <p className="eyebrow">Notes Collections</p>
            <h2>Saved notes <span>({notes.length})</span></h2>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✧</div>
            <h3>Nothing here yet.</h3>
            <p>Your next great thought starts with a note.</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.map((note) => (
              <article className="note-card" key={note.id}>
                <div className="note-symbol">✦</div>
                <h3>{note.title}</h3>
                <p className="note-description">{note.description}</p>

                <div className="note-actions">
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(note)}
                  >
                    ✎ Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(note.id)}
                  >
                    × Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        <footer className="notes-footer">
          MADE FOR YOUR MIND <span>✦</span> KEEP CREATING
        </footer>
      </section>
    </main>
  );
}


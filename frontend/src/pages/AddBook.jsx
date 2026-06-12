import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import { useAuth } from "../context/AuthContext";
import { addBook } from "../api/books";
import { notify } from "../lib/toast";

// =========================================================================
//  Add Book — list a book from your shelf
// =========================================================================
const CONDITIONS = ["New", "Like New", "Good", "Fair", "Worn"];

export default function AddBook() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", author: "", edition: "", genre: "", conditionType: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author) return notify.error("Title and author are required");

    setLoading(true);
    try {
      await addBook(userId, form);
      notify.success("Book added to your shelf!");
      navigate("/my-books");
    } catch {
      notify.error("Could not add the book");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeIn>
      <div className="page-header">
        <h1 style={{ marginBottom: 8 }}>Add a book</h1>
        <p>Share a book from your shelf for others to borrow or swap.</p>
      </div>

      <Card style={{ maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <Input label="Title *" placeholder="The Pragmatic Programmer" value={form.title} onChange={set("title")} autoFocus />
          <Input label="Author *" placeholder="Andrew Hunt" value={form.author} onChange={set("author")} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Input label="Edition" placeholder="2nd" value={form.edition} onChange={set("edition")} />
            <Input label="Genre" placeholder="Technology" value={form.genre} onChange={set("genre")} />
          </div>

          <div className="field">
            <label className="label">Condition</label>
            <select className="input" value={form.conditionType} onChange={set("conditionType")}>
              <option value="">Select condition…</option>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Button type="submit" block disabled={loading} className="btn-primary" style={{ marginTop: 8 }}>
            {loading ? "Adding…" : <><FiPlusCircle /> Add book</>}
          </Button>
        </form>
      </Card>
    </FadeIn>
  );
}

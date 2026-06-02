"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import announcementApi from "@/app/api/announcement/api";
import { AnnouncementDto } from "@/app/api/announcement/types";

type Props = {
  token?: string;
};

type FormState = {
  title: string;
  content: string;
  category: string;
  active: boolean;
};

const emptyForm: FormState = {
  title: "",
  content: "",
  category: "",
  active: true,
};

export default function MidwifeAnnouncementPanel({ token: propToken }: Props) {
  const [token, setToken] = useState<string>(propToken ?? "");
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const formRef = useRef<HTMLDivElement | null>(null);

  const loadAnnouncements = useCallback(async (authToken: string) => {
    if (!authToken) return;

    try {
      setLoading(true);
      const data = await announcementApi.getAllAnnouncements(authToken);
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to load announcements", error);
      alert("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialize = async () => {
      try {
        if (typeof propToken === "string" && propToken.trim()) {
          setToken(propToken);
          await loadAnnouncements(propToken);
          return;
        }

        const { getSession } = await import("@/lib/authentication");
        const session = await getSession();
        const authToken = session?.user?.token ?? "";

        if (!authToken) {
          alert("No auth token found. Please log in again.");
          return;
        }

        setToken(authToken);
        await loadAnnouncements(authToken);
      } catch (error) {
        console.error("Failed to initialize announcements page", error);
        alert("No auth token found. Please log in again.");
      }
    };

    void initialize();
  }, [propToken, loadAnnouncements]);

  const scrollToForm = () => {
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleAddNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    scrollToForm();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "active") {
      setForm((prev) => ({
        ...prev,
        active: value === "true",
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("No auth token found. Please log in again.");
      return;
    }

    if (!form.title.trim() || !form.content.trim() || !form.category.trim()) {
      alert("Title, content, and category are required.");
      return;
    }

    const payload: AnnouncementDto = {
      announcementId: editingId ?? 0,
      title: form.title.trim(),
      content: form.content.trim(),
      category: form.category.trim(),
      createdAt: new Date().toISOString(),
      active: form.active,
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await announcementApi.updateAnnouncement(token, editingId, payload);
      } else {
        await announcementApi.createAnnouncement(token, payload);
      }

      resetForm();
      await loadAnnouncements(token);
    } catch (error) {
      console.error("Failed to save announcement", error);
      alert("Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement: AnnouncementDto) => {
    setEditingId(announcement.announcementId);
    setForm({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      active: announcement.active,
    });
    setShowForm(true);
    scrollToForm();
  };

  const handleDelete = async (id: number) => {
    if (!token) {
      alert("No auth token found. Please log in again.");
      return;
    }

    const confirmed = confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      await announcementApi.deleteAnnouncement(token, id);
      await loadAnnouncements(token);
    } catch (error) {
      console.error("Failed to delete announcement", error);
      alert("Failed to delete announcement");
    }
  };

  return (
    <main className="min-h-screen bg-black px-6 py-6 text-white overflow-hidden">
      <div className="mx-auto max-w-7xl overflow-hidden">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-md font-bold">Midwife Announcements</h1>
            <p className="mt-2 text-xs text-gray-400">
              Create, update, view, and delete announcements.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddNew}
            className="rounded-lg bg-[#d04f51] px-5 py-2 font-semibold text-white hover:bg-[#d43d40]"
          >
            Add New
          </button>
        </div>

        {showForm && (
          <section
            ref={formRef}
            className="mb-8 rounded-2xl border border-gray-800 bg-zinc-950 p-6 shadow-xl"
          >
            <h2 className="mb-3 text-md font-semibold">
              {editingId ? "Update Announcement" : "Add Announcement"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-2 lg:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                  className="w-full rounded-lg border border-gray-700 bg-black text-xs px-4 py-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Category
                </label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Example: Health, Clinic, Emergency"
                  className="w-full rounded-xl border border-gray-700 bg-black text-xs px-4 py-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm text-gray-300">
                  Content
                </label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Write announcement details..."
                  className="w-full resize-none rounded-xl border border-gray-700 bg-black text-xs px-4 py-3 text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Status
                </label>
                <select
                  name="active"
                  value={String(form.active)}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-700 bg-black text-xs px-4 py-3 text-white outline-none focus:border-purple-500"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="flex items-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-lg bg-[#d04f51] px-4 py-2 font-semibold text-white hover:bg-[#d43d40] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : editingId ? "Update" : "Add"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-700 px-4 py-2 font-semibold text-gray-300 hover:bg-gray-900"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-lg border border-gray-800 bg-zinc-950 pt-4 pb-4 pl-6 pr-6 shadow-xl overflow-hidden">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-md font-semibold">All Announcements</h2>
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs text-gray-300">
              {announcements.length} total
            </span>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-700 p-8 text-center text-gray-400">
              No announcements found.
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <article
                  key={announcement.announcementId}
                  className="rounded-xl border border-gray-800 bg-black p-5"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {announcement.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {announcement.category}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        announcement.active
                          ? "bg-green-900/60 text-green-300"
                          : "bg-red-900/60 text-red-300"
                      }`}
                    >
                      {announcement.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="mb-3 whitespace-pre-line text-xs text-gray-300">
                    {announcement.content}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-800 pt-2">
                    <p className="text-xs text-gray-500">
                      Created:{" "}
                      {announcement.createdAt
                        ? new Date(announcement.createdAt).toLocaleString()
                        : "N/A"}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(announcement)}
                        className="rounded-lg bg-blue-600 px-4 py-1 text-xs font-semibold hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(announcement.announcementId)
                        }
                        className="rounded-lg bg-red-600 px-4 py-1 text-xs font-semibold hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
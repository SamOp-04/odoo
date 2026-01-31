'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Setting {
  _id: string;
  key: string;
  value: any;
  data_type: 'string' | 'number' | 'boolean' | 'json';
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load settings');
        const data = await res.json();
        setSettings(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const updateSetting = async (setting: Setting) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setSaving(setting.key);

      const res = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          key: setting.key,
          value: setting.value,
          data_type: setting.data_type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save setting');
    } finally {
      setSaving(null);
    }
  };

  const renderInput = (setting: Setting) => {
    switch (setting.data_type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={Boolean(setting.value)}
            onChange={(e) =>
              setSettings((prev) =>
                prev.map((s) =>
                  s.key === setting.key
                    ? { ...s, value: e.target.checked }
                    : s
                )
              )
            }
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="border rounded px-2 py-1 w-32"
            value={setting.value}
            onChange={(e) =>
              setSettings((prev) =>
                prev.map((s) =>
                  s.key === setting.key
                    ? { ...s, value: Number(e.target.value) }
                    : s
                )
              )
            }
          />
        );

      case 'json':
        return (
          <textarea
            className="border rounded px-2 py-1 w-full text-xs"
            rows={3}
            value={JSON.stringify(setting.value, null, 2)}
            onChange={(e) =>
              setSettings((prev) =>
                prev.map((s) =>
                  s.key === setting.key
                    ? { ...s, value: JSON.parse(e.target.value) }
                    : s
                )
              )
            }
          />
        );

      default:
        return (
          <input
            type="text"
            className="border rounded px-2 py-1 w-full"
            value={setting.value}
            onChange={(e) =>
              setSettings((prev) =>
                prev.map((s) =>
                  s.key === setting.key
                    ? { ...s, value: e.target.value }
                    : s
                )
              )
            }
          />
        );
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings…</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">System Settings</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border text-left">Key</th>
              <th className="p-2 border text-left">Value</th>
              <th className="p-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting._id} className="hover:bg-gray-50">
                <td className="p-2 border font-mono text-xs">
                  {setting.key}
                </td>
                <td className="p-2 border">
                  {renderInput(setting)}
                </td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => updateSetting(setting)}
                    disabled={saving === setting.key}
                    className="px-3 py-1 bg-black text-white rounded text-xs disabled:opacity-50"
                  >
                    {saving === setting.key ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}

            {settings.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  No settings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

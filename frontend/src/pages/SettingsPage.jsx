import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { deleteAccount } = useAuthStore();

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text-primary">Theme</h2>
          <p className="text-sm text-text-secondary">Choose your preferred theme</p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-bg-primary shadow-lg">
          <div className="p-4 bg-bg-secondary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Theme Mode</h3>
                  <p className="text-sm text-text-secondary">Select light or dark theme</p>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="light">Professional Light</option>
                  <option value="luxury">Night Mode (Optional)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-text-primary">Account</h2>
          <p className="text-sm text-text-secondary">Manage your account settings</p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-bg-primary shadow-lg">
          <div className="p-4 bg-bg-secondary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-text-primary">Delete Account</h3>
                  <p className="text-sm text-text-secondary">Permanently delete your account and all associated data</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      deleteAccount();
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

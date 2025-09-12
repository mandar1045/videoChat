import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const { users, createGroup } = useChatStore();
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [profilePic, setProfilePic] = useState("");

  const handleMemberToggle = (userId) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length === 0) return;
    createGroup({ name: groupName, members: selectedMembers, profilePic });
    setGroupName("");
    setSelectedMembers([]);
    setProfilePic("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-bg-primary p-6 rounded-lg shadow-lg w-full max-w-md border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Create Group</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary p-2 rounded-full hover:bg-bg-tertiary">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-text-primary">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter group name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-text-primary">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-bg-primary hover:file:bg-primary-dark"
            />
            {profilePic && (
              <img
                src={profilePic}
                alt="Preview"
                className="mt-2 w-16 h-16 object-cover rounded-full"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-text-primary">Select Members</label>
            <div className="max-h-40 overflow-y-auto">
              {users.map((user) => (
                <label key={user._id} className="flex items-center gap-2 mb-2 text-text-primary">
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => handleMemberToggle(user._id)}
                    className="w-4 h-4 text-primary bg-bg-tertiary border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <span>{user.fullName}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-bg-primary rounded-lg hover:bg-primary-dark transition-colors">
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;